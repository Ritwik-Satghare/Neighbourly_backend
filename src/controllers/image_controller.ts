import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth_middleware';
import * as imageService from '../services/image_service';

export const uploadImages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    const listingID = req.body.listingID;

    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    if (!listingID) {
      res.status(400).json({ success: false, message: 'listingID is required' });
      return;
    }

    if (!req.file && (!req.files || req.files.length === 0)) {
      res.status(400).json({ success: false, message: 'No image provided' });
      return;
    }

    // Assuming single upload for simplicity using multer `upload.single('image')`
    const file = req.file; 
    if (!file) {
      res.status(400).json({ success: false, message: 'Image file required' });
      return;
    }

    const image = await imageService.uploadListingImage(listingID, userID, file.path);
    
    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: image
    });
  } catch (error: any) {
    if (error.message.includes('Forbidden') || error.message.includes('owner')) {
         res.status(403).json({ success: false, message: error.message });
         return;
    }
    res.status(400).json({ success: false, message: error.message || 'Error uploading image' });
  }
};

export const deleteImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    const { imageID } = req.params;

    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    await imageService.deleteListingImage(imageID, userID);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: {}
    });
  } catch (error: any) {
    if (error.message.includes('Forbidden') || error.message.includes('owner')) {
         res.status(403).json({ success: false, message: error.message });
         return;
    }
    res.status(400).json({ success: false, message: error.message || 'Error deleting image' });
  }
};
