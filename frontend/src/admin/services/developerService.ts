import api from "../../shared/services/axiosService";

export interface DevTableInfo {
  name: string;
  rowCount: string;
  size: string;
  status: string;
  deadTuples: number;
}

export interface DevDatabaseData {
  instance: {
    engine: string;
    version: string;
    region: string;
    connections: string;
    uptime: string;
  };
  storage: {
    used: string;
    total: string;
    usedBytes: number;
    totalBytes: number;
  };
  tables: DevTableInfo[];
}

export interface DevLogEntry {
  id: string;
  level: "CRITICAL" | "WARNING" | "INFO";
  status: number;
  timestamp: string;
  endpoint: string;
  message: string;
}

export interface DevLogsData {
  logs: DevLogEntry[];
  summary: { critical: number; warning: number; info: number };
}

export interface DevBackup {
  id: string;
  profileName: string;
  method: string;
  scope: string;
  scheduleInterval: string | null;
  scheduleUnit: string | null;
  createdAt: string;
  status: string;
  size: string;
}

export interface DevRecovery {
  id: string;
  type: string;
  fileName: string;
  status: string;
  createdAt: string;
  message: string;
}

export interface DevHealth {
  status: string;
  uptime: number;
  dbConnected: boolean;
  dbLatency: number;
  timestamp: string;
}

export async function getDevHealth(): Promise<DevHealth> {
  const response = await api.get<{ success: boolean; data: DevHealth }>("/dev/health");
  return response.data.data;
}

export async function getDevDatabase(): Promise<DevDatabaseData> {
  const response = await api.get<{ success: boolean; data: DevDatabaseData }>("/dev/database");
  return response.data.data;
}

export async function getDevLogs(params?: {
  severity?: string;
  search?: string;
  limit?: number;
}): Promise<DevLogsData> {
  const response = await api.get<{ success: boolean; data: DevLogsData }>("/dev/logs", { params });
  return response.data.data;
}

export async function postDevSeed(): Promise<{ message: string }> {
  const response = await api.post<{ success: boolean; data: { message: string } }>("/dev/seed");
  return response.data.data;
}

export async function getDevApiMetrics(): Promise<{
  totalTables: number;
  avgLatency: string;
  requestsToday: string;
  uptime: number;
}> {
  const response = await api.get<{ success: boolean; data: { totalTables: number; avgLatency: string; requestsToday: string; uptime: number } }>("/dev/api-metrics");
  return response.data.data;
}

export async function getDevBackups(): Promise<DevBackup[]> {
  const response = await api.get<{ success: boolean; data: DevBackup[] }>("/dev/backups");
  return response.data.data;
}

export async function createDevBackup(payload: {
  profileName: string;
  method: string;
  scope?: string;
  scheduleInterval?: string;
  scheduleUnit?: string;
}): Promise<DevBackup> {
  const response = await api.post<{ success: boolean; data: DevBackup }>("/dev/backups", payload);
  return response.data.data;
}

export async function deleteDevBackup(id: string): Promise<void> {
  await api.delete(`/dev/backups/${id}`);
}

export async function getDevRecovery(): Promise<DevRecovery[]> {
  const response = await api.get<{ success: boolean; data: DevRecovery[] }>("/dev/recovery");
  return response.data.data;
}

export async function initiateDevRecovery(payload: {
  type: string;
  fileName?: string;
}): Promise<DevRecovery> {
  const response = await api.post<{ success: boolean; data: DevRecovery }>("/dev/recovery", payload);
  return response.data.data;
}

// ── SQL Query Runner ────────────────────────────────────────────────────────

export interface QueryPreset {
  name: string;
  description: string;
  sql: string;
}

export interface QueryResult {
  rows: Record<string, unknown>[];
  rowCount: number;
  fields: string[];
}

export async function getDevQueryPresets(): Promise<QueryPreset[]> {
  const response = await api.get<{ success: boolean; data: QueryPreset[] }>("/dev/queries/presets");
  return response.data.data;
}

export async function postDevQuery(sql: string): Promise<QueryResult> {
  const response = await api.post<{ success: boolean; data: QueryResult }>("/dev/query", { sql });
  return response.data.data;
}

// ── Maintenance ─────────────────────────────────────────────────────────────

export interface TableMaintenanceRow {
  name: string;
  live_tuples: number;
  dead_tuples: number;
  size: string;
  last_vacuum: string | null;
  last_autovacuum: string | null;
  last_analyze: string | null;
  last_autoanalyze: string | null;
  health: "good" | "warning" | "critical";
}

export async function getDevMaintenanceStatus(): Promise<TableMaintenanceRow[]> {
  const response = await api.get<{ success: boolean; data: TableMaintenanceRow[] }>("/dev/maintenance");
  return response.data.data;
}

export async function postDevVacuum(table: string): Promise<{ message: string }> {
  const response = await api.post<{ success: boolean; data: { message: string } }>("/dev/maintenance/vacuum", { table });
  return response.data.data;
}

export async function postDevAnalyze(table: string): Promise<{ message: string }> {
  const response = await api.post<{ success: boolean; data: { message: string } }>("/dev/maintenance/analyze", { table });
  return response.data.data;
}

// ── Error / Bug Summary ─────────────────────────────────────────────────────

export interface DevErrorSummary {
  auditErrors: Array<{ action: string; details: Record<string, unknown> | null; created_at: string; target_type: string | null }>;
  bannedUsers: Array<{ id: string; email: string; created_at: string }>;
  totalErrors: number;
  totalBanned: number;
}

export async function getDevErrors(): Promise<DevErrorSummary> {
  const response = await api.get<{ success: boolean; data: DevErrorSummary }>("/dev/errors");
  return response.data.data;
}
