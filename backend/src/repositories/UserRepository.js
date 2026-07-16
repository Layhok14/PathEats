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

  async findPreferences(userId) {
    const { rows } = await db.query(
      `SELECT id, user_id, search_radius, theme, is_active, created_at, updated_at
       FROM user_preferences
       WHERE user_id = $1
       LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  }

  async findProfileImage(userId) {
    const { rows } = await db.query(
      `SELECT id, user_id, bucket_name, object_path, uploaded_by,
              mime_type, size_bytes, alt_text, created_at, updated_at
       FROM user_profile_images
       WHERE user_id = $1
       LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  }

  async upsertPreferences(userId, data) {
    const currentPreferences = await this.findPreferences(userId);
    const nextPreferences = {
      searchRadius: data.search_radius ?? currentPreferences?.search_radius ?? 100,
      theme: data.theme ?? currentPreferences?.theme ?? "light",
      isActive: data.is_active ?? currentPreferences?.is_active ?? true,
    };

    const { rows } = await db.query(
      `INSERT INTO user_preferences (user_id, search_radius, theme, is_active)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id)
       DO UPDATE SET
         search_radius = EXCLUDED.search_radius,
         theme = EXCLUDED.theme,
         is_active = EXCLUDED.is_active,
         updated_at = NOW()
       RETURNING id, user_id, search_radius, theme, is_active, created_at, updated_at`,
      [userId, nextPreferences.searchRadius, nextPreferences.theme, nextPreferences.isActive]
    );
    return rows[0];
  }

  async upsertProfileImage(userId, storageImage) {
    const { rows } = await db.query(
      `INSERT INTO user_profile_images (
         user_id, bucket_name, object_path, uploaded_by,
         mime_type, size_bytes, alt_text
       )
       VALUES ($1, $2, $3, $1, $4, $5, $6)
       ON CONFLICT (user_id)
       DO UPDATE SET
         bucket_name = EXCLUDED.bucket_name,
         object_path = EXCLUDED.object_path,
         uploaded_by = EXCLUDED.uploaded_by,
         mime_type = EXCLUDED.mime_type,
         size_bytes = EXCLUDED.size_bytes,
         alt_text = EXCLUDED.alt_text,
         updated_at = NOW()
       RETURNING id, user_id, bucket_name, object_path, uploaded_by,
                 mime_type, size_bytes, alt_text, created_at, updated_at`,
      [
        userId,
        storageImage.bucketName,
        storageImage.objectPath,
        storageImage.mimeType,
        storageImage.sizeBytes,
        storageImage.altText || null,
      ]
    );
    return rows[0];
  }

  async getBookmarks(userId) {
    const { rows } = await db.query(
      `SELECT b.id, b.place_id, b.notes, b.created_at,
              p.name AS place_name, p.photo_url, p.price_range, p.rating_avg, p.address
       FROM bookmarks b
       JOIN places p ON p.id = b.place_id
       JOIN users owner_user
         ON owner_user.id = p.owner_id
        AND owner_user.role_scope = 'VENDOR'
        AND owner_user.is_banned = FALSE
       WHERE b.user_id = $1
         AND p.status = 'active'
         AND p.is_open = TRUE
       ORDER BY b.created_at DESC`,
      [userId]
    );
    return rows;
  }

  async isPublicPlace(placeId) {
    const { rowCount } = await db.query(
      `SELECT p.id
       FROM places p
       JOIN users owner_user
         ON owner_user.id = p.owner_id
        AND owner_user.role_scope = 'VENDOR'
        AND owner_user.is_banned = FALSE
       WHERE p.id = $1 AND p.status = 'active' AND p.is_open = TRUE
       LIMIT 1`,
      [placeId]
    );
    return rowCount > 0;
  }

  async addBookmark(userId, placeId) {
    const { rows } = await db.query(
      `INSERT INTO bookmarks (user_id, place_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING
       RETURNING id, place_id, created_at`,
      [userId, placeId]
    );
    return rows[0] || null;
  }

  async removeBookmark(userId, placeId) {
    const { rowCount } = await db.query(
      "DELETE FROM bookmarks WHERE user_id = $1 AND place_id = $2",
      [userId, placeId]
    );
    return rowCount > 0;
  }

  async getRoutes(userId) {
    const { rows } = await db.query(
      `SELECT id, label, origin, destination, waypoints, saved_at
       FROM routes WHERE user_id = $1 ORDER BY saved_at DESC`,
      [userId]
    );
    return rows;
  }

  async addRoute(userId, { label, origin, destination, waypoints }) {
    const { rows } = await db.query(
      `INSERT INTO routes (user_id, label, origin, destination, waypoints)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, label, origin, destination, waypoints, saved_at`,
      [userId, label || null, JSON.stringify(origin), JSON.stringify(destination), waypoints ? JSON.stringify(waypoints) : null]
    );
    return rows[0];
  }

  async deleteAllRoutes(userId) {
    const { rowCount } = await db.query("DELETE FROM routes WHERE user_id = $1", [userId]);
    return rowCount;
  }

  async deleteRoute(userId, routeId) {
    const { rowCount } = await db.query(
      "DELETE FROM routes WHERE id = $1 AND user_id = $2",
      [routeId, userId]
    );
    return rowCount > 0;
  }

  async routeLabelExists(userId, routeId, label) {
    const { rowCount } = await db.query(
      "SELECT id FROM routes WHERE user_id = $1 AND label = $2 AND id != $3 LIMIT 1",
      [userId, label, routeId]
    );
    return rowCount > 0;
  }

  async updateRouteLabel(userId, routeId, label) {
    const { rows } = await db.query(
      `UPDATE routes SET label = $1
       WHERE id = $2 AND user_id = $3
       RETURNING id, label, origin, destination, waypoints, saved_at`,
      [label, routeId, userId]
    );
    return rows[0] || null;
  }

  async getHistory(userId) {
    const { rows } = await db.query(
      `SELECT id, query, filters, results_count, created_at
       FROM search_history WHERE user_id = $1
       ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );
    return rows;
  }

  async addHistory(userId, { query, filters, resultsCount }) {
    const { rows } = await db.query(
      `INSERT INTO search_history (user_id, query, filters, results_count)
       VALUES ($1, $2, $3, $4)
       RETURNING id, query, filters, results_count, created_at`,
      [userId, query, filters ? JSON.stringify(filters) : null, resultsCount || 0]
    );
    return rows[0];
  }

  async deleteAllHistory(userId) {
    const { rowCount } = await db.query("DELETE FROM search_history WHERE user_id = $1", [userId]);
    return rowCount;
  }

  async deleteHistory(userId, historyId) {
    const { rowCount } = await db.query(
      "DELETE FROM search_history WHERE id = $1 AND user_id = $2",
      [historyId, userId]
    );
    return rowCount > 0;
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
