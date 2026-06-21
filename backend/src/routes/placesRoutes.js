import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { catchAsync } from "../utils/catchAsync.js";
import PlaceService from "../services/PlaceService.js";

const placeService = new PlaceService();
const router = Router();

router.get("/", catchAsync(async (req, res) => {
  const places = await placeService.getAll();
  res.json({ success: true, data: places });
}));

router.get("/:id", catchAsync(async (req, res) => {
  const place = await placeService.getById(req.params.id);
  res.json({ success: true, data: place });
}));

router.get("/:id/reviews", catchAsync(async (req, res) => {
  const reviews = await placeService.getReviews(req.params.id);
  res.json({ success: true, data: reviews });
}));

router.post("/:id/reviews", authMiddleware, catchAsync(async (req, res) => {
  const review = await placeService.createReview(req.params.id, req.user.sub, req.body);
  res.status(201).json({ success: true, data: review });
}));

export default router;
