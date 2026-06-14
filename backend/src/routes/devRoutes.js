import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();

router.use(authMiddleware);
router.use(restrictToRoles("DEVELOPER_ADMIN"));

/**
 * @swagger
 * /api/dev/health:
 *   get:
 *     tags: [Developer]
 *     summary: System health check (DB, API, uptime)
 *     security: [{ BearerAuth: [] }]
 */
router.get("/health", catchAsync(async (req, res) => {
  res.json({ success: true, data: { status: "healthy", uptime: process.uptime() } });
}));

/**
 * @swagger
 * /api/dev/backups:
 *   get:
 *     tags: [Developer]
 *     summary: List backup records
 *     security: [{ BearerAuth: [] }]
 */
router.get("/backups", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

/**
 * @swagger
 * /api/dev/backups:
 *   post:
 *     tags: [Developer]
 *     summary: Trigger a new backup
 *     security: [{ BearerAuth: [] }]
 */
router.post("/backups", catchAsync(async (req, res) => {
  res.status(201).json({ success: true, data: { message: "Trigger backup — implement" } });
}));

/**
 * @swagger
 * /api/dev/database:
 *   get:
 *     tags: [Developer]
 *     summary: Database table stats and health
 *     security: [{ BearerAuth: [] }]
 */
router.get("/database", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

/**
 * @swagger
 * /api/dev/logs:
 *   get:
 *     tags: [Developer]
 *     summary: Recent error logs (filter by severity)
 *     security: [{ BearerAuth: [] }]
 */
router.get("/logs", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

/**
 * @swagger
 * /api/dev/seed:
 *   post:
 *     tags: [Developer]
 *     summary: Run database seed script
 *     security: [{ BearerAuth: [] }]
 */
router.post("/seed", catchAsync(async (req, res) => {
  res.status(201).json({ success: true, data: { message: "Seed — implement" } });
}));

/**
 * @swagger
 * /api/dev/api-metrics:
 *   get:
 *     tags: [Developer]
 *     summary: API latency and request metrics
 *     security: [{ BearerAuth: [] }]
 */
router.get("/api-metrics", catchAsync(async (req, res) => {
  res.json({ success: true, data: {} });
}));

export default router;
