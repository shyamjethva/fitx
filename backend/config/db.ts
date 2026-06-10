import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitx';
    console.log(`🔌 Attempting database uplink to: ${connStr.split('@').pop()}`);
    
    const conn = await mongoose.connect(connStr);
    
    console.log(`🚀 MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Critical Database Uplink Failure:`, err);
    process.exit(1);
  }
};
