import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth_middleware';
import * as paymentService from '../services/payment_service';
import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    bookingID: z.string().min(1, 'Booking ID is required'),
    amount: z.number().positive('Amount must be positive'),
    type: z.enum(['booking_payment', 'split_payment', 'refund']).optional(),
  }),
});

export const createPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { bookingID, amount, type } = req.body;
    const result = await paymentService.createOrder(userID, bookingID, amount, type);

    res.status(201).json({
      success: true,
      message: 'Payment order created successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error creating payment' });
  }
};

export const paymentWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ success: false, message: 'Missing payment verification fields' });
      return;
    }

    const transaction = await paymentService.verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: transaction,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Payment verification failed' });
  }
};

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
    res.status(400).json({ success: false, message: error.message || 'Error fetching payment history' });
  }
};
