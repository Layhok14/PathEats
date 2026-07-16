import db, { pool } from "../config/db.js";
import AppError from "../utils/AppError.js";
import { logAuditAction } from "../repositories/adminRepository.js";

const PRESET_CATEGORIES = new Set(["viewing", "altering", "deleting", "updating", "creating"]);
const ALLOWED_PREFIXES = ["SELECT", "WITH", "EXPLAIN", "VACUUM", "ANALYZE"];
const FORBIDDEN_SQL_PATTERNS = [
  /\bDROP\b/, /\bALTER\b/, /\bTRUNCATE\b/, /\bREINDEX\b/, /\bGRANT\b/,
  /\bREVOKE\b/, /\bINSERT\b/, /\bUPDATE\b/, /\bDELETE\b/, /\bMERGE\b/,
  /\bCREATE\s+DATABASE\b/, /\bCREATE\s+USER\b/,
];

const nullableUuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value ?? ""))
    ? value
    : null;

class DeveloperService {
  validateSql(sql) {
    const normalized = String(sql ?? "").trim().toUpperCase();
    if (!normalized || !ALLOWED_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
      throw new AppError(`Only ${ALLOWED_PREFIXES.join(", ")} queries are allowed`, 403);
    }
    if (FORBIDDEN_SQL_PATTERNS.some((pattern) => pattern.test(normalized))) {
      throw new AppError("Data-changing or destructive SQL is blocked in the query runner", 403);
    }
  }

  async ensureTable(tableName) {
    const { rows } = await pool.query("SELECT to_regclass($1) AS exists", [`public.${tableName}`]);
    if (!rows[0]?.exists) {
      throw new AppError(`${tableName} is not initialized. Run database migrations first.`, 503);
    }
  }

  async getHealth() {
    let dbConnected = false;
    let dbLatency = 0;
    try {
      const startedAt = Date.now();
      await db.query("SELECT 1");
      dbLatency = Date.now() - startedAt;
      dbConnected = true;
    } catch (error) {
      console.error("[DeveloperService] Health check failed:", error.message);
    }
    return {
      status: dbConnected ? "healthy" : "degraded",
      uptime: process.uptime(),
      dbConnected,
      dbLatency,
      timestamp: new Date().toISOString(),
    };
  }

  async getDatabaseInfo() {
    const [tablesResult, storageResult, instanceResult] = await Promise.all([
      db.query(`SELECT relname AS name, n_live_tup AS row_count,
        pg_size_pretty(pg_total_relation_size(relid)) AS size,
        CASE WHEN n_dead_tup > n_live_tup * 0.2 THEN 'Vacuum Required'
             WHEN n_dead_tup > n_live_tup * 0.05 THEN 'Fragmented'
             ELSE 'Optimized' END AS status,
        n_dead_tup AS dead_tuples
        FROM pg_stat_user_tables ORDER BY n_live_tup DESC`),
      db.query("SELECT pg_size_pretty(SUM(pg_total_relation_size(relid))) AS used FROM pg_stat_user_tables"),
      db.query(`SELECT version(), pg_postmaster_start_time AS uptime,
        (SELECT count(*) FROM pg_stat_activity) AS connections,
        current_setting('max_connections') AS max_connections
        FROM pg_postmaster_start_time()`),
    ]);
    const instance = instanceResult.rows[0] || {};
    return {
      instance: {
        engine: "PostgreSQL " + ((instance.version || "").match(/PostgreSQL\s+([^\s,]+)/)?.[1] || "15.x"),
        version: instance.version || "",
        region: process.env.DB_REGION || "us-east-1",
        connections: `${instance.connections || 0} / ${instance.max_connections || 100}`,
        uptime: instance.uptime ? `${Math.floor((Date.now() - new Date(instance.uptime).getTime()) / 86400000)} days` : "N/A",
      },
      storage: { used: storageResult.rows[0]?.used || "0 B", total: "50 GB" },
      tables: tablesResult.rows.map((table) => ({
        name: table.name,
        rowCount: Number(table.row_count || 0).toLocaleString(),
        size: table.size || "0 B",
        status: table.status,
        deadTuples: Number(table.dead_tuples || 0),
      })),
    };
  }

