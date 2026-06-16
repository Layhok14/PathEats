import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
//   ,
  // Add SSL settings required for secure cloud database hosting (like Supabase)
//   ssl: process.env.NODE_ENV === 'development' ? { rejectUnauthorized: false }
//   ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Supabase PostgreSQL connection failure:', err.stack);
  } else {
    console.log('Connected to Supabase PostgreSQL (PostGIS Enabled)');
  }
});
export default {
  query: (text, params) => pool.query(text, params),
};