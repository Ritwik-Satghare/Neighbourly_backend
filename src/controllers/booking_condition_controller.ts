import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth_middleware';
import * as bookingConditionService from '../services/booking_condition_service';
import { z } from 'zod';

// ─── Validation Schemas ──────────────────────────────────────────────────────

export const uploadConditionSchema = z.object({
  body: z.object({
    bookingID: z.string().min(1, 'Booking ID is required'),
    imageURL: z.string().url('Image URL must be a valid URL'),
    stage: z.enum(['before', 'after'], {
      errorMap: () => ({ message: "Stage must be 'before' or 'after'" }),
    }),
    notes: z.string().optional(),
  }),
});

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /booking/upload-condition
 * Upload a before/after condition image for a booking.
 */
export const uploadConditionImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { bookingID, imageURL, stage, notes } = req.body;

    const conditionImage = await bookingConditionService.uploadConditionImage(
      bookingID,
      userID,
      { imageURL, stage, notes }
    );

    res.status(201).json({
      success: true,
      message: `Condition image (${stage}) uploaded successfully`,
      data: conditionImage,
    });
  } catch (error: any) {
    if (error.message.includes('Forbidden')) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    res.status(400).json({
      success: false,
      message: error.message || 'Error uploading condition image',
    });
  }
};

/**
 * GET /booking/condition/:bookingID
 * Get all condition images for a booking.
 */
export const getConditionImages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const images = await bookingConditionService.getConditionImages(
      req.params.bookingID,
      userID
    );

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error: any) {
    if (error.message.includes('Forbidden')) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    if (error.message.includes('not found')) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    res.status(400).json({
      success: false,
      message: error.message || 'Error fetching condition images',
    });
  }
};
