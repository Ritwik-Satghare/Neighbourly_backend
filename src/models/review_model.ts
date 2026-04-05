import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReview extends Document {
  listingID: Types.ObjectId;
  reviewerID: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema: Schema = new Schema(
  {
    listingID: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
      index: true,
    },
    reviewerID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews: one review per user per listing
reviewSchema.index({ listingID: 1, reviewerID: 1 }, { unique: true });

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;
