import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOffer extends Document {
  listingID: Types.ObjectId;
  senderID: Types.ObjectId;
  amount: number;
  startDate: Date;
  endDate: Date;
  note?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const offerSchema: Schema = new Schema(
  {
    listingID: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
      index: true,
    },
    senderID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount must be positive'],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: prevents the same user from sending duplicate offers 
// for the same listing with the same dates while one is still pending
offerSchema.index({ listingID: 1, senderID: 1, startDate: 1, endDate: 1 });

const Offer = mongoose.model<IOffer>('Offer', offerSchema);

export default Offer;
