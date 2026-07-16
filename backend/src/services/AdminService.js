import bcrypt from "bcryptjs";
import * as adminRepository from "../repositories/adminRepository.js";
import AppError from "../utils/AppError.js";
import { validateCoordinates } from "../utils/validation.js";
import {
  BUILT_IN_ROLE_POLICIES,
  BUILT_IN_SYSTEM_CAPABILITIES,
  normalizeRoleName,
  normalizeSystemCapabilities,
  normalizeTablePrivileges,
  privilegesAreSubset,
  rolePolicyCatalog,
} from "../utils/privilegeRegistry.js";

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

const assertCanAssignRole = (actor, assignedRole, accountScope) => {
  if (!actor || (actor.isSystemRole && actor.roleName === "GLOBAL_ADMIN")) return;
  if (actor.baseScope === "BUSINESS_ASSISTANCE" && accountScope === "VENDOR") return;
  if (!actor.grantOption || assignedRole.isSystem || accountScope !== actor.baseScope) {
    throw new AppError("You cannot assign the selected role", 403, {
      code: "ROLE_ASSIGNMENT_FORBIDDEN",
      safeMessage: "You do not have permission to assign this role.",
    });
  }
  if (!privilegesAreSubset(assignedRole.tablePrivileges, actor.tablePrivileges ?? {})) {
    throw new AppError("You cannot assign privileges you do not possess", 403);
  }
};

export const createUser = async (userData, adminId = null, roleScope = null, actor = null) => {
  const name = String(userData.name ?? "").trim();
  const email = String(userData.email ?? "").trim().toLowerCase();
  const fieldErrors = {};
  if (!name) fieldErrors.name = "Name is required.";
  if (!email) fieldErrors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (!userData.roleId) fieldErrors.role = "Select a role.";
  if (Object.keys(fieldErrors).length > 0) {
    throw new AppError("User details are invalid", 400, {
      code: "USER_VALIDATION_FAILED",
      fieldErrors,
    });
  }

  const temporaryPassword = userData.password || "ChangeMe123!";
  if (temporaryPassword.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400, {
      code: "WEAK_PASSWORD",
      safeMessage: "Password must be at least 8 characters.",
      fieldErrors: { password: "Password must be at least 8 characters." },
    });
  }
  const password_hash = await bcrypt.hash(temporaryPassword, 12);

  const [firstName = "", ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  const assignedRole = userData.roleId
    ? await adminRepository.getRoleRecordById(userData.roleId)
    : await adminRepository.getRoleRecordByName(userData.role_scope ?? userData.role ?? "CONSUMER");
  if (!assignedRole) throw new AppError("Selected role does not exist", 400);
  const accountScope = assignedRole.baseScope;
  if (!accountScope) throw new AppError("Selected role has no application scope", 409);
  assertCanAssignRole(actor, assignedRole, accountScope);

  const user = await adminRepository.createUser({
    email,
    password_hash,
    first_name: userData.first_name ?? userData.firstName ?? firstName,
    last_name: userData.last_name ?? userData.lastName ?? lastName,
    phone: userData.phone,
    role_scope: accountScope,
    role_id: assignedRole.id,
  });

  if (adminId) {
    await adminRepository.logAuditAction(adminId, "create_user", "users", user?.id, {
      email,
      role: userData.role,
    }, roleScope);
  }

  return user;
};

