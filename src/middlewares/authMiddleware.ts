import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";

const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];
    
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    req.user = await User.findById(decoded.id);

    next();
  } else {
    res.status(401).json({ message: "No token" });
  }
};

export default protect;