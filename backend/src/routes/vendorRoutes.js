import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";
import VendorService from "../services/VendorService.js";

const vendorService = new VendorService();
const router = Router();

// All vendor routes require authentication + VENDOR role
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
 *         description: Dashboard stats (total_stalls, open_stalls, avg_rating, orders)
 */
router.get("/dashboard", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const data = await vendorService.getDashboard(ownerId);
  res.json({ success: true, data });
}));

/**
 * @swagger
 * /api/vendor/stalls:
 *   get:
 *     tags: [Vendor]
 *     summary: List all stalls owned by this vendor
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Array of stalls
 */
router.get("/stalls", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const stalls = await vendorService.getStalls(ownerId);
  res.json({ success: true, data: stalls });
}));

/**
 * @swagger
 * /api/vendor/stalls:
 *   post:
 *     tags: [Vendor]
 *     summary: Register a new stall
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category_id]
 *             properties:
 *               name:        { type: string, example: "Spice & Wok Haven" }
 *               category_id: { type: string, format: uuid }
 *               description: { type: string }
 *               address:     { type: string }
 *               photo_url:   { type: string }
 *               price_range: { type: integer, minimum: 1, maximum: 4 }
 *               latitude:    { type: number, example: 11.5564 }
 *               longitude:   { type: number, example: 104.9282 }
 *               status:      { type: string, enum: [active, inactive] }
 *     responses:
 *       201:
 *         description: Stall created
 *       400:
 *         description: Validation error
 */
router.post("/stalls", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const stall = await vendorService.createStall(ownerId, req.body);
  res.status(201).json({ success: true, data: stall });
}));

/**
 * @swagger
 * /api/vendor/stalls/{id}:
 *   get:
 *     tags: [Vendor]
 *     summary: Get a single stall by ID
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Stall details
 *       404:
 *         description: Stall not found
 */
router.get("/stalls/:id", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const stall = await vendorService.getStallById(ownerId, req.params.id);
  res.json({ success: true, data: stall });
}));

export default router;
