"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    userID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    code: String,
    type: { type: String, enum: ["phone", "email"] },
    expiresAt: Date
});
const OTPVerification = mongoose_1.default.model("OTPVerification", otpSchema);
exports.default = OTPVerification;
