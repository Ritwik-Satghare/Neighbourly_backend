"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    fullName: { type: String, required: true },
    email: { type: String, unique: true },
    passwordHash: String,
    phoneNumber: String,
    isEmailVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    receivedReviewsCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    avatarUrl: String,
    totalEarnings: { type: Number, default: 0 }
}, { timestamps: true });
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
