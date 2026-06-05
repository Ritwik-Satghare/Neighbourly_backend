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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController = __importStar(require("../controllers/booking_controller"));
const bookingConditionController = __importStar(require("../controllers/booking_condition_controller"));
const auth_middleware_1 = require("../middlewares/auth_middleware");
const validation_middleware_1 = require("../middlewares/validation_middleware");
const router = (0, express_1.Router)();
// All booking routes require authentication
router.use(auth_middleware_1.authenticateJWT);
// ─── Booking CRUD ────────────────────────────────────────────────────────────
// GET /booking/user — Get all bookings for the authenticated user
// Query params: role (renter|owner), status (pending|confirmed|cancelled|completed)
router.get('/user', bookingController.getUserBookings);
// GET /booking/:id — Get a single booking by ID
router.get('/:id', bookingController.getBookingById);
// PATCH /booking/cancel/:id — Cancel a booking (renter only)
router.patch('/cancel/:id', bookingController.cancelBooking);
// PATCH /booking/status/:id — Update booking status (owner only)
// Body: { status: 'confirmed' | 'completed' }
router.patch('/status/:id', (0, validation_middleware_1.validateRequest)(bookingController.updateStatusSchema), bookingController.updateBookingStatus);
// ─── Booking Condition Images ────────────────────────────────────────────────
// POST /booking/upload-condition — Upload a before/after condition image
router.post('/upload-condition', (0, validation_middleware_1.validateRequest)(bookingConditionController.uploadConditionSchema), bookingConditionController.uploadConditionImage);
// GET /booking/condition/:bookingID — Get all condition images for a booking
router.get('/condition/:bookingID', bookingConditionController.getConditionImages);
exports.default = router;
