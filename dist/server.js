"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const messageService = __importStar(require("./services/message_service"));
dotenv_1.default.config();
// Ensure uploads directory exists for multer (temporary storage)
if (!fs_1.default.existsSync('uploads')) {
    fs_1.default.mkdirSync('uploads');
}
const PORT = process.env.PORT || 5000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    // Connect to Database
    yield (0, db_1.connectDB)();
    // Create HTTP server from Express app
    const server = http_1.default.createServer(app_1.default);
    // Attach Socket.io
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    // Socket.io event handling
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        // Join a conversation room
        socket.on('joinConversation', (conversationID) => {
            socket.join(conversationID);
            console.log(`Socket ${socket.id} joined conversation ${conversationID}`);
        });
        // Send a message (also persists to DB)
        socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { conversationID, senderID, content } = data;
                // Persist message to database
                const message = yield messageService.sendMessage(conversationID, senderID, content);
                // Broadcast to all users in the conversation room
                io.to(conversationID).emit('receiveMessage', message);
            }
            catch (error) {
                socket.emit('error', { message: error.message || 'Error sending message' });
            }
        }));
        // Typing indicator
        socket.on('typing', (data) => {
            socket.to(data.conversationID).emit('typing', { userID: data.userID });
        });
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
    // Start HTTP Server (not app.listen — we use server.listen for Socket.io)
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
startServer();
