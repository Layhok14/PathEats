export interface ErrorLog {
  id: string;
  level: "CRITICAL" | "WARNING" | "INFO";
  status: number;
  timestamp: string;
  endpoint: string;
  message: string;
}

export interface DbTable {
  name: string;
  icon: "vendor" | "menu" | "user" | "route" | "order";
  rowCount: number;
  size: string;
  lastOptimized: string;
  status: "Optimized" | "Fragmented" | "Vacuum Required";
}

export interface BackupEntry {
  name: string;
  icon: "db" | "file" | "clock" | "vendor";
  dateCreated: string;
  size: string;
  status: "COMPLETED" | "FAILED" | "RUNNING";
}

export interface SystemHealthItem {
  name: string;
  sub: string;
  status: "Online" | "Latency High" | "Offline";
}

export const SYSTEM_HEALTH: SystemHealthItem[] = [
  { name: "Database Cluster", sub: "POSTGRESQL MAIN", status: "Online" },
  { name: "API Gateway", sub: "EDGE INSTANCE", status: "Online" },
  { name: "Storage S3", sub: "ASSET BUCKET", status: "Latency High" },
  { name: "Server Node 01", sub: "MAIN WORKER", status: "Online" },
];

export const RECENT_ERROR_LOGS: ErrorLog[] = [
  { id: "e1", level: "CRITICAL", status: 500, timestamp: "2023-10-19 14:22:05", endpoint: "/api/v1/orders/create", message: "NullPointerException at line 142" },
  { id: "e2", level: "WARNING", status: 404, timestamp: "2023-10-19 14:20:11", endpoint: "/api/v1/users/assets/logo.png", message: "Resource not found" },
  { id: "e3", level: "INFO", status: 400, timestamp: "2023-10-19 14:18:33", endpoint: "/api/v1/auth/login", message: "Invalid credentials format" },
  { id: "e4", level: "CRITICAL", status: 500, timestamp: "2023-10-19 14:15:02", endpoint: "/api/v1/payment/stripe-webhook", message: "Timeout connecting to Stripe DB" },
  { id: "e5", level: "CRITICAL", status: 500, timestamp: "2023-10-19 14:10:44", endpoint: "/api/v1/geo/route-calc", message: "Memory limit exceeded" },
  { id: "e6", level: "WARNING", status: 400, timestamp: "2023-10-19 14:05:01", endpoint: "/api/v1/search/restaurants", message: "Bad Request: Missing Lat/Lng" },
];

export const ALL_ERROR_LOGS: ErrorLog[] = [
  ...RECENT_ERROR_LOGS,
  { id: "e7", level: "WARNING", status: 429, timestamp: "2023-10-19 14:19:33", endpoint: "/api/v1/auth/login", message: "Rate limit exceeded for IP: 192.168.1.1" },
  { id: "e8", level: "INFO", status: 200, timestamp: "2023-10-19 14:15:10", endpoint: "/api/v1/user/profile", message: "Database migration completed successfully" },
  { id: "e9", level: "CRITICAL", status: 503, timestamp: "2023-10-19 14:12:45", endpoint: "/api/v1/payment/stripe", message: "ConnectionTimeout: Failed to connect" },
  { id: "e10", level: "WARNING", status: 404, timestamp: "2023-10-19 14:05:01", endpoint: "/static/images/hero_fallback.png", message: "Missing asset detected. Fa…" },
];

export const DB_TABLES: DbTable[] = [
  { name: "vendors", icon: "vendor", rowCount: 1248, size: "4.2 MB", lastOptimized: "2h ago", status: "Optimized" },
  { name: "menu_items", icon: "menu", rowCount: 24592, size: "18.6 MB", lastOptimized: "1d ago", status: "Fragmented" },
  { name: "users", icon: "user", rowCount: 86402, size: "112.4 MB", lastOptimized: "4h ago", status: "Optimized" },
  { name: "routes", icon: "route", rowCount: 12110, size: "8.9 MB", lastOptimized: "12h ago", status: "Optimized" },
  { name: "orders", icon: "order", rowCount: 342881, size: "1.2 GB", lastOptimized: "Never", status: "Vacuum Required" },
];

export const BACKUP_ENTRIES: BackupEntry[] = [
  { name: "Daily_Full_Main_DB", icon: "db", dateCreated: "Oct 24, 2023  04:00 AM", size: "24.5 GB", status: "COMPLETED" },
  { name: "Asset_Bucket_Partial", icon: "file", dateCreated: "Oct 24, 2023  02:15 AM", size: "156.2 GB", status: "COMPLETED" },
  { name: "Log_Rotation_Final", icon: "clock", dateCreated: "Oct 23, 2023  11:59 PM", size: "8.4 GB", status: "COMPLETED" },
  { name: "Vendor_Metadata_Snapshot", icon: "vendor", dateCreated: "Oct 23, 2023  09:30 PM", size: "12.1 GB", status: "COMPLETED" },
];
