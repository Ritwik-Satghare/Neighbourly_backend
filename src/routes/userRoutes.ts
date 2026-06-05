import express from "express";
import protect from "../middlewares/authMiddleware";
import { authenticateJWT } from "../middlewares/auth_middleware";
import { getProfile, updateProfile, searchUsers } from "../controllers/userController";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.patch("/update", protect, updateProfile);

// Search users by name or email (used by split ownership flow)
router.get("/search", searchUsers);

export default router;

