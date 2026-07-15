import jwt from "jsonwebtoken";
import db from "../config/db.js";
import AppError from "../utils/AppError.js";
import { normalizeRoleScope } from "../utils/roles.js";

const JWT_SECRET = process.env.JWT_ACCESS_SECRET;

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Missing bearer access token", 401, {
        code: "AUTH_REQUIRED",
        safeMessage: "Please sign in to continue.",
        severity: "info",
      }));
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const { rows } = await db.query(
      `SELECT u.id, u.email, u.role_scope, u.role_id::text, u.is_banned,
              r.name AS role_name, r.base_scope, r.table_privileges,
              r.system_capabilities, r.grant_option, r.is_system
       FROM users u
       JOIN "role" r ON r.id = u.role_id
       WHERE u.id = $1
       LIMIT 1`,
      [decoded.sub]
    );

    if (rows.length === 0) {
      return next(new AppError("Access token user no longer exists", 401, {
        code: "SESSION_INVALID",
        safeMessage: "Your session expired. Please sign in again.",
        severity: "warning",
      }));
    }

    if (rows[0].is_banned) {
      return next(new AppError("Account has been suspended", 403, {
        code: "ACCOUNT_SUSPENDED",
        safeMessage: "This account has been suspended.",
        severity: "warning",
      }));
    }

    const roleScope = normalizeRoleScope(rows[0].role_scope);
    req.user = {
      sub: rows[0].id,
      email: rows[0].email,
      role_scope: roleScope,
      baseScope: roleScope,
      roleId: rows[0].role_id,
      roleName: rows[0].role_name,
      tablePrivileges: rows[0].table_privileges ?? {},
      systemCapabilities: rows[0].system_capabilities ?? [],
      grantOption: Boolean(rows[0].grant_option),
      isSystemRole: Boolean(rows[0].is_system),
    };
    return next();
  } catch (err) {
    return next(new AppError("Access token verification failed", 401, {
      code: "SESSION_EXPIRED",
      safeMessage: "Your session expired. Please sign in again.",
      severity: "warning",
      details: { reason: err.message },
    }));
  }
}
