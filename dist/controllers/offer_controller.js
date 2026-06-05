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
exports.rejectOffer = exports.acceptOffer = exports.listOffers = exports.createOffer = exports.createOfferSchema = void 0;
const offerService = __importStar(require("../services/offer_service"));
const zod_1 = require("zod");
// ─── Validation Schemas ──────────────────────────────────────────────────────
exports.createOfferSchema = zod_1.z.object({
    body: zod_1.z.object({
        listingID: zod_1.z.string().min(1, 'Listing ID is required'),
        amount: zod_1.z.number().positive('Amount must be positive'),
        startDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid start date'),
        endDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid end date'),
        note: zod_1.z.string().optional(),
    }),
});
// ─── Controllers ─────────────────────────────────────────────────────────────
const createOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const offer = yield offerService.createOffer(userID, req.body);
        res.status(201).json({
            success: true,
            message: 'Offer sent successfully',
            data: offer,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Error sending offer' });
    }
});
exports.createOffer = createOffer;
const listOffers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const offers = yield offerService.listOffers(userID, req.query);
        res.status(200).json({
            success: true,
            message: 'Offers fetched successfully',
            data: offers,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Error fetching offers' });
    }
});
exports.listOffers = listOffers;
const acceptOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { id } = req.params;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const { offer, booking } = yield offerService.acceptOffer(id, userID);
        res.status(200).json({
            success: true,
            message: 'Offer accepted and booking created',
            data: { offer, booking },
        });
    }
    catch (error) {
        if (error.message.includes('Forbidden')) {
            res.status(403).json({ success: false, message: error.message });
            return;
        }
        res.status(400).json({ success: false, message: error.message || 'Error accepting offer' });
    }
});
exports.acceptOffer = acceptOffer;
const rejectOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { id } = req.params;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const offer = yield offerService.rejectOffer(id, userID);
        res.status(200).json({
            success: true,
            message: 'Offer rejected successfully',
            data: offer,
        });
    }
    catch (error) {
        if (error.message.includes('Forbidden')) {
            res.status(403).json({ success: false, message: error.message });
            return;
        }
        res.status(400).json({ success: false, message: error.message || 'Error rejecting offer' });
    }
});
exports.rejectOffer = rejectOffer;
