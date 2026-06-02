import * as jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const generateToken = (id: mongoose.Types.ObjectId | string): string => {
  // console.log();

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, 'process.env.JWT_SECRET', {
    expiresIn: "7d"
  });
};

export default generateToken;