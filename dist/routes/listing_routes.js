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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const listingController = __importStar(require("../controllers/listing_controller"));
const imageController = __importStar(require("../controllers/image_controller"));
const auth_middleware_1 = require("../middlewares/auth_middleware");
const validation_middleware_1 = require("../middlewares/validation_middleware");
const router = (0, express_1.Router)();
// Configure Multer for temporary local storage before uploading to Cloudinary
const upload = (0, multer_1.default)({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });
// ======== Listing Routes ========
router.post('/create', auth_middleware_1.authenticateJWT, (0, validation_middleware_1.validateRequest)(listingController.createListingSchema), listingController.createListing);
router.patch('/update/:id', auth_middleware_1.authenticateJWT, (0, validation_middleware_1.validateRequest)(listingController.updateListingSchema), listingController.updateListing);
router.delete('/delete/:id', auth_middleware_1.authenticateJWT, listingController.deleteListing);
router.get('/all', listingController.getAllListings);
router.get('/user/:userID', listingController.getListingsByUser);
router.get('/:id', listingController.getListingById);
// ======== Image Routes ========
router.post('/upload-images', auth_middleware_1.authenticateJWT, upload.single('image'), imageController.uploadImages);
router.delete('/image/:imageID', auth_middleware_1.authenticateJWT, imageController.deleteImage);
exports.default = router;
