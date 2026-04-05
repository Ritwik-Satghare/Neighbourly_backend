import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  const data = await Notification.find({
    recipientID: req.user._id
  }).sort({ createdAt: -1 });

  res.json(data);
};

export const markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true
  });

  res.json({ message: "Updated" });
};