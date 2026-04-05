import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IConversation extends Document {
  participant1ID: Types.ObjectId;
  participant2ID: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema: Schema = new Schema(
  {
    participant1ID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    participant2ID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for quick lookups of conversations between two users
conversationSchema.index({ participant1ID: 1, participant2ID: 1 });

const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
