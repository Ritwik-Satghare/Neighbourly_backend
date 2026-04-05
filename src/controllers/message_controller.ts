import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth_middleware';
import * as messageService from '../services/message_service';
import { z } from 'zod';

export const sendMessageSchema = z.object({
  body: z.object({
    conversationID: z.string().min(1, 'Conversation ID is required'),
    content: z.string().min(1, 'Message content is required'),
  }),
});

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { conversationID, content } = req.body;
    const message = await messageService.sendMessage(conversationID, userID, content);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error: any) {
    if (error.message.includes('Forbidden')) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    res.status(400).json({ success: false, message: error.message || 'Error sending message' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { conversationID } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 50;
    if (limit > 100) limit = 100;

    const result = await messageService.getMessages(conversationID, userID, page, limit);

    res.status(200).json({
      success: true,
      message: 'Messages fetched successfully',
      data: result,
    });
  } catch (error: any) {
    if (error.message.includes('Forbidden')) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    res.status(400).json({ success: false, message: error.message || 'Error fetching messages' });
  }
};
