import { useEffect, useMemo, useState, useCallback } from "react";
import {
  RefreshCw, Activity, Search, AlertTriangle, Terminal,
  Zap, Square, Clock, Server, Wifi, CheckCircle, XCircle, LogIn, Database, Bug, Globe
} from "lucide-react";
import { toast } from "sonner";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { getAdminAuditActivity, postAdminKillQuery, type AuditActivityRow } from "../../services/adminDashboardService";
import { getDevHealth, getDevQueryHistory, getDevActivityLog, type DevHealth, type QueryHistoryEntry, type ActivityLogEntry } from "../../services/developerService";

type MainFilter = "all" | "live" | "queries" | "logins" | "errors";
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

function getStateColor(state: string): string {
  if (state === "active") return "bg-green-50 text-[#006e2f] border-[#bbf7d0]";
  if (state?.includes("idle")) return "bg-yellow-50 text-[#92400e] border-[#fde68a]";
  if (state?.includes("waiting") || state?.includes("lock")) return "bg-red-50 text-[#ba1a1a] border-[#fecaca]";
  return "bg-gray-50 text-[#64748b] border-[#e2e8f0]";
}

function getStateDot(state: string): string {
  if (state === "active") return "bg-[#006e2f]";
  if (state?.includes("idle")) return "bg-[#f59e0b]";
  if (state?.includes("waiting") || state?.includes("lock")) return "bg-[#ba1a1a]";
  return "bg-[#94a3b8]";
}

function truncateQuery(q: string, max = 120): string {
  if (!q) return "";
  return q.length > max ? q.slice(0, max) + "..." : q;
}

const MAIN_FILTERS: { key: MainFilter; label: string; icon: typeof Activity }[] = [
  { key: "all", label: "All Activities", icon: Globe },
  { key: "live", label: "Live Connections", icon: Zap },
  { key: "queries", label: "Query Executions", icon: Terminal },
  { key: "logins", label: "Login Events", icon: LogIn },
  { key: "errors", label: "System Errors", icon: Bug },
];

