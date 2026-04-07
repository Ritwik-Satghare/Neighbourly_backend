
import express from "express";
import protect from "../middlewares/authMiddleware";
import {
  getNotifications,
  markAsRead
} from "../controllers/notificationController";

const router = express.Router();

router.get("/", protect, getNotifications);
router.patch("/:id", protect, markAsRead);

export default router;