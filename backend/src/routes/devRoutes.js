import { createReadStream } from "fs";
import { mkdtemp, rm, writeFile } from "fs/promises";
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
  BACKUP_METHODS,
  SCHEDULE_UNITS,
  formatBytes,
  safeDownloadName,
  validateIdentifier,
  validateBackupProfile,
  generateBackupForProfile,
  ensureBackupStorageDir,
} from "../services/backupService.js";
import {
  inspectPostgresDump as inspectPostgresDumpSafe,
  restoreFullDump,
  restoreTableDump,
  restoreCsvFile,
} from "../services/backupRecoveryService.js";
import {
  getUserManagementOverview,
  getVendorManagementOverview,
} from "../services/AdminService.js";
import { logAuditAction } from "../repositories/adminRepository.js";

const MAX_RECOVERY_FILE_BYTES = 100 * 1024 * 1024;
const REQUIRED_RECOVERY_CONFIRMATION = "RECOVER";
const POSTGRES_DUMP_CONFIRMATION = "RESTORE POSTGRES DUMP";
const RECOVERY_TYPES = new Set(["PostgreSQL Dump", "Row Level CSV"]);





const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_RECOVERY_FILE_BYTES },
  fileFilter: (_req, file, cb) => {
    const ext = file.originalname.split(".").pop()?.toLowerCase();
    if (["dump", "backup", "pgdump", "json", "csv"].includes(ext)) return cb(null, true);
    cb(new AppError("Only .dump, .backup, .pgdump, .json, and .csv files are allowed", 400));
  },
});













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













function hasPostgresDumpSignature(buffer) {
  return buffer.length >= 5 && buffer.subarray(0, 5).toString("ascii") === "PGDMP";
}

async function writeRecoveryTempFile(file) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "patheats-pgrestore-"));
  const dumpPath = path.join(tempDir, "recovery.dump");
  await writeFile(dumpPath, file.buffer, { flag: "wx" });
  return { tempDir, dumpPath };
}

const router = Router();

const devAdminBypass = (req, res, next) => {
  const nodeEnv = (process.env.NODE_ENV || "").trim().toLowerCase();
  const isDevelopment = nodeEnv === "development" || nodeEnv === "dev";
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
const devOrGlobalAdmin = restrictToRoles("DEVELOPER_ADMIN", "GLOBAL_ADMIN");

const logDevAudit = (req, action, targetType, targetId, details = null) => {
  const actorId = req.user?.sub || null;
  const roleScope = req.user?.role_scope || req.user?.role || "DEVELOPER_ADMIN";
  logAuditAction(actorId, action, targetType, targetId, details, roleScope);
};

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
      size VARCHAR(50) DEFAULT 'N/A',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      last_backup_at TIMESTAMPTZ,
      next_backup_at TIMESTAMPTZ
    )
  `);
  await pool.query(`ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS last_backup_at TIMESTAMPTZ`);
  await pool.query(`ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS next_backup_at TIMESTAMPTZ`);
  await pool.query(`ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN NOT NULL DEFAULT FALSE`);
  await pool.query(`ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS last_error TEXT`);
  await pool.query(`ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS run_count INTEGER NOT NULL DEFAULT 0`);
  await pool.query(`ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS run_started_at TIMESTAMPTZ`);
  await pool.query(`ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`);
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
  await pool.query(`
    CREATE TABLE IF NOT EXISTS scheduled_backups (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      profile_id UUID REFERENCES backup_profiles(id) ON DELETE CASCADE,
      profile_name VARCHAR(255),
      file_name VARCHAR(255) NOT NULL,
      file_path TEXT NOT NULL,
      method VARCHAR(50) NOT NULL,
      scope TEXT,
      size VARCHAR(50) DEFAULT 'N/A',
      status VARCHAR(20) DEFAULT 'COMPLETED',
      message TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`ALTER TABLE scheduled_backups ADD COLUMN IF NOT EXISTS artifact_format VARCHAR(50)`);
  await pool.query(`ALTER TABLE scheduled_backups ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ`);
  await ensureBackupStorageDir();
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
    try { await db.query(`UPDATE query_presets SET last_used_at = NOW() WHERE id = $1`, [presetId]); } catch (_) { /* ignore */ }
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
    } catch (_logErr) { /* ignore */ }
    throw new AppError(`Query error: ${err.message}`, 400);
  }

  const duration = Date.now() - startTime;

  logDevAudit(req, "execute_query", "database", null, { query: sql.slice(0, 200), rowCount: result.rowCount ?? result.rows.length, duration });

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
  const result = await db.query(`
    SELECT id, profile_name AS "profileName", method, scope,
           schedule_interval AS "scheduleInterval", schedule_unit AS "scheduleUnit",
           is_enabled AS "isEnabled", status, size, last_error AS "lastError",
           run_count AS "runCount", created_at AS "createdAt", updated_at AS "updatedAt",
           last_backup_at AS "lastBackupAt", next_backup_at AS "nextBackupAt"
    FROM backup_profiles ORDER BY created_at DESC
  `);
  res.json({ success: true, data: result.rows });
}));

