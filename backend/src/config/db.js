import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  query_timeout: 5000,
  ssl: process.env.DATABASE_URL?.includes("supabase.co")
    ? { rejectUnauthorized: false }
    : undefined,
});

pool.query("SELECT NOW()", (err) => {
  if (err) {
    console.error("Supabase PostgreSQL connection failure:", err.message);
  } else {
    console.log("Connected to Supabase PostgreSQL (PostGIS Enabled)");
  }
});

export default {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};
