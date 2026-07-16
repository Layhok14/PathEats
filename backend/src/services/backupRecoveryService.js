import { mkdtemp, readFile, rm, stat, writeFile } from "fs/promises";
import { spawn } from "child_process";
import os from "os";
import path from "path";

import BackupRepository from "../repositories/BackupRepository.js";
import RecoveryRepository from "../repositories/RecoveryRepository.js";
import AppError from "../utils/AppError.js";
import { postgresToolConfig } from "./backupService.js";
import { filterManagedSchemaRestoreList, inspectPostgresToc } from "../utils/backupToc.js";
import { parseCsv } from "../utils/csv.js";

const backupRepository = new BackupRepository();
const recoveryRepository = new RecoveryRepository();

export async function withRecoveryLock(operation, repository = recoveryRepository) {
  return repository.withAdvisoryLock(operation);
}

function runPostgresTool(command, args, options = {}) {
  const { env } = postgresToolConfig();
  const timeoutMs = options.timeoutMs ?? 300000;

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill("SIGTERM");
      reject(new AppError(`${command} timed out`, 504));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf-8");
      if (stdout.length > 1024 * 1024) stdout = stdout.slice(-1024 * 1024);
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf-8");
      if (stderr.length > 1024 * 1024) stderr = stderr.slice(-1024 * 1024);
    });

    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      const message =
        err.code === "ENOENT"
          ? `${command} was not found. Install PostgreSQL client tools.`
          : `${command} could not start: ${err.message}`;
      reject(new AppError(message, 500));
    });

    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        const errorLines = stderr
          .trim()
          .split(/\r?\n/)
          .filter((line) => /\b(error|fatal):/i.test(line));
        const detail = (errorLines.length > 0 ? errorLines : stderr.trim().split(/\r?\n/).slice(-4))
          .slice(-4)
          .join(" ");
        reject(new AppError(`${command} failed${detail ? `: ${detail}` : ""}`, 500));
      }
    });
  });
}

async function createManagedSchemaRestoreList(dumpFilePath) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "patheats-restore-list-"));
  const listPath = path.join(tempDir, "restore.list");
  try {
    const { stdout } = await runPostgresTool("pg_restore", ["--list", dumpFilePath]);
    const entries = filterManagedSchemaRestoreList(stdout);
    await writeFile(listPath, `${entries.join("\n")}\n`, "utf-8");
    return { tempDir, listPath };
  } catch (error) {
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
}

async function restoreDumpOverDatabase(dumpFilePath) {
  const restoreList = await createManagedSchemaRestoreList(dumpFilePath);
  try {
    await runPostgresTool("pg_restore", [
      "--clean",
      "--if-exists",
      "--exit-on-error",
      "--single-transaction",
      "--no-owner",
      "--no-privileges",
      "--use-list",
      restoreList.listPath,
      "--dbname",
      postgresToolConfig().databaseName,
      dumpFilePath,
    ]);
  } finally {
    await rm(restoreList.tempDir, { recursive: true, force: true }).catch(() => {});
  }
}

async function createPreRestoreSafetyDump() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "patheats-safety-"));
  const dumpPath = path.join(tempDir, "pre-restore-safety.dump");
  try {
    await runPostgresTool("pg_dump", [
      "--format=custom",
      "--schema=public",
      "--no-owner",
      "--no-privileges",
      "--exclude-table=public.spatial_ref_sys",
      "--file",
      dumpPath,
    ]);
    return { tempDir, dumpPath };
  } catch (error) {
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    throw new AppError(`Pre-restore safety backup failed; the database was not modified. ${error.message}`, 500);
  }
}

export async function restoreFullDump(dumpFilePath) {
  if (!dumpFilePath) throw new AppError("Dump file path is required", 400);
  await stat(dumpFilePath).catch(() => {
    throw new AppError("Backup file not found", 404, { details: { path: dumpFilePath } });
  });

  const safetyDump = await createPreRestoreSafetyDump();
  try {
    await restoreDumpOverDatabase(dumpFilePath);
  } catch (restoreError) {
    throw new AppError(`Recovery failed without committing database changes. ${restoreError.message}`, 500, {
      code: "RECOVERY_FAILED_NO_CHANGES",
      safeMessage: "Recovery failed. The transactional restore did not commit any database changes.",
    });
  } finally {
    await rm(safetyDump.tempDir, { recursive: true, force: true }).catch(() => {});
  }
}

export async function restoreTableDump(dumpFilePath, targetTable, options = {}, repository = recoveryRepository) {
  if (!dumpFilePath) throw new AppError("Dump file path is required", 400);
  if (!targetTable) throw new AppError("Table name is required for a partial restore", 400);

  await stat(dumpFilePath).catch(() => {
    throw new AppError("Backup file not found", 404, { details: { path: dumpFilePath } });
  });

  const tableArg = `--table=public.${targetTable}`;

  if (options.truncateFirst) {
    await repository.truncateTable(targetTable);
  }

  const restoreList = await createManagedSchemaRestoreList(dumpFilePath);
  try {
    await runPostgresTool("pg_restore", [
      "--clean",
      "--if-exists",
      "--exit-on-error",
      "--single-transaction",
      "--no-owner",
      "--no-privileges",
      tableArg,
      "--use-list",
      restoreList.listPath,
      "--dbname",
      postgresToolConfig().databaseName,
      dumpFilePath,
    ]);
  } finally {
    await rm(restoreList.tempDir, { recursive: true, force: true }).catch(() => {});
  }
}

export async function restoreCsvFile(csvFilePath, targetTable, repository = recoveryRepository) {
  if (!csvFilePath) throw new AppError("CSV file path is required", 400);
  if (!targetTable) throw new AppError("Table name is required for CSV restore", 400);

  await stat(csvFilePath).catch(() => {
    throw new AppError("CSV file not found", 404, { details: { path: csvFilePath } });
  });

  const csvContent = await readFile(csvFilePath, "utf-8");
  const { headers, records } = parseCsv(csvContent);
  await repository.restoreCsvRecords(targetTable, headers, records);
}

export async function inspectPostgresDump(dumpFilePath, repository = backupRepository) {
  await stat(dumpFilePath).catch(() => {
    throw new AppError("File not found", 404, { details: { path: dumpFilePath } });
  });

  const { stdout } = await runPostgresTool("pg_restore", [
    "--list",
    dumpFilePath,
  ]);

  return inspectPostgresToc(stdout, await repository.getPublicTableNames());
}
