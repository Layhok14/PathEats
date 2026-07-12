import AppError from "../utils/AppError.js";
import { normalizeRoleScope } from "../utils/roles.js";

export const restrictToRoles = (...permittedRoles) => {
  const normalizedPermittedRoles = permittedRoles.map((role) => normalizeRoleScope(role));

  return (req, res, next) => {
    const activeRole = req.user?.role_scope ? normalizeRoleScope(req.user.role_scope) : null;

    if (!activeRole) {
      return next(new AppError("Authenticated user is missing an active role", 401, {
        code: "ROLE_REQUIRED",
        safeMessage: "Please sign in to continue.",
        severity: "warning",
      }));
    }

    if (!normalizedPermittedRoles.includes(activeRole)) {
      return next(new AppError("Role is not permitted for this route", 403, {
        code: "ROLE_FORBIDDEN",
        safeMessage: "You do not have permission to do that.",
        severity: "warning",
        details: {
          permittedRoles: normalizedPermittedRoles,
          activeRole,
        },
      }));
    }

    next();
  };
};
