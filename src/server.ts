import app from './app';
import { connectDB } from './config/db';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Ensure uploads directory exists for multer (temporary storage)
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();
  
  // Start Express Server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
