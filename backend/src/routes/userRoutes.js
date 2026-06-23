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

export default router;
