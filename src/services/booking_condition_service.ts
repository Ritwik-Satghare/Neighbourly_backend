import BookingConditionImage from '../models/booking_condition_image_model';
import Booking from '../models/booking_model';

interface AIResult {
  accepted: boolean;
  qualityScore: number;
  reason?: string;
}

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

  const isRenter = booking.renterID.toString() === userID;
  const isOwner = listing && (listing.ownerID === userID || listing.ownerID?.toString() === userID);

  if (!isRenter && !isOwner) {
    throw new Error('Forbidden: You are not authorized to upload images for this booking');
  }

  if (booking.status === 'pending') {
    throw new Error('Cannot upload condition images for a pending booking. Booking must be confirmed first.');
  }
  if (booking.status === 'cancelled') {
    throw new Error('Cannot upload condition images for a cancelled booking');
  }
  if (booking.status === 'completed' && stage === 'before') {
    throw new Error('Cannot upload "before" images for a completed booking');
  }

  const record = await BookingConditionImage.create({
    bookingID,
    uploadedBy: userID,
    imageURLs: imageUrls,
    stage,
    aiReview: {
      accepted: aiReview.accepted,
      qualityScore: aiReview.qualityScore,
      reason: aiReview.reason
    }
  });

  return record;
};

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
