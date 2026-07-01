import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";
import PlaceService from "../services/PlaceService.js";

const placeService = new PlaceService();
const router = Router();

router.get("/", catchAsync(async (req, res) => {
  const places = await placeService.getAll();
  res.json({ success: true, data: places });
}));

router.get("/count", catchAsync(async (req, res) => {
  const { pool } = await import("../config/db.js");
  const { rows } = await pool.query("SELECT COUNT(*)::int AS total FROM places WHERE status = 'APPROVED'");
  res.json({ success: true, data: { total: rows[0].total } });
}));

router.get("/reviews/all", catchAsync(async (req, res) => {
  const { pool } = await import("../config/db.js");
  const { rows } = await pool.query(
    `SELECT r.id, r.rating AS stars, r.body, r.created_at,
            COALESCE(u.first_name || ' ' || u.last_name, 'Anonymous') AS user_name,
            p.name AS place_name, p.id AS place_id
     FROM reviews r
     JOIN places p ON p.id = r.place_id
     LEFT JOIN users u ON u.id = r.user_id
     WHERE r.deleted_at IS NULL
     ORDER BY r.created_at DESC`
  );
  res.json({ success: true, data: rows });
}));

router.get("/:id", catchAsync(async (req, res) => {
  const place = await placeService.getById(req.params.id);
  res.json({ success: true, data: place });
}));

router.get("/:id/reviews", catchAsync(async (req, res) => {
  const reviews = await placeService.getReviews(req.params.id);
  res.json({ success: true, data: reviews });
}));

router.post("/:id/reviews", authMiddleware, restrictToRoles("CONSUMER"), catchAsync(async (req, res) => {
  const review = await placeService.createReview(req.params.id, req.user.sub, req.body);
  res.status(201).json({ success: true, data: review });
}));

export default router;
