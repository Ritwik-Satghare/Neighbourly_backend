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
const reviewController = __importStar(require("../controllers/review_controller"));
const auth_middleware_1 = require("../middlewares/auth_middleware");
const validation_middleware_1 = require("../middlewares/validation_middleware");
const router = (0, express_1.Router)();
// POST /review/create — Create a review (auth required)
router.post('/create', auth_middleware_1.authenticateJWT, (0, validation_middleware_1.validateRequest)(reviewController.createReviewSchema), reviewController.createReview);
// GET /review/list/:listingID — Get all reviews for a listing (public)
router.get('/list/:listingID', reviewController.getReviewsByListing);
// GET /review/user/:userID — Get all reviews for a user's listings (public)
router.get('/user/:userID', reviewController.getReviewsByUser);
exports.default = router;
