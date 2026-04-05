import Review from '../models/review_model';
import mongoose from 'mongoose';

export const createReview = async (reviewerID: string, listingID: string, rating: number, comment?: string) => {
  // Check for duplicate review
  const existing = await Review.findOne({ listingID, reviewerID });
  if (existing) {
    throw new Error('You have already reviewed this listing');
  }

  const review = await Review.create({
    listingID,
    reviewerID,
    rating,
    comment,
  });

  // Update the listing owner's rating and review count
  // Find the listing to get the ownerID
  const Listing = mongoose.model('Listing');
  const listing = await Listing.findById(listingID);
  if (listing) {
    const ownerID = (listing as any).ownerID;

    // Try to update User model if it exists (Person 1's responsibility)
    try {
      const User = mongoose.model('User');
      const user = await User.findById(ownerID);
      if (user) {
        const currentCount = (user as any).receivedReviewsCount || 0;
        const currentRating = (user as any).rating || 0;

        // Calculate new average rating
        const newCount = currentCount + 1;
        const newRating = ((currentRating * currentCount) + rating) / newCount;

        await User.findByIdAndUpdate(ownerID, {
          rating: Math.round(newRating * 10) / 10, // Round to 1 decimal
          receivedReviewsCount: newCount,
        });
      }
    } catch (err) {
      // User model may not be registered yet (Person 1's work)
      // Silently skip — the review is still saved
      console.log('Note: User model not available for rating update. Review saved without updating user rating.');
    }
  }

  return review;
};

export const getReviewsByListing = async (listingID: string) => {
  const reviews = await Review.find({ listingID })
    .populate('reviewerID', 'fullName avatarUrl')
    .sort({ createdAt: -1 })
    .lean();

  return reviews;
};

export const getReviewsByUser = async (userID: string) => {
  // Find all listings owned by this user, then get reviews for those listings
  const Listing = mongoose.model('Listing');
  const listings = await Listing.find({ ownerID: userID }).select('_id').lean();
  const listingIds = listings.map((l: any) => l._id);

  const reviews = await Review.find({ listingID: { $in: listingIds } })
    .populate('reviewerID', 'fullName avatarUrl')
    .populate('listingID', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return reviews;
};
