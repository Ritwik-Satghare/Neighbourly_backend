import BookingConditionImage from '../models/booking_condition_image_model';
import Booking from '../models/booking_model';

interface AIResult {
  accepted: boolean;
  qualityScore: number;
  reason?: string;
}

/**
 * Upload condition images for a booking.
 * Synchronizes with the controller layout to save arrays of secure URLs and Gemini AI analysis metrics.
 */
export const uploadConditionImages = async (
  bookingID: string,
  userID: string,
  stage: 'before' | 'after',
  imageUrls: string[],
  aiReview: AIResult
) => {
  const booking = await Booking.findById(bookingID).populate('listingID');
  if (!booking) throw new Error('Booking not found');

  const listing = booking.listingID as any;

  // Authorization: Ensure the active token belongs to either the renter or the listing owner
  const isRenter = booking.renterID.toString() === userID;
  const isOwner = listing && (listing.ownerID === userID || listing.ownerID?.toString() === userID);

  if (!isRenter && !isOwner) {
    throw new Error('Forbidden: You are not authorized to upload images for this booking');
  }

  // Lifecycle Validation Gateways
  if (booking.status === 'pending') {
    throw new Error('Cannot upload condition images for a pending booking. Booking must be confirmed first.');
  }
  if (booking.status === 'cancelled') {
    throw new Error('Cannot upload condition images for a cancelled booking');
  }
  if (booking.status === 'completed' && stage === 'before') {
    throw new Error('Cannot upload "before" images for a completed booking');
  }

  // Persist the batch arrays into your MongoDB collection
  // If your model takes a single imageURL string, we map over the array or pass the array directly based on your schema layout
  const record = await BookingConditionImage.create({
    bookingID,
    uploadedBy: userID,
    imageURLs: imageUrls, // Supports multi-image upload arrays flawlessly
    stage,
    aiReview: {
      accepted: aiReview.accepted,
      qualityScore: aiReview.qualityScore,
      reason: aiReview.reason
    }
  });

  return record;
};

/**
 * Retrieves all registered condition cards and metrics for a specified booking ID.
 */
export const getBookingConditions = async (bookingID: string, userID: string) => {
  const booking = await Booking.findById(bookingID).populate('listingID');
  if (!booking) throw new Error('Booking not found');

  const listing = booking.listingID as any;

  const isRenter = booking.renterID.toString() === userID;
  const isOwner = listing && (listing.ownerID === userID || listing.ownerID?.toString() === userID);

  if (!isRenter && !isOwner) {
    throw new Error('Forbidden: You are not authorized to view condition images for this booking');
  }

  const images = await BookingConditionImage.find({ bookingID })
    .populate('uploadedBy', 'fullName email')
    .sort({ createdAt: 1 });

  return images;
};