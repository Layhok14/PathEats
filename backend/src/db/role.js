import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  DEFAULT_PASSWORD,
  hashUserPassword,
  hashAllPendingPasswords,
  writeCredentialsFile,
} from '../utils/passwordSeeder.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const CREDENTIALS_FILE = path.resolve(__dirname, '../../.seed-credentials.txt');

const SEED_USERS = [
  { email: process.env.SEED_CONSUMER_EMAIL, password: process.env.SEED_CONSUMER_PASSWORD, label: 'CONSUMER' },
  { email: process.env.SEED_VENDOR_EMAIL,   password: process.env.SEED_VENDOR_PASSWORD,   label: 'VENDOR' },
  { email: process.env.SEED_ADMIN_EMAIL,    password: process.env.SEED_ADMIN_PASSWORD,    label: 'GLOBAL_ADMIN' },
  { email: process.env.SEED_DEV_EMAIL,      password: process.env.SEED_DEV_PASSWORD,      label: 'DEVELOPER_ADMIN' },
  { email: process.env.SEED_BUSINESS_EMAIL, password: process.env.SEED_BUSINESS_PASSWORD, label: 'BUSINESS_ASSISTANCE' },
];

async function run() {
  console.log('Setting up roles and seed user passwords...\n');

  const credentials = [];

  // 1. Hash passwords for the 5 .env-defined accounts
  for (const u of SEED_USERS) {
    if (!u.email || !u.password) {
      console.warn(`  ${u.label}: missing email or password in .env, skipping`);
      continue;
    }
    const result = await hashUserPassword(u.email, u.password);
    if (result) {
      console.log(`  ${u.label}: ${u.email}  (password updated)`);
      credentials.push({ email: u.email, password: u.password, role: u.label });
    } else {
      console.warn(` ${u.label}: ${u.email} not found in DB — run seed.js first`);
    }
  }

  const pendingCredentials = await hashAllPendingPasswords(DEFAULT_PASSWORD);
  credentials.push(...pendingCredentials);

  // 3. Write all credentials to a file
  writeCredentialsFile(credentials, CREDENTIALS_FILE);

  console.log('\nDone. Users can now log in with the saved credentials.');
}

run().catch((err) => {
  console.error('role.js failed:', err);
  process.exit(1);
});
