import crypto from "crypto";
import db from "../config/db.js";

const tokenHash = (token) =>
  crypto.createHash("sha256").update(String(token)).digest("hex");

class TokenRepository {
  hash(token) {
    return tokenHash(token);
  }

  async store(userId, token, expiresAt, metadata = {}) {
    const { rows } = await db.query(
      `INSERT INTO refresh_tokens (
         user_id,
         family_id,
         jti,
         token_hash,
         expires_at,
         created_ip,
         user_agent
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, family_id, jti, expires_at`,
      [
        userId,
        metadata.familyId,
        metadata.jti,
        tokenHash(token),
        expiresAt,
        metadata.ipAddress || null,
        metadata.userAgent || null,
      ]
    );
    return rows[0];
  }

  async findByToken(token, { includeRevoked = false } = {}) {
    const revokedClause = includeRevoked ? "" : "AND revoked_at IS NULL AND expires_at > NOW()";
    const { rows } = await db.query(
      `SELECT *
       FROM refresh_tokens
       WHERE token_hash = $1 ${revokedClause}
       LIMIT 1`,
      [tokenHash(token)]
    );
    return rows[0] || null;
  }

  async touch(id) {
    const { rows } = await db.query(
      `UPDATE refresh_tokens
       SET last_used_at = NOW()
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    return rows[0] || null;
  }

  async revoke(token, replacedBy = null) {
    const { rows } = await db.query(
      `UPDATE refresh_tokens
       SET revoked_at = COALESCE(revoked_at, NOW()),
           replaced_by = COALESCE($2, replaced_by)
       WHERE token_hash = $1
       RETURNING id, user_id, family_id`,
      [tokenHash(token), replacedBy]
    );
    return rows[0] || null;
  }

  async revokeById(id, replacedBy = null) {
    const { rows } = await db.query(
      `UPDATE refresh_tokens
       SET revoked_at = COALESCE(revoked_at, NOW()),
           replaced_by = COALESCE($2, replaced_by)
       WHERE id = $1
       RETURNING id, user_id, family_id`,
      [id, replacedBy]
    );
    return rows[0] || null;
  }

  async revokeFamily(familyId) {
    const { rows } = await db.query(
      `UPDATE refresh_tokens
       SET revoked_at = COALESCE(revoked_at, NOW())
       WHERE family_id = $1 AND revoked_at IS NULL
       RETURNING id`,
      [familyId]
    );
    return rows.length;
  }

  async revokeAllForUser(userId) {
    const { rows } = await db.query(
      `UPDATE refresh_tokens
       SET revoked_at = COALESCE(revoked_at, NOW())
       WHERE user_id = $1 AND revoked_at IS NULL
       RETURNING id`,
      [userId]
    );
    return rows.length;
  }

  async cleanupExpired() {
    const { rows } = await db.query(
      `DELETE FROM refresh_tokens
       WHERE expires_at < NOW() OR revoked_at IS NOT NULL
       RETURNING id`
    );
    return rows.length;
  }

  async logSessionEvent({
    userId = null,
    refreshTokenId = null,
    familyId = null,
    eventType,
    ipAddress = null,
    userAgent = null,
    details = {},
  }) {
    try {
      await db.query(
        `INSERT INTO session_events (
           user_id,
           refresh_token_id,
           family_id,
           event_type,
           ip_address,
           user_agent,
           details
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)`,
        [
          userId,
          refreshTokenId,
          familyId,
          eventType,
          ipAddress,
          userAgent,
          JSON.stringify(details || {}),
        ]
      );
    } catch (err) {
      console.warn(`[session_events] Failed to log ${eventType}: ${err.message}`);
    }
  }
}

export default TokenRepository;
