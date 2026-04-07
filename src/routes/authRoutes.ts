import express from "express";
import {
  registerUser,
  loginUser,
  sendOTP,
  verifyOTP
} from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

export default router;