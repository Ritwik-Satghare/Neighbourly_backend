import BookingSplit from '../models/booking_split_model';
import Booking from '../models/booking_model';

/**
 * Create split payments for a booking.
 * 
 * Rules:
 * - Only the renter (booking creator) can create splits
 * - Splits can only be created for a 'pending' booking
 * - Total split amounts MUST equal booking totalPrice
 * - Each user can only appear once in the split
 * - The renter themselves can be included in the split
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

  if (booking.status !== 'pending') {
    throw new Error(`Cannot create splits for a booking with status '${booking.status}'`);
  }

  // Check if splits already exist for this booking
  const existingSplits = await BookingSplit.countDocuments({ bookingID });
  if (existingSplits > 0) {
    throw new Error('Splits already exist for this booking. Delete existing splits first.');
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
    },
  };
};

/**
 * Pay a user's share of the split.
 * 
 * CRITICAL LOGIC:
 * - When ALL splits are paid → booking status is automatically updated to 'confirmed'
 * - This is the core of the split ownership system
 */
export const payShare = async (bookingID: string, userID: string) => {
  const booking = await Booking.findById(bookingID);
  if (!booking) throw new Error('Booking not found');

  if (booking.status === 'cancelled') {
    throw new Error('Cannot pay for a cancelled booking');
  }

  if (booking.status === 'completed') {
    throw new Error('Booking is already completed');
  }

  // Find this user's split record
  const split = await BookingSplit.findOne({ bookingID, userID });
  if (!split) {
    throw new Error('No split payment found for this user on this booking');
  }

  if (split.status === 'paid') {
    throw new Error('You have already paid your share');
  }

  // Mark as paid
  split.status = 'paid';
  split.paidAt = new Date();
  await split.save();

  // Check if ALL splits for this booking are now paid
  const allSplits = await BookingSplit.find({ bookingID });
  const allPaid = allSplits.every((s) => s.status === 'paid');

  if (allPaid) {
    // CRITICAL: Auto-confirm booking when all friends have paid
    booking.status = 'confirmed';
    await booking.save();
  }

  return {
    split,
    allPaid,
    bookingStatus: booking.status,
  };
};
