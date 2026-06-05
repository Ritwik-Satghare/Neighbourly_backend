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
exports.payShare = exports.getSplitsByBooking = exports.createSplit = exports.payShareSchema = exports.createSplitSchema = void 0;
const splitService = __importStar(require("../services/split_service"));
const zod_1 = require("zod");
// ─── Validation Schemas ──────────────────────────────────────────────────────
exports.createSplitSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingID: zod_1.z.string().min(1, 'Booking ID is required'),
        splits: zod_1.z
            .array(zod_1.z.object({
            userID: zod_1.z.string().min(1, 'User ID is required'),
            amount: zod_1.z.number().positive('Amount must be positive'),
        }))
            .min(2, 'At least 2 users are required for a split'),
    }),
});
exports.payShareSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingID: zod_1.z.string().min(1, 'Booking ID is required'),
    }),
});
// ─── Controllers ─────────────────────────────────────────────────────────────
/**
 * POST /split/create
 * Create split payments for a booking.
 * Body: { bookingID, splits: [{ userID, amount }] }
 */
const createSplit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const { bookingID, splits } = req.body;
        const createdSplits = yield splitService.createSplit(bookingID, userID, splits);
        res.status(201).json({
            success: true,
            message: 'Split payments created successfully',
            data: createdSplits,
        });
    }
    catch (error) {
        if (error.message.includes('Forbidden')) {
            res.status(403).json({ success: false, message: error.message });
            return;
        }
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating split payments',
        });
    }
});
exports.createSplit = createSplit;
/**
 * GET /split/:bookingID
 * Get all split payment details for a booking.
 */
const getSplitsByBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield splitService.getSplitsByBooking(req.params.bookingID);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        if (error.message.includes('not found')) {
            res.status(404).json({ success: false, message: error.message });
            return;
        }
        res.status(400).json({
            success: false,
            message: error.message || 'Error fetching split details',
        });
    }
});
exports.getSplitsByBooking = getSplitsByBooking;
/**
 * POST /split/pay
 * Pay the authenticated user's share of a split.
 * Body: { bookingID }
 */
const payShare = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const { bookingID } = req.body;
        const result = yield splitService.payShare(bookingID, userID);
        res.status(200).json({
            success: true,
            message: result.allPaid
                ? 'All shares paid! Booking is now confirmed.'
                : 'Your share has been paid successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error processing payment',
        });
    }
});
exports.payShare = payShare;
