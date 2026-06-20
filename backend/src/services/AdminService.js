import UserRepository from "../repositories/UserRepository.js";
import VendorRepository from "../repositories/VendorRepository.js";
import db from "../config/db.js";
import AppError from "../utils/AppError.js";

class AdminService {
  constructor() {
    this.userRepo = new UserRepository();
    this.vendorRepo = new VendorRepository();
  }

  async listUsers({ page, limit, role_scope } = {}) {
    return this.userRepo.findAll({ page, limit, role_scope });
  }

  async getUserById(id) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  async updateUserRole(id, role_scope, requesterId) {
    if (id === requesterId) throw new AppError("Cannot change your own role", 400);
    const user = await this.userRepo.findById(id);
    if (!user) throw new AppError("User not found", 404);
    return this.userRepo.updateRole(id, role_scope);
  }

  async toggleBan(id, requesterId) {
    if (id === requesterId) throw new AppError("Cannot ban or unban yourself", 400);
    const user = await this.userRepo.findById(id);
    if (!user) throw new AppError("User not found", 404);
    return this.userRepo.setBanStatus(id, !user.is_banned);
  }

  async listVendors({ page, limit } = {}) {
    const offset = (page - 1) * limit;
    const { rows: places } = await db.query(
      `SELECT p.*, pc.name AS category_name, u.email AS owner_email, u.first_name AS owner_first_name, u.last_name AS owner_last_name
       FROM places p
       LEFT JOIN place_categories pc ON pc.id = p.category_id
       LEFT JOIN users u ON u.id = p.owner_id
       ORDER BY p.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const { rows: countResult } = await db.query(
      `SELECT COUNT(*)::int AS total FROM places`
    );
    return { places, total: countResult[0].total, page, limit };
  }

  async approveStall(stallId, status) {
    if (!["APPROVED", "REJECTED", "SUSPENDED"].includes(status)) {
      throw new AppError("Status must be APPROVED, REJECTED, or SUSPENDED", 400);
    }
    const stall = await this.vendorRepo.findById(stallId);
    if (!stall) throw new AppError("Stall not found", 404);
    return this.vendorRepo.updateStatus(stallId, status);
  }
}

export default AdminService;
