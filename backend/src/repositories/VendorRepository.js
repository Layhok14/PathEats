import db from "../config/db.js";

const menuItemCategory = (cat) => {
  const norm = {
    snack: "snack", snacks: "snack", "main course": "main course",
    main: "main course", drink: "drink", drinks: "drink",
    dessert: "dessert", desserts: "dessert",
  };
  return norm[(cat ?? "").toLowerCase().trim()] || "snack";
};

class VendorRepository {

  async findByOwner(ownerId) {
    const { rows } = await db.query(
      `SELECT p.id, p.name, p.description, p.address, p.photo_url,
              p.price_range, p.rating_avg, p.rating_count, p.is_open,
              p.status, p.created_at, p.updated_at,
              ST_Y(p.location::geometry) AS lat,
              ST_X(p.location::geometry) AS lng,
              pc.slug AS category_slug, pc.name AS category_name,
              p.category_id
       FROM places p
       LEFT JOIN place_categories pc ON pc.id = p.category_id
       WHERE p.owner_id = $1
       ORDER BY p.created_at DESC`,
      [ownerId]
    );
    return rows;
  }

  async findOwnedById(id, ownerId) {
    const { rows } = await db.query(
      `SELECT p.id, p.name, p.description, p.address, p.photo_url,
              p.price_range, p.rating_avg, p.rating_count, p.is_open,
              p.status, p.created_at, p.updated_at,
              ST_Y(p.location::geometry) AS lat,
              ST_X(p.location::geometry) AS lng,
              pc.slug AS category_slug, pc.name AS category_name,
              p.category_id
       FROM places p
       LEFT JOIN place_categories pc ON pc.id = p.category_id
       WHERE p.id = $1 AND p.owner_id = $2
       LIMIT 1`,
      [id, ownerId]
    );
    return rows[0] || null;
  }

  async findCategory(input) {
    const { rows } = await db.query(
      `SELECT id FROM place_categories WHERE slug = $1 OR name = $1 LIMIT 1`,
      [input]
    );
    return rows[0] || null;
  }

