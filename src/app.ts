// import dotenv from "dotenv";
// dotenv.config();
// import express from 'express';
// import cors from 'cors';
// import listingRoutes from './routes/listing_routes';
// import offerRoutes from './routes/offer_routes';
// import bookingRoutes from './routes/booking_routes';
// import splitRoutes from './routes/split_routes';
// import paymentRoutes from './routes/payment_routes';
// import conversationRoutes from './routes/conversation_routes';
// import messageRoutes from './routes/message_routes';
// import reviewRoutes from './routes/review_routes';
// import authRoutes from './routes/authRoutes';

// import { connectDB } from './config/db';

// const app = express();
// const PORT=5000;


// // Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/auth', authRoutes);
// app.use('/listing', listingRoutes);
// app.use('/offer', offerRoutes);
// app.use('/booking', bookingRoutes);
// app.use('/split', splitRoutes);
// app.use('/payment', paymentRoutes);
// app.use('/conversation', conversationRoutes);
// app.use('/message', messageRoutes);
// app.use('/review', reviewRoutes);
// const mongo=async()=>{
//  await connectDB();

// }
// mongo();
// // Health check endpoint
// app.get('/health', (_req, res) => {
//   res.json({ status: 'ok', timestamp: new Date().toISOString() });
// });

// // Generic Error Handler
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error(err.stack);
//   res.status(500).json({ success: false, message: 'Internal Server Error' });
// });

//  app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });

import express from 'express';
import cors from 'cors';
import listingRoutes from './routes/listing_routes';
import offerRoutes from './routes/offer_routes';
import bookingRoutes from './routes/booking_routes';
import splitRoutes from './routes/split_routes';
import paymentRoutes from './routes/payment_routes';
import conversationRoutes from './routes/conversation_routes';
import messageRoutes from './routes/message_routes';
import reviewRoutes from './routes/review_routes';
import authRoutes from './routes/authRoutes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/listing', listingRoutes);
app.use('/offer', offerRoutes);
app.use('/booking', bookingRoutes);
app.use('/split', splitRoutes);
app.use('/payment', paymentRoutes);
app.use('/conversation', conversationRoutes);
app.use('/message', messageRoutes);
app.use('/review', reviewRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  res.send('Neighbourly backend is running!');
});

// Generic Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Export the configured app so server.ts can run it
export default app;
