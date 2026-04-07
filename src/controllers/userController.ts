import { Request, Response } from "express";
import User from "../models/User";

export const getProfile = async (req: Request, res: Response) => {
  res.json(req.user);
};

export const updateProfile = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id);
  if (!user) { res.status(404).json({ message: "User not found" }); return; }

  user.fullName = req.body.fullName || user.fullName;

  const updated = await user.save();
  res.json(updated);
};