router.post("/backups", devOrGlobalAdmin, catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const { profileName, method, scope, scheduleInterval, scheduleUnit } = req.body;
  if (!profileName || !method) throw new AppError("profileName and method are required", 400);

  if (!BACKUP_METHODS.has(method)) {
    throw new AppError("Invalid backup method", 400);
  }
  await validateBackupProfile({ method, scope: scope || "full" });

  let normalizedInterval = null;
  let normalizedUnit = null;
  let hasNextBackup = false;
  if (scheduleInterval || scheduleUnit) {
    const interval = Number(scheduleInterval);
    if (!Number.isSafeInteger(interval) || interval < 0) {
      throw new AppError("Schedule interval must be a non-negative integer", 400);
    }
    if (interval > 0) {
      if (!SCHEDULE_UNITS.has(scheduleUnit)) {
        throw new AppError("Invalid schedule unit", 400);
      }
      normalizedInterval = String(interval);
      normalizedUnit = scheduleUnit;
      hasNextBackup = true;
    }
  }

  const nextBackupExpr = hasNextBackup ? "NOW()" : "NULL";
  const insertSql = "INSERT INTO backup_profiles (profile_name, method, scope, schedule_interval, schedule_unit, is_enabled, status, size, next_backup_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, " + nextBackupExpr + ") RETURNING id, profile_name AS \"profileName\", method, scope, schedule_interval AS \"scheduleInterval\", schedule_unit AS \"scheduleUnit\", is_enabled AS \"isEnabled\", status, size, created_at AS \"createdAt\", next_backup_at AS \"nextBackupAt\"";
  const result = await db.query(insertSql, [profileName.trim(), method, scope || "full", normalizedInterval, normalizedUnit, hasNextBackup, hasNextBackup ? "ACTIVE" : "MANUAL", "N/A"]);
  logDevAudit(req, "create_backup", "backup_profiles", result.rows[0].id, { profileName: profileName.trim(), method, scope, scheduleInterval: normalizedInterval, scheduleUnit: normalizedUnit });
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

  const { tempDir, dumpPath, sizeBytes, extension, contentType, format } = await generateBackupForProfile(profile);
  const size = formatBytes(sizeBytes);
  await db.query(
    `UPDATE backup_profiles
     SET size = $2,
         last_backup_at = NOW(),
         status = CASE WHEN is_enabled THEN 'ACTIVE' WHEN schedule_interval IS NULL THEN 'MANUAL' ELSE status END
     WHERE id = $1`,
    [profile.id, size]
  );
  logDevAudit(req, "download_backup", "backup_profiles", profile.id, { profileName: profile.profileName, size });

  const filename = `${safeDownloadName(profile.profileName)}.${extension}`;
  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("X-Backup-Format", format);

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

router.patch("/backups/:id", devOrGlobalAdmin, catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const existingResult = await db.query(
    `SELECT id, profile_name, method, scope, schedule_interval, schedule_unit, is_enabled
     FROM backup_profiles WHERE id = $1`,
    [req.params.id]
  );
  const existing = existingResult.rows[0];
  if (!existing) throw new AppError("Backup not found", 404);

  const profileName = req.body.profileName !== undefined ? String(req.body.profileName).trim() : existing.profile_name;
  const method = req.body.method ?? existing.method;
  const scope = req.body.scope !== undefined ? (req.body.scope || "full") : existing.scope;
  const scheduleInterval = req.body.scheduleInterval !== undefined ? req.body.scheduleInterval : existing.schedule_interval;
  const scheduleUnit = req.body.scheduleUnit !== undefined ? req.body.scheduleUnit : existing.schedule_unit;
  if (!profileName) throw new AppError("Profile name cannot be empty", 400);
  if (!BACKUP_METHODS.has(method)) throw new AppError("Invalid backup method", 400);
  await validateBackupProfile({ method, scope });

  let normalizedInterval = null;
  let normalizedUnit = null;
  if (scheduleInterval !== null && scheduleInterval !== "" && scheduleInterval !== undefined) {
    const interval = Number(scheduleInterval);
    if (!Number.isSafeInteger(interval) || interval < 0) throw new AppError("Schedule interval must be a non-negative integer", 400);
    if (interval > 0) {
      if (!scheduleUnit || !SCHEDULE_UNITS.has(scheduleUnit)) throw new AppError("Invalid schedule unit", 400);
      normalizedInterval = String(interval);
      normalizedUnit = scheduleUnit;
    }
  }
  const hasSchedule = Boolean(normalizedInterval && normalizedUnit);
  const existingHasSchedule = Boolean(existing.schedule_interval && existing.schedule_unit);
  const isEnabled = hasSchedule && (
    req.body.isEnabled !== undefined
      ? Boolean(req.body.isEnabled)
      : existingHasSchedule ? Boolean(existing.is_enabled) : true
  );
  const status = !hasSchedule ? "MANUAL" : isEnabled ? "ACTIVE" : "PAUSED";

  const result = await db.query(
    `UPDATE backup_profiles
     SET profile_name = $1, method = $2, scope = $3,
         schedule_interval = $4, schedule_unit = $5,
         is_enabled = $6, status = $7,
         next_backup_at = CASE WHEN $6 THEN NOW() ELSE NULL END,
         last_error = NULL, updated_at = NOW()
     WHERE id = $8
     RETURNING id, profile_name AS "profileName", method, scope,
               schedule_interval AS "scheduleInterval", schedule_unit AS "scheduleUnit",
               is_enabled AS "isEnabled", status, size, last_error AS "lastError",
               run_count AS "runCount", created_at AS "createdAt", updated_at AS "updatedAt",
               last_backup_at AS "lastBackupAt", next_backup_at AS "nextBackupAt"`,
    [profileName, method, scope, normalizedInterval, normalizedUnit, isEnabled, status, req.params.id]
  );
  logDevAudit(req, "update_backup", "backup_profiles", req.params.id, { profileName, method, scope, scheduleInterval: normalizedInterval, scheduleUnit: normalizedUnit, isEnabled });
  res.json({ success: true, data: result.rows[0] });
}));

