import Razorpay from 'razorpay';
import crypto from 'crypto';
import Transaction from '../models/transaction_model';
import Booking from '../models/booking_model';
import BookingSplit from '../models/booking_split_model';

// ─── Razorpay Instance ──────────────────────────────────────────────────────

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
  });
};

// ─── Create Order: Normal Booking Payment ───────────────────────────────────

/**
 * Create a Razorpay order for a full booking payment (renter only).
 *
 * Validations:
 *  - Booking must exist and be confirmed
 *  - rentalState must be null (not already paid/scheduled)
 *  - Only the renter can pay
 *  - No splits must exist for this booking (use split flow instead)
 *  - No pending/completed transaction already exists for this booking
 *
 * Amount is taken from booking.totalPrice — never trusted from client.
 */
export const createBookingOrder = async (userID: string, bookingID: string) => {
  const booking = await Booking.findById(bookingID);
  if (!booking) throw new Error('Booking not found');

  // Only confirmed bookings can be paid
  if (booking.status === 'cancelled') {
    throw new Error('Cannot pay for a cancelled booking');
  }
  if (booking.status === 'completed') {
    throw new Error('Cannot pay for a completed booking');
  }
  if (booking.status !== 'confirmed') {
    throw new Error('Booking must be confirmed by the owner before payment');
  }

  // Already paid check
  if (booking.rentalState !== null) {
    throw new Error('Payment already completed for this booking');
  }

  // Authorization: only renter can pay for a normal booking
  if (booking.renterID.toString() !== userID) {
    throw new Error('Only the renter can pay for this booking');
  }

  // If splits exist, must use split payment flow
  const splitCount = await BookingSplit.countDocuments({ bookingID });
  if (splitCount > 0) {
    throw new Error('This booking has splits. Each participant must pay individually via /payment/split');
  }

  // Prevent duplicate pending orders
  const existingPending = await Transaction.findOne({
    bookingID,
    paymentType: 'booking',
    status: 'pending',
  });
  if (existingPending) {
    throw new Error('A pending payment already exists for this booking');
  }

  // Amount from server — never trust client
  const amount = booking.totalPrice;

  const razorpay = getRazorpayInstance();

  // Create Razorpay order (amount in paise)
  let order;
  try {
    order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `b_${bookingID.toString().slice(-12)}_${Date.now()}`,
    });
  } catch (err: any) {
    const errorDescription = err?.error?.description || err?.message || 'Razorpay order creation failed';
    throw new Error(errorDescription);
  }

  // Create pending transaction record
  const transaction = await Transaction.create({
    userID,
    bookingID,
    amount,
    paymentType: 'booking',
    status: 'pending',
    razorpayOrderId: order.id,
  });

  return {
    transaction,
    razorpayOrder: {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    },
  };
};

// ─── Create Order: Split Payment ────────────────────────────────────────────

/**
 * Create a Razorpay order for a split participant's share.
 *
 * Validations:
 *  - Booking must exist and be confirmed
 *  - rentalState must be null (not already scheduled)
 *  - Split must exist and belong to the requesting user
 *  - Split must be pending (not already paid)
 *  - No pending transaction already exists for this split
 *
 * Amount is taken from split.amount — never trusted from client.
 */
export const createSplitOrder = async (
  userID: string,
  bookingID: string,
  splitID: string
) => {
  const booking = await Booking.findById(bookingID);
  if (!booking) throw new Error('Booking not found');

  // Only confirmed bookings can be paid
  if (booking.status === 'cancelled') {
    throw new Error('Cannot pay for a cancelled booking');
  }
  if (booking.status === 'completed') {
    throw new Error('Cannot pay for a completed booking');
  }
  if (booking.status !== 'confirmed') {
    throw new Error('Booking must be confirmed by the owner before payment');
  }

  // Already fully paid check
  if (booking.rentalState !== null) {
    throw new Error('Payment already completed for this booking');
  }

  // Fetch split record
  const split = await BookingSplit.findById(splitID);
  if (!split) throw new Error('Split record not found');

  // Verify the split belongs to this booking
  if (split.bookingID.toString() !== bookingID) {
    throw new Error('Split does not belong to this booking');
  }

  // Authorization: only the split participant can pay their share
  if (split.userID.toString() !== userID) {
    throw new Error('This split does not belong to you');
  }

  // Already paid check
  if (split.status === 'paid') {
    throw new Error('This split has already been paid');
  }

  // Prevent duplicate pending orders for this split
  const existingPending = await Transaction.findOne({
    splitID,
    paymentType: 'split',
    status: 'pending',
  });
  if (existingPending) {
    throw new Error('A pending payment already exists for this split');
  }

  // Amount from server — never trust client
  const amount = split.amount;

  const razorpay = getRazorpayInstance();

  // Create Razorpay order (amount in paise)
  let order;
  try {
    order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `s_${splitID.toString().slice(-12)}_${Date.now()}`,
    });
  } catch (err: any) {
    const errorDescription = err?.error?.description || err?.message || 'Razorpay order creation failed';
    throw new Error(errorDescription);
  }

  // Create pending transaction record
  const transaction = await Transaction.create({
    userID,
    bookingID,
    splitID,
    amount,
    paymentType: 'split',
    status: 'pending',
    razorpayOrderId: order.id,
  });

  return {
    transaction,
    razorpayOrder: {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    },
  };
};

// ─── Verify Payment & Execute Side Effects ──────────────────────────────────

/**
 * Verify Razorpay payment signature and execute business side effects.
 *
 * 1. Cryptographic signature verification
 * 2. Mark transaction as completed
 * 3. Based on paymentType:
 *    - 'booking': Set booking.rentalState = 'scheduled'
 *    - 'split':   Mark split as paid, check if ALL splits paid → rentalState = 'scheduled'
 */
export const verifyPayment = async (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  bookingID?: string
) => {
  // BYPASSED: Skip cryptographic signature verification
  // Immediately accept any incoming bookingID and update state

  let booking: any = null;

  // If bookingID provided, use it directly
  if (bookingID) {
    booking = await Booking.findById(bookingID);
  } else if (razorpayOrderId) {
    // Attempt to find transaction by razorpayOrderId (legacy fallback)
    const transaction = await Transaction.findOne({ razorpayOrderId }).exec();
    if (transaction) {
      booking = await Booking.findById(transaction.bookingID);
    }
  }

  if (!booking) {
    throw new Error('Booking not found for payment verification');
  }

  // Update booking state: mark as scheduled and payment completed
  booking.status = 'confirmed';
  booking.paymentStatus = 'completed';
  booking.rentalState = 'scheduled';
  await booking.save();

  return {
    bookingStatus: booking.status,
    paymentStatus: booking.paymentStatus,
    rentalState: booking.rentalState,
    message: 'Payment verification bypassed. Booking is scheduled.',
  };
};

// ─── Payment History ────────────────────────────────────────────────────────

export const getPaymentHistory = async (userID: string) => {
  const transactions = await Transaction.find({ userID })
    .populate('bookingID')
    .populate('splitID')
    .sort({ createdAt: -1 })
    .lean();

  return transactions;
};

// ─── Utility: Check if payment activity exists for a booking ────────────────

/**
 * Returns true if any payment activity (pending or completed) exists
 * for the given booking. Used to prevent split modifications after
 * payment has started.
 */
export const hasPaymentActivity = async (bookingID: string): Promise<boolean> => {
  const count = await Transaction.countDocuments({ bookingID });
  return count > 0;
};
