import { readFile, rm, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { pool } from "../config/db.js";
import AppError from "../utils/AppError.js";
import { inspectPostgresToc } from "../utils/backupToc.js";
import {
  BACKUP_STORAGE_DIR,
  PREFERRED_BACKUP_TABLE_ORDER,
  ensureBackupStorageDir,
  getPublicTableNames,
  postgresToolConfig,
  quoteIdent,
  runPostgresTool,
  validateIdentifier,
  verifyLogicalBackupArtifact,
} from "./backupService.js";

export async function inspectPostgresDump(dumpPath) {
  const [{ stdout }, client] = await Promise.all([
    runPostgresTool("pg_restore", ["--list", dumpPath]),
    pool.connect(),
  ]);
  try {
    return inspectPostgresToc(stdout, await getPublicTableNames(client));
  } finally {
    client.release();
  }
}

async function createSafetyBackup() {
  await ensureBackupStorageDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `pre-restore-safety-${timestamp}.dump`;
  const filePath = path.join(BACKUP_STORAGE_DIR, fileName);
  await runPostgresTool("pg_dump", [
    "--format=custom",
    "--no-owner",
    "--no-privileges",
    "--no-comments",
    "--schema=public",
    "--file",
    filePath,
  ], { timeoutMs: 300000 });
  return { fileName, filePath };
}

async function replacePublicSchemaFromDump(dumpPath) {
  const { databaseName } = postgresToolConfig();
  const { stdout: toc } = await runPostgresTool("pg_restore", ["--list", dumpPath]);
  const restoreListPath = path.join(path.dirname(dumpPath), `restore-${randomUUID()}.list`);
  const restoreList = toc
    .split(/\r?\n/)
    .filter((line) => !/\bTABLE DATA\s+public\s+spatial_ref_sys\b/i.test(line))
    .join("\n");
  await writeFile(restoreListPath, restoreList, "utf-8");

  try {
    await pool.query("DROP SCHEMA IF EXISTS public CASCADE");
    await pool.query("CREATE SCHEMA public");
    await pool.query("CREATE EXTENSION IF NOT EXISTS postgis");
    await pool.query("CREATE EXTENSION IF NOT EXISTS pgcrypto");
    await runPostgresTool("pg_restore", [
      "--schema=public",
      `--use-list=${restoreListPath}`,
      "--no-owner",
      "--no-privileges",
      "--single-transaction",
      "--exit-on-error",
      `--dbname=${databaseName}`,
      dumpPath,
    ], { timeoutMs: 300000 });
  } finally {
    await rm(restoreListPath, { force: true }).catch(() => {});
  }
}

export async function restoreFullPostgresDump(dumpPath) {
  let safety;
  try {
    safety = await createSafetyBackup();
  } catch (err) {
    throw new AppError(`Pre-restore safety backup failed; database was not modified: ${err.message}`, 500);
  }

  try {
    await replacePublicSchemaFromDump(dumpPath);
    await rm(safety.filePath, { force: true }).catch(() => {});
    return { mode: "full", restoredTables: null };
  } catch (restoreError) {
    try {
      await replacePublicSchemaFromDump(safety.filePath);
      await rm(safety.filePath, { force: true }).catch(() => {});
    } catch (rollbackError) {
      const error = new AppError(
        `Restore failed and automatic rollback also failed. Safety backup retained as ${safety.fileName}. Restore error: ${restoreError.message}. Rollback error: ${rollbackError.message}`,
        500
      );
      error.safetyBackupFileName = safety.fileName;
      error.safetyBackupPath = safety.filePath;
      throw error;
    }
    throw new AppError(`Restore failed; the original database was restored automatically. ${restoreError.message}`, 500);
  }
}

export async function getRestoreMetadata(client, tableName) {
  validateIdentifier(tableName, "Restore table");
  const [columnsResult, primaryKeyResult] = await Promise.all([
    client.query(
      `SELECT column_name, is_identity
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = $1 AND is_generated = 'NEVER'
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
  if (columnsResult.rows.length === 0) throw new AppError(`Target table "${tableName}" does not exist`, 400);
  return {
    columns: columnsResult.rows.map((row) => row.column_name),
    primaryKey: primaryKeyResult.rows.map((row) => row.column_name),
    hasIdentity: columnsResult.rows.some((row) => row.is_identity === "YES"),
  };
}

export function buildConflictClause(columns, primaryKey) {
  if (primaryKey.length === 0) return "ON CONFLICT DO NOTHING";
  const updates = columns.filter((column) => !primaryKey.includes(column));
  const target = primaryKey.map(quoteIdent).join(", ");
  if (updates.length === 0) return `ON CONFLICT (${target}) DO NOTHING`;
  return `ON CONFLICT (${target}) DO UPDATE SET ${updates.map((column) => `${quoteIdent(column)} = EXCLUDED.${quoteIdent(column)}`).join(", ")}`;
}

async function resetOwnedSequences(client, tableName, columns) {
  for (const column of columns) {
    const sequenceResult = await client.query("SELECT pg_get_serial_sequence($1, $2) AS sequence_name", [`public.${tableName}`, column]);
    const sequenceName = sequenceResult.rows[0]?.sequence_name;
    if (!sequenceName) continue;
    await client.query(
      `SELECT setval($1::regclass, COALESCE(MAX(${quoteIdent(column)}), 1), MAX(${quoteIdent(column)}) IS NOT NULL)
       FROM public.${quoteIdent(tableName)}`,
      [sequenceName]
    );
  }
}

function orderedTables(tableNames) {
  const order = new Map(PREFERRED_BACKUP_TABLE_ORDER.map((name, index) => [name, index]));
  return [...tableNames].sort((a, b) => (order.get(a) ?? Number.MAX_SAFE_INTEGER) - (order.get(b) ?? Number.MAX_SAFE_INTEGER));
}

export async function restoreLogicalBackup(artifactInput) {
  const artifact = verifyLogicalBackupArtifact(artifactInput);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let restoredRows = 0;
    for (const table of orderedTables(artifact.tables.map((entry) => entry.name)).map((name) => artifact.tables.find((entry) => entry.name === name))) {
      validateIdentifier(table.name, "Restore table");
      if (!Array.isArray(table.rows)) throw new AppError(`Logical backup table "${table.name}" has invalid rows`, 400);
      const metadata = await getRestoreMetadata(client, table.name);
      const requestedColumns = Array.isArray(table.columns) ? table.columns : [];
      const columns = requestedColumns.filter((column) => metadata.columns.includes(column));
      if (columns.length !== requestedColumns.length || columns.length === 0) {
        throw new AppError(`Logical backup columns do not match table "${table.name}"`, 400);
      }
      if (table.rows.length === 0) continue;
      const columnList = columns.map(quoteIdent).join(", ");
      const conflict = buildConflictClause(columns, metadata.primaryKey);
      const result = await client.query(
        `INSERT INTO public.${quoteIdent(table.name)} (${columnList}) ${metadata.hasIdentity ? "OVERRIDING SYSTEM VALUE" : ""}
         SELECT ${columnList}
         FROM jsonb_populate_recordset(NULL::public.${quoteIdent(table.name)}, $1::jsonb)
         ${conflict}`,
        [JSON.stringify(table.rows)]
      );
      restoredRows += result.rowCount || 0;
      await resetOwnedSequences(client, table.name, columns);
    }
    await client.query("COMMIT");
    return { mode: "logical", restoredTables: artifact.tables.map((table) => table.name), restoredRows };
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function restorePartialPostgresDump(dumpPath, tableNames) {
  if (!Array.isArray(tableNames) || tableNames.length === 0) throw new AppError("Partial dump contains no tables", 400);
  const stagingSchema = `restore_${randomUUID().replace(/-/g, "")}`;
  const sqlPath = path.join(path.dirname(dumpPath), "partial-data.sql");
  const client = await pool.connect();
  try {
    const currentTables = new Set(await getPublicTableNames(client));
    const missing = tableNames.filter((tableName) => !currentTables.has(tableName));
    if (missing.length > 0) throw new AppError(`Partial restore requires existing target tables: ${missing.join(", ")}`, 400);

    await client.query(`CREATE SCHEMA ${quoteIdent(stagingSchema)}`);
    for (const tableName of tableNames) {
      validateIdentifier(tableName, "Restore table");
      await client.query(
        `CREATE TABLE ${quoteIdent(stagingSchema)}.${quoteIdent(tableName)}
         (LIKE public.${quoteIdent(tableName)} INCLUDING DEFAULTS INCLUDING GENERATED INCLUDING IDENTITY)`
      );
    }

    await runPostgresTool("pg_restore", [
      "--data-only",
      "--schema=public",
      "--no-owner",
      "--no-privileges",
      "--file",
      sqlPath,
      dumpPath,
    ], { timeoutMs: 300000 });
    let sql = await readFile(sqlPath, "utf-8");
    for (const tableName of tableNames) {
      const bare = escapeRegExp(tableName);
      sql = sql.replace(new RegExp(`COPY\\s+public\\.${bare}\\b`, "g"), `COPY ${quoteIdent(stagingSchema)}.${quoteIdent(tableName)}`);
      sql = sql.replace(new RegExp(`COPY\\s+public\\."${bare}"(?=\\s|\\()`, "g"), `COPY ${quoteIdent(stagingSchema)}.${quoteIdent(tableName)}`);
    }
    sql = sql.replace(/^SELECT pg_catalog\.setval\([^;]+;\s*$/gm, "");
    if (/COPY\s+public\./i.test(sql)) throw new AppError("Partial restore contains an unexpected public table", 400);
    await writeFile(sqlPath, sql, "utf-8");

    const { databaseName } = postgresToolConfig();
    await runPostgresTool("psql", ["--set=ON_ERROR_STOP=1", `--dbname=${databaseName}`, "--file", sqlPath], { timeoutMs: 300000 });

    await client.query("BEGIN");
    for (const tableName of orderedTables(tableNames)) {
      const metadata = await getRestoreMetadata(client, tableName);
      const columns = metadata.columns;
      const columnList = columns.map(quoteIdent).join(", ");
      await client.query(
        `INSERT INTO public.${quoteIdent(tableName)} (${columnList}) ${metadata.hasIdentity ? "OVERRIDING SYSTEM VALUE" : ""}
         SELECT ${columnList} FROM ${quoteIdent(stagingSchema)}.${quoteIdent(tableName)}
         ${buildConflictClause(columns, metadata.primaryKey)}`
      );
      await resetOwnedSequences(client, tableName, columns);
    }
    await client.query("COMMIT");
    return { mode: "partial", restoredTables: tableNames };
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    await client.query(`DROP SCHEMA IF EXISTS ${quoteIdent(stagingSchema)} CASCADE`).catch(() => {});
    client.release();
    await rm(sqlPath, { force: true }).catch(() => {});
  }
}
