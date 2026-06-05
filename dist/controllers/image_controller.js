"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImages = void 0;
const imageService = __importStar(require("../services/image_service"));
const uploadImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const image = yield imageService.uploadListingImage(listingID, userID, file.path);
        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            data: image
        });
    }
    catch (error) {
        if (error.message.includes('Forbidden') || error.message.includes('owner')) {
            res.status(403).json({ success: false, message: error.message });
            return;
        }
        res.status(400).json({ success: false, message: error.message || 'Error uploading image' });
    }
});
exports.uploadImages = uploadImages;
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { imageID } = req.params;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        yield imageService.deleteListingImage(imageID, userID);
        res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
            data: {}
        });
    }
    catch (error) {
        if (error.message.includes('Forbidden') || error.message.includes('owner')) {
            res.status(403).json({ success: false, message: error.message });
            return;
        }
        res.status(400).json({ success: false, message: error.message || 'Error deleting image' });
    }
});
exports.deleteImage = deleteImage;
