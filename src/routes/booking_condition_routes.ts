import { Router } from 'express';
import * as bookingConditionController from '../controllers/booking_condition_controller'; 
import { authenticateJWT } from '../middlewares/auth_middleware';
import multer from 'multer';

const router = Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Path A: Matches flat structure -> /booking/upload-condition
router.post(
  '/upload-condition', 
  authenticateJWT, 
  upload.array('images', 5), 
  bookingConditionController.uploadConditionImage
);

// Path B: Matches dynamic parameter structure -> /booking/:bookingId/condition
router.post(
  '/:bookingId/condition', 
  authenticateJWT, 
  upload.array('images', 5), 
  bookingConditionController.uploadConditionImage
);

// GET Handler
router.get(
  '/:bookingId/condition', 
  authenticateJWT, 
  bookingConditionController.getConditionImages
);

export default router;