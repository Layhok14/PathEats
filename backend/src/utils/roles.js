export const ROLES = Object.freeze({
  CONSUMER: "CONSUMER",
  VENDOR: "VENDOR",
  GLOBAL_ADMIN: "GLOBAL_ADMIN",
  DEVELOPER_ADMIN: "DEVELOPER_ADMIN",
  BUSINESS_ASSISTANCE: "BUSINESS_ASSISTANCE",
});

export const PUBLIC_REGISTRATION_ROLES = new Set([
  ROLES.CONSUMER,
  ROLES.VENDOR,
]);

export const normalizeRoleScope = (roleScope, fallback = ROLES.CONSUMER) => {
  const normalized = String(roleScope || fallback).trim().toUpperCase();
  return normalized || fallback;
};

export const isPublicRegistrationRole = (roleScope) =>
  PUBLIC_REGISTRATION_ROLES.has(normalizeRoleScope(roleScope));
