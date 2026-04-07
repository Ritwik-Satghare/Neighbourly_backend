import { Request, Response } from "express";
import Notification from "../models/Notification";

export const getNotifications = async (req: Request, res: Response) => {
  const data = await Notification.find({
    recipientID: req.user?._id
  }).sort({ createdAt: -1 });

  res.json(data);
};

export const markAsRead = async (req: Request, res: Response) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true
  });

  res.json({ message: "Updated" });
};