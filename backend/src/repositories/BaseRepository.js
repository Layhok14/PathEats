import supabase from "../config/db.js";

/**
 * Abstract base repository.
 * Every domain repository extends this class.
 * This is the ONLY layer that calls the Supabase client.
 */
class BaseRepository {
  /**
   * @param {string} tableName — the Supabase table name, e.g. "users"
   */
  constructor(tableName) {
    if (new.target === BaseRepository) {
      throw new Error("BaseRepository cannot be instantiated directly — extend it");
    }
    this.table = tableName;
    this.supabase = supabase;
  }

  /**
   * Generic: fetch all rows (with optional filters).
   * Override in subclasses for domain-specific queries.
   */
  async findAll(filters = {}) {
    let query = this.supabase.from(this.table).select("*");
    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * Generic: fetch a single row by its primary key (assumed "id").
   */
  async findById(id) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  }

  /**
   * Generic: create a row.
   */
  async create(payload) {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert([{ ...payload, created_at: new Date().toISOString() }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  /**
   * Generic: update a row by its primary key.
   */
  async update(id, updates) {
    const { data, error } = await this.supabase
      .from(this.table)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  /**
   * Generic: delete a row by its primary key.
   */
  async remove(id) {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  }
}

export default BaseRepository;
