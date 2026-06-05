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
exports.getListingsByUser = exports.getListingById = exports.getAllListings = exports.deleteListing = exports.updateListing = exports.createListing = exports.updateListingSchema = exports.createListingSchema = void 0;
const listingService = __importStar(require("../services/listing_service"));
const zod_1 = require("zod");
exports.createListingSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3, "Name must be at least 3 characters"),
        category: zod_1.z.string().min(1, "Category is required"),
        description: zod_1.z.string().optional(),
        pricePerDay: zod_1.z.number().positive("Price must be positive"),
        location: zod_1.z.string().optional(),
        latitude: zod_1.z.number().min(-90).max(90).optional(),
        longitude: zod_1.z.number().min(-180).max(180).optional(),
    }),
});
exports.updateListingSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3).optional(),
        category: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        pricePerDay: zod_1.z.number().positive().optional(),
        location: zod_1.z.string().optional(),
        latitude: zod_1.z.number().min(-90).max(90).optional(),
        longitude: zod_1.z.number().min(-180).max(180).optional(),
    }),
});
const createListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const listing = yield listingService.createListing(userID, req.body);
        res.status(201).json({
            success: true,
            message: 'Listing created successfully',
            data: listing
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Error creating listing' });
    }
});
exports.createListing = createListing;
const updateListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { id } = req.params;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const listing = yield listingService.updateListing(id, userID, req.body);
        res.status(200).json({
            success: true,
            message: 'Listing updated successfully',
            data: listing
        });
    }
    catch (error) {
        if (error.message.includes('Forbidden') || error.message.includes('owner')) {
            res.status(403).json({ success: false, message: error.message });
            return;
        }
        res.status(400).json({ success: false, message: error.message || 'Error updating listing' });
    }
});
exports.updateListing = updateListing;
const deleteListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { id } = req.params;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        yield listingService.deleteListing(id, userID);
        res.status(200).json({
            success: true,
            message: 'Listing deleted successfully',
            data: {}
        });
    }
    catch (error) {
        if (error.message.includes('Forbidden') || error.message.includes('owner')) {
            res.status(403).json({ success: false, message: error.message });
            return;
        }
        res.status(400).json({ success: false, message: error.message || 'Error deleting listing' });
    }
});
exports.deleteListing = deleteListing;
const getAllListings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        if (limit > 50)
            limit = 50; // Max limit = 50
        const result = yield listingService.getAllListings(page, limit);
        res.status(200).json({
            success: true,
            message: 'Listings fetched successfully',
            data: result
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Error fetching listings' });
    }
});
exports.getAllListings = getAllListings;
const getListingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const listing = yield listingService.getListingById(id);
        res.status(200).json({
            success: true,
            message: 'Listing fetched successfully',
            data: listing
        });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message || 'Listing not found' });
    }
});
exports.getListingById = getListingById;
const getListingsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const listings = yield listingService.getListingsByUser(userID);
        res.status(200).json({
            success: true,
            message: 'User listings fetched successfully',
            data: listings
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Error fetching user listings' });
    }
});
exports.getListingsByUser = getListingsByUser;
