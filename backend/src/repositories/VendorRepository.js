import db from "../config/db.js";
import {
  hasStorageImageInput,
  imageDisplayUrlFromStorageInput,
  upsertPrimaryMenuItemImage,
  upsertPrimaryPlaceImage,
} from "../utils/storageImageMetadata.js";
import { normalizePlaceStatus, PLACE_STATUS, statusFromOpenFlag } from "../utils/placeStatus.js";
import { normalizeMenuItemCategory } from "../utils/validation.js";
import {
  normalizeOperatingSchedule,
  PLACE_HOURS_JSON_SELECT,
  replacePlaceHours,
} from "../utils/placeHours.js";

const uploadedBy = (data, fallbackUserId) => data.uploaded_by || data.uploadedBy || fallbackUserId || null;

const withMenuImageMetadata = (item, image) => ({
  ...item,
  image_bucket: image?.bucket_name ?? item.image_bucket ?? null,
  image_path: image?.object_path ?? item.image_path ?? null,
  image_mime_type: image?.mime_type ?? item.image_mime_type ?? null,
  image_alt_text: image?.alt_text ?? item.image_alt_text ?? null,
});

class VendorRepository {

  async findByOwner(ownerId) {
    const { rows } = await db.query(
      `SELECT p.id, p.name, p.description, p.address, p.photo_url,
              p.price_range, p.rating_avg, p.rating_count, p.is_open,
              p.is_admin_managed,
              p.status, p.created_at, p.updated_at,
              ST_Y(p.location::geometry) AS lat,
              ST_X(p.location::geometry) AS lng,
              pi.bucket_name AS image_bucket,
              pi.object_path AS image_path,
              pi.mime_type AS image_mime_type,
              pi.alt_text AS image_alt_text,
              pc.slug AS category_slug, pc.name AS category_name,
              p.category_id,
              ${PLACE_HOURS_JSON_SELECT}
       FROM places p
       LEFT JOIN place_categories pc ON pc.id = p.category_id
       LEFT JOIN LATERAL (
         SELECT bucket_name, object_path, mime_type, alt_text
         FROM place_images
         WHERE place_id = p.id
         ORDER BY is_primary DESC, sort_order ASC, created_at ASC
         LIMIT 1
       ) pi ON TRUE
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
              p.is_admin_managed,
              p.status, p.created_at, p.updated_at,
              ST_Y(p.location::geometry) AS lat,
              ST_X(p.location::geometry) AS lng,
              pi.bucket_name AS image_bucket,
              pi.object_path AS image_path,
              pi.mime_type AS image_mime_type,
              pi.alt_text AS image_alt_text,
              pc.slug AS category_slug, pc.name AS category_name,
              p.category_id,
              ${PLACE_HOURS_JSON_SELECT}
       FROM places p
       LEFT JOIN place_categories pc ON pc.id = p.category_id
       LEFT JOIN LATERAL (
         SELECT bucket_name, object_path, mime_type, alt_text
         FROM place_images
         WHERE place_id = p.id
         ORDER BY is_primary DESC, sort_order ASC, created_at ASC
         LIMIT 1
       ) pi ON TRUE
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
    const photoUrl = imageDisplayUrlFromStorageInput(data, ["photo_url", "photoUrl"]);
    const status = normalizePlaceStatus(data.status, statusFromOpenFlag(data.is_open !== false));
    const isOpen = status === PLACE_STATUS.ACTIVE;
    const place = await db.transaction(async (client) => {
      const { rows } = await client.query(
        `INSERT INTO places (owner_id, category_id, name, description, address, photo_url, price_range, location, status, is_open, is_admin_managed)
         VALUES ($1, $2, $3, $4, $5, $6, $7, ST_SetSRID(ST_MakePoint($8, $9), 4326)::geography, $10, $11, FALSE)
         RETURNING id`,
        [
          data.owner_id,
          data.category_id,
          data.name,
          data.description || null,
          data.address || null,
          photoUrl ?? null,
          data.price_range || null,
          data.longitude || 104.9282,
          data.latitude || 11.5564,
          status,
          isOpen,
        ]
      );

      await upsertPrimaryPlaceImage(client, rows[0].id, data, uploadedBy(data, data.owner_id));
      await replacePlaceHours(client, rows[0].id, normalizeOperatingSchedule(data));
      await this.linkMenuItemsToPlace(client, rows[0].id, data.owner_id, data.menu_item_ids);
      return rows[0];
    });

    return this.findOwnedById(place.id, data.owner_id);
  }

  async linkMenuItemsToPlace(client, placeId, ownerId, sourceItemIds = []) {
    if (!Array.isArray(sourceItemIds) || sourceItemIds.length === 0) return;

    const existing = await client.query(
      "SELECT menu_item_id::text, is_available, price FROM place_menu_items WHERE place_id = $1",
      [placeId]
    );
    const existingAvailability = Object.fromEntries(
      existing.rows.map((row) => [row.menu_item_id, row.is_available])
    );
    const existingPrices = Object.fromEntries(
      existing.rows.map((row) => [row.menu_item_id, row.price])
    );

    const { rowCount } = await client.query(
      `INSERT INTO place_menu_items (place_id, menu_item_id, is_available, price)
       SELECT $1,
              mi.id,
              COALESCE($3::jsonb->>mi.id::text, 'true')::boolean,
              COALESCE(($4::jsonb->>mi.id::text)::numeric, mi.default_price)
       FROM menu_items mi
       WHERE mi.owner_id = $2
         AND mi.id::text = ANY($5::text[])
       ON CONFLICT (place_id, menu_item_id) DO UPDATE
         SET is_available = EXCLUDED.is_available,
             price = EXCLUDED.price`,
      [
        placeId,
        ownerId,
        JSON.stringify(existingAvailability),
        JSON.stringify(existingPrices),
        sourceItemIds,
      ]
    );
    if (rowCount !== sourceItemIds.length) {
      throw new Error("One or more menu items do not belong to this vendor");
    }
  }

  async update(id, ownerId, data) {
    const setClauses = [];
    const values = [];
    let idx = 1;
    const photoUrl = imageDisplayUrlFromStorageInput(data, ["photo_url", "photoUrl"]);

    const fields = {
      name: data.name,
      description: data.description,
      address: data.address,
      price_range: data.price_range,
    };

    if (data.status !== undefined || data.is_open !== undefined) {
      const status = normalizePlaceStatus(data.status, statusFromOpenFlag(data.is_open !== false));
      fields.status = status;
      fields.is_open = status === PLACE_STATUS.ACTIVE;
      fields.is_admin_managed = false;
    }
    if (photoUrl !== undefined) fields.photo_url = photoUrl;

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
    values.push(id, ownerId);

    const place = await db.transaction(async (client) => {
      const { rows } = await client.query(
        `UPDATE places SET ${setClauses.join(", ")}
         WHERE id = $${idx} AND owner_id = $${idx + 1}
         RETURNING id`,
        values
      );

      if (!rows[0]) return null;

      await upsertPrimaryPlaceImage(client, id, data, uploadedBy(data, ownerId));
      await replacePlaceHours(client, id, normalizeOperatingSchedule(data));
      // Sync menu item links when explicitly provided (same as admin updateStall behavior)
      if (data.menu_item_ids !== undefined || data.menuItemIds !== undefined) {
        const ids = data.menu_item_ids ?? data.menuItemIds ?? [];
        const normalizedIds = [...new Set((Array.isArray(ids) ? ids : []).map(String))];
        if (normalizedIds.length > 0) {
          await this.linkMenuItemsToPlace(client, id, ownerId, normalizedIds);
          await client.query(
            `DELETE FROM place_menu_items
             WHERE place_id = $1 AND NOT (menu_item_id::text = ANY($2::text[]))`,
            [id, normalizedIds]
          );
        } else {
          await client.query("DELETE FROM place_menu_items WHERE place_id = $1", [id]);
        }
      }
      return rows[0];
    });

    if (!place) return null;
    return this.findOwnedById(id, ownerId);
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
    return db.transaction(async (client) => {
      await client.query("DELETE FROM place_menu_items WHERE place_id = $1", [id]);
      await client.query("DELETE FROM place_hours WHERE place_id = $1", [id]);
      await client.query("DELETE FROM place_images WHERE place_id = $1", [id]);
      const { rowCount } = await client.query(
        `UPDATE places SET deleted_at = NOW(), updated_at = NOW()
         WHERE id = $1 AND owner_id = $2 AND deleted_at IS NULL`,
        [id, ownerId]
      );
      return rowCount > 0;
    });
  }

  async updateStatus(id, status) {
    const normalizedStatus = normalizePlaceStatus(status);
    const isOpen = normalizedStatus === PLACE_STATUS.ACTIVE;
    const { rows } = await db.query(
      `UPDATE places
       SET status = $1,
           is_open = $2,
           is_admin_managed = FALSE,
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [normalizedStatus, isOpen, id]
    );
    return rows[0] || null;
  }

