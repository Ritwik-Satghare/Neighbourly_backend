import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  userID: Types.ObjectId;
  bookingID: Types.ObjectId;
  amount: number;
  type: 'booking_payment' | 'split_payment' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema: Schema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    bookingID: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount must be positive'],
    },
    type: {
      type: String,
      enum: ['booking_payment', 'split_payment', 'refund'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
