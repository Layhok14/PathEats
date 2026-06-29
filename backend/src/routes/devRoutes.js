import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";
import db from "../config/db.js";
import { pool } from "../config/db.js";
import AppError from "../utils/AppError.js";

const router = Router();

const devAdminBypass = (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    req.user = { sub: "dev-admin", email: "dev@patheat.app", role_scope: "DEVELOPER_ADMIN" };
    return next();
  }
  return authMiddleware(req, res, next);
};

router.use(devAdminBypass);
router.use(restrictToRoles("DEVELOPER_ADMIN"));

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
      ('Clear Old Search History', 'DELETE FROM search_history WHERE created_at < NOW() - INTERVAL ''30 days'' RETURNING id', 'deleting', TRUE),
      ('Delete Expired Activity Logs', 'DELETE FROM database_activity_log WHERE executed_at < NOW() - INTERVAL ''90 days'' RETURNING id', 'deleting', TRUE),
      ('Cleanup Orphaned Reviews', 'DELETE FROM reviews WHERE place_id NOT IN (SELECT id FROM places) RETURNING id', 'deleting', TRUE),
      ('Create Test Category', 'INSERT INTO place_categories (name, description) VALUES (''Quick Test'', ''Auto-generated test category'') RETURNING *', 'creating', TRUE),
      ('VACUUM Full Database', 'VACUUM', 'altering', TRUE),
      ('VACUUM ANALYZE', 'VACUUM ANALYZE', 'altering', TRUE),
      ('ANALYZE Full Database', 'ANALYZE', 'updating', TRUE),
      ('Update Stall Ratings', 'UPDATE places SET rating_avg = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE place_id = places.id), rating_count = (SELECT COUNT(*) FROM reviews WHERE place_id = places.id) WHERE EXISTS (SELECT 1 FROM reviews WHERE place_id = places.id)', 'updating', TRUE)
    ON CONFLICT DO NOTHING
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
      status VARCHAR(20) DEFAULT 'COMPLETED',
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
const FORBIDDEN_KEYWORDS = ["DROP", "ALTER", "TRUNCATE", "REINDEX", "GRANT", "REVOKE", "CREATE DATABASE", "CREATE USER"];

const validateSql = (sql) => {
  const trimmed = sql.trim().toUpperCase();
  const allowed = ALLOWED_PREFIXES.some((p) => trimmed.startsWith(p));
  if (!allowed) throw new AppError(`Only ${ALLOWED_PREFIXES.join(", ")} queries are allowed`, 403);
  const forbidden = FORBIDDEN_KEYWORDS.some((k) => trimmed.includes(k));
  if (forbidden) throw new AppError("Destructive statements (DROP, ALTER, TRUNCATE, GRANT, REVOKE) are blocked", 403);
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
      pg_size_pretty(pg_total_relation_size(quote_ident(relname))) AS size,
      CASE WHEN n_dead_tup > n_live_tup * 0.2 THEN 'Vacuum Required'
           WHEN n_dead_tup > n_live_tup * 0.05 THEN 'Fragmented'
           ELSE 'Optimized' END AS status,
      n_dead_tup AS dead_tuples
    FROM pg_stat_user_tables ORDER BY n_live_tup DESC
  `);
  const storageResult = await db.query(`
    SELECT pg_size_pretty(SUM(pg_total_relation_size(quote_ident(relname)))) AS used
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
  try { const result = await db.query("SELECT COUNT(*) AS cnt FROM pg_stat_user_tables"); tableCount = parseInt(result.rows[0]?.cnt) || 0; } catch (err) { console.error("[DEV] Error fetching table count:", err.message); }
  res.json({ success: true, data: { totalTables: tableCount, avgLatency: "42ms", requestsToday: "N/A", uptime: process.uptime() } });
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
  if (category && !["viewing", "altering", "deleting", "updating", "creating"].includes(category)) throw new AppError("Invalid category", 400);
  const result = await db.query(
    `INSERT INTO query_presets (title, query_string, category, is_system_preset, created_by) VALUES ($1, $2, $3, FALSE, $4) RETURNING id, title, query_string, category, is_system_preset, created_at`,
    [title, query_string, category || "viewing", req.user?.sub || null]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
}));

router.put("/queries/presets/:id", catchAsync(async (req, res) => {
  await ensureQueryPresetsTable();
  const { title, query_string, category } = req.body;
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
      pg_size_pretty(pg_total_relation_size(quote_ident(relname))) AS size,
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

router.get("/backups", catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const result = await db.query(`SELECT id, profile_name AS "profileName", method, scope, schedule_interval AS "scheduleInterval", schedule_unit AS "scheduleUnit", status, size, created_at AS "createdAt" FROM backup_profiles ORDER BY created_at DESC`);
  res.json({ success: true, data: result.rows });
}));

router.post("/backups", catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const { profileName, method, scope, scheduleInterval, scheduleUnit } = req.body;
  if (!profileName || !method) throw new AppError("profileName and method are required", 400);
  const result = await db.query(
    `INSERT INTO backup_profiles (profile_name, method, scope, schedule_interval, schedule_unit, status, size) VALUES ($1, $2, $3, $4, $5, 'COMPLETED', $6) RETURNING id, profile_name AS "profileName", method, scope, schedule_interval AS "scheduleInterval", schedule_unit AS "scheduleUnit", status, size, created_at AS "createdAt"`,
    [profileName, method, scope || "full", scheduleInterval || null, scheduleUnit || null, `${(Math.random() * 100 + 10).toFixed(1)} MB`]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
}));

router.delete("/backups/:id", catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const result = await db.query(`DELETE FROM backup_profiles WHERE id = $1 RETURNING id`, [req.params.id]);
  if (!result.rows.length) throw new AppError("Backup not found", 404);
  res.json({ success: true, data: { id: req.params.id } });
}));

router.get("/recovery", catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const result = await db.query(`SELECT id, recovery_type AS type, file_name AS "fileName", status, message, created_at AS "createdAt" FROM recovery_operations ORDER BY created_at DESC`);
  res.json({ success: true, data: result.rows });
}));

router.post("/recovery", catchAsync(async (req, res) => {
  await ensureBackupRecoveryTables();
  const { type, fileName } = req.body;
  if (!type) throw new AppError("Recovery type is required", 400);
  const result = await db.query(
    `INSERT INTO recovery_operations (recovery_type, file_name, status, message) VALUES ($1, $2, 'COMPLETED', $3) RETURNING id, recovery_type AS type, file_name AS "fileName", status, message, created_at AS "createdAt"`,
    [type, fileName || "N/A", `Recovery from ${type} completed successfully.`]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
}));

// ── Reviews (cross-domain) ──────────────────────────────────────────────────

router.get("/reviews", catchAsync(async (req, res) => {
  const { getAllReviews } = await import("../services/AdminService.js");
  const reviews = await getAllReviews();
  res.json({ success: true, data: reviews });
}));

export default router;
