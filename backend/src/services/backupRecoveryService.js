import { stat, readFile } from "fs/promises";
import { spawn } from "child_process";

import { pool } from "../config/db.js";
import AppError from "../utils/AppError.js";
import { postgresToolConfig } from "./backupService.js";

const quoteIdent = (identifier) => `"${String(identifier).replace(/"/g, '""')}"`;

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

export async function restoreFullDump(dumpFilePath) {
  if (!dumpFilePath) throw new AppError("Dump file path is required", 400);
  await stat(dumpFilePath).catch(() => {
    throw new AppError(`Backup file not found at ${dumpFilePath}`, 404);
  });

  await pool.query("SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = current_database() AND pid <> pg_backend_pid()");

  await runPostgresTool("pg_restore", [
    "--clean",
    "--if-exists",
    "--no-owner",
    "--no-privileges",
    "--dbname",
    postgresToolConfig().databaseName,
    dumpFilePath,
  ]);
}

export async function restoreTableDump(dumpFilePath, targetTable, options = {}) {
  if (!dumpFilePath) throw new AppError("Dump file path is required", 400);
  if (!targetTable) throw new AppError("Table name is required for a partial restore", 400);

  await stat(dumpFilePath).catch(() => {
    throw new AppError(`Backup file not found at ${dumpFilePath}`, 404);
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
    "--no-owner",
    "--no-privileges",
    "--data-only",
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
    throw new AppError(`CSV file not found at ${csvFilePath}`, 404);
  });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`TRUNCATE TABLE ${quoteIdent(targetTable)} RESTART IDENTITY CASCADE`);

    const csvContent = await readFile(csvFilePath, "utf-8");
    const copyQuery = `COPY ${quoteIdent(targetTable)} FROM STDIN WITH (FORMAT CSV, HEADER true, NULL '\\N')`;
    await client.query(copyQuery, [csvContent]);

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
    throw new AppError(`File not found at ${dumpFilePath}`, 404);
  });

  const { stdout } = await runPostgresTool("pg_restore", [
    "--list",
    dumpFilePath,
  ]);

  const lines = stdout.split(/\r?\n/).filter((line) => line.trim() && !line.startsWith(";"));
  const tables = new Set();
  const entries = [];

  for (const line of lines) {
    const parts = line.split(/\s+/);
    const schemaTable = parts[parts.length - 1] || "";
    if (schemaTable.startsWith("public.")) {
      const tableName = schemaTable.slice(7);
      tables.add(tableName);
      entries.push({
        raw: line,
        schemaTable,
        type: parts[0] || "",
      });
    }
  }

  return {
    tableNames: [...tables],
    entryCount: entries.length,
    entries,
    raw: stdout,
  };
}
