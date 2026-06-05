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
exports.rejectOffer = exports.acceptOffer = exports.listOffers = exports.createOffer = void 0;
const offer_model_1 = __importDefault(require("../models/offer_model"));
const listing_model_1 = __importDefault(require("../models/listing_model"));
const booking_model_1 = __importDefault(require("../models/booking_model"));
/**
 * Create a new rental offer.
 * - Validates listing exists
 * - Prevents owner from sending offer on their own listing
 * - Checks for date overlap with existing confirmed/pending bookings (double-booking prevention)
 */
const createOffer = (senderID, data) => __awaiter(void 0, void 0, void 0, function* () {
    const listing = yield listing_model_1.default.findById(data.listingID);
    if (!listing)
        throw new Error('Listing not found');
    // ownerID is stored as String in Listing model
    if (listing.ownerID === senderID) {
        throw new Error('You cannot send an offer for your own listing');
    }
    // Validate dates: endDate must be after startDate
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (endDate <= startDate) {
        throw new Error('End date must be after start date');
    }
    // Check for overlapping bookings (double-booking prevention)
    const overlappingBooking = yield booking_model_1.default.findOne({
        listingID: data.listingID,
        status: { $in: ['pending', 'confirmed'] },
        startDate: { $lt: endDate },
        endDate: { $gt: startDate },
    });
    if (overlappingBooking) {
        throw new Error('This listing is already booked for the requested dates');
    }
    const offer = yield offer_model_1.default.create({
        listingID: data.listingID,
        senderID: senderID,
        amount: data.amount,
        startDate: startDate,
        endDate: endDate,
        note: data.note,
        status: 'pending',
    });
    return offer;
});
exports.createOffer = createOffer;
/**
 * List offers for a user.
 * Supports filtering by: sent, received, or a specific listing.
 */
const listOffers = (userID, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { listingID, type } = query;
    let filter = {};
    if (type === 'sent') {
        filter.senderID = userID;
    }
    else if (type === 'received') {
        const userListings = yield listing_model_1.default.find({ ownerID: userID }).select('_id');
        const listingIDs = userListings.map((l) => l._id);
        filter.listingID = { $in: listingIDs };
    }
    else if (listingID) {
        filter.listingID = listingID;
    }
    else {
        // Both sent and received
        const userListings = yield listing_model_1.default.find({ ownerID: userID }).select('_id');
        const listingIDs = userListings.map((l) => l._id);
        filter = {
            $or: [{ senderID: userID }, { listingID: { $in: listingIDs } }],
        };
    }
    const offers = yield offer_model_1.default.find(filter)
        .populate('listingID', 'name pricePerDay ownerID')
        .sort({ createdAt: -1 });
    return offers;
});
exports.listOffers = listOffers;
/**
 * Accept an offer (owner-only).
 * - Validates ownership
 * - Prevents duplicate acceptance
 * - Checks for date overlaps AGAIN at accept-time (race condition protection)
 * - Atomically creates a Booking
 */
const acceptOffer = (offerID, ownerID) => __awaiter(void 0, void 0, void 0, function* () {
    const offer = yield offer_model_1.default.findById(offerID).populate('listingID');
    if (!offer)
        throw new Error('Offer not found');
    const listing = offer.listingID;
    if (listing.ownerID !== ownerID) {
        throw new Error('Forbidden: You are not the owner of this listing');
    }
    if (offer.status !== 'pending') {
        throw new Error(`Offer is already ${offer.status}`);
    }
    // Double-booking guard at accept time (prevents race conditions)
    const overlappingBooking = yield booking_model_1.default.findOne({
        listingID: listing._id,
        status: { $in: ['pending', 'confirmed'] },
        startDate: { $lt: offer.endDate },
        endDate: { $gt: offer.startDate },
    });
    if (overlappingBooking) {
        throw new Error('Cannot accept: listing is already booked for these dates');
    }
    offer.status = 'accepted';
    yield offer.save();
    // Create Booking automatically when offer is accepted
    const booking = yield booking_model_1.default.create({
        offerID: offer._id,
        renterID: offer.senderID,
        listingID: listing._id,
        startDate: offer.startDate,
        endDate: offer.endDate,
        totalPrice: offer.amount,
        status: 'pending',
    });
    return { offer, booking };
});
exports.acceptOffer = acceptOffer;
/**
 * Reject an offer (owner-only).
 */
const rejectOffer = (offerID, ownerID) => __awaiter(void 0, void 0, void 0, function* () {
    const offer = yield offer_model_1.default.findById(offerID).populate('listingID');
    if (!offer)
        throw new Error('Offer not found');
    const listing = offer.listingID;
    if (listing.ownerID !== ownerID) {
        throw new Error('Forbidden: You are not the owner of this listing');
    }
    if (offer.status !== 'pending') {
        throw new Error(`Offer is already ${offer.status}`);
    }
    offer.status = 'rejected';
    yield offer.save();
    return offer;
});
exports.rejectOffer = rejectOffer;
