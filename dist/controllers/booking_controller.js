"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatus = exports.cancelBooking = exports.getBookingById = exports.getUserBookings = exports.updateStatusSchema = void 0;
const bookingService = __importStar(require("../services/booking_service"));
const zod_1 = require("zod");
// ─── Validation Schemas ──────────────────────────────────────────────────────
exports.updateStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['confirmed', 'completed'], {
            errorMap: () => ({ message: "Status must be 'confirmed' or 'completed'" }),
        }),
    }),
});
// ─── Controllers ─────────────────────────────────────────────────────────────
/**
 * GET /booking/user
 * Get all bookings for the authenticated user.
 * Query params: role (renter|owner), status (pending|confirmed|cancelled|completed)
 */
const getUserBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const bookings = yield bookingService.getUserBookings(userID, req.query);
        res.status(200).json({
            success: true,
            message: 'Bookings fetched successfully',
            data: bookings,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Error fetching bookings' });
    }
});
exports.getUserBookings = getUserBookings;
/**
 * GET /booking/:id
 * Get a single booking by ID (renter or owner only).
 */
const getBookingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const booking = yield bookingService.getBookingById(req.params.id, userID);
        res.status(200).json({
            success: true,
            data: booking,
        });
    }
    catch (error) {
        if (error.message.includes('Forbidden')) {
            res.status(403).json({ success: false, message: error.message });
            return;
        }
        if (error.message.includes('not found')) {
            res.status(404).json({ success: false, message: error.message });
            return;
        }
        res.status(400).json({ success: false, message: error.message || 'Error fetching booking' });
    }
});
exports.getBookingById = getBookingById;
/**
 * PATCH /booking/cancel/:id
 * Cancel a booking (renter only).
 */
const cancelBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const booking = yield bookingService.cancelBooking(req.params.id, userID);
        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking,
        });
    }
    catch (error) {
        if (error.message.includes('Forbidden')) {
            res.status(403).json({ success: false, message: error.message });
            return;
        }
        res.status(400).json({ success: false, message: error.message || 'Error cancelling booking' });
    }
});
exports.cancelBooking = cancelBooking;
/**
 * PATCH /booking/status/:id
 * Update booking status (owner only). Body: { status: 'confirmed' | 'completed' }
 */
const updateBookingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const booking = yield bookingService.updateBookingStatus(req.params.id, userID, req.body.status);
        res.status(200).json({
            success: true,
            message: `Booking status updated to '${booking.status}'`,
            data: booking,
        });
    }
    catch (error) {
        if (error.message.includes('Forbidden')) {
            res.status(403).json({ success: false, message: error.message });
            return;
        }
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating booking status',
        });
    }
});
exports.updateBookingStatus = updateBookingStatus;
