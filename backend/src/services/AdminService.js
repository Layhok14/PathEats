import bcrypt from "bcryptjs";
import * as adminRepository from "../repositories/adminRepository.js";
import AppError from "../utils/AppError.js";

export const checkDatabaseConnection = async () => {
  return adminRepository.checkDatabaseConnection();
};

export const getDashboardTelemetry = async () => {
  return adminRepository.getDashboardTelemetry();
};

export const getUsers = async (page, limit, roleScope = null) => {
  const [users, total] = await Promise.all([
    adminRepository.findAllUsers(page, limit, roleScope),
    adminRepository.countUsersByRole(roleScope),
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

export const getUserManagementOverview = async (search = "", roleScope = null) => {
  return adminRepository.getUserManagementOverview(search, roleScope);
};

export const getVendorManagementOverview = async (search = "") => {
  return adminRepository.getVendorManagementOverview(search);
};

export const createUser = async (userData, adminId = null, roleScope = null) => {
  const temporaryPassword = userData.password || "ChangeMe123!";
  const password_hash = await bcrypt.hash(temporaryPassword, 12);

  const [firstName = "", ...rest] = String(userData.name ?? "").trim().split(" ");
  const lastName = rest.join(" ");

  const user = await adminRepository.createUser({
    email: userData.email,
    password_hash,
    first_name: userData.first_name ?? userData.firstName ?? firstName,
    last_name: userData.last_name ?? userData.lastName ?? lastName,
    phone: userData.phone,
    role_scope: userData.role_scope ?? userData.role ?? "CONSUMER",
  });

  if (adminId) {
    await adminRepository.logAuditAction(adminId, "create_user", "users", user?.id, {
      email: userData.email,
      role: userData.role,
    }, roleScope);
  }

  return user;
};

export const updateRole = async (id, role, adminId = null, roleScope = null) => {
  const result = await adminRepository.updateRole(id, role);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "update_role", "users", id, { role }, roleScope);
  }
  return result;
};

export const updateStatus = async (id, status, adminId = null, roleScope = null) => {
  const result = await adminRepository.updateStatus(id, status);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "update_status", "users", id, { status }, roleScope);
  }
  return result;
};

export const getVendors = async (page = 1, limit = 50) => {
  return adminRepository.findAllVendors(page, limit);
};

export const getPlaceCategories = async () => {
  return adminRepository.findPlaceCategories();
};

export const approveVendor = async (id, approved, adminId = null, roleScope = null) => {
  const result = await adminRepository.approveVendor(id, approved);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "approve_vendor", "users", id, { approved }, roleScope);
  }
  return result;
};

export const getStallManagementOptions = async () => {
  return adminRepository.getStallManagementOptions();
};

export const createStall = async (payload, adminId = null, roleScope = null) => {
  const name = String(payload.name ?? "").trim();
  if (!name) throw new AppError("Stall name is required", 400);
  if (!payload.ownerId) throw new AppError("Vendor owner is required", 400);
  if (!payload.categoryId) throw new AppError("Stall category is required", 400);

  const stall = await adminRepository.createStall({ ...payload, name });
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "create_stall", "stalls", stall?.id, { name, ownerId: payload.ownerId }, roleScope);
  }
  return stall;
};

export const deleteStall = async (id, adminId = null, roleScope = null) => {
  const result = await adminRepository.deleteStall(id);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "delete_stall", "stalls", id, null, roleScope);
  }
  return result;
};

export const createStallMenuItem = async (placeId, payload, adminId = null, roleScope = null) => {
  const stall = await adminRepository.findStallById(placeId);
  if (!stall) throw new AppError("Stall not found", 404);

  const name = String(payload.name ?? "").trim();
  if (!name) throw new AppError("Menu item name is required", 400);

  const price = Number(payload.price);
  if (!Number.isFinite(price) || price < 0) {
    throw new AppError("Menu item price must be a valid number", 400);
  }

  const item = await adminRepository.createStallMenuItem(placeId, { ...payload, name, price });
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "create_menu_item", "menu_items", item?.id, { name, placeId }, roleScope);
  }
  return item;
};

