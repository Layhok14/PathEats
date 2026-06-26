import bcrypt from "bcryptjs";
import * as adminRepository from "../repositories/adminRepository.js";
import AppError from "../utils/AppError.js";

export const checkDatabaseConnection = async () => {
  return adminRepository.checkDatabaseConnection();
};

export const getDashboardTelemetry = async () => {
  return adminRepository.getDashboardTelemetry();
};

export const getUsers = async (page, limit) => {
  const [users, total] = await Promise.all([
    adminRepository.findAllUsers(page, limit),
    adminRepository.countUsers(),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUserManagementOverview = async (search = "") => {
  return adminRepository.getUserManagementOverview(search);
};

export const getVendorManagementOverview = async (search = "") => {
  return adminRepository.getVendorManagementOverview(search);
};

export const createUser = async (userData, adminId = null) => {
  const temporaryPassword = userData.password || "ChangeMe123!";
  const password_hash = await bcrypt.hash(temporaryPassword, 12);

  const [firstName = "", ...rest] = String(userData.name ?? "").trim().split(" ");
  const lastName = rest.join(" ");

  const user = await adminRepository.createUser({
    email: userData.email,
    password_hash,
    first_name: userData.first_name ?? userData.firstName ?? firstName,
    last_name: userData.last_name ?? userData.lastName ?? (lastName || "User"),
    phone: userData.phone,
    role_scope: userData.role_scope ?? userData.role ?? "CONSUMER",
  });

  if (adminId) {
    await adminRepository.logAuditAction(adminId, "create_user", "users", user?.id, {
      email: userData.email,
      role: userData.role,
    });
  }

  return user;
};

export const updateRole = async (id, role, adminId = null) => {
  const result = await adminRepository.updateRole(id, role);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "update_role", "users", id, { role });
  }
  return result;
};

export const updateStatus = async (id, status, adminId = null) => {
  const result = await adminRepository.updateStatus(id, status);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "update_status", "users", id, { status });
  }
  return result;
};

export const getVendors = async () => {
  return adminRepository.findAllVendors();
};

export const getPlaceCategories = async () => {
  return adminRepository.findPlaceCategories();
};

export const approveVendor = async (id, approved) => {
  return adminRepository.approveVendor(id, approved);
};

export const getStallManagementOptions = async () => {
  return adminRepository.getStallManagementOptions();
};

export const createStall = async (payload) => {
  return adminRepository.createStall(payload);
};

export const deleteStall = async (id) => {
  return adminRepository.deleteStall(id);
};

export const createStallMenuItem = async (placeId, payload) => {
  return adminRepository.createStallMenuItem(placeId, payload);
};

export const deleteStallMenuItem = async (id) => {
  return adminRepository.deleteStallMenuItem(id);
};

export const createStallCategory = async (payload) => {
  return adminRepository.createStallCategory(payload);
};

export const deleteStallCategory = async (id) => {
  return adminRepository.deleteStallCategory(id);
};

export const createStallPlaceHour = async (placeId, payload) => {
  return adminRepository.createStallPlaceHour(placeId, payload);
};

export const deleteStallPlaceHour = async (id) => {
  return adminRepository.deleteStallPlaceHour(id);
};

export const createStallReview = async (placeId, payload) => {
  return adminRepository.createStallReview(placeId, payload);
};

export const deleteStallReview = async (id) => {
  return adminRepository.deleteStallReview(id);
};

export const createRole = async (roleData, adminId = null) => {
  const role = await adminRepository.createRole(roleData);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "create_role", "role", role?.id, {
      name: roleData.name,
      tablePrivileges: roleData.tablePrivileges,
    });
  }
  return role;
};

export const getRoles = async () => {
  return adminRepository.findAllRoles();
};

export const updateRoleRecord = async (id, roleData, adminId = null) => {
  const role = await adminRepository.updateRoleRecord(id, roleData);
  if (adminId && role) {
    await adminRepository.logAuditAction(adminId, "update_role", "role", id, {
      name: roleData.name,
    });
  }
  return role;
};

export const deleteRoleRecord = async (id, adminId = null) => {
  const role = await adminRepository.deleteRoleRecord(id);
  if (adminId && role) {
    await adminRepository.logAuditAction(adminId, "delete_role", "role", id);
  }
  return role;
};

export const getAllStalls = async () => {
  return adminRepository.findAllStalls();
};

export const getStallsByOwner = async (ownerId) => {
  return adminRepository.findStallsByOwner(ownerId);
};

export const getStallById = async (id) => {
  return adminRepository.findStallById(id);
};

export const editStall = async (id, payload) => {
  return adminRepository.updateStall(id, payload);
};

export const toggleStallStatus = async (id) => {
  const stall = await adminRepository.findStallById(id);
  if (!stall) return null;
  return adminRepository.updateStallStatus(id, !stall.isOpen);
};

export const getAuditActivity = async () => {
  return adminRepository.getAuditActivity();
};

export const getAllReviews = async () => {
  return adminRepository.getAllReviews();
};

export const getReviewsByPlaceId = async (placeId) => {
  return adminRepository.getReviewsByPlaceId(placeId);
};

export const getAllMenuItems = async () => {
  return adminRepository.findAllMenuItems();
};

export const editMenuItem = async (id, payload) => {
  return adminRepository.updateMenuItem(id, payload);
};

// ── New: Audit Logs ────────────────────────────────────────────────────

export const getAuditLogs = async (limit) => {
  return adminRepository.getAuditLogs(limit);
};

// ── New: User CRUD ─────────────────────────────────────────────────────

export const getUserById = async (id) => {
  return adminRepository.getUserById(id);
};

export const updateUser = async (id, userData, adminId = null) => {
  const user = await adminRepository.updateUser(id, userData);
  if (adminId && user) {
    await adminRepository.logAuditAction(adminId, "update_user", "users", id, userData);
  }
  return user;
};

export const deleteUser = async (id, adminId = null) => {
  const user = await adminRepository.deleteUserRecord(id);
  if (adminId && user) {
    await adminRepository.logAuditAction(adminId, "delete_user", "users", id, {
      email: user.email,
    });
  }
  return user;
};

// ── New: Database Tables ───────────────────────────────────────────────

export const getDatabaseTables = async () => {
  return adminRepository.getDatabaseTables();
};

// ── Onboarding Config ─────────────────────────────────────────────────

export const getOnboardingConfig = async () => {
  return adminRepository.getOnboardingConfig();
};

export const updateOnboardingConfig = async (data) => {
  const telegramLink = data?.telegramLink;

  if (telegramLink) {
    let parsed;
    try {
      parsed = new URL(telegramLink);
    } catch {
      throw new AppError("Telegram link must be a valid https://t.me/ URL", 400);
    }

    if (parsed.protocol !== "https:" || parsed.hostname !== "t.me" || parsed.pathname === "/") {
      throw new AppError("Telegram link must be a valid https://t.me/ URL", 400);
    }
  }

  return adminRepository.updateOnboardingConfig(data);
};

// ── Review Moderation ─────────────────────────────────────────────────

export const flagReview = async (id) => {
  const review = await adminRepository.flagReview(id);
  if (review) {
    await adminRepository.refreshPlaceRating(review.place_id);
  }
  return review;
};

export const unflagReview = async (id) => {
  const review = await adminRepository.unflagReview(id);
  if (review) {
    await adminRepository.refreshPlaceRating(review.place_id);
  }
  return review;
};

export const removeReview = async (id) => {
  const review = await adminRepository.removeReview(id);
  if (review) {
    await adminRepository.refreshPlaceRating(review.place_id);
  }
  return review;
};
