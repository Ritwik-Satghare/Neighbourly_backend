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
exports.getConditionImages = exports.uploadConditionImage = void 0;
const booking_condition_image_model_1 = __importDefault(require("../models/booking_condition_image_model"));
const booking_model_1 = __importDefault(require("../models/booking_model"));
/**
 * Upload a condition image for a booking.
 * Both renter and owner can upload before/after images.
 *
 * Rules:
 *  - "before" images → only when status is 'confirmed' (rental is starting)
 *  - "after" images  → only when status is 'confirmed' (rental is ending, before completion)
 */
const uploadConditionImage = (bookingID, userID, data) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.default.findById(bookingID).populate('listingID');
    if (!booking)
        throw new Error('Booking not found');
    const listing = booking.listingID;
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
    const conditionImage = yield booking_condition_image_model_1.default.create({
        bookingID,
        uploadedBy: userID,
        imageURL: data.imageURL,
        stage: data.stage,
        notes: data.notes,
    });
    return conditionImage;
});
exports.uploadConditionImage = uploadConditionImage;
/**
 * Get all condition images for a booking.
 * Only renter or listing owner can view.
 */
const getConditionImages = (bookingID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.default.findById(bookingID).populate('listingID');
    if (!booking)
        throw new Error('Booking not found');
    const listing = booking.listingID;
    // Authorization: only renter or listing owner
    const isRenter = booking.renterID.toString() === userID;
    const isOwner = listing.ownerID === userID || listing.ownerID.toString() === userID;
    if (!isRenter && !isOwner) {
        throw new Error('Forbidden: You are not authorized to view condition images for this booking');
    }
    const images = yield booking_condition_image_model_1.default.find({ bookingID })
        .populate('uploadedBy', 'fullName email')
        .sort({ createdAt: 1 });
    return images;
});
exports.getConditionImages = getConditionImages;
