import mongoose, { Schema, Document } from 'mongoose';

export interface IListing extends Document {
  ownerID: string;
  name: string;
  category: string;
  description?: string;
  pricePerDay: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema: Schema = new Schema(
  {
    ownerID: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: [0, 'Price must be positive'],
    },
    location: {
      type: String,
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for fetching populated images easily
listingSchema.virtual('images', {
  ref: 'ListingImage',
  localField: '_id',
  foreignField: 'listingID',
});

const Listing = mongoose.model<IListing>('Listing', listingSchema);

export default Listing;
