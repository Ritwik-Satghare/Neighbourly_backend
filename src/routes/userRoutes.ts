import express from "express";
import protect from "../middlewares/authMiddleware";
import { getProfile, updateProfile } from "../controllers/userController";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.patch("/update", protect, updateProfile);

export default router;