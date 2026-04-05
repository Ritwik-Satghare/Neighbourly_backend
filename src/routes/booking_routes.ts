import { Router } from 'express';
import * as bookingController from '../controllers/booking_controller';
import * as bookingConditionController from '../controllers/booking_condition_controller';
import { authenticateJWT } from '../middlewares/auth_middleware';
import { validateRequest } from '../middlewares/validation_middleware';

const router = Router();

// All booking routes require authentication
router.use(authenticateJWT);

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
router.patch(
  '/status/:id',
  validateRequest(bookingController.updateStatusSchema),
  bookingController.updateBookingStatus
);

// ─── Booking Condition Images ────────────────────────────────────────────────

// POST /booking/upload-condition — Upload a before/after condition image
router.post(
  '/upload-condition',
  validateRequest(bookingConditionController.uploadConditionSchema),
  bookingConditionController.uploadConditionImage
);

// GET /booking/condition/:bookingID — Get all condition images for a booking
router.get('/condition/:bookingID', bookingConditionController.getConditionImages);

export default router;
