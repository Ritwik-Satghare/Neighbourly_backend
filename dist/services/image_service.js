"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteListingImage = exports.uploadListingImage = void 0;
const listing_model_1 = __importDefault(require("../models/listing_model"));
const listing_image_model_1 = __importDefault(require("../models/listing_image_model"));
const cloudinary_upload_1 = require("../utils/cloudinary_upload");
const uploadListingImage = (listingID, userID, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify ownership
    const listing = yield listing_model_1.default.findById(listingID);
    if (!listing) {
        throw new Error('Listing not found');
    }
    if (listing.ownerID !== userID) {
        throw new Error('Forbidden: You are not the owner of this listing');
    }
    // Check current image count
    const currentImagesCount = yield listing_image_model_1.default.countDocuments({ listingID });
    if (currentImagesCount >= 5) {
        throw new Error('Maximum of 5 images allowed per listing');
    }
    // Upload to Cloudinary
    const uploadResult = yield (0, cloudinary_upload_1.uploadToCloudinary)(localFilePath);
    if (!uploadResult) {
        throw new Error('Failed to upload image to Cloudinary');
    }
    // Save in DB
    const isPrimary = currentImagesCount === 0; // First uploaded image -> automatically set as primary
    const image = yield listing_image_model_1.default.create({
        listingID,
        imageUrl: uploadResult.secure_url,
        isPrimary,
    });
    return image;
});
exports.uploadListingImage = uploadListingImage;
const deleteListingImage = (imageID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    const image = yield listing_image_model_1.default.findById(imageID);
    if (!image) {
        throw new Error('Image not found');
    }
    // Verify ownership
    const listing = yield listing_model_1.default.findById(image.listingID);
    if (!listing) {
        throw new Error('Listing not found'); // Should not happen ideally
    }
    if (listing.ownerID !== userID) {
        throw new Error('Forbidden: You are not the owner of this listing');
    }
    // Delete from Cloudinary
    const publicId = (0, cloudinary_upload_1.extractPublicId)(image.imageUrl);
    if (publicId) {
        yield (0, cloudinary_upload_1.deleteFromCloudinary)(publicId);
    }
    // Delete from DB
    yield listing_image_model_1.default.findByIdAndDelete(imageID);
    // If deleted image was primary, assign another one if available
    if (image.isPrimary) {
        const remainingImage = yield listing_image_model_1.default.findOne({ listingID: image.listingID });
        if (remainingImage) {
            remainingImage.isPrimary = true;
            yield remainingImage.save();
        }
    }
    return true;
});
exports.deleteListingImage = deleteListingImage;
