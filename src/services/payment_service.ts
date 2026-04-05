import Razorpay from 'razorpay';
import crypto from 'crypto';
import Transaction from '../models/transaction_model';

// Initialize Razorpay instance
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
  });
};

export const createOrder = async (userID: string, bookingID: string, amount: number, type: string = 'booking_payment') => {
  const razorpay = getRazorpayInstance();

  // Create Razorpay order (amount in paise)
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: `booking_${bookingID}_${Date.now()}`,
  });

  // Create a pending transaction record
  const transaction = await Transaction.create({
    userID,
    bookingID,
    amount,
    type,
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

export const verifyPayment = async (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) => {
  const secret = process.env.RAZORPAY_KEY_SECRET || '';

  // Verify the payment signature
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new Error('Invalid payment signature');
  }

  // Update transaction status to completed
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

  return transaction;
};

export const getPaymentHistory = async (userID: string) => {
  const transactions = await Transaction.find({ userID })
    .populate('bookingID')
    .sort({ createdAt: -1 })
    .lean();

  return transactions;
};
