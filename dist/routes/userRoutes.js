"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.get("/profile", authMiddleware_1.default, userController_1.getProfile);
router.patch("/update", authMiddleware_1.default, userController_1.updateProfile);
exports.default = router;