  async getLogs({ severity, search, limit = 50 }) {
    const safeLimit = Math.min(Number.parseInt(limit, 10) || 50, 200);
    const [places, reviews, users] = await Promise.all([
      db.query("SELECT id, name, created_at FROM places ORDER BY created_at DESC LIMIT $1", [safeLimit]),
      db.query("SELECT id, body, rating, created_at FROM reviews ORDER BY created_at DESC LIMIT $1", [safeLimit]),
      db.query("SELECT id, email, created_at FROM users ORDER BY created_at DESC LIMIT $1", [safeLimit]),
    ]);
    let logs = [
      ...places.rows.map((row) => ({ id: `place-${row.id}`, level: "INFO", status: 200, timestamp: new Date(row.created_at).toISOString().replace("T", " ").slice(0, 19), endpoint: "/api/places", message: `Place created: ${row.name}` })),
      ...reviews.rows.map((row) => ({ id: `review-${row.id}`, level: row.rating < 3 ? "WARNING" : "INFO", status: row.rating < 3 ? 400 : 201, timestamp: new Date(row.created_at).toISOString().replace("T", " ").slice(0, 19), endpoint: "/api/reviews", message: `Review (${row.rating}/5): ${(row.body || "").slice(0, 60)}` })),
      ...users.rows.map((row) => ({ id: `user-${row.id}`, level: "INFO", status: 201, timestamp: new Date(row.created_at).toISOString().replace("T", " ").slice(0, 19), endpoint: "/api/auth/signup", message: `User registered: ${row.email}` })),
    ].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    if (severity && severity !== "All") logs = logs.filter((log) => log.level === severity);
    if (search) {
      const term = String(search).toLowerCase();
      logs = logs.filter((log) => log.endpoint.toLowerCase().includes(term) || log.message.toLowerCase().includes(term));
    }
    return {
      logs: logs.slice(0, safeLimit),
      summary: {
        critical: logs.filter((log) => log.level === "CRITICAL").length,
        warning: logs.filter((log) => log.level === "WARNING").length,
        info: logs.filter((log) => log.level === "INFO").length,
      },
    };
  }

  async getApiMetrics() {
    const startedAt = Date.now();
    const tableResult = await db.query("SELECT COUNT(*) AS cnt FROM pg_stat_user_tables");
    const dbLatencyMs = Date.now() - startedAt;
    let requestsToday = 0;
    try {
      const requestResult = await db.query(`SELECT
        (SELECT COUNT(*)::int FROM database_activity_log WHERE executed_at >= CURRENT_DATE) +
        (SELECT COUNT(*)::int FROM session_events WHERE created_at >= CURRENT_DATE) AS count`);
      requestsToday = Number.parseInt(requestResult.rows[0]?.count, 10) || 0;
    } catch (error) {
      console.error("[DeveloperService] Request metrics unavailable:", error.message);
    }
    return {
      totalTables: Number.parseInt(tableResult.rows[0]?.cnt, 10) || 0,
      avgLatency: `${dbLatencyMs}ms`,
      requestsToday: String(requestsToday),
      uptime: process.uptime(),
    };
  }

