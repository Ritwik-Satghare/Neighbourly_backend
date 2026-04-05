import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBookingSplit extends Document {
  bookingID: Types.ObjectId;
  userID: Types.ObjectId;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSplitSchema: Schema = new Schema(
  {
    bookingID: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Split amount must be positive'],
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Each user can only appear once per booking split
bookingSplitSchema.index({ bookingID: 1, userID: 1 }, { unique: true });

const BookingSplit = mongoose.model<IBookingSplit>('BookingSplit', bookingSplitSchema);

export default BookingSplit;
