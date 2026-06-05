import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IConditionImage extends Document {
  bookingID: Types.ObjectId;
  stage: 'before' | 'after';
  imageUrls: string[];
  uploadedBy: Types.ObjectId;
  uploadedAt: Date;
  aiReview: {
    accepted: boolean;
    qualityScore: number;
    reason?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const bookingConditionSchema: Schema = new Schema(
  {
    bookingID: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    stage: {
      type: String,
      enum: ['before', 'after'],
      required: true,
    },
    imageUrls: {
      type: [String],
      required: true,
      default: [],
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    aiReview: {
      accepted: { type: Boolean, default: true },
      qualityScore: { type: Number, default: 1.0 },
      reason: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: one document per booking + stage
bookingConditionSchema.index({ bookingID: 1, stage: 1 }, { unique: true });

const ConditionImage = mongoose.model<IConditionImage>('ConditionImage', bookingConditionSchema);

export default ConditionImage;
