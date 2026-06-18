import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import vendorRoutes from "./vendorRoutes.js";
import adminRoutes from "./adminRoutes.js";
import csRoutes from "./csRoutes.js";
import devRoutes from "./devRoutes.js";
import db from "../config/db.js";

const router = Router();

// ── Health Check ───────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Developer]
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: API is running
 */
router.get("/health", async (req, res) => {
  let database = "disconnected";
  try {
    await db.query("SELECT 1");
    database = "connected";
  } catch {
    database = "disconnected";
  }

  res.json({
    success: true,
    message: "PathEat API running",
    database,
    timestamp: new Date().toISOString(),
  });
});

// ── Domain Routes ──────────────────────────────────────────────────────────
router.use("/auth", authRoutes);       // Public
router.use("/user", userRoutes);       // CONSUMER
router.use("/vendor", vendorRoutes);   // VENDOR
router.use("/admin", adminRoutes);     // GLOBAL_ADMIN
router.use("/cs", csRoutes);           // CUSTOMER_SERVICE_ADMIN + GLOBAL_ADMIN
router.use("/dev", devRoutes);         // DEVELOPER_ADMIN

export default router;