router.post("/backups/:id/pause", devOrGlobalAdmin, catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const result = await db.query(
    `UPDATE backup_profiles
     SET is_enabled = FALSE, status = CASE WHEN schedule_interval IS NULL THEN 'MANUAL' ELSE 'PAUSED' END,
         next_backup_at = NULL, run_started_at = NULL, updated_at = NOW()
     WHERE id = $1
     RETURNING id, profile_name AS "profileName", method, scope,
               schedule_interval AS "scheduleInterval", schedule_unit AS "scheduleUnit",
               is_enabled AS "isEnabled", status, size, last_error AS "lastError",
               run_count AS "runCount", created_at AS "createdAt", updated_at AS "updatedAt",
               last_backup_at AS "lastBackupAt", next_backup_at AS "nextBackupAt"`,
    [req.params.id]
  );
  if (!result.rows[0]) throw new AppError("Backup not found", 404);
  logDevAudit(req, "pause_backup", "backup_profiles", req.params.id);
  res.json({ success: true, data: result.rows[0] });
}));

router.post("/backups/:id/resume", devOrGlobalAdmin, catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const result = await db.query(
    `UPDATE backup_profiles
     SET is_enabled = TRUE, status = 'ACTIVE', next_backup_at = NOW(),
         last_error = NULL, updated_at = NOW()
     WHERE id = $1 AND schedule_interval IS NOT NULL AND schedule_interval NOT IN ('', '0') AND schedule_unit IS NOT NULL
     RETURNING id, profile_name AS "profileName", method, scope,
               schedule_interval AS "scheduleInterval", schedule_unit AS "scheduleUnit",
               is_enabled AS "isEnabled", status, size, last_error AS "lastError",
               run_count AS "runCount", created_at AS "createdAt", updated_at AS "updatedAt",
               last_backup_at AS "lastBackupAt", next_backup_at AS "nextBackupAt"`,
    [req.params.id]
  );
  if (!result.rows[0]) throw new AppError("Backup profile has no valid schedule to resume", 400);
  logDevAudit(req, "resume_backup", "backup_profiles", req.params.id);
  res.json({ success: true, data: result.rows[0] });
}));

