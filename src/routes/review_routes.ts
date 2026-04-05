import { Router } from 'express';
import * as reviewController from '../controllers/review_controller';
import { authenticateJWT } from '../middlewares/auth_middleware';
import { validateRequest } from '../middlewares/validation_middleware';

const router = Router();

// POST /review/create — Create a review (auth required)
router.post(
  '/create',
  authenticateJWT,
  validateRequest(reviewController.createReviewSchema),
  reviewController.createReview
);

// GET /review/list/:listingID — Get all reviews for a listing (public)
router.get(
  '/list/:listingID',
  reviewController.getReviewsByListing
);

// GET /review/user/:userID — Get all reviews for a user's listings (public)
router.get(
  '/user/:userID',
  reviewController.getReviewsByUser
);

export default router;
