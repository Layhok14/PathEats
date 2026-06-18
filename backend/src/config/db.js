import pg from 'pg';
import dotenv from 'dotenv';
import {paths} from '../utils/path.js'

dotenv.config({path: paths.env});

/**
 * Singleton database connection pool.
 *
 * WHY SINGLETON:
 * pg.Pool manages its own internal connection pool (default max: 10–20).
 * Creating multiple Pool instances would:
 *   - Waste memory
 *   - Hit the database connection limit
 *   - Lose connection pooling benefits
 * Only ONE Pool should ever exist per process.
 *
 * USAGE:
 *   import db from "../config/db.js";
 *   const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
 *
 * The Database class uses the Singleton pattern — the constructor
 * returns the same instance every time.
 */
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'development'
        ? { rejectUnauthorized: false }
        : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    Database.instance = this;
  }

  /** Run a query */
  async query(text, params) {
    return this.pool.query(text, params);
  }

  /** Get a dedicated client for transactions */
  async getClient() {
    return this.pool.connect();
  }

  /** Run queries inside a transaction with automatic rollback */
  async transaction(callback) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async testConnection() {
    try{
        const res = await this.pool.query("SELECT NOW()")
        console.log("Connected to Supabase PostgreSQL (PostGIS Enabled)");
    }catch(err){
        console.log(`error message: ${err.message}.`)
    }
  }
  
}

const db = new Database();
db.testConnection();

export default db;