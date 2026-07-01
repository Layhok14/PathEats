import bcrypt from 'bcryptjs';
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.argv[2] });
const hash = await bcrypt.hash('vendor123', 12);
await pool.query(`UPDATE users SET password_hash = $1 WHERE email = 'vendor@patheat.app'`, [hash]);
console.log('Done. vendor@patheat.app password set to vendor123');
await pool.end();
