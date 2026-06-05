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
exports.getPaymentHistory = exports.verifyPayment = exports.createOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const transaction_model_1 = __importDefault(require("../models/transaction_model"));
// Initialize Razorpay instance
const getRazorpayInstance = () => {
    return new razorpay_1.default({
        key_id: process.env.RAZORPAY_KEY_ID || '',
        key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
};
const createOrder = (userID_1, bookingID_1, amount_1, ...args_1) => __awaiter(void 0, [userID_1, bookingID_1, amount_1, ...args_1], void 0, function* (userID, bookingID, amount, type = 'booking_payment') {
    const razorpay = getRazorpayInstance();
    // Create Razorpay order (amount in paise)
    const order = yield razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: `booking_${bookingID}_${Date.now()}`,
    });
    // Create a pending transaction record
    const transaction = yield transaction_model_1.default.create({
        userID,
        bookingID,
        amount,
        type,
        status: 'pending',
        razorpayOrderId: order.id,
    });
    return {
        transaction,
        razorpayOrder: {
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        },
    };
});
exports.createOrder = createOrder;
const verifyPayment = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    // Verify the payment signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto_1.default
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
    if (expectedSignature !== razorpaySignature) {
        throw new Error('Invalid payment signature');
    }
    // Update transaction status to completed
    const transaction = yield transaction_model_1.default.findOneAndUpdate({ razorpayOrderId }, {
        status: 'completed',
        razorpayPaymentId,
    }, { new: true });
    if (!transaction) {
        throw new Error('Transaction not found for this order');
    }
    return transaction;
});
exports.verifyPayment = verifyPayment;
const getPaymentHistory = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.default.find({ userID })
        .populate('bookingID')
        .sort({ createdAt: -1 })
        .lean();
    return transactions;
});
exports.getPaymentHistory = getPaymentHistory;
