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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const offerController = __importStar(require("../controllers/offer_controller"));
const auth_middleware_1 = require("../middlewares/auth_middleware");
const validation_middleware_1 = require("../middlewares/validation_middleware");
const router = (0, express_1.Router)();
// All offer routes require authentication
router.use(auth_middleware_1.authenticateJWT);
// POST /offer/create — Send an offer on a listing
router.post('/create', (0, validation_middleware_1.validateRequest)(offerController.createOfferSchema), offerController.createOffer);
// GET /offer/list — List offers (query: type=sent|received, listingID)
router.get('/list', offerController.listOffers);
// PATCH /offer/accept/:id — Accept an offer (owner only, creates booking)
router.patch('/accept/:id', offerController.acceptOffer);
// PATCH /offer/reject/:id — Reject an offer (owner only)
router.patch('/reject/:id', offerController.rejectOffer);
exports.default = router;
