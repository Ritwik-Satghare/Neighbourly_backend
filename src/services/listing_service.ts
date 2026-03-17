import Listing from '../models/listing_model';
import ListingImage from '../models/listing_image_model';
import { deleteFromCloudinary, extractPublicId } from '../utils/cloudinary_upload';

export const createListing = async (userID: string, data: any) => {
  const listing = await Listing.create({
    ...data,
    ownerID: userID,
  });
  return listing;
};

export const updateListing = async (listingID: string, userID: string, data: any) => {
  const listing = await Listing.findById(listingID);
  if (!listing) throw new Error('Listing not found');
  if (listing.ownerID !== userID) throw new Error('Forbidden: You are not the owner');

  Object.assign(listing, data);
  await listing.save();
  return listing;
};

export const deleteListing = async (listingID: string, userID: string) => {
  const listing = await Listing.findById(listingID);
  if (!listing) throw new Error('Listing not found');
  if (listing.ownerID !== userID) throw new Error('Forbidden: You are not the owner');

  const images = await ListingImage.find({ listingID });

  // Delete images from Cloudinary
  for (const image of images) {
    const publicId = extractPublicId(image.imageUrl);
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }
  }

  // Delete images from DB
  await ListingImage.deleteMany({ listingID });

  // Delete listing from DB
  await Listing.findByIdAndDelete(listingID);
  return true;
};

export const getAllListings = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const listings = await Listing.find()
    .skip(skip)
    .limit(limit)
    .populate('images', 'imageUrl isPrimary') // Exclude heavy data, just necessary fields
    .lean();

  const total = await Listing.countDocuments();

  return { listings, total, page, limit };
};

export const getListingById = async (listingID: string) => {
  const listing = await Listing.findById(listingID)
    .populate('images', 'imageUrl isPrimary')
    .lean();
  if (!listing) throw new Error('Listing not found');
  return listing;
};

export const getListingsByUser = async (userID: string) => {
  const listings = await Listing.find({ ownerID: userID })
    .populate('images', 'imageUrl isPrimary')
    .lean();
  return listings;
};
