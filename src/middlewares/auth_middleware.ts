import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  file?: any;
  files?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key') as any;
      
      const userID = decoded.id || decoded.userID || decoded._id || decoded.sub;
      if (!userID) {
        res.status(401).json({ success: false, message: 'Invalid token structure: missing user ID' });
        return;
      }
      
      // Store user info on request - compatible with global Express.Request.user type
      (req as any).user = { _id: userID, id: userID };
      next();
    } catch (err) {
      res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Authorization token required' });
  }
};
