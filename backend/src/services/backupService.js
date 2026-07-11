import { spawn } from "child_process";
import { mkdtemp, rm, stat, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { createHash } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { pool } from "../config/db.js";
import db from "../config/db.js";
import AppError from "../utils/AppError.js";

const SAFE_IDENTIFIER_PATTERN = /^[a-z_][a-z0-9_]*$/i;
const BACKUP_METHODS = new Set(["Entire Database", "Specific Tables", "Specific Rows"]);
const SCHEDULE_UNITS = new Set(["Minutes", "Hours", "Days", "Months"]);
export const LOGICAL_BACKUP_FORMAT = "patheats-logical-backup";
export const LOGICAL_BACKUP_VERSION = 1;
const PREFERRED_BACKUP_TABLE_ORDER = [
  "role",
  "users",
  "refresh_tokens",
  "audit_log",
  "session_events",
  "user_preferences",
  "user_profile_images",
  "place_categories",
  "places",
  "place_images",
  "place_hours",
  "menu_items",
  "place_menu_items",
  "menu_item_images",
  "routes",
  "bookmarks",
  "search_history",
  "reviews",
  "onboarding_config",
  "query_presets",
  "database_activity_log",
  "backup_profiles",
  "recovery_operations",
  "scheduled_backups",
];

export const BACKUP_STORAGE_DIR =
  process.env.BACKUP_STORAGE_DIR || path.resolve(__dirname, "../../data/backup");

const quoteIdent = (identifier) => `"${String(identifier).replace(/"/g, '""')}"`;

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function safeDownloadName(value) {
  const name = String(value || "backup")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return name || "backup";
}

export function validateIdentifier(identifier, label) {
  if (!SAFE_IDENTIFIER_PATTERN.test(String(identifier ?? ""))) {
    throw new AppError(`${label} contains unsafe characters`, 400);
  }
}

export function parseScope(scope = "full") {
  return String(scope || "full")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const delimiterIndex = part.indexOf(":");
      if (delimiterIndex === -1) {
        acc[part] = "";
      } else {
        acc[part.slice(0, delimiterIndex)] = part.slice(delimiterIndex + 1);
      }
      return acc;
    }, {});
}

export function validateRowCondition(condition = "") {
  const normalized = String(condition || "").trim();
  if (!normalized) return "";
  if (!/^WHERE\s+/i.test(normalized)) {
    throw new AppError("A row filter must start with WHERE", 400);
  }
  if (/;|--|\/\*|\*\//.test(normalized)) {
    throw new AppError("Row filters cannot contain statement separators or comments", 400);
  }
  if (/\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|GRANT|REVOKE|COPY|CALL|DO|EXECUTE)\b/i.test(normalized)) {
    throw new AppError("Row filter contains a prohibited SQL keyword", 400);
  }
  return normalized;
}

export async function getPublicTableNames(client) {
  const result = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);

  const tableNames = [...new Set(result.rows.map((row) => row.table_name))];
  const existing = new Set(tableNames);
  const preferred = PREFERRED_BACKUP_TABLE_ORDER.filter((tableName) => existing.has(tableName));
  const remaining = tableNames.filter((tableName) => !PREFERRED_BACKUP_TABLE_ORDER.includes(tableName));
  return [...preferred, ...remaining];
}

export async function validateBackupProfile(profile) {
  if (!BACKUP_METHODS.has(profile.method)) throw new AppError("Invalid backup method", 400);
  if (profile.method === "Entire Database") {
    const parts = parseScope(profile.scope || "schema:public");
    if (parts.schema && parts.schema !== "public") throw new AppError("Only the public schema can be backed up", 400);
    return;
  }
  const client = await pool.connect();
  try {
    const availableTables = await getPublicTableNames(client);
    const resolved = resolveBackupTables(profile.scope, availableTables);
    if (profile.method === "Specific Tables" && resolved.tableNames.length === 0) {
      throw new AppError("Select at least one table", 400);
    }
    if (profile.method === "Specific Rows") {
      const parts = parseScope(profile.scope);
      if (!parts.table) throw new AppError("Select a table for row backup", 400);
      validateRowCondition(parts.condition || "");
    }
  } finally {
    client.release();
  }
}

