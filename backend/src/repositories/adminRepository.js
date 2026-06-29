import pool from "../config/db.js";

const quoteIdent = (value) => `"${String(value).replace(/"/g, '""')}"`;

const menuItemCategory = (cat) => {
  const norm = {
    snack: "snack", snacks: "snack", "main course": "main course",
    main: "main course", drink: "drink", drinks: "drink",
    dessert: "dessert", desserts: "dessert",
  };
  return norm[(cat ?? "").toLowerCase().trim()] || "snack";
};

const optionalRows = async (query, params = [], fallback = []) => {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.warn(`[adminRepository] ${error.message}`);
    return fallback;
  }
};

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

const getRoleTableName = async () => {
  if (await tableExists("role")) return "role";
  if (await tableExists("roles")) return "roles";
  return "role";
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

export const logAuditAction = async (adminId, action, targetType, targetId, details = null) => {
  try {
    await pool.query(
      `
      INSERT INTO audit_log (admin_id, action, target_type, target_id, details)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [adminId, action, targetType, targetId, details ? JSON.stringify(details) : null]
    );
  } catch (err) {
    console.warn(`[audit_log] Failed to log: ${err.message}`);
  }
};

const toStatus = (isBanned) => (isBanned ? "Suspended" : "Active");
const toBanned = (status) => String(status).toLowerCase() === "suspended";

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
      countRows("places", "WHERE status = 'APPROVED'"),
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

export const findAllUsers = async (page, limit) => {
  const offset = (page - 1) * limit;
  const rows = await pool.query(
    `
    SELECT
      id::text,
      email,
      first_name,
      last_name,
      role_scope,
      is_banned,
      created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );

  return rows.rows.map((user) => ({
    id: user.id,
    name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.email,
    email: user.email,
    role: user.role_scope,
    status: toStatus(user.is_banned),
    createdAt: user.created_at,
  }));
};

export const createUser = async (userData) => {
  const result = await pool.query(
    `
    INSERT INTO users (
      email,
      password_hash,
      first_name,
      last_name,
      phone,
      role_scope,
      is_banned
    )
    VALUES ($1,$2,$3,$4,$5,$6,false)
    RETURNING id::text, email, first_name, last_name, role_scope, is_banned, created_at
    `,
    [
      userData.email,
      userData.password_hash,
      userData.first_name,
      userData.last_name,
      userData.phone ?? null,
      userData.role_scope ?? "CONSUMER",
    ]
  );

  const user = result.rows[0];
  return {
    id: user.id,
    name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.email,
    email: user.email,
    role: user.role_scope,
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
  const result = await pool.query(
    `
    UPDATE users
    SET is_banned = $1
    WHERE id = $2
    RETURNING id::text, email, first_name, last_name, role_scope, is_banned, created_at
    `,
    [toBanned(status), id]
  );

  return result.rows[0];
};

export const countUsers = async () => countRows("users");

export const getUserManagementOverview = async (search = "") => {
  const searchText = String(search ?? "").trim();
  const whereClause = searchText
    ? `
      WHERE (
        u.first_name ILIKE $1 OR
        u.last_name ILIKE $1 OR
        u.email ILIKE $1 OR
        u.role_scope ILIKE $1 OR
        up.theme ILIKE $1 OR
        sh.query ILIKE $1 OR
        sh.filters::text ILIKE $1
      )
    `
    : "";
  const params = searchText ? [`%${searchText}%`] : [];

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
      up.theme AS preference_theme,
      to_jsonb(up) AS preference_details,
      sh.id::text AS search_id,
      sh.query AS search_query,
      sh.filters AS search_filters,
      sh.results_count AS search_results_count,
      sh.created_at AS search_created_at,
      to_jsonb(sh) AS search_details
    FROM users u
    LEFT JOIN LATERAL (
      SELECT *
      FROM user_preferences
      WHERE user_id::text = u.id::text
      ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
      LIMIT 1
    ) up ON true
    LEFT JOIN LATERAL (
      SELECT *
      FROM search_history
      WHERE user_id::text = u.id::text
      ORDER BY created_at DESC NULLS LAST
      LIMIT 1
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
        label: row.preference_theme || "No preference",
        subLabel: row.preference_id ? "Theme" : "No row in user_preferences",
        details: row.preference_details,
      },
      search: {
        label: row.search_filters ? JSON.stringify(row.search_filters) : row.search_query || "No search history",
        subLabel: row.search_query || (row.search_id ? "Search row" : "No row in search_history"),
        details: row.search_details,
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
      mi.price AS menu_item_price,
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
    LEFT JOIN users u ON u.id::text = p.owner_id::text
    LEFT JOIN place_categories pc ON pc.id::text = p.category_id::text
    LEFT JOIN LATERAL (
      SELECT *
      FROM menu_items
      WHERE place_id::text = p.id::text
      ORDER BY created_at DESC NULLS LAST
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

export const findAllVendors = async () => {
  const columns = await getColumns("places");
  const available = new Set(columns);
  const select = [
    "p.id::text",
    available.has("name") ? "p.name" : "'Unnamed place' AS name",
    available.has("address") ? "p.address" : "'No address' AS address",
    available.has("category_id") ? "p.category_id::text" : "NULL AS category_id",
    available.has("rating_avg") ? "p.rating_avg" : "NULL AS rating",
    "CASE WHEN p.status = 'APPROVED' THEN true ELSE false END AS is_approved",
    available.has("status") ? "p.status" : "'PENDING' AS status",
    available.has("created_at") ? "p.created_at" : "NOW() AS created_at",
    available.has("category_id") ? "pc.name AS category" : "'Place' AS category",
    available.has("owner_id") ? "u.email AS email" : "'' AS email",
  ];
  const joins = [
    available.has("category_id") ? "LEFT JOIN place_categories pc ON pc.id::text = p.category_id::text" : "",
    available.has("owner_id") ? "LEFT JOIN users u ON u.id::text = p.owner_id::text" : "",
  ].filter(Boolean);
  const orderBy = available.has("created_at") ? "ORDER BY p.created_at DESC" : "ORDER BY p.id DESC";

  const rows = await optionalRows(
    `
    SELECT ${select.join(", ")}
    FROM places p
    ${joins.join("\n")}
    ${orderBy}
    LIMIT 500
    `
  );

  return rows.map((vendor) => ({
    id: vendor.id,
    name: vendor.name,
    location: vendor.address,
    email: vendor.email,
    category: vendor.category,
    status: vendor.is_approved ? "Active" : "Pending",
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
    SET status = CASE WHEN $1 THEN 'APPROVED' ELSE 'REJECTED' END
    WHERE id = $2
    RETURNING id::text, name, status
    `,
    [approved, id]
  );
  return result.rows[0] ?? null;
};

const insertAllowed = async (tableName, values) => {
  const allowed = new Set(await getColumns(tableName));
  const keys = Object.keys(values).filter((key) => allowed.has(key) && values[key] !== undefined);
  const placeholders = keys.map((_, index) => `$${index + 1}`);
  const result = await pool.query(
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
      LEFT JOIN users u ON u.id::text = p.owner_id::text
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

export const createStall = async ({ ownerId, categoryId, name, description, address, priceRange, photoUrl, latitude, longitude }) => {
  const columns = await getColumns("places");
  const allowed = new Set(columns);

  if (allowed.has("location") && latitude != null && longitude != null) {
    const result = await pool.query(
      `INSERT INTO places (owner_id, category_id, name, description, address, price_range, photo_url, is_open, status, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, 'APPROVED', ST_SetSRID(ST_MakePoint($8, $9), 4326)::geography)
       RETURNING *`,
      [ownerId || null, categoryId, name, description || null, address || null, priceRange || null, photoUrl || null, longitude, latitude]
    );
    return result.rows[0] ?? null;
  }

  const values = {
    owner_id: ownerId || null,
    category_id: categoryId,
    name,
    description: description || null,
    address: address || null,
    price_range: priceRange || null,
    photo_url: photoUrl || null,
    is_open: true,
    status: "APPROVED",
  };

  return insertAllowed("places", values);
};

export const deleteStall = async (id) => {
  await pool.query("DELETE FROM menu_items WHERE place_id::text = $1", [id]);
  await pool.query("DELETE FROM place_hours WHERE place_id::text = $1", [id]);
  await pool.query("DELETE FROM reviews WHERE place_id::text = $1", [id]);
  await pool.query("DELETE FROM place_images WHERE place_id::text = $1", [id]);
  const result = await pool.query("DELETE FROM places WHERE id::text = $1 RETURNING id::text", [id]);
  return result.rows[0] ?? null;
};

export const createStallMenuItem = async (placeId, payload) => {
  return insertAllowed("menu_items", {
    place_id: placeId,
    name: payload.name,
    description: payload.description || null,
    price: payload.price,
    category: menuItemCategory(payload.category),
    image_url: payload.imageUrl || null,
    is_available: payload.isAvailable ?? true,
  });
};

export const deleteStallMenuItem = async (id) => {
  const result = await pool.query("DELETE FROM menu_items WHERE id::text = $1 RETURNING id::text", [id]);
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

export const getAllReviews = async () => {
  const { rows } = await pool.query(
    `SELECT r.id, r.rating AS stars, r.body, r.created_at,
            u.first_name || ' ' || u.last_name AS user_name,
            p.name AS place_name, p.id AS place_id,
            r.flagged_at, r.deleted_at
     FROM reviews r
     JOIN places p ON p.id = r.place_id
     JOIN users u ON u.id = r.user_id
     ORDER BY r.created_at DESC`
  );
  return rows;
};

export const getReviewsByPlaceId = async (placeId) => {
  const { rows } = await pool.query(
    `SELECT r.id, r.rating AS stars, r.body, r.created_at,
            u.first_name || ' ' || u.last_name AS user_name,
            p.name AS place_name, p.id AS place_id
     FROM reviews r
     JOIN places p ON p.id = r.place_id
     JOIN users u ON u.id = r.user_id
     WHERE r.place_id::text = $1
     ORDER BY r.created_at DESC`,
    [placeId]
  );
  return rows;
};

export const ensureRoleTable = async () => {
  const tableName = await getRoleTableName();
  // Check if table exists first
  if (await tableExists(tableName)) {
    // Check if table_privileges column exists, if not add it
    const columns = await getColumns(tableName);
    if (!columns.includes("table_privileges")) {
      await pool.query(`
        ALTER TABLE "${tableName}"
        ADD COLUMN table_privileges JSONB DEFAULT '{}'::jsonb
      `);
      // Migrate old data: convert privileges[] + tables[] to table_privileges JSONB
      await pool.query(`
        UPDATE "${tableName}"
        SET table_privileges = (
          SELECT COALESCE(
            jsonb_object_agg(
              t,
              (SELECT array_to_json(privileges)::jsonb)
            ),
            '{}'::jsonb
          )
          FROM unnest(tables) AS t
        )
        WHERE tables IS NOT NULL AND array_length(tables, 1) > 0
      `);
    }
    return;
  }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "${tableName}" (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT UNIQUE NOT NULL,
      table_privileges JSONB DEFAULT '{}'::jsonb,
      grant_option BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
};

export const findAllRoles = async () => {
  const tableName = await getRoleTableName();
  await ensureRoleTable();

  const rows = await optionalRows(
    `
    SELECT
      id::text,
      name,
      table_privileges,
      grant_option,
      created_at
    FROM "${tableName}"
    ORDER BY created_at DESC
    `
  );

  return rows.map((role) => ({
    id: role.id,
    name: role.name,
    tablePrivileges: role.table_privileges ?? {},
    grantOption: Boolean(role.grant_option),
    createdAt: role.created_at,
  }));
};

export const createRole = async ({ name, tablePrivileges, grantOption }) => {
  const tableName = await getRoleTableName();
  await ensureRoleTable();
  const result = await pool.query(
    `
    INSERT INTO "${tableName}" (name, table_privileges, grant_option)
    VALUES ($1,$2,$3)
    ON CONFLICT (name)
    DO UPDATE SET table_privileges = EXCLUDED.table_privileges,
                  grant_option = EXCLUDED.grant_option
    RETURNING *
    `,
    [name, JSON.stringify(tablePrivileges ?? {}), grantOption ?? false]
  );

  return result.rows[0];
};

export const updateRoleRecord = async (id, { name, tablePrivileges, grantOption }) => {
  const tableName = await getRoleTableName();
  await ensureRoleTable();

  const result = await pool.query(
    `
    UPDATE "${tableName}"
    SET name = COALESCE($2, name),
        table_privileges = COALESCE($3::jsonb, table_privileges),
        grant_option = COALESCE($4, grant_option)
    WHERE id = $1
    RETURNING id::text, name, table_privileges, grant_option, created_at
    `,
    [
      id,
      name ?? null,
      tablePrivileges ? JSON.stringify(tablePrivileges) : null,
      typeof grantOption === "boolean" ? grantOption : null,
    ]
  );

  const role = result.rows[0];
  if (!role) return null;

  return {
    id: role.id,
    name: role.name,
    tablePrivileges: role.table_privileges ?? {},
    grantOption: Boolean(role.grant_option),
    createdAt: role.created_at,
  };
};

export const deleteRoleRecord = async (id) => {
  const tableName = await getRoleTableName();
  await ensureRoleTable();

  const result = await pool.query(
    `DELETE FROM "${tableName}" WHERE id = $1 RETURNING id::text`,
    [id]
  );

  return result.rows[0] ?? null;
};

export const findAllStalls = async () => {
  const rows = await optionalRows(
    `
    SELECT
      p.id::text,
      p.name,
      p.description,
      p.address,
      p.price_range,
      p.photo_url,
      p.is_open,
      p.status,
      CASE WHEN p.status = 'APPROVED' THEN true ELSE false END AS is_approved,
      p.rating_avg,
      p.rating_count,
      p.owner_id::text,
      COALESCE(u.email, '') AS owner_email,
      CONCAT_WS(' ', u.first_name, u.last_name) AS owner_name,
      ST_AsGeoJSON(p.location)::jsonb AS location,
      jsonb_build_object(
        'id', pc.id::text,
        'name', pc.name,
        'slug', pc.slug
      ) AS category,
      to_jsonb(p) AS place_details
    FROM places p
    LEFT JOIN users u ON u.id::text = p.owner_id::text
    LEFT JOIN place_categories pc ON pc.id::text = p.category_id::text
    ORDER BY p.created_at DESC NULLS LAST
    LIMIT 500
    `
  );

  return rows.map((row) => {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      address: row.address,
      priceRange: row.price_range,
      photoUrl: row.photo_url,
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
    };
  });
};

export const findStallsByOwner = async (ownerId) => {
  const rows = await optionalRows(
    `
    SELECT
      p.id::text,
      p.name,
      p.description,
      p.address,
      p.price_range,
      p.photo_url,
      p.is_open,
      p.status,
      CASE WHEN p.status = 'APPROVED' THEN true ELSE false END AS is_approved,
      p.rating_avg,
      p.rating_count,
      p.owner_id::text,
      COALESCE(u.email, '') AS owner_email,
      CONCAT_WS(' ', u.first_name, u.last_name) AS owner_name,
      ST_AsGeoJSON(p.location)::jsonb AS location,
      jsonb_build_object(
        'id', pc.id::text,
        'name', pc.name,
        'slug', pc.slug
      ) AS category,
      to_jsonb(p) AS place_details
    FROM places p
    LEFT JOIN users u ON u.id::text = p.owner_id::text
    LEFT JOIN place_categories pc ON pc.id::text = p.category_id::text
    WHERE p.owner_id::text = $1
    ORDER BY p.created_at DESC NULLS LAST
    `,
    [ownerId]
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    address: row.address,
    priceRange: row.price_range,
    photoUrl: row.photo_url,
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
      p.is_open,
      p.status,
      CASE WHEN p.status = 'APPROVED' THEN true ELSE false END AS is_approved,
      p.rating_avg,
      p.rating_count,
      p.owner_id::text,
      COALESCE(u.email, '') AS owner_email,
      CONCAT_WS(' ', u.first_name, u.last_name) AS owner_name,
      ST_AsGeoJSON(p.location)::jsonb AS location,
      jsonb_build_object(
        'id', pc.id::text,
        'name', pc.name,
        'slug', pc.slug
      ) AS category,
      to_jsonb(p) AS place_details
    FROM places p
    LEFT JOIN users u ON u.id::text = p.owner_id::text
    LEFT JOIN place_categories pc ON pc.id::text = p.category_id::text
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
    photoUrl: row.photo_url,
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
  };
};

export const updateStall = async (id, payload) => {
  const allowed = new Set(await getColumns("places"));
  const sets = [];
  const params = [];
  let idx = 1;

  const fieldMap = {
    name: "name",
    description: "description",
    address: "address",
    priceRange: "price_range",
    photoUrl: "photo_url",
    isOpen: "is_open",
    status: "status",
    isApproved: "is_approved",
  };

  let hasLocation = false;
  let locationLat = null;
  let locationLng = null;

  for (const [key, col] of Object.entries(fieldMap)) {
    if (payload[key] !== undefined && allowed.has(col)) {
      sets.push(`${quoteIdent(col)} = $${idx++}`);
      params.push(payload[key]);
    }
  }

  if (payload.latitude !== undefined && payload.longitude !== undefined && allowed.has("location")) {
    hasLocation = true;
    locationLat = payload.latitude;
    locationLng = payload.longitude;
  }

  if (sets.length === 0 && !hasLocation) return null;

  if (hasLocation) {
    sets.push(`location = ST_SetSRID(ST_MakePoint($${idx++}, $${idx++}), 4326)::geography`);
    params.push(locationLng, locationLat);
  }

  params.push(id);
  const result = await pool.query(
    `UPDATE places SET ${sets.join(", ")} WHERE id::text = $${idx} RETURNING id::text`,
    params
  );
  return result.rows[0] ?? null;
};

export const updateStallStatus = async (id, isOpen) => {
  const result = await pool.query(
    `UPDATE places SET is_open = $1 WHERE id::text = $2 RETURNING id::text, is_open`,
    [isOpen, id]
  );
  return result.rows[0] ?? null;
};

export const findAllMenuItems = async () => {
  const rows = await optionalRows(
    `
    SELECT
      mi.id::text,
      mi.name,
      mi.description,
      mi.price,
      mi.category,
      mi.image_url,
      mi.is_available,
      mi.place_id::text,
      p.name AS place_name,
      to_jsonb(mi) AS item_details
    FROM menu_items mi
    LEFT JOIN places p ON p.id::text = mi.place_id::text
    ORDER BY p.name ASC, mi.name ASC
    LIMIT 500
    `
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    imageUrl: row.image_url,
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

  const fieldMap = {
    name: "name",
    description: "description",
    price: "price",
    category: "category",
    imageUrl: "image_url",
    isAvailable: "is_available",
  };

  for (const [key, col] of Object.entries(fieldMap)) {
    if (payload[key] !== undefined && allowed.has(col)) {
      const val = key === "category" ? menuItemCategory(payload[key]) : payload[key];
      sets.push(`${quoteIdent(col)} = $${idx++}`);
      params.push(val);
    }
  }

  if (sets.length === 0) return null;

  params.push(id);
  const result = await pool.query(
    `UPDATE menu_items SET ${sets.join(", ")} WHERE id::text = $${idx} RETURNING id::text`,
    params
  );
  return result.rows[0] ?? null;
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
  await pool.query(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      admin_id TEXT,
      action TEXT NOT NULL,
      target_type TEXT,
      target_id TEXT,
      details JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
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
      role_scope,
      is_banned,
      created_at,
      updated_at
    FROM users
    WHERE id::text = $1
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
    role: user.role_scope,
    isBanned: user.is_banned,
    status: user.is_banned ? "Suspended" : "Active",
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

export const updateUser = async (id, { firstName, lastName, email, role }) => {
  const sets = [];
  const params = [];
  let idx = 1;

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
  if (role !== undefined) {
    sets.push(`role_scope = $${idx++}`);
    params.push(role);
  }

  if (sets.length === 0) return null;

  params.push(id);
  const result = await pool.query(
    `UPDATE users SET ${sets.join(", ")} WHERE id::text = $${idx} RETURNING id::text, email, first_name, last_name, role_scope, is_banned`,
    params
  );
  const user = result.rows[0];
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role_scope,
    status: user.is_banned ? "Suspended" : "Active",
  };
};

export const deleteUserRecord = async (id) => {
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
    "SELECT id, telegram_link, message, updated_at FROM onboarding_config LIMIT 1"
  );
  return rows[0] ?? { telegram_link: "", message: "" };
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
           updated_at = NOW()
       WHERE id = (SELECT id FROM existing)
       RETURNING id, telegram_link, message, updated_at
     ),
     inserted AS (
       INSERT INTO onboarding_config (telegram_link, message, updated_at)
       SELECT COALESCE($1, ''), COALESCE($2, ''), NOW()
       WHERE NOT EXISTS (SELECT 1 FROM existing)
       RETURNING id, telegram_link, message, updated_at
     )
     SELECT * FROM updated UNION ALL SELECT * FROM inserted`,
    [data.telegramLink ?? null, data.message ?? null]
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
