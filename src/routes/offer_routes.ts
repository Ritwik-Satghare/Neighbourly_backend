import { Router } from 'express';
import * as offerController from '../controllers/offer_controller';
import { authenticateJWT } from '../middlewares/auth_middleware';
import { validateRequest } from '../middlewares/validation_middleware';

const router = Router();

// All offer routes require authentication
router.use(authenticateJWT);

// POST /offer/create — Send an offer on a listing
router.post(
  '/create',
  validateRequest(offerController.createOfferSchema),
  offerController.createOffer
);

// GET /offer/list — List offers (query: type=sent|received, listingID)
router.get('/list', offerController.listOffers);

// PATCH /offer/accept/:id — Accept an offer (owner only, creates booking)
router.patch('/accept/:id', offerController.acceptOffer);

// PATCH /offer/reject/:id — Reject an offer (owner only)
router.patch('/reject/:id', offerController.rejectOffer);

export default router;
