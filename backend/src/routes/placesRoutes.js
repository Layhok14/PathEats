import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import * as placesController from "../controllers/placesController.js";
import { getConsumerCategories } from "../repositories/adminRepository.js";

const router = Router();

router.get("/", placesController.getAll);
router.post("/search", placesController.search);
router.post("/score", placesController.getScore);
router.post("/route", placesController.getRoute);
router.get("/count", placesController.getCount);
router.get("/categories", async (_req, res, next) => {
  try {
    const categories = await getConsumerCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
});
router.get("/reviews/all", placesController.getAllReviews);
router.get("/:id", placesController.getById);
router.get("/:id/reviews", placesController.getReviews);
router.post("/:id/reviews", authMiddleware, restrictToRoles("CONSUMER"), placesController.createReview);
router.patch("/:id/reviews/:reviewId", authMiddleware, restrictToRoles("CONSUMER"), placesController.updateReview);
router.delete("/:id/reviews/:reviewId", authMiddleware, restrictToRoles("CONSUMER"), placesController.deleteReview);

export default router;
