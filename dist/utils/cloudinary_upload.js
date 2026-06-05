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
exports.extractPublicId = exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = (localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!localFilePath)
            return null;
        // Upload the file on cloudinary
        const response = yield cloudinary_1.v2.uploader.upload(localFilePath, {
            resource_type: 'auto',
            folder: 'neighbourly_listings'
        });
        // File has been uploaded successfully, now safely remove local temp file
        if (fs_1.default.existsSync(localFilePath)) {
            fs_1.default.unlinkSync(localFilePath);
        }
        return response;
    }
    catch (error) {
        // Remove the locally saved temporary file as the upload operation got failed
        if (fs_1.default.existsSync(localFilePath)) {
            fs_1.default.unlinkSync(localFilePath);
        }
        return null;
    }
});
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield cloudinary_1.v2.uploader.destroy(publicId);
        return response.result === 'ok';
    }
    catch (error) {
        console.error("Cloudinary delete error: ", error);
        return false;
    }
});
exports.deleteFromCloudinary = deleteFromCloudinary;
// Extract public_id from Cloudinary URL
const extractPublicId = (url) => {
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
    }
    catch (error) {
        return "";
    }
};
exports.extractPublicId = extractPublicId;
