import AppError from "../utils/AppError.js";
import { hasPrivilege } from "../utils/privilegeRegistry.js";

export const requirePrivileges = (...requirements) => (req, _res, next) => {
  const missing = requirements.find(({ table, action }) => !hasPrivilege(req.user, table, action));
  if (!missing) return next();

  return next(new AppError("Role does not have the required application privilege", 403, {
    code: "ROLE_PRIVILEGE_REQUIRED",
    safeMessage: "You do not have permission to do that.",
    severity: "warning",
    details: { table: missing.table, action: missing.action },
  }));
};

export const requireSystemCapability = (capability) => (req, _res, next) => {
  const capabilities = req.user?.systemCapabilities ?? [];
  if (capabilities.includes(capability)) return next();
  return next(new AppError("Role does not have the required system capability", 403, {
    code: "ROLE_PRIVILEGE_REQUIRED",
    safeMessage: "You do not have permission to do that.",
    severity: "warning",
    details: { capability },
  }));
};
