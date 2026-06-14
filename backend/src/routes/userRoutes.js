import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();

// All user routes require authentication + CONSUMER role
router.use(authMiddleware);
router.use(restrictToRoles("CONSUMER"));

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     tags: [User]
 *     summary: Get the authenticated user's profile
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: User profile object
 *       401:
 *         description: No token provided
 */
router.get("/profile", catchAsync(async (req, res) => {
  // TODO: Call UserService.getProfile(req.user.sub)
  res.json({ success: true, data: { message: "User profile — implement in UserService" } });
}));

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     tags: [User]
 *     summary: Update profile (name, phone, preferences)
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put("/profile", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Profile update — implement in UserService" } });
}));

/**
 * @swagger
 * /api/user/favorites:
 *   get:
 *     tags: [User]
 *     summary: List favorite vendors
 *     security: [{ BearerAuth: [] }]
 */
router.get("/favorites", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

/**
 * @swagger
 * /api/user/favorites:
 *   post:
 *     tags: [User]
 *     summary: Add a vendor to favorites
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vendorId: { type: string, format: uuid }
 */
router.post("/favorites", catchAsync(async (req, res) => {
  res.status(201).json({ success: true, data: { message: "Add favorite — implement" } });
}));

/**
 * @swagger
 * /api/user/favorites/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Remove a vendor from favorites
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 */
router.delete("/favorites/:id", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Remove favorite — implement" } });
}));

/**
 * @swagger
 * /api/user/routes/log:
 *   get:
 *     tags: [User]
 *     summary: Get route search history
 *     security: [{ BearerAuth: [] }]
 */
router.get("/routes/log", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

/**
 * @swagger
 * /api/user/alerts:
 *   get:
 *     tags: [User]
 *     summary: Get user notifications
 *     security: [{ BearerAuth: [] }]
 */
router.get("/alerts", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

export default router;
