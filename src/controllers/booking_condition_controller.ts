import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth_middleware';
import * as bookingConditionService from '../services/booking_condition_service'; 
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../utils/cloudinary_upload';
import { validateImageQuality } from '../services/image_quality_service';
import { z } from 'zod';
import fs from 'fs';

export const uploadConditionSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1, 'Booking ID is required'),
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

    // Safely look up the booking ID across all common naming patterns
    const bookingId = req.params.bookingId || req.body.bookingId || req.body.bookingID;
    const { stage } = req.body as { stage?: 'before' | 'after' };

    if (!bookingId) {
      res.status(400).json({ success: false, message: 'bookingId parameter is required' });
      return;
    }
    if (!stage || (stage !== 'before' && stage !== 'after')) {
      res.status(400).json({ success: false, message: "body.stage must be 'before' or 'after'" });
      return;
    }

    // Extract files dynamically from Multer's different possible parsing behaviors (.array() or .any())
    let files: Express.Multer.File[] = [];
    if (Array.isArray(req.files)) {
      files = req.files;
    } else if (req.file) {
      files = [req.file];
    } else if (req.files && typeof req.files === 'object') {
      files = Object.values(req.files).flat() as Express.Multer.File[];
    }

    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'No files uploaded. Make sure your Postman file key is named exactly "images".' });
      return;
    }

    const uploadedUrls: string[] = [];
    for (const f of files) {
      let uploadTarget: string;

      // Convert buffer to Base64 Data URI string for memoryStorage setups
      if (f.buffer) {
        const base64Data = f.buffer.toString('base64');
        uploadTarget = `data:${f.mimetype};base64,${base64Data}`;
      } else if (f.path) {
        uploadTarget = f.path;
      } else {
        continue;
      }

      const resp = await uploadToCloudinary(uploadTarget);
      const anyResp = resp as any;
      if (resp && (anyResp.secure_url || anyResp.url)) {
        uploadedUrls.push(anyResp.secure_url || anyResp.url);
      }

      // Local diskStorage cleanup fallback
      if (f.path && fs.existsSync(f.path)) {
        try {
          fs.unlinkSync(f.path);
        } catch (err) {
          console.error('Temporary file cleanup deferred:', err);
        }
      }
    }

    if (uploadedUrls.length === 0) {
      res.status(500).json({ success: false, message: 'Failed to upload images to Cloudinary.' });
      return;
    }

    // Google Gemini Image Quality Pipeline Isolation Boundary
    let aiResult;
    try {
      aiResult = await validateImageQuality(uploadedUrls);
    } catch (aiErr) {
      console.error('AI validation error, proceeding with default pass flags:', aiErr);
      aiResult = { accepted: true, qualityScore: 1.0, reason: undefined };
    }

    // If Gemini explicitly rejects the image quality, rollback the Cloudinary uploads
    if (!aiResult.accepted) {
      for (const url of uploadedUrls) {
        try {
          const publicId = extractPublicId(url);
          if (publicId) await deleteFromCloudinary(publicId);
        } catch (delErr) {
          console.error('Failed to delete Cloudinary image during rollback:', delErr);
        }
      }
      res.status(400).json({ success: false, message: aiResult.reason || 'Image validation failed' });
      return;
    }

    // 🟢 CRITICAL SYNC: Explicitly passing fields to match what your Mongoose validation needs
    const record = await bookingConditionService.uploadConditionImages(
      bookingId,
      userID,
      stage,
      uploadedUrls, // Passing the full array down to the service layer
      { 
        accepted: aiResult.accepted, 
        qualityScore: aiResult.qualityScore, 
        reason: aiResult.reason 
      }
    );

    res.status(201).json({ success: true, data: record });
  } catch (error: any) {
    console.error("CRITICAL EXCEPTION IN UPLOAD PIPELINE:", error);
    if (error.message && error.message.includes('Forbidden')) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    res.status(500).json({ 
      success: false, 
      message: "Internal processing failure caught in isolation context.",
      debugDetails: error.message || error 
    });
  }
};

export const getConditionImages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const bookingId = req.params.bookingId || req.body.bookingId || req.body.bookingID;
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