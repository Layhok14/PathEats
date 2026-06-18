import db from "../config/db.js";

class OtpRepository {
  constructor() {
    this._init();
  }

  async _init() {
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS otps (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT NOT NULL,
          otp_code TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'password_reset',
          expires_at TIMESTAMPTZ NOT NULL,
          is_used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);
      await db.query(
        `CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email)`
      );
    } catch (err) {
      console.warn("OTP table init skipped (may already exist):", err.message);
    }
  }

  /**
   * Store an OTP for a given email.
   */
  async store(email, otpCode, type = "password_reset", expiryMinutes = 15) {
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString();
    const { rows } = await db.query(
      `INSERT INTO otps (email, otp_code, type, expires_at)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, expires_at`,
      [email.toLowerCase().trim(), otpCode, type, expiresAt]
    );
    return rows[0];
  }

  /**
   * Verify an OTP — returns the OTP row if valid, else null.
   * Marks the OTP as used after successful verification.
   */
  async verify(email, otpCode, type = "password_reset") {
    // Find valid, unused, non-expired OTP
    const { rows } = await db.query(
      `SELECT * FROM otps
       WHERE LOWER(email) = LOWER($1)
         AND otp_code = $2
         AND type = $3
         AND is_used = FALSE
         AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [email, otpCode, type]
    );

    if (rows.length === 0) return null;

    // Mark as used
    await db.query(
      `UPDATE otps SET is_used = TRUE WHERE id = $1`,
      [rows[0].id]
    );

    return rows[0];
  }

  /**
   * Invalidate all unused OTPs for an email (e.g., after password reset).
   */
  async invalidateAll(email, type = "password_reset") {
    await db.query(
      `UPDATE otps SET is_used = TRUE
       WHERE LOWER(email) = LOWER($1) AND type = $2 AND is_used = FALSE`,
      [email, type]
    );
  }
}

export default OtpRepository;
