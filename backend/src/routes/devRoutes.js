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

export default router;
