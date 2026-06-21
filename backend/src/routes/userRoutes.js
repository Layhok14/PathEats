import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";
import UserRepository from "../repositories/UserRepository.js";

const userRepo = new UserRepository();
const router = Router();

// All user routes require authentication + CONSUMER or VENDOR role
router.use(authMiddleware);
router.use(restrictToRoles("CONSUMER", "VENDOR"));

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
  const user = await userRepo.findById(req.user.sub);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, data: user });
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
  const { firstName, lastName, phone } = req.body;
  const data = {};
  if (firstName !== undefined) data.first_name = firstName;
  if (lastName !== undefined) data.last_name = lastName;
  if (phone !== undefined) data.phone_number = phone;
  const user = await userRepo.updateProfile(req.user.sub, data);
  if (!user) return res.status(400).json({ success: false, message: "No fields to update" });
  res.json({ success: true, data: user });
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
