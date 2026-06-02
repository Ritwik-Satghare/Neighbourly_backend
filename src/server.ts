// import dotenv from 'dotenv';
// dotenv.config();
// import app from './app';
// import { connectDB } from './config/db';

// import fs from 'fs';
// import http from 'http';
// import { Server as SocketIOServer } from 'socket.io';
// import * as messageService from './services/message_service';



// // Ensure uploads directory exists for multer (temporary storage)
// if (!fs.existsSync('uploads')) {
//   fs.mkdirSync('uploads');
// }

// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   // Connect to Database
//   await connectDB();

//   // Create HTTP server from Express app
//   const server = http.createServer(app);

//   // Attach Socket.io
//   const io = new SocketIOServer(server, {
//     cors: {
//       origin: '*',
//       methods: ['GET', 'POST'],
//     },
//   });

//   // Socket.io event handling
//   io.on('connection', (socket) => {
//     console.log(`Socket connected: ${socket.id}`);

//     // Join a conversation room
//     socket.on('joinConversation', (conversationID: string) => {
//       socket.join(conversationID);
//       console.log(`Socket ${socket.id} joined conversation ${conversationID}`);
//     });

//     // Send a message (also persists to DB)
//     socket.on('sendMessage', async (data: { conversationID: string; senderID: string; content: string }) => {
//       try {
//         const { conversationID, senderID, content } = data;

//         // Persist message to database
//         const message = await messageService.sendMessage(conversationID, senderID, content);

//         // Broadcast to all users in the conversation room
//         io.to(conversationID).emit('receiveMessage', message);
//       } catch (error: any) {
//         socket.emit('error', { message: error.message || 'Error sending message' });
//       }
//     });

//     // Typing indicator
//     socket.on('typing', (data: { conversationID: string; userID: string }) => {
//       socket.to(data.conversationID).emit('typing', { userID: data.userID });
//     });

//     socket.on('disconnect', () => {
//       console.log(`Socket disconnected: ${socket.id}`);
//     });
//   });

//   // Start HTTP Server (not app.listen — we use server.listen for Socket.io)
//   server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// };


// startServer();
// startServer().catch((error) => {
//   console.error('💥 Failed to start the server:', error);
// });
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';
import fs from 'fs';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import * as messageService from './services/message_service';

// Ensure uploads directory exists for multer (temporary storage)
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Create HTTP server from Express app
  const server = http.createServer(app);

  // Attach Socket.io
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Socket.io event handling
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join a conversation room
    socket.on('joinConversation', (conversationID: string) => {
      socket.join(conversationID);
      console.log(`Socket ${socket.id} joined conversation ${conversationID}`);
    });

    // Send a message (also persists to DB)
    socket.on('sendMessage', async (data: { conversationID: string; senderID: string; content: string }) => {
      try {
        const { conversationID, senderID, content } = data;

        // Persist message to database
        const message = await messageService.sendMessage(conversationID, senderID, content);

        // Broadcast to all users in the conversation room
        io.to(conversationID).emit('receiveMessage', message);
      } catch (error: any) {
        socket.emit('error', { message: error.message || 'Error sending message' });
      }
    });

    // Typing indicator
    socket.on('typing', (data: { conversationID: string; userID: string }) => {
      socket.to(data.conversationID).emit('typing', { userID: data.userID });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  // Start HTTP Server
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Start the server with error catching
startServer().catch((error) => {
  console.error('💥 Failed to start the server:', error);
});