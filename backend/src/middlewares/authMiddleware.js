import jwt from "jsonwebtoken";
import db from "../config/db.js";
import AppError from "../utils/AppError.js";
import { normalizeRoleScope } from "../utils/roles.js";

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "dev-secret-change-in-production";

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
      `SELECT id, email, role_scope, is_banned FROM users WHERE id = $1 LIMIT 1`,
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
      role: roleScope,
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
