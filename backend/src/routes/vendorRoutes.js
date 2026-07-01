import { Router } from "express";
import multer from "multer";
import bcrypt from "bcryptjs";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";
import VendorService from "../services/VendorService.js";
import UserRepository from "../repositories/UserRepository.js";
import { uploadVendorImage } from "../services/storageService.js";
import AppError from "../utils/AppError.js";

const userRepo = new UserRepository();

const vendorService = new VendorService();
const router = Router();
const MAX_VENDOR_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_VENDOR_IMAGE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.has(file.mimetype)) return cb(null, true);
    cb(new AppError("Only JPEG, PNG, WEBP, and GIF images are allowed", 400));
  },
});

router.use(authMiddleware);
router.use(restrictToRoles("VENDOR"));

router.post("/uploads/images", imageUpload.single("image"), catchAsync(async (req, res) => {
  if (!req.file) throw new AppError("Image file is required", 400);

  const upload = await uploadVendorImage({
    file: req.file,
    ownerId: req.user.sub,
    altText: req.body.altText,
    baseUrl: `${req.protocol}://${req.get("host")}`,
  });

  res.status(201).json({
    success: true,
    data: upload,
  });
}));

router.get("/profile", catchAsync(async (req, res) => {
  const user = await userRepo.findById(req.user.sub);
  if (!user) throw new AppError("Profile not found", 404);
  res.json({ success: true, data: user });
}));

router.put("/profile", catchAsync(async (req, res) => {
  const { firstName, lastName, phone } = req.body;
  const data = {};
  if (firstName !== undefined) data.first_name = firstName;
  if (lastName !== undefined) data.last_name = lastName;
  if (phone !== undefined) data.phone_number = phone;
  const user = await userRepo.updateProfile(req.user.sub, data);
  if (!user) throw new AppError("No profile fields to update", 400);
  res.json({ success: true, data: user });
}));

router.post("/change-password", catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new AppError("Current password and new password are required", 400);
  }
  if (newPassword.length < 6) {
    throw new AppError("New password must be at least 6 characters", 400);
  }
  const user = await userRepo.findByEmailWithPassword(req.user.email);
  if (!user) throw new AppError("User not found", 404);
  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) throw new AppError("Current password is incorrect", 401);
  const password_hash = await bcrypt.hash(newPassword, 12);
  await userRepo.updatePassword(req.user.sub, password_hash);
  res.json({ success: true, data: { message: "Password changed successfully" } });
}));

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
