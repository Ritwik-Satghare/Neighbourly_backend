import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.patch("/update", protect, updateProfile);

export default router;