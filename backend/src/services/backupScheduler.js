import { copyFile, rm } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { pool } from "../config/db.js";
import {
  BACKUP_STORAGE_DIR,
  ensureBackupStorageDir,
  formatBytes,
  generateBackupForProfile,
  safeDownloadName,
} from "./backupService.js";

const SCHEDULER_TICK_MS = 60 * 1000;
const UNIT_INTERVALS = {
  Minutes: "INTERVAL '1 minute'",
  Hours: "INTERVAL '1 hour'",
  Days: "INTERVAL '1 day'",
  Months: "INTERVAL '1 month'",
};
let schedulerTimer = null;
let running = false;

async function ensureScheduledBackupsTable() {
  const { rows } = await pool.query(`SELECT to_regclass('public.scheduled_backups') AS exists`);
  if (!rows[0]?.exists) {
    console.warn("[backup] scheduled_backups table missing; run database migrations before enabling schedules.");
    return false;
  }
  return true;
}

function intervalSql(scheduleUnit) {
  const value = UNIT_INTERVALS[scheduleUnit];
  if (!value) throw new Error(`Unsupported schedule unit: ${scheduleUnit}`);
  return value;
}

async function claimDueProfiles() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(`
      WITH due AS (
        SELECT id
        FROM backup_profiles
        WHERE is_enabled = TRUE
          AND schedule_interval IS NOT NULL
          AND schedule_interval NOT IN ('0', '')
          AND schedule_unit IS NOT NULL
          AND (next_backup_at IS NULL OR next_backup_at <= NOW())
          AND (status IN ('ACTIVE', 'FAILED') OR (status = 'RUNNING' AND run_started_at < NOW() - INTERVAL '15 minutes'))
        ORDER BY next_backup_at ASC NULLS FIRST
        FOR UPDATE SKIP LOCKED
        LIMIT 5
      )
      UPDATE backup_profiles profile
      SET status = 'RUNNING', run_started_at = NOW(), last_error = NULL, updated_at = NOW()
      FROM due
      WHERE profile.id = due.id
      RETURNING profile.id, profile.profile_name, profile.method, profile.scope,
                profile.schedule_interval, profile.schedule_unit
    `);
    await client.query("COMMIT");
    return rows;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

async function processDueProfiles() {
  if (running) return;
  running = true;
  try {
    await ensureScheduledBackupsTable();
    await ensureBackupStorageDir();
    const profiles = await claimDueProfiles();
    for (const profile of profiles) await generateScheduledBackup(profile);
  } catch (err) {
    console.error("[BackupScheduler] Error processing due profiles:", err.message);
  } finally {
    running = false;
  }
}

async function generateScheduledBackup(profile) {
  let tempDir = null;
  try {
    const result = await generateBackupForProfile(profile);
    tempDir = result.tempDir;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${safeDownloadName(profile.profile_name)}-${timestamp}.${result.extension}`;
    const permanentPath = path.join(BACKUP_STORAGE_DIR, fileName);
    await copyFile(result.dumpPath, permanentPath);
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    tempDir = null;

    const size = formatBytes(result.sizeBytes);
    await pool.query(
      `INSERT INTO scheduled_backups
         (profile_id, profile_name, file_name, file_path, method, scope, size, status, artifact_format, completed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'COMPLETED', $8, NOW())`,
      [profile.id, profile.profile_name, fileName, permanentPath, profile.method, profile.scope, size, result.format]
    );

    const nextInterval = intervalSql(profile.schedule_unit);
    await pool.query(
      `UPDATE backup_profiles
       SET last_backup_at = NOW(),
           next_backup_at = CASE WHEN is_enabled THEN NOW() + ($1::numeric * ${nextInterval}) ELSE NULL END,
           status = CASE WHEN is_enabled THEN 'ACTIVE' ELSE 'PAUSED' END,
           size = $2,
           last_error = NULL,
           run_started_at = NULL,
           run_count = run_count + 1,
           updated_at = NOW()
       WHERE id = $3`,
      [String(profile.schedule_interval), size, profile.id]
    );
  } catch (err) {
    const nextInterval = UNIT_INTERVALS[profile.schedule_unit] || "INTERVAL '1 hour'";
    await pool.query(
      `UPDATE backup_profiles
       SET status = CASE WHEN is_enabled THEN 'FAILED' ELSE 'PAUSED' END,
           next_backup_at = CASE WHEN is_enabled THEN NOW() + ($1::numeric * ${nextInterval}) ELSE NULL END,
           last_error = $2,
           run_started_at = NULL,
           updated_at = NOW()
       WHERE id = $3`,
      [String(profile.schedule_interval || 1), err.message, profile.id]
    ).catch(() => {});
    await pool.query(
      `INSERT INTO scheduled_backups
         (profile_id, profile_name, file_name, file_path, method, scope, status, message, artifact_format, completed_at)
       VALUES ($1, $2, 'N/A', 'N/A', $3, $4, 'FAILED', $5, NULL, NOW())`,
      [profile.id, profile.profile_name, profile.method, profile.scope, err.message]
    ).catch(() => {});
    if (tempDir) await rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
}

export function startBackupScheduler() {
  if (schedulerTimer) return;
  ensureScheduledBackupsTable()
    .then(() => ensureBackupStorageDir())
    .then(() => {
      processDueProfiles().catch((err) => console.error("[BackupScheduler] Initial run error:", err.message));
      schedulerTimer = setInterval(() => {
        processDueProfiles().catch((err) => console.error("[BackupScheduler] Tick error:", err.message));
      }, SCHEDULER_TICK_MS);
      console.log("[BackupScheduler] Started; checking every 60 seconds");
    })
    .catch((err) => console.error("[BackupScheduler] Failed to start:", err.message));
}

export function stopBackupScheduler() {
  if (!schedulerTimer) return;
  clearInterval(schedulerTimer);
  schedulerTimer = null;
}

export async function cleanupOrphanedBackupFiles() {
  try {
    await ensureScheduledBackupsTable();
    const { rows } = await pool.query(`SELECT id, file_path FROM scheduled_backups WHERE status = 'COMPLETED'`);
    for (const row of rows) {
      if (!existsSync(row.file_path)) await pool.query(`DELETE FROM scheduled_backups WHERE id = $1`, [row.id]);
    }
  } catch (err) {
    console.error("[BackupScheduler] Cleanup error:", err.message);
  }
}
