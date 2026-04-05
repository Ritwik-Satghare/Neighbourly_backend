import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBookingConditionImage extends Document {
  bookingID: Types.ObjectId;
  uploadedBy: Types.ObjectId;
  imageURL: string;
  stage: 'before' | 'after';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingConditionImageSchema: Schema = new Schema(
  {
    bookingID: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      enum: ['before', 'after'],
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: quickly look up all images for a booking + stage
bookingConditionImageSchema.index({ bookingID: 1, stage: 1 });

const BookingConditionImage = mongoose.model<IBookingConditionImage>(
  'BookingConditionImage',
  bookingConditionImageSchema
);

export default BookingConditionImage;
