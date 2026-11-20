const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { connectDB, isDBConnected } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS setup
app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins for seamless e-commerce, mobile, and Vercel preview URLs
    callback(null, true);
  },
  credentials: true
}));

// Rate limiting (generous and serverless-friendly)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware to establish DB connection if configured, without blocking serverless flow
let initialConnectAttempted = false;
let seeded = false;

app.use(async (req, res, next) => {
  if (req.path === '/api/health') {
    return next();
  }

  // Attempt DB connection once or check ready state
  if (!initialConnectAttempted || !isDBConnected()) {
    try {
      const connected = await connectDB();
      if (connected && !seeded && process.env.AUTO_SEED !== 'false') {
        try {
          const { seedIfEmpty } = require('./utils/seedData');
          await seedIfEmpty();
          seeded = true;
        } catch (seedErr) {
          console.warn('[Seed] Notice:', seedErr.message);
        }
      }
    } catch (err) {
      console.warn('[DB Connect Notice]:', err.message);
    } finally {
      initialConnectAttempted = true;
    }
  }

  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    brand: 'MAVI BOUTIQUE',
    database: isDBConnected() ? 'MongoDB Atlas (Connected)' : 'In-Memory Store (Active & Operational)',
    platform: process.env.VERCEL ? 'Vercel Serverless' : 'Standalone Node.js',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`
  });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect Database & Start Server for local standalone development
const startServer = async () => {
  try {
    await connectDB();
    
    // Auto-seed if database is empty
    if (isDBConnected()) {
      const { seedIfEmpty } = require('./utils/seedData');
      await seedIfEmpty();
    }

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`✨ MAVI Premium E-Commerce API running on port ${PORT}`);
      console.log(`📡 Database mode: ${isDBConnected() ? 'MongoDB Atlas' : 'Fast In-Memory'}`);
      console.log(`🛍 Telegram Orders Channel: ${process.env.TELEGRAM_CHAT_ID || '-1004335804992'}`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
  }
};

// Only call app.listen() if executed directly (e.g., node server/src/server.js) and NOT on Vercel
if (!process.env.VERCEL && require.main === module) {
  startServer();
}

module.exports = app;
