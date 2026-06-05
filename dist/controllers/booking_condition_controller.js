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
exports.getConditionImages = exports.uploadConditionImage = exports.uploadConditionSchema = void 0;
const bookingConditionService = __importStar(require("../services/booking_condition_service"));
const zod_1 = require("zod");
// ─── Validation Schemas ──────────────────────────────────────────────────────
exports.uploadConditionSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingID: zod_1.z.string().min(1, 'Booking ID is required'),
        imageURL: zod_1.z.string().url('Image URL must be a valid URL'),
        stage: zod_1.z.enum(['before', 'after'], {
            errorMap: () => ({ message: "Stage must be 'before' or 'after'" }),
        }),
        notes: zod_1.z.string().optional(),
    }),
});
// ─── Controllers ─────────────────────────────────────────────────────────────
/**
 * POST /booking/upload-condition
 * Upload a before/after condition image for a booking.
 */
const uploadConditionImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const { bookingID, imageURL, stage, notes } = req.body;
        const conditionImage = yield bookingConditionService.uploadConditionImage(bookingID, userID, { imageURL, stage, notes });
        res.status(201).json({
            success: true,
            message: `Condition image (${stage}) uploaded successfully`,
            data: conditionImage,
        });
    }
    catch (error) {
        if (error.message.includes('Forbidden')) {
            res.status(403).json({ success: false, message: error.message });
            return;
        }
        res.status(400).json({
            success: false,
            message: error.message || 'Error uploading condition image',
        });
    }
});
exports.uploadConditionImage = uploadConditionImage;
/**
 * GET /booking/condition/:bookingID
 * Get all condition images for a booking.
 */
const getConditionImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const images = yield bookingConditionService.getConditionImages(req.params.bookingID, userID);
        res.status(200).json({
            success: true,
            data: images,
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
        res.status(400).json({
            success: false,
            message: error.message || 'Error fetching condition images',
        });
    }
});
exports.getConditionImages = getConditionImages;
