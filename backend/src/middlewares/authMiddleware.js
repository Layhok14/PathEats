import jwt from "jsonwebtoken";
import db from "../config/db.js";

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "dev-secret-change-in-production";

const MOCK_ROLES = [
  { email: "vendor@patheat.app", role: "VENDOR", first: "Test", last: "Vendor" },
  { email: "consumer@patheat.app", role: "CONSUMER", first: "Test", last: "Consumer" },
  { email: "admin@patheat.app", role: "GLOBAL_ADMIN", first: "Test", last: "Admin" },
  { email: "dev@patheat.app", role: "DEVELOPER_ADMIN", first: "Test", last: "Dev" },
];

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { sub: decoded.sub, email: decoded.email, role_scope: decoded.role_scope };
      return next();
    }
  } catch {
    // Token invalid — fall through to mock fallback for local testing
  }

  try {
    let { rows } = await db.query(`SELECT id, email, role_scope FROM users LIMIT 1`);
    if (rows.length === 0) {
      for (const u of MOCK_ROLES) {
        const r = await db.query(
          `INSERT INTO users (email, password_hash, first_name, last_name, role_scope)
           VALUES ($1, 'bypass', $2, $3, $4)
           RETURNING id, email, role_scope`,
          [u.email, u.first, u.last, u.role]
        );
        rows = r.rows;
      }
    }
    req.user = { sub: rows[0].id, email: rows[0].email, role_scope: rows[0].role_scope };
  } catch {
    req.user = { sub: "mock-user-id", email: "vendor@patheat.app", role_scope: "VENDOR" };
  }
  next();
}
