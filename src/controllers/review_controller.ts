import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth_middleware';
import * as reviewService from '../services/review_service';
import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    listingID: z.string().min(1, 'Listing ID is required'),
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    comment: z.string().optional(),
  }),
});

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { listingID, rating, comment } = req.body;
    const review = await reviewService.createReview(userID, listingID, rating, comment);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review,
    });
  } catch (error: any) {
    if (error.message.includes('already reviewed')) {
      res.status(409).json({ success: false, message: error.message });
      return;
    }
    res.status(400).json({ success: false, message: error.message || 'Error creating review' });
  }
};

export const getReviewsByListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listingID } = req.params;
    const reviews = await reviewService.getReviewsByListing(listingID);

    res.status(200).json({
      success: true,
      message: 'Reviews fetched successfully',
      data: reviews,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error fetching reviews' });
  }
};

export const getReviewsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userID } = req.params;
    const reviews = await reviewService.getReviewsByUser(userID);

    res.status(200).json({
      success: true,
      message: 'Reviews fetched successfully',
      data: reviews,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error fetching user reviews' });
  }
};
