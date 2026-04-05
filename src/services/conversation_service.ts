import Conversation from '../models/conversation_model';

export const createConversation = async (user1ID: string, user2ID: string) => {
  if (user1ID === user2ID) {
    throw new Error('Cannot create a conversation with yourself');
  }

  // Check if conversation already exists between these two users (in either order)
  const existing = await Conversation.findOne({
    $or: [
      { participant1ID: user1ID, participant2ID: user2ID },
      { participant1ID: user2ID, participant2ID: user1ID },
    ],
  });

  if (existing) {
    return existing;
  }

  const conversation = await Conversation.create({
    participant1ID: user1ID,
    participant2ID: user2ID,
  });

  return conversation;
};

export const getConversations = async (userID: string) => {
  const conversations = await Conversation.find({
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
};

export const getConversationById = async (conversationID: string) => {
  const conversation = await Conversation.findById(conversationID);
  if (!conversation) throw new Error('Conversation not found');
  return conversation;
};

export const isParticipant = async (conversationID: string, userID: string): Promise<boolean> => {
  const conversation = await Conversation.findById(conversationID);
  if (!conversation) return false;

  return (
    conversation.participant1ID.toString() === userID ||
    conversation.participant2ID.toString() === userID
  );
};
