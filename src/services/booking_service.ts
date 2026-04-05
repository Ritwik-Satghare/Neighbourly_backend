import Booking from '../models/booking_model';
import Listing from '../models/listing_model';

/**
 * Get all bookings for a user (as renter OR as listing owner).
 */
export const getUserBookings = async (userID: string, query: any) => {
  const { role, status } = query;

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

  const bookings = await Booking.find(filter)
    .populate('listingID', 'name pricePerDay ownerID location')
    .populate('offerID', 'amount note')
    .sort({ createdAt: -1 });

  return bookings;
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

  return booking;
};

/**
 * Cancel a booking.
 * Only the renter can cancel, and only if status is 'pending' or 'confirmed'.
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

  booking.status = 'cancelled';
  await booking.save();

  return booking;
};

/**
 * Update booking status.
 * Only the listing owner can update status (confirm / complete).
 * Valid transitions:
 *   pending → confirmed
 *   confirmed → completed
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

  booking.status = newStatus as any;
  await booking.save();

  return booking;
};
