import db, { pool } from "../config/db.js";

const quoteIdentifier = (identifier) => `"${String(identifier).replace(/"/g, '""')}"`;

const PROFILE_COLUMNS = `id, profile_name AS "profileName", method, scope,
  schedule_interval AS "scheduleInterval", schedule_unit AS "scheduleUnit",
  is_enabled AS "isEnabled", status, size, last_error AS "lastError",
  run_count AS "runCount", created_at AS "createdAt", updated_at AS "updatedAt",
  last_backup_at AS "lastBackupAt", next_backup_at AS "nextBackupAt"`;

const UNIT_INTERVALS = {
  Minutes: "INTERVAL '1 minute'",
  Hours: "INTERVAL '1 hour'",
  Days: "INTERVAL '1 day'",
  Months: "INTERVAL '1 month'",
};

class BackupRepository {
  async tablesExist() {
    const { rows } = await pool.query(`SELECT
      to_regclass('public.backup_profiles') AS profiles,
      to_regclass('public.scheduled_backups') AS scheduled,
      to_regclass('public.recovery_operations') AS recovery`);
    return Boolean(rows[0]?.profiles && rows[0]?.scheduled && rows[0]?.recovery);
  }

  async scheduledBackupsTableExists() {
    const { rows } = await pool.query("SELECT to_regclass('public.scheduled_backups') AS exists");
    return Boolean(rows[0]?.exists);
  }

  async getPublicTableNames() {
    const { rows } = await db.query(`SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name`);
    return rows.map((row) => row.table_name);
  }

  async getCsvExportData(tableName, condition = "") {
    const { rows: columnRows } = await db.query(`SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1 AND is_generated = 'NEVER'
      ORDER BY ordinal_position`, [tableName]);
    if (columnRows.length === 0) return null;

    const columns = columnRows.map((row) => row.column_name);
    const selectList = columns
      .map((column) => `${quoteIdentifier(column)}::text AS ${quoteIdentifier(column)}`)
      .join(", ");
    const query = `SELECT ${selectList} FROM ${quoteIdentifier(tableName)}${condition ? ` ${condition}` : ""}`;
    const result = await db.query(query);
    return { headers: result.fields.map((field) => field.name), rows: result.rows };
  }

  async listProfiles() {
    const { rows } = await db.query(`SELECT ${PROFILE_COLUMNS} FROM backup_profiles ORDER BY created_at DESC`);
    return rows;
  }

  async createProfile(profile) {
    const { rows } = await db.query(`INSERT INTO backup_profiles
      (profile_name, method, scope, schedule_interval, schedule_unit, is_enabled, status, size, next_backup_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'N/A', CASE WHEN $6 THEN NOW() ELSE NULL END)
      RETURNING ${PROFILE_COLUMNS}`, [
      profile.profileName, profile.method, profile.scope, profile.scheduleInterval,
      profile.scheduleUnit, profile.isEnabled, profile.status,
    ]);
    return rows[0];
  }

  async findProfileById(id) {
    const { rows } = await db.query(`SELECT ${PROFILE_COLUMNS} FROM backup_profiles WHERE id = $1`, [id]);
    return rows[0] || null;
  }

  async markProfileDownloaded(id, size) {
    await db.query(`UPDATE backup_profiles SET size = $2, last_backup_at = NOW(),
      status = CASE WHEN is_enabled THEN 'ACTIVE' WHEN schedule_interval IS NULL THEN 'MANUAL' ELSE status END
      WHERE id = $1`, [id, size]);
  }

  async updateProfile(id, profile) {
    const { rows } = await db.query(`UPDATE backup_profiles SET
      profile_name = $1, method = $2, scope = $3, schedule_interval = $4, schedule_unit = $5,
      is_enabled = $6, status = $7, next_backup_at = CASE WHEN $6 THEN NOW() ELSE NULL END,
      last_error = NULL, updated_at = NOW() WHERE id = $8
      RETURNING ${PROFILE_COLUMNS}`, [
      profile.profileName, profile.method, profile.scope, profile.scheduleInterval,
      profile.scheduleUnit, profile.isEnabled, profile.status, id,
    ]);
    return rows[0] || null;
  }

  async setProfileEnabled(id, enabled) {
    const update = enabled
      ? `UPDATE backup_profiles SET is_enabled = TRUE, status = 'ACTIVE', next_backup_at = NOW(),
           last_error = NULL, updated_at = NOW()
         WHERE id = $1 AND schedule_interval IS NOT NULL AND schedule_interval NOT IN ('', '0') AND schedule_unit IS NOT NULL`
      : `UPDATE backup_profiles SET is_enabled = FALSE,
           status = CASE WHEN schedule_interval IS NULL THEN 'MANUAL' ELSE 'PAUSED' END,
           next_backup_at = NULL, run_started_at = NULL, updated_at = NOW() WHERE id = $1`;
    const { rows } = await db.query(`${update} RETURNING ${PROFILE_COLUMNS}`, [id]);
    return rows[0] || null;
  }

