import { Request, Response } from "express";
import User from "../models/User";

export const getProfile = async (req: Request, res: Response) => {
  res.json((req as any).user);
};

export const updateProfile = async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user?._id);
  if (!user) { res.status(404).json({ message: "User not found" }); return; }

  user.fullName = req.body.fullName || user.fullName;

  const updated = await user.save();
  res.json(updated);
};

/**
 * GET /user/search?q=<query>
 * Search registered users by fullName or email.
 * Returns max 10 results with only _id, fullName, email for privacy.
 */
export const searchUsers = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || "").trim();
    
    let queryObj = {};
    if (q.length > 0) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      queryObj = { $or: [{ fullName: regex }, { email: regex }] };
    }

    const users = await User.find(queryObj)
      .select("_id fullName email")
      .limit(50)
      .lean();

    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Error searching users" });
  }
};