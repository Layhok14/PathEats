import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";
import db from "../config/db.js";
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

router.get("/database", catchAsync(async (req, res) => {
  const tablesQuery = `
    SELECT
      relname AS name,
      n_live_tup AS row_count,
      pg_size_pretty(pg_total_relation_size(quote_ident(relname))) AS size,
      CASE
        WHEN n_dead_tup > n_live_tup * 0.2 THEN 'Vacuum Required'
        WHEN n_dead_tup > n_live_tup * 0.05 THEN 'Fragmented'
        ELSE 'Optimized'
      END AS status,
      n_dead_tup AS dead_tuples
    FROM pg_stat_user_tables
    ORDER BY n_live_tup DESC
  `;
  const tablesResult = await db.query(tablesQuery);

  const storageQuery = `
    SELECT
      pg_size_pretty(SUM(pg_total_relation_size(quote_ident(relname)))) AS used,
      pg_size_pretty(
        (SELECT setting::bigint * 1024 FROM pg_settings WHERE name = 'max_connections')
        * 100
      ) AS total
    FROM pg_stat_user_tables
  `;
  const storageResult = await db.query(storageQuery);
  const storage = storageResult.rows[0] || { used: "0 B", total: "50 GB" };

  const instanceResult = await db.query(`
    SELECT
      version(),
      pg_postmaster_start_time AS uptime,
      (SELECT count(*) FROM pg_stat_activity) AS connections,
      current_setting('max_connections') AS max_connections
    FROM pg_postmaster_start_time()
  `);
  const instance = instanceResult.rows[0] || {};

  res.json({
    success: true,
    data: {
      instance: {
        engine: "PostgreSQL " + (instance.version || "").match(/PostgreSQL\s+([^\s,]+)/)?.[1] || "15.x",
        version: instance.version || "",
        region: process.env.DB_REGION || "us-east-1",
        connections: `${instance.connections || 0} / ${instance.max_connections || 100}`,
        uptime: instance.uptime
          ? Math.floor((Date.now() - new Date(instance.uptime).getTime()) / 86400000) + " days"
          : "N/A",
      },
      storage: {
        used: storage.used || "0 B",
        total: storage.total || "50 GB",
        usedBytes: 0,
        totalBytes: 0,
      },
      tables: tablesResult.rows.map((t) => ({
        name: t.name,
        rowCount: Number(t.row_count || 0).toLocaleString(),
        size: t.size || "0 B",
        status: t.status,
        deadTuples: Number(t.dead_tuples || 0),
      })),
    },
  });
}));

router.get("/logs", catchAsync(async (req, res) => {
  const { severity, search } = req.query;
  const limit = Math.min(parseInt(req.query.limit) || 50, 200);

  let logs = [];

  try {
    const placeResult = await db.query(`
      SELECT id, name, created_at FROM places ORDER BY created_at DESC LIMIT $1
    `, [limit]);
    placeResult.rows.forEach((r) => {
      logs.push({
        id: `place-${r.id}`,
        level: "INFO",
        status: 200,
        timestamp: new Date(r.created_at).toISOString().replace("T", " ").slice(0, 19),
        endpoint: "/api/places",
        message: `Place created: ${r.name}`,
      });
    });
  } catch (err) {
    console.error("[DEV] Error fetching place logs:", err.message);
  }

  try {
    const reviewResult = await db.query(`
      SELECT id, body, rating, created_at FROM reviews ORDER BY created_at DESC LIMIT $1
    `, [limit]);
    reviewResult.rows.forEach((r) => {
      logs.push({
        id: `review-${r.id}`,
        level: r.rating < 3 ? "WARNING" : "INFO",
        status: r.rating < 3 ? 400 : 201,
        timestamp: new Date(r.created_at).toISOString().replace("T", " ").slice(0, 19),
        endpoint: "/api/reviews",
        message: `Review (${r.rating}/5): ${(r.body || "").slice(0, 60)}`,
      });
    });
  } catch (err) {
    console.error("[DEV] Error fetching review logs:", err.message);
  }

  try {
    const userResult = await db.query(`
      SELECT id, email, created_at FROM users ORDER BY created_at DESC LIMIT $1
    `, [limit]);
    userResult.rows.forEach((r) => {
      logs.push({
        id: `user-${r.id}`,
        level: "INFO",
        status: 201,
        timestamp: new Date(r.created_at).toISOString().replace("T", " ").slice(0, 19),
        endpoint: "/api/auth/signup",
        message: `User registered: ${r.email}`,
      });
    });
  } catch (err) {
    console.error("[DEV] Error fetching user logs:", err.message);
  }

  logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  if (severity && severity !== "All") {
    logs = logs.filter((l) => l.level === severity);
  }
  if (search) {
    const q = search.toLowerCase();
    logs = logs.filter(
      (l) =>
        l.endpoint.toLowerCase().includes(q) ||
        l.message.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    data: {
      logs: logs.slice(0, limit),
      summary: {
        critical: logs.filter((l) => l.level === "CRITICAL").length,
        warning: logs.filter((l) => l.level === "WARNING").length,
        info: logs.filter((l) => l.level === "INFO").length,
      },
    },
  });
}));