export function resolveBackupTables(scope, availableTables) {
  const available = new Set(availableTables);
  const parts = parseScope(scope);

  if (parts.tables) {
    const tableNames = parts.tables
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);
    if (tableNames.length === 0 || tableNames.includes("all")) {
      return { tableNames: availableTables, filters: new Map() };
    }
    const validTables = [];
    tableNames.forEach((tableName) => {
      validateIdentifier(tableName, "Backup table");
      if (available.has(tableName)) {
        validTables.push(tableName);
      }
    });
    if (validTables.length === 0) {
      throw new AppError("None of the specified backup tables exist in the database", 400);
    }
    return { tableNames: validTables, filters: new Map() };
  }

  if (parts.table) {
    const tableName = parts.table.trim();
    validateIdentifier(tableName, "Backup table");
    if (!available.has(tableName)) throw new AppError(`Backup table "${tableName}" does not exist`, 400);
    return { tableNames: [tableName], filters: new Map([[tableName, parts.filter || "all"]]) };
  }

  return { tableNames: availableTables, filters: new Map() };
}

export function postgresToolConfig() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new AppError("DATABASE_URL is not configured for PostgreSQL backup tools", 500);
  }

  let parsed;
  try {
    parsed = new URL(databaseUrl);
  } catch {
    throw new AppError("DATABASE_URL is not a valid PostgreSQL connection string", 500);
  }

  const databaseName = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
  if (!databaseName) {
    throw new AppError("DATABASE_URL does not include a database name", 500);
  }

  return {
    databaseName,
    env: {
      ...process.env,
      PGHOST: parsed.hostname,
      PGPORT: parsed.port || "5432",
      PGUSER: decodeURIComponent(parsed.username),
      PGPASSWORD: decodeURIComponent(parsed.password),
      PGDATABASE: databaseName,
      PGSSLMODE: process.env.PGSSLMODE || parsed.searchParams.get("sslmode") || "prefer",
    },
  };
}

export function runPostgresTool(command, args, options = {}) {
  const { env } = postgresToolConfig();
  const timeoutMs = options.timeoutMs ?? 120000;

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
      const message = err.code === "ENOENT"
        ? `${command} executable was not found. Install PostgreSQL client tools on the backend machine.`
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

export async function postgresDumpArgsForProfile(profile) {
  if (profile.method === "Specific Rows") {
    throw new AppError("PostgreSQL dump backups do not support row-level filters. Use Specific Tables or Row Level CSV repair.", 400);
  }

  if (profile.method === "Entire Database") {
    return ["--schema=public"];
  }

  if (profile.method !== "Specific Tables") {
    throw new AppError("Unsupported PostgreSQL dump backup method", 400);
  }

  const client = await pool.connect();
  try {
    const availableTables = await getPublicTableNames(client);
    const { tableNames } = resolveBackupTables(profile.scope, availableTables);
    if (tableNames.length === 0) {
      throw new AppError("Select at least one table for this backup profile", 400);
    }
    return tableNames.map((tableName) => `--table=public.${tableName}`);
  } finally {
    client.release();
  }
}

export function quoteCsvField(value) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function createPostgresDumpFile(profile) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "patheats-pgdump-"));
  const dumpPath = path.join(tempDir, "backup.dump");
  const scopeArgs = await postgresDumpArgsForProfile(profile);

  try {
    await runPostgresTool("pg_dump", [
      "--format=custom",
      "--no-owner",
      "--no-privileges",
      "--no-comments",
      "--file",
      dumpPath,
      ...scopeArgs,
    ]);

    const fileStat = await stat(dumpPath);
    return { tempDir, dumpPath, sizeBytes: fileStat.size };
  } catch (err) {
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    throw err;
  }
}

export async function createPostgresCsvFile(profile) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "patheats-csv-"));
  const csvPath = path.join(tempDir, "backup.csv");
  const parts = parseScope(profile.scope);
  const tableName = parts.table;
  if (!tableName) throw new AppError("No table specified for Specific Rows backup", 400);
  validateIdentifier(tableName, "Backup table");

  const condition = validateRowCondition(parts.condition || "");
  const quotedTable = quoteIdent(tableName);
  const selectQuery = condition
    ? `SELECT * FROM ${quotedTable} ${condition}`
    : `SELECT * FROM ${quotedTable}`;

  try {
    const result = await db.query(selectQuery);
    const rows = result.rows;
    if (rows.length === 0) {
      await writeFile(csvPath, "");
      return { tempDir, dumpPath: csvPath, sizeBytes: 0 };
    }

    const headers = Object.keys(rows[0]);
    const csvLines = [headers.map(quoteCsvField).join(",")];
    for (const row of rows) {
      csvLines.push(headers.map((h) => {
        if (row[h] === null || row[h] === undefined) return "\\N";
        return quoteCsvField(String(row[h]));
      }).join(","));
    }
    await writeFile(csvPath, csvLines.join("\n"), "utf-8");
    const fileStat = await stat(csvPath);
    return { tempDir, dumpPath: csvPath, sizeBytes: fileStat.size };
  } catch (err) {
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    throw err;
  }
}

