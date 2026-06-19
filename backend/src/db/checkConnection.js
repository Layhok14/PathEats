import db from "../config/db.js";

const databaseUrl = process.env.DATABASE_URL || "";

if (!databaseUrl) {
  console.error("DATABASE_URL is missing from backend/.env");
  process.exit(1);
}

if (databaseUrl.includes("YOUR_") || databaseUrl.includes("your-project")) {
  console.error("DATABASE_URL still contains placeholder text. Replace it with your real Supabase connection string.");
  process.exit(1);
}

try {
  const result = await db.query("SELECT NOW() AS now");
  console.log(`Database connected: ${result.rows[0].now.toISOString()}`);
  process.exit(0);
} catch (error) {
  console.error(`Database connection failed: ${error.message}`);
  process.exit(1);
}
