import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seeder_file = path.join(__dirname, 'seed-data.sql');

async function runSeed() {
    console.log('Reading seed file...');
    const sql = fs.readFileSync(seeder_file, 'utf8');
    if(!sql.trim()){
        console.warn('file is empty');
        process.exit(0);
    }
    try{
    await db.transaction(async(client)=>{
        await client.query(sql);
    });

    }catch(err){
        console.error("Error loading data: ",err.message);
    }
}
runSeed();
