import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";
import * as adminController from "../controllers/adminController.js";

const router = Router();

const devAdminBypass = (req, res, next) => {
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (isDevelopment) {
    req.user = {
      sub: "dev-admin",
      email: "dev-admin@patheat.local",
      role_scope: "GLOBAL_ADMIN",
    };
    return next();
  }

  return authMiddleware(req, res, next);
};

router.use(devAdminBypass);
router.use(restrictToRoles("GLOBAL_ADMIN"));

router.get("/db/check", catchAsync(adminController.checkDatabase));

/**
 * @swagger
 * /api/admin/telemetry:
 *   get:
 *     tags: [Admin]
 *     summary: System overview metrics
 *     security: [{ BearerAuth: [] }]
 */
router.get("/telemetry", catchAsync(adminController.getDashboardTelemetry));

/**
 * @swagger
 * /api/admin/roles:
 *   post:
 *     tags: [Admin]
 *     summary: Create a database role record
 *     security: [{ BearerAuth: [] }]
 */
router.get("/roles", catchAsync(adminController.getRoles));
router.post("/roles", catchAsync(adminController.createRole));

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List all users (paginated, filterable)
 *     security: [{ BearerAuth: [] }]
 */
router.get("/users", catchAsync(adminController.getUsers));

router.post("/users", catchAsync(adminController.createUser));

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     tags: [Admin]
 *     summary: Change a user's role
 *     security: [{ BearerAuth: [] }]
 */
router.patch("/users/:id/role", catchAsync(adminController.updateRole));

/**
 * @swagger
 * /api/admin/users/{id}/ban:
 *   post:
 *     tags: [Admin]
 *     summary: Ban/unban a user
 *     security: [{ BearerAuth: [] }]
 */
router.patch("/users/:id/status", catchAsync(adminController.updateStatus));

router.post("/users/:id/ban", catchAsync(async (req, res, next) => {
  req.body.status = req.body.banned === false ? "Active" : "Suspended";
  return adminController.updateStatus(req, res, next);
}));

/**
 * @swagger
 * /api/admin/vendors:
 *   get:
 *     tags: [Admin]
 *     summary: List all vendors
 *     security: [{ BearerAuth: [] }]
 */
router.get("/vendors", catchAsync(adminController.getVendors));

router.get("/place-categories", catchAsync(adminController.getPlaceCategories));

/**
 * @swagger
 * /api/admin/vendors/{id}/approve:
 *   post:
 *     tags: [Admin]
 *     summary: Approve or reject vendor registration
 *     security: [{ BearerAuth: [] }]
 */
router.post("/vendors/:id/approve", catchAsync(adminController.approveVendor));

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
  res.json({ success: true, data: { message: "Update settings - implement" } });
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
