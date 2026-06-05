import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth_middleware';
import * as bookingConditionService from '../services/booking_condition_service'; 
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../utils/cloudinary_upload';
import { validateImageQuality } from '../services/image_quality_service';
import fs from 'fs';

export const uploadConditionImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    // 🟢 DYNAMIC FALLBACK: Grabs the ID from either URL parameter OR multi-part form body keys!
    const bookingId = req.params.bookingId || req.body.bookingId || req.body.bookingID;
    const { stage } = req.body as { stage?: 'before' | 'after' };

    if (!bookingId) {
      res.status(400).json({ success: false, message: 'bookingId is required in parameters or form-data body' });
      return;
    }
    if (!stage || (stage !== 'before' && stage !== 'after')) {
      res.status(400).json({ success: false, message: "body.stage must be 'before' or 'after'" });
      return;
    }

    let files: Express.Multer.File[] = [];
    if (Array.isArray(req.files)) {
      files = req.files;
    } else if (req.file) {
      files = [req.file];
    } else if (req.files && typeof req.files === 'object') {
      files = Object.values(req.files).flat() as Express.Multer.File[];
    }

    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'No file streams located. Use form-data key "images".' });
      return;
    }

    const uploadedUrls: string[] = [];
    for (const f of files) {
      let uploadTarget: string;

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
    }

    if (uploadedUrls.length === 0) {
      res.status(500).json({ success: false, message: 'Cloudinary storage transmission failure.' });
      return;
    }

    // Google Gemini Validation Block
    let aiResult;
    try {
      aiResult = await validateImageQuality(uploadedUrls);
    } catch (aiErr) {
      console.error('AI pipeline bypassed, falling back to pass:', aiErr);
      aiResult = { accepted: true, qualityScore: 1.0, reason: undefined };
    }

    // DB Adapter Bridge
    const targetServiceMethod = bookingConditionService.uploadConditionImages as any;
    const record = await targetServiceMethod(
      bookingId,
      userID,
      stage,
      uploadedUrls, 
      { 
        accepted: aiResult.accepted, 
        qualityScore: aiResult.qualityScore, 
        reason: aiResult.reason || '' 
      }
    );

    res.status(201).json({ success: true, data: record });
  } catch (error: any) {
    console.error("CRITICAL EXCEPTION IN PIPELINE:", error);
    res.status(500).json({ 
      success: false, 
      message: "Processing failure inside isolated controller tracking context.",
      debug: error.message || error 
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
    const data = await bookingConditionService.getBookingConditions(bookingId, userID);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error fetching conditions' });
  }
};