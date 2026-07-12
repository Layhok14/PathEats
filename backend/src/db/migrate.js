import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = path.join(__dirname, "migrations");
const INDEXING_FILE = path.join(__dirname, "indexes.sql");
const RLS_POLICY_FILE = path.join(__dirname, "policies.sql");

const skipPolicies = process.argv.includes("--skip-policies");
const onlyArgument = process.argv.find((argument) => argument.startsWith("--only="));
const onlyFileNames = onlyArgument
  ? new Set(onlyArgument.slice("--only=".length).split(",").map((name) => name.trim()).filter(Boolean))
  : null;

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
    const allMigrationFiles = await readSqlFiles(MIGRATIONS_DIR);
    const migrationFiles = onlyFileNames
      ? allMigrationFiles.filter((file) => onlyFileNames.has(file.name))
      : allMigrationFiles;

    if (onlyFileNames && migrationFiles.length !== onlyFileNames.size) {
      const found = new Set(migrationFiles.map((file) => file.name));
      const missing = [...onlyFileNames].filter((name) => !found.has(name));
      throw new Error(`Migration files not found: ${missing.join(", ")}`);
    }

    for (const file of migrationFiles) {
      await applySqlFile(client, file);
    }

    const indexingSql = onlyFileNames ? "" : await readOptionalSqlFile(INDEXING_FILE);
    if (indexingSql.trim()) {
      await applySqlFile(client, {
        name: path.basename(INDEXING_FILE),
        sql: indexingSql,
      });
    }

    if (!skipPolicies && !onlyFileNames) {
      await applySqlFile(client, {
        name: path.basename(RLS_POLICY_FILE),
        sql: await fs.readFile(RLS_POLICY_FILE, "utf8"),
      });
    } else if (skipPolicies) {
      console.log("Skipped policies and data integrity constraints (--skip-policies).");
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
