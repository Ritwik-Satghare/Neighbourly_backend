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
exports.getPaymentHistory = exports.paymentWebhook = exports.createPayment = exports.createPaymentSchema = void 0;
const paymentService = __importStar(require("../services/payment_service"));
const zod_1 = require("zod");
exports.createPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingID: zod_1.z.string().min(1, 'Booking ID is required'),
        amount: zod_1.z.number().positive('Amount must be positive'),
        type: zod_1.z.enum(['booking_payment', 'split_payment', 'refund']).optional(),
    }),
});
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const { bookingID, amount, type } = req.body;
        const result = yield paymentService.createOrder(userID, bookingID, amount, type);
        res.status(201).json({
            success: true,
            message: 'Payment order created successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Error creating payment' });
    }
});
exports.createPayment = createPayment;
const paymentWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            res.status(400).json({ success: false, message: 'Missing payment verification fields' });
            return;
        }
        const transaction = yield paymentService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            data: transaction,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Payment verification failed' });
    }
});
exports.paymentWebhook = paymentWebhook;
const getPaymentHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userID) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const transactions = yield paymentService.getPaymentHistory(userID);
        res.status(200).json({
            success: true,
            message: 'Payment history fetched successfully',
            data: transactions,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Error fetching payment history' });
    }
});
exports.getPaymentHistory = getPaymentHistory;
