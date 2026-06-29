import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw, Activity, Search, AlertTriangle, Terminal,
  Zap, Square, Clock, Server, Wifi, History, CheckCircle, XCircle
} from "lucide-react";
import { toast } from "sonner";
import { getAdminAuditActivity, postAdminKillQuery, type AuditActivityRow } from "../../services/adminDashboardService";
import { getDevHealth, getDevQueryHistory, type DevHealth, type QueryHistoryEntry } from "../../services/developerService";

type AuditTab = "live" | "history";

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

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

export default function AdminAuditPage() {
  const [tab, setTab] = useState<AuditTab>("live");
  const [rows, setRows] = useState<AuditActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [health, setHealth] = useState<DevHealth | null>(null);
  const [stateFilter, setStateFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [killingPid, setKillingPid] = useState<number | null>(null);

  // Query history state
  const [history, setHistory] = useState<QueryHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState("");

  const loadLiveData = async (isRefresh = false) => {
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
      setError("Could not load database activity.");
      toast.error("Could not load database activity.");
    } finally { setLoading(false); setRefreshing(false); }
  };

  const handleRefresh = () => loadLiveData(true);

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await getDevQueryHistory(200);
      setHistory(data);
    } catch {
      toast.error("Could not load query history.");
    } finally { setHistoryLoading(false); }
  };

  useEffect(() => {
    loadLiveData();
    const interval = setInterval(() => loadLiveData(true), 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (tab === "history") loadHistory();
  }, [tab]);

  const filtered = useMemo(() => {
    let result = rows;
    if (stateFilter !== "All") result = result.filter((r) => r.state === stateFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) => r.query?.toLowerCase().includes(q) ||
          r.username?.toLowerCase().includes(q) ||
          r.application_name?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [rows, stateFilter, searchQuery]);

  const stateCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    rows.forEach((r) => { counts[r.state] = (counts[r.state] || 0) + 1; });
    return counts;
  }, [rows]);

  const filteredHistory = useMemo(() => {
    if (!historySearch.trim()) return history;
    const q = historySearch.toLowerCase();
    return history.filter((h) => h.sql.toLowerCase().includes(q) || h.user.toLowerCase().includes(q));
  }, [history, historySearch]);

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

  const states = ["All", ...new Set(rows.map((r) => r.state))];

  const tabs = [
    { key: "live" as AuditTab, label: "Live Activity", icon: Activity },
    { key: "history" as AuditTab, label: "Query History", icon: History },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">Database Activity</h1>
            <p className="text-[14px] text-[#64748b] mt-1">Monitor running queries and review past executions.</p>
          </div>
          <button
            onClick={tab === "live" ? handleRefresh : loadHistory}
            disabled={(tab === "live" ? refreshing : historyLoading)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#bccbb9] bg-white px-3 py-1.5 text-[12px] font-medium text-[#374151] hover:bg-gray-50 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw size={14} className={(tab === "live" ? refreshing : historyLoading) ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="flex gap-1 bg-white rounded-xl border border-[#e2e8f0] p-1 shadow-sm w-fit">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded-lg transition-all ${
                  tab === t.key
                    ? "bg-[#006e2f] text-white shadow-sm"
                    : "text-[#64748b] hover:text-[#0b1c30] hover:bg-gray-50"
                }`}
              >
                <Icon size={15} /> {t.label}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-[13px] text-[#92400e]">{error}</div>
        )}

        {tab === "live" && health && (
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
                <Wifi size={16} className={health.dbConnected ? "text-[#006e2f]" : "text-[#ba1a1a]"} />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Database</p>
              </div>
              <p className={`text-[20px] font-bold mt-1 ${health.dbConnected ? "text-[#006e2f]" : "text-[#ba1a1a]"}`}>{health.dbConnected ? "Connected" : "Disconnected"}</p>
              <p className="text-[11px] text-[#64748b] mt-0.5">{health.dbLatency}ms latency</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <Activity size={16} className="text-[#005ac2]" />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Connections</p>
              </div>
              <p className="text-[20px] font-bold text-[#0b1c30] mt-1">{rows.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="text-[#b45309]" />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Active</p>
              </div>
              <p className="text-[20px] font-bold text-[#0b1c30] mt-1">{rows.filter((r) => r.state === "active").length}</p>
            </div>
          </div>
        )}

        {tab === "live" && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              {states.map((s) => (
                <button
                  key={s}
                  onClick={() => setStateFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
                    stateFilter === s
                      ? "bg-[#006e2f] text-white border-[#006e2f]"
                      : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#006e2f]"
                  }`}
                >
                  {s === "All" ? "All" : s}
                  {s !== "All" && <span className="ml-1.5 opacity-70">({stateCounts[s] || 0})</span>}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="text"
                placeholder="Search by query, user, or app..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]"
              />
            </div>
          </>
        )}

        {tab === "history" && (
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search past queries..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]"
            />
          </div>
        )}

        {tab === "live" ? (
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            {loading && rows.length === 0 ? (
              <div className="p-10 text-center text-[13px] text-[#94a3b8]">
                <div className="w-5 h-5 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              </div>
            ) : rows.length === 0 ? (
              <div className="p-10 text-center text-[13px] text-[#94a3b8]">No active connections</div>
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
                    {filtered.map((row) => (
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
                    {filtered.length === 0 && (
                      <tr><td colSpan={8} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">
                        {searchQuery || stateFilter !== "All" ? "No matches" : "No active connections"}
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="px-5 py-3 border-t border-[#f1f5f9] flex items-center gap-4 text-[12px] text-[#94a3b8]">
              <span className="flex items-center gap-1"><Activity size={14} /> {filtered.length} / {rows.length}</span>
              <span className="flex items-center gap-1"><Zap size={14} /> {rows.filter((r) => r.state === "active").length} active</span>
              {rows.some((r) => r.wait_event) && (
                <span className="flex items-center gap-1"><AlertTriangle size={14} className="text-[#b45309]" /> {rows.filter((r) => r.wait_event).length} waiting</span>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            {historyLoading ? (
              <div className="p-10 text-center text-[13px] text-[#94a3b8]">
                <div className="w-5 h-5 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="bg-[#f8fafc]">
                      {["Time", "User", "Query", "Duration", "Rows", "Status"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((entry) => (
                      <tr key={entry.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                        <td className="px-5 py-3 text-[11px] text-[#64748b] whitespace-nowrap">{formatTimeAgo(entry.createdAt)}</td>
                        <td className="px-5 py-3 text-[12px] text-[#64748b]">{entry.user}</td>
                        <td className="px-5 py-3 max-w-[400px]">
                          <p className="text-[11px] font-mono text-[#0b1c30] truncate" title={entry.sql}>
                            <Terminal size={10} className="inline mr-1 text-[#94a3b8]" />
                            {entry.sql}
                          </p>
                        </td>
                        <td className="px-5 py-3 text-[12px] text-[#64748b] whitespace-nowrap">{formatDuration(entry.duration)}</td>
                        <td className="px-5 py-3 text-[12px] text-[#64748b]">{entry.rowCount}</td>
                        <td className="px-5 py-3">
                          {entry.error ? (
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
                    ))}
                    {filteredHistory.length === 0 && (
                      <tr><td colSpan={6} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">
                        {historySearch ? "No matches" : "No queries executed yet. Run queries from the Query Editor to see them here."}
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="px-5 py-3 border-t border-[#f1f5f9] text-[12px] text-[#94a3b8]">
              {filteredHistory.length} past query execution{filteredHistory.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
