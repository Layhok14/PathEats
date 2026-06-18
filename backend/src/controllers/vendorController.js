import VendorService from "../services/VendorService.js";
import { catchAsync } from "../utils/catchAsync.js";

const vendorService = new VendorService();

/**
 * GET /api/vendor/dashboard
 */
export const getDashboard = catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const data = await vendorService.getDashboard(ownerId);
  res.json({ success: true, data });
});

/**
 * GET /api/vendor/stalls
 */
export const getStalls = catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const stalls = await vendorService.getStalls(ownerId);
  res.json({ success: true, data: stalls });
});

/**
 * POST /api/vendor/stalls
 */
export const createStall = catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const stall = await vendorService.createStall(ownerId, req.body);
  res.status(201).json({ success: true, data: stall });
});

/**
 * GET /api/vendor/stalls/:id
 */
export const getStallById = catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const stall = await vendorService.getStallById(ownerId, req.params.id);
  res.json({ success: true, data: stall });
});
