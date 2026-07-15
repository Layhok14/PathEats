import AppError from "./AppError.js";
import { ROLES, normalizeRoleScope } from "./roles.js";

export const TABLE_ACTIONS = Object.freeze(["SELECT", "INSERT", "UPDATE", "DELETE"]);
export const SYSTEM_CAPABILITIES = Object.freeze(["BACKUP", "RECOVERY", "QUERY", "MAINTENANCE"]);

export const PRIVILEGE_REGISTRY = Object.freeze({
  users: TABLE_ACTIONS,
  user_preferences: TABLE_ACTIONS,
  user_profile_images: TABLE_ACTIONS,
  places: TABLE_ACTIONS,
  place_categories: TABLE_ACTIONS,
  place_hours: TABLE_ACTIONS,
  place_images: TABLE_ACTIONS,
  menu_items: TABLE_ACTIONS,
  menu_item_images: TABLE_ACTIONS,
  place_menu_items: TABLE_ACTIONS,
  reviews: TABLE_ACTIONS,
  routes: TABLE_ACTIONS,
  bookmarks: TABLE_ACTIONS,
  search_history: Object.freeze(["SELECT", "INSERT", "DELETE"]),
  onboarding_config: Object.freeze(["SELECT", "UPDATE"]),
  audit_log: Object.freeze(["SELECT"]),
  role: TABLE_ACTIONS,
  backup_profiles: TABLE_ACTIONS,
  scheduled_backups: TABLE_ACTIONS,
  recovery_operations: Object.freeze(["SELECT", "INSERT"]),
  query_presets: TABLE_ACTIONS,
  database_activity_log: Object.freeze(["SELECT", "INSERT"]),
});

const allTablePrivileges = Object.fromEntries(
  Object.entries(PRIVILEGE_REGISTRY).map(([table, actions]) => [table, [...actions]])
);

export const BUILT_IN_ROLE_POLICIES = Object.freeze({
  [ROLES.CONSUMER]: {
    users: ["SELECT", "UPDATE"],
    user_preferences: ["SELECT", "INSERT", "UPDATE"],
    user_profile_images: TABLE_ACTIONS,
    places: ["SELECT"],
    menu_items: ["SELECT"],
    place_menu_items: ["SELECT"],
    reviews: TABLE_ACTIONS,
    routes: TABLE_ACTIONS,
    bookmarks: TABLE_ACTIONS,
    search_history: ["SELECT", "INSERT", "DELETE"],
  },
  [ROLES.VENDOR]: {
    users: ["SELECT", "UPDATE"],
    user_preferences: ["SELECT", "INSERT", "UPDATE"],
    user_profile_images: TABLE_ACTIONS,
    places: TABLE_ACTIONS,
    place_categories: ["SELECT"],
    place_hours: TABLE_ACTIONS,
    place_images: TABLE_ACTIONS,
    menu_items: TABLE_ACTIONS,
    menu_item_images: TABLE_ACTIONS,
    place_menu_items: TABLE_ACTIONS,
    reviews: ["SELECT"],
  },
  [ROLES.GLOBAL_ADMIN]: allTablePrivileges,
  [ROLES.DEVELOPER_ADMIN]: Object.fromEntries(
    Object.keys(PRIVILEGE_REGISTRY).map((table) => [table, ["SELECT"]])
  ),
  [ROLES.BUSINESS_ASSISTANCE]: {
    users: ["SELECT", "INSERT", "UPDATE"],
    places: TABLE_ACTIONS,
    place_categories: ["SELECT"],
    place_hours: TABLE_ACTIONS,
    place_images: TABLE_ACTIONS,
    menu_items: TABLE_ACTIONS,
    menu_item_images: TABLE_ACTIONS,
    place_menu_items: TABLE_ACTIONS,
    reviews: ["SELECT", "UPDATE", "DELETE"],
    onboarding_config: ["SELECT", "UPDATE"],
    audit_log: ["SELECT"],
  },
});

export const BUILT_IN_SYSTEM_CAPABILITIES = Object.freeze({
  [ROLES.GLOBAL_ADMIN]: [...SYSTEM_CAPABILITIES],
  [ROLES.DEVELOPER_ADMIN]: [...SYSTEM_CAPABILITIES],
});

export function normalizeRoleName(value) {
  const normalized = String(value ?? "").trim().toUpperCase().replace(/[^A-Z0-9_]+/g, "_");
  if (!/^[A-Z][A-Z0-9_]{2,39}$/.test(normalized)) {
    throw new AppError("Role name must contain 3-40 letters, numbers, or underscores", 400, {
      code: "ROLE_NAME_INVALID",
      fieldErrors: { name: "Use 3-40 letters, numbers, spaces, or underscores." },
    });
  }
  return normalized;
}

export function normalizeBaseScope(value) {
  const scope = normalizeRoleScope(value, "");
  if (!Object.values(ROLES).includes(scope)) {
    throw new AppError("Invalid base role scope", 400);
  }
  return scope;
}

export function normalizeTablePrivileges(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new AppError("Table privileges must be an object", 400, {
      fieldErrors: { tablePrivileges: "Select privileges from the available tables." },
    });
  }

  const normalized = {};
  for (const [table, actions] of Object.entries(input)) {
    const allowedActions = PRIVILEGE_REGISTRY[table];
    if (!allowedActions) throw new AppError(`Table "${table}" is not privilege-managed`, 400);
    if (!Array.isArray(actions)) throw new AppError(`Privileges for "${table}" must be an array`, 400);

    const uniqueActions = [...new Set(actions.map((action) => String(action).trim().toUpperCase()))];
    const invalidAction = uniqueActions.find((action) => !allowedActions.includes(action));
    if (invalidAction) throw new AppError(`${invalidAction} is not supported for ${table}`, 400);
    if (uniqueActions.length > 0) normalized[table] = uniqueActions;
  }
  return normalized;
}

export function normalizeSystemCapabilities(input = []) {
  if (!Array.isArray(input)) throw new AppError("System capabilities must be an array", 400);
  const normalized = [...new Set(input.map((value) => String(value).trim().toUpperCase()))];
  const invalid = normalized.find((value) => !SYSTEM_CAPABILITIES.includes(value));
  if (invalid) throw new AppError(`Unsupported system capability: ${invalid}`, 400);
  return normalized;
}

export function hasPrivilege(role, table, action) {
  if (!role) return false;
  const actions = role.tablePrivileges?.[table] ?? role.table_privileges?.[table] ?? [];
  return actions.includes(String(action).toUpperCase());
}

export function privilegesAreSubset(candidate = {}, ceiling = {}) {
  return Object.entries(candidate).every(([table, actions]) => {
    const allowed = new Set(ceiling[table] ?? []);
    return actions.every((action) => allowed.has(action));
  });
}

export function rolePolicyCatalog() {
  return {
    tables: Object.entries(PRIVILEGE_REGISTRY).map(([name, actions]) => ({ name, actions: [...actions] })),
    systemCapabilities: [...SYSTEM_CAPABILITIES],
    basePolicies: BUILT_IN_ROLE_POLICIES,
    baseSystemCapabilities: BUILT_IN_SYSTEM_CAPABILITIES,
  };
}
