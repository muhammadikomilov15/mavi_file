const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mavi_boutique';
  
  try {
    // Attempt standard connection with 3s timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[DB] Connected to MongoDB at: ${uri}`);
  } catch (primaryErr) {
    console.warn(`[DB] Primary MongoDB connection failed (${primaryErr.message}). Initiating fallback in-memory MongoDB for local environment...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'mavi_boutique'
        }
      });
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[DB] Fallback in-memory MongoDB connected successfully at: ${memUri}`);
    } catch (fallbackErr) {
      console.error(`[DB] Critical: Failed to establish database connection.`, fallbackErr);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