export const deleteStallMenuItem = async (id, placeId = null, adminId = null, roleScope = null) => {
  const result = await adminRepository.deleteStallMenuItem(id, placeId);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "delete_menu_item", "menu_items", id, null, roleScope);
  }
  return result;
};

export const createStallCategory = async (payload, adminId = null, roleScope = null) => {
  const result = await adminRepository.createStallCategory(payload);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "create_category", "place_categories", result?.id, payload, roleScope);
  }
  return result;
};

export const deleteStallCategory = async (id, adminId = null, roleScope = null) => {
  const result = await adminRepository.deleteStallCategory(id);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "delete_category", "place_categories", id, null, roleScope);
  }
  return result;
};

export const createStallPlaceHour = async (placeId, payload, adminId = null, roleScope = null) => {
  const result = await adminRepository.createStallPlaceHour(placeId, payload);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "create_place_hour", "place_hours", result?.id, { placeId, ...payload }, roleScope);
  }
  return result;
};

export const deleteStallPlaceHour = async (id, adminId = null, roleScope = null) => {
  const result = await adminRepository.deleteStallPlaceHour(id);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "delete_place_hour", "place_hours", id, null, roleScope);
  }
  return result;
};

export const createStallReview = async (placeId, payload, adminId = null, roleScope = null) => {
  const result = await adminRepository.createStallReview(placeId, payload);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "create_review", "reviews", result?.id, { placeId }, roleScope);
  }
  return result;
};

export const deleteStallReview = async (id, adminId = null, roleScope = null) => {
  const result = await adminRepository.deleteStallReview(id);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "delete_review", "reviews", id, null, roleScope);
  }
  return result;
};

export const createRole = async (roleData, adminId = null, roleScope = null) => {
  const role = await adminRepository.createRole(roleData);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "create_role", "role", role?.id, {
      name: roleData.name,
      tablePrivileges: roleData.tablePrivileges,
    }, roleScope);
  }
  return role;
};

export const getRoles = async () => {
  return adminRepository.findAllRoles();
};

export const updateRoleRecord = async (id, roleData, adminId = null, roleScope = null) => {
  const role = await adminRepository.updateRoleRecord(id, roleData);
  if (adminId && role) {
    await adminRepository.logAuditAction(adminId, "update_role", "role", id, {
      name: roleData.name,
    }, roleScope);
  }
  return role;
};

export const deleteRoleRecord = async (id, adminId = null, roleScope = null) => {
  const existingRole = await adminRepository.getRoleRecordById(id);
  if (!existingRole) return null;

  const userCount = await adminRepository.countUsersByRoleScope(existingRole.name);
  if (userCount > 0) {
    throw new AppError(
      `Cannot delete role "${existingRole.name}": ${userCount} user${userCount === 1 ? "" : "s"} assigned to it. Reassign them first.`,
      409
    );
  }

  const deleted = await adminRepository.deleteRoleRecord(id);
  if (adminId && deleted) {
    await adminRepository.logAuditAction(adminId, "delete_role", "role", id, null, roleScope);
  }
  return deleted;
};

export const getAllStalls = async (page = 1, limit = 50) => {
  return adminRepository.findAllStalls(page, limit);
};

export const getStallsByOwner = async (ownerId, limit = 1000) => {
  return adminRepository.findStallsByOwner(ownerId, limit);
};

export const getStallById = async (id) => {
  return adminRepository.findStallById(id);
};

export const editStall = async (id, payload, adminId = null, roleScope = null) => {
  if (payload.ownerId !== undefined && !payload.ownerId) {
    throw new AppError("Vendor owner is required", 400);
  }

  const result = await adminRepository.updateStall(id, payload);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "update_stall", "stalls", id, payload, roleScope);
  }
  return result;
};

export const toggleStallStatus = async (id, adminId = null, roleScope = null) => {
  const stall = await adminRepository.findStallById(id);
  if (!stall) return null;
  const result = await adminRepository.updateStallStatus(id, !stall.isOpen);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "toggle_stall_status", "stalls", id, { isOpen: !stall.isOpen }, roleScope);
  }
  return result;
};

export const getAuditActivity = async () => {
  return adminRepository.getAuditActivity();
};

export const getAllReviews = async (limit = 2000, offset = 0) => {
  return adminRepository.getAllReviews(limit, offset);
};

