import api from "../../shared/services/axiosService";
import type {
  AdminUserOverviewRow,
  AdminVendorOverviewRow,
} from "./adminDashboardService";

export interface DevTableInfo {
  name: string; rowCount: string; size: string; status: string; deadTuples: number;
}
export interface DevDatabaseData {
  instance: { engine: string; version: string; region: string; connections: string; uptime: string; };
  storage: { used: string; total: string; usedBytes: number; totalBytes: number; };
  tables: DevTableInfo[];
}
export interface DevLogEntry {
  id: string; level: "CRITICAL" | "WARNING" | "INFO"; status: number;
  timestamp: string; endpoint: string; message: string;
}
export interface DevLogsData { logs: DevLogEntry[]; summary: { critical: number; warning: number; info: number }; }
export interface DevBackup {
  id: string; profileName: string; method: string; scope: string;
  scheduleInterval: string | null; scheduleUnit: string | null;
  createdAt: string; status: string; size: string;
  lastBackupAt: string | null; nextBackupAt: string | null;
  isEnabled: boolean; lastError: string | null; runCount: number; updatedAt: string;
}
export interface DevScheduledBackup {
  id: string; profileId: string | null; profileName: string | null;
  fileName: string; method: string; scope: string | null;
  size: string; status: string; message: string | null; createdAt: string;
  artifactFormat: string | null; completedAt: string | null;
}
export interface DevRecovery {
  id: string; type: string; fileName: string; status: string; createdAt: string; message: string;
}
export interface DevHealth { status: string; uptime: number; dbConnected: boolean; dbLatency: number; timestamp: string; }

function getHeaderValue(headers: Record<string, unknown> | undefined, name: string): string {
  if (!headers || typeof headers !== "object") return "";
  const keys = Object.keys(headers);
  const match = keys.find((key) => key.toLowerCase() === name.toLowerCase());
  const value = match ? headers[match] : "";
  return typeof value === "string" ? value : "";
}

function parseDownloadFilename(headers: Record<string, unknown> | undefined): string | null {
  const disposition = getHeaderValue(headers, "content-disposition");
  if (!disposition) return null;

  const encodedMatch = disposition.match(/filename\*=(?:UTF-8'')?([^;]+)/i);
  if (encodedMatch?.[1]) {
    return decodeURIComponent(encodedMatch[1].trim().replace(/^"|"$/g, ""));
  }

  const basicMatch = disposition.match(/filename="?([^";]+)"?/i);
  return basicMatch?.[1] ? basicMatch[1] : null;
}

function inferDownloadExtension(headers: Record<string, unknown> | undefined, fallback: string): string {
  const format = getHeaderValue(headers, "x-backup-format").toLowerCase();
  if (format === "csv") return "csv";
  if (format === "postgres-custom") return "dump";

  const contentType = getHeaderValue(headers, "content-type").toLowerCase();
  if (contentType.includes("text/csv")) return "csv";

  const filename = parseDownloadFilename(headers);
  if (filename) {
    const extMatch = filename.match(/\.([a-z0-9]+)$/i);
    if (extMatch?.[1]) {
      const ext = extMatch[1].toLowerCase();
      if (["csv", "dump", "backup", "pgdump"].includes(ext)) return ext;
    }
  }

  return fallback;
}