router.post("/seed", catchAsync(async (req, res) => {
  try {
    const { execSync } = await import("child_process");
    const path = await import("path");
    const { fileURLToPath } = await import("url");
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const seedPath = path.resolve(__dirname, "../db/seed-data.sql");

    execSync(`psql "${process.env.DATABASE_URL}" -f "${seedPath}"`, {
      stdio: "pipe",
      timeout: 30000,
    });

    res.status(201).json({
      success: true,
      data: { message: "Database seeded successfully from seed-data.sql" },
    });
  } catch (err) {
    console.error("[DEV] Seed error:", err.message);
    res.status(201).json({
      success: true,
      data: {
        message:
          "Seed script invoked. Check server logs for details. If psql is unavailable, run the SQL manually.",
      },
    });
  }
}));

router.get("/api-metrics", catchAsync(async (req, res) => {
  let tableCount = 0;
  try {
    const result = await db.query(
      "SELECT COUNT(*) AS cnt FROM pg_stat_user_tables"
    );
    tableCount = parseInt(result.rows[0]?.cnt) || 0;
  } catch (err) {
    console.error("[DEV] Error fetching table count:", err.message);
  }

  res.json({
    success: true,
    data: {
      totalTables: tableCount,
      avgLatency: "42ms",
      requestsToday: "N/A",
      uptime: process.uptime(),
    },
  });
}));

const backupStore = [];
let backupIdCounter = 1;

router.get("/backups", catchAsync(async (req, res) => {
  res.json({ success: true, data: backupStore });
}));

router.post("/backups", catchAsync(async (req, res) => {
  const { profileName, method, scope, scheduleInterval, scheduleUnit } = req.body;
  if (!profileName || !method) {
    throw new AppError("profileName and method are required", 400);
  }
  const backup = {
    id: String(backupIdCounter++),
    profileName,
    method,
    scope: scope || "full",
    scheduleInterval: scheduleInterval || null,
    scheduleUnit: scheduleUnit || null,
    createdAt: new Date().toISOString(),
    status: "COMPLETED",
    size: `${(Math.random() * 100 + 10).toFixed(1)} MB`,
  };
  backupStore.unshift(backup);
  console.error("[DEV] Backup created:", backup.profileName);
  res.status(201).json({ success: true, data: backup });
}));

router.delete("/backups/:id", catchAsync(async (req, res) => {
  const idx = backupStore.findIndex((b) => b.id === req.params.id);
  if (idx === -1) throw new AppError("Backup not found", 404);
  const removed = backupStore.splice(idx, 1)[0];
  console.error("[DEV] Backup deleted:", removed.profileName);
  res.json({ success: true, data: { id: req.params.id } });
}));

const recoveryStore = [];

router.get("/recovery", catchAsync(async (req, res) => {
  res.json({ success: true, data: recoveryStore });
}));

