import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = path.join(__dirname, "migrations");
const INDEXING_FILE = path.join(__dirname, "indexing.sql");
const RLS_POLICY_FILE = path.join(__dirname, "supabase-rls-policies.sql");

const includeRls = process.argv.includes("--include-rls");

async function readSqlFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const sqlFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .sort();

  return Promise.all(
    sqlFiles.map(async (fileName) => ({
      name: fileName,
      sql: await fs.readFile(path.join(directory, fileName), "utf8"),
    }))
  );
}

async function applySqlFile(client, file) {
  console.log(`Applying ${file.name}`);
  await client.query(file.sql);
}

async function readOptionalSqlFile(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}

async function run() {
  const client = await pool.connect();

  try {
    const migrationFiles = await readSqlFiles(MIGRATIONS_DIR);

    for (const file of migrationFiles) {
      await applySqlFile(client, file);
    }

    const indexingSql = await readOptionalSqlFile(INDEXING_FILE);
    if (indexingSql.trim()) {
      await applySqlFile(client, {
        name: path.basename(INDEXING_FILE),
        sql: indexingSql,
      });
    }

    if (includeRls) {
      await applySqlFile(client, {
        name: path.basename(RLS_POLICY_FILE),
        sql: await fs.readFile(RLS_POLICY_FILE, "utf8"),
      });
    } else {
      console.log("Skipped Supabase RLS policies. Re-run with --include-rls after auth IDs are aligned.");
    }

    console.log("Database migrations completed.");
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error("Database migration failed.");
  console.error(error);
  process.exitCode = 1;
});
