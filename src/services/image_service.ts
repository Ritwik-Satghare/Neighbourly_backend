import Listing from '../models/listing_model';
import ListingImage from '../models/listing_image_model';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../utils/cloudinary_upload';

export const uploadListingImage = async (listingID: string, userID: string, localFilePath: string) => {
  // Verify ownership
  const listing = await Listing.findById(listingID);
  if (!listing) {
    throw new Error('Listing not found');
  }

  if (listing.ownerID !== userID) {
    throw new Error('Forbidden: You are not the owner of this listing');
  }

  // Check current image count
  const currentImagesCount = await ListingImage.countDocuments({ listingID });
  if (currentImagesCount >= 5) {
    throw new Error('Maximum of 5 images allowed per listing');
  }

  // Upload to Cloudinary
  const uploadResult = await uploadToCloudinary(localFilePath);
  if (!uploadResult) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  // Save in DB
  const isPrimary = currentImagesCount === 0; // First uploaded image -> automatically set as primary
  const image = await ListingImage.create({
    listingID,
    imageUrl: uploadResult.secure_url,
    isPrimary,
  });

  return image;
};

export const deleteListingImage = async (imageID: string, userID: string) => {
  const image = await ListingImage.findById(imageID);
  if (!image) {
    throw new Error('Image not found');
  }

  // Verify ownership
  const listing = await Listing.findById(image.listingID);
  if (!listing) {
    throw new Error('Listing not found'); // Should not happen ideally
  }

  if (listing.ownerID !== userID) {
    throw new Error('Forbidden: You are not the owner of this listing');
  }

  // Delete from Cloudinary
  const publicId = extractPublicId(image.imageUrl);
  if (publicId) {
    await deleteFromCloudinary(publicId);
  }

  // Delete from DB
  await ListingImage.findByIdAndDelete(imageID);

  // If deleted image was primary, assign another one if available
  if (image.isPrimary) {
    const remainingImage = await ListingImage.findOne({ listingID: image.listingID });
    if (remainingImage) {
      remainingImage.isPrimary = true;
      await remainingImage.save();
    }
  }

  return true;
};
