import pool from "../config/db.js";

const PROJECT_TABLES = [
  "audit_logs",
  "bookmarks",
  "menu_items",
  "place_categories",
  "place_hours",
  "places",
  "reviews",
  "routes",
  "search_history",
  "support_tickets",
  "support_tips",
  "user_preferences",
  "users",
];

const quoteIdent = (value) => `"${String(value).replace(/"/g, '""')}"`;

const assertProjectTable = (tableName) => {
  if (!PROJECT_TABLES.includes(tableName)) {
    const error = new Error("This table is not available for developer operations.");
    error.statusCode = 400;
    throw error;
  }
};

const getColumns = async (tableName) => {
  assertProjectTable(tableName);
  const result = await pool.query(
    `
    SELECT column_name, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = $1
    ORDER BY ordinal_position
    `,
    [tableName]
  );
  return result.rows;
};

const hasColumn = async (tableName, columnName) => {
  const columns = await getColumns(tableName);
  return columns.some((column) => column.column_name === columnName);
};

const mapUser = (user) => ({
  id: user.id,
  name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.email,
  email: user.email,
  role: user.role_scope,
  status: user.is_banned ? "Suspended" : "Active",
  createdAt: user.created_at,
});

const mapVendor = (vendor) => ({
  id: vendor.id,
  name: vendor.name,
  location: vendor.address ?? "No address",
  email: vendor.owner_email ?? "",
  category: vendor.category_name ?? "Place",
  categoryId: vendor.category_id,
  status: vendor.status === "inactive" ? "Suspended" : vendor.is_approved || vendor.status === "active" ? "Active" : "Pending",
  rating: vendor.rating === null || vendor.rating === undefined ? null : Number(vendor.rating),
  submittedAt: vendor.created_at,
});

export class DeveloperRepository {
  async listUsers() {
    const result = await pool.query(
      `
      SELECT id::text, email, first_name, last_name, role_scope, is_banned, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 500
      `
    );
    return result.rows.map(mapUser);
  }

  async createUser(user) {
    const columns = await getColumns("users");
    const allowed = new Set(columns.map((column) => column.column_name));
    const values = {
      email: user.email,
      password_hash: user.password_hash,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone ?? null,
      role_scope: user.role_scope ?? "CONSUMER",
      is_banned: false,
    };
    const insertKeys = Object.keys(values).filter((key) => allowed.has(key) && values[key] !== undefined);
    const placeholders = insertKeys.map((_, index) => `$${index + 1}`);
    const result = await pool.query(
      `
      INSERT INTO users (${insertKeys.map(quoteIdent).join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING id::text, email, first_name, last_name, role_scope, is_banned, created_at
      `,
      insertKeys.map((key) => values[key])
    );
    return mapUser(result.rows[0]);
  }

