import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import * as vendorController from "../controllers/vendorController.js";
import { requirePrivileges } from "../middlewares/privilegeGuard.js";

const router = Router();

// Public
router.get("/onboarding", vendorController.getOnboarding);

// Auth VENDOR-only
router.use(authMiddleware);
router.use(restrictToRoles("VENDOR"));

// Image upload
router.post("/uploads/images", requirePrivileges({ table: "menu_item_images", action: "INSERT" }), vendorController.imageUpload.single("image"), vendorController.uploadImage);

// Profile
router.get("/profile", requirePrivileges({ table: "users", action: "SELECT" }), vendorController.getProfile);
router.put("/profile", requirePrivileges({ table: "users", action: "UPDATE" }), vendorController.updateProfile);
router.post(
  "/profile/image",
  requirePrivileges({ table: "user_profile_images", action: "INSERT" }),
  vendorController.imageUpload.single("image"),
  vendorController.uploadProfileImage
);
router.post("/change-password", vendorController.changePassword);

// Dashboard
router.get("/dashboard", vendorController.getDashboard);

// Proximity check — MUST be before /stalls/:id to avoid matching "nearby" as :id
router.get("/stalls/nearby", vendorController.checkNearbyStalls);

// Stalls
router.get("/stalls", requirePrivileges({ table: "places", action: "SELECT" }), vendorController.getStalls);
router.post("/stalls", requirePrivileges({ table: "places", action: "INSERT" }), vendorController.createStall);
router.get("/stalls/:id", requirePrivileges({ table: "places", action: "SELECT" }), vendorController.getStallById);
router.put("/stalls/:id", requirePrivileges({ table: "places", action: "UPDATE" }), vendorController.updateStall);
router.get("/stalls/:id/impact", requirePrivileges({ table: "places", action: "SELECT" }), vendorController.getDeletionImpact);
router.delete("/stalls/:id", requirePrivileges({ table: "places", action: "DELETE" }), vendorController.deleteStall);

// Menu items (global catalog)
router.get("/items", requirePrivileges({ table: "menu_items", action: "SELECT" }), vendorController.getAllMenuItems);
router.get("/items/:itemId/links", requirePrivileges({ table: "place_menu_items", action: "SELECT" }), vendorController.getMenuItemLinkCount);
router.post("/items", requirePrivileges({ table: "menu_items", action: "INSERT" }), vendorController.createMenuItemGlobal);
router.put("/items/:itemId", requirePrivileges({ table: "menu_items", action: "UPDATE" }), vendorController.updateMenuItemGlobal);
router.delete("/items/:itemId", requirePrivileges({ table: "menu_items", action: "DELETE" }), vendorController.deleteMenuItemGlobal);

// Reviews
router.get("/reviews", requirePrivileges({ table: "reviews", action: "SELECT" }), vendorController.getReviews);

// Stall-specific menu items
router.get("/stalls/:id/items", requirePrivileges({ table: "place_menu_items", action: "SELECT" }), vendorController.getStallMenuItems);
router.post("/stalls/:id/items", requirePrivileges({ table: "menu_items", action: "INSERT" }), vendorController.createStallMenuItem);
router.put("/stalls/:id/item-links/:itemId", requirePrivileges({ table: "place_menu_items", action: "INSERT" }), vendorController.linkExistingStallMenuItem);
router.put("/stalls/:id/items/:itemId", requirePrivileges({ table: "menu_items", action: "UPDATE" }, { table: "place_menu_items", action: "UPDATE" }), vendorController.updateStallMenuItem);
router.delete("/stalls/:id/items/:itemId", requirePrivileges({ table: "place_menu_items", action: "DELETE" }), vendorController.deleteStallMenuItem);

export default router;
