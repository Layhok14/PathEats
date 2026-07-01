import { spawn } from "child_process";
import { createReadStream, createWriteStream } from "fs";
import { mkdtemp, rm, stat, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";
import db from "../config/db.js";
import { pool } from "../config/db.js";
import AppError from "../utils/AppError.js";
import {
  getUserManagementOverview,
  getVendorManagementOverview,
} from "../services/AdminService.js";

const MAX_RECOVERY_FILE_BYTES = 100 * 1024 * 1024;
const REQUIRED_RECOVERY_CONFIRMATION = "RECOVER";
const POSTGRES_DUMP_CONFIRMATION = "RESTORE POSTGRES DUMP";
const RECOVERY_TYPES = new Set(["PostgreSQL Dump", "Row Level CSV"]);
const BACKUP_METHODS = new Set(["Entire Database", "Specific Tables", "Specific Rows"]);
const SCHEDULE_UNITS = new Set(["Hours", "Days", "Months"]);
const SAFE_IDENTIFIER_PATTERN = /^[a-z_][a-z0-9_]*$/i;
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
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_RECOVERY_FILE_BYTES },
  fileFilter: (_req, file, cb) => {
    const ext = file.originalname.split(".").pop()?.toLowerCase();
    if (["dump", "backup", "pgdump", "csv"].includes(ext)) return cb(null, true);
    cb(new AppError("Only .dump, .backup, .pgdump, and .csv files are allowed", 400));
  },
});

const quoteIdent = (identifier) => `"${identifier.replace(/"/g, '""')}"`;

function formatBytes(bytes) {
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

function safeDownloadName(value) {
  const name = String(value || "backup")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return name || "backup";
}

function parseScope(scope = "full") {
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

async function getPublicTableNames(client) {
  const result = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);

  const tableNames = result.rows.map((row) => row.table_name);
  const existing = new Set(tableNames);
  const preferred = PREFERRED_BACKUP_TABLE_ORDER.filter((tableName) => existing.has(tableName));
  const remaining = tableNames.filter((tableName) => !PREFERRED_BACKUP_TABLE_ORDER.includes(tableName));
  return [...preferred, ...remaining];
}

function resolveBackupTables(scope, availableTables) {
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
    tableNames.forEach((tableName) => {
      validateIdentifier(tableName, "Backup table");
      if (!available.has(tableName)) throw new AppError(`Backup table "${tableName}" does not exist`, 400);
    });
    return { tableNames, filters: new Map() };
  }

  if (parts.table) {
    const tableName = parts.table.trim();
    validateIdentifier(tableName, "Backup table");
    if (!available.has(tableName)) throw new AppError(`Backup table "${tableName}" does not exist`, 400);
    return { tableNames: [tableName], filters: new Map([[tableName, parts.filter || "all"]]) };
  }

  return { tableNames: availableTables, filters: new Map() };
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values.map((value) => value.trim());
}

function validateIdentifier(identifier, label) {
  if (!SAFE_IDENTIFIER_PATTERN.test(String(identifier ?? ""))) {
    throw new AppError(`${label} contains unsafe characters`, 400);
  }
}

function validateRecoveryContent(_content, type) {
  const issues = [];
  if (!RECOVERY_TYPES.has(type)) {
    issues.push("Invalid recovery type.");
  }
  return issues;
}

function expectedRecoveryConfirmation(type) {
  return type === "PostgreSQL Dump" ? POSTGRES_DUMP_CONFIRMATION : REQUIRED_RECOVERY_CONFIRMATION;
}

function postgresToolConfig() {
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

function runPostgresTool(command, args, options = {}) {
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
        const detail = stderr.trim().split(/\r?\n/).slice(-4).join(" ");
        reject(new AppError(`${command} failed${detail ? `: ${detail}` : ""}`, 500));
      }
    });
  });
}

async function postgresDumpArgsForProfile(profile) {
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

async function createPostgresDumpFile(profile) {
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

async function createPostgresCsvFile(profile) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "patheats-csv-"));
  const csvPath = path.join(tempDir, "backup.csv");
  const parts = parseScope(profile.scope);
  const tableName = parts.table;
  if (!tableName) throw new AppError("No table specified for Specific Rows backup", 400);
  validateIdentifier(tableName, "Backup table");

  const condition = parts.condition || "";
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
      csvLines.push(headers.map((h) => quoteCsvField(String(row[h] ?? ""))).join(","));
    }
    await writeFile(csvPath, csvLines.join("\n"), "utf-8");
    const fileStat = await stat(csvPath);
    return { tempDir, dumpPath: csvPath, sizeBytes: fileStat.size };
  } catch (err) {
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    throw err;
  }
}

function quoteCsvField(value) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function hasPostgresDumpSignature(buffer) {
  return buffer.length >= 5 && buffer.subarray(0, 5).toString("ascii") === "PGDMP";
}

function validatePostgresDumpList(listOutput) {
  const lines = listOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith(";"));

  if (lines.length === 0) {
    throw new AppError("PostgreSQL dump contains no restore entries", 400);
  }

  const prohibited = lines.filter((line) =>
    /\b(DATABASE|ACL|POLICY|PUBLICATION|SUBSCRIPTION|EVENT TRIGGER|FOREIGN DATA WRAPPER|SERVER)\b/i.test(line)
  );
  if (prohibited.length > 0) {
    throw new AppError("PostgreSQL dump contains unsupported high-risk object entries", 400);
  }

  const dataLines = lines.filter((line) => /\b(TABLE DATA|SEQUENCE SET)\b/i.test(line));
  if (dataLines.length === 0) {
    throw new AppError("PostgreSQL dump contains no table data to restore", 400);
  }

  const outsidePublic = dataLines.filter((line) => !/\b(TABLE DATA|SEQUENCE SET)\s+public\s+/i.test(line));
  if (outsidePublic.length > 0) {
    throw new AppError("PostgreSQL dump contains data outside the public schema", 400);
  }

  return { entryCount: lines.length, dataEntryCount: dataLines.length };
}

