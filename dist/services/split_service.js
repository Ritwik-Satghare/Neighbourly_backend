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
exports.payShare = exports.getSplitsByBooking = exports.createSplit = void 0;
const booking_split_model_1 = __importDefault(require("../models/booking_split_model"));
const booking_model_1 = __importDefault(require("../models/booking_model"));
/**
 * Create split payments for a booking.
 *
 * Rules:
 * - Only the renter (booking creator) can create splits
 * - Splits can only be created for a 'pending' booking
 * - Total split amounts MUST equal booking totalPrice
 * - Each user can only appear once in the split
 * - The renter themselves can be included in the split
 */
const createSplit = (bookingID, userID, splits) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.default.findById(bookingID);
    if (!booking)
        throw new Error('Booking not found');
    // Only the renter can create splits
    if (booking.renterID.toString() !== userID) {
        throw new Error('Forbidden: Only the renter can create split payments');
    }
    if (booking.status !== 'pending') {
        throw new Error(`Cannot create splits for a booking with status '${booking.status}'`);
    }
    // Check if splits already exist for this booking
    const existingSplits = yield booking_split_model_1.default.countDocuments({ bookingID });
    if (existingSplits > 0) {
        throw new Error('Splits already exist for this booking. Delete existing splits first.');
    }
    // Validate: no duplicate users
    const userIDs = splits.map((s) => s.userID);
    const uniqueUserIDs = new Set(userIDs);
    if (uniqueUserIDs.size !== userIDs.length) {
        throw new Error('Duplicate users found in split. Each user can only appear once.');
    }
    // Validate: all amounts must be positive
    for (const split of splits) {
        if (split.amount <= 0) {
            throw new Error('Each split amount must be positive');
        }
    }
    // Validate: total split amount must equal booking totalPrice
    const totalSplitAmount = splits.reduce((sum, s) => sum + s.amount, 0);
    // Use a small epsilon for floating point comparison
    if (Math.abs(totalSplitAmount - booking.totalPrice) > 0.01) {
        throw new Error(`Total split amount (${totalSplitAmount}) does not match booking price (${booking.totalPrice})`);
    }
    // Create all split records
    const splitDocs = splits.map((s) => ({
        bookingID,
        userID: s.userID,
        amount: s.amount,
        status: 'pending',
    }));
    const createdSplits = yield booking_split_model_1.default.insertMany(splitDocs);
    return createdSplits;
});
exports.createSplit = createSplit;
/**
 * Get all split payment records for a booking.
 */
const getSplitsByBooking = (bookingID) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.default.findById(bookingID);
    if (!booking)
        throw new Error('Booking not found');
    const splits = yield booking_split_model_1.default.find({ bookingID })
        .populate('userID', 'fullName email')
        .sort({ createdAt: 1 });
    // Calculate summary
    const totalPaid = splits
        .filter((s) => s.status === 'paid')
        .reduce((sum, s) => sum + s.amount, 0);
    const totalPending = splits
        .filter((s) => s.status === 'pending')
        .reduce((sum, s) => sum + s.amount, 0);
    const allPaid = splits.length > 0 && splits.every((s) => s.status === 'paid');
    return {
        splits,
        summary: {
            totalPrice: booking.totalPrice,
            totalPaid,
            totalPending,
            allPaid,
            bookingStatus: booking.status,
        },
    };
});
exports.getSplitsByBooking = getSplitsByBooking;
/**
 * Pay a user's share of the split.
 *
 * CRITICAL LOGIC:
 * - When ALL splits are paid → booking status is automatically updated to 'confirmed'
 * - This is the core of the split ownership system
 */
const payShare = (bookingID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.default.findById(bookingID);
    if (!booking)
        throw new Error('Booking not found');
    if (booking.status === 'cancelled') {
        throw new Error('Cannot pay for a cancelled booking');
    }
    if (booking.status === 'completed') {
        throw new Error('Booking is already completed');
    }
    // Find this user's split record
    const split = yield booking_split_model_1.default.findOne({ bookingID, userID });
    if (!split) {
        throw new Error('No split payment found for this user on this booking');
    }
    if (split.status === 'paid') {
        throw new Error('You have already paid your share');
    }
    // Mark as paid
    split.status = 'paid';
    split.paidAt = new Date();
    yield split.save();
    // Check if ALL splits for this booking are now paid
    const allSplits = yield booking_split_model_1.default.find({ bookingID });
    const allPaid = allSplits.every((s) => s.status === 'paid');
    if (allPaid) {
        // CRITICAL: Auto-confirm booking when all friends have paid
        booking.status = 'confirmed';
        yield booking.save();
    }
    return {
        split,
        allPaid,
        bookingStatus: booking.status,
    };
});
exports.payShare = payShare;
