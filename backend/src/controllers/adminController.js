import * as adminService from "../services/AdminService.js";
import AppError from "../utils/AppError.js";

function validatePrice(price) {
  if (price === undefined || price === null || price === "") return;
  const n = Number(price);
  if (!Number.isFinite(n) || n < 0 || n > 99999.99 || !String(price).match(/^\d+(\.\d{1,2})?$/)) {
    throw new AppError("Invalid price. Must be a number between 0 and 99,999.99 with at most 2 decimal places.", 400);
  }
}

class AdminController {
  constructor(service) {
    this.service = service;
  }

  checkDatabase = async (req, res, next) => {
    try {
      const result = await this.service.checkDatabaseConnection();
      res.status(result.connected ? 200 : 503).json({
        success: result.connected,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getDashboardTelemetry = async (req, res, next) => {
    try {
      const telemetry = await this.service.getDashboardTelemetry();
      res.status(200).json({ success: true, data: telemetry });
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req, res, next) => {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 20);
      const roleScope = req.query.role_scope || req.query.role || null;
      const result = await this.service.getUsers(page, limit, roleScope);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getUserManagementOverview = async (req, res, next) => {
    try {
      const rows = await this.service.getUserManagementOverview(req.query.search, req.query.role_scope);
      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      next(error);
    }
  };

  getVendorManagementOverview = async (req, res, next) => {
    try {
      const rows = await this.service.getVendorManagementOverview(req.query.search);
      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req, res, next) => {
    try {
      const user = await this.service.createUser(req.body, req.user?.sub, req.user?.role_scope || req.user?.role);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  updateRole = async (req, res, next) => {
    try {
      const user = await this.service.updateRole(req.params.id, req.body.role, req.user?.sub, req.user?.role_scope || req.user?.role);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req, res, next) => {
    try {
      const user = await this.service.updateStatus(req.params.id, req.body.status, req.user?.sub, req.user?.role_scope || req.user?.role);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  getVendors = async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(2000, Math.max(1, parseInt(req.query.limit, 10) || 1000));
      const vendors = await this.service.getVendors(page, limit);
      res.json({ success: true, data: vendors });
    } catch (error) {
      next(error);
    }
  };

  getPlaceCategories = async (req, res, next) => {
    try {
      const categories = await this.service.getPlaceCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  };

  approveVendor = async (req, res, next) => {
    try {
      const vendor = await this.service.approveVendor(req.params.id, req.body.approved !== false, req.user?.sub, req.user?.role_scope || req.user?.role);
      res.json({ success: true, data: vendor });
    } catch (error) {
      next(error);
    }
  };

  getStallManagementOptions = async (req, res, next) => {
    try {
      const options = await this.service.getStallManagementOptions();
      res.json({ success: true, data: options });
    } catch (error) {
      next(error);
    }
  };

  createStall = async (req, res, next) => {
    try {
      const stall = await this.service.createStall(req.body, req.user?.sub, req.user?.role_scope || req.user?.role);
      res.status(201).json({ success: true, data: stall });
    } catch (error) {
      next(error);
    }
  };

  deleteStall = async (req, res, next) => {
    try {
      const stall = await this.service.deleteStall(req.params.id, req.user?.sub, req.user?.role_scope || req.user?.role);
      if (!stall) return res.status(404).json({ success: false, message: "Stall not found" });
      res.json({ success: true, data: stall });
    } catch (error) {
      next(error);
    }
  };

  createStallMenuItem = async (req, res, next) => {
    try {
      validatePrice(req.body.price);
      const menuItem = await this.service.createStallMenuItem(req.params.placeId, req.body, req.user?.sub, req.user?.role_scope || req.user?.role);
      res.status(201).json({ success: true, data: menuItem });
    } catch (error) {
      next(error);
    }
  };

  deleteStallMenuItem = async (req, res, next) => {
    try {
      const menuItem = await this.service.deleteStallMenuItem(req.params.id, req.query.placeId || null, req.user?.sub, req.user?.role_scope || req.user?.role);
      if (!menuItem) return res.status(404).json({ success: false, message: "Menu item not found" });
      res.json({ success: true, data: menuItem });
    } catch (error) {
      next(error);
    }
  };

  createStallCategory = async (req, res, next) => {
    try {
      const category = await this.service.createStallCategory(req.body, req.user?.sub, req.user?.role_scope || req.user?.role);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  };

  deleteStallCategory = async (req, res, next) => {
    try {
      const category = await this.service.deleteStallCategory(req.params.id, req.user?.sub, req.user?.role_scope || req.user?.role);
      if (!category) return res.status(404).json({ success: false, message: "Category not found" });
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  };

  createStallPlaceHour = async (req, res, next) => {
    try {
      const hour = await this.service.createStallPlaceHour(req.params.placeId, req.body, req.user?.sub, req.user?.role_scope || req.user?.role);
      res.status(201).json({ success: true, data: hour });
    } catch (error) {
      next(error);
    }
  };

  deleteStallPlaceHour = async (req, res, next) => {
    try {
      const hour = await this.service.deleteStallPlaceHour(req.params.id, req.user?.sub, req.user?.role_scope || req.user?.role);
      if (!hour) return res.status(404).json({ success: false, message: "Place hour not found" });
      res.json({ success: true, data: hour });
    } catch (error) {
      next(error);
    }
  };

  createStallReview = async (req, res, next) => {
    try {
      const review = await this.service.createStallReview(req.params.placeId, req.body, req.user?.sub, req.user?.role_scope || req.user?.role);
      res.status(201).json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  };

  deleteStallReview = async (req, res, next) => {
    try {
      const review = await this.service.deleteStallReview(req.params.id, req.user?.sub, req.user?.role_scope || req.user?.role);
      if (!review) return res.status(404).json({ success: false, message: "Review not found" });
      res.json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  };

  createRole = async (req, res, next) => {
    try {
      const role = await this.service.createRole(req.body, req.user?.sub, req.user?.role_scope || req.user?.role);
      res.status(201).json({
        success: true,
        message: "Role created successfully",
        data: role,
      });
    } catch (error) {
      next(error);
    }
  };

  getRoles = async (req, res, next) => {
    try {
      const roles = await this.service.getRoles();
      res.json({ success: true, data: roles });
    } catch (error) {
      next(error);
    }
  };

  updateRoleRecord = async (req, res, next) => {
    try {
      const role = await this.service.updateRoleRecord(req.params.id, req.body, req.user?.sub, req.user?.role_scope || req.user?.role);
      if (!role) {
        return res.status(404).json({ success: false, message: "Role not found" });
      }
      res.json({ success: true, message: "Role updated successfully", data: role });
    } catch (error) {
      next(error);
    }
  };

  deleteRoleRecord = async (req, res, next) => {
    try {
      const role = await this.service.deleteRoleRecord(req.params.id, req.user?.sub, req.user?.role_scope || req.user?.role);
      if (!role) {
        return res.status(404).json({ success: false, message: "Role not found" });
      }
      res.json({ success: true, message: "Role deleted successfully", data: role });
    } catch (error) {
      next(error);
    }
  };

  getAllStalls = async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(2000, Math.max(1, parseInt(req.query.limit, 10) || 1000));
      const stalls = await this.service.getAllStalls(page, limit);
      res.json({ success: true, data: stalls });
    } catch (error) {
      next(error);
    }
  };

  getStallById = async (req, res, next) => {
    try {
      const stall = await this.service.getStallById(req.params.id);
      if (!stall) return res.status(404).json({ success: false, message: "Stall not found" });
      res.json({ success: true, data: stall });
    } catch (error) {
      next(error);
    }
  };

  getStallsByOwner = async (req, res, next) => {
    try {
      const limit = Math.min(2000, Math.max(1, parseInt(req.query.limit, 10) || 1000));
      const stalls = await this.service.getStallsByOwner(req.params.ownerId, limit);
      res.json({ success: true, data: stalls });
    } catch (error) {
      next(error);
    }
  };

  editStall = async (req, res, next) => {
    try {
      const stall = await this.service.editStall(req.params.id, req.body, req.user?.sub, req.user?.role_scope || req.user?.role);
      if (!stall) return res.status(404).json({ success: false, message: "Stall not found" });
      res.json({ success: true, data: stall });
    } catch (error) {
      next(error);
    }
  };

  toggleStallStatus = async (req, res, next) => {
    try {
      const stall = await this.service.toggleStallStatus(req.params.id, req.user?.sub, req.user?.role_scope || req.user?.role);
      if (!stall) return res.status(404).json({ success: false, message: "Stall not found" });
      res.json({ success: true, data: stall });
    } catch (error) {
      next(error);
    }
  };

  getAuditActivity = async (req, res, next) => {
    try {
      const activity = await this.service.getAuditActivity();
      res.json({ success: true, data: activity });
    } catch (error) {
      next(error);
    }
  };

  getAllMenuItems = async (req, res, next) => {
    try {
      const { placeId, ownerId } = req.query;
      const items = await this.service.getAllMenuItems(placeId || null, ownerId || null);
      res.json({ success: true, data: items });
    } catch (error) {
      next(error);
    }
  };

  getAllReviews = async (req, res, next) => {
    try {
      const limit = Math.min(5000, Math.max(1, parseInt(req.query.limit, 10) || 2000));
      const offset = Math.max(0, parseInt(req.query.offset, 10) || 0);
      const reviews = await this.service.getAllReviews(limit, offset);
      res.json({ success: true, data: reviews });
    } catch (error) {
      next(error);
    }
  };

  getReviewsByPlaceId = async (req, res, next) => {
    try {
      const reviews = await this.service.getReviewsByPlaceId(req.params.placeId);
      res.json({ success: true, data: reviews });
    } catch (error) {
      next(error);
    }
  };

  editMenuItem = async (req, res, next) => {
    try {
      validatePrice(req.body.price);
      const item = await this.service.editMenuItem(req.params.id, req.body, req.user?.sub, req.user?.role_scope || req.user?.role);
      if (!item) return res.status(404).json({ success: false, message: "Menu item not found" });
      res.json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  };

  // ── New: Audit Logs ───────────────────────────────────────────────

  getAuditLogs = async (req, res, next) => {
    try {
      const limit = Number(req.query.limit || 50);
      const logs = await this.service.getAuditLogs(limit);
      res.json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  };

  getAuditLogsByRoleScope = async (req, res, next) => {
    try {
      const roleScope = req.query.role_scope;
      const limit = Number(req.query.limit || 100);
      if (!roleScope || !["GLOBAL_ADMIN", "DEVELOPER_ADMIN", "BUSINESS_ASSISTANCE"].includes(roleScope)) {
        return res.status(400).json({ success: false, message: "Valid role_scope is required (GLOBAL_ADMIN, DEVELOPER_ADMIN, BUSINESS_ASSISTANCE)" });
      }
      const logs = await this.service.getAuditLogsByRoleScope(roleScope, limit);
      res.json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  };

  // ── New: User CRUD ────────────────────────────────────────────────

  getUserById = async (req, res, next) => {
    try {
      const user = await this.service.getUserById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const user = await this.service.updateUser(req.params.id, req.body, req.user?.sub, req.user?.role_scope || req.user?.role);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      const user = await this.service.deleteUser(req.params.id, req.user?.sub, req.user?.role_scope || req.user?.role);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      res.json({ success: true, message: "User deleted successfully", data: user });
    } catch (error) {
      next(error);
    }
  };

  // ── New: Database Tables ──────────────────────────────────────────

  getDatabaseTables = async (req, res, next) => {
    try {
      const tables = await this.service.getDatabaseTables();
      res.json({ success: true, data: tables });
    } catch (error) {
      next(error);
    }
  };

  // ── Onboarding Config ───────────────────────────────────────────

  getOnboardingConfig = async (req, res, next) => {
    try {
      const config = await this.service.getOnboardingConfig();
      res.json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  };

  updateOnboardingConfig = async (req, res, next) => {
    try {
      const config = await this.service.updateOnboardingConfig(req.body, req.user?.sub, req.user?.role_scope || req.user?.role);
      res.json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  };

  // ── Review Moderation ───────────────────────────────────────────

  flagReview = async (req, res, next) => {
    try {
      const review = await this.service.flagReview(req.params.id, req.user?.sub, req.user?.role_scope || req.user?.role);
      if (!review) return res.status(404).json({ success: false, message: "Review not found" });
      res.json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  };

  unflagReview = async (req, res, next) => {
    try {
      const review = await this.service.unflagReview(req.params.id, req.user?.sub, req.user?.role_scope || req.user?.role);
      if (!review) return res.status(404).json({ success: false, message: "Review not found" });
      res.json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  };

  removeReview = async (req, res, next) => {
    try {
      const review = await this.service.removeReview(req.params.id, req.user?.sub, req.user?.role_scope || req.user?.role);
      if (!review) return res.status(404).json({ success: false, message: "Review not found" });
      res.json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  };

}

const adminController = new AdminController(adminService);

export const checkDatabase = adminController.checkDatabase;
export const getDashboardTelemetry = adminController.getDashboardTelemetry;
export const getUsers = adminController.getUsers;
export const getUserManagementOverview = adminController.getUserManagementOverview;
export const getVendorManagementOverview = adminController.getVendorManagementOverview;
export const createUser = adminController.createUser;
export const updateRole = adminController.updateRole;
export const updateStatus = adminController.updateStatus;
export const getVendors = adminController.getVendors;
export const getPlaceCategories = adminController.getPlaceCategories;
export const approveVendor = adminController.approveVendor;
export const getStallManagementOptions = adminController.getStallManagementOptions;
export const createStall = adminController.createStall;
export const deleteStall = adminController.deleteStall;
export const createStallMenuItem = adminController.createStallMenuItem;
export const deleteStallMenuItem = adminController.deleteStallMenuItem;
export const createStallCategory = adminController.createStallCategory;
export const deleteStallCategory = adminController.deleteStallCategory;
export const createStallPlaceHour = adminController.createStallPlaceHour;
export const deleteStallPlaceHour = adminController.deleteStallPlaceHour;
export const createStallReview = adminController.createStallReview;
export const deleteStallReview = adminController.deleteStallReview;
export const createRole = adminController.createRole;
export const getRoles = adminController.getRoles;
export const updateRoleRecord = adminController.updateRoleRecord;
export const deleteRoleRecord = adminController.deleteRoleRecord;

export const getAllStalls = adminController.getAllStalls;
export const getStallById = adminController.getStallById;
export const getStallsByOwner = adminController.getStallsByOwner;
export const editStall = adminController.editStall;
export const toggleStallStatus = adminController.toggleStallStatus;
export const getAuditActivity = adminController.getAuditActivity;
export const getAllMenuItems = adminController.getAllMenuItems;
export const editMenuItem = adminController.editMenuItem;
export const getAllReviews = adminController.getAllReviews;
export const getReviewsByPlaceId = adminController.getReviewsByPlaceId;

export const getAuditLogs = adminController.getAuditLogs;
export const getAuditLogsByRoleScope = adminController.getAuditLogsByRoleScope;
export const getUserById = adminController.getUserById;
export const updateUser = adminController.updateUser;
export const deleteUser = adminController.deleteUser;
export const getDatabaseTables = adminController.getDatabaseTables;
export const getOnboardingConfig = adminController.getOnboardingConfig;
export const updateOnboardingConfig = adminController.updateOnboardingConfig;
export const flagReview = adminController.flagReview;
export const unflagReview = adminController.unflagReview;
export const removeReview = adminController.removeReview;

export { AdminController };
export default adminController;
