import BookingConditionImage from '../models/booking_condition_image_model';
import Booking from '../models/booking_model';
import Listing from '../models/listing_model';

/**
 * Upload a condition image for a booking.
 * Both renter and owner can upload before/after images.
 * 
 * Rules:
 *  - "before" images → only when status is 'confirmed' (rental is starting)
 *  - "after" images  → only when status is 'confirmed' (rental is ending, before completion)
 */
export const uploadConditionImage = async (
  bookingID: string,
  userID: string,
  data: { imageURL: string; stage: 'before' | 'after'; notes?: string }
) => {
  const booking = await Booking.findById(bookingID).populate('listingID');
  if (!booking) throw new Error('Booking not found');

  const listing = booking.listingID as any;

  // Authorization: only renter or listing owner
  const isRenter = booking.renterID.toString() === userID;
  const isOwner = listing.ownerID === userID || listing.ownerID.toString() === userID;

  if (!isRenter && !isOwner) {
    throw new Error('Forbidden: You are not authorized to upload images for this booking');
  }

  // Stage validation
  if (booking.status === 'pending') {
    throw new Error('Cannot upload condition images for a pending booking. Booking must be confirmed first.');
  }
  if (booking.status === 'cancelled') {
    throw new Error('Cannot upload condition images for a cancelled booking');
  }
  if (booking.status === 'completed' && data.stage === 'before') {
    throw new Error('Cannot upload "before" images for a completed booking');
  }

  const conditionImage = await BookingConditionImage.create({
    bookingID,
    uploadedBy: userID,
    imageURL: data.imageURL,
    stage: data.stage,
    notes: data.notes,
  });

  return conditionImage;
};

/**
 * Get all condition images for a booking.
 * Only renter or listing owner can view.
 */
export const getConditionImages = async (bookingID: string, userID: string) => {
  const booking = await Booking.findById(bookingID).populate('listingID');
  if (!booking) throw new Error('Booking not found');

  const listing = booking.listingID as any;

  // Authorization: only renter or listing owner
  const isRenter = booking.renterID.toString() === userID;
  const isOwner = listing.ownerID === userID || listing.ownerID.toString() === userID;

  if (!isRenter && !isOwner) {
    throw new Error('Forbidden: You are not authorized to view condition images for this booking');
  }

  const images = await BookingConditionImage.find({ bookingID })
    .populate('uploadedBy', 'fullName email')
    .sort({ createdAt: 1 });

  return images;
};
