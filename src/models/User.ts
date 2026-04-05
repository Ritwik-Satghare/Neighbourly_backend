import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash?: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  rating: number;
  receivedReviewsCount: number;
  isVerified: boolean;
  avatarUrl?: string;
  totalEarnings: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true },
    passwordHash: String,
    phoneNumber: String,
    isEmailVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    receivedReviewsCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    avatarUrl: String,
    totalEarnings: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;