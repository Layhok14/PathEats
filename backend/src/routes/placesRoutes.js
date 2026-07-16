import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import * as placesController from "../controllers/placesController.js";
import { requirePrivileges } from "../middlewares/privilegeGuard.js";

const router = Router();

router.get("/", placesController.getAll);
router.post("/search", placesController.search);
router.post("/score", placesController.getScore);
router.post("/route", placesController.getRoute);
router.get("/count", placesController.getCount);
router.get("/categories", placesController.getCategories);
router.get("/reviews/all", placesController.getAllReviews);
router.get("/:id", placesController.getById);
router.get("/:id/reviews", placesController.getReviews);
router.post("/:id/reviews", authMiddleware, restrictToRoles("CONSUMER"), requirePrivileges({ table: "reviews", action: "INSERT" }), placesController.createReview);
router.patch("/:id/reviews/:reviewId", authMiddleware, restrictToRoles("CONSUMER"), requirePrivileges({ table: "reviews", action: "UPDATE" }), placesController.updateReview);
router.delete("/:id/reviews/:reviewId", authMiddleware, restrictToRoles("CONSUMER"), requirePrivileges({ table: "reviews", action: "DELETE" }), placesController.deleteReview);

export default router;
