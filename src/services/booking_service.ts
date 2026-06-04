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
    // Bookings where the user is the renter
    filter.renterID = userID;
  } else if (role === 'owner') {
    // Bookings where the user owns the listing
    const userListings = await Listing.find({ ownerID: userID }).select('_id');
    const listingIDs = userListings.map((l) => l._id);
    filter.listingID = { $in: listingIDs };
  } else {
    // Both roles
    const userListings = await Listing.find({ ownerID: userID }).select('_id');
    const listingIDs = userListings.map((l) => l._id);
    filter = {
      $or: [{ renterID: userID }, { listingID: { $in: listingIDs } }],
    };
  }

  // Optional status filter
  if (status) {
    filter.status = status;
  }

  // Optional rentalState filter
  if (rentalState) {
    filter.rentalState = rentalState;
  }

  // Owner dashboard filter: bookings ready for completion
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
 * Only accessible by the renter or the listing owner.
 */
export const getBookingById = async (bookingID: string, userID: string) => {
  const booking = await Booking.findById(bookingID)
    .populate('listingID', 'name pricePerDay ownerID location category')
    .populate('offerID', 'amount note startDate endDate');

  if (!booking) throw new Error('Booking not found');

  const listing = booking.listingID as any;

  // Authorization check: only renter or listing owner can view
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
 * Only the renter can cancel.
 *
 * Allowed when:
 *   status = 'pending'
 *   status = 'confirmed' AND rentalState = 'scheduled'
 *
 * Rejected when:
 *   rentalState = 'checked_out' (item is with the renter)
 *   rentalState = 'returned' (awaiting owner verification)
 *   status = 'completed'
 *   status = 'cancelled'
 */
export const cancelBooking = async (bookingID: string, userID: string) => {
  const booking = await Booking.findById(bookingID).populate('listingID');
  if (!booking) throw new Error('Booking not found');

  // Only the renter can cancel
  if (booking.renterID.toString() !== userID) {
    throw new Error('Forbidden: Only the renter can cancel this booking');
  }

  if (booking.status === 'cancelled') {
    throw new Error('Booking is already cancelled');
  }

  if (booking.status === 'completed') {
    throw new Error('Cannot cancel a completed booking');
  }

  // Rental lifecycle cancellation guards
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
 * Only the listing owner can update status (confirm / complete).
 *
 * // ─── Rental Lifecycle ──────────────────────────────────────────────
 * // Tracks the physical rental state, separate from booking status.
 * // null until payment is completed; set to 'scheduled' after payment verification.
 *
 * Valid transitions:
 *   pending → confirmed
 *   confirmed → completed (requires rentalState = 'returned')
 */
export const updateBookingStatus = async (
  bookingID: string,
  userID: string,
  newStatus: string
) => {
  const booking = await Booking.findById(bookingID).populate('listingID');
  if (!booking) throw new Error('Booking not found');

  const listing = booking.listingID as any;

  // Only listing owner can update status
  const isOwner = listing.ownerID === userID || listing.ownerID.toString() === userID;
  if (!isOwner) {
    throw new Error('Forbidden: Only the listing owner can update booking status');
  }

  // Define allowed status transitions
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

  // ─── Lifecycle integration ───────────────────────────────────────
  if (newStatus === 'confirmed') {
    // Owner approval only. rentalState stays null until payment is completed.
    // Payment verification (payment_service.verifyPayment) will set rentalState = 'scheduled'.
  }

  if (newStatus === 'completed') {
    // Completion requires that the item has been returned
    if (booking.rentalState !== 'returned') {
      throw new Error(
        `Cannot complete booking: rental state is '${booking.rentalState || 'not set'}'. ` +
        `Item must be returned before completing the booking.`
      );
    }
  }

  booking.status = newStatus as any;
  await booking.save();

  return enrichBooking(booking);
};

// ─── Rental Lifecycle Actions ────────────────────────────────────────────────

/**
 * Start a rental (owner-only).
 * Marks the item as physically handed over to the renter.
 *
 * Requirements:
 *   status = 'confirmed'
 *   rentalState = 'scheduled'
 *
 * Actions:
 *   rentalState → 'checked_out'
 *   actualStartDate → current timestamp (audit only)
 */
export const startRental = async (bookingID: string, userID: string) => {
  const booking = await Booking.findById(bookingID).populate('listingID');
  if (!booking) throw new Error('Booking not found');

  const listing = booking.listingID as any;

  // Only listing owner can start the rental
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
 * Marks the item as physically returned by the renter.
 *
 * Requirements:
 *   status = 'confirmed'
 *   rentalState = 'checked_out'
 *
 * Actions:
 *   rentalState → 'returned'
 *   actualReturnDate → current timestamp (audit only)
 */
export const returnRental = async (bookingID: string, userID: string) => {
  const booking = await Booking.findById(bookingID).populate('listingID');
  if (!booking) throw new Error('Booking not found');

  const listing = booking.listingID as any;

  // Only listing owner can mark as returned
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
