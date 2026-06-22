// Run this AFTER seed-data.sql to fix demo user passwords.
// Uses passwords matching backend/.env
import bcrypt from "bcryptjs";
import db from "../config/db.js";

async function fix() {
  const consumerHash = await bcrypt.hash(process.env.SEED_CONSUMER_PASSWORD || "consumer123", 10);
  const vendorHash = await bcrypt.hash(process.env.SEED_VENDOR_PASSWORD || "vendor123", 10);
  const adminHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || "admin123", 10);
  const devHash = await bcrypt.hash(process.env.SEED_DEV_PASSWORD || "dev123", 10);

  await db.query(
    `UPDATE users SET password_hash = CASE email
       WHEN 'consumer@patheat.app' THEN $1
       WHEN 'vendor@patheat.app' THEN $2
       WHEN 'vendor2@patheat.app' THEN $2
       WHEN 'admin@patheat.app' THEN $3
       WHEN 'dev@patheat.app' THEN $4
       ELSE password_hash
     END`,
    [consumerHash, vendorHash, adminHash, devHash]
  );

  await db.query(
    `UPDATE places SET status = 'APPROVED', is_open = TRUE WHERE owner_id IS NOT NULL`
  );

  console.log("Passwords fixed. All vendor stalls APPROVED and OPEN.");
  console.log("Demo login:");
  console.log("  consumer@patheat.app / " + (process.env.SEED_CONSUMER_PASSWORD || "consumer123"));
  console.log("  vendor@patheat.app  / " + (process.env.SEED_VENDOR_PASSWORD || "vendor123"));
  console.log("  admin@patheat.app   / " + (process.env.SEED_ADMIN_PASSWORD || "admin123"));
  console.log("  dev@patheat.app     / " + (process.env.SEED_DEV_PASSWORD || "dev123"));
  process.exit(0);
}

fix().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
