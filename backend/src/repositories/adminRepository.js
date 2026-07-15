import { pool } from "../config/db.js";
import AppError from "../utils/AppError.js";
import {
  hasStorageImageInput,
  imageDisplayUrlFromStorageInput,
  upsertPrimaryMenuItemImage,
  upsertPrimaryPlaceImage,
} from "../utils/storageImageMetadata.js";
import { storageImageUrlFromMetadata } from "../services/storageService.js";
import { normalizePlaceStatus, PLACE_STATUS } from "../utils/placeStatus.js";
import { normalizeMenuItemCategory } from "../utils/validation.js";
import TokenRepository from "./TokenRepository.js";

const tokenRepo = new TokenRepository();
import {
  normalizeOperatingSchedule,
  PLACE_HOURS_JSON_SELECT,
  replacePlaceHours,
} from "../utils/placeHours.js";

const quoteIdent = (value) => `"${String(value).replace(/"/g, '""')}"`;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const optionalRows = async (query, params = [], fallback = []) => {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error(`[adminRepository] Query failed: ${error.message}`);
    console.error(`  SQL: ${query.slice(0, 200)}`);
    return fallback;
  }
};

const withTransaction = async (callback) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const uploadedBy = (payload, fallbackUserId = null) => payload?.uploadedBy || payload?.uploaded_by || fallbackUserId;

const ensureVendorOwner = async (ownerId, client = pool) => {
  const normalizedOwnerId = String(ownerId ?? "").trim();
  if (!normalizedOwnerId) {
    throw new AppError("Vendor owner is required", 400);
  }

  const result = await client.query(
    `
    SELECT id::text, email
    FROM users
    WHERE id::text = $1
      AND role_scope = 'VENDOR'
    LIMIT 1
    `,
    [normalizedOwnerId]
  );

  if (!result.rows.length) {
    throw new AppError("Vendor owner must be a valid vendor account", 400);
  }

  return result.rows[0];
};

const getOwnedPlaceCount = async (userId, client = pool) => {
  const result = await client.query(
    "SELECT COUNT(*)::int AS count FROM places WHERE owner_id::text = $1",
    [userId]
  );
  return Number(result.rows[0]?.count ?? 0);
};

const toStorageImage = (row) => {
  if (!row.image_bucket || !row.image_path) return null;

  return {
    bucketName: row.image_bucket,
    objectPath: row.image_path,
    mimeType: row.image_mime_type || null,
    sizeBytes: row.image_size_bytes == null ? undefined : Number(row.image_size_bytes),
    altText: row.image_alt_text || "",
  };
};

const withMenuImageMetadata = (item, image = null) => {
  const result = {
    ...item,
    image_bucket: image?.bucket_name ?? item.image_bucket ?? null,
    image_path: image?.object_path ?? item.image_path ?? null,
    image_mime_type: image?.mime_type ?? item.image_mime_type ?? null,
    image_size_bytes: image?.size_bytes ?? item.image_size_bytes ?? null,
    image_alt_text: image?.alt_text ?? item.image_alt_text ?? null,
  };
  return {
    ...result,
    image_url: storageImageUrlFromMetadata(toStorageImage(result)) || result.image_url || null,
  };
};

const primaryPlaceImageSelect = `
  pi.bucket_name AS image_bucket,
  pi.object_path AS image_path,
  pi.mime_type AS image_mime_type,
  pi.size_bytes AS image_size_bytes,
  pi.alt_text AS image_alt_text
`;

const primaryPlaceImageJoin = `
  LEFT JOIN LATERAL (
    SELECT bucket_name, object_path, mime_type, size_bytes, alt_text
    FROM place_images
    WHERE place_id::text = p.id::text
    ORDER BY is_primary DESC, sort_order ASC, created_at ASC
    LIMIT 1
  ) pi ON TRUE
`;

const primaryMenuItemImageSelect = `
  mii.bucket_name AS image_bucket,
  mii.object_path AS image_path,
  mii.mime_type AS image_mime_type,
  mii.size_bytes AS image_size_bytes,
  mii.alt_text AS image_alt_text
`;

const primaryMenuItemImageJoin = `
  LEFT JOIN LATERAL (
    SELECT bucket_name, object_path, mime_type, size_bytes, alt_text
    FROM menu_item_images
    WHERE menu_item_id::text = mi.id::text
    ORDER BY is_primary DESC, sort_order ASC, created_at ASC
    LIMIT 1
  ) mii ON TRUE
`;

const countRows = async (tableName, whereClause = "") => {
  const rows = await optionalRows(
    `SELECT COUNT(*)::int AS count FROM ${tableName} ${whereClause}`,
    [],
    [{ count: 0 }]
  );

  return Number(rows[0]?.count ?? 0);
};

const tableExists = async (tableName) => {
  const rows = await optionalRows(
    `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = $1
    ) AS exists
    `,
    [tableName],
    [{ exists: false }]
  );

  return Boolean(rows[0]?.exists);
};

const getColumns = async (tableName) => {
  const rows = await optionalRows(
    `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = $1
    ORDER BY ordinal_position
    `,
    [tableName],
    []
  );
  return rows.map((row) => row.column_name);
};

const getPublicTableNames = async () => {
  const rows = await optionalRows(
    `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name ASC
    `,
    [],
    []
  );
  return rows.map((row) => row.table_name);
};

