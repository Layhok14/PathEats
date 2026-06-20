import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";
import AdminService from "../services/AdminService.js";
import db from "../config/db.js";

const adminService = new AdminService();
const router = Router();

router.use(authMiddleware);
router.use(restrictToRoles("GLOBAL_ADMIN"));

/**
 * @swagger
 * /api/admin/telemetry:
 *   get:
 *     tags: [Admin]
 *     summary: System overview metrics
 *     security: [{ BearerAuth: [] }]
 */
router.get("/telemetry", catchAsync(async (req, res) => {
  const data = await db.query(
    `SELECT
       (SELECT COUNT(*) FROM users) AS total_users,
       (SELECT COUNT(*) FROM places) AS total_stalls,
       (SELECT COUNT(*) FROM reviews) AS total_reviews`
  );
  res.json({ success: true, data: data.rows[0] });
}));

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List all users (paginated, filterable)
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: role_scope
 *         schema: { type: string, enum: [CONSUMER, VENDOR, GLOBAL_ADMIN, DEVELOPER_ADMIN] }
 */
router.get("/users", catchAsync(async (req, res) => {
  const { page, limit, role_scope } = req.query;
  const data = await adminService.listUsers({
    page: parseInt(page) || 1,
    limit: Math.min(parseInt(limit) || 20, 100),
    role_scope,
  });
  res.json({ success: true, data });
}));

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get a single user by ID
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 */
router.get("/users/:id", catchAsync(async (req, res) => {
  const data = await adminService.getUserById(req.params.id);
  res.json({ success: true, data });
}));

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     tags: [Admin]
 *     summary: Change a user's role
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role_scope]
 *             properties:
 *               role_scope:
 *                 type: string
 *                 enum: [CONSUMER, VENDOR, GLOBAL_ADMIN, DEVELOPER_ADMIN]
 */
router.patch("/users/:id/role", catchAsync(async (req, res) => {
  const { role_scope } = req.body;
  if (!role_scope) return res.status(400).json({ success: false, message: "role_scope is required" });
  const data = await adminService.updateUserRole(req.params.id, role_scope, req.user.sub);
  res.json({ success: true, data });
}));

/**
 * @swagger
 * /api/admin/users/{id}/ban:
 *   post:
 *     tags: [Admin]
 *     summary: Toggle ban/unban a user
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 */
router.post("/users/:id/ban", catchAsync(async (req, res) => {
  const data = await adminService.toggleBan(req.params.id, req.user.sub);
  res.json({ success: true, data });
}));

/**
 * @swagger
 * /api/admin/vendors:
 *   get:
 *     tags: [Admin]
 *     summary: List all stalls with owner info
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 */
router.get("/vendors", catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const data = await adminService.listVendors({
    page: parseInt(page) || 1,
    limit: Math.min(parseInt(limit) || 20, 100),
  });
  res.json({ success: true, data });
}));

/**
 * @swagger
 * /api/admin/vendors/{id}/approve:
 *   post:
 *     tags: [Admin]
 *     summary: Approve, reject, or suspend a stall
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED, SUSPENDED]
 */
router.post("/vendors/:id/approve", catchAsync(async (req, res) => {
  const { status } = req.body;
  const data = await adminService.approveStall(req.params.id, status);
  res.json({ success: true, data });
}));

/**
 * @swagger
 * /api/admin/settings:
 *   get:
 *     tags: [Admin]
 *     summary: Get system configuration
 *     security: [{ BearerAuth: [] }]
 */
router.get("/settings", catchAsync(async (req, res) => {
  res.json({ success: true, data: {} });
}));

/**
 * @swagger
 * /api/admin/settings:
 *   put:
 *     tags: [Admin]
 *     summary: Update system configuration
 *     security: [{ BearerAuth: [] }]
 */
router.put("/settings", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Update settings — implement" } });
}));

/**
 * @swagger
 * /api/admin/audit:
 *   get:
 *     tags: [Admin]
 *     summary: View audit logs
 *     security: [{ BearerAuth: [] }]
 */
router.get("/audit", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

export default router;
