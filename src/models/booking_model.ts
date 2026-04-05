import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  offerID: Types.ObjectId;
  renterID: Types.ObjectId;
  listingID: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema: Schema = new Schema(
  {
    offerID: {
      type: Schema.Types.ObjectId,
      ref: 'Offer',
      required: true,
      unique: true, // One booking per accepted offer — prevents duplicate bookings
    },
    renterID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    listingID: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price must be positive'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient date-overlap queries (double-booking prevention)
bookingSchema.index({ listingID: 1, startDate: 1, endDate: 1 });

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