async function writeRecoveryTempFile(file) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "patheats-pgrestore-"));
  const dumpPath = path.join(tempDir, "recovery.dump");
  await writeFile(dumpPath, file.buffer, { flag: "wx" });
  return { tempDir, dumpPath };
}

async function inspectPostgresDump(dumpPath) {
  const { stdout } = await runPostgresTool("pg_restore", ["--list", dumpPath]);
  return validatePostgresDumpList(stdout);
}

async function restorePostgresDump(dumpPath) {
  const { databaseName } = postgresToolConfig();
  await runPostgresTool("pg_restore", [
    "--data-only",
    "--schema=public",
    "--no-owner",
    "--no-privileges",
    "--single-transaction",
    "--exit-on-error",
    `--dbname=${databaseName}`,
    dumpPath,
  ], { timeoutMs: 300000 });
}

const router = Router();

const devAdminBypass = (req, res, next) => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const isBypassEnabled = process.env.PATHEAT_DEV_BYPASS === "true";

  if (isDevelopment && isBypassEnabled) {
    console.warn("[BYPASS] Developer bypass active — hardcoded DEVELOPER_ADMIN session");
    req.user = {
      sub: "dev-admin",
      email: "dev@patheat.app",
      role_scope: "DEVELOPER_ADMIN",
      role: "DEVELOPER_ADMIN",
    };
    return next();
  }

  return authMiddleware(req, res, next);
};

router.use(devAdminBypass);
router.use(restrictToRoles("GLOBAL_ADMIN", "DEVELOPER_ADMIN"));
const developerAdminOnly = restrictToRoles("DEVELOPER_ADMIN");
const devOrGlobalAdmin = restrictToRoles("DEVELOPER_ADMIN", "GLOBAL_ADMIN");

// ── Ensure tables ───────────────────────────────────────────────────────────

const ensureQueryPresetsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS query_presets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      query_string TEXT NOT NULL,
      category VARCHAR(20) NOT NULL DEFAULT 'viewing'
        CHECK (category IN ('viewing', 'altering', 'deleting', 'updating', 'creating')),
      is_system_preset BOOLEAN DEFAULT FALSE,
      created_by UUID REFERENCES users(id) ON DELETE SET NULL,
      last_used_at TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`
    DELETE FROM query_presets
    WHERE is_system_preset = TRUE
      AND (
        query_string ~* '\\m(INSERT|UPDATE|DELETE|DROP|TRUNCATE|MERGE|CREATE)\\M'
        OR title IN (
          'Clear Old Search History',
          'Delete Expired Activity Logs',
          'Cleanup Orphaned Reviews',
          'Create Test Category',
          'Update Stall Ratings'
        )
      )
  `);
  await pool.query(`
    DELETE FROM query_presets qp
    USING query_presets older
    WHERE qp.is_system_preset = TRUE
      AND older.is_system_preset = TRUE
      AND qp.title = older.title
      AND (qp.created_at, qp.id::text) > (older.created_at, older.id::text)
  `);
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_query_presets_system_title
    ON query_presets (title)
    WHERE is_system_preset = TRUE
  `);
  await pool.query(`
    INSERT INTO query_presets (title, query_string, category, is_system_preset) VALUES
      ('Table Sizes', 'SELECT relname AS table_name, n_live_tup AS row_count, pg_size_pretty(pg_total_relation_size(relid)) AS total_size FROM pg_stat_user_tables ORDER BY n_live_tup DESC', 'viewing', TRUE),
      ('Recent Registrations', 'SELECT id, email, first_name, last_name, role_scope, created_at FROM users WHERE created_at > NOW() - INTERVAL ''7 days'' ORDER BY created_at DESC', 'viewing', TRUE),
      ('Top Rated Stalls', 'SELECT p.id, p.name, p.rating_avg, p.rating_count, c.name AS category FROM places p JOIN place_categories c ON c.id = p.category_id WHERE p.rating_count >= 3 ORDER BY p.rating_avg DESC LIMIT 20', 'viewing', TRUE),
      ('Unhealthy Indexes', 'SELECT schemaname, tablename, indexname, idx_scan FROM pg_stat_user_indexes WHERE idx_scan < 10 ORDER BY idx_scan ASC LIMIT 20', 'viewing', TRUE),
      ('Review Distribution', 'SELECT rating, COUNT(*)::int AS count FROM reviews GROUP BY rating ORDER BY rating', 'viewing', TRUE),
      ('Stalls per Category', 'SELECT c.name AS category, COUNT(p.id)::int AS stall_count FROM place_categories c LEFT JOIN places p ON p.category_id = c.id GROUP BY c.id, c.name ORDER BY stall_count DESC', 'viewing', TRUE),
      ('Banned Users', 'SELECT id, email, role_scope, created_at FROM users WHERE is_banned = TRUE ORDER BY created_at DESC', 'viewing', TRUE),
      ('Idle Connections', 'SELECT pid, usename, application_name, state, query, state_change FROM pg_stat_activity WHERE state = ''idle'' ORDER BY state_change DESC LIMIT 20', 'viewing', TRUE),
      ('Lock Waits', 'SELECT blocked.pid AS blocked_pid, blocked.query AS blocked_query, blocking.pid AS blocking_pid, blocking.query AS blocking_query FROM pg_locks blocked_l JOIN pg_stat_activity blocked ON blocked.pid = blocked_l.pid JOIN pg_locks blocking_l ON blocking_l.locktype = blocked_l.locktype AND blocking_l.database IS NOT DISTINCT FROM blocked_l.database AND blocking_l.relation IS NOT DISTINCT FROM blocked_l.relation AND blocking_l.pid != blocked_l.pid JOIN pg_stat_activity blocking ON blocking.pid = blocking_l.pid WHERE NOT blocked_l.granted', 'viewing', TRUE),
      ('Dead Tuples', 'SELECT relname, n_dead_tup, n_live_tup, round(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_pct FROM pg_stat_user_tables WHERE n_dead_tup > 0 ORDER BY n_dead_tup DESC', 'viewing', TRUE),
      ('Recent Admin Actions', 'SELECT id, admin_id, action, target_type, target_id, details, created_at FROM audit_log ORDER BY created_at DESC LIMIT 50', 'viewing', TRUE),
      ('Active User Sessions', 'SELECT pid, usename, application_name, state, query, state_change FROM pg_stat_activity WHERE state = ''active'' ORDER BY state_change DESC LIMIT 20', 'viewing', TRUE),
      ('Old Search History Count', 'SELECT COUNT(*)::int AS old_search_rows FROM search_history WHERE created_at < NOW() - INTERVAL ''30 days''', 'viewing', TRUE),
      ('Expired Activity Log Count', 'SELECT COUNT(*)::int AS expired_activity_rows FROM database_activity_log WHERE executed_at < NOW() - INTERVAL ''90 days''', 'viewing', TRUE),
      ('Orphaned Review Check', 'SELECT r.id, r.place_id, r.user_id, r.created_at FROM reviews r LEFT JOIN places p ON p.id = r.place_id WHERE p.id IS NULL ORDER BY r.created_at DESC LIMIT 50', 'viewing', TRUE),
      ('VACUUM Full Database', 'VACUUM', 'altering', TRUE),
      ('VACUUM ANALYZE', 'VACUUM ANALYZE', 'altering', TRUE),
      ('ANALYZE Full Database', 'ANALYZE', 'updating', TRUE),
      ('Stall Rating Drift Check', 'SELECT p.id, p.name, p.rating_avg AS stored_rating, COALESCE(AVG(r.rating), 0) AS calculated_rating, p.rating_count AS stored_count, COUNT(r.id)::int AS calculated_count FROM places p LEFT JOIN reviews r ON r.place_id = p.id GROUP BY p.id, p.name, p.rating_avg, p.rating_count HAVING p.rating_avg IS DISTINCT FROM COALESCE(AVG(r.rating), 0) OR p.rating_count IS DISTINCT FROM COUNT(r.id) ORDER BY p.name LIMIT 50', 'viewing', TRUE)
    ON CONFLICT (title) WHERE is_system_preset = TRUE
    DO UPDATE SET
      query_string = EXCLUDED.query_string,
      category = EXCLUDED.category,
      is_system_preset = TRUE
  `);
};

const ensureBackupRecoveryTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS backup_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      profile_name VARCHAR(255) NOT NULL,
      method VARCHAR(50) NOT NULL,
      scope TEXT DEFAULT 'full',
      schedule_interval VARCHAR(50),
      schedule_unit VARCHAR(20),
      status VARCHAR(20) DEFAULT 'CONFIGURED',
      size VARCHAR(50) DEFAULT '0 MB',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS recovery_operations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      recovery_type VARCHAR(50) NOT NULL,
      file_name VARCHAR(255) DEFAULT 'N/A',
      status VARCHAR(20) DEFAULT 'COMPLETED',
      message TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
};

const ensureDatabaseActivityLogTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS database_activity_log (
      id BIGSERIAL PRIMARY KEY,
      event_type VARCHAR(20) NOT NULL
        CHECK (event_type IN ('login_success', 'login_failed', 'query_execution')),
      actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
      payload TEXT,
      executed_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_dal_event_type ON database_activity_log(event_type)
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_dal_executed_at ON database_activity_log(executed_at DESC)
  `);
};

// ── SQL Validation ──────────────────────────────────────────────────────────

const ALLOWED_PREFIXES = ["SELECT", "WITH", "EXPLAIN", "VACUUM", "ANALYZE"];
const FORBIDDEN_SQL_PATTERNS = [
  /\bDROP\b/,
  /\bALTER\b/,
  /\bTRUNCATE\b/,
  /\bREINDEX\b/,
  /\bGRANT\b/,
  /\bREVOKE\b/,
  /\bINSERT\b/,
  /\bUPDATE\b/,
  /\bDELETE\b/,
  /\bMERGE\b/,
  /\bCREATE\s+DATABASE\b/,
  /\bCREATE\s+USER\b/,
];
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const nullableUuid = (value) => uuidPattern.test(String(value ?? "")) ? value : null;

const validateSql = (sql) => {
  const trimmed = sql.trim().toUpperCase();
  const allowed = ALLOWED_PREFIXES.some((p) => trimmed.startsWith(p));
  if (!allowed) throw new AppError(`Only ${ALLOWED_PREFIXES.join(", ")} queries are allowed`, 403);
  const forbidden = FORBIDDEN_SQL_PATTERNS.some((pattern) => pattern.test(trimmed));
  if (forbidden) {
    throw new AppError("Data-changing or destructive SQL is blocked in the query runner", 403);
  }
};

