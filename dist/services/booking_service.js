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
exports.updateBookingStatus = exports.cancelBooking = exports.getBookingById = exports.getUserBookings = void 0;
const booking_model_1 = __importDefault(require("../models/booking_model"));
const listing_model_1 = __importDefault(require("../models/listing_model"));
/**
 * Get all bookings for a user (as renter OR as listing owner).
 */
const getUserBookings = (userID, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, status } = query;
    let filter = {};
    if (role === 'renter') {
        // Bookings where the user is the renter
        filter.renterID = userID;
    }
    else if (role === 'owner') {
        // Bookings where the user owns the listing
        const userListings = yield listing_model_1.default.find({ ownerID: userID }).select('_id');
        const listingIDs = userListings.map((l) => l._id);
        filter.listingID = { $in: listingIDs };
    }
    else {
        // Both roles
        const userListings = yield listing_model_1.default.find({ ownerID: userID }).select('_id');
        const listingIDs = userListings.map((l) => l._id);
        filter = {
            $or: [{ renterID: userID }, { listingID: { $in: listingIDs } }],
        };
    }
    // Optional status filter
    if (status) {
        filter.status = status;
    }
    const bookings = yield booking_model_1.default.find(filter)
        .populate('listingID', 'name pricePerDay ownerID location')
        .populate('offerID', 'amount note')
        .sort({ createdAt: -1 });
    return bookings;
});
exports.getUserBookings = getUserBookings;
/**
 * Get a single booking by ID.
 * Only accessible by the renter or the listing owner.
 */
const getBookingById = (bookingID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.default.findById(bookingID)
        .populate('listingID', 'name pricePerDay ownerID location category')
        .populate('offerID', 'amount note startDate endDate');
    if (!booking)
        throw new Error('Booking not found');
    const listing = booking.listingID;
    // Authorization check: only renter or listing owner can view
    const isRenter = booking.renterID.toString() === userID;
    const isOwner = listing.ownerID === userID || listing.ownerID.toString() === userID;
    if (!isRenter && !isOwner) {
        throw new Error('Forbidden: You are not authorized to view this booking');
    }
    return booking;
});
exports.getBookingById = getBookingById;
/**
 * Cancel a booking.
 * Only the renter can cancel, and only if status is 'pending' or 'confirmed'.
 */
const cancelBooking = (bookingID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.default.findById(bookingID).populate('listingID');
    if (!booking)
        throw new Error('Booking not found');
    // Only the renter can cancel
    if (booking.renterID.toString() !== userID) {
        throw new Error('Forbidden: Only the renter can cancel this booking');
    }
    if (booking.status === 'cancelled') {
        throw new Error('Booking is already cancelled');
    }
    if (booking.status === 'completed') {
        throw new Error('Cannot cancel a completed booking');
    }
    booking.status = 'cancelled';
    yield booking.save();
    return booking;
});
exports.cancelBooking = cancelBooking;
/**
 * Update booking status.
 * Only the listing owner can update status (confirm / complete).
 * Valid transitions:
 *   pending → confirmed
 *   confirmed → completed
 */
const updateBookingStatus = (bookingID, userID, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.default.findById(bookingID).populate('listingID');
    if (!booking)
        throw new Error('Booking not found');
    const listing = booking.listingID;
    // Only listing owner can update status
    const isOwner = listing.ownerID === userID || listing.ownerID.toString() === userID;
    if (!isOwner) {
        throw new Error('Forbidden: Only the listing owner can update booking status');
    }
    // Define allowed status transitions
    const allowedTransitions = {
        pending: ['confirmed'],
        confirmed: ['completed'],
    };
    const currentStatus = booking.status;
    const allowed = allowedTransitions[currentStatus];
    if (!allowed || !allowed.includes(newStatus)) {
        throw new Error(`Invalid status transition: '${currentStatus}' → '${newStatus}'. ` +
            `Allowed: ${allowed ? allowed.join(', ') : 'none'}`);
    }
    booking.status = newStatus;
    yield booking.save();
    return booking;
});
exports.updateBookingStatus = updateBookingStatus;