export const getReviewsByPlaceId = async (placeId) => {
  return adminRepository.getReviewsByPlaceId(placeId);
};

export const getAllMenuItems = async (placeId = null, ownerId = null) => {
  return adminRepository.findAllMenuItems(placeId, ownerId);
};

export const editMenuItem = async (id, payload, adminId = null, roleScope = null) => {
  const result = await adminRepository.updateMenuItem(id, payload);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "update_menu_item", "menu_items", id, payload, roleScope);
  }
  return result;
};

// ── New: Audit Logs ────────────────────────────────────────────────────

export const getAuditLogs = async (limit) => {
  return adminRepository.getAuditLogs(limit);
};

export const getAuditLogsByRoleScope = async (roleScope, limit = 100) => {
  return adminRepository.getAuditLogsByRoleScope(roleScope, limit);
};

// ── New: User CRUD ─────────────────────────────────────────────────────

export const getUserById = async (id) => {
  return adminRepository.getUserById(id);
};

export const updateUser = async (id, userData, adminId = null, roleScope = null) => {
  const user = await adminRepository.updateUser(id, userData);
  if (adminId && user) {
    await adminRepository.logAuditAction(adminId, "update_user", "users", id, userData, roleScope);
  }
  return user;
};

export const deleteUser = async (id, adminId = null, roleScope = null) => {
  const user = await adminRepository.deleteUserRecord(id);
  if (adminId && user) {
    await adminRepository.logAuditAction(adminId, "delete_user", "users", id, {
      email: user.email,
    }, roleScope);
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

export const updateOnboardingConfig = async (data, adminId = null, roleScope = null) => {
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

  const result = await adminRepository.updateOnboardingConfig(data);
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "update_onboarding", "onboarding_config", null, { telegramLink: data?.telegramLink }, roleScope);
  }
  return result;
};

// ── Review Moderation ─────────────────────────────────────────────────

export const flagReview = async (id, adminId = null, roleScope = null) => {
  const review = await adminRepository.flagReview(id);
  if (review) {
    await adminRepository.refreshPlaceRating(review.place_id);
    if (adminId) {
      await adminRepository.logAuditAction(adminId, "flag_review", "reviews", id, { placeId: review.place_id }, roleScope);
    }
  }
  return review;
};

export const unflagReview = async (id, adminId = null, roleScope = null) => {
  const review = await adminRepository.unflagReview(id);
  if (review) {
    await adminRepository.refreshPlaceRating(review.place_id);
    if (adminId) {
      await adminRepository.logAuditAction(adminId, "unflag_review", "reviews", id, { placeId: review.place_id }, roleScope);
    }
  }
  return review;
};

export const removeReview = async (id, adminId = null, roleScope = null) => {
  const review = await adminRepository.removeReview(id);
  if (review) {
    await adminRepository.refreshPlaceRating(review.place_id);
    if (adminId) {
      await adminRepository.logAuditAction(adminId, "remove_review", "reviews", id, { placeId: review.place_id }, roleScope);
    }
  }
  return review;
};

// ── Deletion Impact ─────────────────────────────────────────────

export const getDeletionImpact = async (id) => {
  return adminRepository.getDeletionImpact(id);
};

export const getMenuItemLinkCount = async (id) => {
  return adminRepository.getMenuItemLinkCount(id);
};

// ── BA Assignments ─────────────────────────────────────────────

export const assignVendorToAssistant = async (assistantId, vendorId, assignedBy = null) => {
  const assignment = await adminRepository.assignVendorToAssistant(assistantId, vendorId, assignedBy);
  if (assignment && assignedBy) {
    await adminRepository.logAuditAction(assignedBy, "assign_vendor", "business_assistant_assignments", assignment.id, {
      assistantId, vendorId
    });
  }
  return assignment;
};

export const unassignVendorFromAssistant = async (assistantId, vendorId) => {
  return adminRepository.unassignVendorFromAssistant(assistantId, vendorId);
};

export const getAssistantAssignments = async (assistantId) => {
  return adminRepository.getAssistantAssignments(assistantId);
};

// ── Consumer Categories ─────────────────────────────────────────

export const getConsumerCategories = async () => {
  return adminRepository.getConsumerCategories();
};
