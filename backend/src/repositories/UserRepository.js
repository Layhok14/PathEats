import db from "../config/db.js";
import BaseRepository from "./BaseRepository.js";

class UserRepository extends BaseRepository {
  constructor() {
    super("users");
  }

  /**
   * Find a user by email (case-insensitive).
   */
  async findByEmail(email) {
    const { rows } = await db.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
      [email]
    );
    return rows[0] || null;
  }

  /**
   * Create a new user.
   * @param {{ email, password_hash, first_name, last_name, phone_number, role_scope }} data
   */
  async create(data) {
    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role_scope)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, phone_number, role_scope, created_at`,
      [data.email, data.password_hash, data.first_name, data.last_name, data.phone_number || null, data.role_scope || "CONSUMER"]
    );
    return rows[0];
  }

  /**
   * Find user by ID.
   */
  async findById(id) {
    const { rows } = await db.query(
      `SELECT id, email, first_name, last_name, phone_number, role_scope, is_banned, created_at FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Update user's password hash.
   */
  async updatePassword(id, passwordHash) {
    const { rows } = await db.query(
      `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2 RETURNING id`,
      [passwordHash, id]
    );
    return rows[0];
  }

  /**
   * Find user with full details including password_hash (for auth).
   */
  async findByEmailWithPassword(email) {
    const { rows } = await db.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
      [email]
    );
    return rows[0] || null;
  }
}

export default UserRepository;
