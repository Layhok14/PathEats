import db from "../config/db.js";
import BaseRepository from "./BaseRepository.js";

class VendorRepository extends BaseRepository {
  constructor() {
    super("places");
  }

  /**
   * Find all stalls owned by a vendor.
   */
  async findByOwner(ownerId) {
    const { rows } = await db.query(
      `SELECT p.*, pc.slug AS category_slug, pc.name AS category_name
       FROM places p
       LEFT JOIN place_categories pc ON pc.id = p.category_id
       WHERE p.owner_id = $1
       ORDER BY p.created_at DESC`,
      [ownerId]
    );
    return rows;
  }

  /**
   * Find a single stall by id, ensuring ownership.
   */
  async findOwnedById(id, ownerId) {
    const { rows } = await db.query(
      `SELECT p.*, pc.slug AS category_slug, pc.name AS category_name
       FROM places p
       LEFT JOIN place_categories pc ON pc.id = p.category_id
       WHERE p.id = $1 AND p.owner_id = $2
       LIMIT 1`,
      [id, ownerId]
    );
    return rows[0] || null;
  }

  /**
   * Create a new stall (places row).
   */
  async create(data) {
    const { rows } = await db.query(
      `INSERT INTO places (owner_id, category_id, name, description, address, photo_url, price_range, location, status, is_open)
       VALUES ($1, $2, $3, $4, $5, $6, $7, ST_SetSRID(ST_MakePoint($8, $9), 4326)::geography, $10, $11)
       RETURNING *`,
      [
        data.owner_id,
        data.category_id,
        data.name,
        data.description || null,
        data.address || null,
        data.photo_url || null,
        data.price_range || null,
        data.longitude || 104.9282,
        data.latitude || 11.5564,
        data.status || "active",
        data.is_open !== false,
      ]
    );
    return rows[0];
  }

  /**
   * Update a stall.
   */
  async update(id, data) {
    const setClauses = [];
    const values = [];
    let idx = 1;

    const fields = {
      name: data.name,
      description: data.description,
      address: data.address,
      photo_url: data.photo_url,
      price_range: data.price_range,
      status: data.status,
      is_open: data.is_open,
    };

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        setClauses.push(`${key} = $${idx++}`);
        values.push(value);
      }
    }

    if (data.latitude !== undefined && data.longitude !== undefined) {
      setClauses.push(`location = ST_SetSRID(ST_MakePoint($${idx++}, $${idx++}), 4326)::geography`);
      values.push(data.longitude, data.latitude);
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(id);

    const { rows } = await db.query(
      `UPDATE places SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0] || null;
  }

  /**
   * Get dashboard metrics for a vendor.
   */
  async getDashboardMetrics(ownerId) {
    const { rows } = await db.query(
      `SELECT
         COUNT(*)::int AS total_stalls,
         COUNT(*) FILTER (WHERE status = 'active' AND is_open = TRUE)::int AS open_stalls,
         COALESCE(AVG(rating), 0)::float AS avg_rating
       FROM places
       WHERE owner_id = $1`,
      [ownerId]
    );
    return rows[0];
  }

  /**
   * Get dashboard order stats (if orders table exists).
   */
  async getOrderStats(ownerId) {
    try {
      const { rows } = await db.query(
        `SELECT
           COUNT(*)::int AS total_orders,
           COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_orders
         FROM orders o
         JOIN places p ON p.id = o.place_id
         WHERE p.owner_id = $1`,
        [ownerId]
      );
      return rows[0];
    } catch {
      return { total_orders: 0, pending_orders: 0 };
    }
  }
}

export default VendorRepository;
