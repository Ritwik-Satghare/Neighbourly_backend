import { Router } from 'express';
import * as bookingController from '../controllers/booking_controller';
import * as bookingConditionController from '../controllers/booking_condition_controller';
import { authenticateJWT } from '../middlewares/auth_middleware';
import { validateRequest } from '../middlewares/validation_middleware';
import multer from 'multer';

const router = Router();

// Configure type-safe memory stream upload for handling binary arrays
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// All booking routes require authentication
router.use(authenticateJWT);

// ─── Booking CRUD ────────────────────────────────────────────────────────────

router.get('/user', bookingController.getUserBookings);
router.get('/:id', bookingController.getBookingById);
router.patch('/cancel/:id', bookingController.cancelBooking);

router.patch(
  '/status/:id',
  validateRequest(bookingController.updateStatusSchema),
  bookingController.updateBookingStatus
);

// ─── Rental Lifecycle ──────────────────────────────────────────────────────

router.patch('/start/:id', bookingController.startRental);
router.patch('/return/:id', bookingController.returnRental);

// ─── Booking Condition Images (Phase-1 Unified) ──────────────────────────────

// POST /booking/upload-condition
// Swapped out validateRequest for Multer parsing to handle binary images seamlessly!
router.post(
  '/upload-condition',
  upload.array('images', 5), 
  bookingConditionController.uploadConditionImage
);

// GET /booking/condition/:bookingId
router.get('/condition/:bookingId', bookingConditionController.getConditionImages);

export default router;