export async function getDevHealth(): Promise<DevHealth> {
  const r = await api.get<{ success: boolean; data: DevHealth }>("/dev/health");
  return r.data.data;
}
export async function getDevDatabase(): Promise<DevDatabaseData> {
  const r = await api.get<{ success: boolean; data: DevDatabaseData }>("/dev/database");
  return r.data.data;
}
export async function getDevLogs(params?: { severity?: string; search?: string; limit?: number }): Promise<DevLogsData> {
  const r = await api.get<{ success: boolean; data: DevLogsData }>("/dev/logs", { params });
  return r.data.data;
}
export async function postDevSeed(): Promise<{ message: string }> {
  const r = await api.post<{ success: boolean; data: { message: string } }>("/dev/seed");
  return r.data.data;
}
export async function getDevApiMetrics(): Promise<{ totalTables: number; avgLatency: string; requestsToday: string; uptime: number }> {
  const r = await api.get<{ success: boolean; data: { totalTables: number; avgLatency: string; requestsToday: string; uptime: number } }>("/dev/api-metrics");
  return r.data.data;
}
export async function getDevBackups(): Promise<DevBackup[]> {
  const r = await api.get<{ success: boolean; data: DevBackup[] }>("/dev/backups");
  return r.data.data;
}
export async function createDevBackup(payload: { profileName: string; method: string; scope?: string; scheduleInterval?: string; scheduleUnit?: string }): Promise<DevBackup> {
  const r = await api.post<{ success: boolean; data: DevBackup }>("/dev/backups", payload);
  return r.data.data;
}
export async function downloadDevBackup(id: string): Promise<{ blob: Blob; filename: string }> {
  const r = await api.get<Blob>(`/dev/backups/${id}/download`, { responseType: "blob", timeout: 300000 });
  const filename = parseDownloadFilename(r.headers as Record<string, unknown> | undefined) || `patheats-backup-${id}.${inferDownloadExtension(r.headers as Record<string, unknown> | undefined, "dump")}`;
  return {
    blob: r.data,
    filename,
  };
}
export async function deleteDevBackup(id: string): Promise<void> {
  await api.delete(`/dev/backups/${id}`);
}
export async function updateDevBackup(id: string, payload: {
  profileName?: string;
  method?: string;
  scope?: string;
  scheduleInterval?: string | null;
  scheduleUnit?: string | null;
  isEnabled?: boolean;
}): Promise<DevBackup> {
  const r = await api.patch<{ success: boolean; data: DevBackup }>(`/dev/backups/${id}`, payload);
  return r.data.data;
}
export async function pauseDevBackup(id: string): Promise<DevBackup> {
  const r = await api.post<{ success: boolean; data: DevBackup }>(`/dev/backups/${id}/pause`);
  return r.data.data;
}
export async function resumeDevBackup(id: string): Promise<DevBackup> {
  const r = await api.post<{ success: boolean; data: DevBackup }>(`/dev/backups/${id}/resume`);
  return r.data.data;
}
export async function getScheduledBackups(profileId?: string): Promise<DevScheduledBackup[]> {
  const r = await api.get<{ success: boolean; data: DevScheduledBackup[] }>("/dev/backups/scheduled", {
    params: profileId ? { profileId } : {},
  });
  return r.data.data;
}
export async function downloadScheduledBackup(id: string): Promise<{ blob: Blob; filename: string }> {
  const r = await api.get<Blob>(`/dev/backups/scheduled/${id}/download`, { responseType: "blob", timeout: 120000 });
  const filename = parseDownloadFilename(r.headers as Record<string, unknown> | undefined) || `scheduled-backup-${id}.${inferDownloadExtension(r.headers as Record<string, unknown> | undefined, "dump")}`;
  return {
    blob: r.data,
    filename,
  };
}
export async function deleteScheduledBackup(id: string): Promise<void> {
  await api.delete(`/dev/backups/scheduled/${id}`);
}
export async function getDevRecovery(): Promise<DevRecovery[]> {
  const r = await api.get<{ success: boolean; data: DevRecovery[] }>("/dev/recovery");
  return r.data.data;
}
export async function initiateDevRecovery(payload: {
  type: string;
  file: File;
  confirmationText: string;
  targetTable?: string;
}): Promise<DevRecovery> {
  const form = new FormData();
  form.append("type", payload.type);
  form.append("file", payload.file);
  form.append("confirmationText", payload.confirmationText);
  if (payload.targetTable) form.append("targetTable", payload.targetTable);
  const r = await api.post<{ success: boolean; data: DevRecovery }>("/dev/recovery", form, {
    timeout: 600000,
  });
  return r.data.data;
}

// ── SQL Query Presets (DB-backed) ───────────────────────────────────────────

export interface QueryPreset {
  id: string; title: string; query_string: string; category: string;
  is_system_preset: boolean; created_by: string | null;
  last_used_at: string | null; created_at: string;
}
export interface QueryResult { rows: Record<string, unknown>[]; rowCount: number; duration: number; fields: string[]; }