export default function AdminAuditPage() {
  const [mainFilter, setMainFilter] = useState<MainFilter>("all");
  const [nestedFilter, setNestedFilter] = useState<NestedFilter>("all");

  // Live connections
  const [rows, setRows] = useState<AuditActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [health, setHealth] = useState<DevHealth | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [killingPid, setKillingPid] = useState<number | null>(null);

  // Activity log
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  // Query history
  const [history, setHistory] = useState<QueryHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadLiveData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const [data, h] = await Promise.all([
        getAdminAuditActivity(),
        getDevHealth().catch(() => null),
      ]);
      setRows(data);
      setHealth(h);
    } catch {
      setError("Could not load live connections.");
      toast.error("Could not load live connections.");
    } finally { setLoading(false); setRefreshing(false); }
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
    loadLiveData();
    const interval = setInterval(() => loadLiveData(true), 15000);
    return () => clearInterval(interval);
  }, [loadLiveData]);

  useEffect(() => {
    if (mainFilter === "all" || mainFilter === "queries") loadQueryHistory();
    if (mainFilter === "all" || mainFilter === "logins" || mainFilter === "errors") loadActivityLog();
  }, [mainFilter, loadQueryHistory, loadActivityLog]);

  // ── Nested filter options ──
  const nestedOptions = useMemo(() => {
    if (mainFilter === "live") return ["all", ...new Set(rows.map((r) => r.state))];
    if (mainFilter === "queries") return ["all", "success", "error"];
    if (mainFilter === "logins") return ["all", "login_success", "login_failed"];
    if (mainFilter === "errors") return ["all", "high", "medium", "low"];
    return ["all", "live", "queries", "logins", "errors"];
  }, [mainFilter, rows]);

  const handleRefresh = () => {
    loadLiveData(true);
    if (mainFilter === "all" || mainFilter === "queries") loadQueryHistory();
    if (mainFilter === "all" || mainFilter === "logins" || mainFilter === "errors") loadActivityLog();
  };

  const handleKillQuery = async (pid: number) => {
    if (!confirm(`Cancel query on PID ${pid}?`)) return;
    setKillingPid(pid);
    try {
      const res = await postAdminKillQuery(pid);
      toast.success(res.message);
      await loadLiveData();
    } catch { toast.error(`Failed to cancel PID ${pid}.`); }
    finally { setKillingPid(null); }
  };

  // ── Filtered data ──
  const filteredLive = useMemo(() => {
    let result = rows;
    if (nestedFilter !== "all") result = result.filter((r) => r.state === nestedFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) => r.query?.toLowerCase().includes(q) ||
          r.username?.toLowerCase().includes(q) ||
          r.application_name?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [rows, nestedFilter, searchQuery]);

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

  const stateCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    rows.forEach((r) => { counts[r.state] = (counts[r.state] || 0) + 1; });
    return counts;
  }, [rows]);

  const overallLoading = loading || activityLoading || historyLoading;

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

        {/* Health cards */}
        {health && (
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <Server size={16} className={health.status === "healthy" ? "text-[#006e2f]" : "text-[#ba1a1a]"} />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">System</p>
              </div>
              <p className={`text-[20px] font-bold mt-1 ${health.status === "healthy" ? "text-[#006e2f]" : "text-[#ba1a1a]"}`}>{health.status}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <Database size={16} className={health.dbConnected ? "text-[#006e2f]" : "text-[#ba1a1a]"} />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Database</p>
              </div>
              <p className={`text-[20px] font-bold mt-1 ${health.dbConnected ? "text-[#006e2f]" : "text-[#ba1a1a]"}`}>{health.dbConnected ? "Connected" : "Disconnected"}</p>
              <p className="text-[11px] text-[#64748b] mt-0.5">{health.dbLatency}ms latency</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <Activity size={16} className="text-[#005ac2]" />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Live Connections</p>
              </div>
              <p className="text-[20px] font-bold text-[#0b1c30] mt-1">{rows.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="text-[#b45309]" />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Active Queries</p>
              </div>
              <p className="text-[20px] font-bold text-[#0b1c30] mt-1">{rows.filter((r) => r.state === "active").length}</p>
            </div>
          </div>
        )}

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
                    : opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>
          {error && <span className="text-[12px] text-[#ba1a1a]">{error}</span>}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search by query, user, or payload..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]"
          />
        </div>

        {/* ── Live Connections table ── */}
        {(mainFilter === "all" || mainFilter === "live") && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-[#f1f5f9] flex items-center gap-2">
              <Zap size={14} className="text-[#b45309]" />
              <span className="text-[13px] font-semibold text-[#0b1c30]">Live Connections</span>
              <span className="text-[11px] text-[#94a3b8]">({filteredLive.length})</span>
            </div>
            {loading && rows.length === 0 ? (
              <div className="p-10 text-center">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="bg-[#f8fafc]">
                      {["PID", "User", "Application", "State", "Query", "Duration", "Wait Event", ""].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLive.map((row) => (
                      <tr key={row.pid} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                        <td className="px-5 py-3 text-[12px] font-mono text-[#0b1c30]">{row.pid}</td>
                        <td className="px-5 py-3 text-[12px] text-[#64748b]">{row.username}</td>
                        <td className="px-5 py-3 text-[12px] text-[#64748b]">{row.application_name || "—"}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${getStateColor(row.state)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${getStateDot(row.state)}`} />
                            {row.state}
                          </span>
                        </td>
                        <td className="px-5 py-3 max-w-[400px]">
                          <div className="flex items-start gap-1.5">
                            <Terminal size={12} className="mt-1 text-[#94a3b8] shrink-0" />
                            <p className="text-[11px] font-mono text-[#0b1c30] leading-relaxed" title={row.query}>
                              {truncateQuery(row.query)}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-[12px] text-[#64748b] whitespace-nowrap">
                          {row.query_start ? (
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {formatTimeAgo(row.query_start)}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-5 py-3 text-[12px] text-[#64748b]">
                          {row.wait_event ? (
                            <span className="flex items-center gap-1">
                              <AlertTriangle size={12} className="text-[#b45309]" />
                              {row.wait_event_type || ""} {row.wait_event}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-5 py-3">
                          {row.state === "active" && (
                            <button
                              onClick={() => handleKillQuery(row.pid)}
                              disabled={killingPid === row.pid}
                              className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded bg-red-50 text-[#ba1a1a] hover:bg-red-100 disabled:opacity-50 uppercase tracking-wider"
                            >
                              <Square size={10} /> {killingPid === row.pid ? "..." : "Cancel"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredLive.length === 0 && (
                      <tr><td colSpan={8} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">
                        {searchQuery || nestedFilter !== "all" ? "No matches" : "No active connections"}
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {rows.length > 0 && (
              <div className="px-5 py-3 border-t border-[#f1f5f9] flex items-center gap-4 text-[12px] text-[#94a3b8]">
                <span className="flex items-center gap-1"><Activity size={14} /> {filteredLive.length} / {rows.length}</span>
                <span className="flex items-center gap-1"><Zap size={14} /> {rows.filter((r) => r.state === "active").length} active</span>
                {rows.some((r) => r.wait_event) && (
                  <span className="flex items-center gap-1"><AlertTriangle size={14} className="text-[#b45309]" /> {rows.filter((r) => r.wait_event).length} waiting</span>
                )}
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
              <div className="p-10 text-center">
                <LoadingSpinner />
              </div>
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
              <div className="p-10 text-center">
                <LoadingSpinner />
              </div>
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
