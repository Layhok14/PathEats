import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import * as adminController from "../controllers/adminController.js";
import db, { pool } from "../config/db.js";
import { normalizeRoleScope } from "../utils/roles.js";

const router = Router();

const devAdminBypass = (req, res, next) => {
  const nodeEnv = (process.env.NODE_ENV || "").trim().toLowerCase();
  const isDevelopment = nodeEnv === "development" || nodeEnv === "dev";
  const isBypassEnabled = process.env.PATHEAT_ADMIN_BYPASS === "true";

  if (isDevelopment && isBypassEnabled) {
    console.warn("[BYPASS] Admin bypass active — hardcoded GLOBAL_ADMIN session");
    req.user = {
      sub: "dev-admin",
      email: "dev-admin@patheat.local",
      role_scope: "GLOBAL_ADMIN",
      role: "GLOBAL_ADMIN",
    };
    return next();
  }

  return authMiddleware(req, res, next);
};

router.use(devAdminBypass);
router.use(restrictToRoles("GLOBAL_ADMIN", "BUSINESS_ASSISTANCE"));

const globalAdminOnly = restrictToRoles("GLOBAL_ADMIN");
const businessOrGlobal = restrictToRoles("GLOBAL_ADMIN", "BUSINESS_ASSISTANCE");

const activeRole = (req) => normalizeRoleScope(req.user?.role_scope, "");
const isGlobalAdmin = (req) => activeRole(req) === "GLOBAL_ADMIN";
const isBusinessAssistant = (req) => activeRole(req) === "BUSINESS_ASSISTANCE";
const requestedRole = (value) => normalizeRoleScope(value, "");

const forbidden = (message = "You do not have permission to do that.") =>
  new AppError(message, 403, {
    code: "ROLE_FORBIDDEN",
    safeMessage: "You do not have permission to do that.",
    severity: "warning",
  });

const vendorListOrGlobalAdmin = (req, _res, next) => {
  if (isGlobalAdmin(req)) return next();
  if (isBusinessAssistant(req) && requestedRole(req.query.role_scope || req.query.role) === "VENDOR") return next();
  return next(forbidden("Business assistants can only list vendor accounts."));
};

const vendorCreateOrGlobalAdmin = (req, _res, next) => {
  if (isGlobalAdmin(req)) return next();
  if (isBusinessAssistant(req) && requestedRole(req.body.role_scope || req.body.role) === "VENDOR") return next();
  return next(forbidden("Business assistants can only create vendor accounts."));
};

