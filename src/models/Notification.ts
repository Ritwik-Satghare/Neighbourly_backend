
import mongoose, { Document, Model, Schema } from "mongoose";

export interface INotification extends Document {
  recipientID: mongoose.Types.ObjectId;
  type: string;
  content: string;
  bookingID?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema: Schema<INotification> = new mongoose.Schema(
  {
    recipientID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: String,
    content: String,
    bookingID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking"
    },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Notification: Model<INotification> = mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;