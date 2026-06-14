import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432/patheat",
  ...(process.env.DATABASE_URL?.includes("supabase")
    ? { ssl: { rejectUnauthorized: false } }
    : {}),
});

pool.on("error", (err) => {
  console.error("Unexpected pool error:", err);
  process.exit(-1);
});

export default pool;