const vendorAccountOrGlobalAdmin = async (req, _res, next) => {
  try {
    if (isGlobalAdmin(req)) return next();
    if (!isBusinessAssistant(req)) return next(forbidden());

    const bodyRole = req.body.role_scope || req.body.role;
    if (bodyRole && requestedRole(bodyRole) !== "VENDOR") {
      return next(forbidden("Business assistants cannot change accounts out of the vendor role."));
    }

    const { rows } = await db.query(
      "SELECT role_scope FROM users WHERE id::text = $1 LIMIT 1",
      [req.params.id]
    );
    if (!rows.length) return next(new AppError("User not found", 404));
    if (requestedRole(rows[0].role_scope) !== "VENDOR") {
      return next(forbidden("Business assistants can only manage vendor accounts."));
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * @swagger
 * /api/admin/db/check:
 *   get:
 *     tags: [Admin]
 *     summary: Check database connection
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Connection status
 */
router.get("/db/check", catchAsync(adminController.checkDatabase));

/**
 * @swagger
 * /api/admin/telemetry:
 *   get:
 *     tags: [Admin]
 *     summary: Get dashboard telemetry (metrics, growth, activity)
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Dashboard data
 */
router.get("/telemetry", catchAsync(adminController.getDashboardTelemetry));

/**
 * @swagger
 * /api/admin/roles:
 *   get:
 *     tags: [Admin]
 *     summary: List all roles
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Array of roles
 *   post:
 *     tags: [Admin]
 *     summary: Create a new role
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               privileges: { type: array, items: { type: string } }
 *               tables: { type: array, items: { type: string } }
 *               grantOption: { type: boolean }
 *     responses:
 *       201:
 *         description: Role created
 */
router.get("/roles", globalAdminOnly, catchAsync(adminController.getRoles));
router.post("/roles", globalAdminOnly, catchAsync(adminController.createRole));

/**
 * @swagger
 * /api/admin/roles/{id}:
 *   patch:
 *     tags: [Admin]
 *     summary: Update a role
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               privileges: { type: array, items: { type: string } }
 *               tables: { type: array, items: { type: string } }
 *               grantOption: { type: boolean }
 *     responses:
 *       200:
 *         description: Role updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a role
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Role deleted
 */
router.patch("/roles/:id", globalAdminOnly, catchAsync(adminController.updateRoleRecord));
router.delete("/roles/:id", globalAdminOnly, catchAsync(adminController.deleteRoleRecord));

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List users (paginated)
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated user list
 *   post:
 *     tags: [Admin]
 *     summary: Create a user
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               role: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: User created
 */
router.get("/users", vendorListOrGlobalAdmin, catchAsync(adminController.getUsers));
router.post("/users", vendorCreateOrGlobalAdmin, catchAsync(adminController.createUser));

/**
 * @swagger
 * /api/admin/user-management/overview:
 *   get:
 *     tags: [Admin]
 *     summary: User management overview table
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Overview rows
 */
router.get("/user-management/overview", vendorListOrGlobalAdmin, catchAsync(adminController.getUserManagementOverview));

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     tags: [Admin]
 *     summary: Update user role
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role: { type: string }
 *     responses:
 *       200:
 *         description: Role updated
 */
router.patch("/users/:id/role", globalAdminOnly, catchAsync(adminController.updateRole));

/**
 * @swagger
 * /api/admin/users/{id}/status:
 *   patch:
 *     tags: [Admin]
 *     summary: Update user status
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch("/users/:id/status", vendorAccountOrGlobalAdmin, catchAsync(adminController.updateStatus));

/**
 * @swagger
 * /api/admin/users/{id}/ban:
 *   post:
 *     tags: [Admin]
 *     summary: Ban or unban a user
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               banned: { type: boolean }
 *     responses:
 *       200:
 *         description: User ban status updated
 */
router.post("/users/:id/ban", globalAdminOnly, catchAsync(async (req, res, next) => {
  req.body.status = req.body.banned === false ? "Active" : "Suspended";
  return adminController.updateStatus(req, res, next);
}));

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get user by ID
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 *   patch:
 *     tags: [Admin]
 *     summary: Update user information
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string }
 *               role: { type: string }
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a user
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deleted
 */
router.get("/users/:id", globalAdminOnly, catchAsync(adminController.getUserById));
router.patch("/users/:id", vendorAccountOrGlobalAdmin, catchAsync(adminController.updateUser));
router.delete("/users/:id", vendorAccountOrGlobalAdmin, catchAsync(adminController.deleteUser));

/**
 * @swagger
 * /api/admin/vendors:
 *   get:
 *     tags: [Admin]
 *     summary: List all vendors (places)
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Array of vendors
 */
router.get("/vendors", catchAsync(adminController.getVendors));

/**
 * @swagger
 * /api/admin/vendor-management/overview:
 *   get:
 *     tags: [Admin]
 *     summary: Vendor management overview table
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Overview rows
 */
router.get("/vendor-management/overview", catchAsync(adminController.getVendorManagementOverview));

/**
 * @swagger
 * /api/admin/place-categories:
 *   get:
 *     tags: [Admin]
 *     summary: List place categories
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Array of categories
 */
router.get("/place-categories", catchAsync(adminController.getPlaceCategories));

/**
 * @swagger
 * /api/admin/vendors/{id}/approve:
 *   post:
 *     tags: [Admin]
 *     summary: Approve or reject a vendor (place)
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approved: { type: boolean }
 *     responses:
 *       200:
 *         description: Approval status updated
 */
router.post("/vendors/:id/approve", globalAdminOnly, catchAsync(adminController.approveVendor));

/**
 * @swagger
 * /api/admin/stall-management/options:
 *   get:
 *     tags: [Admin]
 *     summary: Get stall management dropdown options (vendors, categories, places)
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Options object
 */
router.get("/stall-management/options", catchAsync(adminController.getStallManagementOptions));

/**
 * @swagger
 * /api/admin/audit/activity:
 *   get:
 *     tags: [Admin]
 *     summary: Get database audit activity
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Array of active queries
 */
router.get("/audit/activity", globalAdminOnly, catchAsync(adminController.getAuditActivity));

/**
 * @swagger
 * /api/admin/audit/logs:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin activity log
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *     responses:
 *       200:
 *         description: Array of audit log entries
 */
router.get("/audit/logs", globalAdminOnly, catchAsync(adminController.getAuditLogs));

/**
 * @swagger
 * /api/admin/audit/logs/by-role:
 *   get:
 *     tags: [Admin]
 *     summary: Get audit logs filtered by role scope
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: role_scope
 *         required: true
 *         schema: { type: string, enum: [GLOBAL_ADMIN, DEVELOPER_ADMIN, BUSINESS_ASSISTANCE] }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 100 }
 *     responses:
 *       200:
 *         description: Array of audit log entries for the specified role
 */
router.get("/audit/logs/by-role", businessOrGlobal, catchAsync(adminController.getAuditLogsByRoleScope));

/**
 * @swagger
 * /api/admin/tables:
 *   get:
 *     tags: [Admin]
 *     summary: List all database tables
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Array of table names
 */
router.get("/tables", globalAdminOnly, catchAsync(adminController.getDatabaseTables));

/**
 * @swagger
 * /api/admin/stalls:
 *   get:
 *     tags: [Admin]
 *     summary: List all stalls
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Array of stalls
 */
router.get("/stalls", catchAsync(adminController.getAllStalls));

/**
 * @swagger
 * /api/admin/stalls/owner/{ownerId}:
 *   get:
 *     tags: [Admin]
 *     summary: Get stalls by owner ID
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Array of stalls owned by the user
 */
router.get("/stalls/owner/:ownerId", catchAsync(adminController.getStallsByOwner));

/**
 * @swagger
 * /api/admin/stalls/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get a single stall by ID
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Stall object
 *       404:
 *         description: Stall not found
 */
router.get("/stalls/:id", catchAsync(adminController.getStallById));

/**
 * @swagger
 * /api/admin/stalls:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new stall
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ownerId, categoryId, name]
 *             properties:
 *               ownerId: { type: string, description: "Owner UUID" }
 *               categoryId: { type: string, description: "Category UUID" }
 *               name: { type: string }
 *               description: { type: string }
 *               address: { type: string }
 *               priceRange: { type: string }
 *               photoUrl: { type: string }
 *               latitude: { type: number, format: float }
 *               longitude: { type: number, format: float }
 *     responses:
 *       201:
 *         description: Stall created
 */
router.post("/stalls", businessOrGlobal, catchAsync(adminController.createStall));

/**
 * @swagger
 * /api/admin/stalls/{id}:
 *   patch:
 *     tags: [Admin]
 *     summary: Update a stall
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownerId: { type: string, description: "Vendor owner UUID" }
 *               name: { type: string }
 *               description: { type: string }
 *               address: { type: string }
 *               priceRange: { type: string }
 *               photoUrl: { type: string }
 *               isOpen: { type: boolean }
 *               status: { type: string }
 *               isApproved: { type: boolean }
 *               latitude: { type: number, format: float }
 *               longitude: { type: number, format: float }
 *     responses:
 *       200:
 *         description: Stall updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a stall and its related data
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Stall deleted
 */
router.patch("/stalls/:id", catchAsync(adminController.editStall));

/**
 * @swagger
 * /api/admin/stalls/{id}/toggle:
 *   patch:
 *     tags: [Admin]
 *     summary: Toggle stall open/closed
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Stall status toggled
 */
router.patch("/stalls/:id/toggle", catchAsync(adminController.toggleStallStatus));
router.delete("/stalls/:id", businessOrGlobal, catchAsync(adminController.deleteStall));
router.get("/stalls/:id/impact", catchAsync(adminController.getDeletionImpact));

/**
 * @swagger
 * /api/admin/menu-items:
 *   get:
 *     tags: [Admin]
 *     summary: List all menu items
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Array of menu items
 */
router.get("/menu-items", catchAsync(adminController.getAllMenuItems));

/**
 * @swagger
 * /api/admin/menu-items/{id}:
 *   patch:
 *     tags: [Admin]
 *     summary: Update a menu item
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: string }
 *               category: { type: string }
 *               isAvailable: { type: boolean }
 *     responses:
 *       200:
 *         description: Menu item updated
 */
router.patch("/menu-items/:id", catchAsync(adminController.editMenuItem));

/**
 * @swagger
 * /api/admin/stalls/{placeId}/menu-items:
 *   post:
 *     tags: [Admin]
 *     summary: Add a menu item to a stall
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name: { type: string }
 *               price: { type: string }
 *               category: { type: string }
 *               description: { type: string }
 *               imageUrl: { type: string }
 *     responses:
 *       201:
 *         description: Menu item created
 */
router.post("/stalls/:placeId/menu-items", catchAsync(adminController.createStallMenuItem));

/**
 * @swagger
 * /api/admin/stalls/menu-items/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a menu item
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Menu item deleted
 */
router.delete("/stalls/menu-items/:id", businessOrGlobal, catchAsync(adminController.deleteStallMenuItem));
router.get("/menu-items/:id/links", catchAsync(adminController.getMenuItemLinkCount));

/**
 * @swagger
 * /api/admin/stalls/place-categories:
 *   post:
 *     tags: [Admin]
 *     summary: Create a place category
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               slug: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Category created
 */
router.post("/stalls/place-categories", globalAdminOnly, catchAsync(adminController.createStallCategory));

/**
 * @swagger
 * /api/admin/stalls/place-categories/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a place category
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete("/stalls/place-categories/:id", globalAdminOnly, catchAsync(adminController.deleteStallCategory));

/**
 * @swagger
 * /api/admin/stalls/{placeId}/place-hours:
 *   post:
 *     tags: [Admin]
 *     summary: Set opening hours for a stall
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dayOfWeek: { type: integer }
 *               opensAt: { type: string }
 *               closesAt: { type: string }
 *               isClosed: { type: boolean }
 *     responses:
 *       201:
 *         description: Hours created
 */
router.post("/stalls/:placeId/place-hours", globalAdminOnly, catchAsync(adminController.createStallPlaceHour));

/**
 * @swagger
 * /api/admin/stalls/place-hours/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete opening hours
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Hours deleted
 */
router.delete("/stalls/place-hours/:id", globalAdminOnly, catchAsync(adminController.deleteStallPlaceHour));

/**
 * @swagger
 * /api/admin/reviews:
 *   get:
 *     tags: [Admin]
 *     summary: List all reviews
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Array of reviews
 */
router.get("/reviews", catchAsync(adminController.getAllReviews));

/**
 * @swagger
 * /api/admin/stalls/{placeId}/reviews:
 *   get:
 *     tags: [Admin]
 *     summary: List reviews for a specific stall
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Array of reviews for the stall
 */
router.get("/stalls/:placeId/reviews", catchAsync(adminController.getReviewsByPlaceId));

/**
 * @swagger
 * /api/admin/stalls/{placeId}/reviews:
 *   post:
 *     tags: [Admin]
 *     summary: Add a review to a stall
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: string }
 *               rating: { type: string }
 *               body: { type: string }
 *     responses:
 *       201:
 *         description: Review created
 */
router.post("/stalls/:placeId/reviews", globalAdminOnly, catchAsync(adminController.createStallReview));

/**
 * @swagger
 * /api/admin/stalls/reviews/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a review
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review deleted
 */
router.delete("/stalls/reviews/:id", globalAdminOnly, catchAsync(adminController.deleteStallReview));

/**
 * @swagger
 * /api/admin/health:
 *   get:
 *     tags: [Admin]
 *     summary: System health check
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Health status
 */
router.get("/health", globalAdminOnly, catchAsync(async (req, res) => {
  try {
    const dbResult = await pool.query("SELECT NOW() AS now");
    const latency = Date.now() - req._startTime;
    res.json({
      success: true,
      data: {
        status: "healthy",
        dbConnected: true,
        dbLatency: `${latency}ms`,
        uptime: process.uptime(),
        timestamp: dbResult.rows[0]?.now,
      },
    });
  } catch (_err) {
    res.status(503).json({ success: false, data: { status: "unhealthy", dbConnected: false } });
  }
}));

// ── Kill Query ──────────────────────────────────────────────────────────────

router.post("/audit/kill-query", globalAdminOnly, catchAsync(async (req, res) => {
  const { pid } = req.body;
  if (!pid || typeof pid !== "number") {
    throw new AppError("Valid PID (number) is required", 400);
  }
  try {
    await db.query(`SELECT pg_cancel_backend($1)`, [pid]);
    res.json({ success: true, data: { message: `Cancel signal sent to PID ${pid}` } });
  } catch (err) {
    throw new AppError(`Failed to cancel PID ${pid}: ${err.message}`, 500);
  }
}));

// ── Onboarding Config ──────────────────────────────────────────────────
router.get("/onboarding", catchAsync(adminController.getOnboardingConfig));
router.put("/onboarding", businessOrGlobal, catchAsync(adminController.updateOnboardingConfig));

// ── Review Moderation ──────────────────────────────────────────────────
router.patch("/stalls/reviews/:id/flag", catchAsync(adminController.flagReview));
router.patch("/stalls/reviews/:id/unflag", catchAsync(adminController.unflagReview));
router.delete("/stalls/reviews/:id/remove", businessOrGlobal, catchAsync(adminController.removeReview));

// ── BA Assignments ────────────────────────────────────────────────────
router.get("/ba-assignments/:assistantId", globalAdminOnly, catchAsync(adminController.getAssistantAssignments));
router.post("/ba-assignments/:assistantId/vendor/:vendorId", globalAdminOnly, catchAsync(adminController.assignVendorToAssistant));
router.delete("/ba-assignments/:assistantId/vendor/:vendorId", globalAdminOnly, catchAsync(adminController.unassignVendorFromAssistant));

// ── Consumer Categories (public) ──────────────────────────────────────
router.get("/categories", catchAsync(adminController.getConsumerCategories));

// ── Profile ────────────────────────────────────────────────────────────
router.get("/profile", catchAsync(async (req, res) => {
  const result = await pool.query(
    `SELECT id::text, email, first_name, last_name, phone_number, role_scope, is_banned, created_at, updated_at
     FROM users WHERE id = $1`,
    [req.user.sub]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const row = result.rows[0];
  res.json({
    success: true,
    data: {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone_number,
      roleScope: row.role_scope,
      isBanned: row.is_banned,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    },
  });
}));

export default router;