  async create(data) {
    const { rows } = await db.query(
      `INSERT INTO places (owner_id, category_id, name, description, address, photo_url, price_range, location, status, is_open)
       VALUES ($1, $2, $3, $4, $5, $6, $7, ST_SetSRID(ST_MakePoint($8, $9), 4326)::geography, $10, $11)
       RETURNING id, name, description, address, photo_url, price_range, rating_avg, rating_count, is_open, status, created_at, updated_at, category_id,
                 ST_Y(location::geometry) AS lat, ST_X(location::geometry) AS lng`,
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
        "APPROVED",
        data.is_open !== false,
      ]
    );
    return rows[0];
  }

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
      is_open: data.status !== undefined ? data.status === "open" : data.is_open,
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
      `UPDATE places SET ${setClauses.join(", ")} WHERE id = $${idx}
       RETURNING id, name, description, address, photo_url, price_range, rating_avg, rating_count, is_open, status, created_at, updated_at, category_id,
                 ST_Y(location::geometry) AS lat, ST_X(location::geometry) AS lng`,
      values
    );
    return rows[0] || null;
  }

  async findById(id) {
    const { rows } = await db.query(
      `SELECT p.*, pc.slug AS category_slug, pc.name AS category_name
       FROM places p
       LEFT JOIN place_categories pc ON pc.id = p.category_id
       WHERE p.id = $1
       LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }

  async deleteStall(id, ownerId) {
    const { rowCount } = await db.query(
      `DELETE FROM places WHERE id = $1 AND owner_id = $2`,
      [id, ownerId]
    );
    return rowCount > 0;
  }

  async updateStatus(id, status) {
    const { rows } = await db.query(
      `UPDATE places SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return rows[0] || null;
  }

  async getDashboardMetrics(ownerId) {
    const { rows } = await db.query(
      `SELECT
         COUNT(*)::int AS total_stalls,
         COUNT(*) FILTER (WHERE status = 'APPROVED' AND is_open = TRUE)::int AS open_stalls,
         COALESCE(AVG(rating_avg), 0)::float AS avg_rating
       FROM places
       WHERE owner_id = $1`,
      [ownerId]
    );
    return rows[0];
  }

  async getReviews(ownerId) {
    const { rows } = await db.query(
      `SELECT r.id, r.rating AS stars, r.body, r.created_at,
              u.first_name || ' ' || u.last_name AS user_name,
              p.name AS place_name, p.id AS place_id
       FROM reviews r
       JOIN places p ON p.id = r.place_id
       JOIN users u ON u.id = r.user_id
       WHERE p.owner_id = $1
       ORDER BY r.created_at DESC`,
      [ownerId]
    );
    return rows;
  }

  async getAllMenuItems(ownerId) {
    const { rows } = await db.query(
      `SELECT mi.* FROM menu_items mi
       JOIN places p ON p.id = mi.place_id
       WHERE p.owner_id = $1
       ORDER BY mi.created_at DESC`,
      [ownerId]
    );
    return rows;
  }

  async getMenuItems(placeId, ownerId) {
    const { rows } = await db.query(
      `SELECT mi.* FROM menu_items mi
       JOIN places p ON p.id = mi.place_id
       WHERE mi.place_id = $1 AND p.owner_id = $2
       ORDER BY mi.created_at DESC`,
      [placeId, ownerId]
    );
    return rows;
  }

  async updateMenuItemGlobal(ownerId, itemId, data) {
    const setClauses = [];
    const values = [];
    let idx = 1;

    const image_url = data.image_url || data.imageUrl;
    const fields = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category !== undefined ? menuItemCategory(data.category) : undefined,
      image_url,
      is_available: data.is_available,
    };

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        setClauses.push(`${key} = $${idx++}`);
        values.push(value);
      }
    }

    if (setClauses.length === 0) return null;
    values.push(itemId, ownerId);

    const { rows } = await db.query(
      `UPDATE menu_items mi
       SET ${setClauses.join(", ")}
       FROM places p
       WHERE mi.id = $${idx} AND mi.place_id = p.id AND p.owner_id = $${idx + 1}
       RETURNING mi.*`,
      values
    );
    return rows[0] || null;
  }

  async deleteMenuItemGlobal(ownerId, itemId) {
    const { rowCount } = await db.query(
      `DELETE FROM menu_items mi
       USING places p
       WHERE mi.id = $1 AND mi.place_id = p.id AND p.owner_id = $2`,
      [itemId, ownerId]
    );
    return rowCount > 0;
  }

  async createMenuItem(placeId, ownerId, data) {
    const image_url = data.image_url || data.imageUrl;
    const { rows } = await db.query(
      `INSERT INTO menu_items (place_id, name, description, price, category, image_url, is_available)
       SELECT $1, $2, $3, $4, $5, $6, $7
       WHERE EXISTS (
         SELECT 1 FROM places WHERE id = $1 AND owner_id = $8
       )
       RETURNING *`,
      [
        placeId,
        data.name,
        data.description || null,
        data.price,
        menuItemCategory(data.category),
        image_url || null,
        data.is_available !== false,
        ownerId,
      ]
    );
    return rows[0] || null;
  }

  async updateMenuItem(placeId, itemId, ownerId, data) {
    const setClauses = [];
    const values = [];
    let idx = 1;

    const image_url = data.image_url || data.imageUrl;
    const fields = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category !== undefined ? menuItemCategory(data.category) : undefined,
      image_url,
      is_available: data.is_available,
    };

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        setClauses.push(`${key} = $${idx++}`);
        values.push(value);
      }
    }

    if (setClauses.length === 0) return null;
    values.push(itemId, placeId, ownerId);

    const { rows } = await db.query(
      `UPDATE menu_items mi
       SET ${setClauses.join(", ")}
       FROM places p
       WHERE mi.id = $${idx} AND mi.place_id = $${idx + 1}
         AND p.id = $${idx + 1} AND p.owner_id = $${idx + 2}
       RETURNING mi.*`,
      values
    );
    return rows[0] || null;
  }

  async deleteMenuItem(placeId, itemId, ownerId) {
    const { rowCount } = await db.query(
      `DELETE FROM menu_items mi
       USING places p
       WHERE mi.id = $1 AND mi.place_id = $2
         AND p.id = $2 AND p.owner_id = $3`,
      [itemId, placeId, ownerId]
    );
    return rowCount > 0;
  }
}

export default VendorRepository;
