import express from 'express';
import cors from 'cors';
import listingRoutes from './routes/listing_routes';
import offerRoutes from './routes/offer_routes';
import bookingRoutes from './routes/booking_routes';
import splitRoutes from './routes/split_routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/listing', listingRoutes);
app.use('/offer', offerRoutes);
app.use('/booking', bookingRoutes);
app.use('/split', splitRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generic Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

export default app;
