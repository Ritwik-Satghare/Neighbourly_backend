
import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  getNotifications,
  markAsRead
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.patch("/:id", protect, markAsRead);

export default router;