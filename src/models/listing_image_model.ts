import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IListingImage extends Document {
  listingID: Types.ObjectId;
  imageUrl: string;
  isPrimary: boolean;
}

const listingImageSchema: Schema = new Schema(
  {
    listingID: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ListingImage = mongoose.model<IListingImage>('ListingImage', listingImageSchema);

export default ListingImage;
