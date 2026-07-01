import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";
import UserRepository from "../repositories/UserRepository.js";
import db from "../config/db.js";
import AppError from "../utils/AppError.js";

const userRepo = new UserRepository();
const router = Router();

// Consumer app account data is CONSUMER-only. Vendor accounts use /api/vendor.
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
  const user = await userRepo.findById(req.user.sub);
  if (!user) throw new AppError("User profile row was not found", 404, {
    code: "USER_PROFILE_NOT_FOUND",
    safeMessage: "We could not find your profile.",
  });
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
  if (!user) throw new AppError("Profile update did not include editable fields", 400, {
    code: "NO_PROFILE_FIELDS",
    safeMessage: "Choose at least one profile field to update.",
  });
  res.json({ success: true, data: user });
}));

// ── Bookmarks (Favorites) ────────────────────────────────────────────────────

router.get("/bookmarks", catchAsync(async (req, res) => {
  const { rows } = await db.query(
    `SELECT b.id, b.place_id, b.notes, b.created_at,
            p.name AS place_name, p.photo_url, p.price_range, p.rating_avg, p.address
     FROM bookmarks b
     JOIN places p ON p.id = b.place_id
     WHERE b.user_id = $1
       AND p.status = 'APPROVED'
     ORDER BY b.created_at DESC`,
    [req.user.sub]
  );
  res.json({ success: true, data: rows });
}));

router.post("/bookmarks", catchAsync(async (req, res) => {
  const { placeId } = req.body;
  if (!placeId) throw new AppError("placeId is required", 400);

  const place = await db.query(
    "SELECT id FROM places WHERE id = $1 AND status = 'APPROVED' LIMIT 1",
    [placeId]
  );
  if (place.rowCount === 0) {
    throw new AppError("Place not found", 404, {
      code: "PLACE_NOT_FOUND",
      safeMessage: "We could not find that place.",
    });
  }

  const { rows } = await db.query(
    `INSERT INTO bookmarks (user_id, place_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING
     RETURNING id, place_id, created_at`,
    [req.user.sub, placeId]
  );
  res.status(201).json({ success: true, data: rows[0] || null });
}));

router.delete("/bookmarks/:placeId", catchAsync(async (req, res) => {
  const { rowCount } = await db.query(
    "DELETE FROM bookmarks WHERE user_id = $1 AND place_id = $2",
    [req.user.sub, req.params.placeId]
  );
  res.json({ success: true, data: { deleted: rowCount > 0 } });
}));

// ── Saved Routes ────────────────────────────────────────────────────────────

router.get("/routes", catchAsync(async (req, res) => {
  const { rows } = await db.query(
    `SELECT id, label, origin, destination, waypoints, saved_at
     FROM routes WHERE user_id = $1
     ORDER BY saved_at DESC`,
    [req.user.sub]
  );
  res.json({ success: true, data: rows });
}));

router.post("/routes", catchAsync(async (req, res) => {
  const { label, origin, destination, waypoints } = req.body;
  if (!origin || !destination) throw new AppError("origin and destination are required", 400);
  const { rows } = await db.query(
    `INSERT INTO routes (user_id, label, origin, destination, waypoints)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, label, origin, destination, waypoints, saved_at`,
    [req.user.sub, label || null, JSON.stringify(origin), JSON.stringify(destination), waypoints ? JSON.stringify(waypoints) : null]
  );
  res.status(201).json({ success: true, data: rows[0] });
}));

router.delete("/routes", catchAsync(async (req, res) => {
  const { rowCount } = await db.query(
    "DELETE FROM routes WHERE user_id = $1",
    [req.user.sub]
  );
  res.json({ success: true, data: { deleted: rowCount } });
}));

router.delete("/routes/:id", catchAsync(async (req, res) => {
  const { rowCount } = await db.query(
    "DELETE FROM routes WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.sub]
  );
  if (!rowCount) throw new AppError("Route not found", 404);
  res.json({ success: true, data: { deleted: true } });
}));

// ── Search History ──────────────────────────────────────────────────────────

router.get("/history", catchAsync(async (req, res) => {
  const { rows } = await db.query(
    `SELECT id, query, filters, results_count, created_at
     FROM search_history WHERE user_id = $1
     ORDER BY created_at DESC LIMIT 50`,
    [req.user.sub]
  );
  res.json({ success: true, data: rows });
}));

router.post("/history", catchAsync(async (req, res) => {
  const { query, filters, resultsCount } = req.body;
  if (!query) throw new AppError("query is required", 400);
  const { rows } = await db.query(
    `INSERT INTO search_history (user_id, query, filters, results_count)
     VALUES ($1, $2, $3, $4)
     RETURNING id, query, filters, results_count, created_at`,
    [req.user.sub, query, filters ? JSON.stringify(filters) : null, resultsCount || 0]
  );
  res.status(201).json({ success: true, data: rows[0] });
}));

router.delete("/history", catchAsync(async (req, res) => {
  await db.query("DELETE FROM search_history WHERE user_id = $1", [req.user.sub]);
  res.json({ success: true, data: { deleted: true } });
}));

router.delete("/history/:id", catchAsync(async (req, res) => {
  const { rowCount } = await db.query(
    "DELETE FROM search_history WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.sub]
  );
  res.json({ success: true, data: { deleted: rowCount > 0 } });
}));

export default router;
