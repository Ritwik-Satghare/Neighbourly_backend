import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth_middleware';
import * as conversationService from '../services/conversation_service';
import { z } from 'zod';

export const createConversationSchema = z.object({
  body: z.object({
    participantID: z.string().min(1, 'Participant ID is required'),
  }),
});

export const createConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { participantID } = req.body;
    const conversation = await conversationService.createConversation(userID, participantID);

    res.status(201).json({
      success: true,
      message: 'Conversation created successfully',
      data: conversation,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error creating conversation' });
  }
};

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const conversations = await conversationService.getConversations(userID);

    res.status(200).json({
      success: true,
      message: 'Conversations fetched successfully',
      data: conversations,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error fetching conversations' });
  }
};
