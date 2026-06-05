import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  offerID: Types.ObjectId;
  renterID: Types.ObjectId;
  listingID: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'completed';
  rentalState: 'scheduled' | 'checked_out' | 'returned' | null;
  actualStartDate: Date | null;
  actualReturnDate: Date | null;
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
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    // ─── Rental Lifecycle ──────────────────────────────────────────────
    // Tracks the physical rental state, separate from booking status.
    // null until payment is completed; set to 'scheduled' after payment verification.
    rentalState: {
      type: String,
      enum: ['scheduled', 'checked_out', 'returned'],
      default: null,
    },
    // Audit-only: timestamp when the owner physically handed over the item.
    actualStartDate: {
      type: Date,
      default: null,
    },
    // Audit-only: timestamp when the owner marked the item as returned.
    actualReturnDate: {
      type: Date,
      default: null,
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
