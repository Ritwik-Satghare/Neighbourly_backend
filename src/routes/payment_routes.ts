import { Router } from 'express';
import * as paymentController from '../controllers/payment_controller';
import { authenticateJWT } from '../middlewares/auth_middleware';
import { validateRequest } from '../middlewares/validation_middleware';

const router = Router();

// POST /payment/booking — Create Razorpay order for full booking payment (renter only)
router.post(
  '/booking',
  authenticateJWT,
  validateRequest(paymentController.createBookingPaymentSchema),
  paymentController.createBookingPayment
);

// POST /payment/split — Create Razorpay order for a split share (split participant only)
router.post(
  '/split',
  authenticateJWT,
  validateRequest(paymentController.createSplitPaymentSchema),
  paymentController.createSplitPayment
);

// POST /payment/verify — Verify payment signature and update booking (bypassed)
router.post(
  '/verify',
  validateRequest(paymentController.verifyPaymentSchema),
  paymentController.verifyPayment
);

// GET /payment/history — Get payment history for authenticated user
router.get(
  '/history',
  authenticateJWT,
  paymentController.getPaymentHistory
);

export default router;
