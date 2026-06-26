import jwt from "jsonwebtoken";
import db from "../config/db.js";

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "dev-secret-change-in-production";

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const { rows } = await db.query(
      `SELECT id, email, role_scope FROM users WHERE id = $1 LIMIT 1`,
      [decoded.sub]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid or expired session" });
    }

    req.user = { sub: rows[0].id, email: rows[0].email, role_scope: rows[0].role_scope };
    return next();
  } catch (err) {
    console.error("[authMiddleware] Token verification failed:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or expired session" });
  }
}
