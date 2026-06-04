import BookingSplit from '../models/booking_split_model';
import Booking from '../models/booking_model';
import { hasPaymentActivity } from './payment_service';

/**
 * Create split payments for a booking.
 * 
 * Rules:
 * - Only the renter (booking creator) can create splits
 * - Splits can only be created for a 'pending' or 'confirmed' booking
 * - Total split amounts MUST equal booking totalPrice
 * - Each user can only appear once in the split
 * - The renter themselves can be included in the split
 * - No payment activity must exist for this booking (once payment starts, splits are locked)
 */
export const createSplit = async (
  bookingID: string,
  userID: string,
  splits: { userID: string; amount: number }[]
) => {
  const booking = await Booking.findById(bookingID);
  if (!booking) throw new Error('Booking not found');

  // Only the renter can create splits
  if (booking.renterID.toString() !== userID) {
    throw new Error('Forbidden: Only the renter can create split payments');
  }

  // Allow split creation for pending or confirmed bookings
  if (booking.status !== 'pending' && booking.status !== 'confirmed') {
    throw new Error(`Cannot create splits for a booking with status '${booking.status}'`);
  }

  // Check if splits already exist for this booking
  const existingSplits = await BookingSplit.countDocuments({ bookingID });
  if (existingSplits > 0) {
    throw new Error('Splits already exist for this booking. Delete existing splits first.');
  }

  // Block split creation if any payment activity exists
  const paymentStarted = await hasPaymentActivity(bookingID);
  if (paymentStarted) {
    throw new Error('Cannot create splits: payment activity already exists for this booking');
  }

  // Validate: no duplicate users
  const userIDs = splits.map((s) => s.userID);
  const uniqueUserIDs = new Set(userIDs);
  if (uniqueUserIDs.size !== userIDs.length) {
    throw new Error('Duplicate users found in split. Each user can only appear once.');
  }

  // Validate: all amounts must be positive
  for (const split of splits) {
    if (split.amount <= 0) {
      throw new Error('Each split amount must be positive');
    }
  }

  // Validate: total split amount must equal booking totalPrice
  const totalSplitAmount = splits.reduce((sum, s) => sum + s.amount, 0);
  // Use a small epsilon for floating point comparison
  if (Math.abs(totalSplitAmount - booking.totalPrice) > 0.01) {
    throw new Error(
      `Total split amount (${totalSplitAmount}) does not match booking price (${booking.totalPrice})`
    );
  }

  // Create all split records
  const splitDocs = splits.map((s) => ({
    bookingID,
    userID: s.userID,
    amount: s.amount,
    status: 'pending' as const,
  }));

  const createdSplits = await BookingSplit.insertMany(splitDocs);

  return createdSplits;
};

/**
 * Get all split payment records for a booking.
 */
export const getSplitsByBooking = async (bookingID: string) => {
  const booking = await Booking.findById(bookingID);
  if (!booking) throw new Error('Booking not found');

  const splits = await BookingSplit.find({ bookingID })
    .populate('userID', 'fullName email')
    .sort({ createdAt: 1 });

  // Calculate summary
  const totalPaid = splits
    .filter((s) => s.status === 'paid')
    .reduce((sum, s) => sum + s.amount, 0);

  const totalPending = splits
    .filter((s) => s.status === 'pending')
    .reduce((sum, s) => sum + s.amount, 0);

  const allPaid = splits.length > 0 && splits.every((s) => s.status === 'paid');

  return {
    splits,
    summary: {
      totalPrice: booking.totalPrice,
      totalPaid,
      totalPending,
      allPaid,
      bookingStatus: booking.status,
      rentalState: booking.rentalState,
    },
  };
};
