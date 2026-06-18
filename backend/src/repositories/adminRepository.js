import pool from "../config/db.js";

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
  const [totalUsers, activePlaces, openTickets, totalRoutes, growthRows, activityRows] =
    await Promise.all([
      countRows("users"),
      countRows("places", "WHERE is_approved = true AND status = 'active'"),
      countRows("support_tickets", "WHERE status IN ('open', 'in_progress')"),
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
          action,
          COALESCE(target_type, 'system') AS target_type,
          target_id,
          created_at
        FROM audit_logs
        ORDER BY created_at DESC
        LIMIT 4
        `
      ),
    ]);

  return {
    metrics: {
      totalUsers,
      activeRestaurants: activePlaces,
      openComplaints: openTickets,
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

export const findAllVendors = async () => {
  const rows = await optionalRows(
    `
    SELECT
      p.id::text,
      p.name,
      COALESCE(pc.name, 'Place') AS category,
      COALESCE(p.address, 'No address') AS location,
      COALESCE(u.email, '') AS email,
      p.rating,
      p.is_approved,
      p.status,
      p.created_at
    FROM places p
    LEFT JOIN place_categories pc ON pc.id = p.category_id
    LEFT JOIN users u ON u.id = p.owner_id
    ORDER BY p.created_at DESC
    `
  );

  return rows.map((vendor) => ({
    id: vendor.id,
    name: vendor.name,
    location: vendor.location,
    email: vendor.email,
    category: vendor.category,
    status: vendor.is_approved || vendor.status === "active" ? "Active" : "Pending",
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
    SET is_approved = $1,
        status = CASE WHEN $1 THEN 'active' ELSE 'inactive' END
    WHERE id = $2
    RETURNING id::text, name, is_approved, status
    `,
    [approved, id]
  );
  return result.rows[0] ?? null;
};

export const ensureRoleTable = async () => {
  const tableName = await getRoleTableName();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "${tableName}" (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT UNIQUE NOT NULL,
      privileges TEXT[] NOT NULL DEFAULT '{}',
      tables TEXT[] NOT NULL DEFAULT '{}',
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
      privileges,
      tables,
      grant_option,
      created_at
    FROM "${tableName}"
    ORDER BY created_at DESC
    `
  );

  return rows.map((role) => ({
    id: role.id,
    name: role.name,
    privileges: role.privileges ?? [],
    tables: role.tables ?? [],
    grantOption: Boolean(role.grant_option),
    createdAt: role.created_at,
  }));
};

export const createRole = async ({ name, privileges, tables, grantOption }) => {
  const tableName = await getRoleTableName();
  await ensureRoleTable();
  const result = await pool.query(
    `
    INSERT INTO "${tableName}" (name, privileges, tables, grant_option)
    VALUES ($1,$2,$3,$4)
    ON CONFLICT (name)
    DO UPDATE SET privileges = EXCLUDED.privileges,
                  tables = EXCLUDED.tables,
                  grant_option = EXCLUDED.grant_option
    RETURNING *
    `,
    [name, privileges, tables, grantOption]
  );

  return result.rows[0];
};
