import User from "../models/User.js";
import OTP from "../models/OTPVerification.js";
import bcrypt from "bcryptjs";

import generateToken from "../utils/generateToken.js";
import generateOTP from "../utils/generateOTP.js";
import sendEmail from "../utils/sendEmail.js";


export const registerUser = async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    passwordHash: hashed
  });

  res.json({ token: generateToken(user._id) });
};



export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    res.json({ token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};


export const sendOTP = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const code = generateOTP();

  await OTP.create({
    userID: userId,
    code,
    type: "email",
    expiresAt: Date.now() + 300000
  });

  try {
    await sendEmail(
      user.email,
      "Your OTP Code",
      `Your verification OTP is: ${code}. It is valid for 5 minutes.`
    );
    res.json({ message: "OTP sent to email", code });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email OTP" });
  }
};



export const verifyOTP = async (req, res) => {
  const { userId, code } = req.body;

  const otp = await OTP.findOne({ userID: userId, code });

  if (!otp) return res.status(400).json({ message: "Invalid OTP" });

  await User.findByIdAndUpdate(userId, { isEmailVerified: true });

  res.json({ message: "Verified" });
};