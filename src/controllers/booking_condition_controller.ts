import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth_middleware';
import * as bookingConditionService from '../services/booking_condition_service'; 
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../utils/cloudinary_upload';
import { validateImageQuality } from '../services/image_quality_service';
import { z } from 'zod';
import fs from 'fs';

export const uploadConditionSchema = z.object({
  params: z.object({
    bookingId: z.string().min(1, 'Booking ID is required'),
  }),
  body: z.object({
    stage: z.enum(['before', 'after'], { required_error: "Stage must be 'before' or 'after'" }),
    notes: z.string().optional(),
  }),
});

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

    const files = (req.files as Express.Multer.File[]) || [];
    if (!files.length) {
      res.status(400).json({ success: false, message: 'No files uploaded.' });
      return;
    }

    const uploadedUrls: string[] = [];
    for (const f of files) {
      let uploadTarget: string;

      // Safe check: If Multer uses memoryStorage, convert the buffer to a base64 Data URI string for Cloudinary
      if (f.buffer) {
        const base64Data = f.buffer.toString('base64');
        uploadTarget = `data:${f.mimetype};base64,${base64Data}`;
      } else {
        // Fallback for local diskStorage testing
        uploadTarget = f.path;
      }

      const resp = await uploadToCloudinary(uploadTarget);
      const anyResp = resp as any;
      if (resp && (anyResp.secure_url || anyResp.url)) {
        uploadedUrls.push(anyResp.secure_url || anyResp.url);
      }

      // Clean up local temp files if diskStorage was used
      if (!f.buffer && f.path && fs.existsSync(f.path)) {
        fs.unlinkSync(f.path);
      }
    }

    let aiResult;
    try {
      aiResult = await validateImageQuality(uploadedUrls);
    } catch (aiErr) {
      console.error('AI validation error, proceeding:', aiErr);
      aiResult = { accepted: true, qualityScore: 1.0 };
    }

    if (!aiResult.accepted) {
      for (const url of uploadedUrls) {
        try {
          const publicId = extractPublicId(url);
          if (publicId) await deleteFromCloudinary(publicId);
        } catch (delErr) {
          console.error('Failed to delete cloudinary image:', delErr);
        }
      }
      res.status(400).json({ success: false, message: aiResult.reason || 'Image validation failed' });
      return;
    }

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
    res.status(400).json({ success: false, message: error.message || 'Error uploading images' });
  }
};

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
    res.status(400).json({ success: false, message: error.message || 'Error fetching conditions' });
  }
};
