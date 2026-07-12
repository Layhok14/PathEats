import express from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();

function validateRequiredEnvVars() {
  const required = [
    "DATABASE_URL",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
  ];

  const missing = required.filter((key) => {
    const val = process.env[key];
    return !val || val.startsWith("your_") || val.includes("your-");
  });

  if (missing.length > 0) {
    const msg = `Missing or placeholder environment variables: ${missing.join(", ")}. Check your .env file.`;
    console.error(msg);
    process.exit(1);
  }
}
validateRequiredEnvVars();

import apiRouter from "./routes/api.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorMiddleware.js";
import { globalLimiter } from "./middlewares/rateLimiter.js";
import { setupSwagger } from "./swagger/swagger.js";

const app = express();

// ── Security & Compression Middleware ───────────────────────────────────────
app.use(helmet());
app.use(compression());
app.set("trust proxy", 1);

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((s) => s.trim())
  : ["http://localhost:5173", "http://localhost:4173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));

const REQUEST_BODY_LIMIT = "2mb";
app.use(express.json({ limit: REQUEST_BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: REQUEST_BODY_LIMIT }));

// ── Global Rate Limiter ────────────────────────────────────────────────────
app.use("/api", globalLimiter);

// ── Swagger UI (development only) ─────────────────────────────────────────
const nodeEnv = (process.env.NODE_ENV || "").trim().toLowerCase();
if (nodeEnv !== "production") {
  setupSwagger(app);
}

// ── API Routes ─────────────────────────────────────────────────────────────
app.use("/api", apiRouter);

// ── 404 Handler (must be after all routes) ─────────────────────────────────
app.use(notFoundHandler);

// ── Global Error Handler ──────────────────────────────────────────────────
app.use(errorHandler);

export default app;
