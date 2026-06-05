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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.sendMessage = void 0;
const message_model_1 = __importDefault(require("../models/message_model"));
const conversationService = __importStar(require("./conversation_service"));
const sendMessage = (conversationID, senderID, content) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify sender is a participant
    const isParticipant = yield conversationService.isParticipant(conversationID, senderID);
    if (!isParticipant) {
        throw new Error('Forbidden: You are not a participant of this conversation');
    }
    const message = yield message_model_1.default.create({
        conversationID,
        senderID,
        content,
        sentTime: new Date(),
    });
    return message;
});
exports.sendMessage = sendMessage;
const getMessages = (conversationID_1, userID_1, ...args_1) => __awaiter(void 0, [conversationID_1, userID_1, ...args_1], void 0, function* (conversationID, userID, page = 1, limit = 50) {
    // Verify user is a participant
    const isParticipant = yield conversationService.isParticipant(conversationID, userID);
    if (!isParticipant) {
        throw new Error('Forbidden: You are not a participant of this conversation');
    }
    const skip = (page - 1) * limit;
    const messages = yield message_model_1.default.find({ conversationID })
        .populate('senderID', 'fullName avatarUrl')
        .sort({ sentTime: 1 })
        .skip(skip)
        .limit(limit)
        .lean();
    const total = yield message_model_1.default.countDocuments({ conversationID });
    return { messages, total, page, limit };
});
exports.getMessages = getMessages;
