"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
            const userID = decoded.id || decoded.userID || decoded._id || decoded.sub;
            if (!userID) {
                res.status(401).json({ success: false, message: 'Invalid token structure: missing user ID' });
                return;
            }
            // Store user info on request - compatible with global Express.Request.user type
            req.user = { _id: userID, id: userID };
            next();
        }
        catch (err) {
            res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }
    }
    else {
        res.status(401).json({ success: false, message: 'Authorization token required' });
    }
};
exports.authenticateJWT = authenticateJWT;
