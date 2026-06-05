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
exports.getListingsByUser = exports.getListingById = exports.getAllListings = exports.deleteListing = exports.updateListing = exports.createListing = void 0;
const listing_model_1 = __importDefault(require("../models/listing_model"));
const listing_image_model_1 = __importDefault(require("../models/listing_image_model"));
const cloudinary_upload_1 = require("../utils/cloudinary_upload");
const createListing = (userID, data) => __awaiter(void 0, void 0, void 0, function* () {
    const listing = yield listing_model_1.default.create(Object.assign(Object.assign({}, data), { ownerID: userID }));
    return listing;
});
exports.createListing = createListing;
const updateListing = (listingID, userID, data) => __awaiter(void 0, void 0, void 0, function* () {
    const listing = yield listing_model_1.default.findById(listingID);
    if (!listing)
        throw new Error('Listing not found');
    if (listing.ownerID !== userID)
        throw new Error('Forbidden: You are not the owner');
    Object.assign(listing, data);
    yield listing.save();
    return listing;
});
exports.updateListing = updateListing;
const deleteListing = (listingID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    const listing = yield listing_model_1.default.findById(listingID);
    if (!listing)
        throw new Error('Listing not found');
    if (listing.ownerID !== userID)
        throw new Error('Forbidden: You are not the owner');
    const images = yield listing_image_model_1.default.find({ listingID });
    // Delete images from Cloudinary
    for (const image of images) {
        const publicId = (0, cloudinary_upload_1.extractPublicId)(image.imageUrl);
        if (publicId) {
            yield (0, cloudinary_upload_1.deleteFromCloudinary)(publicId);
        }
    }
    // Delete images from DB
    yield listing_image_model_1.default.deleteMany({ listingID });
    // Delete listing from DB
    yield listing_model_1.default.findByIdAndDelete(listingID);
    return true;
});
exports.deleteListing = deleteListing;
const getAllListings = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const listings = yield listing_model_1.default.find()
        .skip(skip)
        .limit(limit)
        .populate('images', 'imageUrl isPrimary') // Exclude heavy data, just necessary fields
        .lean();
    const total = yield listing_model_1.default.countDocuments();
    return { listings, total, page, limit };
});
exports.getAllListings = getAllListings;
const getListingById = (listingID) => __awaiter(void 0, void 0, void 0, function* () {
    const listing = yield listing_model_1.default.findById(listingID)
        .populate('images', 'imageUrl isPrimary')
        .lean();
    if (!listing)
        throw new Error('Listing not found');
    return listing;
});
exports.getListingById = getListingById;
const getListingsByUser = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    const listings = yield listing_model_1.default.find({ ownerID: userID })
        .populate('images', 'imageUrl isPrimary')
        .lean();
    return listings;
});
exports.getListingsByUser = getListingsByUser;
