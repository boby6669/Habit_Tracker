import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Parse JSON (body parser)

// Allowed origins from .env
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Allow localhost + 127.0.0.1
const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const corsOptions = {
  origin(origin, cb) {
    // Allow server-to-server/curl/no-origin
    if (!origin) return cb(null, true);

    // Allow localhost + 127.0.0.1
    if (localhostRegex.test(origin)) {
      return cb(null, true);
    }

    // Allow listed origins
    if (allowedOrigins.includes(origin)) {
      return cb(null, true);
    }

    return cb(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // Pre-flight for all routes (use regex to avoid path-to-regexp param parsing)
app.use(express.json({ limit: "1mb" })); // Body parser

// // Import routes
// import authRoutes from "./routes/auth.js";
// import habitRoutes from "./routes/habits.js";
// import entryRoutes from "./routes/entries.js";

// Example route
app.get("/api/health", (req, res) => {
  res.json({ message: "OK", timestamp: new Date().toISOString() });
});


// Start server
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  const conn = await connectDB();
  if (!conn) {
    console.warn("Proceeding without DB connection; running in degraded mode.");
  }
  app.use(notFound);
  app.use(errorHandler);
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();

// const PORT = process.env.PORT || 5000;

// connectDB().then(() => {
//     app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//     });
// });
cd Backend
npm run dev