import AppError from "./AppError.js";

const SAFE_IDENTIFIER_PATTERN = /^[a-z_][a-z0-9_]*$/i;
const TABLE_DATA_ENTRY = /\bTABLE DATA\s+public\s+([^\s;]+)/i;
const PROHIBITED_OBJECT = /\b(DATABASE|PUBLICATION|SUBSCRIPTION|EVENT TRIGGER|FOREIGN DATA WRAPPER|SERVER)\b/i;

const CORE_APPLICATION_TABLES = [
  "users",
  "role",
  "place_categories",
  "places",
  "menu_items",
  "place_menu_items",
  "reviews",
];

export function inspectPostgresToc(listOutput, currentTables = []) {
  const lines = String(listOutput || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith(";"));

  if (lines.length === 0) {
    throw new AppError("PostgreSQL dump contains no restore entries", 400);
  }
  if (lines.some((line) => PROHIBITED_OBJECT.test(line))) {
    throw new AppError("PostgreSQL dump contains unsupported high-risk object entries", 400);
  }

  const dataLines = lines.filter((line) => /\b(TABLE DATA|SEQUENCE SET)\s+public\s+/i.test(line));
  if (dataLines.length === 0) {
    throw new AppError("PostgreSQL dump contains no public table data", 400);
  }

  const tableNames = [...new Set(
    lines.map((line) => line.match(TABLE_DATA_ENTRY)?.[1]).filter(Boolean)
  )];
  if (tableNames.some((tableName) => !SAFE_IDENTIFIER_PATTERN.test(tableName))) {
    throw new AppError("PostgreSQL dump contains an invalid restore table name", 400);
  }
  if (tableNames.includes("spatial_ref_sys")) {
    throw new AppError("PostgreSQL dump must not include the PostGIS spatial_ref_sys table", 400);
  }

  const archivedTables = new Set(tableNames);
  const currentApplicationTables = currentTables.filter((tableName) => tableName !== "spatial_ref_sys");
  const containsCurrentSchema = currentApplicationTables.length > 0 &&
    currentApplicationTables.every((tableName) => archivedTables.has(tableName));
  const containsCoreSchema = CORE_APPLICATION_TABLES.every((tableName) => archivedTables.has(tableName));
  const hasPublicSchemaEntry = lines.some((line) => /\bSCHEMA\s+-\s+public\b/i.test(line));

  return {
    entryCount: lines.length,
    dataEntryCount: dataLines.length,
    tableNames,
    isFullDatabase: hasPublicSchemaEntry && containsCoreSchema && containsCurrentSchema,
  };
}
