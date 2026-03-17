import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (localFilePath: string): Promise<UploadApiResponse | null> => {
  try {
    if (!localFilePath) return null;
    
    // Upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: 'neighbourly_listings'
    });
    
    // File has been uploaded successfully, now safely remove local temp file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    
    return response;
  } catch (error) {
    // Remove the locally saved temporary file as the upload operation got failed
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    const response = await cloudinary.uploader.destroy(publicId);
    return response.result === 'ok';
  } catch (error) {
    console.error("Cloudinary delete error: ", error);
    return false;
  }
};

// Extract public_id from Cloudinary URL
export const extractPublicId = (url: string): string => {
  try {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const filenameParts = lastPart.split('.');
    
    // Check if there is a folder structure
    const folderMatch = url.match(/\/v\d+\/(.+)\.\w+$/);
    if (folderMatch && folderMatch[1]) {
      return folderMatch[1];
    }
    
    return filenameParts[0];
  } catch (error) {
    return "";
  }
};