export const logAuditAction = async (adminId, action, targetType, targetId, details = null, roleScope = null) => {
  try {
    await pool.query(
      `
      INSERT INTO audit_log (admin_id, actor_id, action, target_type, target_id, details, role_scope)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        adminId,
        uuidPattern.test(String(adminId ?? "")) ? adminId : null,
        action,
        targetType,
        targetId,
        details ? JSON.stringify(details) : "{}",
        roleScope || null,
      ]
    );
  } catch (err) {
    console.warn(`[audit_log] Failed to log: ${err.message}`);
  }
};

const toStatus = (isBanned) => (isBanned ? "Suspended" : "Active");
const toBanned = (status) => ["suspended", "banned"].includes(String(status).toLowerCase());

export const checkDatabaseConnection = async () => {
  const rows = await optionalRows("SELECT NOW() AS now", [], []);
  return {
    connected: rows.length > 0,
    checkedAt: rows[0]?.now ?? null,
  };
};

export const getDashboardTelemetry = async () => {
  const [totalUsers, activePlaces, totalReviews, totalRoutes, growthRows, activityRows] =
    await Promise.all([
      countRows("users"),
      countRows("places", "WHERE status = 'active' AND is_open = TRUE"),
      countRows("reviews"),
      countRows("routes"),
      optionalRows(
        `
        SELECT
          TO_CHAR(day_bucket, 'Dy') AS day,
          COUNT(sh.id)::int AS orders
        FROM generate_series(
          CURRENT_DATE - INTERVAL '6 days',
          CURRENT_DATE,
          INTERVAL '1 day'
        ) AS day_bucket
        LEFT JOIN search_history sh
          ON DATE_TRUNC('day', sh.created_at) = day_bucket
        GROUP BY day_bucket
        ORDER BY day_bucket
        `
      ),
      optionalRows(
        `
        SELECT
          id::text,
          query AS action,
          'search_history' AS target_type,
          id::text AS target_id,
          created_at
        FROM search_history
        ORDER BY created_at DESC
        LIMIT 4
        `
      ),
    ]);

  return {
    metrics: {
      totalUsers,
      activeRestaurants: activePlaces,
      openComplaints: totalReviews,
      totalRoutes,
    },
    growth: growthRows.map((row) => ({
      day: row.day?.trim() ?? "",
      orders: Number(row.orders ?? 0),
    })),
    activity: activityRows.map((row) => ({
      id: row.id,
      type: row.target_type === "vendors" || row.target_type === "places" ? "restaurant" : row.target_type === "users" ? "user" : "info",
      title: row.action,
      description: row.target_id ? `${row.target_type} ${row.target_id}` : row.target_type,
      time: row.created_at,
    })),
  };
};

export const findAllUsers = async (page, limit, roleScope = null) => {
  const offset = (page - 1) * limit;
  const whereClause = roleScope ? "WHERE u.role_scope = $3" : "";
  const params = roleScope ? [limit, offset, roleScope] : [limit, offset];
  const rows = await pool.query(
    `
    SELECT
      u.id::text,
      u.email,
      u.first_name,
      u.last_name,
      u.role_scope,
      u.role_id::text,
      r.name AS role_name,
      u.is_banned,
      u.created_at
    FROM users u
    JOIN "role" r ON r.id = u.role_id
    ${whereClause}
    ORDER BY u.created_at DESC
    LIMIT $1 OFFSET $2
    `,
    params
  );

  return rows.rows.map((user) => ({
    id: user.id,
    name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.email,
    email: user.email,
    role: user.role_name,
    roleId: user.role_id,
    roleScope: user.role_scope,
    status: toStatus(user.is_banned),
    createdAt: user.created_at,
  }));
};

export const countUsersByRole = async (roleScope = null) => {
  if (!roleScope) return countRows("users");
  const { rows } = await pool.query(
    "SELECT COUNT(*)::int AS count FROM users WHERE role_scope = $1",
    [roleScope]
  );
  return rows[0]?.count ?? 0;
};

export const createUser = async (userData) => {
  const columns = await getColumns("users");
  const available = new Set(columns);
  const phoneColumn = available.has("phone_number") ? "phone_number" : available.has("phone") ? "phone" : null;
  const columnNames = [
    "email",
    "password_hash",
    "first_name",
    "last_name",
    ...(phoneColumn ? [phoneColumn] : []),
    "role_scope",
    "role_id",
    "is_banned",
  ];
  const values = [
    userData.email,
    userData.password_hash,
    userData.first_name,
    userData.last_name,
    ...(phoneColumn ? [userData.phone ?? null] : []),
    userData.role_scope ?? "CONSUMER",
    userData.role_id,
    false,
  ];
  const placeholders = values.map((_, index) => `$${index + 1}`);
  let result;
  try {
    result = await pool.query(
      `
      INSERT INTO users (${columnNames.map(quoteIdent).join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING id::text, email, first_name, last_name, role_scope, role_id::text, is_banned, created_at
      `,
      values
    );
  } catch (err) {
    if (err.code === "23505" && err.constraint === "users_email_key") {
      throw new AppError("A user with this email already exists", 409, {
        code: "USER_EMAIL_DUPLICATE",
        fieldErrors: { email: "A user with this email already exists." },
      });
    }
    throw err;
  }

  const user = result.rows[0];
  const role = await getRoleRecordById(user.role_id);
  return {
    id: user.id,
    name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.email,
    email: user.email,
    role: role?.name ?? user.role_scope,
    roleId: user.role_id,
    roleScope: user.role_scope,
    status: toStatus(user.is_banned),
    createdAt: user.created_at,
  };
};

export const updateRole = async (id, role) => {
  const result = await pool.query(
    `
    UPDATE users
    SET role_scope = $1
    WHERE id = $2
    RETURNING id::text, email, first_name, last_name, role_scope, is_banned, created_at
    `,
    [role, id]
  );

  return result.rows[0];
};

export const updateStatus = async (id, status) => {
  const banned = toBanned(status);

  return withTransaction(async (client) => {
    const result = await client.query(
      `
      UPDATE users
      SET is_banned = $1,
          updated_at = NOW()
      WHERE id::text = $2
      RETURNING id::text, email, first_name, last_name, role_scope, is_banned, created_at
      `,
      [banned, id]
    );

    const user = result.rows[0];
    if (user?.role_scope === "VENDOR" && banned) {
      await client.query(
        `UPDATE places
         SET status = 'closed',
             is_open = FALSE,
             is_admin_managed = TRUE,
             updated_at = NOW()
         WHERE owner_id::text = $1`,
        [id]
      );
    }

    if (banned) {
      await tokenRepo.revokeAllForUser(id);
    }

    return user;
  });
};

export const countUsers = async () => countRows("users");

export const getUserManagementOverview = async (search = "", roleScope = null) => {
  const searchText = String(search ?? "").trim();
  const conditions = [];
  const params = [];
  let idx = 1;

  if (searchText) {
    conditions.push(`(
      u.first_name ILIKE $${idx} OR
      u.last_name ILIKE $${idx} OR
      u.email ILIKE $${idx} OR
      u.role_scope ILIKE $${idx}
    )`);
    params.push(`%${searchText}%`);
    idx++;
  }

  if (roleScope) {
    conditions.push(`u.role_scope = $${idx}`);
    params.push(roleScope);
    idx++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const rows = await optionalRows(
    `
    SELECT
      u.id::text AS user_id,
      CONCAT_WS(' ', u.first_name, u.last_name) AS user_name,
      u.email AS user_email,
      u.role_scope,
      u.is_banned,
      u.created_at AS user_created_at,
      to_jsonb(u) AS user_details,
      up.id::text AS preference_id,
      up.updated_at AS preference_updated_at,
      COALESCE(sh.search_count, 0)::int AS search_count,
      sh.latest_search_at,
      COALESCE(sh.total_results_count, 0)::int AS total_results_count
    FROM users u
    LEFT JOIN LATERAL (
      SELECT id, updated_at
      FROM user_preferences
      WHERE user_id::text = u.id::text
      ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
      LIMIT 1
    ) up ON true
    LEFT JOIN LATERAL (
      SELECT
        COUNT(*)::int AS search_count,
        MAX(created_at) AS latest_search_at,
        COALESCE(SUM(results_count), 0)::int AS total_results_count
      FROM search_history
      WHERE user_id::text = u.id::text
    ) sh ON true
    ${whereClause}
    ORDER BY u.created_at DESC NULLS LAST
    LIMIT 100
    `,
    params
  );

  return rows.map((row) => {
    const userDetails = row.user_details ?? {};
    if (Object.prototype.hasOwnProperty.call(userDetails, "password_hash")) {
      userDetails.password_hash = "Hidden for security";
    }

    return {
      id: row.user_id,
      status: row.is_banned ? "Suspended" : "Active",
      user: {
        label: row.user_name?.trim() || row.user_email || "Unnamed user",
        subLabel: row.user_email,
        details: userDetails,
      },
      preference: {
        label: row.preference_id ? "Preference profile exists" : "No preference profile",
        subLabel: row.preference_id ? "Private preference details hidden" : "No row in user_preferences",
        details: {
          hasPreferences: Boolean(row.preference_id),
          lastUpdatedAt: row.preference_updated_at ?? null,
        },
      },
      search: {
        label: `${Number(row.search_count ?? 0)} searches`,
        subLabel: row.latest_search_at ? "Latest search timestamp only" : "No search history",
        details: {
          count: Number(row.search_count ?? 0),
          latestSearchAt: row.latest_search_at ?? null,
          totalResultsCount: Number(row.total_results_count ?? 0),
        },
      },
    };
  });
};

export const getVendorManagementOverview = async (search = "") => {
  const searchText = String(search ?? "").trim();
  const whereClause = searchText
    ? `
      WHERE (
        p.name ILIKE $1 OR
        p.address ILIKE $1 OR
        p.description ILIKE $1 OR
        u.first_name ILIKE $1 OR
        u.last_name ILIKE $1 OR
        u.email ILIKE $1 OR
        mi.name ILIKE $1 OR
        mi.category ILIKE $1 OR
        pc.name ILIKE $1 OR
        rv.body ILIKE $1 OR
        ph.day_of_week::text ILIKE $1
      )
    `
    : "";
  const params = searchText ? [`%${searchText}%`] : [];

  const rows = await optionalRows(
    `
    SELECT
      p.id::text AS place_id,
      p.name AS place_name,
      to_jsonb(p) AS place_details,
      u.id::text AS user_id,
      CONCAT_WS(' ', u.first_name, u.last_name) AS user_name,
      u.email AS user_email,
      to_jsonb(u) AS user_details,
      mi.id::text AS menu_item_id,
      mi.name AS menu_item_name,
      COALESCE(mi.stall_price, mi.default_price) AS menu_item_price,
      to_jsonb(mi) AS menu_item_details,
      pc.id::text AS category_id,
      pc.name AS category_name,
      to_jsonb(pc) AS category_details,
      ph.id::text AS hour_id,
      ph.day_of_week,
      ph.opens_at,
      ph.closes_at,
      ph.is_closed,
      to_jsonb(ph) AS hour_details,
      rv.id::text AS review_id,
      rv.rating AS review_rating,
      rv.body AS review_body,
      to_jsonb(rv) AS review_details
    FROM places p
    JOIN users u ON u.id::text = p.owner_id::text AND u.role_scope = 'VENDOR'
    LEFT JOIN place_categories pc ON pc.id::text = p.category_id::text
    LEFT JOIN LATERAL (
      SELECT menu.*, link.price AS stall_price
      FROM place_menu_items link
      JOIN menu_items menu ON menu.id = link.menu_item_id
      WHERE link.place_id::text = p.id::text
      ORDER BY menu.created_at DESC NULLS LAST
      LIMIT 1
    ) mi ON true
    LEFT JOIN LATERAL (
      SELECT *
      FROM place_hours
      WHERE place_id::text = p.id::text
      ORDER BY day_of_week ASC
      LIMIT 1
    ) ph ON true
    LEFT JOIN LATERAL (
      SELECT *
      FROM reviews
      WHERE place_id::text = p.id::text
      ORDER BY created_at DESC NULLS LAST
      LIMIT 1
    ) rv ON true
    ${whereClause}
    ORDER BY p.created_at DESC NULLS LAST
    LIMIT 100
    `,
    params
  );

  return rows.map((row) => {
    const userDetails = row.user_details ?? null;
    if (userDetails && Object.prototype.hasOwnProperty.call(userDetails, "password_hash")) {
      userDetails.password_hash = "Hidden for security";
    }

    return {
      id: row.place_id,
      placeName: row.place_name,
      user: {
        label: row.user_name?.trim() || row.user_email || "No owner user",
        subLabel: row.user_email || row.place_name,
        details: userDetails,
      },
      menuItem: {
        label: row.menu_item_name || "No menu item",
        subLabel: row.menu_item_id ? `Price: ${row.menu_item_price}` : "No row in menu_items",
        details: row.menu_item_details,
      },
      placeCategory: {
        label: row.category_name || "No category",
        subLabel: row.category_id ? "Category" : "No row in place_categories",
        details: row.category_details,
      },
      placeHour: {
        label: row.hour_id
          ? row.is_closed
            ? `${row.day_of_week}: closed`
            : `${row.day_of_week}: ${row.opens_at} - ${row.closes_at}`
          : "No place hour",
        subLabel: row.hour_id ? "Opening hour" : "No row in place_hours",
        details: row.hour_details,
      },
      review: {
        label: row.review_id ? `Rating ${row.review_rating}` : "No review",
        subLabel: row.review_body || (row.review_id ? "Review row" : "No row in reviews"),
        details: row.review_details,
      },
    };
  });
};

export const findAllVendors = async (page = 1, limit = 50) => {
  const offset = (page - 1) * limit;
  const columns = await getColumns("places");
  const available = new Set(columns);
  const select = [
    "p.id::text",
    available.has("name") ? "p.name" : "'Unnamed place' AS name",
    available.has("address") ? "p.address" : "'No address' AS address",
    available.has("category_id") ? "p.category_id::text" : "NULL AS category_id",
    available.has("rating_avg") ? "p.rating_avg" : "NULL AS rating",
    "CASE WHEN p.status = 'active' AND p.is_open = TRUE THEN true ELSE false END AS is_approved",
    available.has("status") ? "p.status" : "'closed' AS status",
    available.has("created_at") ? "p.created_at" : "NOW() AS created_at",
    available.has("category_id") ? "pc.name AS category" : "'Place' AS category",
    available.has("owner_id") ? "u.email AS email" : "'' AS email",
  ];
  const joins = [
    available.has("category_id") ? "LEFT JOIN place_categories pc ON pc.id::text = p.category_id::text" : "",
    available.has("owner_id") ? "JOIN users u ON u.id::text = p.owner_id::text AND u.role_scope = 'VENDOR'" : "",
  ].filter(Boolean);
  const orderBy = available.has("created_at") ? "ORDER BY p.created_at DESC" : "ORDER BY p.id DESC";

  const rows = await optionalRows(
    `
    SELECT ${select.join(", ")}
    FROM places p
    ${joins.join("\n")}
    ${orderBy}
    LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );

  return rows.map((vendor) => ({
    id: vendor.id,
    name: vendor.name,
    location: vendor.address,
    email: vendor.email,
    category: vendor.category,
    status: vendor.is_approved ? "Active" : "Closed",
    rating: vendor.rating === null || vendor.rating === undefined ? null : Number(vendor.rating),
    submittedAt: vendor.created_at,
  }));
};

export const findPlaceCategories = async () => {
  const rows = await optionalRows(
    `
    SELECT
      id::text,
      slug,
      name,
      description
    FROM place_categories
    ORDER BY name ASC
    `
  );

  return rows.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description,
  }));
};