  async getDashboardMetrics(ownerId) {
    const { rows } = await db.query(
      `SELECT
         COUNT(*)::int AS total_stalls,
         COUNT(*) FILTER (WHERE status = 'active' AND is_open = TRUE)::int AS open_stalls,
         COALESCE(AVG(rating_avg), 0)::float AS avg_rating
       FROM places
       WHERE owner_id = $1`,
      [ownerId]
    );
    return rows[0];
  }

  async getReviews(ownerId, limit = 2000) {
    const { rows } = await db.query(
      `SELECT r.id, r.rating AS stars, r.body, r.created_at,
              u.first_name || ' ' || u.last_name AS user_name,
              p.name AS place_name, p.id AS place_id
       FROM reviews r
       JOIN places p ON p.id = r.place_id
       JOIN users u ON u.id = r.user_id
       WHERE p.owner_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2`,
      [ownerId, limit]
    );
    return rows;
  }

  async getAllMenuItems(ownerId, limit = 200) {
    const { rows } = await db.query(
      `SELECT mi.*,
              mi.default_price AS price,
              COALESCE((SELECT bool_or(pmi.is_available) FROM place_menu_items pmi WHERE pmi.menu_item_id = mi.id), TRUE) AS is_available,
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
       WHERE mi.owner_id = $1
       ORDER BY mi.created_at DESC
       LIMIT $2`,
      [ownerId, limit]
    );
    return rows;
  }

