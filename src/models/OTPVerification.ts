import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOTPVerification extends Document {
  userID: mongoose.Types.ObjectId;
  code: string;
  type: "phone" | "email";
  expiresAt: Date;
}

const otpSchema: Schema<IOTPVerification> = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  code: String,
  type: { type: String, enum: ["phone", "email"] },
  expiresAt: Date
});

const OTPVerification: Model<IOTPVerification> = mongoose.model<IOTPVerification>("OTPVerification", otpSchema);

export default OTPVerification;