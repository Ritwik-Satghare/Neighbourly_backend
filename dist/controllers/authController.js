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
exports.verifyOTP = exports.sendOTP = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const OTPVerification_1 = __importDefault(require("../models/OTPVerification"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const generateOTP_1 = __importDefault(require("../utils/generateOTP"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }
    const exists = yield User_1.default.findOne({ email });
    if (exists)
        return res.status(400).json({ message: "User exists" });
    const hashed = yield bcryptjs_1.default.hash(password, 10);
    const user = yield User_1.default.create({
        fullName,
        email,
        passwordHash: hashed
    });
    res.json({ token: (0, generateToken_1.default)(user._id) });
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (user && (yield bcryptjs_1.default.compare(password, user.passwordHash || ''))) {
        res.json({ token: (0, generateToken_1.default)(user._id) });
    }
    else {
        console.log("Invalid credentials");
        res.status(401).json({ message: "Invalid credentials" });
    }
});
exports.loginUser = loginUser;
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const user = yield User_1.default.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const code = (0, generateOTP_1.default)();
    yield OTPVerification_1.default.create({
        userID: userId,
        code,
        type: "email",
        expiresAt: Date.now() + 300000
    });
    try {
        yield (0, sendEmail_1.default)(user.email, "Your OTP Code", `Your verification OTP is: ${code}. It is valid for 5 minutes.`);
        res.json({ message: "OTP sent to email", code });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to send email OTP" });
    }
});
exports.sendOTP = sendOTP;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, code } = req.body;
    const otp = yield OTPVerification_1.default.findOne({ userID: userId, code });
    if (!otp)
        return res.status(400).json({ message: "Invalid OTP" });
    yield User_1.default.findByIdAndUpdate(userId, { isEmailVerified: true });
    res.json({ message: "Verified" });
});
exports.verifyOTP = verifyOTP;