  async getMenuItems(placeId, ownerId) {
    const { rows } = await db.query(
      `SELECT mi.*,
              mi.default_price,
              pmi.price,
              pmi.is_available,
              mii.bucket_name AS image_bucket,
              mii.object_path AS image_path,
              mii.mime_type AS image_mime_type,
              mii.alt_text AS image_alt_text
       FROM place_menu_items pmi
       JOIN menu_items mi ON mi.id = pmi.menu_item_id
       JOIN places p ON p.id = pmi.place_id
       LEFT JOIN LATERAL (
         SELECT bucket_name, object_path, mime_type, alt_text
         FROM menu_item_images
         WHERE menu_item_id = mi.id
         ORDER BY is_primary DESC, sort_order ASC, created_at ASC
         LIMIT 1
       ) mii ON TRUE
       WHERE pmi.place_id = $1 AND p.owner_id = $2
       ORDER BY mi.created_at DESC`,
      [placeId, ownerId]
    );
    return rows;
  }

  async updateMenuItemGlobal(ownerId, itemId, data) {
    const setClauses = [];
    const values = [];
    let idx = 1;

    const image_url = imageDisplayUrlFromStorageInput(data, ["image_url", "imageUrl"]);
    const fields = {
      name: data.name,
      description: data.description,
      default_price: data.price,
      category: data.category !== undefined ? normalizeMenuItemCategory(data.category) : undefined,
    };
    if (image_url !== undefined) fields.image_url = image_url;

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        setClauses.push(`${key} = $${idx++}`);
        values.push(value);
      }
    }

    const hasImageUpdate = hasStorageImageInput(data);
    if (setClauses.length === 0 && !hasImageUpdate) return null;
    values.push(itemId, ownerId);

    return db.transaction(async (client) => {
      const { rows } = setClauses.length > 0
        ? await client.query(
            `UPDATE menu_items mi
             SET ${setClauses.join(", ")}
             WHERE mi.id = $${idx} AND mi.owner_id = $${idx + 1}
             RETURNING mi.*`,
            values
          )
        : await client.query(
            `SELECT mi.*
             FROM menu_items mi
             WHERE mi.id = $${idx} AND mi.owner_id = $${idx + 1}
             LIMIT 1`,
            values
          );

      if (!rows[0]) return null;

      const image = await upsertPrimaryMenuItemImage(client, rows[0].id, data, uploadedBy(data, ownerId));
      return withMenuImageMetadata({ ...rows[0], price: rows[0].default_price }, image);
    });
  }

  async deleteMenuItemGlobal(ownerId, itemId) {
    const { rowCount } = await db.query(
      `DELETE FROM menu_items mi
       WHERE mi.id = $1 AND mi.owner_id = $2`,
      [itemId, ownerId]
    );
    return rowCount > 0;
  }

  async createMenuItem(placeId, ownerId, data) {
    const image_url = imageDisplayUrlFromStorageInput(data, ["image_url", "imageUrl"]);
    return db.transaction(async (client) => {
      const { rows } = await client.query(
        `WITH owned_place AS (
           SELECT id, owner_id FROM places WHERE id = $1 AND owner_id = $7 AND deleted_at IS NULL
         ), created_item AS (
           INSERT INTO menu_items (owner_id, name, description, default_price, category, image_url)
           SELECT owner_id, $2, $3, $4, $5, $6 FROM owned_place
           RETURNING *
         ), linked_item AS (
           INSERT INTO place_menu_items (place_id, menu_item_id, is_available, price)
           SELECT $1, id, $8, default_price FROM created_item
         )
         SELECT * FROM created_item
         WHERE EXISTS (
           SELECT 1 FROM owned_place
         )`,
        [
          placeId,
          data.name,
          data.description || null,
          data.price,
          normalizeMenuItemCategory(data.category),
          image_url ?? null,
          ownerId,
          data.is_available ?? data.isAvailable ?? true,
        ]
      );

      if (!rows[0]) return null;

      const image = await upsertPrimaryMenuItemImage(client, rows[0].id, data, uploadedBy(data, ownerId));
      return withMenuImageMetadata({
        ...rows[0],
        price: rows[0].default_price,
        is_available: data.is_available ?? data.isAvailable ?? true,
      }, image);
    });
  }

  async createMenuItemGlobal(ownerId, data) {
    const image_url = imageDisplayUrlFromStorageInput(data, ["image_url", "imageUrl"]);
    return db.transaction(async (client) => {
      const { rows } = await client.query(
        `INSERT INTO menu_items (owner_id, name, description, default_price, category, image_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          ownerId,
          data.name,
          data.description || null,
          data.price,
          normalizeMenuItemCategory(data.category),
          image_url ?? null,
        ]
      );
      const image = await upsertPrimaryMenuItemImage(client, rows[0].id, data, uploadedBy(data, ownerId));
      return withMenuImageMetadata({ ...rows[0], price: rows[0].default_price, is_available: true }, image);
    });
  }

  async linkExistingMenuItem(placeId, itemId, ownerId, data = {}) {
    return db.transaction(async (client) => {
      const { rows } = await client.query(
        `INSERT INTO place_menu_items (place_id, menu_item_id, is_available, price)
         SELECT p.id,
                mi.id,
                $4,
                COALESCE($5, mi.default_price)
         FROM places p
         JOIN menu_items mi ON mi.owner_id = p.owner_id
         WHERE p.id = $1
           AND mi.id = $2
           AND p.owner_id = $3
           AND p.deleted_at IS NULL
         ON CONFLICT (place_id, menu_item_id) DO UPDATE
           SET is_available = EXCLUDED.is_available,
               price = EXCLUDED.price,
               updated_at = NOW()
         RETURNING menu_item_id, is_available, price`,
        [
          placeId,
          itemId,
          ownerId,
          data.is_available ?? data.isAvailable ?? true,
          data.price ?? null,
        ]
      );

      if (!rows[0]) return null;

      const { rows: linkedItems } = await client.query(
        `SELECT mi.*,
                mi.default_price,
                pmi.price,
                pmi.is_available,
                mii.bucket_name AS image_bucket,
                mii.object_path AS image_path,
                mii.mime_type AS image_mime_type,
                mii.alt_text AS image_alt_text
         FROM place_menu_items pmi
         JOIN menu_items mi ON mi.id = pmi.menu_item_id
         LEFT JOIN LATERAL (
           SELECT bucket_name, object_path, mime_type, alt_text
           FROM menu_item_images
           WHERE menu_item_id = mi.id
           ORDER BY is_primary DESC, sort_order ASC, created_at ASC
           LIMIT 1
         ) mii ON TRUE
         WHERE pmi.place_id = $1 AND pmi.menu_item_id = $2`,
        [placeId, itemId]
      );
      return linkedItems[0] || null;
    });
  }

  async updateMenuItem(placeId, itemId, ownerId, data) {
    const setClauses = [];
    const values = [];
    let idx = 1;

    const image_url = imageDisplayUrlFromStorageInput(data, ["image_url", "imageUrl"]);
    const fields = {
      name: data.name,
      description: data.description,
      category: data.category !== undefined ? normalizeMenuItemCategory(data.category) : undefined,
    };
    if (image_url !== undefined) fields.image_url = image_url;

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        setClauses.push(`${key} = $${idx++}`);
        values.push(value);
      }
    }

    const hasImageUpdate = hasStorageImageInput(data);
    const hasLinkUpdate = data.price !== undefined || data.is_available !== undefined || data.isAvailable !== undefined;
    if (setClauses.length === 0 && !hasImageUpdate && !hasLinkUpdate) return null;
    values.push(itemId, placeId, ownerId);

    return db.transaction(async (client) => {
      const { rows } = setClauses.length > 0
        ? await client.query(
            `UPDATE menu_items mi
             SET ${setClauses.join(", ")}
             FROM place_menu_items pmi, places p
             WHERE mi.id = $${idx} AND pmi.menu_item_id = mi.id AND pmi.place_id = $${idx + 1}
               AND p.id = pmi.place_id AND p.owner_id = $${idx + 2}
             RETURNING mi.*`,
            values
          )
        : await client.query(
            `SELECT mi.*
             FROM menu_items mi
             JOIN place_menu_items pmi ON pmi.menu_item_id = mi.id
             JOIN places p ON p.id = pmi.place_id
             WHERE mi.id = $${idx} AND pmi.place_id = $${idx + 1}
               AND p.owner_id = $${idx + 2}
             LIMIT 1`,
            values
          );

      if (!rows[0]) return null;

      if (hasLinkUpdate) {
        await client.query(
          `UPDATE place_menu_items
           SET price = COALESCE($1, price),
               is_available = COALESCE($2, is_available),
               updated_at = NOW()
           WHERE place_id = $3 AND menu_item_id = $4`,
          [data.price ?? null, data.is_available ?? data.isAvailable ?? null, placeId, itemId]
        );
      }
      const image = await upsertPrimaryMenuItemImage(client, rows[0].id, data, uploadedBy(data, ownerId));
      const { rows: links } = await client.query(
        `SELECT price, is_available FROM place_menu_items
         WHERE place_id = $1 AND menu_item_id = $2`,
        [placeId, itemId]
      );
      return withMenuImageMetadata({
        ...rows[0],
        default_price: rows[0].default_price,
        price: links[0]?.price ?? rows[0].default_price,
        is_available: links[0]?.is_available,
      }, image);
    });
  }

  async deleteMenuItem(placeId, itemId, ownerId) {
    const { rowCount } = await db.query(
      `DELETE FROM place_menu_items pmi
       USING places p, menu_items mi
       WHERE pmi.menu_item_id = $1 AND pmi.place_id = $2
         AND p.id = pmi.place_id AND p.owner_id = $3
         AND mi.id = pmi.menu_item_id AND mi.owner_id = p.owner_id`,
      [itemId, placeId, ownerId]
    );
    return rowCount > 0;
  }
  async findNearbyStalls(latitude, longitude, excludeOwnerId = null, radiusMeters = 50) {
    const params = [longitude, latitude, radiusMeters];
    let excludeClause = "";
    if (excludeOwnerId) {
      excludeClause = `AND p.owner_id != $4`;
      params.push(excludeOwnerId);
    }
    const { rows } = await db.query(
      `SELECT p.id, p.name,
              ST_Y(p.location::geometry) AS lat,
              ST_X(p.location::geometry) AS lng,
              ST_Distance(p.location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) AS distance_meters
       FROM places p
       WHERE p.status = 'active'
         AND ST_Distance(p.location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) <= $3
         ${excludeClause}
       ORDER BY distance_meters ASC
       LIMIT 5`,
      params
    );
    return rows;
  }
}

export default VendorRepository;