export const approveVendor = async (id, approved) => {
  const result = await pool.query(
    `
    UPDATE places
    SET status = CASE WHEN $1 THEN 'active' ELSE 'closed' END,
        is_open = $1,
        is_admin_managed = CASE WHEN $1 THEN FALSE ELSE TRUE END,
        updated_at = NOW()
    WHERE id = $2
    RETURNING id::text, name, status, is_open, is_admin_managed
    `,
    [approved, id]
  );
  return result.rows[0] ?? null;
};

const insertAllowed = async (tableName, values, client = pool) => {
  const allowed = new Set(await getColumns(tableName));
  const keys = Object.keys(values).filter((key) => allowed.has(key) && values[key] !== undefined);
  const placeholders = keys.map((_, index) => `$${index + 1}`);
  const result = await client.query(
    `
    INSERT INTO ${quoteIdent(tableName)} (${keys.map(quoteIdent).join(", ")})
    VALUES (${placeholders.join(", ")})
    RETURNING *
    `,
    keys.map((key) => values[key])
  );
  return result.rows[0] ?? null;
};

export const getStallManagementOptions = async () => {
  const [vendors, categories, places] = await Promise.all([
    optionalRows(
      `
      SELECT id::text, CONCAT_WS(' ', first_name, last_name) AS name, email
      FROM users
      WHERE role_scope = 'VENDOR'
      ORDER BY first_name ASC, last_name ASC, email ASC
      LIMIT 300
      `
    ),
    optionalRows(
      `
      SELECT id::text, name, slug, description
      FROM place_categories
      ORDER BY name ASC
      `
    ),
    optionalRows(
      `
      SELECT p.id::text, p.name, p.owner_id::text, COALESCE(u.email, '') AS owner_email
      FROM places p
      JOIN users u ON u.id::text = p.owner_id::text AND u.role_scope = 'VENDOR'
      ORDER BY p.created_at DESC NULLS LAST
      LIMIT 300
      `
    ),
  ]);

  return {
    vendors: vendors.map((vendor) => ({
      id: vendor.id,
      name: vendor.name?.trim() || vendor.email,
      email: vendor.email,
    })),
    categories,
    places,
  };
};

