import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  userID: Types.ObjectId;
  bookingID: Types.ObjectId;
  splitID?: Types.ObjectId;
  amount: number;
  paymentType: 'booking' | 'split';
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
    // Links to the specific split record (only for paymentType = 'split')
    splitID: {
      type: Schema.Types.ObjectId,
      ref: 'BookingSplit',
      default: null,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount must be positive'],
    },
    // Determines what business action to execute after payment verification
    paymentType: {
      type: String,
      enum: ['booking', 'split'],
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
