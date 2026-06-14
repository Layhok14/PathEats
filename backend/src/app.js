import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import apiRouter from "./routes/api.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorMiddleware.js";
import { setupSwagger } from "./swagger/swagger.js";

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Swagger UI ─────────────────────────────────────────────────────────────
setupSwagger(app);

// ── API Routes ─────────────────────────────────────────────────────────────
app.use("/api", apiRouter);

// ── 404 Handler (must be after all routes) ─────────────────────────────────
app.use(notFoundHandler);

// ── Global Error Handler ──────────────────────────────────────────────────
app.use(errorHandler);

export default app;
