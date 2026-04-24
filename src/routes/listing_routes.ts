import { Router } from 'express';
import multer from 'multer';
import * as listingController from '../controllers/listing_controller';
import * as imageController from '../controllers/image_controller';
import { authenticateJWT } from '../middlewares/auth_middleware';
import { validateRequest } from '../middlewares/validation_middleware';

const router = Router();

// Configure Multer for temporary local storage before uploading to Cloudinary
const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });

// ======== Listing Routes ========

router.post(
  '/create', 
  authenticateJWT, 
  validateRequest(listingController.createListingSchema), 
  listingController.createListing
);

router.patch(
  '/update/:id', 
  authenticateJWT, 
  validateRequest(listingController.updateListingSchema), 
  listingController.updateListing
);

router.delete(
  '/delete/:id', 
  authenticateJWT, 
  listingController.deleteListing
);

router.get('/nearby', listingController.getNearbyListings);
router.get('/search', listingController.searchListings);
router.get('/all', listingController.getAllListings);
router.get('/user/:userID', listingController.getListingsByUser);
router.get('/:id', listingController.getListingById);


// ======== Image Routes ========

router.post(
  '/upload-images',
  authenticateJWT,
  upload.single('image'),
  imageController.uploadImages
);

router.delete(
  '/image/:imageID',
  authenticateJWT,
  imageController.deleteImage
);

export default router;
