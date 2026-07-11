import { useEffect, useMemo, useState, useCallback } from "react";
import {
  RefreshCw, Search, Terminal,
  CheckCircle, XCircle, LogIn, Bug, Database, Pencil, Trash2, Plus
} from "lucide-react";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { getAdminAuditLogs, type AuditLogEntry } from "../../services/adminDashboardService";
import { getDevQueryHistory, getDevActivityLog, type QueryHistoryEntry, type ActivityLogEntry } from "../../services/developerService";

type MainFilter = "all" | "crud" | "queries" | "logins" | "errors";
type NestedFilter = string;

function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getCrudActionLabel(action: string): { label: string; color: string; icon: typeof Plus } {
  if (action.startsWith("create")) return { label: "CREATE", color: "bg-green-50 text-[#006e2f]", icon: Plus };
  if (action.startsWith("update")) return { label: "UPDATE", color: "bg-blue-50 text-[#005ac2]", icon: Pencil };
  if (action.startsWith("delete")) return { label: "DELETE", color: "bg-red-50 text-[#ba1a1a]", icon: Trash2 };
  return { label: action.toUpperCase(), color: "bg-gray-50 text-[#64748b]", icon: Database };
}

function formatActionVerb(action: string): string {
  return action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const MAIN_FILTERS: { key: MainFilter; label: string }[] = [
  { key: "all", label: "All Activities" },
  { key: "crud", label: "CRUD Operations" },
  { key: "queries", label: "Query Executions" },
  { key: "logins", label: "Login Events" },
  { key: "errors", label: "System Errors" },
];

export default function AdminAuditPage() {
  const [mainFilter, setMainFilter] = useState<MainFilter>("all");
  const [nestedFilter, setNestedFilter] = useState<NestedFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  const [crudLogs, setCrudLogs] = useState<AuditLogEntry[]>([]);
  const [crudLoading, setCrudLoading] = useState(false);

  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const [history, setHistory] = useState<QueryHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadCrudLogs = useCallback(async () => {
    setCrudLoading(true);
    try {
      const data = await getAdminAuditLogs(200);
      setCrudLogs(data);
    } catch { setCrudLogs([]); }
    finally { setCrudLoading(false); }
  }, []);

  const loadActivityLog = useCallback(async () => {
    setActivityLoading(true);
    try {
      const data = await getDevActivityLog({ limit: 500 });
      setActivityLog(data);
    } catch { setActivityLog([]); }
    finally { setActivityLoading(false); }
  }, []);

  const loadQueryHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const data = await getDevQueryHistory(200);
      setHistory(data);
    } catch { setHistory([]); }
    finally { setHistoryLoading(false); }
  }, []);

  useEffect(() => {
    if (mainFilter === "all" || mainFilter === "crud") loadCrudLogs();
    if (mainFilter === "all" || mainFilter === "queries") loadQueryHistory();
    if (mainFilter === "all" || mainFilter === "logins" || mainFilter === "errors") loadActivityLog();
  }, [mainFilter, loadCrudLogs, loadQueryHistory, loadActivityLog]);

  const nestedOptions = useMemo(() => {
    if (mainFilter === "crud") return ["all", "create", "update", "delete"];
    if (mainFilter === "queries") return ["all", "success", "error"];
    if (mainFilter === "logins") return ["all", "login_success", "login_failed"];
    if (mainFilter === "errors") return ["all", "high", "medium", "low"];
    return ["all", "crud", "queries", "logins", "errors"];
  }, [mainFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([
      loadCrudLogs(),
      loadQueryHistory(),
      loadActivityLog(),
    ]).finally(() => setRefreshing(false));
  };

  const filteredCrud = useMemo(() => {
    let result = crudLogs;
    if (nestedFilter === "create") result = result.filter((r) => r.action.startsWith("create"));
    if (nestedFilter === "update") result = result.filter((r) => r.action.startsWith("update"));
    if (nestedFilter === "delete") result = result.filter((r) => r.action.startsWith("delete"));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) => r.action?.toLowerCase().includes(q) ||
          r.targetType?.toLowerCase().includes(q) ||
          r.targetId?.toLowerCase().includes(q) ||
          JSON.stringify(r.details)?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [crudLogs, nestedFilter, searchQuery]);

  const filteredHistory = useMemo(() => {
    let result = history;
    if (nestedFilter === "error") result = result.filter((h) => (h.payload ?? "").toUpperCase().includes("ERROR"));
    if (nestedFilter === "success") result = result.filter((h) => !(h.payload ?? "").toUpperCase().includes("ERROR"));
    return result;
  }, [history, nestedFilter]);

  const filteredActivity = useMemo(() => {
    let result = activityLog;
    if (nestedFilter === "login_success") result = result.filter((a) => a.event_type === "login_success");
    if (nestedFilter === "login_failed") result = result.filter((a) => a.event_type === "login_failed");
    if (nestedFilter === "high" || nestedFilter === "medium" || nestedFilter === "low") {
      result = result.filter((a) => (a.payload ?? "").toLowerCase().includes("error"));
    }
    if (mainFilter === "errors") {
      result = result.filter((a) => (a.payload ?? "").toUpperCase().includes("ERROR"));
    }
    return result;
  }, [activityLog, nestedFilter, mainFilter]);

  const overallLoading = crudLoading || activityLoading || historyLoading;

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">System Activities</h1>
            <p className="text-[14px] text-[#64748b] mt-1">Monitor all traffic and actions across all sides.</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-[#bccbb9] bg-white px-3 py-1.5 text-[12px] font-medium text-[#374151] hover:bg-gray-50 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <Database size={16} className="text-[#006e2f]" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">CRUD Operations</p>
            </div>
            <p className="text-[20px] font-bold text-[#0b1c30] mt-1">{crudLogs.length}</p>
            <p className="text-[11px] text-[#64748b] mt-0.5">
              {crudLogs.filter((r) => r.action.startsWith("create")).length} created &middot;{" "}
              {crudLogs.filter((r) => r.action.startsWith("update")).length} updated &middot;{" "}
              {crudLogs.filter((r) => r.action.startsWith("delete")).length} deleted
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <LogIn size={16} className="text-[#005ac2]" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Login Events</p>
            </div>
            <p className="text-[20px] font-bold text-[#0b1c30] mt-1">{activityLog.length}</p>
            <p className="text-[11px] text-[#64748b] mt-0.5">
              {activityLog.filter((a) => a.event_type === "login_success").length} success &middot;{" "}
              {activityLog.filter((a) => a.event_type === "login_failed").length} failed
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <Terminal size={16} className="text-[#b45309]" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Query Executions</p>
            </div>
            <p className="text-[20px] font-bold text-[#0b1c30] mt-1">{history.length}</p>
            <p className="text-[11px] text-[#64748b] mt-0.5">
              {history.filter((h) => (h.payload ?? "").toUpperCase().includes("ERROR")).length} errors
            </p>
          </div>
        </div>

        {/* Main filter dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-[#64748b]">Category:</span>
            <select
              value={mainFilter}
              onChange={(e) => { setMainFilter(e.target.value as MainFilter); setNestedFilter("all"); }}
              className="text-[13px] px-3 py-1.5 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#006e2f] bg-white min-w-[180px]"
            >
              {MAIN_FILTERS.map((f) => (
                <option key={f.key} value={f.key}>{f.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-[#64748b]">Filter:</span>
            <select
              value={nestedFilter}
              onChange={(e) => setNestedFilter(e.target.value)}
              className="text-[13px] px-3 py-1.5 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#006e2f] bg-white min-w-[160px]"
            >
              {nestedOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "all" ? "All"
                    : opt === "login_success" ? "Success"
                    : opt === "login_failed" ? "Failed"
                    : opt === "high" ? "High Severity"
                    : opt === "medium" ? "Medium Severity"
                    : opt === "low" ? "Low Severity"
                    : opt === "error" ? "Errors"
                    : opt === "success" ? "Success"
                    : opt === "crud" ? "CRUD"
                    : opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search by action, target, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]"
          />
        </div>

        {/* ── CRUD Operations table ── */}
        {(mainFilter === "all" || mainFilter === "crud") && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-[#f1f5f9] flex items-center gap-2">
              <Database size={14} className="text-[#006e2f]" />
              <span className="text-[13px] font-semibold text-[#0b1c30]">CRUD Operations</span>
              <span className="text-[11px] text-[#94a3b8]">({filteredCrud.length})</span>
            </div>
            {crudLoading ? (
              <div className="p-10 text-center"><LoadingSpinner /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-[#f8fafc]">
                      {["Time", "Action", "Target", "Details", "Actor"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCrud.map((entry) => {
                      const { label, color, icon: ActionIcon } = getCrudActionLabel(entry.action);
                      return (
                      <tr key={entry.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                        <td className="px-5 py-3 text-[11px] text-[#64748b] whitespace-nowrap">{formatTimeAgo(entry.createdAt)}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${color}`}>
                            <ActionIcon size={10} />
                            {label}
                          </span>
                          <p className="text-[10px] text-[#94a3b8] mt-0.5">{formatActionVerb(entry.action)}</p>
                        </td>
                        <td className="px-5 py-3 text-[12px] text-[#374151]">
                          <span className="font-medium">{entry.targetType || "—"}</span>
                          {entry.targetId && (
                            <p className="text-[10px] text-[#94a3b8] font-mono truncate max-w-[200px]" title={entry.targetId}>{entry.targetId}</p>
                          )}
                        </td>
                        <td className="px-5 py-3 max-w-[300px]">
                          <p className="text-[11px] text-[#64748b] truncate" title={JSON.stringify(entry.details ?? {})}>
                            {entry.details ? Object.entries(entry.details).map(([k, v]) => `${k}: ${String(v)}`).join(", ") : "—"}
                          </p>
                        </td>
                        <td className="px-5 py-3 text-[12px] text-[#64748b] font-mono truncate max-w-[200px]" title={entry.adminId || ""}>
                          {entry.adminId ? entry.adminId.slice(0, 8) + "…" : "System"}
                        </td>
                      </tr>
                      );
                    })}
                    {filteredCrud.length === 0 && (
                      <tr><td colSpan={5} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">No CRUD operations found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Query Executions table ── */}
        {(mainFilter === "all" || mainFilter === "queries") && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-[#f1f5f9] flex items-center gap-2">
              <Terminal size={14} className="text-[#005ac2]" />
              <span className="text-[13px] font-semibold text-[#0b1c30]">Query Executions</span>
              <span className="text-[11px] text-[#94a3b8]">({filteredHistory.length})</span>
            </div>
            {historyLoading ? (
              <div className="p-10 text-center"><LoadingSpinner /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="bg-[#f8fafc]">
                      {["Time", "User", "Query", "Status"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((entry) => {
                      const isError = (entry.payload ?? "").toUpperCase().includes("ERROR");
                      return (
                      <tr key={entry.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                        <td className="px-5 py-3 text-[11px] text-[#64748b] whitespace-nowrap">{formatTimeAgo(entry.executed_at)}</td>
                        <td className="px-5 py-3 text-[12px] text-[#64748b]">{entry.actor_id || "—"}</td>
                        <td className="px-5 py-3 max-w-[500px]">
                          <p className="text-[11px] font-mono text-[#0b1c30] truncate" title={entry.payload ?? ""}>
                            <Terminal size={10} className="inline mr-1 text-[#94a3b8]" />
                            {entry.payload ?? ""}
                          </p>
                        </td>
                        <td className="px-5 py-3">
                          {isError ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-50 text-[#ba1a1a] uppercase tracking-wider">
                              <XCircle size={10} /> Error
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-50 text-[#006e2f] uppercase tracking-wider">
                              <CheckCircle size={10} /> OK
                            </span>
                          )}
                        </td>
                      </tr>
                      );
                    })}
                    {filteredHistory.length === 0 && (
                      <tr><td colSpan={4} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">
                        No query executions found.
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Activity Log (logins / errors) ── */}
        {(mainFilter === "all" || mainFilter === "logins" || mainFilter === "errors") && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-[#f1f5f9] flex items-center gap-2">
              {mainFilter === "errors" ? <Bug size={14} className="text-[#ba1a1a]" /> : <LogIn size={14} className="text-[#005ac2]" />}
              <span className="text-[13px] font-semibold text-[#0b1c30]">
                {mainFilter === "errors" ? "System Errors" : "Login Events"}
              </span>
              <span className="text-[11px] text-[#94a3b8]">({filteredActivity.length})</span>
            </div>
            {activityLoading ? (
              <div className="p-10 text-center"><LoadingSpinner /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="bg-[#f8fafc]">
                      {["Time", "Type", "Actor", "Payload"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivity.map((entry) => (
                      <tr key={entry.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                        <td className="px-5 py-3 text-[11px] text-[#64748b] whitespace-nowrap">{formatTimeAgo(entry.executed_at)}</td>
                        <td className="px-5 py-3">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            entry.event_type === "login_failed" ? "bg-red-50 text-[#ba1a1a]" :
                            entry.event_type === "login_success" ? "bg-green-50 text-[#006e2f]" :
                            "bg-blue-50 text-[#005ac2]"
                          }`}>
                            {entry.event_type}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[12px] text-[#64748b]">{entry.actor_email || entry.actor_id || "—"}</td>
                        <td className="px-5 py-3 max-w-[400px]">
                          <p className="text-[12px] text-[#374151] truncate" title={entry.payload ?? ""}>{entry.payload ?? "—"}</p>
                        </td>
                      </tr>
                    ))}
                    {filteredActivity.length === 0 && (
                      <tr><td colSpan={4} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">No events found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
