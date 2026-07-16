import { createReadStream, existsSync } from "fs";
import { mkdtemp, rm, unlink, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import db, { pool } from "../config/db.js";
import AppError from "../utils/AppError.js";
import {
  BACKUP_METHODS,
  SCHEDULE_UNITS,
  formatBytes,
  generateBackupForProfile,
  getPublicTableNames,
  safeDownloadName,
  validateBackupProfile,
  validateIdentifier,
} from "./backupService.js";
import {
  inspectPostgresDump,
  restoreCsvFile,
  restoreFullDump,
  restoreTableDump,
  withRecoveryLock,
} from "./backupRecoveryService.js";
import { logAuditAction } from "../repositories/adminRepository.js";

const RECOVERY_TYPES = new Set(["PostgreSQL Dump", "Row Level CSV"]);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const nullableUuid = (value) => UUID_PATTERN.test(String(value ?? "")) ? value : null;

class DeveloperBackupService {
  async ensureTables() {
    const { rows } = await pool.query(`SELECT
      to_regclass('public.backup_profiles') AS profiles,
      to_regclass('public.scheduled_backups') AS scheduled,
      to_regclass('public.recovery_operations') AS recovery`);
    if (!rows[0]?.profiles || !rows[0]?.scheduled || !rows[0]?.recovery) {
      throw new AppError("Backup tables are not initialized. Run database migrations first.", 503);
    }
  }

  audit(actor, action, targetType, targetId, details = null) {
    return logAuditAction(
      nullableUuid(actor?.sub),
      action,
      targetType,
      targetId,
      details,
      actor?.role_scope || actor?.role || "DEVELOPER_ADMIN"
    );
  }

  async listProfiles() {
    await this.ensureTables();
    const { rows } = await db.query(`SELECT id, profile_name AS "profileName", method, scope,
      schedule_interval AS "scheduleInterval", schedule_unit AS "scheduleUnit",
      is_enabled AS "isEnabled", status, size, last_error AS "lastError",
      run_count AS "runCount", created_at AS "createdAt", updated_at AS "updatedAt",
      last_backup_at AS "lastBackupAt", next_backup_at AS "nextBackupAt"
      FROM backup_profiles ORDER BY created_at DESC`);
    return rows;
  }

  async listTables() {
    const client = await pool.connect();
    try {
      return await getPublicTableNames(client);
    } finally {
      client.release();
    }
  }

  normalizeSchedule(scheduleInterval, scheduleUnit) {
    if (scheduleInterval === null || scheduleInterval === "" || scheduleInterval === undefined) {
      return { interval: null, unit: null, hasSchedule: false };
    }
    const interval = Number(scheduleInterval);
    if (!Number.isSafeInteger(interval) || interval < 0) {
      throw new AppError("Schedule interval must be a non-negative integer", 400, {
        fieldErrors: { schedule: "Use a whole number of 0 or more." },
      });
    }
    if (interval === 0) return { interval: null, unit: null, hasSchedule: false };
    if (!SCHEDULE_UNITS.has(scheduleUnit)) throw new AppError("Invalid schedule unit", 400);
    return { interval: String(interval), unit: scheduleUnit, hasSchedule: true };
  }

  async createProfile(payload, actor) {
    await this.ensureTables();
    const profileName = String(payload.profileName ?? "").trim();
    if (!profileName || !payload.method) {
      throw new AppError("Backup profile is invalid", 400, {
        code: "BACKUP_PROFILE_INVALID",
        fieldErrors: {
          ...(!profileName && { profileName: "Profile name is required." }),
          ...(!payload.method && { method: "Select a backup method." }),
        },
      });
    }
    if (!BACKUP_METHODS.has(payload.method)) throw new AppError("Invalid backup method", 400);
    const scope = payload.scope || "full";
    await validateBackupProfile({ method: payload.method, scope });
    const schedule = this.normalizeSchedule(payload.scheduleInterval, payload.scheduleUnit);
    const { rows } = await db.query(
      `INSERT INTO backup_profiles
       (profile_name, method, scope, schedule_interval, schedule_unit, is_enabled, status, size, next_backup_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'N/A', CASE WHEN $6 THEN NOW() ELSE NULL END)
       RETURNING id, profile_name AS "profileName", method, scope,
         schedule_interval AS "scheduleInterval", schedule_unit AS "scheduleUnit",
         is_enabled AS "isEnabled", status, size, created_at AS "createdAt", next_backup_at AS "nextBackupAt"`,
      [profileName, payload.method, scope, schedule.interval, schedule.unit, schedule.hasSchedule, schedule.hasSchedule ? "ACTIVE" : "MANUAL"]
    );
    await this.audit(actor, "create_backup", "backup_profiles", rows[0].id, { profileName, method: payload.method, scope });
    return rows[0];
  }

  async getProfile(id) {
    const { rows } = await db.query(`SELECT id, profile_name AS "profileName", method, scope,
      schedule_interval AS "scheduleInterval", schedule_unit AS "scheduleUnit",
      is_enabled AS "isEnabled", status, size, created_at AS "createdAt"
      FROM backup_profiles WHERE id = $1`, [id]);
    if (!rows[0]) throw new AppError("Backup not found", 404);
    return rows[0];
  }

  async prepareProfileDownload(id, actor) {
    await this.ensureTables();
    const profile = await this.getProfile(id);
    const generated = await generateBackupForProfile(profile);
    const size = formatBytes(generated.sizeBytes);
    await db.query(`UPDATE backup_profiles SET size = $2, last_backup_at = NOW(),
      status = CASE WHEN is_enabled THEN 'ACTIVE' WHEN schedule_interval IS NULL THEN 'MANUAL' ELSE status END
      WHERE id = $1`, [id, size]);
    await this.audit(actor, "download_backup", "backup_profiles", id, { profileName: profile.profileName, size });
    return {
      stream: createReadStream(generated.dumpPath),
      cleanup: () => rm(generated.tempDir, { recursive: true, force: true }).catch(() => {}),
      filename: `${safeDownloadName(profile.profileName)}.${generated.extension}`,
      contentType: generated.contentType,
      format: generated.format,
    };
  }

  async updateProfile(id, payload, actor) {
    await this.ensureTables();
    const current = await this.getProfile(id);
    const profileName = payload.profileName === undefined ? current.profileName : String(payload.profileName).trim();
    const method = payload.method ?? current.method;
    const scope = payload.scope === undefined ? current.scope : (payload.scope || "full");
    if (!profileName) throw new AppError("Profile name cannot be empty", 400);
    if (!BACKUP_METHODS.has(method)) throw new AppError("Invalid backup method", 400);
    await validateBackupProfile({ method, scope });
    const schedule = this.normalizeSchedule(
      payload.scheduleInterval === undefined ? current.scheduleInterval : payload.scheduleInterval,
      payload.scheduleUnit === undefined ? current.scheduleUnit : payload.scheduleUnit
    );
    const isEnabled = schedule.hasSchedule && (payload.isEnabled === undefined ? Boolean(current.isEnabled) : Boolean(payload.isEnabled));
    const status = !schedule.hasSchedule ? "MANUAL" : isEnabled ? "ACTIVE" : "PAUSED";
    const { rows } = await db.query(`UPDATE backup_profiles SET
      profile_name = $1, method = $2, scope = $3, schedule_interval = $4, schedule_unit = $5,
      is_enabled = $6, status = $7, next_backup_at = CASE WHEN $6 THEN NOW() ELSE NULL END,
      last_error = NULL, updated_at = NOW() WHERE id = $8
      RETURNING id, profile_name AS "profileName", method, scope,
        schedule_interval AS "scheduleInterval", schedule_unit AS "scheduleUnit",
        is_enabled AS "isEnabled", status, size, last_error AS "lastError",
        run_count AS "runCount", created_at AS "createdAt", updated_at AS "updatedAt",
        last_backup_at AS "lastBackupAt", next_backup_at AS "nextBackupAt"`,
      [profileName, method, scope, schedule.interval, schedule.unit, isEnabled, status, id]);
    await this.audit(actor, "update_backup", "backup_profiles", id, { profileName, method, scope, isEnabled });
    return rows[0];
  }

  async setProfileEnabled(id, enabled, actor) {
    await this.ensureTables();
    const sql = enabled
      ? `UPDATE backup_profiles SET is_enabled = TRUE, status = 'ACTIVE', next_backup_at = NOW(),
           last_error = NULL, updated_at = NOW()
         WHERE id = $1 AND schedule_interval IS NOT NULL AND schedule_interval NOT IN ('', '0') AND schedule_unit IS NOT NULL`
      : `UPDATE backup_profiles SET is_enabled = FALSE,
           status = CASE WHEN schedule_interval IS NULL THEN 'MANUAL' ELSE 'PAUSED' END,
           next_backup_at = NULL, run_started_at = NULL, updated_at = NOW() WHERE id = $1`;
    const { rows } = await db.query(`${sql} RETURNING id, profile_name AS "profileName", method, scope,
      schedule_interval AS "scheduleInterval", schedule_unit AS "scheduleUnit", is_enabled AS "isEnabled",
      status, size, last_error AS "lastError", run_count AS "runCount", created_at AS "createdAt",
      updated_at AS "updatedAt", last_backup_at AS "lastBackupAt", next_backup_at AS "nextBackupAt"`, [id]);
    if (!rows[0]) throw new AppError(enabled ? "Backup profile has no valid schedule to resume" : "Backup not found", enabled ? 400 : 404);
    await this.audit(actor, enabled ? "resume_backup" : "pause_backup", "backup_profiles", id);
    return rows[0];
  }

  async deleteProfile(id, actor) {
    await this.ensureTables();
    const files = await db.query("SELECT file_path FROM scheduled_backups WHERE profile_id = $1 AND status = 'COMPLETED'", [id]);
    const { rows } = await db.query("DELETE FROM backup_profiles WHERE id = $1 RETURNING id, profile_name AS \"profileName\"", [id]);
    if (!rows[0]) throw new AppError("Backup not found", 404);
    await Promise.all(files.rows.map((file) => unlink(file.file_path).catch(() => {})));
    await this.audit(actor, "delete_backup", "backup_profiles", id, { profileName: rows[0].profileName });
    return { id };
  }

  async listScheduled(profileId) {
    await this.ensureTables();
    const params = profileId ? [profileId] : [];
    const where = profileId ? "WHERE profile_id::text = $1" : "";
    const { rows } = await db.query(`SELECT id, profile_id AS "profileId", profile_name AS "profileName",
      file_name AS "fileName", method, scope, size, status, message,
      artifact_format AS "artifactFormat", completed_at AS "completedAt", created_at AS "createdAt"
      FROM scheduled_backups ${where} ORDER BY created_at DESC LIMIT 200`, params);
    return rows;
  }

  async prepareScheduledDownload(id) {
    await this.ensureTables();
    const { rows } = await db.query("SELECT id, file_name, file_path, method FROM scheduled_backups WHERE id = $1", [id]);
    const backup = rows[0];
    if (!backup || !existsSync(backup.file_path)) throw new AppError("Scheduled backup file was not found", 404);
    const extension = path.extname(backup.file_name || "").slice(1).toLowerCase() || "dump";
    return {
      stream: createReadStream(backup.file_path),
      filename: backup.file_name || `scheduled-backup.${extension}`,
      contentType: extension === "csv" ? "text/csv" : "application/octet-stream",
      format: extension === "csv" ? "csv" : "postgres-custom",
    };
  }

  async deleteScheduled(id, actor) {
    await this.ensureTables();
    const { rows } = await db.query("DELETE FROM scheduled_backups WHERE id = $1 RETURNING id, file_path, file_name", [id]);
    if (!rows[0]) throw new AppError("Scheduled backup not found", 404);
    await unlink(rows[0].file_path).catch(() => {});
    await this.audit(actor, "delete_scheduled_backup", "scheduled_backups", id, { fileName: rows[0].file_name });
    return { id };
  }

  async listRecovery() {
    await this.ensureTables();
    const { rows } = await db.query(`SELECT id, recovery_type AS type, file_name AS "fileName",
      status, message, created_at AS "createdAt" FROM recovery_operations ORDER BY created_at DESC`);
    return rows;
  }

  async recordRecovery(type, fileName, actor, status, message, scope = null) {
    const { rows } = await db.query(`INSERT INTO recovery_operations
      (recovery_type, file_name, scope, actor_id, status, message)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, recovery_type AS type, file_name AS "fileName", scope, status, message, created_at AS "createdAt"`,
      [type, fileName, scope, nullableUuid(actor?.sub), status, message]);
    return rows[0];
  }

  async recover({ type, confirmationText, targetTable, file }, actor) {
    await this.ensureTables();
    if (!RECOVERY_TYPES.has(type)) throw new AppError("Invalid recovery type", 400);
    const expectedConfirmation = type === "PostgreSQL Dump" ? "RESTORE POSTGRES DUMP" : "RECOVER";
    if (confirmationText !== expectedConfirmation) throw new AppError(`Type ${expectedConfirmation} to confirm recovery`, 400);
    if (!file) throw new AppError("Recovery file is required", 400);
    const lowerName = file.originalname.toLowerCase();
    if (type === "PostgreSQL Dump" && ![".dump", ".backup", ".pgdump"].some((extension) => lowerName.endsWith(extension))) {
      throw new AppError("PostgreSQL dump recovery requires a .dump, .backup, or .pgdump file", 400);
    }
    if (type === "Row Level CSV" && !lowerName.endsWith(".csv")) throw new AppError("Row Level CSV recovery requires a .csv file", 400);
    if (type === "PostgreSQL Dump" && file.buffer.subarray(0, 5).toString("ascii") !== "PGDMP") {
      await this.recordRecovery(type, file.originalname, actor, "FAILED", "File is not a PostgreSQL custom-format dump.");
      throw new AppError("File is not a PostgreSQL custom-format dump", 400);
    }
    if (type === "Row Level CSV") {
      if (!targetTable) throw new AppError("Target table is required for CSV recovery", 400);
      validateIdentifier(targetTable, "Target table");
    }

    const tempDir = await mkdtemp(path.join(os.tmpdir(), "patheats-recovery-"));
    const filePath = path.join(tempDir, `recovery${path.extname(file.originalname).toLowerCase()}`);
    try {
      await writeFile(filePath, file.buffer, { flag: "wx" });
      let scope;
      let message;
      if (type === "PostgreSQL Dump") {
        const inspection = await inspectPostgresDump(filePath);
        if (!inspection.tableNames.length) throw new AppError("No public tables found in the dump", 400);
        await withRecoveryLock(async () => {
          if (inspection.isFullDatabase) await restoreFullDump(filePath);
          else for (const tableName of inspection.tableNames) await restoreTableDump(filePath, tableName);
        });
        scope = inspection.isFullDatabase ? "full" : `tables:${inspection.tableNames.join(",")}`;
        message = `PostgreSQL dump restored. ${inspection.dataEntryCount} data entries across ${inspection.tableNames.length} table(s).`;
      } else {
        await withRecoveryLock(() => restoreCsvFile(filePath, targetTable));
        scope = `table:${targetTable}`;
        message = `CSV rows restored into table "${targetTable}".`;
      }
      const operation = await this.recordRecovery(type, file.originalname, actor, "COMPLETED", message, scope);
      await this.audit(actor, "execute_recovery", "recovery_operations", operation.id, { type, fileName: file.originalname, status: "COMPLETED" });
      return operation;
    } catch (error) {
      const safeMessage = error?.statusCode && error.statusCode < 500
        ? (error.safeMessage || error.message)
        : "Recovery failed. The database was left unchanged or rolled back.";
      await this.recordRecovery(type, file.originalname, actor, "FAILED", safeMessage);
      throw new AppError(safeMessage, error.statusCode || 500);
    } finally {
      await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}

export default DeveloperBackupService;
