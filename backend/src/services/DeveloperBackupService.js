import { createReadStream, existsSync } from "fs";
import { mkdtemp, rm, unlink, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import BackupRepository from "../repositories/BackupRepository.js";
import RecoveryRepository from "../repositories/RecoveryRepository.js";
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
  constructor({ backupRepository = new BackupRepository(), recoveryRepository = new RecoveryRepository() } = {}) {
    this.backupRepository = backupRepository;
    this.recoveryRepository = recoveryRepository;
  }

  async ensureTables() {
    if (!await this.backupRepository.tablesExist()) {
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
    return this.backupRepository.listProfiles();
  }

  async listTables() {
    return getPublicTableNames(this.backupRepository);
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
    await validateBackupProfile({ method: payload.method, scope }, this.backupRepository);
    const schedule = this.normalizeSchedule(payload.scheduleInterval, payload.scheduleUnit);
    const profile = await this.backupRepository.createProfile({
      profileName,
      method: payload.method,
      scope,
      scheduleInterval: schedule.interval,
      scheduleUnit: schedule.unit,
      isEnabled: schedule.hasSchedule,
      status: schedule.hasSchedule ? "ACTIVE" : "MANUAL",
    });
    await this.audit(actor, "create_backup", "backup_profiles", profile.id, { profileName, method: payload.method, scope });
    return profile;
  }

  async getProfile(id) {
    const profile = await this.backupRepository.findProfileById(id);
    if (!profile) throw new AppError("Backup not found", 404);
    return profile;
  }

  async prepareProfileDownload(id, actor) {
    await this.ensureTables();
    const profile = await this.getProfile(id);
    const generated = await generateBackupForProfile(profile, this.backupRepository);
    const size = formatBytes(generated.sizeBytes);
    try {
      await this.backupRepository.markProfileDownloaded(id, size);
    } catch (error) {
      await rm(generated.tempDir, { recursive: true, force: true }).catch(() => {});
      throw error;
    }
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
    await validateBackupProfile({ method, scope }, this.backupRepository);
    const schedule = this.normalizeSchedule(
      payload.scheduleInterval === undefined ? current.scheduleInterval : payload.scheduleInterval,
      payload.scheduleUnit === undefined ? current.scheduleUnit : payload.scheduleUnit
    );
    const isEnabled = schedule.hasSchedule && (payload.isEnabled === undefined ? Boolean(current.isEnabled) : Boolean(payload.isEnabled));
    const status = !schedule.hasSchedule ? "MANUAL" : isEnabled ? "ACTIVE" : "PAUSED";
    const updated = await this.backupRepository.updateProfile(id, {
      profileName, method, scope, scheduleInterval: schedule.interval, scheduleUnit: schedule.unit, isEnabled, status,
    });
    await this.audit(actor, "update_backup", "backup_profiles", id, { profileName, method, scope, isEnabled });
    return updated;
  }

  async setProfileEnabled(id, enabled, actor) {
    await this.ensureTables();
    const profile = await this.backupRepository.setProfileEnabled(id, enabled);
    if (!profile) throw new AppError(enabled ? "Backup profile has no valid schedule to resume" : "Backup not found", enabled ? 400 : 404);
    await this.audit(actor, enabled ? "resume_backup" : "pause_backup", "backup_profiles", id);
    return profile;
  }

  async deleteProfile(id, actor) {
    await this.ensureTables();
    const files = await this.backupRepository.getCompletedProfileFiles(id);
    const deleted = await this.backupRepository.deleteProfile(id);
    if (!deleted) throw new AppError("Backup not found", 404);
    await Promise.all(files.map((file) => unlink(file.file_path).catch(() => {})));
    await this.audit(actor, "delete_backup", "backup_profiles", id, { profileName: deleted.profileName });
    return { id };
  }

  async listScheduled(profileId) {
    await this.ensureTables();
    return this.backupRepository.listScheduled(profileId);
  }

  async prepareScheduledDownload(id) {
    await this.ensureTables();
    const backup = await this.backupRepository.findScheduledById(id);
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
    const deleted = await this.backupRepository.deleteScheduled(id);
    if (!deleted) throw new AppError("Scheduled backup not found", 404);
    await unlink(deleted.file_path).catch(() => {});
    await this.audit(actor, "delete_scheduled_backup", "scheduled_backups", id, { fileName: deleted.file_name });
    return { id };
  }

  async listRecovery() {
    await this.ensureTables();
    return this.recoveryRepository.listOperations();
  }

  async recordRecovery(type, fileName, actor, status, message, scope = null) {
    return this.recoveryRepository.recordOperation({
      type, fileName, scope, actorId: nullableUuid(actor?.sub), status, message,
    });
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
        const inspection = await inspectPostgresDump(filePath, this.backupRepository);
        if (!inspection.tableNames.length) throw new AppError("No public tables found in the dump", 400);
        await withRecoveryLock(async () => {
          if (inspection.isFullDatabase) await restoreFullDump(filePath);
          else for (const tableName of inspection.tableNames) await restoreTableDump(filePath, tableName, {}, this.recoveryRepository);
        }, this.recoveryRepository);
        scope = inspection.isFullDatabase ? "full" : `tables:${inspection.tableNames.join(",")}`;
        message = `PostgreSQL dump restored. ${inspection.dataEntryCount} data entries across ${inspection.tableNames.length} table(s).`;
      } else {
        await withRecoveryLock(
          () => restoreCsvFile(filePath, targetTable, this.recoveryRepository),
          this.recoveryRepository,
        );
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
      throw new AppError(safeMessage, error.statusCode || 500, {
        code: error.code,
        safeMessage,
        fieldErrors: error.fieldErrors,
      });
    } finally {
      await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}

export default DeveloperBackupService;