  async updateUser(id, user) {
    const columns = await getColumns("users");
    const allowed = new Set(columns.map((column) => column.column_name));
    const values = {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      role_scope: user.role_scope,
    };
    const updateKeys = Object.keys(values).filter((key) => allowed.has(key) && values[key] !== undefined);

    if (updateKeys.length === 0) {
      const current = await pool.query(
        `
        SELECT id::text, email, first_name, last_name, role_scope, is_banned, created_at
        FROM users
        WHERE id = $1
        `,
        [id]
      );
      return current.rows[0] ? mapUser(current.rows[0]) : null;
    }

    const setSql = updateKeys.map((key, index) => `${quoteIdent(key)} = $${index + 2}`).join(", ");
    const result = await pool.query(
      `
      UPDATE users
      SET ${setSql}
      WHERE id = $1
      RETURNING id::text, email, first_name, last_name, role_scope, is_banned, created_at
      `,
      [id, ...updateKeys.map((key) => values[key])]
    );
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  async setUserBan(id, banned) {
    const result = await pool.query(
      `
      UPDATE users
      SET is_banned = $2
      WHERE id = $1
      RETURNING id::text, email, first_name, last_name, role_scope, is_banned, created_at
      `,
      [id, banned]
    );
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  async deleteUser(id) {
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id::text", [id]);
    return result.rows[0] ?? null;
  }

  async listVendors() {
    const placeColumns = await getColumns("places");
    const available = new Set(placeColumns.map((column) => column.column_name));
    const select = [
      "p.id::text",
      available.has("name") ? "p.name" : "'Unnamed place' AS name",
      available.has("location") ? "p.location" : "NULL AS location",
      available.has("address") ? "p.address" : "NULL AS address",
      available.has("category_id") ? "p.category_id::text" : "NULL AS category_id",
      available.has("rating") ? "p.rating" : "NULL AS rating",
      available.has("is_approved") ? "p.is_approved" : "false AS is_approved",
      available.has("status") ? "p.status" : "'pending' AS status",
      available.has("created_at") ? "p.created_at" : "NOW() AS created_at",
      available.has("category_id") ? "pc.name AS category_name" : "NULL AS category_name",
      available.has("owner_id") ? "u.email AS owner_email" : "NULL AS owner_email",
    ];
    const joins = [
      available.has("category_id") ? "LEFT JOIN place_categories pc ON pc.id::text = p.category_id::text" : "",
      available.has("owner_id") ? "LEFT JOIN users u ON u.id::text = p.owner_id::text" : "",
    ].filter(Boolean);
    const orderBy = available.has("created_at") ? "ORDER BY p.created_at DESC" : "ORDER BY p.id DESC";

    const result = await pool.query(
      `
      SELECT ${select.join(", ")}
      FROM places p
      ${joins.join("\n")}
      ${orderBy}
      LIMIT 500
      `
    );
    return result.rows.map(mapVendor);
  }

  async listPlaceCategories() {
    const result = await pool.query(
      "SELECT id::text, name, slug FROM place_categories ORDER BY name ASC"
    );
    return result.rows;
  }

  async listTableColumns(tableName) {
    assertProjectTable(tableName);
    return getColumns(tableName);
  }

  async createVendor(vendor) {
    const columns = await getColumns("places");
    const allowed = new Set(columns.map((column) => column.column_name));
    const template = await pool.query("SELECT * FROM places LIMIT 1");
    const values = {
      name: vendor.name,
      address: vendor.location ?? vendor.address ?? null,
      category_id: vendor.category_id || null,
      status: vendor.status ?? "active",
      is_approved: vendor.is_approved ?? true,
    };

    if (template.rows[0]) {
      for (const column of columns) {
        const key = column.column_name;
        if (["id", "created_at", "updated_at"].includes(key)) continue;
        if (values[key] !== undefined) continue;
        values[key] = template.rows[0][key];
      }
    }

    if (allowed.has("slug") && !values.slug) {
      values.slug = `${String(vendor.name ?? "vendor").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now()}`;
    }

    const insertKeys = Object.keys(values).filter((key) => allowed.has(key) && values[key] !== undefined);
    const placeholders = insertKeys.map((_, index) => `$${index + 1}`);
    const result = await pool.query(
      `
      INSERT INTO places (${insertKeys.map(quoteIdent).join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING id::text
      `,
      insertKeys.map((key) => values[key])
    );
    return this.findVendorById(result.rows[0].id);
  }

  async findVendorById(id) {
    const placeColumns = await getColumns("places");
    const available = new Set(placeColumns.map((column) => column.column_name));
    const select = [
      "p.id::text",
      available.has("name") ? "p.name" : "'Unnamed place' AS name",
      available.has("location") ? "p.location" : "NULL AS location",
      available.has("address") ? "p.address" : "NULL AS address",
      available.has("category_id") ? "p.category_id::text" : "NULL AS category_id",
      available.has("rating") ? "p.rating" : "NULL AS rating",
      available.has("is_approved") ? "p.is_approved" : "false AS is_approved",
      available.has("status") ? "p.status" : "'pending' AS status",
      available.has("created_at") ? "p.created_at" : "NOW() AS created_at",
      available.has("category_id") ? "pc.name AS category_name" : "NULL AS category_name",
      available.has("owner_id") ? "u.email AS owner_email" : "NULL AS owner_email",
    ];
    const joins = [
      available.has("category_id") ? "LEFT JOIN place_categories pc ON pc.id::text = p.category_id::text" : "",
      available.has("owner_id") ? "LEFT JOIN users u ON u.id::text = p.owner_id::text" : "",
    ].filter(Boolean);

    const result = await pool.query(
      `
      SELECT ${select.join(", ")}
      FROM places p
      ${joins.join("\n")}
      WHERE p.id = $1
      `,
      [id]
    );
    return result.rows[0] ? mapVendor(result.rows[0]) : null;
  }

  async updateVendor(id, vendor) {
    const columns = await getColumns("places");
    const allowed = new Set(columns.map((column) => column.column_name));
    const values = {
      name: vendor.name,
      address: vendor.location ?? vendor.address,
      category_id: vendor.category_id,
      status: vendor.status,
      is_approved: vendor.is_approved,
    };
    const updateKeys = Object.keys(values).filter((key) => allowed.has(key) && values[key] !== undefined);

    if (updateKeys.length === 0) return this.findVendorById(id);

    const setSql = updateKeys.map((key, index) => `${quoteIdent(key)} = $${index + 2}`).join(", ");
    await pool.query(
      `UPDATE places SET ${setSql} WHERE id = $1`,
      [id, ...updateKeys.map((key) => values[key])]
    );
    return this.findVendorById(id);
  }

  async setVendorBan(id, banned) {
    const status = banned ? "inactive" : "active";
    const approved = !banned;
    const hasApprovedColumn = await hasColumn("places", "is_approved");
    const query = hasApprovedColumn
      ? "UPDATE places SET status = $2, is_approved = $3 WHERE id = $1 RETURNING id::text"
      : "UPDATE places SET status = $2 WHERE id = $1 RETURNING id::text";
    const params = hasApprovedColumn ? [id, status, approved] : [id, status];
    const result = await pool.query(query, params);
    return result.rows[0] ? this.findVendorById(id) : null;
  }

  async deleteVendor(id) {
    const result = await pool.query("DELETE FROM places WHERE id = $1 RETURNING id::text", [id]);
    return result.rows[0] ?? null;
  }

  async ensureBackupTable() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS developer_backups (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        scope TEXT NOT NULL CHECK (scope IN ('database','table','row')),
        table_name TEXT,
        row_id TEXT,
        payload JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        recovered_at TIMESTAMPTZ
      )
    `);
  }

  async listBackups() {
    await this.ensureBackupTable();
    const result = await pool.query(
      `
      SELECT id::text, name, scope, table_name, row_id, jsonb_array_length(
        CASE
          WHEN jsonb_typeof(payload) = 'array' THEN payload
          WHEN jsonb_typeof(payload) = 'object' AND payload ? 'rows' THEN payload->'rows'
          ELSE '[]'::jsonb
        END
      ) AS row_count, created_at, recovered_at
      FROM developer_backups
      ORDER BY created_at DESC
      `
    );
    return result.rows.map((backup) => ({
      id: backup.id,
      name: backup.name,
      scope: backup.scope,
      tableName: backup.table_name,
      rowId: backup.row_id,
      rowCount: Number(backup.row_count ?? 0),
      createdAt: backup.created_at,
      recoveredAt: backup.recovered_at,
      status: backup.recovered_at ? "RECOVERED" : "COMPLETED",
    }));
  }

  async createBackup({ scope, tableName, rowId }) {
    await this.ensureBackupTable();
    let payload;
    let name;

    if (scope === "database") {
      const snapshot = {};
      for (const table of PROJECT_TABLES) {
        const result = await pool.query(`SELECT * FROM ${quoteIdent(table)} LIMIT 500`);
        snapshot[table] = result.rows;
      }
      payload = snapshot;
      name = `database_backup_${new Date().toISOString()}`;
    } else if (scope === "table") {
      assertProjectTable(tableName);
      const result = await pool.query(`SELECT * FROM ${quoteIdent(tableName)} LIMIT 1000`);
      payload = { tableName, rows: result.rows };
      name = `${tableName}_table_backup_${new Date().toISOString()}`;
    } else if (scope === "row") {
      assertProjectTable(tableName);
      const result = await pool.query(`SELECT * FROM ${quoteIdent(tableName)} WHERE id::text = $1`, [rowId]);
      payload = { tableName, rowId, rows: result.rows };
      name = `${tableName}_row_${rowId}_backup_${new Date().toISOString()}`;
    } else {
      const error = new Error("Backup scope must be database, table, or row.");
      error.statusCode = 400;
      throw error;
    }

    const result = await pool.query(
      `
      INSERT INTO developer_backups (name, scope, table_name, row_id, payload)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING id::text
      `,
      [name, scope, tableName ?? null, rowId ?? null, JSON.stringify(payload)]
    );
    return (await this.listBackups()).find((backup) => backup.id === result.rows[0].id);
  }

  async recoverBackup(id) {
    await this.ensureBackupTable();
    const backupResult = await pool.query("SELECT * FROM developer_backups WHERE id = $1", [id]);
    const backup = backupResult.rows[0];
    if (!backup) return null;

    const restoreTableRows = async (tableName, rows) => {
      assertProjectTable(tableName);
      for (const row of rows) {
        const keys = Object.keys(row).filter((key) => row[key] !== undefined);
        if (!keys.includes("id")) continue;
        const values = keys.map((key) => row[key]);
        const updates = keys.filter((key) => key !== "id").map((key) => `${quoteIdent(key)} = EXCLUDED.${quoteIdent(key)}`);
        const conflictSql = updates.length ? `DO UPDATE SET ${updates.join(", ")}` : "DO NOTHING";
        await pool.query(
          `
          INSERT INTO ${quoteIdent(tableName)} (${keys.map(quoteIdent).join(", ")})
          VALUES (${keys.map((_, index) => `$${index + 1}`).join(", ")})
          ON CONFLICT (id) ${conflictSql}
          `,
          values
        );
      }
    };

    if (backup.scope === "database") {
      for (const [tableName, rows] of Object.entries(backup.payload)) {
        await restoreTableRows(tableName, rows);
      }
    } else {
      await restoreTableRows(backup.table_name, backup.payload.rows ?? []);
    }

    await pool.query("UPDATE developer_backups SET recovered_at = NOW() WHERE id = $1", [id]);
    return (await this.listBackups()).find((item) => item.id === id);
  }
}

export default new DeveloperRepository();
