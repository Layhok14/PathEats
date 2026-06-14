import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";

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
  res.json({ success: true, data: { message: "Admin telemetry — implement" } });
}));

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List all users (paginated, filterable)
 *     security: [{ BearerAuth: [] }]
 */
router.get("/users", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     tags: [Admin]
 *     summary: Change a user's role
 *     security: [{ BearerAuth: [] }]
 */
router.patch("/users/:id/role", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Update role — implement" } });
}));

/**
 * @swagger
 * /api/admin/users/{id}/ban:
 *   post:
 *     tags: [Admin]
 *     summary: Ban/unban a user
 *     security: [{ BearerAuth: [] }]
 */
router.post("/users/:id/ban", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Ban user — implement" } });
}));

/**
 * @swagger
 * /api/admin/vendors:
 *   get:
 *     tags: [Admin]
 *     summary: List all vendors
 *     security: [{ BearerAuth: [] }]
 */
router.get("/vendors", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

/**
 * @swagger
 * /api/admin/vendors/{id}/approve:
 *   post:
 *     tags: [Admin]
 *     summary: Approve or reject vendor registration
 *     security: [{ BearerAuth: [] }]
 */
router.post("/vendors/:id/approve", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Approve vendor — implement" } });
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
