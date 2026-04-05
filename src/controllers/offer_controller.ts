import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth_middleware';
import * as offerService from '../services/offer_service';
import { z } from 'zod';

// ─── Validation Schemas ──────────────────────────────────────────────────────

export const createOfferSchema = z.object({
  body: z.object({
    listingID: z.string().min(1, 'Listing ID is required'),
    amount: z.number().positive('Amount must be positive'),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid start date'),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid end date'),
    note: z.string().optional(),
  }),
});

// ─── Controllers ─────────────────────────────────────────────────────────────

export const createOffer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const offer = await offerService.createOffer(userID, req.body);

    res.status(201).json({
      success: true,
      message: 'Offer sent successfully',
      data: offer,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error sending offer' });
  }
};

export const listOffers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const offers = await offerService.listOffers(userID, req.query);

    res.status(200).json({
      success: true,
      message: 'Offers fetched successfully',
      data: offers,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error fetching offers' });
  }
};

export const acceptOffer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    const { id } = req.params;

    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { offer, booking } = await offerService.acceptOffer(id, userID);

    res.status(200).json({
      success: true,
      message: 'Offer accepted and booking created',
      data: { offer, booking },
    });
  } catch (error: any) {
    if (error.message.includes('Forbidden')) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    res.status(400).json({ success: false, message: error.message || 'Error accepting offer' });
  }
};

export const rejectOffer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    const { id } = req.params;

    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const offer = await offerService.rejectOffer(id, userID);

    res.status(200).json({
      success: true,
      message: 'Offer rejected successfully',
      data: offer,
    });
  } catch (error: any) {
    if (error.message.includes('Forbidden')) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    res.status(400).json({ success: false, message: error.message || 'Error rejecting offer' });
  }
};