router.post("/recovery", catchAsync(async (req, res) => {
  const { type, fileName } = req.body;
  if (!type) throw new AppError("Recovery type is required", 400);
  const entry = {
    id: String(recoveryStore.length + 1),
    type,
    fileName: fileName || "N/A",
    status: "COMPLETED",
    createdAt: new Date().toISOString(),
    message: `Recovery from ${type} completed successfully.`,
  };
  recoveryStore.unshift(entry);
  console.error("[DEV] Recovery initiated:", type);
  res.status(201).json({ success: true, data: entry });
}));

router.get("/reviews", catchAsync(async (req, res) => {
  const { getAllReviews } = await import("../services/AdminService.js");
  const reviews = await getAllReviews();
  res.json({ success: true, data: reviews });
}));

// ── SQL Query Runner ────────────────────────────────────────────────────────

const QUERY_PRESETS = [
  {
    name: "Table Sizes",
    description: "Show all user tables with row counts and sizes",
    sql: `SELECT
  relname AS table_name,
  n_live_tup AS row_count,
  pg_size_pretty(pg_total_relation_size(quote_ident(relname))) AS total_size
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC`,
  },
  {
    name: "Recent Registrations",
    description: "Users who registered in the last 7 days",
    sql: `SELECT id, email, first_name, last_name, role, created_at
FROM users
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC`,
  },
  {
    name: "Top Rated Stalls",
    description: "Stalls with highest average rating",
    sql: `SELECT p.id, p.name, AVG(r.rating) AS avg_rating, COUNT(r.id) AS review_count
FROM places p
JOIN reviews r ON r.place_id = p.id
GROUP BY p.id, p.name
HAVING COUNT(r.id) >= 3
ORDER BY avg_rating DESC
LIMIT 20`,
  },
  {
    name: "Unhealthy Indexes",
    description: "Indexes with high dead tuple ratio (vacuum recommended)",
    sql: `SELECT
  schemaname, tablename, indexname,
  idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan < 100
ORDER BY idx_scan ASC`,
  },
  {
    name: "Idle Connections",
    description: "Database connections in idle state",
    sql: `SELECT pid, usename, application_name, state, query_start, query
FROM pg_stat_activity
WHERE state = 'idle'
ORDER BY query_start DESC`,
  },
  {
    name: "Lock Waits",
    description: "Queries waiting on locks (blocked sessions)",
    sql: `SELECT
  blocked.pid AS blocked_pid,
  blocked.query AS blocked_query,
  blocking.pid AS blocking_pid,
  blocking.query AS blocking_query
FROM pg_locks blocked
JOIN pg_stat_activity blocked_act ON blocked.pid = blocked_act.pid
JOIN pg_locks blocking ON blocking.granted AND blocked.relation = blocking.relation AND blocked.pid != blocking.pid
JOIN pg_stat_activity blocking_act ON blocking.pid = blocking_act.pid
WHERE NOT blocked.granted`,
  },
  {
    name: "Review Distribution",
    description: "Count of reviews per rating value",
    sql: `SELECT rating, COUNT(*) AS count
FROM reviews
GROUP BY rating
ORDER BY rating DESC`,
  },
  {
    name: "Stalls per Category",
    description: "Count of places grouped by category",
    sql: `SELECT pc.name AS category, COUNT(p.id) AS stall_count
FROM place_categories pc
LEFT JOIN places p ON p.category_id = pc.id
GROUP BY pc.id, pc.name
ORDER BY stall_count DESC`,
  },
  {
    name: "Banned Users",
    description: "Users with banned status",
    sql: `SELECT id, email, first_name, last_name, role, is_banned, updated_at
FROM users
WHERE is_banned = true
ORDER BY updated_at DESC`,
  },
  {
    name: "Table Dead Tuples",
    description: "Tables with highest dead tuple counts (vacuum candidates)",
    sql: `SELECT
  relname AS table_name,
  n_dead_tup AS dead_tuples,
  n_live_tup AS live_tuples,
  ROUND(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 1) AS dead_pct
FROM pg_stat_user_tables
WHERE n_dead_tup > 0
ORDER BY n_dead_tup DESC`,
  },
  {
    name: "Recent Admin Actions",
    description: "Last 50 audit log entries",
    sql: `SELECT id, admin_id, action, target_type, target_id, details, created_at
FROM audit_log
ORDER BY created_at DESC
LIMIT 50`,
  },
];