  async getPresets({ category, search, page, limit, all = false }) {
    await this.ensureTable("query_presets");
    const params = [];
    let where = "WHERE 1=1";
    if (category && PRESET_CATEGORIES.has(category)) {
      params.push(category);
      where += ` AND category = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      where += ` AND (title ILIKE $${params.length} OR query_string ILIKE $${params.length})`;
    }
    const { rows: countRows } = await db.query(`SELECT COUNT(*)::int AS total FROM query_presets ${where}`, params);
    let sql = `SELECT id, title, query_string, category, is_system_preset, created_by, last_used_at, created_at FROM query_presets ${where}`;
    if (all) {
      const safePage = Math.max(Number.parseInt(page, 10) || 1, 1);
      const safeLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 50, 1), 200);
      params.push(safeLimit, (safePage - 1) * safeLimit);
      sql += ` ORDER BY is_system_preset DESC, last_used_at DESC NULLS LAST LIMIT $${params.length - 1} OFFSET $${params.length}`;
      const { rows } = await db.query(sql, params);
      return { presets: rows, total: countRows[0]?.total || 0, page: safePage, limit: safeLimit };
    }
    sql += " ORDER BY last_used_at DESC NULLS LAST, created_at DESC LIMIT 10";
    const { rows } = await db.query(sql, params);
    return { presets: rows, totalPresets: countRows[0]?.total || 0 };
  }

  async createPreset(payload, actorId) {
    await this.ensureTable("query_presets");
    if (!payload.title || !payload.query_string) throw new AppError("title and query_string are required", 400);
    this.validateSql(payload.query_string);
    if (payload.category && !PRESET_CATEGORIES.has(payload.category)) throw new AppError("Invalid category", 400);
    const { rows } = await db.query(
      `INSERT INTO query_presets (title, query_string, category, is_system_preset, created_by)
       VALUES ($1, $2, $3, FALSE, $4)
       RETURNING id, title, query_string, category, is_system_preset, created_at`,
      [payload.title, payload.query_string, payload.category || "viewing", nullableUuid(actorId)]
    );
    return rows[0];
  }

  async updatePreset(id, payload) {
    await this.ensureTable("query_presets");
    if (payload.query_string !== undefined) this.validateSql(payload.query_string);
    if (payload.category !== undefined && !PRESET_CATEGORIES.has(payload.category)) throw new AppError("Invalid category", 400);
    const { rows } = await db.query(
      `UPDATE query_presets SET title = COALESCE($1, title), query_string = COALESCE($2, query_string), category = COALESCE($3, category)
       WHERE id = $4 AND is_system_preset = FALSE RETURNING id, title, query_string, category, is_system_preset`,
      [payload.title, payload.query_string, payload.category, id]
    );
    if (!rows.length) throw new AppError("Preset not found or is system preset", 404);
    return rows[0];
  }

  async deletePreset(id) {
    const { rows } = await db.query("DELETE FROM query_presets WHERE id = $1 AND is_system_preset = FALSE RETURNING id", [id]);
    if (!rows.length) throw new AppError("Preset not found or is system preset", 404);
    return { id };
  }

  async markPresetUsed(id) {
    await db.query("UPDATE query_presets SET last_used_at = NOW() WHERE id = $1", [id]);
  }

  async executeQuery(sql, presetId, actor) {
    if (typeof sql !== "string" || !sql.trim()) {
      throw new AppError("SQL query is required", 400);
    }
    this.validateSql(sql);
    await this.ensureTable("database_activity_log");
    await pool.query(
      "INSERT INTO database_activity_log (event_type, actor_id, payload) VALUES ('query_execution', $1, $2)",
      [nullableUuid(actor?.sub), sql.slice(0, 1000)]
    );
    if (presetId) await this.markPresetUsed(presetId);
    const startedAt = Date.now();
    let result;
    try {
      result = await db.query(sql);
    } catch (error) {
      await pool.query(
        "INSERT INTO database_activity_log (event_type, actor_id, payload) VALUES ('query_execution', $1, $2)",
        [nullableUuid(actor?.sub), `ERROR: ${error.message} | SQL: ${sql.slice(0, 500)}`]
      ).catch(() => {});
      throw new AppError("Query execution failed", 400, {
        code: "QUERY_EXECUTION_FAILED",
        safeMessage: "The query could not be executed.",
      });
    }
    const duration = Date.now() - startedAt;
    await logAuditAction(actor?.sub || null, "execute_query", "database", null, {
      query: sql.slice(0, 200),
      rowCount: result.rowCount ?? result.rows.length,
      duration,
    }, actor?.role_scope || actor?.role || "DEVELOPER_ADMIN");
    return {
      rows: result.rows,
      rowCount: result.rowCount ?? result.rows.length,
      duration,
      fields: result.fields ? result.fields.map((field) => field.name) : (result.rows[0] ? Object.keys(result.rows[0]) : []),
    };
  }

  async getQueryHistory(limit) {
    await this.ensureTable("database_activity_log");
    const safeLimit = Math.min(Number.parseInt(limit, 10) || 100, 500);
    const { rows } = await db.query(
      "SELECT id, event_type, actor_id, payload, executed_at FROM database_activity_log WHERE event_type = 'query_execution' ORDER BY executed_at DESC LIMIT $1",
      [safeLimit]
    );
    return rows;
  }

  async getMaintenance() {
    const { rows } = await db.query(`SELECT relname AS name, n_live_tup AS live_tuples, n_dead_tup AS dead_tuples,
      pg_size_pretty(pg_total_relation_size(relid)) AS size,
      last_vacuum, last_autovacuum, last_analyze, last_autoanalyze,
      CASE WHEN n_dead_tup > n_live_tup * 0.2 THEN 'critical'
           WHEN n_dead_tup > n_live_tup * 0.05 THEN 'warning' ELSE 'good' END AS health
      FROM pg_stat_user_tables ORDER BY n_dead_tup DESC`);
    return rows;
  }

  async getErrors() {
    await this.ensureTable("database_activity_log");
    const [auditResult, activityResult, bannedResult, loginResult] = await Promise.all([
      db.query("SELECT action, details, created_at, target_type FROM audit_log WHERE action ILIKE '%error%' OR action ILIKE '%fail%' OR details::text ILIKE '%error%' ORDER BY created_at DESC LIMIT 200"),
      db.query("SELECT id, event_type, actor_id, payload, executed_at FROM database_activity_log WHERE payload ILIKE '%ERROR%' ORDER BY executed_at DESC LIMIT 200"),
      db.query("SELECT id, email, created_at FROM users WHERE is_banned = TRUE ORDER BY created_at DESC LIMIT 50"),
      db.query("SELECT event_type, actor_id, payload, executed_at FROM database_activity_log WHERE event_type IN ('login_success', 'login_failed') ORDER BY executed_at DESC LIMIT 100"),
    ]);
    const allErrors = [...auditResult.rows, ...activityResult.rows];
    const high = allErrors.filter((entry) => `${entry.details || entry.payload || ""}`.toLowerCase().includes("critical") || entry.action?.toLowerCase().includes("fail"));
    const medium = allErrors.filter((entry) => !high.includes(entry) && `${entry.details || entry.payload || ""}`.toLowerCase().includes("error"));
    return {
      totalErrors: allErrors.length,
      totalBanned: bannedResult.rows.length,
      severityBreakdown: { high: high.length, medium: medium.length, low: allErrors.length - high.length - medium.length },
      auditErrors: auditResult.rows.slice(0, 50),
      queryErrors: activityResult.rows.slice(0, 50),
      bannedUsers: bannedResult.rows,
      loginEvents: loginResult.rows.slice(0, 50),
      loginFailures: loginResult.rows.filter((entry) => entry.event_type === "login_failed").length,
      sources: { consumer: "review-based", vendor: "vendor-based", admin: "audit-based", developer: "query-based" },
    };
  }

  async getActivityLog({ eventType, limit }) {
    await this.ensureTable("database_activity_log");
    const safeLimit = Math.min(Number.parseInt(limit, 10) || 100, 500);
    const params = [];
    let where = "";
    if (["login_success", "login_failed", "query_execution"].includes(eventType)) {
      params.push(eventType);
      where = `WHERE dal.event_type = $${params.length}`;
    }
    params.push(safeLimit);
    const { rows } = await db.query(
      `SELECT dal.id, dal.event_type, dal.actor_id, dal.payload, dal.executed_at, u.email AS actor_email
       FROM database_activity_log dal LEFT JOIN users u ON u.id = dal.actor_id
       ${where} ORDER BY dal.executed_at DESC LIMIT $${params.length}`,
      params
    );
    return rows;
  }
}

export default DeveloperService;
