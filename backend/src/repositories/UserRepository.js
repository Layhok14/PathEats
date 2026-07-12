import db from "../config/db.js";

class UserRepository {

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
      `INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role_scope, role_id)
       SELECT $1, $2, $3, $4, $5, r.base_scope, r.id
       FROM "role" r
       WHERE r.name = $6
       RETURNING id, email, first_name, last_name, phone_number, role_scope, role_id, created_at`,
      [data.email, data.password_hash, data.first_name, data.last_name, data.phone_number || null, data.role_scope || "CONSUMER"]
    );
    if (!rows[0]) throw new Error("Registration role is not configured");
    return this.findById(rows[0].id);
  }

  /**
   * Find user by ID.
   */
  async findById(id) {
    const { rows } = await db.query(
      `SELECT
         u.id,
         u.email,
         u.first_name,
         u.last_name,
         u.phone_number,
         u.role_scope,
         u.role_id,
         r.name AS role_name,
         r.base_scope,
         r.table_privileges,
         r.system_capabilities,
         r.grant_option,
         u.is_banned,
         u.created_at,
         upi.bucket_name AS profile_image_bucket,
         upi.object_path AS profile_image_path,
         upi.mime_type AS profile_image_mime_type,
         upi.size_bytes AS profile_image_size_bytes,
         upi.alt_text AS profile_image_alt_text
       FROM users u
       JOIN "role" r ON r.id = u.role_id
       LEFT JOIN user_profile_images upi ON upi.user_id = u.id
       WHERE u.id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  /**
   * List all users with pagination and optional role filter.
   */
  async findAll({ page = 1, limit = 20, role_scope } = {}) {
    const offset = (page - 1) * limit;
    let whereClause = "";
    const params = [];
    let idx = 1;

    if (role_scope) {
      whereClause = `WHERE role_scope = $${idx++}`;
      params.push(role_scope);
    }

    const { rows: users } = await db.query(
      `SELECT id, email, first_name, last_name, phone_number, role_scope, is_banned, created_at, updated_at
       FROM users ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${idx++} OFFSET $${idx++}`,
      [...params, limit, offset]
    );

    const { rows: countResult } = await db.query(
      `SELECT COUNT(*)::int AS total FROM users ${whereClause}`,
      params
    );

    return { users, total: countResult[0].total, page, limit };
  }

  /**
   * Update a user's role_scope.
   */
  async updateRole(id, role_scope) {
    const { rows } = await db.query(
      `UPDATE users SET role_scope = $1, updated_at = NOW() WHERE id = $2
       RETURNING id, email, first_name, last_name, phone_number, role_scope, is_banned, created_at`,
      [role_scope, id]
    );
    return rows[0] || null;
  }

  /**
   * Set a user's ban status.
   */
  async setBanStatus(id, banned) {
    const { rows } = await db.query(
      `UPDATE users SET is_banned = $1, updated_at = NOW() WHERE id = $2
       RETURNING id, email, first_name, last_name, role_scope, is_banned, created_at`,
      [banned, id]
    );
    return rows[0] || null;
  }

  /**
   * Update user profile fields. Profile images live in user_profile_images.
   */
  async updateProfile(id, data) {
    const setClauses = [];
    const values = [];
    let idx = 1;

    if (data.first_name !== undefined) {
      setClauses.push(`first_name = $${idx++}`);
      values.push(data.first_name);
    }
    if (data.last_name !== undefined) {
      setClauses.push(`last_name = $${idx++}`);
      values.push(data.last_name);
    }
    if (data.phone_number !== undefined) {
      setClauses.push(`phone_number = $${idx++}`);
      values.push(data.phone_number);
    }
    if (setClauses.length === 0) return null;

    setClauses.push(`updated_at = NOW()`);
    values.push(id);

    const { rows } = await db.query(
      `UPDATE users SET ${setClauses.join(", ")} WHERE id = $${idx}
       RETURNING id, email, first_name, last_name, phone_number, role_scope`,
      values
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
      `SELECT u.*,
              r.name AS role_name,
              r.base_scope,
              r.table_privileges,
              r.system_capabilities,
              r.grant_option
       FROM users u
       JOIN "role" r ON r.id = u.role_id
       WHERE LOWER(u.email) = LOWER($1)
       LIMIT 1`,
      [email]
    );
    return rows[0] || null;
  }

  /**
   * Find user by ID including password_hash (for password change).
   */
  async findByIdWithPassword(id) {
    const { rows } = await db.query(
      `SELECT * FROM users WHERE id = $1 LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }
}

export default UserRepository;
