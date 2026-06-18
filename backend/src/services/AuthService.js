import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import AppError from "../utils/AppError.js";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.JWT_ACCESS_SECRET ||
  "dev-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || process.env.JWT_ACCESS_EXPIRY || "7d";

class AuthService {
  async register(data) {
    const { email, password, firstName, lastName, phone } = data;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await db.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
    if (existing.rows.length > 0) {
      throw new AppError("Email already registered", 409);
    }

    const password_hash = await bcrypt.hash(password, 12);
    const result = await db.query(
      `
      INSERT INTO users (email, password_hash, first_name, last_name, phone, role_scope, is_banned)
      VALUES ($1,$2,$3,$4,$5,'CONSUMER',false)
      RETURNING id::text, email, first_name, last_name, phone, role_scope, is_banned
      `,
      [normalizedEmail, password_hash, firstName, lastName, phone ?? null]
    );

    const user = result.rows[0];
    const token = this._signToken(user.id, user.email, user.role_scope);

    return { user, token };
  }

  async login(email, password) {
    const normalizedEmail = email.toLowerCase().trim();
    const result = await db.query(
      `
      SELECT id::text, email, password_hash, first_name, last_name, phone, role_scope, is_banned
      FROM users
      WHERE email = $1
      `,
      [normalizedEmail]
    );

    const user = result.rows[0];
    if (!user) throw new AppError("Invalid email or password", 401);

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new AppError("Invalid email or password", 401);

    if (user.is_banned) throw new AppError("Account has been suspended", 403);

    const token = this._signToken(user.id, user.email, user.role_scope);
    delete user.password_hash;

    return { user, token };
  }

  _signToken(userId, email, roleScope) {
    return jwt.sign(
      { sub: userId, email, role_scope: roleScope },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
}

export default AuthService;