router.delete("/backups/:id", devOrGlobalAdmin, catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const files = await db.query(`SELECT file_path FROM scheduled_backups WHERE profile_id = $1 AND status = 'COMPLETED'`, [req.params.id]);
  const result = await db.query(`DELETE FROM backup_profiles WHERE id = $1 RETURNING id, profile_name AS "profileName"`, [req.params.id]);
  if (!result.rows.length) throw new AppError("Backup not found", 404);
  const { unlink } = await import("fs/promises");
  await Promise.all(files.rows.map((file) => unlink(file.file_path).catch(() => {})));
  logDevAudit(req, "delete_backup", "backup_profiles", req.params.id, { profileName: result.rows[0].profileName });
  res.json({ success: true, data: { id: req.params.id } });
}));

// ── Scheduled Backups (auto-generated by the backup scheduler) ──────────────

router.get("/backups/scheduled", devOrGlobalAdmin, catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const profileFilter = req.query.profileId || null;
  const params = [];
  let where = "";
  if (profileFilter) {
    params.push(profileFilter);
    where = `WHERE profile_id::text = $1`;
  }
  const result = await db.query(
    `SELECT id, profile_id AS "profileId", profile_name AS "profileName", file_name AS "fileName", method, scope, size, status, message,
            artifact_format AS "artifactFormat", completed_at AS "completedAt", created_at AS "createdAt"
     FROM scheduled_backups ${where}
     ORDER BY created_at DESC LIMIT 200`,
    params
  );
  res.json({ success: true, data: result.rows });
}));

router.get("/backups/scheduled/:id/download", devOrGlobalAdmin, catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const result = await db.query(
    `SELECT id, file_name, file_path, method FROM scheduled_backups WHERE id = $1`,
    [req.params.id]
  );
  const backup = result.rows[0];
  if (!backup) throw new AppError("Scheduled backup not found", 404);

  const { existsSync } = await import("fs");
  if (!existsSync(backup.file_path)) {
    throw new AppError("Backup file no longer exists on disk", 404);
  }

  const ext = path.extname(backup.file_name || "").slice(1).toLowerCase() || "dump";
  const filename = backup.file_name || `scheduled-backup.${ext}`;
  res.setHeader("Content-Type", ext === "json" ? "application/json" : ext === "csv" ? "text/csv" : "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("X-Backup-Format", ext === "json" ? "patheats-logical-json" : ext === "csv" ? "csv" : "postgres-custom");

  const stream = createReadStream(backup.file_path);
  stream.on("error", () => {
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Could not stream backup file" });
    } else {
      res.destroy();
    }
  });
  stream.pipe(res);
}));

