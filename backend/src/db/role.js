import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import db from '../config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const SEED_USERS = [
  { email: process.env.SEED_CONSUMER_EMAIL, password: process.env.SEED_CONSUMER_PASSWORD, label: 'CONSUMER' },
  { email: process.env.SEED_VENDOR_EMAIL,   password: process.env.SEED_VENDOR_PASSWORD,   label: 'VENDOR' },
  { email: process.env.SEED_ADMIN_EMAIL,    password: process.env.SEED_ADMIN_PASSWORD,    label: 'GLOBAL_ADMIN' },
  { email: process.env.SEED_DEV_EMAIL,      password: process.env.SEED_DEV_PASSWORD,      label: 'DEVELOPER_ADMIN' },
];

async function run() {
  console.log('Setting up roles and seed user passwords...\n');

  // 1. Hash each password and update the user in the database
  for (const u of SEED_USERS) {
    if (!u.email || !u.password) {
      console.warn(`  ⚠  ${u.label}: missing email or password in .env, skipping`);
      continue;
    }
    const hash = await bcrypt.hash(u.password, 12);
    const { rowCount } = await db.query(
      `UPDATE users SET password_hash = $1 WHERE email = $2`,
      [hash, u.email]
    );
    if (rowCount > 0) {
      console.log(`  ✓  ${u.label}: ${u.email}  (password updated)`);
    } else {
      console.warn(`  ⚠  ${u.label}: ${u.email} not found in DB — run seed.js first`);
    }
  }

  // 2. Run roles.sql for database permissions
  const sqlPath = path.join(__dirname, 'roles.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  if (sql.trim()) {
    try {
      await db.query(sql);
      console.log('\n  ✓  Database permissions applied (roles.sql)');
    } catch (err) {
      console.error('\n  ✗  Failed to apply roles.sql:', err.message);
    }
  }

  console.log('\nDone. Users can now log in with the passwords in .env');
}

run().catch((err) => {
  console.error('role.js failed:', err);
  process.exit(1);
});
