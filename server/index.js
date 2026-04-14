const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Database connection handling optimized for Serverless functions
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) return cachedDb;
  if (mongoose.connection.readyState >= 1) {
    cachedDb = mongoose.connection;
    return cachedDb;
  }
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: 'Printhub',          // explicit DB name
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    cachedDb = conn.connection;
    return cachedDb;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    throw err;
  }
};

// Ensure DB is connected for incoming API requests in Serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ 
      status: 'fail', 
      message: 'Database connection failed: ' + err.message 
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

app.get('/', (req, res) => {
  res.send('PrintHub API is running...');
});

// Prevent crashes from unhandled errors locally
process.on('unhandledRejection', (err) => {
  console.error('⚠️  Unhandled Rejection:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('⚠️  Uncaught Exception:', err.message);
});

// Start server conditionally: Local vs Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export the Express API for Vercel
module.exports = app;
