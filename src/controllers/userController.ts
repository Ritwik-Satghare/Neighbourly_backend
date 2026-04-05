import User from "../models/User.js";

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.fullName = req.body.fullName || user.fullName;

  const updated = await user.save();
  res.json(updated);
};