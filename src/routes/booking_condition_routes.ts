import { Router } from 'express';
import * as bookingConditionController from '../controllers/booking_condition_controller'; // Point to the updated controller file
import { authenticateJWT } from '../middlewares/auth_middleware';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// POST /api/bookings/:bookingId/condition
// Targets 'uploadConditionImage' (singular) and catches the 'images' field name from Postman
router.post(
  '/:bookingId/condition', 
  authenticateJWT, 
  upload.array('images', 5), 
  bookingConditionController.uploadConditionImage
);

// GET /api/bookings/:bookingId/condition
// Targets 'getConditionImages' from the updated controller
router.get(
  '/:bookingId/condition', 
  authenticateJWT, 
  bookingConditionController.getConditionImages
);

export default router;