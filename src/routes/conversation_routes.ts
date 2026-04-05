import { Router } from 'express';
import * as conversationController from '../controllers/conversation_controller';
import { authenticateJWT } from '../middlewares/auth_middleware';
import { validateRequest } from '../middlewares/validation_middleware';

const router = Router();

// POST /conversation/create — Create or get existing conversation
router.post(
  '/create',
  authenticateJWT,
  validateRequest(conversationController.createConversationSchema),
  conversationController.createConversation
);

// GET /conversation/list — Get all conversations for authenticated user
router.get(
  '/list',
  authenticateJWT,
  conversationController.getConversations
);

export default router;
