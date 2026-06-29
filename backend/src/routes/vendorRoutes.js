import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";
import VendorService from "../services/VendorService.js";

const vendorService = new VendorService();
const router = Router();

router.use(authMiddleware);
router.use(restrictToRoles("VENDOR"));

router.get("/dashboard", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const data = await vendorService.getDashboard(ownerId);
  res.json({ success: true, data });
}));

router.get("/stalls", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const stalls = await vendorService.getStalls(ownerId);
  res.json({ success: true, data: stalls });
}));

router.post("/stalls", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const stall = await vendorService.createStall(ownerId, req.body);
  res.status(201).json({ success: true, data: stall });
}));

router.get("/stalls/:id", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const stall = await vendorService.getStallById(ownerId, req.params.id);
  res.json({ success: true, data: stall });
}));

router.put("/stalls/:id", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const stall = await vendorService.updateStall(ownerId, req.params.id, req.body);
  res.json({ success: true, data: stall });
}));

router.delete("/stalls/:id", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  await vendorService.deleteStall(ownerId, req.params.id);
  res.json({ success: true, data: { message: "Stall deleted" } });
}));

router.get("/items", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const items = await vendorService.getAllMenuItems(ownerId);
  res.json({ success: true, data: items });
}));

router.post("/items", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const item = await vendorService.createMenuItemGlobal(ownerId, req.body);
  res.status(201).json({ success: true, data: item });
}));

router.put("/items/:itemId", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const item = await vendorService.updateMenuItemGlobal(ownerId, req.params.itemId, req.body);
  res.json({ success: true, data: item });
}));

router.delete("/items/:itemId", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  await vendorService.deleteMenuItemGlobal(ownerId, req.params.itemId);
  res.json({ success: true, data: { message: "Menu item deleted" } });
}));

router.get("/onboarding", catchAsync(async (req, res) => {
  const adminRepository = await import("../repositories/adminRepository.js");
  const config = await adminRepository.getOnboardingConfig();
  res.json({ success: true, data: config });
}));

router.get("/reviews", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const reviews = await vendorService.getReviews(ownerId);
  res.json({ success: true, data: reviews });
}));

router.get("/stalls/:id/items", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const items = await vendorService.getMenuItems(ownerId, req.params.id);
  res.json({ success: true, data: items });
}));

router.post("/stalls/:id/items", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const item = await vendorService.createMenuItem(ownerId, req.params.id, req.body);
  res.status(201).json({ success: true, data: item });
}));

router.put("/stalls/:id/items/:itemId", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const item = await vendorService.updateMenuItem(ownerId, req.params.id, req.params.itemId, req.body);
  res.json({ success: true, data: item });
}));

router.delete("/stalls/:id/items/:itemId", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  await vendorService.deleteMenuItem(ownerId, req.params.id, req.params.itemId);
  res.json({ success: true, data: { message: "Menu item deleted" } });
}));

export default router;
