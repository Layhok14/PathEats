import { mkdtemp, readFile, rm, stat } from "fs/promises";
import { spawn } from "child_process";
import os from "os";
import path from "path";

import { pool } from "../config/db.js";
import AppError from "../utils/AppError.js";
import { getPublicTableNames, postgresToolConfig } from "./backupService.js";
import { inspectPostgresToc } from "../utils/backupToc.js";
import { parseCsv } from "../utils/csv.js";

const quoteIdent = (identifier) => `"${String(identifier).replace(/"/g, '""')}"`;
let recoveryInProgress = false;

export async function withRecoveryLock(operation) {
  if (recoveryInProgress) {
    throw new AppError("Another recovery operation is already running", 409, {
      code: "RECOVERY_IN_PROGRESS",
      safeMessage: "Another recovery is already running. Wait for it to finish before trying again.",
    });
  }
  recoveryInProgress = true;
  try {
    return await operation();
  } finally {
    recoveryInProgress = false;
  }
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

async function restoreDumpOverDatabase(dumpFilePath) {
  await runPostgresTool("pg_restore", [
    "--clean",
    "--if-exists",
    "--exit-on-error",
    "--single-transaction",
    "--no-owner",
    "--no-privileges",
    "--dbname",
    postgresToolConfig().databaseName,
    dumpFilePath,
  ]);
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

export async function restoreTableDump(dumpFilePath, targetTable, options = {}) {
  if (!dumpFilePath) throw new AppError("Dump file path is required", 400);
  if (!targetTable) throw new AppError("Table name is required for a partial restore", 400);

  await stat(dumpFilePath).catch(() => {
    throw new AppError("Backup file not found", 404, { details: { path: dumpFilePath } });
  });

  const tableArg = `--table=public.${targetTable}`;

  if (options.truncateFirst) {
    const client = await pool.connect();
    try {
      await client.query(`TRUNCATE TABLE ${quoteIdent(targetTable)} RESTART IDENTITY CASCADE`);
    } finally {
      client.release();
    }
  }

  await runPostgresTool("pg_restore", [
    "--clean",
    "--if-exists",
    "--exit-on-error",
    "--single-transaction",
    "--no-owner",
    "--no-privileges",
    tableArg,
    "--dbname",
    postgresToolConfig().databaseName,
    dumpFilePath,
  ]);
}

export async function restoreCsvFile(csvFilePath, targetTable) {
  if (!csvFilePath) throw new AppError("CSV file path is required", 400);
  if (!targetTable) throw new AppError("Table name is required for CSV restore", 400);

  await stat(csvFilePath).catch(() => {
    throw new AppError("CSV file not found", 404, { details: { path: csvFilePath } });
  });

  const client = await pool.connect();
  try {
    const csvContent = await readFile(csvFilePath, "utf-8");
    const { headers, records } = parseCsv(csvContent);
    const [columnResult, primaryKeyResult] = await Promise.all([
      client.query(
        `SELECT column_name
         FROM information_schema.columns
         WHERE table_schema = 'public'
           AND table_name = $1
           AND is_generated = 'NEVER'`,
        [targetTable]
      ),
      client.query(
        `SELECT attribute.attname AS column_name
         FROM pg_index index_info
         JOIN pg_class table_info ON table_info.oid = index_info.indrelid
         JOIN pg_namespace namespace_info ON namespace_info.oid = table_info.relnamespace
         JOIN unnest(index_info.indkey) WITH ORDINALITY AS key_info(attnum, position) ON TRUE
         JOIN pg_attribute attribute ON attribute.attrelid = table_info.oid AND attribute.attnum = key_info.attnum
         WHERE namespace_info.nspname = 'public'
           AND table_info.relname = $1
           AND index_info.indisprimary
         ORDER BY key_info.position`,
        [targetTable]
      ),
    ]);
    const allowedColumns = new Set(columnResult.rows.map((row) => row.column_name));
    if (allowedColumns.size === 0) throw new AppError(`Target table "${targetTable}" does not exist`, 400);
    const invalidColumns = headers.filter((header) => !allowedColumns.has(header));
    if (invalidColumns.length > 0) {
      throw new AppError(`CSV contains unsupported columns: ${invalidColumns.join(", ")}`, 400);
    }

    const primaryKey = primaryKeyResult.rows.map((row) => row.column_name);
    const quotedHeaders = headers.map(quoteIdent);
    const updateColumns = headers.filter((header) => !primaryKey.includes(header));
    const conflictClause = primaryKey.length > 0 && primaryKey.every((column) => headers.includes(column))
      ? updateColumns.length > 0
        ? `ON CONFLICT (${primaryKey.map(quoteIdent).join(", ")}) DO UPDATE SET ${updateColumns.map((column) => `${quoteIdent(column)} = EXCLUDED.${quoteIdent(column)}`).join(", ")}`
        : `ON CONFLICT (${primaryKey.map(quoteIdent).join(", ")}) DO NOTHING`
      : "ON CONFLICT DO NOTHING";

    await client.query("BEGIN");
    for (const record of records) {
      const values = record.map((value) => {
        if (value === "\\N") return null;
        if (value === "\\\\N") return "\\N";
        return value;
      });
      const placeholders = values.map((_, index) => `$${index + 1}`);
      await client.query(
        `INSERT INTO public.${quoteIdent(targetTable)} (${quotedHeaders.join(", ")})
         VALUES (${placeholders.join(", ")})
         ${conflictClause}`,
        values
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

export async function inspectPostgresDump(dumpFilePath) {
  await stat(dumpFilePath).catch(() => {
    throw new AppError("File not found", 404, { details: { path: dumpFilePath } });
  });

  const { stdout } = await runPostgresTool("pg_restore", [
    "--list",
    dumpFilePath,
  ]);

  const client = await pool.connect();
  try {
    return inspectPostgresToc(stdout, await getPublicTableNames(client));
  } finally {
    client.release();
  }
}
