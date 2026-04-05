import express from 'express';
import cors from 'cors';
import listingRoutes from './routes/listing_routes';
import paymentRoutes from './routes/payment_routes';
import conversationRoutes from './routes/conversation_routes';
import messageRoutes from './routes/message_routes';
import reviewRoutes from './routes/review_routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/listing', listingRoutes);
app.use('/payment', paymentRoutes);
app.use('/conversation', conversationRoutes);
app.use('/message', messageRoutes);
app.use('/review', reviewRoutes);

// Generic Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

export default app;
