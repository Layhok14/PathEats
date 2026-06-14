import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();

router.use(authMiddleware);
router.use(restrictToRoles("VENDOR"));

/**
 * @swagger
 * /api/vendor/dashboard:
 *   get:
 *     tags: [Vendor]
 *     summary: Get vendor dashboard metrics
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Dashboard stats (views, orders, rating, reviews)
 */
router.get("/dashboard", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Vendor dashboard — implement vendor service" } });
}));

/**
 * @swagger
 * /api/vendor/profile:
 *   get:
 *     tags: [Vendor]
 *     summary: Get own vendor profile
 *     security: [{ BearerAuth: [] }]
 */
router.get("/profile", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Vendor profile — implement" } });
}));

/**
 * @swagger
 * /api/vendor/profile:
 *   put:
 *     tags: [Vendor]
 *     summary: Update vendor details (name, description, hours, location)
 *     security: [{ BearerAuth: [] }]
 */
router.put("/profile", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Update vendor — implement" } });
}));

/**
 * @swagger
 * /api/vendor/menu:
 *   get:
 *     tags: [Vendor]
 *     summary: List menu items
 *     security: [{ BearerAuth: [] }]
 */
router.get("/menu", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

/**
 * @swagger
 * /api/vendor/menu:
 *   post:
 *     tags: [Vendor]
 *     summary: Add a menu item
 *     security: [{ BearerAuth: [] }]
 */
router.post("/menu", catchAsync(async (req, res) => {
  res.status(201).json({ success: true, data: { message: "Add menu item — implement" } });
}));

/**
 * @swagger
 * /api/vendor/menu/{id}:
 *   put:
 *     tags: [Vendor]
 *     summary: Update a menu item
 *     security: [{ BearerAuth: [] }]
 */
router.put("/menu/:id", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Update menu item — implement" } });
}));

/**
 * @swagger
 * /api/vendor/menu/{id}:
 *   delete:
 *     tags: [Vendor]
 *     summary: Delete a menu item
 *     security: [{ BearerAuth: [] }]
 */
router.delete("/menu/:id", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Delete menu item — implement" } });
}));

/**
 * @swagger
 * /api/vendor/orders:
 *   get:
 *     tags: [Vendor]
 *     summary: List orders (filter by status)
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, received, cooking, ready, delivered, cancelled] }
 */
router.get("/orders", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

/**
 * @swagger
 * /api/vendor/orders/{id}/status:
 *   patch:
 *     tags: [Vendor]
 *     summary: Update order status (received → cooking → ready)
 *     security: [{ BearerAuth: [] }]
 */
router.patch("/orders/:id/status", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Update order status — implement" } });
}));

export default router;
