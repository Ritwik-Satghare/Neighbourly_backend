import ConditionImage, { IConditionImage } from '../models/booking_condition_model';
import ComparisonReport from '../models/comparison_report_model';
import Booking from '../models/booking_model';
import Listing from '../models/listing_model';
import { Types } from 'mongoose';
import { generateComparisonReport } from './comparison_service';

export const uploadConditionImages = async (
  bookingID: string,
  userID: string,
  stage: 'before' | 'after',
  imageUrls: string[],
  aiReview?: { accepted: boolean; qualityScore: number; reason?: string }
) => {
  const booking = await Booking.findById(bookingID).populate('listingID');
  if (!booking) throw new Error('Booking not found');

  const listing: any = booking.listingID;

  const isRenter = booking.renterID.toString() === userID;
  const isOwner = listing && (listing.ownerID === userID || listing.ownerID.toString() === userID);

  if (!isRenter && !isOwner) {
    throw new Error('Forbidden: You are not authorized to upload condition images for this booking');
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

  // Upsert a single condition document for (bookingID, stage)
  const now = new Date();

  const updated = await ConditionImage.findOneAndUpdate(
    { bookingID, stage },
    {
      bookingID,
      stage,
      imageUrls,
      uploadedBy: userID,
      uploadedAt: now,
      aiReview: aiReview || { accepted: true, qualityScore: 1.0, reason: '' },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // If this is an 'after' stage upload, attempt to generate a comparison report
  try {
    if (stage === 'after') {
      const beforeDoc = await ConditionImage.findOne({ bookingID, stage: 'before' }).exec();
      if (beforeDoc) {
        // Generate AI comparison report
        const comparison = await generateComparisonReport(beforeDoc.imageUrls || [], updated.imageUrls || []);

        try {
          await ComparisonReport.create({
            bookingID,
            beforeConditionID: beforeDoc._id,
            afterConditionID: updated._id,
            aiSummary: comparison.summary,
            changesDetected: comparison.changesDetected,
            confidence: comparison.confidence,
            generatedAt: new Date(),
          });
        } catch (saveErr) {
          console.error('Failed to save comparison report:', saveErr);
        }
      }
    }
  } catch (err) {
    console.error('Error during comparison generation:', err);
  }

  return updated;
};

export const getBookingConditions = async (bookingID: string, userID: string) => {
  const booking = await Booking.findById(bookingID).populate('listingID');
  if (!booking) throw new Error('Booking not found');

  const listing: any = booking.listingID;

  const isRenter = booking.renterID.toString() === userID;
  const isOwner = listing && (listing.ownerID === userID || listing.ownerID.toString() === userID);

  if (!isRenter && !isOwner) {
    throw new Error('Forbidden: You are not authorized to view condition images for this booking');
  }

  const conditions = await ConditionImage.find({ bookingID })
    .populate('uploadedBy', 'fullName email')
    .sort({ createdAt: 1 })
    .exec();

  // Return the latest comparison if multiple exist
  const comparison = await ComparisonReport.findOne({ bookingID }).sort({ generatedAt: -1 }).exec();
  return { conditions, comparison };
};
