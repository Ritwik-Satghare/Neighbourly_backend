import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth_middleware';
import * as bookingConditionService from '../services/booking_condition_service'; 
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../utils/cloudinary_upload';
import { validateImageQuality } from '../services/image_quality_service';
import { z } from 'zod';

// ─── Validation Schemas ──────────────────────────────────────────────────────

export const uploadConditionSchema = z.object({
  params: z.object({
    bookingId: z.string().min(1, 'Booking ID is required'),
  }),
  body: z.object({
    stage: z.enum(['before', 'after'], { required_error: "Stage must be 'before' or 'after'" }),
    notes: z.string().optional(),
  }),
});

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/bookings/:bookingId/condition
 * Expects multipart/form-data with files under field name `images` and body.stage = 'before'|'after'
 */
export const uploadConditionImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { bookingId } = req.params;
    const { stage } = req.body as { stage?: 'before' | 'after' };

    if (!bookingId) {
      res.status(400).json({ success: false, message: 'bookingId parameter is required' });
      return;
    }
    if (!stage || (stage !== 'before' && stage !== 'after')) {
      res.status(400).json({ success: false, message: "body.stage must be 'before' or 'after'" });
      return;
    }

    // Capture files attached via form-data key: 'images'
    const files = (req.files as Express.Multer.File[]) || [];
    if (!files.length) {
      res.status(400).json({ success: false, message: 'No files uploaded. Make sure your form field key is named "images"' });
      return;
    }

    const uploadedUrls: string[] = [];

    // Process file tracks to Cloudinary
    for (const f of files) {
      const resp = await uploadToCloudinary(f.path);
      const anyResp = resp as any;
      if (resp && (anyResp.secure_url || anyResp.url)) {
        uploadedUrls.push(anyResp.secure_url || anyResp.url);
      }
    }

    // Run AI quality gate verification on the uploaded image links via Google Gemini
    let aiResult;
    try {
      aiResult = await validateImageQuality(uploadedUrls);
    } catch (aiErr) {
      // Fail-open strategy to ensure core app operational flow continues uninterrupted if Gemini falls offline
      console.error('AI validation error, proceeding with accept:', aiErr);
      aiResult = { accepted: true, qualityScore: 1.0 };
    }

    if (!aiResult.accepted) {
      // Discard files from storage instantly if evaluation yields unsatisfactory results
      for (const url of uploadedUrls) {
        try {
          const publicId = extractPublicId(url);
          if (publicId) await deleteFromCloudinary(publicId);
        } catch (delErr) {
          console.error('Failed to delete cloudinary image after AI rejection:', delErr);
        }
      }

      res.status(400).json({ success: false, message: aiResult.reason || 'Image validation failed' });
      return;
    }

    // Pass structured datasets downward to persistence tier
    const record = await bookingConditionService.uploadConditionImages(
      bookingId,
      userID,
      stage,
      uploadedUrls,
      { accepted: aiResult.accepted, qualityScore: aiResult.qualityScore, reason: aiResult.reason }
    );

    res.status(201).json({ success: true, data: record });
  } catch (error: any) {
    if (error.message && error.message.includes('Forbidden')) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    res.status(400).json({ success: false, message: error.message || 'Error uploading condition images' });
  }
};

/**
 * GET /api/bookings/:bookingId/condition
 * Aggregates all captured assets and difference assessment summaries for processing
 */
export const getConditionImages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { bookingId } = req.params;
    if (!bookingId) {
      res.status(400).json({ success: false, message: 'bookingId parameter is required' });
      return;
    }

    const data = await bookingConditionService.getBookingConditions(bookingId, userID);

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    if (error.message && error.message.includes('Forbidden')) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    if (error.message && error.message.includes('not found')) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    res.status(400).json({ success: false, message: error.message || 'Error fetching booking conditions' });
  }
};