export const createStall = async (payload) => {
  const { ownerId, categoryId, name, description, address, priceRange, latitude, longitude } = payload;
  const columns = await getColumns("places");
  const allowed = new Set(columns);
  const lat = latitude ?? 11.5564;
  const lng = longitude ?? 104.9282;
  const displayPhotoUrl = imageDisplayUrlFromStorageInput(payload, ["photoUrl", "photo_url"]);
  const status = normalizePlaceStatus(payload.status ?? PLACE_STATUS.ACTIVE);
  const isOpen = status === PLACE_STATUS.ACTIVE;

  const stall = await withTransaction(async (client) => {
    let created;
    const owner = await ensureVendorOwner(ownerId, client);

    if (allowed.has("location")) {
      const result = await client.query(
        `INSERT INTO places (owner_id, category_id, name, description, address, price_range, photo_url, is_open, status, is_admin_managed, location)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, FALSE, ST_SetSRID(ST_MakePoint($10, $11), 4326)::geography)
         RETURNING id::text`,
        [
          owner.id,
          categoryId,
          name,
          description || null,
          address || null,
          priceRange == null ? null : Number(priceRange),
          displayPhotoUrl ?? null,
          isOpen,
          status,
          lng,
          lat,
        ]
      );
      created = result.rows[0] ?? null;
    } else {
      created = await insertAllowed(
        "places",
        {
          owner_id: owner.id,
          category_id: categoryId,
          name,
          description: description || null,
          address: address || null,
          price_range: priceRange || null,
          photo_url: displayPhotoUrl ?? null,
          is_open: isOpen,
          status,
          is_admin_managed: false,
        },
        client
      );
    }

    if (!created) return null;

    await upsertPrimaryPlaceImage(client, created.id, payload, uploadedBy(payload, owner.id));
    await replacePlaceHours(client, created.id, normalizeOperatingSchedule(payload));
    const menuItemIds = [...new Set((payload.menuItemIds ?? payload.menu_item_ids ?? []).map(String))];
    if (menuItemIds.length > 0) {
      const result = await client.query(
        `INSERT INTO place_menu_items (place_id, menu_item_id, is_available, price)
         SELECT $1, mi.id, TRUE, mi.default_price
         FROM menu_items mi
         WHERE mi.owner_id = $2 AND mi.id::text = ANY($3::text[])
         ON CONFLICT (place_id, menu_item_id) DO NOTHING`,
        [created.id, owner.id, menuItemIds]
      );
      if (result.rowCount !== menuItemIds.length) {
        throw new AppError("One or more menu items do not belong to the selected vendor", 400);
      }
    }
    return created;
  });

  return stall ? findStallById(stall.id) : null;
};

export const getDeletionImpact = async (id) => {
  const [menuItems, reviews, images] = await Promise.all([
    optionalRows(
      "SELECT COUNT(*)::int AS count FROM place_menu_items WHERE place_id::text = $1", [id]
    ),
    optionalRows(
      "SELECT COUNT(*)::int AS count FROM reviews WHERE place_id::text = $1", [id]
    ),
    optionalRows(
      "SELECT COUNT(*)::int AS count FROM place_images WHERE place_id::text = $1", [id]
    ),
  ]);
  return {
    menuItems: menuItems[0]?.count ?? 0,
    reviews: reviews[0]?.count ?? 0,
    images: images[0]?.count ?? 0,
  };
};

export const deleteStall = async (id) => {
  return withTransaction(async (client) => {
    await client.query("DELETE FROM place_menu_items WHERE place_id::text = $1", [id]);
    await client.query("DELETE FROM place_hours WHERE place_id::text = $1", [id]);
    await client.query("DELETE FROM place_images WHERE place_id::text = $1", [id]);
    const result = await client.query(
      "UPDATE places SET deleted_at = NOW(), updated_at = NOW() WHERE id::text = $1 AND deleted_at IS NULL RETURNING id::text",
      [id]
    );
    return result.rows[0] ?? null;
  });
};

export const createStallMenuItem = async (placeId, payload) => {
  const displayImageUrl = imageDisplayUrlFromStorageInput(payload, ["imageUrl", "image_url"]);
  return withTransaction(async (client) => {
    const result = await client.query(
      `WITH target_place AS (
         SELECT id, owner_id FROM places WHERE id::text = $1 AND deleted_at IS NULL
       ), created_item AS (
         INSERT INTO menu_items (owner_id, name, description, default_price, category, image_url)
         SELECT owner_id, $2, $3, $4, $5, $6 FROM target_place
         RETURNING *
       ), linked_item AS (
         INSERT INTO place_menu_items (place_id, menu_item_id, is_available, price)
         SELECT id, (SELECT id FROM created_item), $7, (SELECT default_price FROM created_item) FROM target_place
       )
       SELECT * FROM created_item`,
      [
        placeId,
        payload.name,
        payload.description || null,
        payload.price,
        normalizeMenuItemCategory(payload.category),
        displayImageUrl ?? null,
        payload.isAvailable ?? payload.is_available ?? true,
      ]
    );
    const item = result.rows[0] ?? null;

    if (!item) return null;

    const image = await upsertPrimaryMenuItemImage(client, item.id, payload, uploadedBy(payload));
    return withMenuImageMetadata(item, image);
  });
};

export const deleteStallMenuItem = async (id, placeId = null) => {
  if (!placeId) {
    throw new AppError("placeId is required to delete a stall menu item. Use vendor endpoints to manage the global menu catalog.", 400);
  }
  const result = await pool.query(
    `DELETE FROM place_menu_items pmi
     USING places p
     WHERE pmi.menu_item_id::text = $1 AND pmi.place_id::text = $2
       AND p.id = pmi.place_id
     RETURNING pmi.menu_item_id::text AS id`,
    [id, placeId]
  );
  return result.rows[0] ?? null;
};

