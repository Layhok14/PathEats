import bcrypt from "bcryptjs";
import db from "../config/db.js";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const firstName = process.env.ADMIN_FIRST_NAME || "Global";
const lastName = process.env.ADMIN_LAST_NAME || "Admin";

if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before running this script.");
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 12);

await db.query(
  `
  INSERT INTO users (email, password_hash, first_name, last_name, role_scope, is_banned)
  VALUES ($1,$2,$3,$4,'GLOBAL_ADMIN',false)
  ON CONFLICT (email)
  DO UPDATE SET password_hash = EXCLUDED.password_hash,
                first_name = EXCLUDED.first_name,
                last_name = EXCLUDED.last_name,
                role_scope = 'GLOBAL_ADMIN',
                is_banned = false
  `,
  [email.toLowerCase().trim(), passwordHash, firstName, lastName]
);

console.log(`GLOBAL_ADMIN ready: ${email}`);
process.exit(0);
