import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();

router.use(authMiddleware);
router.use(restrictToRoles("CUSTOMER_SERVICE_ADMIN", "GLOBAL_ADMIN"));

/**
 * @swagger
 * /api/cs/tickets:
 *   get:
 *     tags: [Customer Service]
 *     summary: List support tickets (filter by status/priority)
 *     security: [{ BearerAuth: [] }]
 */
router.get("/tickets", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

/**
 * @swagger
 * /api/cs/tickets/{id}:
 *   get:
 *     tags: [Customer Service]
 *     summary: Get ticket details
 *     security: [{ BearerAuth: [] }]
 */
router.get("/tickets/:id", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Ticket detail — implement" } });
}));

/**
 * @swagger
 * /api/cs/tickets/{id}:
 *   patch:
 *     tags: [Customer Service]
 *     summary: Update ticket (assign, change status, add note)
 *     security: [{ BearerAuth: [] }]
 */
router.patch("/tickets/:id", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Update ticket — implement" } });
}));

/**
 * @swagger
 * /api/cs/disputes/user:
 *   get:
 *     tags: [Customer Service]
 *     summary: List user complaints
 *     security: [{ BearerAuth: [] }]
 */
router.get("/disputes/user", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

/**
 * @swagger
 * /api/cs/disputes/vendor:
 *   get:
 *     tags: [Customer Service]
 *     summary: List vendor disputes
 *     security: [{ BearerAuth: [] }]
 */
router.get("/disputes/vendor", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

/**
 * @swagger
 * /api/cs/verify:
 *   get:
 *     tags: [Customer Service]
 *     summary: List pending vendor onboarding applications
 *     security: [{ BearerAuth: [] }]
 */
router.get("/verify", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

/**
 * @swagger
 * /api/cs/verify/{id}:
 *   patch:
 *     tags: [Customer Service]
 *     summary: Approve or reject vendor application
 *     security: [{ BearerAuth: [] }]
 */
router.patch("/verify/:id", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Verify vendor — implement" } });
}));

/**
 * @swagger
 * /api/cs/reviews/mod:
 *   delete:
 *     tags: [Customer Service]
 *     summary: Remove a flagged review
 *     security: [{ BearerAuth: [] }]
 */
router.delete("/reviews/mod", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Moderate review — implement" } });
}));

export default router;
