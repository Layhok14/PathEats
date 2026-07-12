import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seeder_file = path.join(__dirname, 'seed.sql');
const indexing_file = path.join(__dirname, 'indexes.sql');

async function runSeed() {
  console.log('Reading seed file...');
  const sql = fs.readFileSync(seeder_file, 'utf8');
  const indexingSql = fs.existsSync(indexing_file)
    ? fs.readFileSync(indexing_file, 'utf8')
    : "";
  if (!sql.trim()) {
    console.warn('file is empty');
    await pool.end();
    process.exit(0);
  }
  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("COMMIT");
      console.log('Seed completed successfully');
      if (indexingSql.trim()) {
        console.log('Applying indexes...');
        await client.query(indexingSql);
        console.log('Indexes applied successfully');
      }
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error loading data: ", err.message);
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Seed failed: ", err.message);
  }
  await pool.end();
  process.exit(0);
}
runSeed();
