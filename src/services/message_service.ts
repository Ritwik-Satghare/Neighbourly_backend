import Message from '../models/message_model';
import * as conversationService from './conversation_service';

export const sendMessage = async (conversationID: string, senderID: string, content: string) => {
  // Verify sender is a participant
  const isParticipant = await conversationService.isParticipant(conversationID, senderID);
  if (!isParticipant) {
    throw new Error('Forbidden: You are not a participant of this conversation');
  }

  const message = await Message.create({
    conversationID,
    senderID,
    content,
    sentTime: new Date(),
  });

  return message;
};

export const getMessages = async (conversationID: string, userID: string, page: number = 1, limit: number = 50) => {
  // Verify user is a participant
  const isParticipant = await conversationService.isParticipant(conversationID, userID);
  if (!isParticipant) {
    throw new Error('Forbidden: You are not a participant of this conversation');
  }

  const skip = (page - 1) * limit;

  const messages = await Message.find({ conversationID })
    .populate('senderID', 'fullName avatarUrl')
    .sort({ sentTime: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Message.countDocuments({ conversationID });

  return { messages, total, page, limit };
};
