import db from "../config/db.js";

class PlaceRepository {

  async findAllApproved() {
    const { rows } = await db.query(
      `SELECT p.id, p.name, p.description,
              ST_Y(p.location::geometry) AS lat,
              ST_X(p.location::geometry) AS lng,
              p.photo_url, p.price_range, p.rating_avg AS rating,
              p.rating_count, p.is_open AS open_now, p.address,
              pi.bucket_name AS image_bucket,
              pi.object_path AS image_path,
              pi.mime_type AS image_mime_type,
              pi.alt_text AS image_alt_text,
              pc.name AS category_name, pc.slug AS category_slug
       FROM places p
       LEFT JOIN place_categories pc ON pc.id = p.category_id
       LEFT JOIN LATERAL (
         SELECT bucket_name, object_path, mime_type, alt_text
         FROM place_images
         WHERE place_id = p.id
         ORDER BY is_primary DESC, sort_order ASC, created_at ASC
         LIMIT 1
       ) pi ON TRUE
       WHERE p.status = 'APPROVED'
       ORDER BY p.rating_avg DESC`
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await db.query(
      `SELECT p.id, p.name, p.description,
              ST_Y(p.location::geometry) AS lat,
              ST_X(p.location::geometry) AS lng,
              p.photo_url, p.price_range, p.rating_avg AS rating,
              p.rating_count, p.is_open AS open_now, p.address,
              pi.bucket_name AS image_bucket,
              pi.object_path AS image_path,
              pi.mime_type AS image_mime_type,
              pi.alt_text AS image_alt_text,
              pc.name AS category_name, pc.slug AS category_slug
       FROM places p
       LEFT JOIN place_categories pc ON pc.id = p.category_id
       LEFT JOIN LATERAL (
         SELECT bucket_name, object_path, mime_type, alt_text
         FROM place_images
         WHERE place_id = p.id
         ORDER BY is_primary DESC, sort_order ASC, created_at ASC
         LIMIT 1
       ) pi ON TRUE
       WHERE p.id = $1 AND p.status = 'APPROVED'
       LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }

  async getMenuItems(placeId) {
    const { rows } = await db.query(
      `SELECT mi.name, mi.price, mi.description, mi.category, mi.image_url,
              mii.bucket_name AS image_bucket,
              mii.object_path AS image_path,
              mii.mime_type AS image_mime_type,
              mii.alt_text AS image_alt_text
       FROM menu_items mi
       LEFT JOIN LATERAL (
         SELECT bucket_name, object_path, mime_type, alt_text
         FROM menu_item_images
         WHERE menu_item_id = mi.id
         ORDER BY is_primary DESC, sort_order ASC, created_at ASC
         LIMIT 1
       ) mii ON TRUE
       WHERE mi.place_id = $1 AND mi.is_available = TRUE
       ORDER BY mi.category, mi.name`,
      [placeId]
    );
    return rows;
  }

  async getMenuItemsForPlaces(placeIds) {
    if (placeIds.length === 0) return {};
    const { rows } = await db.query(
      `SELECT mi.place_id, mi.name, mi.price, mi.description, mi.category, mi.image_url,
              mii.bucket_name AS image_bucket,
              mii.object_path AS image_path,
              mii.mime_type AS image_mime_type,
              mii.alt_text AS image_alt_text
       FROM menu_items mi
       LEFT JOIN LATERAL (
         SELECT bucket_name, object_path, mime_type, alt_text
         FROM menu_item_images
         WHERE menu_item_id = mi.id
         ORDER BY is_primary DESC, sort_order ASC, created_at ASC
         LIMIT 1
       ) mii ON TRUE
       WHERE mi.place_id = ANY($1::uuid[]) AND mi.is_available = TRUE
       ORDER BY mi.category, mi.name`,
      [placeIds]
    );
    const grouped = {};
    for (const row of rows) {
      if (!grouped[row.place_id]) grouped[row.place_id] = [];
      grouped[row.place_id].push({
        name: row.name,
        price: row.price,
        description: row.description,
        category: row.category,
        image_url: row.image_url,
        image_bucket: row.image_bucket,
        image_path: row.image_path,
        image_mime_type: row.image_mime_type,
        image_alt_text: row.image_alt_text,
      });
    }
    return grouped;
  }

  async getReviews(placeId) {
    const { rows } = await db.query(
      `SELECT r.id, r.place_id AS vendor_id, r.user_id, r.rating AS stars,
              r.body, r.created_at,
              COALESCE(u.first_name || ' ' || u.last_name, 'Anonymous') AS user_name
       FROM reviews r
       LEFT JOIN users u ON u.id = r.user_id
       WHERE r.place_id = $1 AND r.deleted_at IS NULL
       ORDER BY r.created_at DESC`,
      [placeId]
    );
    return rows;
  }

  async createReview(placeId, userId, data) {
    const { rows } = await db.query(
      `INSERT INTO reviews (place_id, user_id, rating, body)
       VALUES ($1, $2, $3, $4)
       RETURNING id, place_id AS vendor_id, user_id, rating AS stars, body, created_at`,
      [placeId, userId, data.rating, data.body || null]
    );
    return rows[0] || null;
  }
}

export default PlaceRepository;
