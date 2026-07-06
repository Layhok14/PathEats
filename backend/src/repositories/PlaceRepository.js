import db from "../config/db.js";
import AppError from "../utils/AppError.js";
import { sanitizeText } from "../utils/sanitize.js";

class PlaceRepository {

  async findAllApproved(limit = 100) {
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
       JOIN users owner_user
         ON owner_user.id = p.owner_id
        AND owner_user.role_scope = 'VENDOR'
        AND owner_user.is_banned = FALSE
       WHERE p.status = 'active'
         AND p.is_open = TRUE
       ORDER BY p.rating_avg DESC
       LIMIT $1`,
      [limit]
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
       JOIN users owner_user
         ON owner_user.id = p.owner_id
        AND owner_user.role_scope = 'VENDOR'
        AND owner_user.is_banned = FALSE
       WHERE p.id = $1
         AND p.status = 'active'
         AND p.is_open = TRUE
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

  async search({
    routePoints,
    range = 800,
    cuisine,
    maxPrice,
    search: searchQuery,
    limit = 50,
    offset = 0,
  }) {
    const routeGeoJSON = JSON.stringify({
      type: "LineString",
      coordinates: routePoints.map(([lat, lng]) => [lng, lat]),
    });

    // Fixed 7 params: $1=route, $2=range, $3=cuisine/null, $4=maxPrice/null, $5=searchPattern/null, $6=limit, $7=offset
    // When a filter param is null/ignored its condition becomes effectively TRUE.
    const searchPattern = (searchQuery && searchQuery.trim()) ? `%${searchQuery.trim()}%` : null;

    const conditions = [
      `p.status = 'active'`,
      `p.is_open = TRUE`,
      `ST_Distance(p.location::geography, ST_GeomFromGeoJSON($1)::geography) <= $2`,
      `($3::text IS NULL OR pc.name = $3)`,
      `($4::int IS NULL OR p.price_range <= $4)`,
      `($5::text IS NULL OR p.name ILIKE $5 OR mi_search.names IS NOT NULL)`,
    ];

    const fromClause = `FROM places p
      LEFT JOIN LATERAL (
        SELECT COALESCE(ARRAY_AGG(DISTINCT mi2.name), '{}'::text[]) AS names
        FROM menu_items mi2
        WHERE mi2.place_id = p.id
          AND mi2.is_available = TRUE
          AND ($5::text IS NOT NULL AND mi2.name ILIKE $5)
      ) mi_search ON TRUE
      LEFT JOIN place_categories pc ON pc.id = p.category_id
      LEFT JOIN LATERAL (
        SELECT bucket_name, object_path, mime_type, alt_text
        FROM place_images
        WHERE place_id = p.id
        ORDER BY is_primary DESC, sort_order ASC, created_at ASC
        LIMIT 1
      ) pi ON TRUE
      JOIN users owner_user
        ON owner_user.id = p.owner_id
       AND owner_user.role_scope = 'VENDOR'
       AND owner_user.is_banned = FALSE`;

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    // Always include search select columns — when $5 is null, defaults are returned
    const searchSelect = `
      CASE WHEN $5::text IS NOT NULL AND p.name ILIKE $5 THEN 1 ELSE 0 END AS match_by_name,
      COALESCE(mi_search.names, '{}'::text[]) AS matched_menu_items
    `;

    const allParams = [
      routeGeoJSON,
      range,
      cuisine || null,
      (maxPrice !== undefined && maxPrice !== null && maxPrice < 4) ? maxPrice : null,
      searchPattern,
    ];

    // ── Count ──
    const countRes = await db.query(
      `SELECT COUNT(*)::int AS total ${fromClause} ${whereClause}`,
      [...allParams]
    );
    const total = countRes.rows[0]?.total || 0;

    // ── Data with pagination ──
    const limitVal = Math.min(Math.max(1, limit), 100);
    const offsetVal = Math.max(0, offset);
    const dataParams = [...allParams, limitVal, offsetVal];

    const dataRes = await db.query(
      `SELECT
         p.id, p.name, p.description, p.address,
         p.price_range, p.rating_avg AS rating, p.rating_count,
         p.is_open AS open_now, p.photo_url,
         ST_Y(p.location::geometry) AS lat,
         ST_X(p.location::geometry) AS lng,
         ST_Distance(p.location::geography, ST_GeomFromGeoJSON($1)::geography)::float8 AS dist_m,
         pc.name AS category_name, pc.slug AS category_slug,
         pi.bucket_name AS image_bucket,
         pi.object_path AS image_path,
         pi.mime_type AS image_mime_type,
         pi.alt_text AS image_alt_text,
         ${searchSelect}
       ${fromClause}
       ${whereClause}
       ORDER BY p.rating_avg DESC
       LIMIT $6 OFFSET $7`,
      dataParams
    );

    // Search meta from result rows
    let searchMeta = { total: 0, byName: 0, byMenu: 0 };
    if (searchPattern) {
      const rows = dataRes.rows;
      searchMeta = {
        total: rows.length,
        byName: rows.filter((r) => r.match_by_name === 1).length,
        byMenu: rows.filter((r) => Array.isArray(r.matched_menu_items) && r.matched_menu_items.length > 0).length,
      };
    }

    return { rows: dataRes.rows, total, searchMeta };
  }

  async getReviews(placeId, limit = 100) {
    const { rows } = await db.query(
      `SELECT r.id, r.place_id AS vendor_id, r.user_id, r.rating AS stars,
              r.body, r.created_at,
              COALESCE(u.first_name || ' ' || u.last_name, 'Anonymous') AS user_name
       FROM reviews r
       LEFT JOIN users u ON u.id = r.user_id
       WHERE r.place_id = $1 AND r.deleted_at IS NULL
       ORDER BY r.created_at DESC
       LIMIT $2`,
      [placeId, limit]
    );
    return rows;
  }

  async createReview(placeId, userId, data) {
    const existing = await db.query(
      `SELECT id FROM reviews WHERE place_id = $1 AND user_id = $2 AND deleted_at IS NULL LIMIT 1`,
      [placeId, userId]
    );
    if (existing.rowCount > 0) {
      throw new AppError("You have already reviewed this stall", 409, {
        code: "DUPLICATE_REVIEW",
        safeMessage: "You can only review a stall once.",
      });
    }

    const { rows } = await db.query(
      `INSERT INTO reviews (place_id, user_id, rating, body)
       VALUES ($1, $2, $3, $4)
       RETURNING id, place_id AS vendor_id, user_id, rating AS stars, body, created_at`,
      [placeId, userId, data.rating, sanitizeText(data.body) || null]
    );

    // Recalculate the place's rolling average rating
    await db.query("SELECT refresh_place_rating($1)", [placeId]);

    return rows[0] || null;
  }
}

export default PlaceRepository;
