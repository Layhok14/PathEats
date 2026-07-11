import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import * as vendorController from "../controllers/vendorController.js";

const router = Router();

// Public
router.get("/onboarding", vendorController.getOnboarding);

// Auth VENDOR-only
router.use(authMiddleware);
router.use(restrictToRoles("VENDOR"));

// Image upload
router.post("/uploads/images", vendorController.imageUpload.single("image"), vendorController.uploadImage);

// Profile
router.get("/profile", vendorController.getProfile);
router.put("/profile", vendorController.updateProfile);
router.post("/change-password", vendorController.changePassword);

// Dashboard
router.get("/dashboard", vendorController.getDashboard);

// Proximity check — MUST be before /stalls/:id to avoid matching "nearby" as :id
router.get("/stalls/nearby", vendorController.checkNearbyStalls);

// Stalls
router.get("/stalls", vendorController.getStalls);
router.post("/stalls", vendorController.createStall);
router.get("/stalls/:id", vendorController.getStallById);
router.put("/stalls/:id", vendorController.updateStall);
router.delete("/stalls/:id", vendorController.deleteStall);

// Menu items (global catalog)
router.get("/items", vendorController.getAllMenuItems);
router.post("/items", vendorController.createMenuItemGlobal);
router.put("/items/:itemId", vendorController.updateMenuItemGlobal);
router.delete("/items/:itemId", vendorController.deleteMenuItemGlobal);

// Reviews
router.get("/reviews", vendorController.getReviews);

// Stall-specific menu items
router.get("/stalls/:id/items", vendorController.getStallMenuItems);
router.post("/stalls/:id/items", vendorController.createStallMenuItem);
router.put("/stalls/:id/items/:itemId", vendorController.updateStallMenuItem);
router.delete("/stalls/:id/items/:itemId", vendorController.deleteStallMenuItem);

export default router;
