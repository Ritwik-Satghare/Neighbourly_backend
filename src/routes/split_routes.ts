import { Router } from 'express';
import * as splitController from '../controllers/split_controller';
import { authenticateJWT } from '../middlewares/auth_middleware';
import { validateRequest } from '../middlewares/validation_middleware';

const router = Router();

// All split routes require authentication
router.use(authenticateJWT);

// POST /split/create — Create split payments for a booking
// Body: { bookingID, splits: [{ userID, amount }] }
router.post(
  '/create',
  validateRequest(splitController.createSplitSchema),
  splitController.createSplit
);

// GET /split/:bookingID — Get split payment details for a booking
router.get('/:bookingID', splitController.getSplitsByBooking);

// POST /split/pay — Pay your share of a split
// Body: { bookingID }
router.post(
  '/pay',
  validateRequest(splitController.payShareSchema),
  splitController.payShare
);

export default router;
