import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth_middleware';
import * as paymentService from '../services/payment_service';
import { z } from 'zod';

// ─── Validation Schemas ──────────────────────────────────────────────────────

export const createBookingPaymentSchema = z.object({
  body: z.object({
    bookingID: z.string().min(1, 'Booking ID is required'),
  }),
});

export const createSplitPaymentSchema = z.object({
  body: z.object({
    bookingID: z.string().min(1, 'Booking ID is required'),
    splitID: z.string().min(1, 'Split ID is required'),
  }),
});

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /payment/booking
 * Create a Razorpay order for a full booking payment.
 * Body: { bookingID }
 * Amount is determined server-side from booking.totalPrice.
 */
export const createBookingPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { bookingID } = req.body;
    const result = await paymentService.createBookingOrder(userID, bookingID);

    res.status(201).json({
      success: true,
      message: 'Payment order created successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Error in createBookingPayment:', error);
    const errMsg = error?.message || 'Error creating payment';
    if (typeof errMsg === 'string' && errMsg.includes('not found')) {
      res.status(404).json({ success: false, message: errMsg });
      return;
    }
    if (typeof errMsg === 'string' && errMsg.includes('Only the renter')) {
      res.status(403).json({ success: false, message: errMsg });
      return;
    }
    res.status(400).json({ success: false, message: errMsg });
  }
};

/**
 * POST /payment/split
 * Create a Razorpay order for a split participant's share.
 * Body: { bookingID, splitID }
 * Amount is determined server-side from split.amount.
 */
export const createSplitPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { bookingID, splitID } = req.body;
    const result = await paymentService.createSplitOrder(userID, bookingID, splitID);

    res.status(201).json({
      success: true,
      message: 'Split payment order created successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Error in createSplitPayment:', error);
    const errMsg = error?.message || 'Error creating split payment';
    if (typeof errMsg === 'string' && errMsg.includes('not found')) {
      res.status(404).json({ success: false, message: errMsg });
      return;
    }
    if (typeof errMsg === 'string' && errMsg.includes('does not belong to you')) {
      res.status(403).json({ success: false, message: errMsg });
      return;
    }
    res.status(400).json({ success: false, message: errMsg });
  }
};

/**
 * POST /payment/verify
 * Verify Razorpay payment signature and execute business side effects.
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *
 * This is a client-side callback verification endpoint, NOT a server-to-server webhook.
 */
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ success: false, message: 'Missing payment verification fields' });
      return;
    }

    const result = await paymentService.verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Error in verifyPayment:', error);
    res.status(400).json({ success: false, message: error?.message || 'Payment verification failed' });
  }
};

/**
 * GET /payment/history
 * Get payment history for the authenticated user.
 */
export const getPaymentHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const transactions = await paymentService.getPaymentHistory(userID);

    res.status(200).json({
      success: true,
      message: 'Payment history fetched successfully',
      data: transactions,
    });
  } catch (error: any) {
    console.error('Error in getPaymentHistory:', error);
    res.status(400).json({ success: false, message: error?.message || 'Error fetching payment history' });
  }
};