export async function getDevQueryPresets(params?: { category?: string; search?: string }): Promise<{ presets: QueryPreset[]; totalPresets: number }> {
  const r = await api.get<{ success: boolean; data: { presets: QueryPreset[]; totalPresets: number } }>("/dev/queries/presets", { params });
  return r.data.data;
}
export async function getAllDevQueryPresets(params?: { category?: string; search?: string; page?: string; limit?: string }): Promise<{ presets: QueryPreset[]; total: number; page: number; limit: number }> {
  const r = await api.get<{ success: boolean; data: { presets: QueryPreset[]; total: number; page: number; limit: number } }>("/dev/queries/presets/all", { params });
  return r.data.data;
}
export async function createDevQueryPreset(payload: { title: string; query_string: string; category: string }): Promise<QueryPreset> {
  const r = await api.post<{ success: boolean; data: QueryPreset }>("/dev/queries/presets", payload);
  return r.data.data;
}
export async function updateDevQueryPreset(id: string, payload: { title?: string; query_string?: string; category?: string }): Promise<QueryPreset> {
  const r = await api.put<{ success: boolean; data: QueryPreset }>(`/dev/queries/presets/${id}`, payload);
  return r.data.data;
}
export async function deleteDevQueryPreset(id: string): Promise<void> {
  await api.delete(`/dev/queries/presets/${id}`);
}

export async function postDevQuery(sql: string, presetId?: string): Promise<QueryResult> {
  const r = await api.post<{ success: boolean; data: QueryResult }>("/dev/query", { sql, presetId });
  return r.data.data;
}

// ── Maintenance ─────────────────────────────────────────────────────────────

export interface TableMaintenanceRow {
  name: string; live_tuples: number; dead_tuples: number; size: string;
  last_vacuum: string | null; last_autovacuum: string | null;
  last_analyze: string | null; last_autoanalyze: string | null;
  health: "good" | "warning" | "critical";
}
export async function getDevMaintenanceStatus(): Promise<TableMaintenanceRow[]> {
  const r = await api.get<{ success: boolean; data: TableMaintenanceRow[] }>("/dev/maintenance");
  return r.data.data;
}

// ── Error / Bug Dashboard ───────────────────────────────────────────────────

export interface DevErrorSummary {
  totalErrors: number; totalBanned: number;
  severityBreakdown: { high: number; medium: number; low: number };
  auditErrors: Array<{ action: string; details: Record<string, unknown> | null; created_at: string; target_type: string | null }>;
  queryErrors: Array<{ id: string; event_type: string; actor_id: string | null; payload: string | null; executed_at: string }>;
  bannedUsers: Array<{ id: string; email: string; created_at: string }>;
  loginEvents: Array<{ event_type: string; actor_id: string | null; payload: string | null; executed_at: string }>;
  loginFailures: number;
  sources: { consumer: string; vendor: string; admin: string; developer: string };
}
export async function getDevErrors(): Promise<DevErrorSummary> {
  const r = await api.get<{ success: boolean; data: DevErrorSummary }>("/dev/errors");
  return r.data.data;
}

// ── Activity Log ────────────────────────────────────────────────────────────

export interface ActivityLogEntry { id: string; event_type: string; actor_id: string | null; payload: string | null; executed_at: string; actor_email: string | null; }
export async function getDevActivityLog(params?: { eventType?: string; limit?: number }): Promise<ActivityLogEntry[]> {
  const r = await api.get<{ success: boolean; data: ActivityLogEntry[] }>("/dev/activity-log", { params });
  return r.data.data;
}

// ── Query History (DB-backed) ───────────────────────────────────────────────

export interface QueryHistoryEntry { id: string; event_type: string; actor_id: string | null; payload: string | null; executed_at: string; }
export async function getDevQueryHistory(limit = 100): Promise<QueryHistoryEntry[]> {
  const r = await api.get<{ success: boolean; data: QueryHistoryEntry[] }>("/dev/query/history", { params: { limit } });
  return r.data.data;
}

export async function getDevUserManagementOverview(search = ""): Promise<AdminUserOverviewRow[]> {
  const r = await api.get<{ success: boolean; data: AdminUserOverviewRow[] }>("/dev/user-management/overview", {
    params: search ? { search } : undefined,
  });
  return r.data.data;
}

export async function getDevVendorManagementOverview(search = ""): Promise<AdminVendorOverviewRow[]> {
  const r = await api.get<{ success: boolean; data: AdminVendorOverviewRow[] }>("/dev/vendor-management/overview", {
    params: search ? { search } : undefined,
  });
  return r.data.data;
}
