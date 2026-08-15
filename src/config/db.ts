import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async (): Promise<typeof mongoose> => {
  if (isConnected) return mongoose;

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  const conn = await mongoose.connect(process.env.MONGO_URI);
  isConnected = conn.connections[0]?.readyState === 1;
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

export default connectDB;
