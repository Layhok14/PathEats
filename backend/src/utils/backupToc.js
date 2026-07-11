import AppError from "./AppError.js";

const SAFE_IDENTIFIER_PATTERN = /^[a-z_][a-z0-9_]*$/i;
const TOC_TABLE_DATA = /\bTABLE DATA\s+public\s+([^\s;]+)/i;
const CORE_FULL_BACKUP_TABLES = [
  "users",
  "place_categories",
  "places",
  "menu_items",
  "place_menu_items",
  "reviews",
  "backup_profiles",
  "scheduled_backups",
  "recovery_operations",
];

export function inspectPostgresToc(listOutput, currentTables = []) {
  const lines = String(listOutput || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith(";"));

  if (lines.length === 0) {
    throw new AppError("PostgreSQL dump contains no restore entries", 400);
  }

  const hasProhibitedEntries = lines.some((line) =>
    /\b(DATABASE|PUBLICATION|SUBSCRIPTION|EVENT TRIGGER|FOREIGN DATA WRAPPER|SERVER)\b/i.test(line)
  );
  if (hasProhibitedEntries) {
    throw new AppError("PostgreSQL dump contains unsupported high-risk object entries", 400);
  }

  const dataLines = lines.filter((line) => /\b(TABLE DATA|SEQUENCE SET)\s+public\s+/i.test(line));
  if (dataLines.length === 0) {
    throw new AppError("PostgreSQL dump contains no public table data", 400);
  }

  const tableNames = [...new Set(lines.map((line) => line.match(TOC_TABLE_DATA)?.[1]).filter(Boolean))];
  if (tableNames.some((tableName) => !SAFE_IDENTIFIER_PATTERN.test(tableName))) {
    throw new AppError("PostgreSQL dump contains an invalid restore table name", 400);
  }

  const current = new Set(currentTables);
  const archived = new Set(tableNames);
  const hasPublicSchemaEntry = lines.some((line) => /\bSCHEMA\s+-\s+public\b/i.test(line));
  const hasApplicationSchema = CORE_FULL_BACKUP_TABLES.every((tableName) => archived.has(tableName));
  const isFullDatabase =
    hasPublicSchemaEntry &&
    hasApplicationSchema &&
    (current.size === 0 || [...current].every((tableName) => archived.has(tableName)));

  return {
    entryCount: lines.length,
    dataEntryCount: dataLines.length,
    tableNames,
    isFullDatabase,
  };
}
