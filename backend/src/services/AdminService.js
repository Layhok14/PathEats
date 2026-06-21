import bcrypt from "bcryptjs";
import * as adminRepository from "../repositories/adminRepository.js";

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

export const createUser = async (userData) => {
  const temporaryPassword = userData.password || "ChangeMe123!";
  const password_hash = await bcrypt.hash(temporaryPassword, 12);

  const [firstName = "", ...rest] = String(userData.name ?? "").trim().split(" ");
  const lastName = rest.join(" ");

  return adminRepository.createUser({
    email: userData.email,
    password_hash,
    first_name: userData.first_name ?? userData.firstName ?? firstName,
    last_name: userData.last_name ?? userData.lastName ?? (lastName || "User"),
    phone: userData.phone,
    role_scope: userData.role_scope ?? userData.role ?? "CONSUMER",
  });
};

export const updateRole = async (id, role) => {
  return adminRepository.updateRole(id, role);
};

export const updateStatus = async (id, status) => {
  return adminRepository.updateStatus(id, status);
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

export const createRole = async (roleData) => {
  return adminRepository.createRole(roleData);
};

export const getRoles = async () => {
  return adminRepository.findAllRoles();
};

export const updateRoleRecord = async (id, roleData) => {
  return adminRepository.updateRoleRecord(id, roleData);
};

export const deleteRoleRecord = async (id) => {
  return adminRepository.deleteRoleRecord(id);
};
