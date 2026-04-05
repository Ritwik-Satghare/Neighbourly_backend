import { Router } from 'express';
import * as paymentController from '../controllers/payment_controller';
import { authenticateJWT } from '../middlewares/auth_middleware';
import { validateRequest } from '../middlewares/validation_middleware';

const router = Router();

// POST /payment/create — Create a Razorpay payment order
router.post(
  '/create',
  authenticateJWT,
  validateRequest(paymentController.createPaymentSchema),
  paymentController.createPayment
);

// POST /payment/webhook — Verify Razorpay payment (called by client after payment)
router.post(
  '/webhook',
  paymentController.paymentWebhook
);

// GET /payment/history — Get payment history for authenticated user
router.get(
  '/history',
  authenticateJWT,
  paymentController.getPaymentHistory
);

export default router;
