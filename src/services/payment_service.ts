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
  razorpaySignature: string
) => {
  const secret = process.env.RAZORPAY_KEY_SECRET || '';

  // Step 1: Verify the payment signature
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new Error('Invalid payment signature');
  }

  // Step 2: Find and update the transaction
  const transaction = await Transaction.findOneAndUpdate(
    { razorpayOrderId },
    {
      status: 'completed',
      razorpayPaymentId,
    },
    { new: true }
  );

  if (!transaction) {
    throw new Error('Transaction not found for this order');
  }

  // Step 3: Execute business side effects based on paymentType
  const booking = await Booking.findById(transaction.bookingID);
  if (!booking) {
    throw new Error('Associated booking not found');
  }

  if (transaction.paymentType === 'booking') {
    // ─── Normal booking payment ───────────────────────────────────
    // Set rentalState to scheduled only if booking is confirmed
    if (booking.status === 'confirmed' && booking.rentalState === null) {
      booking.rentalState = 'scheduled';
      await booking.save();
    }
  } else if (transaction.paymentType === 'split') {
    // ─── Split payment ────────────────────────────────────────────
    // Mark the specific split as paid
    if (transaction.splitID) {
      await BookingSplit.findByIdAndUpdate(transaction.splitID, {
        status: 'paid',
        paidAt: new Date(),
      });
    }

    // Check if ALL splits for this booking are now paid
    const allSplits = await BookingSplit.find({ bookingID: transaction.bookingID });
    const allPaid = allSplits.length > 0 && allSplits.every((s) => s.status === 'paid');

    if (allPaid && booking.status === 'confirmed' && booking.rentalState === null) {
      booking.rentalState = 'scheduled';
      await booking.save();
    }
  }

  return {
    transaction,
    bookingStatus: booking.status,
    rentalState: booking.rentalState,
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
