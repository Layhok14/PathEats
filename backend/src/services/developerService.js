import bcrypt from "bcryptjs";
import developerRepository from "../repositories/developerRepository.js";

const splitName = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  return {
    first_name: parts[0] || "",
    last_name: parts.slice(1).join(" "),
  };
};

export class DeveloperService {
  constructor(repository = developerRepository) {
    this.repository = repository;
  }

  listUsers() {
    return this.repository.listUsers();
  }

  async createUser(payload) {
    const names = splitName(payload.name);
    const password = payload.password || "Password@123";
    return this.repository.createUser({
      email: payload.email,
      password_hash: await bcrypt.hash(password, 10),
      first_name: payload.first_name ?? names.first_name,
      last_name: payload.last_name ?? names.last_name,
      phone: payload.phone,
      role_scope: payload.role_scope ?? payload.role ?? "CONSUMER",
    });
  }

  updateUser(id, payload) {
    const names = payload.name ? splitName(payload.name) : {};
    return this.repository.updateUser(id, {
      email: payload.email,
      first_name: payload.first_name ?? names.first_name,
      last_name: payload.last_name ?? names.last_name,
      phone: payload.phone,
      role_scope: payload.role_scope ?? payload.role,
    });
  }

  setUserBan(id, banned) {
    return this.repository.setUserBan(id, Boolean(banned));
  }

  deleteUser(id) {
    return this.repository.deleteUser(id);
  }

  listVendors() {
    return this.repository.listVendors();
  }

  listPlaceCategories() {
    return this.repository.listPlaceCategories();
  }

  listTableColumns(tableName) {
    return this.repository.listTableColumns(tableName);
  }

  createVendor(payload) {
    return this.repository.createVendor({
      name: payload.name,
      location: payload.location,
      address: payload.address,
      category_id: payload.category_id,
      status: payload.status ?? "active",
      is_approved: payload.is_approved ?? true,
    });
  }

  updateVendor(id, payload) {
    return this.repository.updateVendor(id, {
      name: payload.name,
      location: payload.location,
      address: payload.address,
      category_id: payload.category_id,
      status: payload.status,
      is_approved: payload.is_approved,
    });
  }

  setVendorBan(id, banned) {
    return this.repository.setVendorBan(id, Boolean(banned));
  }

  deleteVendor(id) {
    return this.repository.deleteVendor(id);
  }

  listBackups() {
    return this.repository.listBackups();
  }

  createBackup(payload) {
    return this.repository.createBackup({
      scope: payload.scope,
      tableName: payload.tableName ?? payload.table_name,
      rowId: payload.rowId ?? payload.row_id,
    });
  }

  recoverBackup(id) {
    return this.repository.recoverBackup(id);
  }
}

export default new DeveloperService();
