import { copyFile, rm } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import BackupRepository from "../repositories/BackupRepository.js";
import {
  BACKUP_STORAGE_DIR,
  ensureBackupStorageDir,
  formatBytes,
  generateBackupForProfile,
  safeDownloadName,
} from "./backupService.js";

const SCHEDULER_TICK_MS = 60 * 1000;
const backupRepository = new BackupRepository();
let schedulerTimer = null;
let running = false;

async function ensureScheduledBackupsTable() {
  if (!await backupRepository.scheduledBackupsTableExists()) {
    console.warn("[backup] scheduled_backups table missing; run database migrations before enabling schedules.");
    return false;
  }
  return true;
}

async function claimDueProfiles() {
  return backupRepository.claimDueProfiles(5);
}

async function processDueProfiles() {
  if (running) return;
  running = true;
  try {
    if (!await ensureScheduledBackupsTable()) return;
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
  let permanentPath = null;
  try {
    const result = await generateBackupForProfile(profile);
    tempDir = result.tempDir;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${safeDownloadName(profile.profile_name)}-${timestamp}.${result.extension}`;
    permanentPath = path.join(BACKUP_STORAGE_DIR, fileName);
    await copyFile(result.dumpPath, permanentPath);
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    tempDir = null;

    const size = formatBytes(result.sizeBytes);
    await backupRepository.recordScheduledSuccess(profile, {
      fileName,
      filePath: permanentPath,
      size,
      format: result.format,
    });
  } catch (err) {
    await backupRepository.recordScheduledFailure(profile, err.message).catch(() => {});
    if (tempDir) await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    if (permanentPath) await rm(permanentPath, { force: true }).catch(() => {});
  }
}

export function startBackupScheduler() {
  if (schedulerTimer) return;
  ensureScheduledBackupsTable()
    .then(async (tableExists) => {
      if (!tableExists) return false;
      await ensureBackupStorageDir();
      return true;
    })
    .then((ready) => {
      if (!ready) return;
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
    if (!await ensureScheduledBackupsTable()) return;
    const files = await backupRepository.listCompletedScheduledFiles();
    for (const file of files) {
      if (!existsSync(file.file_path)) await backupRepository.deleteScheduledRecord(file.id);
    }
  } catch (err) {
    console.error("[BackupScheduler] Cleanup error:", err.message);
  }
}
