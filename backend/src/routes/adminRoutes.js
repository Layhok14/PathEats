import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";
import * as adminController from "../controllers/adminController.js";

const router = Router();

const devAdminBypass = (req, res, next) => {
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (isDevelopment) {
    req.user = {
      sub: "dev-admin",
      email: "dev-admin@patheat.local",
      role_scope: "GLOBAL_ADMIN",
    };
    return next();
  }

  return authMiddleware(req, res, next);
};

router.use(devAdminBypass);
router.use(restrictToRoles("GLOBAL_ADMIN"));

router.get("/db/check", catchAsync(adminController.checkDatabase));
router.get("/telemetry", catchAsync(adminController.getDashboardTelemetry));
router.get("/roles", catchAsync(adminController.getRoles));
router.post("/roles", catchAsync(adminController.createRole));
router.patch("/roles/:id", catchAsync(adminController.updateRoleRecord));
router.delete("/roles/:id", catchAsync(adminController.deleteRoleRecord));
router.get("/users", catchAsync(adminController.getUsers));
router.get("/user-management/overview", catchAsync(adminController.getUserManagementOverview));
router.post("/users", catchAsync(adminController.createUser));
router.patch("/users/:id/role", catchAsync(adminController.updateRole));
router.patch("/users/:id/status", catchAsync(adminController.updateStatus));
router.post("/users/:id/ban", catchAsync(async (req, res, next) => {
  req.body.status = req.body.banned === false ? "Active" : "Suspended";
  return adminController.updateStatus(req, res, next);
}));
router.get("/vendors", catchAsync(adminController.getVendors));
router.get("/vendor-management/overview", catchAsync(adminController.getVendorManagementOverview));
router.get("/place-categories", catchAsync(adminController.getPlaceCategories));
router.post("/vendors/:id/approve", catchAsync(adminController.approveVendor));
router.get("/stall-management/options", catchAsync(adminController.getStallManagementOptions));
router.post("/stalls", catchAsync(adminController.createStall));
router.delete("/stalls/:id", catchAsync(adminController.deleteStall));
router.post("/stalls/:placeId/menu-items", catchAsync(adminController.createStallMenuItem));
router.delete("/stalls/menu-items/:id", catchAsync(adminController.deleteStallMenuItem));
router.post("/stalls/place-categories", catchAsync(adminController.createStallCategory));
router.delete("/stalls/place-categories/:id", catchAsync(adminController.deleteStallCategory));
router.post("/stalls/:placeId/place-hours", catchAsync(adminController.createStallPlaceHour));
router.delete("/stalls/place-hours/:id", catchAsync(adminController.deleteStallPlaceHour));
router.post("/stalls/:placeId/reviews", catchAsync(adminController.createStallReview));
router.delete("/stalls/reviews/:id", catchAsync(adminController.deleteStallReview));
router.get("/settings", catchAsync(async (req, res) => {
  res.json({ success: true, data: {} });
}));
router.put("/settings", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Update settings - implement" } });
}));
router.get("/audit", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

export default router;