// ── Health ──────────────────────────────────────────────────────────────────

router.get("/health", catchAsync(async (req, res) => {
  let dbConnected = false;
  let dbLatency = 0;
  try {
    const start = Date.now();
    await db.query("SELECT 1");
    dbLatency = Date.now() - start;
    dbConnected = true;
  } catch (err) {
    console.error("[DEV] Health check DB error:", err.message);
  }
  res.json({
    success: true,
    data: {
      status: dbConnected ? "healthy" : "degraded",
      uptime: process.uptime(),
      dbConnected,
      dbLatency,
      timestamp: new Date().toISOString(),
    },
  });
}));

// ── Database Info ───────────────────────────────────────────────────────────

router.get("/database", catchAsync(async (req, res) => {
  const tablesResult = await db.query(`
    SELECT relname AS name, n_live_tup AS row_count,
      pg_size_pretty(pg_total_relation_size(relid)) AS size,
      CASE WHEN n_dead_tup > n_live_tup * 0.2 THEN 'Vacuum Required'
           WHEN n_dead_tup > n_live_tup * 0.05 THEN 'Fragmented'
           ELSE 'Optimized' END AS status,
      n_dead_tup AS dead_tuples
    FROM pg_stat_user_tables ORDER BY n_live_tup DESC
  `);
  const storageResult = await db.query(`
    SELECT pg_size_pretty(SUM(pg_total_relation_size(relid))) AS used
    FROM pg_stat_user_tables
  `);
  const instanceResult = await db.query(`
    SELECT version(), pg_postmaster_start_time AS uptime,
      (SELECT count(*) FROM pg_stat_activity) AS connections,
      current_setting('max_connections') AS max_connections
    FROM pg_postmaster_start_time()
  `);
  const instance = instanceResult.rows[0] || {};
  const storage = storageResult.rows[0] || { used: "0 B" };
  res.json({
    success: true, data: {
      instance: {
        engine: "PostgreSQL " + ((instance.version || "").match(/PostgreSQL\s+([^\s,]+)/)?.[1] || "15.x"),
        version: instance.version || "", region: process.env.DB_REGION || "us-east-1",
        connections: `${instance.connections || 0} / ${instance.max_connections || 100}`,
        uptime: instance.uptime ? Math.floor((Date.now() - new Date(instance.uptime).getTime()) / 86400000) + " days" : "N/A",
      },
      storage: { used: storage.used || "0 B", total: "50 GB" },
      tables: tablesResult.rows.map((t) => ({
        name: t.name, rowCount: Number(t.row_count || 0).toLocaleString(),
        size: t.size || "0 B", status: t.status, deadTuples: Number(t.dead_tuples || 0),
      })),
    },
  });
}));

// ── Logs ────────────────────────────────────────────────────────────────────

router.get("/logs", catchAsync(async (req, res) => {
  const { severity, search } = req.query;
  const limit = Math.min(parseInt(req.query.limit) || 50, 200);
  let logs = [];
  try {
    const placeResult = await db.query(`SELECT id, name, created_at FROM places ORDER BY created_at DESC LIMIT $1`, [limit]);
    placeResult.rows.forEach((r) => logs.push({ id: `place-${r.id}`, level: "INFO", status: 200, timestamp: new Date(r.created_at).toISOString().replace("T", " ").slice(0, 19), endpoint: "/api/places", message: `Place created: ${r.name}` }));
  } catch (err) { console.error("[DEV] Error fetching place logs:", err.message); }
  try {
    const reviewResult = await db.query(`SELECT id, body, rating, created_at FROM reviews ORDER BY created_at DESC LIMIT $1`, [limit]);
    reviewResult.rows.forEach((r) => logs.push({ id: `review-${r.id}`, level: r.rating < 3 ? "WARNING" : "INFO", status: r.rating < 3 ? 400 : 201, timestamp: new Date(r.created_at).toISOString().replace("T", " ").slice(0, 19), endpoint: "/api/reviews", message: `Review (${r.rating}/5): ${(r.body || "").slice(0, 60)}` }));
  } catch (err) { console.error("[DEV] Error fetching review logs:", err.message); }
  try {
    const userResult = await db.query(`SELECT id, email, created_at FROM users ORDER BY created_at DESC LIMIT $1`, [limit]);
    userResult.rows.forEach((r) => logs.push({ id: `user-${r.id}`, level: "INFO", status: 201, timestamp: new Date(r.created_at).toISOString().replace("T", " ").slice(0, 19), endpoint: "/api/auth/signup", message: `User registered: ${r.email}` }));
  } catch (err) { console.error("[DEV] Error fetching user logs:", err.message); }
  logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  if (severity && severity !== "All") logs = logs.filter((l) => l.level === severity);
  if (search) { const q = search.toLowerCase(); logs = logs.filter((l) => l.endpoint.toLowerCase().includes(q) || l.message.toLowerCase().includes(q)); }
  res.json({ success: true, data: { logs: logs.slice(0, limit), summary: { critical: logs.filter((l) => l.level === "CRITICAL").length, warning: logs.filter((l) => l.level === "WARNING").length, info: logs.filter((l) => l.level === "INFO").length } } });
}));

// ── Seed (removed — use psql directly or seed-data.sql) ──────────────────────

