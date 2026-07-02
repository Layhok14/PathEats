import bcrypt from "bcryptjs";
import multer from "multer";
import VendorService from "../services/VendorService.js";
import UserRepository from "../repositories/UserRepository.js";
import { uploadVendorImage } from "../services/storageService.js";
import { getOnboardingConfig } from "../repositories/adminRepository.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

const userRepo = new UserRepository();
const vendorService = new VendorService();

export const MAX_VENDOR_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_VENDOR_IMAGE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.has(file.mimetype)) return cb(null, true);
    cb(new AppError("Only JPEG, PNG, WEBP, and GIF images are allowed", 400));
  },
});

// ── Public ──

export const getOnboarding = catchAsync(async (req, res) => {
  const config = await getOnboardingConfig();
  res.json({ success: true, data: config });
});

// ── Image Upload ──

export const uploadImage = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError("Image file is required", 400);

  const upload = await uploadVendorImage({
    file: req.file,
    ownerId: req.user.sub,
    altText: req.body.altText,
    baseUrl: `${req.protocol}://${req.get("host")}`,
  });

  res.status(201).json({ success: true, data: upload });
});

// ── Profile ──

export const getProfile = catchAsync(async (req, res) => {
  const user = await userRepo.findById(req.user.sub);
  if (!user) throw new AppError("Profile not found", 404);
  res.json({ success: true, data: user });
});

export const updateProfile = catchAsync(async (req, res) => {
  const { firstName, lastName, phone } = req.body;
  const data = {};
  if (firstName !== undefined) data.first_name = firstName;
  if (lastName !== undefined) data.last_name = lastName;
  if (phone !== undefined) data.phone_number = phone;
  const user = await userRepo.updateProfile(req.user.sub, data);
  if (!user) throw new AppError("No profile fields to update", 400);
  res.json({ success: true, data: user });
});

export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new AppError("Current password and new password are required", 400);
  }
  if (newPassword.length < 8) {
    throw new AppError("New password must be at least 8 characters", 400);
  }
  const user = await userRepo.findByEmailWithPassword(req.user.email);
  if (!user) throw new AppError("User not found", 404);
  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) throw new AppError("Current password is incorrect", 401);
  const password_hash = await bcrypt.hash(newPassword, 12);
  await userRepo.updatePassword(req.user.sub, password_hash);
  res.json({ success: true, data: { message: "Password changed successfully" } });
});

// ── Dashboard ──

export const getDashboard = catchAsync(async (req, res) => {
  const data = await vendorService.getDashboard(req.user.sub);
  res.json({ success: true, data });
});

// ── Stalls ──

export const getStalls = catchAsync(async (req, res) => {
  const stalls = await vendorService.getStalls(req.user.sub);
  res.json({ success: true, data: stalls });
});

export const createStall = catchAsync(async (req, res) => {
  const stall = await vendorService.createStall(req.user.sub, req.body);
  res.status(201).json({ success: true, data: stall });
});

export const getStallById = catchAsync(async (req, res) => {
  const stall = await vendorService.getStallById(req.user.sub, req.params.id);
  res.json({ success: true, data: stall });
});

export const updateStall = catchAsync(async (req, res) => {
  const stall = await vendorService.updateStall(req.user.sub, req.params.id, req.body);
  res.json({ success: true, data: stall });
});

export const deleteStall = catchAsync(async (req, res) => {
  await vendorService.deleteStall(req.user.sub, req.params.id);
  res.json({ success: true, data: { message: "Stall deleted" } });
});

// ── Menu Items (global) ──

export const getAllMenuItems = catchAsync(async (req, res) => {
  const items = await vendorService.getAllMenuItems(req.user.sub);
  res.json({ success: true, data: items });
});

export const createMenuItemGlobal = catchAsync(async (req, res) => {
  const item = await vendorService.createMenuItemGlobal(req.user.sub, req.body);
  res.status(201).json({ success: true, data: item });
});

export const updateMenuItemGlobal = catchAsync(async (req, res) => {
  const item = await vendorService.updateMenuItemGlobal(req.user.sub, req.params.itemId, req.body);
  res.json({ success: true, data: item });
});

export const deleteMenuItemGlobal = catchAsync(async (req, res) => {
  await vendorService.deleteMenuItemGlobal(req.user.sub, req.params.itemId);
  res.json({ success: true, data: { message: "Menu item deleted" } });
});

// ── Reviews ──

export const getReviews = catchAsync(async (req, res) => {
  const reviews = await vendorService.getReviews(req.user.sub);
  res.json({ success: true, data: reviews });
});

// ── Stall-specific Menu Items ──

export const getStallMenuItems = catchAsync(async (req, res) => {
  const items = await vendorService.getMenuItems(req.user.sub, req.params.id);
  res.json({ success: true, data: items });
});

export const createStallMenuItem = catchAsync(async (req, res) => {
  const item = await vendorService.createMenuItem(req.user.sub, req.params.id, req.body);
  res.status(201).json({ success: true, data: item });
});

export const updateStallMenuItem = catchAsync(async (req, res) => {
  const item = await vendorService.updateMenuItem(req.user.sub, req.params.id, req.params.itemId, req.body);
  res.json({ success: true, data: item });
});

export const deleteStallMenuItem = catchAsync(async (req, res) => {
  await vendorService.deleteMenuItem(req.user.sub, req.params.id, req.params.itemId);
  res.json({ success: true, data: { message: "Menu item deleted" } });
});
