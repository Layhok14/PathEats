import * as adminService from "../services/adminService.js";

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
      const result = await this.service.getUsers(page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req, res, next) => {
    try {
      const user = await this.service.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  updateRole = async (req, res, next) => {
    try {
      const user = await this.service.updateRole(req.params.id, req.body.role);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req, res, next) => {
    try {
      const user = await this.service.updateStatus(req.params.id, req.body.status);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  getVendors = async (req, res, next) => {
    try {
      const vendors = await this.service.getVendors();
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
      const vendor = await this.service.approveVendor(req.params.id, req.body.approved !== false);
      res.json({ success: true, data: vendor });
    } catch (error) {
      next(error);
    }
  };

  createRole = async (req, res, next) => {
    try {
      const role = await this.service.createRole(req.body);
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
}

const adminController = new AdminController(adminService);

export const checkDatabase = adminController.checkDatabase;
export const getDashboardTelemetry = adminController.getDashboardTelemetry;
export const getUsers = adminController.getUsers;
export const createUser = adminController.createUser;
export const updateRole = adminController.updateRole;
export const updateStatus = adminController.updateStatus;
export const getVendors = adminController.getVendors;
export const getPlaceCategories = adminController.getPlaceCategories;
export const approveVendor = adminController.approveVendor;
export const createRole = adminController.createRole;
export const getRoles = adminController.getRoles;

export { AdminController };
export default adminController;
