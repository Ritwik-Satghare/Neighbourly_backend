"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewsByUser = exports.getReviewsByListing = exports.createReview = void 0;
const review_model_1 = __importDefault(require("../models/review_model"));
const mongoose_1 = __importDefault(require("mongoose"));
const createReview = (reviewerID, listingID, rating, comment) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for duplicate review
    const existing = yield review_model_1.default.findOne({ listingID, reviewerID });
    if (existing) {
        throw new Error('You have already reviewed this listing');
    }
    const review = yield review_model_1.default.create({
        listingID,
        reviewerID,
        rating,
        comment,
    });
    // Update the listing owner's rating and review count
    // Find the listing to get the ownerID
    const Listing = mongoose_1.default.model('Listing');
    const listing = yield Listing.findById(listingID);
    if (listing) {
        const ownerID = listing.ownerID;
        // Try to update User model if it exists (Person 1's responsibility)
        try {
            const User = mongoose_1.default.model('User');
            const user = yield User.findById(ownerID);
            if (user) {
                const currentCount = user.receivedReviewsCount || 0;
                const currentRating = user.rating || 0;
                // Calculate new average rating
                const newCount = currentCount + 1;
                const newRating = ((currentRating * currentCount) + rating) / newCount;
                yield User.findByIdAndUpdate(ownerID, {
                    rating: Math.round(newRating * 10) / 10, // Round to 1 decimal
                    receivedReviewsCount: newCount,
                });
            }
        }
        catch (err) {
            // User model may not be registered yet (Person 1's work)
            // Silently skip — the review is still saved
            console.log('Note: User model not available for rating update. Review saved without updating user rating.');
        }
    }
    return review;
});
exports.createReview = createReview;
const getReviewsByListing = (listingID) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.default.find({ listingID })
        .populate('reviewerID', 'fullName avatarUrl')
        .sort({ createdAt: -1 })
        .lean();
    return reviews;
});
exports.getReviewsByListing = getReviewsByListing;
const getReviewsByUser = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    // Find all listings owned by this user, then get reviews for those listings
    const Listing = mongoose_1.default.model('Listing');
    const listings = yield Listing.find({ ownerID: userID }).select('_id').lean();
    const listingIds = listings.map((l) => l._id);
    const reviews = yield review_model_1.default.find({ listingID: { $in: listingIds } })
        .populate('reviewerID', 'fullName avatarUrl')
        .populate('listingID', 'name')
        .sort({ createdAt: -1 })
        .lean();
    return reviews;
});
exports.getReviewsByUser = getReviewsByUser;