export const updateRole = async (id, roleId, adminId = null, roleScope = null, actor = null) => {
  const assignedRole = await adminRepository.getRoleRecordById(roleId);
  if (!assignedRole) throw new AppError("Selected role does not exist", 400);
  const currentUser = await adminRepository.getUserById(id);
  if (!currentUser) throw new AppError("User not found", 404);
  const accountScope = assignedRole.baseScope;
  if (!accountScope) throw new AppError("Selected role has no application scope", 409);
  assertCanAssignRole(actor, assignedRole, accountScope);
  const result = await adminRepository.updateUser(id, {
    roleId: assignedRole.id,
    roleScope: accountScope,
  });
  if (adminId) {
    await adminRepository.logAuditAction(adminId, "update_role", "users", id, { role: assignedRole.name }, roleScope);
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

  let item;
  try {
    item = await adminRepository.createStallMenuItem(placeId, { ...payload, name, price });
  } catch (error) {
    if (error?.code === "23505") {
      throw new AppError("This item already exists in the vendor catalog", 409, {
        code: "MENU_ITEM_DUPLICATE",
        safeMessage: "Use Add Existing to link the catalog item to this stall.",
      });
    }
    throw error;
  }
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

const isBuiltInGlobalAdmin = (actor) => actor?.isSystemRole && actor?.roleName === "GLOBAL_ADMIN";

const assertCanDelegateRole = (actor, role) => {
  if (!actor || isBuiltInGlobalAdmin(actor)) return;
  if (!actor.grantOption) {
    throw new AppError("Grant Option is required to manage role privileges", 403, {
      code: "ROLE_GRANT_OPTION_REQUIRED",
      safeMessage: "Your role cannot delegate privileges.",
    });
  }
  if (role.isSystem) throw new AppError("Only the built-in Global Admin can modify system roles", 403);
  if (!privilegesAreSubset(role.tablePrivileges, actor.tablePrivileges ?? {})) {
    throw new AppError("A role cannot delegate table privileges it does not possess", 403);
  }
  const actorCapabilities = new Set(actor.systemCapabilities ?? []);
  if ((role.systemCapabilities ?? []).some((capability) => !actorCapabilities.has(capability))) {
    throw new AppError("A role cannot delegate system capabilities it does not possess", 403);
  }
};

export const createRole = async (roleData, adminId = null, roleScope = null, actor = null) => {
  const name = normalizeRoleName(roleData.name);
  const tablePrivileges = normalizeTablePrivileges(roleData.tablePrivileges);
  const systemCapabilities = normalizeSystemCapabilities(roleData.systemCapabilities);
  assertCanDelegateRole(actor, {
    tablePrivileges,
    systemCapabilities,
    isSystem: false,
  });
  const role = await adminRepository.createRole({
    name,
    tablePrivileges,
    systemCapabilities,
    grantOption: Boolean(roleData.grantOption),
  });
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

export const updateRoleRecord = async (id, roleData, adminId = null, roleScope = null, actor = null) => {
  const existing = await adminRepository.getRoleRecordById(id);
  if (!existing) return null;
  const name = roleData.name === undefined ? undefined : normalizeRoleName(roleData.name);
  if (existing.isSystem && name !== undefined && name !== existing.name) {
    throw new AppError("Built-in roles cannot be renamed", 400);
  }
  const tablePrivileges = roleData.tablePrivileges === undefined
    ? undefined
    : normalizeTablePrivileges(roleData.tablePrivileges);
  const systemCapabilities = roleData.systemCapabilities === undefined
    ? undefined
    : normalizeSystemCapabilities(roleData.systemCapabilities);
  if (existing.isSystem && tablePrivileges && !privilegesAreSubset(tablePrivileges, BUILT_IN_ROLE_POLICIES[existing.baseScope] ?? {})) {
    throw new AppError("Role privileges cannot exceed its base role", 400);
  }
  const allowedCapabilities = new Set(BUILT_IN_SYSTEM_CAPABILITIES[existing.baseScope] ?? []);
  if (existing.isSystem && systemCapabilities?.some((capability) => !allowedCapabilities.has(capability))) {
    throw new AppError("System capabilities cannot exceed the base role", 400);
  }
  assertCanDelegateRole(actor, {
    ...existing,
    tablePrivileges: tablePrivileges ?? existing.tablePrivileges,
    systemCapabilities: systemCapabilities ?? existing.systemCapabilities,
  });
  if (existing.name === "GLOBAL_ADMIN") {
    const proposed = tablePrivileges ?? existing.tablePrivileges;
    const minimum = {
      role: ["SELECT", "INSERT", "UPDATE", "DELETE"],
      users: ["SELECT", "INSERT", "UPDATE"],
    };
    if (!privilegesAreSubset(minimum, proposed)) {
      throw new AppError("Global Admin must retain role and user management privileges", 409);
    }
  }
  const role = await adminRepository.updateRoleRecord(id, {
    name,
    tablePrivileges,
    systemCapabilities,
    grantOption: roleData.grantOption,
  });
  if (adminId && role) {
    await adminRepository.logAuditAction(adminId, "update_role", "role", id, {
      name: roleData.name,
    }, roleScope);
  }
  return role;
};

export const deleteRoleRecord = async (id, adminId = null, roleScope = null, actor = null) => {
  const existingRole = await adminRepository.getRoleRecordById(id);
  if (!existingRole) return null;

  if (existingRole.isSystem) throw new AppError("Built-in roles cannot be deleted", 409);
  assertCanDelegateRole(actor, existingRole);
  const userCount = await adminRepository.countUsersByRoleId(existingRole.id);
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
  if (payload.latitude !== undefined || payload.longitude !== undefined) {
    if (payload.latitude === undefined || payload.longitude === undefined) {
      throw new AppError("Latitude and longitude must be updated together", 400);
    }
    validateCoordinates(payload.latitude, payload.longitude);
  }
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
  let result;
  try {
    result = await adminRepository.updateMenuItem(id, payload);
  } catch (error) {
    if (error?.code === "23505") {
      throw new AppError("This item already exists in the vendor catalog", 409, {
        code: "MENU_ITEM_DUPLICATE",
        safeMessage: "Use Add Existing to link the catalog item to this stall.",
      });
    }
    throw error;
  }
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

export const updateUser = async (id, userData, adminId = null, roleScope = null, actor = null) => {
  const fieldErrors = {};
  if (userData.firstName !== undefined && !String(userData.firstName).trim()) fieldErrors.name = "Name is required.";
  if (userData.email !== undefined) {
    const email = String(userData.email).trim();
    if (!email) fieldErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Enter a valid email address.";
  }
  if (userData.roleId !== undefined && !userData.roleId) fieldErrors.role = "Select a role.";
  if (Object.keys(fieldErrors).length > 0) {
    throw new AppError("User details are invalid", 400, {
      code: "USER_VALIDATION_FAILED",
      fieldErrors,
    });
  }

  let roleAssignment = {};
  if (userData.roleId !== undefined) {
    const currentUser = await adminRepository.getUserById(id);
    if (!currentUser) throw new AppError("User not found", 404);
    const assignedRole = userData.roleId !== undefined
      ? await adminRepository.getRoleRecordById(userData.roleId)
      : await adminRepository.getRoleRecordById(currentUser.roleId);
    if (!assignedRole) throw new AppError("Selected role does not exist", 400);
    const accountScope = assignedRole.baseScope;
    if (!accountScope) throw new AppError("Selected role has no application scope", 409);
    assertCanAssignRole(actor, assignedRole, accountScope);
    roleAssignment = { roleId: assignedRole.id, roleScope: accountScope };
  }
  const normalizedUserData = {
    ...userData,
    ...(userData.firstName !== undefined ? { firstName: String(userData.firstName).trim() } : {}),
    ...(userData.lastName !== undefined ? { lastName: String(userData.lastName).trim() } : {}),
    ...(userData.email !== undefined ? { email: String(userData.email).trim().toLowerCase() } : {}),
  };
  delete normalizedUserData.roleScope;
  const user = await adminRepository.updateUser(id, { ...normalizedUserData, ...roleAssignment });
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
  return rolePolicyCatalog();
};

export const linkExistingStallMenuItem = async (placeId, menuItemId, payload, adminId = null, roleScope = null) => {
  const item = await adminRepository.linkExistingStallMenuItem(placeId, menuItemId, payload);
  if (!item) throw new AppError("Stall or catalog item not found", 404);
  if (adminId) {
    await adminRepository.logAuditAction(
      adminId,
      "link_menu_item",
      "place_menu_items",
      menuItemId,
      { placeId },
      roleScope
    );
  }
  return item;
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

// ── Consumer Categories ─────────────────────────────────────────

export const getConsumerCategories = async () => {
  return adminRepository.getConsumerCategories();
};

export const getUserRoleScope = async (userId) => {
  return adminRepository.getUserRoleScope(userId);
};

export const getSystemHealth = async () => {
  return adminRepository.getSystemHealth();
};

export const cancelDatabaseQuery = async (pid) => {
  if (!Number.isSafeInteger(pid) || pid <= 0) {
    throw new AppError("Valid PID (positive integer) is required", 400);
  }
  const cancelled = await adminRepository.cancelDatabaseQuery(pid);
  if (!cancelled) throw new AppError(`Database process ${pid} was not active`, 404);
  return { message: `Cancel signal sent to PID ${pid}` };
};

export const getAdminProfile = async (userId) => {
  const row = await adminRepository.getAdminProfile(userId);
  if (!row) throw new AppError("User not found", 404);
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone_number,
    roleScope: row.role_scope,
    isBanned: row.is_banned,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};
