// seed.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlFilePath = path.join(__dirname, 'seed_patheats_master_all_tables(1).sql'); // Ensure this matches your filename

async function runSeed() {
  try {
    console.log('Reading seed file...');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('Executing seed...');
    await db.query(sql);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

runSeed();