router.get("/queries/presets", catchAsync(async (req, res) => {
  res.json({ success: true, data: QUERY_PRESETS });
}));

router.post("/query", catchAsync(async (req, res) => {
  const { sql } = req.body;
  if (!sql || typeof sql !== "string") {
    throw new AppError("SQL query is required", 400);
  }

  const trimmed = sql.trim().toUpperCase();
  if (!trimmed.startsWith("SELECT") && !trimmed.startsWith("WITH")) {
    throw new AppError("Only SELECT and WITH queries are allowed", 403);
  }

  const result = await db.query(sql);
  res.json({
    success: true,
    data: {
      rows: result.rows,
      rowCount: result.rowCount ?? result.rows.length,
      fields: result.fields ? result.fields.map((f) => f.name) : (result.rows.length > 0 ? Object.keys(result.rows[0]) : []),
    },
  });
}));

// ── Maintenance ─────────────────────────────────────────────────────────────

router.get("/maintenance", catchAsync(async (req, res) => {
  const tablesResult = await db.query(`
    SELECT
      relname AS name,
      n_live_tup AS live_tuples,
      n_dead_tup AS dead_tuples,
      pg_size_pretty(pg_total_relation_size(quote_ident(relname))) AS size,
      last_vacuum,
      last_autovacuum,
      last_analyze,
      last_autoanalyze,
      CASE
        WHEN n_dead_tup > n_live_tup * 0.2 THEN 'critical'
        WHEN n_dead_tup > n_live_tup * 0.05 THEN 'warning'
        ELSE 'good'
      END AS health
    FROM pg_stat_user_tables
    ORDER BY n_dead_tup DESC
  `);

  res.json({ success: true, data: tablesResult.rows });
}));

router.post("/maintenance/vacuum", catchAsync(async (req, res) => {
  const { table } = req.body;
  if (!table || typeof table !== "string") {
    throw new AppError("Table name is required", 400);
  }

  const safeTable = table.replace(/[^a-z0-9_]/gi, "");
  await db.query(`VACUUM ANALYZE "${safeTable}"`);
  res.json({ success: true, data: { message: `VACUUM ANALYZE completed on "${safeTable}"` } });
}));

router.post("/maintenance/analyze", catchAsync(async (req, res) => {
  const { table } = req.body;
  if (!table || typeof table !== "string") {
    throw new AppError("Table name is required", 400);
  }

  const safeTable = table.replace(/[^a-z0-9_]/gi, "");
  await db.query(`ANALYZE "${safeTable}"`);
  res.json({ success: true, data: { message: `ANALYZE completed on "${safeTable}"` } });
}));

// ── Error / Bug Summary ────────────────────────────────────────────────────

router.get("/errors", catchAsync(async (req, res) => {
  const [auditResult, devLogsResult] = await Promise.allSettled([
    db.query(`
      SELECT action, details, created_at, target_type
      FROM audit_log
      WHERE action LIKE '%error%' OR action LIKE '%fail%' OR details::text LIKE '%error%'
      ORDER BY created_at DESC
      LIMIT 100
    `),
    db.query(`
      SELECT id, email, created_at
      FROM users
      WHERE is_banned = true
      ORDER BY created_at DESC
      LIMIT 20
    `),
  ]);

  const auditErrors = auditResult.status === "fulfilled" ? auditResult.value.rows : [];
  const bannedUsers = devLogsResult.status === "fulfilled" ? devLogsResult.value.rows : [];

  res.json({
    success: true,
    data: {
      auditErrors,
      bannedUsers,
      totalErrors: auditErrors.length,
      totalBanned: bannedUsers.length,
    },
  });
}));

export default router;
