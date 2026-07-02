import bcrypt from "bcryptjs";
import fs from "fs";
import db from "../config/db.js";

export const DEFAULT_PASSWORD = "vendor123";

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function hashUserPassword(email, password) {
  const hash = await hashPassword(password);
  const { rowCount } = await db.query(
    `UPDATE users SET password_hash = $1 WHERE email = $2`,
    [hash, email]
  );
  if (rowCount === 0) {
    console.warn(`  ⚠  ${email} not found in DB`);
    return null;
  }
  return { email, password };
}

export async function hashAllPendingPasswords(defaultPassword = DEFAULT_PASSWORD) {
  const { rows: pending } = await db.query(
    `SELECT email, role_scope FROM users WHERE password_hash = 'pending'`
  );
  if (pending.length === 0) return [];

  const hash = await hashPassword(defaultPassword);
  const emails = pending.map((r) => r.email);
  await db.query(
    `UPDATE users SET password_hash = $1 WHERE email = ANY($2::text[])`,
    [hash, emails]
  );

  for (const row of pending) {
    console.log(`  ✓  ${row.role_scope}: ${row.email}  (password set to default)`);
  }

  return pending.map((r) => ({ email: r.email, password: defaultPassword, role: r.role_scope }));
}

export function writeCredentialsFile(credentials, filePath) {
  const lines = credentials.map((c) => `${c.role}\t${c.email}\t${c.password}`);
  fs.writeFileSync(filePath, ["Role\tEmail\tPassword", ...lines, ""].join("\n"), "utf8");
  console.log(`  ✓  Credentials saved to ${filePath}`);
}
