import mongoose from 'mongoose';

const MONGODB_URI = process.env.DB_URL!;
const DB_NAME = 'ecom_db';

// Check environment variable
if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

// Global cache to prevent multiple connections during hot reload in Next.js
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // If not connected yet, create a new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: DB_NAME,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log(`Successfully connected to MongoDB: ${DB_NAME}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB Connection Failed:', e);
    throw e;
  }
};

export default dbConnect;