router.delete("/backups/scheduled/:id", devOrGlobalAdmin, catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const result = await db.query(
    `DELETE FROM scheduled_backups WHERE id = $1 RETURNING id, file_path, file_name`,
    [req.params.id]
  );
  if (!result.rows.length) throw new AppError("Scheduled backup not found", 404);
  const { unlink } = await import("fs/promises");
  await unlink(result.rows[0].file_path).catch(() => {});
  logDevAudit(req, "delete_scheduled_backup", "scheduled_backups", req.params.id, { fileName: result.rows[0].file_name });
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
      const inspection = await inspectPostgresDumpSafe(temp.dumpPath);
      const tableList = inspection.tableNames;
      if (tableList.length === 0) throw new AppError("No public tables found in the dump", 400);

      const isFull = inspection.entryCount >= 5;
      if (isFull) {
        await restoreFullDump(temp.dumpPath);
      } else {
        for (const t of tableList) {
          await restoreTableDump(temp.dumpPath, t);
        }
      }

      const op = await insertOp(
        "COMPLETED",
        `PostgreSQL dump restored. ${inspection.entryCount} data entries from "${fileName}" across ${tableList.length} table(s).`
      );
      logDevAudit(req, "execute_recovery", "recovery_operations", op.id, { type, fileName, status: "COMPLETED" });
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

  if (type === "Row Level CSV") {
    const targetTable = req.body.targetTable;
    if (!targetTable) throw new AppError("Target table is required for CSV recovery", 400);
    validateIdentifier(targetTable, "Target table");

    let tempDir;
    try {
      const temp = await writeRecoveryTempFile(req.file);
      tempDir = temp.tempDir;
      await restoreCsvFile(temp.dumpPath, targetTable);
      const op = await insertOp("COMPLETED", `CSV data restored into table "${targetTable}" from "${fileName}".`);
      logDevAudit(req, "execute_recovery", "recovery_operations", op.id, { type, fileName, targetTable, status: "COMPLETED" });
      return res.json({ success: true, data: op });
    } catch (err) {
      const msg = err.message || "CSV recovery failed";
      const op = await insertOp("FAILED", msg);
      return res.status(err.statusCode || 500).json({ success: false, data: op, error: msg });
    } finally {
      if (tempDir) await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  }

  const op = await insertOp("FAILED", `Unsupported recovery type: ${type}`);
  return res.status(400).json({ success: false, data: op, error: `Unsupported recovery type: ${type}` });
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

// ── Audit Logs by Role ────────────────────────────────────────────────────

router.get("/audit/by-role", catchAsync(async (req, res) => {
  const roleScope = req.query.role_scope;
  const limit = Number(req.query.limit || 100);
  if (!roleScope || !["GLOBAL_ADMIN", "DEVELOPER_ADMIN", "BUSINESS_ASSISTANCE"].includes(roleScope)) {
    return res.status(400).json({ success: false, message: "Valid role_scope is required (GLOBAL_ADMIN, DEVELOPER_ADMIN, BUSINESS_ASSISTANCE)" });
  }
  const { getAuditLogsByRoleScope } = await import("../services/AdminService.js");
  const logs = await getAuditLogsByRoleScope(roleScope, limit);
  res.json({ success: true, data: logs });
}));

// ── Profile ─────────────────────────────────────────────────────────────────

router.get("/profile", catchAsync(async (req, res) => {
  const db = (await import("../config/db.js")).default;
  const result = await db.query(
    `SELECT id::text, email, first_name, last_name, phone_number, role_scope, is_banned, created_at, updated_at
     FROM users WHERE id = $1`,
    [req.user.sub]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const row = result.rows[0];
  res.json({
    success: true,
    data: {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone_number,
      roleScope: row.role_scope,
      isBanned: row.is_banned,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    },
  });
}));

export default router;