async function getTableMetadata(client, tableName) {
  const [columnsResult, primaryKeyResult] = await Promise.all([
    client.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = $1
       ORDER BY ordinal_position`,
      [tableName]
    ),
    client.query(
      `SELECT a.attname AS column_name
       FROM pg_index i
       JOIN pg_class t ON t.oid = i.indrelid
       JOIN pg_namespace n ON n.oid = t.relnamespace
       JOIN unnest(i.indkey) WITH ORDINALITY AS keys(attnum, ordinality) ON TRUE
       JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = keys.attnum
       WHERE n.nspname = 'public' AND t.relname = $1 AND i.indisprimary
       ORDER BY keys.ordinality`,
      [tableName]
    ),
  ]);
  return {
    columns: columnsResult.rows.map((row) => row.column_name),
    primaryKey: primaryKeyResult.rows.map((row) => row.column_name),
  };
}

function logicalChecksum(payload) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

export async function createLogicalBackupFile(profile) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "patheats-logical-"));
  const backupPath = path.join(tempDir, "backup.json");
  const client = await pool.connect();

  try {
    const availableTables = await getPublicTableNames(client);
    const { tableNames } = resolveBackupTables(profile.scope, availableTables);
    const parts = parseScope(profile.scope);
    const rowCondition = profile.method === "Specific Rows"
      ? validateRowCondition(parts.condition || "")
      : "";
    const tables = [];

    await client.query("BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY");
    for (const tableName of tableNames) {
      validateIdentifier(tableName, "Backup table");
      const metadata = await getTableMetadata(client, tableName);
      const condition = profile.method === "Specific Rows" && tableName === parts.table ? rowCondition : "";
      const result = await client.query(
        `SELECT COALESCE(jsonb_agg(to_jsonb(source_row)), '[]'::jsonb) AS rows
         FROM (SELECT * FROM public.${quoteIdent(tableName)} ${condition}) source_row`
      );
      const rows = result.rows[0]?.rows || [];
      tables.push({
        name: tableName,
        columns: metadata.columns,
        primaryKey: metadata.primaryKey,
        rowCount: rows.length,
        rows,
      });
    }
    await client.query("COMMIT");

    const payload = {
      format: LOGICAL_BACKUP_FORMAT,
      version: LOGICAL_BACKUP_VERSION,
      method: profile.method,
      scope: profile.scope || "full",
      createdAt: new Date().toISOString(),
      tables,
    };
    const artifact = { ...payload, checksum: logicalChecksum(payload) };
    await writeFile(backupPath, JSON.stringify(artifact), "utf-8");
    const fileStat = await stat(backupPath);
    return { tempDir, dumpPath: backupPath, sizeBytes: fileStat.size };
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

export function verifyLogicalBackupArtifact(artifact) {
  if (!artifact || artifact.format !== LOGICAL_BACKUP_FORMAT || artifact.version !== LOGICAL_BACKUP_VERSION) {
    throw new AppError("Unsupported logical backup format", 400);
  }
  if (!Array.isArray(artifact.tables) || artifact.tables.length === 0) {
    throw new AppError("Logical backup contains no tables", 400);
  }
  const { checksum, ...payload } = artifact;
  if (!checksum || logicalChecksum(payload) !== checksum) {
    throw new AppError("Logical backup checksum does not match its contents", 400);
  }
  return artifact;
}

export async function generateBackupForProfile(profile) {
  const isPostgresDump = profile.method === "Entire Database";
  const { tempDir, dumpPath, sizeBytes } = isPostgresDump
    ? await createPostgresDumpFile(profile)
    : await createLogicalBackupFile(profile);
  return {
    tempDir,
    dumpPath,
    sizeBytes,
    isCsv: false,
    format: isPostgresDump ? "postgres-custom" : "patheats-logical-json",
    extension: isPostgresDump ? "dump" : "json",
    contentType: isPostgresDump ? "application/octet-stream" : "application/json",
  };
}

export async function ensureBackupStorageDir() {
  if (!existsSync(BACKUP_STORAGE_DIR)) {
    await mkdir(BACKUP_STORAGE_DIR, { recursive: true });
  }
}

export { BACKUP_METHODS, SCHEDULE_UNITS, SAFE_IDENTIFIER_PATTERN, PREFERRED_BACKUP_TABLE_ORDER, quoteIdent };
