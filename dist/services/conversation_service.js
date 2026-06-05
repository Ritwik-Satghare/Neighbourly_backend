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
exports.isParticipant = exports.getConversationById = exports.getConversations = exports.createConversation = void 0;
const conversation_model_1 = __importDefault(require("../models/conversation_model"));
const createConversation = (user1ID, user2ID) => __awaiter(void 0, void 0, void 0, function* () {
    if (user1ID === user2ID) {
        throw new Error('Cannot create a conversation with yourself');
    }
    // Check if conversation already exists between these two users (in either order)
    const existing = yield conversation_model_1.default.findOne({
        $or: [
            { participant1ID: user1ID, participant2ID: user2ID },
            { participant1ID: user2ID, participant2ID: user1ID },
        ],
    });
    if (existing) {
        return existing;
    }
    const conversation = yield conversation_model_1.default.create({
        participant1ID: user1ID,
        participant2ID: user2ID,
    });
    return conversation;
});
exports.createConversation = createConversation;
const getConversations = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    const conversations = yield conversation_model_1.default.find({
        $or: [
            { participant1ID: userID },
            { participant2ID: userID },
        ],
    })
        .populate('participant1ID', 'fullName avatarUrl')
        .populate('participant2ID', 'fullName avatarUrl')
        .sort({ updatedAt: -1 })
        .lean();
    return conversations;
});
exports.getConversations = getConversations;
const getConversationById = (conversationID) => __awaiter(void 0, void 0, void 0, function* () {
    const conversation = yield conversation_model_1.default.findById(conversationID);
    if (!conversation)
        throw new Error('Conversation not found');
    return conversation;
});
exports.getConversationById = getConversationById;
const isParticipant = (conversationID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    const conversation = yield conversation_model_1.default.findById(conversationID);
    if (!conversation)
        return false;
    return (conversation.participant1ID.toString() === userID ||
        conversation.participant2ID.toString() === userID);
});
exports.isParticipant = isParticipant;
