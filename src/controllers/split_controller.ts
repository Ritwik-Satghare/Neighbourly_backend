import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth_middleware';
import * as splitService from '../services/split_service';
import { z } from 'zod';

// ─── Validation Schemas ──────────────────────────────────────────────────────

export const createSplitSchema = z.object({
  body: z.object({
    bookingID: z.string().min(1, 'Booking ID is required'),
    splits: z
      .array(
        z.object({
          userID: z.string().min(1, 'User ID is required'),
          amount: z.number().positive('Amount must be positive'),
        })
      )
      .min(2, 'At least 2 users are required for a split'),
  }),
});

export const payShareSchema = z.object({
  body: z.object({
    bookingID: z.string().min(1, 'Booking ID is required'),
  }),
});

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /split/create
 * Create split payments for a booking.
 * Body: { bookingID, splits: [{ userID, amount }] }
 */
export const createSplit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { bookingID, splits } = req.body;
    const createdSplits = await splitService.createSplit(bookingID, userID, splits);

    res.status(201).json({
      success: true,
      message: 'Split payments created successfully',
      data: createdSplits,
    });
  } catch (error: any) {
    if (error.message.includes('Forbidden')) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating split payments',
    });
  }
};

/**
 * GET /split/:bookingID
 * Get all split payment details for a booking.
 */
export const getSplitsByBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await splitService.getSplitsByBooking(req.params.bookingID);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    if (error.message.includes('not found')) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    res.status(400).json({
      success: false,
      message: error.message || 'Error fetching split details',
    });
  }
};

/**
 * POST /split/pay
 * Pay the authenticated user's share of a split.
 * Body: { bookingID }
 */
export const payShare = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { bookingID } = req.body;
    const result = await splitService.payShare(bookingID, userID);

    res.status(200).json({
      success: true,
      message: result.allPaid
        ? 'All shares paid! Booking is now confirmed.'
        : 'Your share has been paid successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error processing payment',
    });
  }
};
