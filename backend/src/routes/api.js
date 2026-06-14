import { Router } from "express";
import authRoutes from "./authRoutes.js";
import vendorRoutes from "./vendorRoutes.js";
import { getRouteHandler } from "../controllers/mapController.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/vendor", vendorRoutes);

// Spatial routing
router.get("/spatial/routing", getRouteHandler);

// Health check
router.get("/health", (req, res) => {
  res.json({ success: true, message: "PathEat API running" });
});

export default router;