// ── API Metrics ─────────────────────────────────────────────────────────────

router.get("/api-metrics", catchAsync(async (req, res) => {
  let tableCount = 0;
  let dbLatencyMs = null;
  let requestsToday = 0;

  try {
    const startedAt = Date.now();
    const result = await db.query("SELECT COUNT(*) AS cnt FROM pg_stat_user_tables");
    dbLatencyMs = Date.now() - startedAt;
    tableCount = parseInt(result.rows[0]?.cnt, 10) || 0;
  } catch (err) {
    console.error("[DEV] Error fetching table count:", err.message);
  }

  try {
    const result = await db.query(`
      SELECT (
        SELECT COUNT(*)::int
        FROM database_activity_log
        WHERE executed_at >= CURRENT_DATE
      ) + (
        SELECT COUNT(*)::int
        FROM session_events
        WHERE created_at >= CURRENT_DATE
      ) AS count
    `);
    requestsToday = parseInt(result.rows[0]?.count, 10) || 0;
  } catch (err) {
    console.error("[DEV] Error fetching request count:", err.message);
  }

  res.json({
    success: true,
    data: {
      totalTables: tableCount,
      avgLatency: dbLatencyMs === null ? "N/A" : `${dbLatencyMs}ms`,
      requestsToday: String(requestsToday),
      uptime: process.uptime(),
    },
  });
}));

// ── Query Presets (DB-backed) ───────────────────────────────────────────────

router.get("/queries/presets", catchAsync(async (req, res) => {
  await ensureQueryPresetsTable();
  const { category, search } = req.query;

  let sql = `SELECT id, title, query_string, category, is_system_preset, created_by, last_used_at, created_at FROM query_presets WHERE 1=1`;
  const params = [];

  if (category && ["viewing", "altering", "deleting", "updating", "creating"].includes(category)) {
    params.push(category);
    sql += ` AND category = $${params.length}`;
  }
  if (search) {
    params.push(`%${search}%`);
    sql += ` AND (title ILIKE $${params.length} OR query_string ILIKE $${params.length})`;
  }

  // Top 10 recently used
  sql += ` ORDER BY last_used_at DESC NULLS LAST, created_at DESC LIMIT 10`;
  const result = await db.query(sql, params);

  // Also return total count for "View All"
  const countResult = await db.query(`SELECT COUNT(*)::int AS total FROM query_presets`);

  res.json({ success: true, data: { presets: result.rows, totalPresets: countResult.rows[0]?.total || 0 } });
}));

