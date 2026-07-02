import db from "../config/db.js";
import {
  hasStorageImageInput,
  imageDisplayUrlFromStorageInput,
  upsertPrimaryMenuItemImage,
  upsertPrimaryPlaceImage,
} from "../utils/storageImageMetadata.js";
import { normalizePlaceStatus, PLACE_STATUS, statusFromOpenFlag } from "../utils/placeStatus.js";

const menuItemCategory = (cat) => {
  const norm = {
    snack: "snack", snacks: "snack", "main course": "main course",
    main: "main course", drink: "drink", drinks: "drink",
    dessert: "dessert", desserts: "dessert",
  };
  return norm[(cat ?? "").toLowerCase().trim()] || "snack";
};

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
              p.category_id
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
              p.category_id
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
      await this.copyMenuItemsToPlace(client, rows[0].id, data.owner_id, data.menu_item_ids);
      return rows[0];
    });

    return this.findOwnedById(place.id, data.owner_id);
  }

  async copyMenuItemsToPlace(client, placeId, ownerId, sourceItemIds = []) {
    if (!Array.isArray(sourceItemIds) || sourceItemIds.length === 0) return;

    const sourceResult = await client.query(
      `SELECT id FROM menu_items mi
       JOIN places source_place ON source_place.id = mi.place_id
       WHERE source_place.owner_id = $1
         AND mi.id::text = ANY($2::text[])
       ORDER BY mi.id`,
      [ownerId, sourceItemIds]
    );
    const sourceIds = sourceResult.rows.map((r) => r.id);

    const insertResult = await client.query(
      `INSERT INTO menu_items (place_id, name, description, price, category, image_url, is_available)
       SELECT $1, mi.name, mi.description, mi.price, mi.category, mi.image_url, mi.is_available
       FROM menu_items mi
       JOIN places source_place ON source_place.id = mi.place_id
       WHERE source_place.owner_id = $2
         AND mi.id::text = ANY($3::text[])
       ORDER BY mi.id
       RETURNING id`,
      [placeId, ownerId, sourceItemIds]
    );
    const newIds = insertResult.rows.map((r) => r.id);

    if (sourceIds.length > 0 && newIds.length > 0) {
      await client.query(
        `WITH pairs AS (
           SELECT unnest($1::uuid[]) AS new_id, unnest($2::uuid[]) AS source_id
         )
         INSERT INTO menu_item_images (menu_item_id, bucket_name, object_path, uploaded_by, mime_type, size_bytes, alt_text, sort_order, is_primary)
         SELECT pairs.new_id, mii.bucket_name, mii.object_path, mii.uploaded_by, mii.mime_type, mii.size_bytes, mii.alt_text, mii.sort_order, mii.is_primary
         FROM pairs
         JOIN menu_item_images mii ON mii.menu_item_id = pairs.source_id`,
        [newIds, sourceIds]
      );
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
    const { rowCount } = await db.query(
      `DELETE FROM places WHERE id = $1 AND owner_id = $2`,
      [id, ownerId]
    );
    return rowCount > 0;
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

  async getReviews(ownerId, limit = 100) {
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
              mii.bucket_name AS image_bucket,
              mii.object_path AS image_path,
              mii.mime_type AS image_mime_type,
              mii.alt_text AS image_alt_text
       FROM menu_items mi
       JOIN places p ON p.id = mi.place_id
       LEFT JOIN LATERAL (
         SELECT bucket_name, object_path, mime_type, alt_text
         FROM menu_item_images
         WHERE menu_item_id = mi.id
         ORDER BY is_primary DESC, sort_order ASC, created_at ASC
         LIMIT 1
       ) mii ON TRUE
       WHERE p.owner_id = $1
       ORDER BY mi.created_at DESC
       LIMIT $2`,
      [ownerId, limit]
    );
    return rows;
  }

  async getMenuItems(placeId, ownerId) {
    const { rows } = await db.query(
      `SELECT mi.*,
              mii.bucket_name AS image_bucket,
              mii.object_path AS image_path,
              mii.mime_type AS image_mime_type,
              mii.alt_text AS image_alt_text
       FROM menu_items mi
       JOIN places p ON p.id = mi.place_id
       LEFT JOIN LATERAL (
         SELECT bucket_name, object_path, mime_type, alt_text
         FROM menu_item_images
         WHERE menu_item_id = mi.id
         ORDER BY is_primary DESC, sort_order ASC, created_at ASC
         LIMIT 1
       ) mii ON TRUE
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

    const image_url = imageDisplayUrlFromStorageInput(data, ["image_url", "imageUrl"]);
    const fields = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category !== undefined ? menuItemCategory(data.category) : undefined,
      is_available: data.is_available,
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
             FROM places p
             WHERE mi.id = $${idx} AND mi.place_id = p.id AND p.owner_id = $${idx + 1}
             RETURNING mi.*`,
            values
          )
        : await client.query(
            `SELECT mi.*
             FROM menu_items mi
             JOIN places p ON p.id = mi.place_id
             WHERE mi.id = $${idx} AND p.owner_id = $${idx + 1}
             LIMIT 1`,
            values
          );

      if (!rows[0]) return null;

      const image = await upsertPrimaryMenuItemImage(client, rows[0].id, data, uploadedBy(data, ownerId));
      return withMenuImageMetadata(rows[0], image);
    });
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
    const image_url = imageDisplayUrlFromStorageInput(data, ["image_url", "imageUrl"]);
    return db.transaction(async (client) => {
      const { rows } = await client.query(
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
          image_url ?? null,
          data.is_available !== false,
          ownerId,
        ]
      );

      if (!rows[0]) return null;

      const image = await upsertPrimaryMenuItemImage(client, rows[0].id, data, uploadedBy(data, ownerId));
      return withMenuImageMetadata(rows[0], image);
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
      price: data.price,
      category: data.category !== undefined ? menuItemCategory(data.category) : undefined,
      is_available: data.is_available,
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
    values.push(itemId, placeId, ownerId);

    return db.transaction(async (client) => {
      const { rows } = setClauses.length > 0
        ? await client.query(
            `UPDATE menu_items mi
             SET ${setClauses.join(", ")}
             FROM places p
             WHERE mi.id = $${idx} AND mi.place_id = $${idx + 1}
               AND p.id = $${idx + 1} AND p.owner_id = $${idx + 2}
             RETURNING mi.*`,
            values
          )
        : await client.query(
            `SELECT mi.*
             FROM menu_items mi
             JOIN places p ON p.id = mi.place_id
             WHERE mi.id = $${idx} AND mi.place_id = $${idx + 1}
               AND p.id = $${idx + 1} AND p.owner_id = $${idx + 2}
             LIMIT 1`,
            values
          );

      if (!rows[0]) return null;

      const image = await upsertPrimaryMenuItemImage(client, rows[0].id, data, uploadedBy(data, ownerId));
      return withMenuImageMetadata(rows[0], image);
    });
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
