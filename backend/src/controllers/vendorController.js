import VendorService from "../services/VendorService.js";
import AuthService from "../services/AuthService.js";
import UserRepository from "../repositories/UserRepository.js";
import { uploadVendorImage } from "../services/storageService.js";
import { imageUpload } from "../middlewares/imageUpload.js";
import {
  attachProfileImageUrl,
  saveProfileImage,
} from "../services/profileImageService.js";
import { getOnboardingConfig } from "../repositories/adminRepository.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { validatePrice } from "../utils/validation.js";

const userRepo = new UserRepository();
const vendorService = new VendorService();
const authService = new AuthService();

export { imageUpload };

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
  res.json({ success: true, data: attachProfileImageUrl(user) });
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

export const uploadProfileImage = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError("Profile image file is required", 400);

  const profileImage = await saveProfileImage({
    userId: req.user.sub,
    file: req.file,
    altText: req.body.altText,
    baseUrl: `${req.protocol}://${req.get("host")}`,
  });

  res.status(201).json({ success: true, data: profileImage });
});

export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new AppError("Current password and new password are required", 400);
  }
  const result = await authService.changePassword(req.user.sub, currentPassword, newPassword);
  res.json({ success: true, data: result });
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
  validatePrice(req.body.price);
  const item = await vendorService.createMenuItemGlobal(req.user.sub, req.body);
  res.status(201).json({ success: true, data: item });
});

export const updateMenuItemGlobal = catchAsync(async (req, res) => {
  validatePrice(req.body.price);
  const item = await vendorService.updateMenuItemGlobal(req.user.sub, req.params.itemId, req.body);
  res.json({ success: true, data: item });
});

export const deleteMenuItemGlobal = catchAsync(async (req, res) => {
  await vendorService.deleteMenuItemGlobal(req.user.sub, req.params.itemId);
  res.json({ success: true, data: { message: "Menu item deleted" } });
});

export const getMenuItemLinkCount = catchAsync(async (req, res) => {
  const { getMenuItemLinkCount } = await import("../repositories/adminRepository.js");
  const count = await getMenuItemLinkCount(req.params.itemId);
  res.json({ success: true, data: { count } });
});

export const getDeletionImpact = catchAsync(async (req, res) => {
  const { getDeletionImpact } = await import("../repositories/adminRepository.js");
  const impact = await getDeletionImpact(req.params.id);
  res.json({ success: true, data: impact });
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
  validatePrice(req.body.price);
  const item = await vendorService.createMenuItem(req.user.sub, req.params.id, req.body);
  res.status(201).json({ success: true, data: item });
});

export const linkExistingStallMenuItem = catchAsync(async (req, res) => {
  if (req.body.price !== undefined) validatePrice(req.body.price);
  const item = await vendorService.linkExistingMenuItem(
    req.user.sub,
    req.params.id,
    req.params.itemId,
    req.body
  );
  res.json({ success: true, data: item });
});

export const updateStallMenuItem = catchAsync(async (req, res) => {
  validatePrice(req.body.price);
  const item = await vendorService.updateMenuItem(req.user.sub, req.params.id, req.params.itemId, req.body);
  res.json({ success: true, data: item });
});

export const deleteStallMenuItem = catchAsync(async (req, res) => {
  await vendorService.deleteMenuItem(req.user.sub, req.params.id, req.params.itemId);
  res.json({ success: true, data: { message: "Menu item deleted" } });
});

export const checkNearbyStalls = catchAsync(async (req, res) => {
  const { latitude, longitude } = req.query;
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.json({ success: true, data: [] });
  }
  const vendorRepo = (await import("../repositories/VendorRepository.js")).default;
  const repo = new vendorRepo();
  const nearby = await repo.findNearbyStalls(lat, lng, req.user.sub);
  res.json({ success: true, data: nearby });
});
