import developerService from "../services/developerService.js";

class DeveloperController {
  constructor(service = developerService) {
    this.service = service;
  }

  health = async (req, res) => {
    res.json({
      success: true,
      data: {
        status: "healthy",
        uptime: process.uptime(),
        checkedAt: new Date().toISOString(),
      },
    });
  };

  getUsers = async (req, res) => {
    const users = await this.service.listUsers();
    res.json({ success: true, data: users });
  };

  createUser = async (req, res) => {
    const user = await this.service.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  };

  updateUser = async (req, res) => {
    const user = await this.service.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  };

  banUser = async (req, res) => {
    const user = await this.service.setUserBan(req.params.id, true);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  };

  unbanUser = async (req, res) => {
    const user = await this.service.setUserBan(req.params.id, false);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  };

  deleteUser = async (req, res) => {
    const user = await this.service.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  };

  getVendors = async (req, res) => {
    const vendors = await this.service.listVendors();
    res.json({ success: true, data: vendors });
  };

  getPlaceCategories = async (req, res) => {
    const categories = await this.service.listPlaceCategories();
    res.json({ success: true, data: categories });
  };

  getTableColumns = async (req, res) => {
    const columns = await this.service.listTableColumns(req.params.tableName);
    res.json({ success: true, data: columns });
  };

  createVendor = async (req, res) => {
    const vendor = await this.service.createVendor(req.body);
    res.status(201).json({ success: true, data: vendor });
  };

  updateVendor = async (req, res) => {
    const vendor = await this.service.updateVendor(req.params.id, req.body);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.json({ success: true, data: vendor });
  };

  banVendor = async (req, res) => {
    const vendor = await this.service.setVendorBan(req.params.id, true);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.json({ success: true, data: vendor });
  };

  unbanVendor = async (req, res) => {
    const vendor = await this.service.setVendorBan(req.params.id, false);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.json({ success: true, data: vendor });
  };

  deleteVendor = async (req, res) => {
    const vendor = await this.service.deleteVendor(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.json({ success: true, data: vendor });
  };

  getBackups = async (req, res) => {
    const backups = await this.service.listBackups();
    res.json({ success: true, data: backups });
  };

  createBackup = async (req, res) => {
    const backup = await this.service.createBackup(req.body);
    res.status(201).json({ success: true, data: backup });
  };

  recoverBackup = async (req, res) => {
    const backup = await this.service.recoverBackup(req.params.id);
    if (!backup) return res.status(404).json({ success: false, message: "Backup not found" });
    res.json({ success: true, data: backup });
  };
}

export default new DeveloperController();