router.get("/queries/presets/all", catchAsync(async (req, res) => {
  await ensureQueryPresetsTable();
  const { category, search, page = "1", limit = "50" } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let sql = `SELECT id, title, query_string, category, is_system_preset, created_by, last_used_at, created_at FROM query_presets WHERE 1=1`;
  const params = [];
  if (category && ["viewing", "altering", "deleting", "updating", "creating"].includes(category)) {
    params.push(category); sql += ` AND category = $${params.length}`;
  }
  if (search) {
    params.push(`%${search}%`); sql += ` AND (title ILIKE $${params.length} OR query_string ILIKE $${params.length})`;
  }
  const countResult = await db.query(`SELECT COUNT(*)::int AS total FROM query_presets WHERE 1=1`);
  sql += ` ORDER BY is_system_preset DESC, last_used_at DESC NULLS LAST LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(parseInt(limit), offset);
  const result = await db.query(sql, params);
  res.json({ success: true, data: { presets: result.rows, total: countResult.rows[0]?.total || 0, page: parseInt(page), limit: parseInt(limit) } });
}));

router.post("/queries/presets", catchAsync(async (req, res) => {
  await ensureQueryPresetsTable();
  const { title, query_string, category } = req.body;
  if (!title || !query_string) throw new AppError("title and query_string are required", 400);
  validateSql(query_string);
  if (category && !["viewing", "altering", "deleting", "updating", "creating"].includes(category)) throw new AppError("Invalid category", 400);
  const result = await db.query(
    `INSERT INTO query_presets (title, query_string, category, is_system_preset, created_by) VALUES ($1, $2, $3, FALSE, $4) RETURNING id, title, query_string, category, is_system_preset, created_at`,
    [title, query_string, category || "viewing", nullableUuid(req.user?.sub)]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
}));

router.put("/queries/presets/:id", catchAsync(async (req, res) => {
  await ensureQueryPresetsTable();
  const { title, query_string, category } = req.body;
  if (query_string !== undefined) validateSql(query_string);
  const result = await db.query(
    `UPDATE query_presets SET title = COALESCE($1, title), query_string = COALESCE($2, query_string), category = COALESCE($3, category) WHERE id = $4 AND is_system_preset = FALSE RETURNING id, title, query_string, category, is_system_preset`,
    [title, query_string, category, req.params.id]
  );
  if (!result.rows.length) throw new AppError("Preset not found or is system-preset", 404);
  res.json({ success: true, data: result.rows[0] });
}));

router.delete("/queries/presets/:id", catchAsync(async (req, res) => {
  await ensureQueryPresetsTable();
  const result = await db.query(`DELETE FROM query_presets WHERE id = $1 AND is_system_preset = FALSE RETURNING id`, [req.params.id]);
  if (!result.rows.length) throw new AppError("Preset not found or is system preset", 404);
  res.json({ success: true, data: { id: req.params.id } });
}));

router.patch("/queries/presets/:id/used", catchAsync(async (req, res) => {
  await db.query(`UPDATE query_presets SET last_used_at = NOW() WHERE id = $1`, [req.params.id]);
  res.json({ success: true });
}));

// ── SQL Query Runner ────────────────────────────────────────────────────────

router.post("/query", catchAsync(async (req, res) => {
  const { sql, presetId } = req.body;
  if (!sql || typeof sql !== "string") throw new AppError("SQL query is required", 400);

  validateSql(sql);

  // Log the execution attempt
  try {
    await ensureDatabaseActivityLogTable();
    await pool.query(
      `INSERT INTO database_activity_log (event_type, actor_id, payload) VALUES ('query_execution', $1, $2)`,
      [req.user?.sub || null, sql.slice(0, 1000)]
    );
  } catch (err) { console.error("[DEV] Failed to log query:", err.message); }

  // Update preset last_used_at if provided
  if (presetId) {
    try { await db.query(`UPDATE query_presets SET last_used_at = NOW() WHERE id = $1`, [presetId]); } catch (err) { /* ignore */ }
  }

  const startTime = Date.now();
  let result;
  try {
    result = await db.query(sql);
  } catch (err) {
    // Log error to database_activity_log
    try {
      await pool.query(
        `INSERT INTO database_activity_log (event_type, actor_id, payload) VALUES ('query_execution', $1, $2)`,
        [req.user?.sub || null, `ERROR: ${err.message} | SQL: ${(sql || "").slice(0, 500)}`]
      );
    } catch (logErr) { /* ignore */ }
    throw new AppError(`Query error: ${err.message}`, 400);
  }

  const duration = Date.now() - startTime;

  res.json({
    success: true, data: {
      rows: result.rows,
      rowCount: result.rowCount ?? result.rows.length,
      duration,
      fields: result.fields ? result.fields.map((f) => f.name) : (result.rows.length > 0 ? Object.keys(result.rows[0]) : []),
    },
  });
}));

// ── Query History (now DB-backed) ───────────────────────────────────────────

router.get("/query/history", catchAsync(async (req, res) => {
  await ensureDatabaseActivityLogTable();
  const limit = Math.min(parseInt(req.query.limit) || 100, 500);
  const result = await db.query(
    `SELECT id, event_type, actor_id, payload, executed_at FROM database_activity_log WHERE event_type = 'query_execution' ORDER BY executed_at DESC LIMIT $1`,
    [limit]
  );
  res.json({ success: true, data: result.rows });
}));

// ── Maintenance (kept for backward compat, now presets handle VACUUM/ANALYZE) ─

router.get("/maintenance", catchAsync(async (req, res) => {
  const tablesResult = await db.query(`
    SELECT relname AS name, n_live_tup AS live_tuples, n_dead_tup AS dead_tuples,
      pg_size_pretty(pg_total_relation_size(relid)) AS size,
      last_vacuum, last_autovacuum, last_analyze, last_autoanalyze,
      CASE WHEN n_dead_tup > n_live_tup * 0.2 THEN 'critical'
           WHEN n_dead_tup > n_live_tup * 0.05 THEN 'warning'
           ELSE 'good' END AS health
    FROM pg_stat_user_tables ORDER BY n_dead_tup DESC
  `);
  res.json({ success: true, data: tablesResult.rows });
}));

// ── Error / Bug Dashboard ───────────────────────────────────────────────────

router.get("/errors", catchAsync(async (req, res) => {
  await ensureDatabaseActivityLogTable();

  // Fetch errors from ALL sources: audit_log, database_activity_log, users
  const [
    auditResult, dalResult, bannedResult, loginResult,
  ] = await Promise.allSettled([
    db.query(`SELECT action, details, created_at, target_type FROM audit_log WHERE action LIKE '%error%' OR action LIKE '%fail%' OR details::text LIKE '%error%' ORDER BY created_at DESC LIMIT 200`),
    db.query(`SELECT id, event_type, actor_id, payload, executed_at FROM database_activity_log WHERE payload LIKE '%ERROR%' ORDER BY executed_at DESC LIMIT 200`),
    db.query(`SELECT id, email, created_at FROM users WHERE is_banned = true ORDER BY created_at DESC LIMIT 50`),
    db.query(`SELECT event_type, actor_id, payload, executed_at FROM database_activity_log WHERE event_type IN ('login_success', 'login_failed') ORDER BY executed_at DESC LIMIT 100`),
  ]);

  const auditErrors = auditResult.status === "fulfilled" ? auditResult.value.rows : [];
  const dalErrors = dalResult.status === "fulfilled" ? dalResult.value.rows : [];
  const bannedUsers = bannedResult.status === "fulfilled" ? bannedResult.value.rows : [];
  const loginEvents = loginResult.status === "fulfilled" ? loginResult.value.rows : [];

  // Compute severity stats
  const allErrors = [...auditErrors, ...dalErrors];
  const highErrors = allErrors.filter((e) => (e.details?.toString() || e.payload || "").toLowerCase().includes("critical") || e.action?.toLowerCase().includes("fail"));
  const mediumErrors = allErrors.filter((e) => !highErrors.includes(e) && (e.details?.toString() || e.payload || "").toLowerCase().includes("error"));
  const lowErrors = allErrors.filter((e) => !highErrors.includes(e) && !mediumErrors.includes(e));

  res.json({
    success: true, data: {
      totalErrors: allErrors.length,
      totalBanned: bannedUsers.length,
      severityBreakdown: { high: highErrors.length, medium: mediumErrors.length, low: lowErrors.length },
      auditErrors: auditErrors.slice(0, 50),
      queryErrors: dalErrors.slice(0, 50),
      bannedUsers,
      loginEvents: loginEvents.slice(0, 50),
      loginFailures: loginEvents.filter((e) => e.event_type === "login_failed").length,
      sources: { consumer: "review-based", vendor: "vendor-based", admin: "audit-based", developer: "query-based" },
    },
  });
}));

// ── Database Activity Log (auth logging) ────────────────────────────────────

router.get("/activity-log", catchAsync(async (req, res) => {
  await ensureDatabaseActivityLogTable();
  const limit = Math.min(parseInt(req.query.limit) || 100, 500);
  const { eventType } = req.query;
  let sql = `SELECT dal.id, dal.event_type, dal.actor_id, dal.payload, dal.executed_at, u.email AS actor_email FROM database_activity_log dal LEFT JOIN users u ON u.id = dal.actor_id WHERE 1=1`;
  const params = [];
  if (eventType && ["login_success", "login_failed", "query_execution"].includes(eventType)) {
    params.push(eventType); sql += ` AND dal.event_type = $${params.length}`;
  }
  sql += ` ORDER BY dal.executed_at DESC LIMIT $${params.length + 1}`;
  params.push(limit);
  const result = await db.query(sql, params);
  res.json({ success: true, data: result.rows });
}));

// ── Backup & Recovery (DB-backed, persists across restarts) ──────────────────

router.get("/backups", devOrGlobalAdmin, catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const result = await db.query(`SELECT id, profile_name AS "profileName", method, scope, schedule_interval AS "scheduleInterval", schedule_unit AS "scheduleUnit", status, size, created_at AS "createdAt" FROM backup_profiles ORDER BY created_at DESC`);
  res.json({ success: true, data: result.rows });
}));

router.post("/backups", devOrGlobalAdmin, catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const { profileName, method, scope, scheduleInterval, scheduleUnit } = req.body;
  if (!profileName || !method) throw new AppError("profileName and method are required", 400);

  if (!BACKUP_METHODS.has(method)) {
    throw new AppError("Invalid backup method", 400);
  }

  let normalizedInterval = null;
  let normalizedUnit = null;
  if (scheduleInterval || scheduleUnit) {
    const interval = Number(scheduleInterval);
    if (!Number.isInteger(interval) || interval < 1) {
      throw new AppError("Schedule interval must be a positive integer", 400);
    }
    if (!SCHEDULE_UNITS.has(scheduleUnit)) {
      throw new AppError("Invalid schedule unit", 400);
    }
    normalizedInterval = String(interval);
    normalizedUnit = scheduleUnit;
  }

  const result = await db.query(
    `INSERT INTO backup_profiles (profile_name, method, scope, schedule_interval, schedule_unit, status, size) VALUES ($1, $2, $3, $4, $5, 'CONFIGURED', $6) RETURNING id, profile_name AS "profileName", method, scope, schedule_interval AS "scheduleInterval", schedule_unit AS "scheduleUnit", status, size, created_at AS "createdAt"`,
    [profileName.trim(), method, scope || "full", normalizedInterval, normalizedUnit, "N/A"]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
}));

router.get("/backups/:id/download", devOrGlobalAdmin, catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const result = await db.query(
    `SELECT id, profile_name AS "profileName", method, scope, schedule_interval AS "scheduleInterval", schedule_unit AS "scheduleUnit", status, size, created_at AS "createdAt"
     FROM backup_profiles
     WHERE id = $1`,
    [req.params.id]
  );
  const profile = result.rows[0];
  if (!profile) throw new AppError("Backup not found", 404);

  const isCsv = profile.method === "Specific Rows";
  const { tempDir, dumpPath, sizeBytes } = isCsv
    ? await createPostgresCsvFile(profile)
    : await createPostgresDumpFile(profile);
  const size = formatBytes(sizeBytes);
  await db.query(
    `UPDATE backup_profiles SET status = 'COMPLETED', size = $2 WHERE id = $1`,
    [profile.id, size]
  );

  const generatedAt = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const ext = isCsv ? "csv" : "dump";
  const filename = `patheats-${safeDownloadName(profile.profileName)}-${generatedAt}.${ext}`;
  res.setHeader("Content-Type", isCsv ? "text/csv" : "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("X-Backup-Format", isCsv ? "csv" : "postgres-custom");

  const stream = createReadStream(dumpPath);
  const cleanup = () => rm(tempDir, { recursive: true, force: true }).catch(() => {});
  res.on("finish", cleanup);
  res.on("close", cleanup);
  stream.on("error", async () => {
    await cleanup();
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Could not stream PostgreSQL dump" });
    } else {
      res.destroy();
    }
  });
  stream.pipe(res);
}));

router.delete("/backups/:id", devOrGlobalAdmin, catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const result = await db.query(`DELETE FROM backup_profiles WHERE id = $1 RETURNING id`, [req.params.id]);
  if (!result.rows.length) throw new AppError("Backup not found", 404);
  res.json({ success: true, data: { id: req.params.id } });
}));

router.get("/recovery", devOrGlobalAdmin, catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const result = await db.query(`SELECT id, recovery_type AS type, file_name AS "fileName", status, message, created_at AS "createdAt" FROM recovery_operations ORDER BY created_at DESC`);
  res.json({ success: true, data: result.rows });
}));

router.post("/recovery", devOrGlobalAdmin, upload.single("file"), catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const { type, confirmationText } = req.body;
  if (!type) throw new AppError("Recovery type is required", 400);
  if (!RECOVERY_TYPES.has(type)) throw new AppError("Invalid recovery type", 400);
  const expectedConfirmation = expectedRecoveryConfirmation(type);
  if (confirmationText !== expectedConfirmation) {
    throw new AppError(`Type ${expectedConfirmation} to confirm recovery`, 400);
  }
  if (!req.file) throw new AppError("Recovery file is required", 400);

  const fileName = req.file.originalname;
  const lowerFileName = fileName.toLowerCase();
  if (type === "PostgreSQL Dump" && ![".dump", ".backup", ".pgdump"].some((ext) => lowerFileName.endsWith(ext))) {
    throw new AppError("PostgreSQL dump recovery requires a .dump, .backup, or .pgdump file", 400);
  }
  if (type === "Row Level CSV" && !lowerFileName.endsWith(".csv")) {
    throw new AppError("Row Level CSV recovery requires a .csv file", 400);
  }

  const insertOp = async (status, message) => {
    const r = await db.query(
      `INSERT INTO recovery_operations (recovery_type, file_name, status, message) VALUES ($1, $2, $3, $4) RETURNING id, recovery_type AS type, file_name AS "fileName", status, message, created_at AS "createdAt"`,
      [type, fileName, status, message]
    );
    return r.rows[0];
  };

  if (type === "PostgreSQL Dump") {
    if (!hasPostgresDumpSignature(req.file.buffer)) {
      const op = await insertOp("FAILED", "File is not a PostgreSQL custom-format dump.");
      return res.status(400).json({ success: false, data: op, error: "File is not a PostgreSQL custom-format dump." });
    }

    let tempDir;
    try {
      const temp = await writeRecoveryTempFile(req.file);
      tempDir = temp.tempDir;
      const inspection = await inspectPostgresDump(temp.dumpPath);
      await restorePostgresDump(temp.dumpPath);
      const op = await insertOp(
        "COMPLETED",
        `PostgreSQL dump restored in data-only mode. ${inspection.dataEntryCount} data entries inspected from "${fileName}".`
      );
      return res.json({ success: true, data: op });
    } catch (err) {
      const msg = err.message || "PostgreSQL dump recovery failed";
      const op = await insertOp("FAILED", msg);
      return res.status(err.statusCode || 500).json({ success: false, data: op, error: msg });
    } finally {
      if (tempDir) await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  }

  const content = req.file.buffer.toString("utf-8");
  const issues = validateRecoveryContent(content, type);
  if (issues.length > 0) {
    const op = await insertOp("FAILED", issues.join("; "));
    return res.status(400).json({ success: false, data: op, errors: issues });
  }

  let client;
  let transactionOpen = false;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    transactionOpen = true;

    if (type === "Row Level CSV") {
      const targetTable = req.body.targetTable;
      if (!targetTable) throw new AppError("Target table is required for CSV recovery", 400);
      validateIdentifier(targetTable, "Target table");

      const rows = content.split(/\r?\n/).filter((row) => row.trim());
      const header = rows.shift();
      if (!header) throw new AppError("CSV file has no header row", 400);

      const cols = parseCsvLine(header);
      if (cols.length === 0) throw new AppError("CSV file has no columns", 400);
      cols.forEach((column) => validateIdentifier(column, "CSV column"));

      const tableColumns = await client.query(
        `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1`,
        [targetTable]
      );
      if (tableColumns.rows.length === 0) {
        throw new AppError(`Target table "${targetTable}" does not exist`, 400);
      }

      const allowedColumns = new Set(tableColumns.rows.map((row) => row.column_name));
      const unknownColumns = cols.filter((column) => !allowedColumns.has(column));
      if (unknownColumns.length > 0) {
        throw new AppError(`CSV contains unknown columns: ${unknownColumns.join(", ")}`, 400);
      }

      const quotedTable = quoteIdent(targetTable);
      const quotedColumns = cols.map(quoteIdent).join(", ");
      for (const row of rows) {
        const values = parseCsvLine(row);
        if (values.length !== cols.length) {
          throw new AppError("CSV row does not match header column count", 400);
        }
        const placeholders = values.map((_, i) => `$${i + 1}`);
        await client.query(
          `INSERT INTO ${quotedTable} (${quotedColumns}) VALUES (${placeholders.join(", ")}) ON CONFLICT DO NOTHING`,
          values
        );
      }
    }

    await client.query("COMMIT");
    transactionOpen = false;
    const op = await insertOp("COMPLETED", `Recovery from "${fileName}" completed. ${type} restored successfully.`);
    res.json({ success: true, data: op });
  } catch (err) {
    if (client && transactionOpen) await client.query("ROLLBACK").catch(() => {});
    const msg = err.message || "Recovery execution failed";
    const op = await insertOp("FAILED", msg);
    res.status(err.statusCode || 500).json({ success: false, data: op, error: msg });
  } finally {
    if (client) client.release();
  }
}));

// ── Reviews (cross-domain) ──────────────────────────────────────────────────

router.get("/reviews", catchAsync(async (req, res) => {
  const { getAllReviews } = await import("../services/AdminService.js");
  const reviews = await getAllReviews();
  res.json({ success: true, data: reviews });
}));

router.get("/user-management/overview", catchAsync(async (req, res) => {
  const rows = await getUserManagementOverview(req.query.search);
  res.json({ success: true, data: rows });
}));

router.get("/vendor-management/overview", catchAsync(async (req, res) => {
  const rows = await getVendorManagementOverview(req.query.search);
  res.json({ success: true, data: rows });
}));

export default router;
