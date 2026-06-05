import { Router } from 'express';
import * as bookingConditionController from '../controllers/booking_condition_controller'; 
import { authenticateJWT } from '../middlewares/auth_middleware';
import multer from 'multer';

const router = Router();

// FIX: Swapped from local disk storage to memory storage to prevent permission errors on Render
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST /api/bookings/:bookingId/condition
router.post(
  '/:bookingId/condition', 
  authenticateJWT, 
  upload.array('images', 5), 
  bookingConditionController.uploadConditionImage
);

// GET /api/bookings/:bookingId/condition
router.get(
  '/:bookingId/condition', 
  authenticateJWT, 
  bookingConditionController.getConditionImages
);

export default router;