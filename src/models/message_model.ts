import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  conversationID: Types.ObjectId;
  senderID: Types.ObjectId;
  content: string;
  sentTime: Date;
}

const messageSchema: Schema = new Schema(
  {
    conversationID: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    senderID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sentTime: {
      type: Date,
      default: Date.now,
    },
  }
);

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
