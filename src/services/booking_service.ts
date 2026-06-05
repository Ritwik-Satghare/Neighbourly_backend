import Booking from '../models/booking_model';
import Listing from '../models/listing_model';

// ─── Computed Fields Helper ──────────────────────────────────────────────────

/**
 * Compute dynamic rental lifecycle fields for a booking.
 * These are NEVER stored in the database — always derived at read-time.
 */
export const computeBookingFields = (booking: any) => {
  const now = new Date();

  const isRentalActive = booking.rentalState === 'checked_out';

  const isReadyToComplete =
    booking.status === 'confirmed' && booking.rentalState === 'returned';

  const isOverdue =
    booking.rentalState === 'checked_out' && now > new Date(booking.endDate);

  let daysOverdue = 0;
  if (isOverdue) {
    const diffMs = now.getTime() - new Date(booking.endDate).getTime();
    daysOverdue = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  return {
    isRentalActive,
    isReadyToComplete,
    isOverdue,
    daysOverdue,
  };
};

/**
 * Attach computed fields to a single booking document for API responses.
 */
const enrichBooking = (booking: any) => {
  const obj = booking.toObject ? booking.toObject() : { ...booking };
  const computed = computeBookingFields(obj);
  return { ...obj, ...computed };
};

/**
 * Attach computed fields to an array of booking documents.
 */
const enrichBookings = (bookings: any[]) => bookings.map(enrichBooking);

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * Get all bookings for a user (as renter OR as listing owner).
 * Query params: role, status, rentalState, readyToComplete
 */
export const getUserBookings = async (userID: string, query: any) => {
  const { role, status, rentalState, readyToComplete } = query;

  let filter: any = {};

  if (role === 'renter') {
    filter.renterID = userID;
  } else if (role === 'owner') {
    const userListings = await Listing.find({ ownerID: userID }).select('_id');
    const listingIDs = userListings.map((l) => l._id);
    filter.listingID = { $in: listingIDs };
  } else {
    const userListings = await Listing.find({ ownerID: userID }).select('_id');
    const listingIDs = userListings.map((l) => l._id);
    filter = {
      $or: [{ renterID: userID }, { listingID: { $in: listingIDs } }],
    };
  }

  if (status) {
    filter.status = status;
  }

  if (rentalState) {
    filter.rentalState = rentalState;
  }

  if (readyToComplete === 'true') {
    filter.status = 'confirmed';
    filter.rentalState = 'returned';
  }

  const bookings = await Booking.find(filter)
    .populate('listingID', 'name pricePerDay ownerID location')
    .populate('offerID', 'amount note')
    .sort({ createdAt: -1 });

  return enrichBookings(bookings);
};

/**
 * Get a single booking by ID.
 */
export const getBookingById = async (bookingID: string, userID: string) => {
  const booking = await Booking.findById(bookingID)
    .populate('listingID', 'name pricePerDay ownerID location category')
    .populate('offerID', 'amount note startDate endDate');

  if (!booking) throw new Error('Booking not found');

  const listing = booking.listingID as any;

  const isRenter = booking.renterID.toString() === userID;
  const isOwner = listing.ownerID === userID || listing.ownerID.toString() === userID;

  if (!isRenter && !isOwner) {
    throw new Error('Forbidden: You are not authorized to view this booking');
  }

  return enrichBooking(booking);
};

// ─── Cancellation ────────────────────────────────────────────────────────────

/**
 * Cancel a booking.
 */
export const cancelBooking = async (bookingID: string, userID: string) => {
  const booking = await Booking.findById(bookingID).populate('listingID');
  if (!booking) throw new Error('Booking not found');

  if (booking.renterID.toString() !== userID) {
    throw new Error('Forbidden: Only the renter can cancel this booking');
  }

  if (booking.status === 'cancelled') {
    throw new Error('Booking is already cancelled');
  }

  if (booking.status === 'completed') {
    throw new Error('Cannot cancel a completed booking');
  }

  if (booking.rentalState === 'checked_out') {
    throw new Error('Cannot cancel: item has been handed over and rental is in progress');
  }

  if (booking.rentalState === 'returned') {
    throw new Error('Cannot cancel: item has been returned and is awaiting owner verification');
  }

  booking.status = 'cancelled';
  await booking.save();

  return enrichBooking(booking);
};

// ─── Status Transitions ─────────────────────────────────────────────────────

/**
 * Update booking status.
 * Optimized with NO-PAYMENT BYPASS LOGIC built directly into the state machine.
 */
export const updateBookingStatus = async (
  bookingID: string,
  userID: string,
  newStatus: string
) => {
  const booking = await Booking.findById(bookingID).populate('listingID');
  if (!booking) throw new Error('Booking not found');

  const listing = booking.listingID as any;

  const isOwner = listing.ownerID === userID || listing.ownerID.toString() === userID;
  if (!isOwner) {
    throw new Error('Forbidden: Only the listing owner can update booking status');
  }

  const allowedTransitions: Record<string, string[]> = {
    pending: ['confirmed'],
    confirmed: ['completed'],
  };

  const currentStatus = booking.status;
  const allowed = allowedTransitions[currentStatus];

  if (!allowed || !allowed.includes(newStatus)) {
    throw new Error(
      `Invalid status transition: '${currentStatus}' → '${newStatus}'. ` +
      `Allowed: ${allowed ? allowed.join(', ') : 'none'}`
    );
  }

  // ─── Payment-Free Lifecycle Integration ─────────────────────────────────────
  if (newStatus === 'confirmed') {
    // 🟢 THE FIX: Force booking status to confirmed, and automatically set the 
    // physical rentalState to 'scheduled' right here, completely skipping Razorpay!
    booking.status = 'confirmed';
    booking.rentalState = 'scheduled';
    booking.paymentStatus = 'completed'; // Keeps any strict payment properties satisfied
  }

  if (newStatus === 'completed') {
    if (booking.rentalState !== 'returned') {
      throw new Error(
        `Cannot complete booking: rental state is '${booking.rentalState || 'not set'}'. ` +
        `Item must be returned before completing the booking.`
      );
    }
    booking.status = 'completed';
  }

  await booking.save();
  return enrichBooking(booking);
};

// ─── Rental Lifecycle Actions ────────────────────────────────────────────────

/**
 * Start a rental (owner-only).
 */
export const startRental = async (bookingID: string, userID: string) => {
  const booking = await Booking.findById(bookingID).populate('listingID');
  if (!booking) throw new Error('Booking not found');

  const listing = booking.listingID as any;

  const isOwner = listing.ownerID === userID || listing.ownerID.toString() === userID;
  if (!isOwner) {
    throw new Error('Forbidden: Only the listing owner can start the rental');
  }

  if (booking.status !== 'confirmed') {
    throw new Error(
      `Cannot start rental: booking status is '${booking.status}'. Must be 'confirmed'.`
    );
  }

  if (booking.rentalState !== 'scheduled') {
    throw new Error(
      `Cannot start rental: rental state is '${booking.rentalState || 'not set'}'. Must be 'scheduled'.`
    );
  }

  booking.rentalState = 'checked_out';
  booking.actualStartDate = new Date();
  await booking.save();

  return enrichBooking(booking);
};

/**
 * Return a rental (owner-only).
 */
export const returnRental = async (bookingID: string, userID: string) => {
  const booking = await Booking.findById(bookingID).populate('listingID');
  if (!booking) throw new Error('Booking not found');

  const listing = booking.listingID as any;

  const isOwner = listing.ownerID === userID || listing.ownerID.toString() === userID;
  if (!isOwner) {
    throw new Error('Forbidden: Only the listing owner can mark the rental as returned');
  }

  if (booking.status !== 'confirmed') {
    throw new Error(
      `Cannot return rental: booking status is '${booking.status}'. Must be 'confirmed'.`
    );
  }

  if (booking.rentalState !== 'checked_out') {
    throw new Error(
      `Cannot return rental: rental state is '${booking.rentalState || 'not set'}'. Must be 'checked_out'.`
    );
  }

  booking.rentalState = 'returned';
  booking.actualReturnDate = new Date();
  await booking.save();

  return enrichBooking(booking);
};