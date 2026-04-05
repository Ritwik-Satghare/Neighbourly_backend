import { Router } from 'express';
import * as messageController from '../controllers/message_controller';
import { authenticateJWT } from '../middlewares/auth_middleware';
import { validateRequest } from '../middlewares/validation_middleware';

const router = Router();

// POST /message/send — Send a message in a conversation
router.post(
  '/send',
  authenticateJWT,
  validateRequest(messageController.sendMessageSchema),
  messageController.sendMessage
);

// GET /message/:conversationID — Get messages for a conversation
router.get(
  '/:conversationID',
  authenticateJWT,
  messageController.getMessages
);

export default router;
