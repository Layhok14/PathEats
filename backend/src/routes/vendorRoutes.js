import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import {
  getDashboard,
  getStalls,
  createStall,
  getStallById,
} from "../controllers/vendorController.js";

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
router.get("/dashboard", getDashboard);

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
router.get("/stalls", getStalls);

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
router.post("/stalls", createStall);

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
router.get("/stalls/:id", getStallById);

export default router;
