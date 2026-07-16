import { pool } from "../config/db.js";
import AppError from "../utils/AppError.js";

const RECOVERY_LOCK_KEY = 1346456912;
const quoteIdentifier = (identifier) => `"${String(identifier).replace(/"/g, '""')}"`;

class RecoveryRepository {
  async listOperations() {
    const { rows } = await pool.query(`SELECT id, recovery_type AS type, file_name AS "fileName",
      status, message, created_at AS "createdAt" FROM recovery_operations ORDER BY created_at DESC`);
    return rows;
  }

  async recordOperation({ type, fileName, scope, actorId, status, message }) {
    const { rows } = await pool.query(`INSERT INTO recovery_operations
      (recovery_type, file_name, scope, actor_id, status, message)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, recovery_type AS type, file_name AS "fileName", scope, status, message, created_at AS "createdAt"`,
    [type, fileName, scope, actorId, status, message]);
    return rows[0];
  }

  async withAdvisoryLock(operation) {
    const client = await pool.connect();
    let acquired = false;
    try {
      const { rows } = await client.query("SELECT pg_try_advisory_lock($1) AS acquired", [RECOVERY_LOCK_KEY]);
      acquired = Boolean(rows[0]?.acquired);
      if (!acquired) {
        throw new AppError("Another recovery operation is already running", 409, {
          code: "RECOVERY_IN_PROGRESS",
          safeMessage: "Another recovery is already running. Wait for it to finish before trying again.",
        });
      }
      return await operation();
    } finally {
      if (acquired) await client.query("SELECT pg_advisory_unlock($1)", [RECOVERY_LOCK_KEY]).catch(() => {});
      client.release();
    }
  }

  async truncateTable(tableName) {
    await pool.query(`TRUNCATE TABLE ${quoteIdentifier(tableName)} RESTART IDENTITY CASCADE`);
  }

  async restoreCsvRecords(targetTable, headers, records) {
    const client = await pool.connect();
    try {
      const [columnResult, primaryKeyResult] = await Promise.all([
        client.query(`SELECT column_name FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1 AND is_generated = 'NEVER'`, [targetTable]),
        client.query(`SELECT attribute.attname AS column_name
          FROM pg_index index_info
          JOIN pg_class table_info ON table_info.oid = index_info.indrelid
          JOIN pg_namespace namespace_info ON namespace_info.oid = table_info.relnamespace
          JOIN unnest(index_info.indkey) WITH ORDINALITY AS key_info(attnum, position) ON TRUE
          JOIN pg_attribute attribute ON attribute.attrelid = table_info.oid AND attribute.attnum = key_info.attnum
          WHERE namespace_info.nspname = 'public' AND table_info.relname = $1 AND index_info.indisprimary
          ORDER BY key_info.position`, [targetTable]),
      ]);
      const allowedColumns = new Set(columnResult.rows.map((row) => row.column_name));
      if (allowedColumns.size === 0) throw new AppError(`Target table "${targetTable}" does not exist`, 400);
      const invalidColumns = headers.filter((header) => !allowedColumns.has(header));
      if (invalidColumns.length > 0) {
        throw new AppError(`CSV contains unsupported columns: ${invalidColumns.join(", ")}`, 400);
      }

      const primaryKey = primaryKeyResult.rows.map((row) => row.column_name);
      const quotedHeaders = headers.map(quoteIdentifier);
      const updateColumns = headers.filter((header) => !primaryKey.includes(header));
      const conflictClause = primaryKey.length > 0 && primaryKey.every((column) => headers.includes(column))
        ? updateColumns.length > 0
          ? `ON CONFLICT (${primaryKey.map(quoteIdentifier).join(", ")}) DO UPDATE SET ${updateColumns.map((column) => `${quoteIdentifier(column)} = EXCLUDED.${quoteIdentifier(column)}`).join(", ")}`
          : `ON CONFLICT (${primaryKey.map(quoteIdentifier).join(", ")}) DO NOTHING`
        : "ON CONFLICT DO NOTHING";

      await client.query("BEGIN");
      for (const record of records) {
        const values = record.map((value) => value === "\\N" ? null : value === "\\\\N" ? "\\N" : value);
        const placeholders = values.map((_, index) => `$${index + 1}`);
        await client.query(`INSERT INTO public.${quoteIdentifier(targetTable)} (${quotedHeaders.join(", ")})
          VALUES (${placeholders.join(", ")}) ${conflictClause}`, values);
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }
}

export { RECOVERY_LOCK_KEY };
export default RecoveryRepository;