export const createStallCategory = async (payload) => {
  const name = String(payload.name ?? "").trim();
  const slug = String(payload.slug ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")).trim();
  return insertAllowed("place_categories", {
    name,
    slug,
    description: payload.description || null,
  });
};

export const deleteStallCategory = async (id) => {
  const usage = await optionalRows(
    "SELECT COUNT(*)::int AS count FROM places WHERE category_id::text = $1 AND deleted_at IS NULL",
    [id]
  );
  if ((usage[0]?.count ?? 0) > 0) {
    throw new AppError(
      `Cannot delete category: ${usage[0].count} place(s) still use it. Reassign or remove them first.`,
      409
    );
  }
  const result = await pool.query("DELETE FROM place_categories WHERE id::text = $1 RETURNING id::text", [id]);
  return result.rows[0] ?? null;
};

export const createStallPlaceHour = async (placeId, payload) => {
  return insertAllowed("place_hours", {
    place_id: placeId,
    day_of_week: payload.dayOfWeek,
    opens_at: payload.opensAt,
    closes_at: payload.closesAt,
    is_closed: payload.isClosed ?? false,
  });
};

export const deleteStallPlaceHour = async (id) => {
  const result = await pool.query("DELETE FROM place_hours WHERE id::text = $1 RETURNING id::text", [id]);
  return result.rows[0] ?? null;
};

export const createStallReview = async (placeId, payload) => {
  return insertAllowed("reviews", {
    place_id: placeId,
    user_id: payload.userId || null,
    rating: payload.rating,
    body: payload.body || null,
    is_moderated: payload.isModerated ?? true,
  });
};

export const deleteStallReview = async (id) => {
  const result = await pool.query(
    "UPDATE reviews SET deleted_at = NOW() WHERE id::text = $1 AND deleted_at IS NULL RETURNING id::text, place_id",
    [id]
  );
  if (result.rows[0]) {
    await pool.query("SELECT refresh_place_rating($1)", [result.rows[0].place_id]);
  }
  return result.rows[0] ?? null;
};

export const getAllReviews = async (limit = 2000, offset = 0) => {
  const { rows } = await pool.query(
    `SELECT r.id, r.rating AS stars, r.body, r.created_at,
            u.first_name || ' ' || u.last_name AS user_name,
            p.name AS place_name, p.id AS place_id,
            r.flagged_at, r.deleted_at
     FROM reviews r
     JOIN places p ON p.id = r.place_id
     JOIN users u ON u.id = r.user_id
     ORDER BY r.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
};

export const getReviewsByPlaceId = async (placeId, limit = 2000) => {
  const { rows } = await pool.query(
    `SELECT r.id, r.rating AS stars, r.body, r.created_at,
            u.first_name || ' ' || u.last_name AS user_name,
            p.name AS place_name, p.id AS place_id
     FROM reviews r
     JOIN places p ON p.id = r.place_id
     JOIN users u ON u.id = r.user_id
     WHERE r.place_id::text = $1
     ORDER BY r.created_at DESC
     LIMIT $2`,
    [placeId, limit]
  );
  return rows;
};

export const findAllRoles = async () => {
  const tableName = "role";

  const rows = await optionalRows(
    `
    SELECT
      r.id::text,
      r.name,
      r.base_scope,
      r.table_privileges,
      r.system_capabilities,
      r.grant_option,
      r.is_system,
      r.created_at,
      COALESCE(u.user_count, 0)::int AS user_count
    FROM "${tableName}" r
    LEFT JOIN (
      SELECT role_id, COUNT(*) AS user_count
      FROM users
      GROUP BY role_id
    ) u ON u.role_id = r.id
    ORDER BY r.created_at DESC
    `
  );

  return rows.map((role) => ({
    id: role.id,
    name: role.name,
    baseScope: role.base_scope,
    tablePrivileges: role.table_privileges ?? {},
    systemCapabilities: role.system_capabilities ?? [],
    grantOption: Boolean(role.grant_option),
    isSystem: Boolean(role.is_system),
    userCount: role.user_count,
    createdAt: role.created_at,
  }));
};

export const createRole = async ({ name, tablePrivileges, systemCapabilities, grantOption }) => {
  const tableName = "role";
  try {
    const result = await pool.query(
      `INSERT INTO "${tableName}"
         (name, base_scope, table_privileges, system_capabilities, grant_option, is_system)
       VALUES ($1,'GLOBAL_ADMIN',$2,$3,$4,FALSE)
       RETURNING id::text, name, base_scope, table_privileges, system_capabilities,
                 grant_option, is_system, created_at, updated_at`,
      [name, JSON.stringify(tablePrivileges ?? {}), JSON.stringify(systemCapabilities ?? []), grantOption ?? false]
    );
    const role = result.rows[0];
    return {
      id: role.id,
      name: role.name,
      baseScope: role.base_scope,
      tablePrivileges: role.table_privileges ?? {},
      systemCapabilities: role.system_capabilities ?? [],
      grantOption: Boolean(role.grant_option),
      isSystem: Boolean(role.is_system),
      createdAt: role.created_at,
    };
  } catch (error) {
    if (error.code === "23505") {
      throw new AppError(`Role "${name}" already exists`, 409, {
        code: "ROLE_NAME_DUPLICATE",
        fieldErrors: { name: "A role with this name already exists." },
      });
    }
    throw error;
  }
};

export const linkExistingStallMenuItem = async (placeId, menuItemId, payload = {}) => {
  const result = await pool.query(
    `INSERT INTO place_menu_items (place_id, menu_item_id, is_available, price)
     SELECT p.id,
            mi.id,
            $3,
            COALESCE($4, mi.default_price)
     FROM places p
     JOIN menu_items mi ON mi.owner_id = p.owner_id
     WHERE p.id::text = $1
       AND mi.id::text = $2
       AND p.deleted_at IS NULL
     ON CONFLICT (place_id, menu_item_id) DO UPDATE
       SET is_available = EXCLUDED.is_available,
           price = EXCLUDED.price,
           updated_at = NOW()
     RETURNING menu_item_id::text AS id, price, is_available`,
    [
      placeId,
      menuItemId,
      payload.isAvailable ?? payload.is_available ?? true,
      payload.price ?? null,
    ]
  );
  return result.rows[0] ?? null;
};

export const updateRoleRecord = async (id, { name, tablePrivileges, systemCapabilities, grantOption }) => {
  const tableName = "role";
  const result = await pool.query(
    `
    UPDATE "${tableName}"
    SET name = CASE WHEN is_system THEN name ELSE COALESCE($2, name) END,
        table_privileges = COALESCE($3::jsonb, table_privileges),
        system_capabilities = COALESCE($4::jsonb, system_capabilities),
        grant_option = COALESCE($5, grant_option),
        updated_at = NOW()
    WHERE id = $1
    RETURNING id::text, name, base_scope, table_privileges, system_capabilities,
              grant_option, is_system, created_at, updated_at
    `,
    [
      id,
      name ?? null,
      tablePrivileges ? JSON.stringify(tablePrivileges) : null,
      systemCapabilities ? JSON.stringify(systemCapabilities) : null,
      typeof grantOption === "boolean" ? grantOption : null,
    ]
  );

  const role = result.rows[0];
  if (!role) return null;

  return {
    id: role.id,
    name: role.name,
    baseScope: role.base_scope,
    tablePrivileges: role.table_privileges ?? {},
    systemCapabilities: role.system_capabilities ?? [],
    grantOption: Boolean(role.grant_option),
    isSystem: Boolean(role.is_system),
    createdAt: role.created_at,
  };
};

export const countUsersByRoleScope = async (roleScope) => {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS count FROM users WHERE role_scope = $1`,
    [roleScope]
  );
  return result.rows[0].count;
};

export const countUsersByRoleId = async (roleId) => {
  const result = await pool.query("SELECT COUNT(*)::int AS count FROM users WHERE role_id = $1", [roleId]);
  return result.rows[0]?.count ?? 0;
};

export const getRoleRecordById = async (id) => {
  const tableName = "role";
  const result = await pool.query(
    `SELECT id::text, name, base_scope, table_privileges, system_capabilities,
            grant_option, is_system, created_at, updated_at
     FROM "${tableName}" WHERE id = $1`,
    [id]
  );
  if (!result.rows[0]) return null;
  const role = result.rows[0];
  return {
    id: role.id,
    name: role.name,
    baseScope: role.base_scope,
    tablePrivileges: role.table_privileges,
    systemCapabilities: role.system_capabilities ?? [],
    grantOption: Boolean(role.grant_option),
    isSystem: Boolean(role.is_system),
    createdAt: role.created_at,
  };
};

export const getRoleRecordByName = async (name) => {
  const result = await pool.query(
    `SELECT id::text, name, base_scope, table_privileges, system_capabilities,
            grant_option, is_system, created_at, updated_at
     FROM "role" WHERE UPPER(name) = UPPER($1) LIMIT 1`,
    [name]
  );
  const role = result.rows[0];
  if (!role) return null;
  return {
    id: role.id,
    name: role.name,
    baseScope: role.base_scope,
    tablePrivileges: role.table_privileges ?? {},
    systemCapabilities: role.system_capabilities ?? [],
    grantOption: Boolean(role.grant_option),
    isSystem: Boolean(role.is_system),
    createdAt: role.created_at,
  };
};

export const deleteRoleRecord = async (id) => {
  const tableName = "role";
  const result = await pool.query(
    `DELETE FROM "${tableName}" WHERE id = $1 AND is_system = FALSE RETURNING id::text`,
    [id]
  );

  return result.rows[0] ?? null;
};

export const findAllStalls = async (page = 1, limit = 50) => {
  const offset = (page - 1) * limit;
  const rows = await optionalRows(
    `
    SELECT
      p.id::text,
      p.name,
      p.description,
      p.address,
      p.price_range,
      p.photo_url,
      p.is_admin_managed,
      p.is_open,
      p.status,
      CASE WHEN p.status = 'active' AND p.is_open = TRUE THEN true ELSE false END AS is_approved,
      p.rating_avg,
      p.rating_count,
      p.owner_id::text,
      ${primaryPlaceImageSelect},
      COALESCE(u.email, '') AS owner_email,
      CONCAT_WS(' ', u.first_name, u.last_name) AS owner_name,
      ST_AsGeoJSON(p.location)::jsonb AS location,
      ${PLACE_HOURS_JSON_SELECT},
      jsonb_build_object(
        'id', pc.id::text,
        'name', pc.name,
        'slug', pc.slug
      ) AS category,
      to_jsonb(p) AS place_details
    FROM places p
    JOIN users u ON u.id::text = p.owner_id::text AND u.role_scope = 'VENDOR'
    LEFT JOIN place_categories pc ON pc.id::text = p.category_id::text
    ${primaryPlaceImageJoin}
    ORDER BY p.created_at DESC NULLS LAST
    LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );

  return rows.map((row) => {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      address: row.address,
      priceRange: row.price_range,
      photoUrl: storageImageUrlFromMetadata(toStorageImage(row)) || row.photo_url,
      storageImage: toStorageImage(row),
      isAdminManaged: row.is_admin_managed,
      isOpen: row.is_open,
      status: row.status,
      isApproved: row.is_approved,
      rating: row.rating ?? row.rating_avg ?? null,
      ratingAvg: row.rating_avg ?? null,
      ratingCount: row.rating_count ?? 0,
      ownerId: row.owner_id,
      ownerEmail: row.owner_email,
      ownerName: row.owner_name,
      category: row.category,
      location: row.location,
      operatingHours: row.operating_hours,
    };
  });
};

export const findStallsByOwner = async (ownerId, limit = 50) => {
  const rows = await optionalRows(
    `
    SELECT
      p.id::text,
      p.name,
      p.description,
      p.address,
      p.price_range,
      p.photo_url,
      p.is_admin_managed,
      p.is_open,
      p.status,
      CASE WHEN p.status = 'active' AND p.is_open = TRUE THEN true ELSE false END AS is_approved,
      p.rating_avg,
      p.rating_count,
      p.owner_id::text,
      ${primaryPlaceImageSelect},
      COALESCE(u.email, '') AS owner_email,
      CONCAT_WS(' ', u.first_name, u.last_name) AS owner_name,
      ST_AsGeoJSON(p.location)::jsonb AS location,
      ${PLACE_HOURS_JSON_SELECT},
      jsonb_build_object(
        'id', pc.id::text,
        'name', pc.name,
        'slug', pc.slug
      ) AS category,
      to_jsonb(p) AS place_details
    FROM places p
    JOIN users u ON u.id::text = p.owner_id::text AND u.role_scope = 'VENDOR'
    LEFT JOIN place_categories pc ON pc.id::text = p.category_id::text
    ${primaryPlaceImageJoin}
    WHERE p.owner_id::text = $1
    ORDER BY p.created_at DESC NULLS LAST
    LIMIT $2
    `,
    [ownerId, limit]
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    address: row.address,
    priceRange: row.price_range,
    photoUrl: storageImageUrlFromMetadata(toStorageImage(row)) || row.photo_url,
    storageImage: toStorageImage(row),
    isAdminManaged: row.is_admin_managed,
    isOpen: row.is_open,
    status: row.status,
    isApproved: row.is_approved,
    rating: row.rating ?? row.rating_avg ?? null,
    ratingAvg: row.rating_avg ?? null,
    ratingCount: row.rating_count ?? 0,
    ownerId: row.owner_id,
    ownerEmail: row.owner_email,
    ownerName: row.owner_name,
    category: row.category,
    location: row.location,
    operatingHours: row.operating_hours,
  }));
};

export const findStallById = async (id) => {
  const rows = await optionalRows(
    `
    SELECT
      p.id::text,
      p.name,
      p.description,
      p.address,
      p.price_range,
      p.photo_url,
      p.is_admin_managed,
      p.is_open,
      p.status,
      CASE WHEN p.status = 'active' AND p.is_open = TRUE THEN true ELSE false END AS is_approved,
      p.rating_avg,
      p.rating_count,
      p.owner_id::text,
      ${primaryPlaceImageSelect},
      COALESCE(u.email, '') AS owner_email,
      CONCAT_WS(' ', u.first_name, u.last_name) AS owner_name,
      ST_AsGeoJSON(p.location)::jsonb AS location,
      ${PLACE_HOURS_JSON_SELECT},
      jsonb_build_object(
        'id', pc.id::text,
        'name', pc.name,
        'slug', pc.slug
      ) AS category,
      to_jsonb(p) AS place_details
    FROM places p
    JOIN users u ON u.id::text = p.owner_id::text AND u.role_scope = 'VENDOR'
    LEFT JOIN place_categories pc ON pc.id::text = p.category_id::text
    ${primaryPlaceImageJoin}
    WHERE p.id::text = $1
    ORDER BY p.created_at DESC NULLS LAST
    LIMIT 1
    `,
    [id]
  );

  if (!rows.length) return null;
  const row = rows[0];
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    address: row.address,
    priceRange: row.price_range,
    photoUrl: storageImageUrlFromMetadata(toStorageImage(row)) || row.photo_url,
    storageImage: toStorageImage(row),
    isAdminManaged: row.is_admin_managed,
    isOpen: row.is_open,
    status: row.status,
    isApproved: row.is_approved,
    rating: row.rating ?? row.rating_avg ?? null,
    ratingAvg: row.rating_avg ?? null,
    ratingCount: row.rating_count ?? 0,
    ownerId: row.owner_id,
    ownerEmail: row.owner_email,
    ownerName: row.owner_name,
    category: row.category,
    location: row.location,
    operatingHours: row.operating_hours,
  };
};

export const updateStall = async (id, payload) => {
  const allowed = new Set(await getColumns("places"));
  const sets = [];
  const params = [];
  let idx = 1;
  const displayPhotoUrl = imageDisplayUrlFromStorageInput(payload, ["photoUrl", "photo_url"]);
  const ownerIdUpdate = payload.ownerId === undefined ? null : String(payload.ownerId ?? "").trim();

  const fieldMap = {
    name: "name",
    description: "description",
    address: "address",
    priceRange: "price_range",
    categoryId: "category_id",
  };

  let hasLocation = false;
  let locationLat = null;
  let locationLng = null;
  let lifecycleStatus = null;

  for (const [key, col] of Object.entries(fieldMap)) {
    if (payload[key] !== undefined && allowed.has(col)) {
      sets.push(`${quoteIdent(col)} = $${idx++}`);
      params.push(payload[key]);
    }
  }

  if (payload.status !== undefined && allowed.has("status")) {
    const status = normalizePlaceStatus(payload.status);
    lifecycleStatus = status;
    sets.push(`${quoteIdent("status")} = $${idx++}`);
    params.push(status);

    if (allowed.has("is_open")) {
      sets.push(`${quoteIdent("is_open")} = $${idx++}`);
      params.push(status === PLACE_STATUS.ACTIVE);
    }
  } else if (payload.isOpen !== undefined && allowed.has("is_open")) {
    const isOpen = Boolean(payload.isOpen);
    lifecycleStatus = isOpen ? PLACE_STATUS.ACTIVE : PLACE_STATUS.CLOSED;
    sets.push(`${quoteIdent("is_open")} = $${idx++}`);
    params.push(isOpen);

    if (allowed.has("status")) {
      sets.push(`${quoteIdent("status")} = $${idx++}`);
      params.push(isOpen ? PLACE_STATUS.ACTIVE : PLACE_STATUS.CLOSED);
    }
  }

  if (payload.isAdminManaged !== undefined && allowed.has("is_admin_managed")) {
    sets.push(`${quoteIdent("is_admin_managed")} = $${idx++}`);
    params.push(Boolean(payload.isAdminManaged));
  } else if (lifecycleStatus && allowed.has("is_admin_managed")) {
    sets.push(`${quoteIdent("is_admin_managed")} = $${idx++}`);
    params.push(lifecycleStatus === PLACE_STATUS.CLOSED);
  }

  if (payload.ownerId !== undefined && allowed.has("owner_id")) {
    if (!ownerIdUpdate) {
      throw new AppError("Vendor owner is required", 400);
    }
    sets.push(`${quoteIdent("owner_id")} = $${idx++}`);
    params.push(ownerIdUpdate);
  }

  if (displayPhotoUrl !== undefined && allowed.has("photo_url")) {
    sets.push(`${quoteIdent("photo_url")} = $${idx++}`);
    params.push(displayPhotoUrl);
  }

  if (payload.latitude !== undefined && payload.longitude !== undefined && allowed.has("location")) {
    hasLocation = true;
    locationLat = payload.latitude;
    locationLng = payload.longitude;
  }

  const hasImageUpdate = hasStorageImageInput(payload);
  if (sets.length === 0 && !hasLocation && !hasImageUpdate) return null;

  if (hasLocation) {
    sets.push(`location = ST_SetSRID(ST_MakePoint($${idx++}, $${idx++}), 4326)::geography`);
    params.push(locationLng, locationLat);
  }

  if (allowed.has("updated_at")) {
    sets.push("updated_at = NOW()");
  }

  const updatedStall = await withTransaction(async (client) => {
    let stall = { id };

    if (ownerIdUpdate) {
      await ensureVendorOwner(ownerIdUpdate, client);
    }

    if (sets.length > 0 || hasLocation) {
      params.push(id);
      const result = await client.query(
        `UPDATE places SET ${sets.join(", ")} WHERE id::text = $${idx} RETURNING id::text`,
        params
      );
      stall = result.rows[0] ?? null;
    } else {
      const result = await client.query("SELECT id::text FROM places WHERE id::text = $1 LIMIT 1", [id]);
      stall = result.rows[0] ?? null;
    }

    if (!stall) return null;

    await upsertPrimaryPlaceImage(client, id, payload, uploadedBy(payload, payload.ownerId));
    await replacePlaceHours(client, id, normalizeOperatingSchedule(payload));
    if (payload.menuItemIds !== undefined || payload.menu_item_ids !== undefined) {
      const menuItemIds = [...new Set((payload.menuItemIds ?? payload.menu_item_ids ?? []).map(String))];
      const ownerResult = await client.query("SELECT owner_id FROM places WHERE id::text = $1", [id]);
      const currentOwnerId = ownerResult.rows[0]?.owner_id;
      if (menuItemIds.length > 0) {
        await client.query(
          `INSERT INTO place_menu_items (place_id, menu_item_id, is_available, price)
           SELECT $1, mi.id, TRUE, mi.default_price
           FROM menu_items mi
           WHERE mi.owner_id = $2 AND mi.id::text = ANY($3::text[])
           ON CONFLICT (place_id, menu_item_id) DO NOTHING`,
          [id, currentOwnerId, menuItemIds]
        );
        const ownershipCheck = await client.query(
          `SELECT COUNT(*)::int AS count
           FROM menu_items
           WHERE owner_id = $1 AND id::text = ANY($2::text[])`,
          [currentOwnerId, menuItemIds]
        );
        if (ownershipCheck.rows[0]?.count !== menuItemIds.length) {
          throw new AppError("One or more menu items do not belong to the stall owner", 400);
        }
        await client.query(
          `DELETE FROM place_menu_items
           WHERE place_id::text = $1 AND NOT (menu_item_id::text = ANY($2::text[]))`,
          [id, menuItemIds]
        );
      } else {
        await client.query("DELETE FROM place_menu_items WHERE place_id::text = $1", [id]);
      }
    } else if (ownerIdUpdate) {
      await client.query("DELETE FROM place_menu_items WHERE place_id::text = $1", [id]);
    }
    return stall;
  });

  return updatedStall ? findStallById(id) : null;
};

export const updateStallStatus = async (id, isOpen) => {
  const result = await pool.query(
    `UPDATE places
     SET is_open = $1,
         status = CASE WHEN $1 THEN 'active' ELSE 'closed' END,
         is_admin_managed = CASE WHEN $1 THEN FALSE ELSE TRUE END,
         updated_at = NOW()
     WHERE id::text = $2
     RETURNING id::text, is_open, status, is_admin_managed`,
    [isOpen, id]
  );
  return result.rows[0] ?? null;
};

export const findAllMenuItems = async (placeId = null, ownerId = null) => {
  const rows = await optionalRows(
    `
    SELECT
      mi.id::text,
      mi.name,
      mi.description,
      mi.default_price,
      COALESCE(pmi.price, mi.default_price) AS price,
      mi.category,
      mi.image_url,
      ${primaryMenuItemImageSelect},
      COALESCE(pmi.is_available, TRUE) AS is_available,
      pmi.place_id::text,
      p.name AS place_name
    FROM menu_items mi
    LEFT JOIN LATERAL (
      SELECT link.place_id, link.is_available, link.price
      FROM place_menu_items link
      WHERE link.menu_item_id = mi.id
        ${placeId ? `AND link.place_id::text = $1` : ""}
      ORDER BY link.created_at ASC
      LIMIT 1
    ) pmi ON TRUE
    LEFT JOIN places p ON p.id = pmi.place_id
    ${primaryMenuItemImageJoin}
    ${placeId ? `WHERE pmi.place_id IS NOT NULL` : ownerId ? `WHERE mi.owner_id::text = $1` : ""}
    ORDER BY p.name ASC, mi.name ASC
    `
  ,
    placeId ? [placeId] : ownerId ? [ownerId] : []
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    imageUrl: storageImageUrlFromMetadata(toStorageImage(row)) || row.image_url,
    storageImage: toStorageImage(row),
    isAvailable: row.is_available,
    placeId: row.place_id,
    placeName: row.place_name,
  }));
};

export const updateMenuItem = async (id, payload) => {
  const allowed = new Set(await getColumns("menu_items"));
  const sets = [];
  const params = [];
  let idx = 1;
  const displayImageUrl = imageDisplayUrlFromStorageInput(payload, ["imageUrl", "image_url"]);
  const placeId = payload.placeId ?? payload.place_id;

  const fieldMap = {
    name: "name",
    description: "description",
    price: "default_price",
    category: "category",
  };

  for (const [key, col] of Object.entries(fieldMap)) {
    if (key === "price" && placeId) continue;
    if (payload[key] !== undefined && allowed.has(col)) {
      const val = key === "category" ? normalizeMenuItemCategory(payload[key]) : payload[key];
      sets.push(`${quoteIdent(col)} = $${idx++}`);
      params.push(val);
    }
  }
  if (displayImageUrl !== undefined && allowed.has("image_url")) {
    sets.push(`${quoteIdent("image_url")} = $${idx++}`);
    params.push(displayImageUrl);
  }

  const hasImageUpdate = hasStorageImageInput(payload);
  const hasLinkUpdate = placeId && (
    payload.price !== undefined ||
    payload.isAvailable !== undefined ||
    payload.is_available !== undefined
  );
  if (sets.length === 0 && !hasImageUpdate && !hasLinkUpdate) return null;

  return withTransaction(async (client) => {
    let item = { id };

    if (sets.length > 0) {
      params.push(id);
      const result = await client.query(
        `UPDATE menu_items SET ${sets.join(", ")} WHERE id::text = $${idx} RETURNING *`,
        params
      );
      item = result.rows[0] ?? null;
    } else {
      const result = await client.query("SELECT * FROM menu_items WHERE id::text = $1 LIMIT 1", [id]);
      item = result.rows[0] ?? null;
    }

    if (!item) return null;

    if (hasLinkUpdate) {
      await client.query(
        `UPDATE place_menu_items
         SET price = COALESCE($1, price),
             is_available = COALESCE($2, is_available),
             updated_at = NOW()
         WHERE menu_item_id::text = $3 AND place_id::text = $4`,
        [payload.price ?? null, payload.isAvailable ?? payload.is_available ?? null, id, placeId]
      );
    }

    const image = await upsertPrimaryMenuItemImage(client, id, payload, uploadedBy(payload));
    return withMenuImageMetadata(item, image);
  });
};

export const getAuditActivity = async () => {
  const rows = await optionalRows(
    `
    SELECT
      pid::int AS pid,
      usename AS username,
      application_name,
      client_addr::text,
      state,
      query_start,
      state_change,
      wait_event_type,
      wait_event,
      query
    FROM pg_stat_activity
    WHERE state IS DISTINCT FROM 'idle'
      AND pid <> pg_backend_pid()
    ORDER BY query_start DESC NULLS LAST
    LIMIT 50
    `,
    []
  );
  return rows;
};

// ── Audit Log Table ────────────────────────────────────────────────────

export const ensureAuditLogTable = async () => {
  if (!(await tableExists("audit_log"))) {
    console.warn("[audit_log] Table missing; run the authoritative seed/migration before using audit logs.");
  }
};

export const getAuditLogs = async (limit = 50) => {
  await ensureAuditLogTable();
  const rows = await optionalRows(
    `
    SELECT
      id::text,
      admin_id,
      action,
      target_type,
      target_id,
      details,
      role_scope,
      created_at
    FROM audit_log
    ORDER BY created_at DESC
    LIMIT $1
    `,
    [limit],
    []
  );
  return rows.map((row) => ({
    id: row.id,
    adminId: row.admin_id,
    action: row.action,
    targetType: row.target_type,
    targetId: row.target_id,
    details: row.details,
    roleScope: row.role_scope,
    createdAt: row.created_at,
  }));
};

export const getAuditLogsByRoleScope = async (roleScope, limit = 100) => {
  await ensureAuditLogTable();
  const rows = await optionalRows(
    `
    SELECT
      al.id::text,
      al.admin_id,
      al.actor_id,
      al.action,
      al.target_type,
      al.target_id,
      al.details,
      al.role_scope,
      al.created_at,
      u.email AS actor_email,
      u.first_name AS actor_first_name,
      u.last_name AS actor_last_name
    FROM audit_log al
    LEFT JOIN users u ON u.id = al.actor_id
    WHERE al.role_scope = $1
    ORDER BY al.created_at DESC
    LIMIT $2
    `,
    [roleScope, limit],
    []
  );
  return rows.map((row) => ({
    id: row.id,
    adminId: row.admin_id,
    actorId: row.actor_id,
    actorEmail: row.actor_email,
    actorFirstName: row.actor_first_name,
    actorLastName: row.actor_last_name,
    action: row.action,
    targetType: row.target_type,
    targetId: row.target_id,
    details: row.details,
    roleScope: row.role_scope,
    createdAt: row.created_at,
  }));
};

// ── User CRUD ──────────────────────────────────────────────────────────

export const getUserById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      id::text,
      email,
      first_name,
      last_name,
      phone_number,
      u.role_scope,
      u.role_id::text,
      r.name AS role_name,
      is_banned,
      created_at,
      updated_at
    FROM users u
    JOIN "role" r ON r.id = u.role_id
    WHERE u.id::text = $1
    `,
    [id]
  );
  const user = result.rows[0];
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone_number,
    role: user.role_name,
    roleId: user.role_id,
    roleScope: user.role_scope,
    isBanned: user.is_banned,
    status: user.is_banned ? "Suspended" : "Active",
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

export const updateUser = async (id, { firstName, lastName, email, roleId, roleScope }) => {
  const sets = [];
  const params = [];
  let idx = 1;

  if (roleScope !== undefined && roleScope !== "VENDOR") {
    const ownedPlaceCount = await getOwnedPlaceCount(id);
    if (ownedPlaceCount > 0) {
      throw new AppError(
        `Cannot change this vendor role while they own ${ownedPlaceCount} place${ownedPlaceCount === 1 ? "" : "s"}. Reassign or delete those places first.`,
        409
      );
    }
  }

  if (firstName !== undefined) {
    sets.push(`first_name = $${idx++}`);
    params.push(firstName);
  }
  if (lastName !== undefined) {
    sets.push(`last_name = $${idx++}`);
    params.push(lastName);
  }
  if (email !== undefined) {
    sets.push(`email = $${idx++}`);
    params.push(email);
  }
  if (roleScope !== undefined) {
    sets.push(`role_scope = $${idx++}`);
    params.push(roleScope);
  }
  if (roleId !== undefined) {
    sets.push(`role_id = $${idx++}`);
    params.push(roleId);
  }

  if (sets.length === 0) return null;

  params.push(id);
  let result;
  try {
    result = await pool.query(
      `UPDATE users SET ${sets.join(", ")}, updated_at = NOW() WHERE id::text = $${idx}
       RETURNING id::text, email, first_name, last_name, role_scope, role_id::text, is_banned`,
      params
    );
  } catch (error) {
    if (error.code === "23505" && error.constraint === "users_email_key") {
      throw new AppError("A user with this email already exists", 409, {
        code: "USER_EMAIL_DUPLICATE",
        fieldErrors: { email: "A user with this email already exists." },
      });
    }
    throw error;
  }
  const user = result.rows[0];
  if (!user) return null;
  const assignedRole = await getRoleRecordById(user.role_id);
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: assignedRole?.name ?? user.role_scope,
    roleId: user.role_id,
    roleScope: user.role_scope,
    status: user.is_banned ? "Suspended" : "Active",
  };
};

export const deleteUserRecord = async (id) => {
  const ownedPlaceCount = await getOwnedPlaceCount(id);
  if (ownedPlaceCount > 0) {
    throw new AppError(
      `Cannot delete this vendor while they own ${ownedPlaceCount} place${ownedPlaceCount === 1 ? "" : "s"}. Reassign or delete those places first.`,
      409
    );
  }

  const result = await pool.query(
    `DELETE FROM users WHERE id::text = $1 RETURNING id::text, email`,
    [id]
  );
  return result.rows[0] ?? null;
};

// ── Database Tables ────────────────────────────────────────────────────

export const getDatabaseTables = async () => {
  return getPublicTableNames();
};

// ── Onboarding Config ─────────────────────────────────────────────────

export const getOnboardingConfig = async () => {
  const { rows } = await pool.query(
    "SELECT id, telegram_link, message, steps, safety_tips, footer, updated_at FROM onboarding_config LIMIT 1"
  );
  return rows[0] ?? { telegram_link: "", message: "", steps: [], safety_tips: [], footer: "" };
};

export const updateOnboardingConfig = async (data) => {
  const { rows } = await pool.query(
    `WITH existing AS (
       SELECT id FROM onboarding_config LIMIT 1
     ),
     updated AS (
       UPDATE onboarding_config
       SET telegram_link = COALESCE($1, telegram_link),
           message = COALESCE($2, message),
           steps = COALESCE($3, steps),
           safety_tips = COALESCE($4, safety_tips),
           footer = COALESCE($5, footer),
           updated_at = NOW()
       WHERE id = (SELECT id FROM existing)
       RETURNING id, telegram_link, message, steps, safety_tips, footer, updated_at
     ),
     inserted AS (
       INSERT INTO onboarding_config (telegram_link, message, steps, safety_tips, footer, updated_at)
       SELECT COALESCE($1, ''), COALESCE($2, ''), COALESCE($3, '{}'), COALESCE($4, '{}'), COALESCE($5, ''), NOW()
       WHERE NOT EXISTS (SELECT 1 FROM existing)
       RETURNING id, telegram_link, message, steps, safety_tips, footer, updated_at
     )
     SELECT * FROM updated UNION ALL SELECT * FROM inserted`,
    [data.telegramLink ?? null, data.message ?? null, data.steps ?? null, data.safetyTips ?? null, data.footer ?? null]
  );
  return rows[0];
};

// ── Review Moderation ─────────────────────────────────────────────────

export const flagReview = async (id) => {
  const { rows } = await pool.query(
    `UPDATE reviews
     SET flagged_at = NOW()
     WHERE id::text = $1 AND deleted_at IS NULL
     RETURNING id::text, place_id`,
    [id]
  );
  return rows[0] ?? null;
};

export const unflagReview = async (id) => {
  const { rows } = await pool.query(
    `UPDATE reviews
     SET flagged_at = NULL
     WHERE id::text = $1 AND deleted_at IS NULL
     RETURNING id::text, place_id`,
    [id]
  );
  return rows[0] ?? null;
};

export const removeReview = async (id) => {
  const { rows } = await pool.query(
    `UPDATE reviews
     SET deleted_at = NOW()
     WHERE id::text = $1 AND deleted_at IS NULL
     RETURNING id::text, place_id`,
    [id]
  );
  return rows[0] ?? null;
};

export const refreshPlaceRating = async (placeId) => {
  await pool.query("SELECT refresh_place_rating($1)", [placeId]);
};

// ── Consumer Categories (public) ────────────────────────────────────

export const getConsumerCategories = async () => {
  const { rows } = await pool.query(
    `SELECT id::text, slug, name, description
     FROM place_categories
     ORDER BY name ASC`
  );
  return rows.map((c) => ({ id: c.id, slug: c.slug, name: c.name, description: c.description }));
};

// ── Deletion Impact ─────────────────────────────────────────────────

export const getMenuItemLinkCount = async (menuItemId) => {
  const { rows } = await pool.query(
    "SELECT COUNT(*)::int AS count FROM place_menu_items WHERE menu_item_id::text = $1",
    [menuItemId]
  );
  return rows[0]?.count ?? 0;
};
