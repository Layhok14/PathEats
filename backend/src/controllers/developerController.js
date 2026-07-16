import DeveloperService from "../services/DeveloperService.js";
import * as adminService from "../services/AdminService.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

const developerService = new DeveloperService();

export const getHealth = catchAsync(async (_req, res) => {
  res.json({ success: true, data: await developerService.getHealth() });
});

export const getDatabase = catchAsync(async (_req, res) => {
  res.json({ success: true, data: await developerService.getDatabaseInfo() });
});

export const getLogs = catchAsync(async (req, res) => {
  res.json({ success: true, data: await developerService.getLogs(req.query) });
});

export const getApiMetrics = catchAsync(async (_req, res) => {
  res.json({ success: true, data: await developerService.getApiMetrics() });
});

export const getPresets = catchAsync(async (req, res) => {
  res.json({ success: true, data: await developerService.getPresets(req.query) });
});

export const getAllPresets = catchAsync(async (req, res) => {
  res.json({ success: true, data: await developerService.getPresets({ ...req.query, all: true }) });
});

export const createPreset = catchAsync(async (req, res) => {
  const preset = await developerService.createPreset(req.body, req.user.sub);
  res.status(201).json({ success: true, data: preset });
});

export const updatePreset = catchAsync(async (req, res) => {
  res.json({ success: true, data: await developerService.updatePreset(req.params.id, req.body) });
});

export const deletePreset = catchAsync(async (req, res) => {
  res.json({ success: true, data: await developerService.deletePreset(req.params.id) });
});

export const markPresetUsed = catchAsync(async (req, res) => {
  await developerService.markPresetUsed(req.params.id);
  res.json({ success: true });
});

export const executeQuery = catchAsync(async (req, res) => {
  res.json({ success: true, data: await developerService.executeQuery(req.body.sql, req.body.presetId, req.user) });
});

export const getQueryHistory = catchAsync(async (req, res) => {
  res.json({ success: true, data: await developerService.getQueryHistory(req.query.limit) });
});

export const getMaintenance = catchAsync(async (_req, res) => {
  res.json({ success: true, data: await developerService.getMaintenance() });
});

export const getErrors = catchAsync(async (_req, res) => {
  res.json({ success: true, data: await developerService.getErrors() });
});

export const getActivityLog = catchAsync(async (req, res) => {
  res.json({ success: true, data: await developerService.getActivityLog(req.query) });
});

export const getReviews = catchAsync(async (_req, res) => {
  res.json({ success: true, data: await adminService.getAllReviews() });
});

export const getUserManagementOverview = catchAsync(async (req, res) => {
  res.json({ success: true, data: await adminService.getUserManagementOverview(req.query.search, req.query.role_scope) });
});

export const getVendorManagementOverview = catchAsync(async (req, res) => {
  res.json({ success: true, data: await adminService.getVendorManagementOverview(req.query.search) });
});

export const getAuditByRole = catchAsync(async (req, res) => {
  const roleScope = String(req.query.role_scope || "").trim().toUpperCase();
  if (!["GLOBAL_ADMIN", "DEVELOPER_ADMIN", "BUSINESS_ASSISTANCE"].includes(roleScope)) {
    throw new AppError("Valid admin role_scope is required", 400);
  }
  const limit = Math.min(Number.parseInt(req.query.limit, 10) || 100, 500);
  res.json({ success: true, data: await adminService.getAuditLogsByRoleScope(roleScope, limit) });
});

export const getProfile = catchAsync(async (req, res) => {
  res.json({ success: true, data: await adminService.getAdminProfile(req.user.sub) });
});
