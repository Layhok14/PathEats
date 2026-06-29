import { useState, useEffect, useCallback } from "react";
import {
  getDevQueryPresets, getAllDevQueryPresets, createDevQueryPreset, updateDevQueryPreset, deleteDevQueryPreset,
  postDevQuery, getDevMaintenanceStatus, getDevErrors, getDevActivityLog,
  QueryPreset, QueryResult, TableMaintenanceRow, DevErrorSummary, ActivityLogEntry,
} from "../../services/developerService";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "", label: "All Categories", color: "bg-gray-100 text-gray-700" },
  { value: "viewing", label: "Viewing (Read)", color: "bg-blue-100 text-blue-700" },
  { value: "altering", label: "Altering", color: "bg-orange-100 text-orange-700" },
  { value: "deleting", label: "Deleting", color: "bg-red-100 text-red-700" },
  { value: "updating", label: "Updating", color: "bg-purple-100 text-purple-700" },
  { value: "creating", label: "Creating", color: "bg-green-100 text-green-700" },
];

function ErrorLogTab() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const eventType = filter || undefined;
      const data = await getDevActivityLog({ eventType: eventType as any, limit: 200 });
      setLogs(data);
    } catch { setLogs([]); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0f3460]"
        >
          <option value="">All Events</option>
          <option value="login_success">Login Success</option>
          <option value="login_failed">Login Failed</option>
          <option value="query_execution">Query Execution</option>
        </select>
        <span className="text-xs text-gray-500">{logs.length} entries</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-50 text-gray-500 sticky top-0">
              <th className="text-left px-3 py-2 font-medium">Event</th>
              <th className="text-left px-3 py-2 font-medium">Actor</th>
              <th className="text-left px-3 py-2 font-medium">Payload</th>
              <th className="text-left px-3 py-2 font-medium">Date</th>
            </tr></thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-1.5">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      log.event_type === "login_failed" ? "bg-red-100 text-red-700" :
                      log.event_type === "login_success" ? "bg-green-100 text-green-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>{log.event_type}</span>
                  </td>
                  <td className="px-3 py-1.5 text-gray-600 font-mono">{log.actor_email || log.actor_id || "—"}</td>
                  <td className="px-3 py-1.5 text-gray-700 max-w-[400px] truncate">{log.payload?.slice(0, 120) || "—"}</td>
                  <td className="px-3 py-1.5 text-gray-500 whitespace-nowrap">{new Date(log.executed_at).toLocaleString()}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={4} className="px-3 py-8 text-center text-gray-400">{loading ? "Loading..." : "No activity entries found."}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DeveloperToolsPage() {
  const [tab, setTab] = useState<"query" | "bugs" | "errors">("query");
  const [presets, setPresets] = useState<QueryPreset[]>([]);
  const [totalPresets, setTotalPresets] = useState(0);
  const [sql, setSql] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState("");
  const [queryLoading, setQueryLoading] = useState(false);
  const [presetSearch, setPresetSearch] = useState("");
  const [presetCategory, setPresetCategory] = useState("");
  const [showAllModal, setShowAllModal] = useState(false);
  const [allPresets, setAllPresets] = useState<QueryPreset[]>([]);
  const [allTotal, setAllTotal] = useState(0);
  const [allPage, setAllPage] = useState(1);
  const [editingPreset, setEditingPreset] = useState<QueryPreset | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createSql, setCreateSql] = useState("");
  const [createCategory, setCreateCategory] = useState("viewing");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [maintenanceData, setMaintenanceData] = useState<TableMaintenanceRow[]>([]);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const [bugData, setBugData] = useState<DevErrorSummary | null>(null);

  const loadPresets = useCallback(async () => {
    try {
      const data = await getDevQueryPresets({ category: presetCategory || undefined, search: presetSearch || undefined });
      setPresets(data.presets);
      setTotalPresets(data.totalPresets);
    } catch { setPresets([]); }
  }, [presetCategory, presetSearch]);

  useEffect(() => { loadPresets(); }, [loadPresets]);

  const runQuery = async (q?: string) => {
    const query = q ?? sql;
    if (!query.trim()) return;
    setQueryLoading(true);
    setQueryError("");
    setResult(null);
    try {
      const res = await postDevQuery(query, selectedPresetId ?? undefined);
      setResult(res);
    } catch (err: any) {
      setQueryError(err.response?.data?.message || err.message || "Query failed");
    } finally { setQueryLoading(false); }
  };

  const selectPreset = (p: QueryPreset) => {
    setSql(p.query_string);
    setSelectedPresetId(p.id);
    setResult(null);
    setQueryError("");
  };

  const downloadCsv = () => {
    if (!result || !result.rows.length) return;
    const headers = result.fields.join(",");
    const rows = result.rows.map((r) => result.fields.map((f) => JSON.stringify(r[f] ?? "")).join(",")).join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "query-result.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const loadAllPresets = async (page = 1) => {
    try {
      const data = await getAllDevQueryPresets({ category: presetCategory || undefined, search: presetSearch || undefined, page: String(page), limit: "20" });
      setAllPresets(data.presets); setAllTotal(data.total); setAllPage(data.page);
    } catch { setAllPresets([]); }
  };

  const openAllModal = () => { setShowAllModal(true); loadAllPresets(1); };

  const handleCreatePreset = async () => {
    if (!createTitle.trim() || !createSql.trim()) { toast.error("Title and SQL are required"); return; }
    try {
      await createDevQueryPreset({ title: createTitle, query_string: createSql, category: createCategory });
      toast.success("Preset created");
      setShowCreateModal(false); setCreateTitle(""); setCreateSql(""); setCreateCategory("viewing");
      loadPresets();
    } catch (err: any) { toast.error(err.response?.data?.message || "Failed to create preset"); }
  };

  const handleUpdatePreset = async () => {
    if (!editingPreset) return;
    try {
      await updateDevQueryPreset(editingPreset.id, { title: editingPreset.title, query_string: editingPreset.query_string, category: editingPreset.category });
      toast.success("Preset updated");
      setEditingPreset(null); loadPresets();
    } catch (err: any) { toast.error(err.response?.data?.message || "Failed to update preset"); }
  };

  const handleDeletePreset = async (id: string) => {
    if (!confirm("Delete this preset?")) return;
    try { await deleteDevQueryPreset(id); toast.success("Preset deleted"); loadPresets(); } catch { toast.error("Failed to delete"); }
  };

  const loadMaintenance = async () => {
    setMaintenanceLoading(true);
    try { const data = await getDevMaintenanceStatus(); setMaintenanceData(data); } catch { setMaintenanceData([]); }
    finally { setMaintenanceLoading(false); }
  };

  useEffect(() => { if (tab === "query") loadMaintenance(); }, [tab]);

  const loadBugs = useCallback(async () => {
    try { const data = await getDevErrors(); setBugData(data); } catch { setBugData(null); }
  }, []);
  useEffect(() => { if (tab === "bugs") loadBugs(); }, [tab, loadBugs]);

  const severityColor = (level: string) => {
    switch (level) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-orange-600 bg-orange-50 border-orange-200";
      case "low": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const categoryBadge = (cat: string) => {
    const c = CATEGORIES.find((c) => c.value === cat);
    return <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${c?.color || "bg-gray-100 text-gray-700"}`}>{c?.label || cat}</span>;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3">
        {([{ k: "query", l: "Query Editor & Maintenance" }, { k: "bugs", l: "Bug Dashboard" }, { k: "errors", l: "Error Log" }] as const).map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === t.k ? "bg-[#0f3460] text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >{t.l}</button>
        ))}
      </div>

      {tab === "query" && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Left: Presets + Maintenance */}
          <div className="xl:col-span-2 space-y-4">
            {/* Presets Panel */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-sm text-gray-800">Query Presets</h3>
                <div className="flex gap-2">
                  <button onClick={() => setShowCreateModal(true)}
                    className="text-[11px] px-2.5 py-1 bg-[#0f3460] text-white rounded-md hover:bg-[#16213e]"
                  >+ New</button>
                  <button onClick={openAllModal}
                    className="text-[11px] px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                  >View All ({totalPresets})</button>
                </div>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex gap-2">
                  <input value={presetSearch} onChange={(e) => setPresetSearch(e.target.value)} placeholder="Search presets..."
                    className="flex-1 text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0f3460]" />
                  <select value={presetCategory} onChange={(e) => setPresetCategory(e.target.value)}
                    className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0f3460]">
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1 max-h-[320px] overflow-y-auto">
                  {presets.map((p) => (
                    <div key={p.id}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs transition-colors ${selectedPresetId === p.id ? "bg-[#e8f0fe] border border-[#0f3460]" : "hover:bg-gray-50 border border-transparent"}`}
                      onClick={() => selectPreset(p)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 truncate">{p.title}</div>
                        <div className="flex gap-1.5 mt-0.5">
                          {categoryBadge(p.category)}
                          {p.is_system_preset ? <span className="text-[10px] text-gray-400">system</span> : <span className="text-[10px] text-blue-500">custom</span>}
                        </div>
                      </div>
                      {!p.is_system_preset && (
                        <div className="flex gap-1 shrink-0">
                          <button onClick={(e) => { e.stopPropagation(); setEditingPreset({ ...p }); }}
                            className="text-gray-400 hover:text-blue-600 p-0.5">✎</button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeletePreset(p.id); }}
                            className="text-gray-400 hover:text-red-600 p-0.5">✕</button>
                        </div>
                      )}
                    </div>
                  ))}
                  {presets.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No presets found</p>}
                </div>
              </div>
            </div>

            {/* Maintenance Info Panel (read-only, actions via presets) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-sm text-gray-800">Table Health</h3>
                <button onClick={loadMaintenance}
                  className="text-[11px] px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                >{maintenanceLoading ? "Loading..." : "Refresh"}</button>
              </div>
              <div className="p-3 max-h-[280px] overflow-y-auto">
                {maintenanceLoading ? (
                  <p className="text-xs text-gray-400 text-center py-4">Loading...</p>
                ) : maintenanceData.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No data</p>
                ) : (
                  <table className="w-full text-xs">
                    <thead><tr className="text-gray-500 border-b">
                      <th className="text-left py-1.5 font-medium">Table</th>
                      <th className="text-right py-1.5 font-medium">Dead</th>
                      <th className="text-right py-1.5 font-medium">Size</th>
                      <th className="text-center py-1.5 font-medium">Health</th>
                    </tr></thead>
                    <tbody>
                      {maintenanceData.map((t) => (
                        <tr key={t.name} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-1.5 text-gray-800 font-medium">{t.name}</td>
                          <td className="py-1.5 text-right text-gray-600">{t.dead_tuples}</td>
                          <td className="py-1.5 text-right text-gray-600">{t.size}</td>
                          <td className="py-1.5 text-center">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                              t.health === "critical" ? "bg-red-100 text-red-700" :
                              t.health === "warning" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
                            }`}>{t.health}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="p-3 border-t border-gray-100">
                <p className="text-[11px] text-gray-500">Run <strong>VACUUM</strong>, <strong>ANALYZE</strong>, or <strong>VACUUM ANALYZE</strong> from the presets above (category: Altering / Updating).</p>
              </div>
            </div>
          </div>

          {/* Right: SQL Editor + Results */}
          <div className="xl:col-span-3 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-sm text-gray-800">SQL Query Editor</h3>
              </div>
              <div className="p-4 space-y-3">
                <textarea value={sql} onChange={(e) => setSql(e.target.value)} rows={8}
                  className="w-full font-mono text-xs p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0f3460] resize-y"
                  placeholder="Enter SQL query here or select a preset..." />
                <div className="flex gap-2">
                  <button onClick={() => runQuery()} disabled={queryLoading || !sql.trim()}
                    className="px-4 py-2 text-sm font-medium bg-[#0f3460] text-white rounded-lg hover:bg-[#16213e] disabled:opacity-50"
                  >{queryLoading ? "Running..." : "Run Query"}</button>
                  <button onClick={() => { setSql(""); setResult(null); setQueryError(""); setSelectedPresetId(null); }}
                    className="px-3 py-2 text-sm font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                  >Clear</button>
                  {result && result.rows.length > 0 && (
                    <button onClick={downloadCsv}
                      className="px-3 py-2 text-sm font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                    >Download CSV</button>
                  )}
                </div>
              </div>
            </div>

            {queryError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700 font-medium">Error: {queryError}</p>
              </div>
            )}

            {result && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <span className="text-xs text-gray-600 font-medium">{result.rowCount} row(s) returned</span>
                </div>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  {result.rows.length > 0 ? (
                    <table className="w-full text-xs">
                      <thead><tr className="bg-gray-100 text-gray-600">
                        {result.fields.map((f) => <th key={f} className="text-left px-3 py-2 font-medium whitespace-nowrap">{f}</th>)}
                      </tr></thead>
                      <tbody>
                        {result.rows.map((row, i) => (
                          <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                            {result.fields.map((f) => (
                              <td key={f} className="px-3 py-1.5 text-gray-700 whitespace-nowrap max-w-[250px] truncate">{String(row[f] ?? "")}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-6">Query executed successfully — no rows returned</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "bugs" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Total Errors", value: bugData?.totalErrors ?? 0, color: "text-red-600 bg-red-50 border-red-200" },
              { label: "High Severity", value: bugData?.severityBreakdown.high ?? 0, color: "text-red-700 bg-red-100 border-red-300" },
              { label: "Medium Severity", value: bugData?.severityBreakdown.medium ?? 0, color: "text-orange-600 bg-orange-50 border-orange-200" },
              { label: "Low Severity", value: bugData?.severityBreakdown.low ?? 0, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
              { label: "Login Failures", value: bugData?.loginFailures ?? 0, color: "text-purple-600 bg-purple-50 border-purple-200" },
            ].map((card) => (
              <div key={card.label} className={`p-4 rounded-xl border ${card.color}`}>
                <p className="text-[11px] font-medium opacity-75">{card.label}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Severity Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-800">Severity Breakdown</h3>
            </div>
            <div className="p-4">
              {bugData ? (
                <div className="flex gap-4">
                  {(["high", "medium", "low"] as const).map((level) => {
                    const count = bugData.severityBreakdown[level];
                    const total = bugData.totalErrors || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={level} className={`flex-1 p-3 rounded-lg border ${severityColor(level)}`}>
                        <p className="text-[11px] font-medium uppercase tracking-wider">{level}</p>
                        <p className="text-lg font-bold mt-1">{count} <span className="text-xs font-normal opacity-60">({pct}%)</span></p>
                      </div>
                    );
                  })}
                </div>
              ) : <p className="text-xs text-gray-400">Loading...</p>}
            </div>
          </div>

          {/* Error Sources */}
          {bugData && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-sm text-gray-800">Error Origins</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(bugData.sources).map(([key, val]) => (
                    <div key={key} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-[11px] font-medium text-gray-500 capitalize">{key}</p>
                      <p className="text-xs text-gray-700 mt-1">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Audit Errors */}
          {bugData && bugData.auditErrors.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-sm text-gray-800">Audit Errors</h3>
                <span className="text-[11px] text-gray-500">{bugData.auditErrors.length} entries</span>
              </div>
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead><tr className="bg-gray-50 text-gray-500">
                    <th className="text-left px-3 py-2 font-medium">Action</th>
                    <th className="text-left px-3 py-2 font-medium">Target</th>
                    <th className="text-left px-3 py-2 font-medium">Date</th>
                  </tr></thead>
                  <tbody>
                    {bugData.auditErrors.map((e, i) => (
                      <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-1.5 text-gray-800 font-medium">{e.action}</td>
                        <td className="px-3 py-1.5 text-gray-600">{e.target_type || "-"}</td>
                        <td className="px-3 py-1.5 text-gray-500">{new Date(e.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Query Errors + Banned Users */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bugData && bugData.queryErrors.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-sm text-gray-800">Query Execution Errors</h3>
                </div>
                <div className="max-h-[250px] overflow-y-auto p-3 space-y-2">
                  {bugData.queryErrors.map((e, i) => (
                    <div key={i} className="p-2 bg-red-50 rounded text-xs text-red-700">
                      <p className="font-mono truncate">{e.payload?.slice(0, 200)}</p>
                      <p className="text-[10px] text-red-500 mt-0.5">{new Date(e.executed_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {bugData && bugData.bannedUsers.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-sm text-gray-800">Banned Users</h3>
                </div>
                <div className="max-h-[250px] overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-gray-50 text-gray-500">
                      <th className="text-left px-3 py-2 font-medium">Email</th>
                      <th className="text-left px-3 py-2 font-medium">Banned Date</th>
                    </tr></thead>
                    <tbody>
                      {bugData.bannedUsers.map((u) => (
                        <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-1.5 text-gray-800">{u.email}</td>
                          <td className="px-3 py-1.5 text-gray-600">{new Date(u.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "errors" && <ErrorLogTab />}

      {/* Create Preset Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-sm text-gray-800 mb-4">Create Custom Preset</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Title</label>
                <input value={createTitle} onChange={(e) => setCreateTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0f3460]" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">SQL Query</label>
                <textarea value={createSql} onChange={(e) => setCreateSql(e.target.value)} rows={5}
                  className="w-full font-mono text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0f3460]" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Category</label>
                <select value={createCategory} onChange={(e) => setCreateCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0f3460]">
                  {CATEGORIES.filter((c) => c.value).map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleCreatePreset}
                  className="px-4 py-2 text-sm font-medium bg-[#0f3460] text-white rounded-lg hover:bg-[#16213e]"
                >Create</button>
                <button onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                >Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Preset Modal */}
      {editingPreset && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setEditingPreset(null)}>
          <div className="bg-white rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-sm text-gray-800 mb-4">Edit Preset</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Title</label>
                <input value={editingPreset.title} onChange={(e) => setEditingPreset({ ...editingPreset, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0f3460]" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">SQL Query</label>
                <textarea value={editingPreset.query_string} onChange={(e) => setEditingPreset({ ...editingPreset, query_string: e.target.value })} rows={5}
                  className="w-full font-mono text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0f3460]" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Category</label>
                <select value={editingPreset.category} onChange={(e) => setEditingPreset({ ...editingPreset, category: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0f3460]">
                  {CATEGORIES.filter((c) => c.value).map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleUpdatePreset}
                  className="px-4 py-2 text-sm font-medium bg-[#0f3460] text-white rounded-lg hover:bg-[#16213e]"
                >Save</button>
                <button onClick={() => setEditingPreset(null)}
                  className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                >Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View All Presets Modal */}
      {showAllModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setShowAllModal(false)}>
          <div className="bg-white rounded-xl p-6 w-[700px] max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-sm text-gray-800">All Presets ({allTotal})</h3>
              <button onClick={() => setShowAllModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {allPresets.map((p) => (
                <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-xs">
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-gray-800">{p.title}</span>
                    <div className="flex gap-1.5 mt-0.5">
                      {categoryBadge(p.category)}
                      <span className="text-[10px] text-gray-400">{p.is_system_preset ? "system" : "custom"}</span>
                      <span className="text-[10px] text-gray-400">used: {p.last_used_at ? new Date(p.last_used_at).toLocaleDateString() : "never"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {allTotal > 20 && (
              <div className="flex justify-center gap-2 mt-4">
                <button disabled={allPage <= 1} onClick={() => loadAllPresets(allPage - 1)}
                  className="px-3 py-1 text-xs bg-gray-100 rounded disabled:opacity-50">Prev</button>
                <span className="text-xs text-gray-500 py-1">Page {allPage}</span>
                <button onClick={() => loadAllPresets(allPage + 1)}
                  className="px-3 py-1 text-xs bg-gray-100 rounded">Next</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
