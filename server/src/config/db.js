const mongoose = require('mongoose');

let isConnected = false;
let connectionPromise = null;

/**
 * Connect to MongoDB with Serverless Connection Pooling & Fast Timeout
 */
const connectDB = async () => {
  // If already connected and ready, return true immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  const uri = process.env.MONGODB_URI;

  // If no remote MongoDB URI is provided, do not wait or fail - run in fast In-Memory mode
  if (!uri || uri.trim() === '' || uri.includes('127.0.0.1') || uri.includes('localhost')) {
    if (process.env.VERCEL) {
      console.log('[DB] No remote MONGODB_URI found. Seamlessly operating in zero-latency In-Memory Mode (Vercel Free Tier optimized).');
      isConnected = false;
      return false;
    }
  }

  // Prevent duplicate simultaneous connection attempts in serverless cold starts
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      mongoose.set('bufferCommands', false); // Never buffer or hang requests if disconnected
      
      const targetUri = uri || 'mongodb://127.0.0.1:27017/mavi_boutique';
      await mongoose.connect(targetUri, {
        serverSelectionTimeoutMS: 3000, // Fast fail after 3s to stay well under Vercel's 10s timeout
        connectTimeoutMS: 3000,
        maxPoolSize: 10,
        socketTimeoutMS: 15000
      });

      isConnected = true;
      console.log('[DB] Connected to MongoDB Atlas successfully.');
      return true;
    } catch (err) {
      isConnected = false;
      console.warn(`[DB] Notice: MongoDB not connected (${err.message}). Defaulting to built-in high-performance In-Memory Mode.`);
      return false;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
};

const isDBConnected = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
  }
};

module.exports = { connectDB, isDBConnected, disconnectDB };
