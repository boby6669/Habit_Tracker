import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error("MONGO_URI is not defined");
           // Try to connect with a short server selection timeout so failures return quickly.
           const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
           console.log(`MongoDB connected: ${conn.connection.host}`);
           return conn;

    } catch (err) {
        console.error("MongoDB connection error:", err.message || err);
           // Return null instead of exiting so the server can still run in degraded mode.
           return null;
    }
}