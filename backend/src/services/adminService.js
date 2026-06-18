import * as adminRepository from "../repositories/adminRepository.js";
import bcrypt from "bcryptjs";

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

export const createRole = async (roleData) => {
  return adminRepository.createRole(roleData);
};

export const getRoles = async () => {
  return adminRepository.findAllRoles();
};