  async getCompletedProfileFiles(profileId) {
    const { rows } = await db.query(
      "SELECT file_path FROM scheduled_backups WHERE profile_id = $1 AND status = 'COMPLETED'",
      [profileId],
    );
    return rows;
  }

  async deleteProfile(id) {
    const { rows } = await db.query(
      'DELETE FROM backup_profiles WHERE id = $1 RETURNING id, profile_name AS "profileName"',
      [id],
    );
    return rows[0] || null;
  }

  async listScheduled(profileId) {
    const params = profileId ? [profileId] : [];
    const where = profileId ? "WHERE profile_id::text = $1" : "";
    const { rows } = await db.query(`SELECT id, profile_id AS "profileId", profile_name AS "profileName",
      file_name AS "fileName", method, scope, size, status, message,
      artifact_format AS "artifactFormat", completed_at AS "completedAt", created_at AS "createdAt"
      FROM scheduled_backups ${where} ORDER BY created_at DESC LIMIT 200`, params);
    return rows;
  }

  async findScheduledById(id) {
    const { rows } = await db.query(
      "SELECT id, file_name, file_path, method FROM scheduled_backups WHERE id = $1",
      [id],
    );
    return rows[0] || null;
  }

  async deleteScheduled(id) {
    const { rows } = await db.query(
      "DELETE FROM scheduled_backups WHERE id = $1 RETURNING id, file_path, file_name",
      [id],
    );
    return rows[0] || null;
  }

  async claimDueProfiles(limit = 5) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { rows } = await client.query(`WITH due AS (
        SELECT id FROM backup_profiles
        WHERE is_enabled = TRUE
          AND schedule_interval IS NOT NULL AND schedule_interval NOT IN ('0', '')
          AND schedule_unit IS NOT NULL
          AND (next_backup_at IS NULL OR next_backup_at <= NOW())
          AND (status IN ('ACTIVE', 'FAILED') OR (status = 'RUNNING' AND run_started_at < NOW() - INTERVAL '15 minutes'))
        ORDER BY next_backup_at ASC NULLS FIRST
        FOR UPDATE SKIP LOCKED LIMIT $1
      )
      UPDATE backup_profiles profile
      SET status = 'RUNNING', run_started_at = NOW(), last_error = NULL, updated_at = NOW()
      FROM due WHERE profile.id = due.id
      RETURNING profile.id, profile.profile_name, profile.method, profile.scope,
        profile.schedule_interval, profile.schedule_unit`, [limit]);
      await client.query("COMMIT");
      return rows;
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  async recordScheduledSuccess(profile, artifact) {
    const interval = UNIT_INTERVALS[profile.schedule_unit];
    if (!interval) throw new Error(`Unsupported schedule unit: ${profile.schedule_unit}`);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`INSERT INTO scheduled_backups
        (profile_id, profile_name, file_name, file_path, method, scope, size, status, artifact_format, completed_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'COMPLETED', $8, NOW())`, [
        profile.id, profile.profile_name, artifact.fileName, artifact.filePath,
        profile.method, profile.scope, artifact.size, artifact.format,
      ]);
      await client.query(`UPDATE backup_profiles SET
        last_backup_at = NOW(),
        next_backup_at = CASE WHEN is_enabled THEN NOW() + ($1::numeric * ${interval}) ELSE NULL END,
        status = CASE WHEN is_enabled THEN 'ACTIVE' ELSE 'PAUSED' END,
        size = $2, last_error = NULL, run_started_at = NULL,
        run_count = run_count + 1, updated_at = NOW() WHERE id = $3`, [
        String(profile.schedule_interval), artifact.size, profile.id,
      ]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  async recordScheduledFailure(profile, message) {
    const interval = UNIT_INTERVALS[profile.schedule_unit] || "INTERVAL '1 hour'";
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`UPDATE backup_profiles SET
        status = CASE WHEN is_enabled THEN 'FAILED' ELSE 'PAUSED' END,
        next_backup_at = CASE WHEN is_enabled THEN NOW() + ($1::numeric * ${interval}) ELSE NULL END,
        last_error = $2, run_started_at = NULL, updated_at = NOW() WHERE id = $3`, [
        String(profile.schedule_interval || 1), message, profile.id,
      ]);
      await client.query(`INSERT INTO scheduled_backups
        (profile_id, profile_name, file_name, file_path, method, scope, status, message, artifact_format, completed_at)
        VALUES ($1, $2, 'N/A', 'N/A', $3, $4, 'FAILED', $5, NULL, NOW())`, [
        profile.id, profile.profile_name, profile.method, profile.scope, message,
      ]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  async listCompletedScheduledFiles() {
    const { rows } = await db.query("SELECT id, file_path FROM scheduled_backups WHERE status = 'COMPLETED'");
    return rows;
  }

  async deleteScheduledRecord(id) {
    await db.query("DELETE FROM scheduled_backups WHERE id = $1", [id]);
  }
}

export default BackupRepository;
