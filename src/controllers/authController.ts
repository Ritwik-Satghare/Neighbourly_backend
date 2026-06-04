import { Request, Response } from "express";
import User from "../models/User";
import OTP from "../models/OTPVerification";
import bcrypt from "bcryptjs";

import generateToken from "../utils/generateToken";
import generateOTP from "../utils/generateOTP";
import sendEmail from "../utils/sendEmail";


export const registerUser = async (req: Request, res: Response) => {
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



export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.passwordHash || ''))) {
    res.json({ token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};


export const sendOTP = async (req: Request, res: Response) => {
  const { userId } = req.body;
  
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const code = generateOTP();

    // Create the verification record in MongoDB
    await OTP.create({
      userID: userId,
      code,
      type: "email",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes validity
    });

    try {
      console.log(process.env.EMAIL_USER);
      // Attempt real SMTP email delivery
      await sendEmail(
        user.email,
        "Your OTP Code",
        `Your verification OTP is: ${code}. It is valid for 5 minutes.`
      );

      return res.json({ message: "OTP sent to email", code });

    } catch (emailError: any) {
      //FAIL-SAFE BYPASS: Log email error to Render console, but don't return a 500 error to client
      console.error("Render SMTP Delivery failed. Error details:", emailError?.message || emailError);

      return res.json({ 
        message: "OTP generated successfully (Email delivery failed, using testing bypass)", 
        code 
      });
    }

  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const verifyOTP = async (req: Request, res: Response) => {
   console.log("hello");
  const { userId, code } = req.body;
 
  const otp = await OTP.findOne({ userID: userId, code });
 console.log(otp);
 

  if (!otp) return res.status(400).json({ message: "Invalid OTP" });

  await User.findByIdAndUpdate(userId, { isEmailVerified: true });

  res.json({ message: "Verified" });
};