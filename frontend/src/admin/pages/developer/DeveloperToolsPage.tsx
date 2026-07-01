import { useState, useEffect, useCallback } from "react";
import {
  getDevQueryPresets, getAllDevQueryPresets, createDevQueryPreset, updateDevQueryPreset, deleteDevQueryPreset,
  postDevQuery, getDevMaintenanceStatus, getDevActivityLog, getDevQueryHistory,
  QueryPreset, QueryResult, TableMaintenanceRow, ActivityLogEntry, QueryHistoryEntry,
} from "../../services/developerService";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "", label: "All Categories", color: "bg-gray-100 text-gray-700" },
  { value: "viewing", label: "Viewing (Read)", color: "bg-blue-100 text-blue-700" },
  { value: "altering", label: "Maintenance", color: "bg-orange-100 text-orange-700" },
  { value: "updating", label: "Analyze", color: "bg-purple-100 text-purple-700" },
];

function categoryBadge(cat: string) {
  const c = CATEGORIES.find((c) => c.value === cat);
  return <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${c?.color || "bg-gray-100 text-gray-700"}`}>{c?.label || cat}</span>;
}

/* ───── Error Log Tab (only login_failed) ───── */
function ErrorLogTab() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDevActivityLog({ eventType: "login_failed", limit: 200 });
      setLogs(data);
    } catch { setLogs([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#64748b]">Failed login attempts — {logs.length} entries</p>
        <button onClick={load} className="text-[12px] px-3 py-1.5 rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50" disabled={loading}>Refresh</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 sticky top-0">
                <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wider">Actor</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wider">Payload</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 text-[13px] text-[#ba1a1a] font-mono">{log.actor_email || log.actor_id || "—"}</td>
                  <td className="px-4 py-2 text-[13px] text-[#374151] max-w-[500px] truncate">{log.payload?.slice(0, 200) || "—"}</td>
                  <td className="px-4 py-2 text-[13px] text-[#64748b] whitespace-nowrap">{new Date(log.executed_at).toLocaleString()}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-10 text-center text-[13px] text-[#94a3b8]">{loading ? "Loading..." : "No login failures found."}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───── Main Page ───── */
export default function DeveloperToolsPage() {
  const [tab, setTab] = useState<"db" | "errors" | "health">("db");

  // Database Tools state
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

  // Query History
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<QueryHistoryEntry[]>([]);
  const [historySearch, setHistorySearch] = useState("");

  // Table Health state
  const [maintenanceData, setMaintenanceData] = useState<TableMaintenanceRow[]>([]);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

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

  const loadHistory = async () => {
    try {
      const data = await getDevQueryHistory(100);
      setHistory(data);
    } catch { setHistory([]); }
  };

  const recallQuery = (entry: QueryHistoryEntry) => {
    if (entry.payload) {
      setSql(entry.payload);
      setResult(null);
      setQueryError("");
      toast.success("Query recalled from history.");
    }
  };

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

  useEffect(() => { if (tab === "health") loadMaintenance(); }, [tab]);

  const filteredHistory = history.filter((h) =>
    !historySearch || (h.payload ?? "").toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#e2e8f0] pb-3">
        {([{ k: "db", l: "Database Tools" }, { k: "errors", l: "Error Log" }, { k: "health", l: "Table Health" }] as const).map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`px-4 py-2 text-[13px] font-medium rounded-t-lg transition-colors ${tab === t.k ? "bg-[#006e2f] text-white" : "text-[#64748b] hover:bg-gray-100"}`}
          >{t.l}</button>
        ))}
      </div>

      {/* ───── Database Tools Tab ───── */}
      {tab === "db" && (
        <div className="space-y-4">
          {/* Equal split: Editor + Presets */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* SQL Editor */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-[14px] text-[#0b1c30]">SQL Editor</h3>
                <div className="flex gap-2">
                  <button onClick={() => runQuery()} disabled={queryLoading || !sql.trim()}
                    className="px-4 py-1.5 text-[13px] font-medium bg-[#006e2f] text-white rounded-lg hover:bg-[#16213e] disabled:opacity-50"
                  >{queryLoading ? "Running..." : "Run Query"}</button>
                  <button onClick={() => { setSql(""); setResult(null); setQueryError(""); setSelectedPresetId(null); }}
                    className="px-3 py-1.5 text-[13px] font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Clear</button>
                  {result && result.rows.length > 0 && (
                    <button onClick={downloadCsv}
                      className="px-3 py-1.5 text-[13px] font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100">CSV</button>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex gap-2">
                  <select value="" onChange={(e) => { const idx = parseInt(e.target.value); if (!isNaN(idx)) recallQuery(filteredHistory[idx]); e.target.value = ""; }}
                    className="flex-1 text-[13px] px-3 py-1.5 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#006e2f] bg-white">
                    <option value="">Query History</option>
                    {filteredHistory.map((h, i) => (
                      <option key={h.id} value={i}>{(h.payload ?? "").slice(0, 80)}{(h.payload ?? "").length > 80 ? "…" : ""} — {new Date(h.executed_at).toLocaleString()}</option>
                    ))}
                  </select>
                  <input value={historySearch} onChange={(e) => { setHistorySearch(e.target.value); if (!historyOpen) { setHistoryOpen(true); loadHistory(); } }}
                    placeholder="Search history..." className="w-48 text-[13px] px-3 py-1.5 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#006e2f]" />
                </div>
                <textarea value={sql} onChange={(e) => setSql(e.target.value)} rows={8}
                  className="w-full font-mono text-[14px] p-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#006e2f] resize-y leading-relaxed"
                  placeholder="Enter SQL query here or select a preset..." />
              </div>
            </div>

            {/* Query Presets */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-[14px] text-[#0b1c30]">Query Presets</h3>
                <div className="flex gap-2">
                  <button onClick={() => setShowCreateModal(true)}
                    className="text-[12px] px-3 py-1.5 bg-[#006e2f] text-white rounded-lg hover:bg-[#16213e]">+ New</button>
                  <button onClick={() => { setShowAllModal(true); loadAllPresets(1); }}
                    className="text-[12px] px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">View All ({totalPresets})</button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex gap-2">
                  <input value={presetSearch} onChange={(e) => setPresetSearch(e.target.value)} placeholder="Search presets..."
                    className="flex-1 text-[13px] px-3 py-1.5 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#006e2f]" />
                  <select value={presetCategory} onChange={(e) => setPresetCategory(e.target.value)}
                    className="text-[13px] px-2 py-1.5 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#006e2f]">
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1 max-h-[360px] overflow-y-auto">
                  {presets.map((p) => (
                    <div key={p.id}
                      className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer text-[13px] transition-colors ${selectedPresetId === p.id ? "bg-[#e8f0fe] border border-[#006e2f]" : "hover:bg-gray-50 border border-transparent"}`}
                      onClick={() => selectPreset(p)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[#0b1c30] truncate">{p.title}</div>
                        <div className="flex gap-1.5 mt-0.5">
                          {categoryBadge(p.category)}
                          {p.is_system_preset ? <span className="text-[11px] text-gray-400">system</span> : <span className="text-[11px] text-blue-500">custom</span>}
                        </div>
                      </div>
                      {!p.is_system_preset && (
                        <div className="flex gap-1 shrink-0">
                          <button onClick={(e) => { e.stopPropagation(); setEditingPreset({ ...p }); }}
                            className="text-gray-400 hover:text-blue-600 p-0.5 text-[14px]">✎</button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeletePreset(p.id); }}
                            className="text-gray-400 hover:text-red-600 p-0.5 text-[14px]">✕</button>
                        </div>
                      )}
                    </div>
                  ))}
                  {presets.length === 0 && <p className="text-[13px] text-[#94a3b8] text-center py-4">No presets found</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Full-width Results */}
          {queryError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-[14px] text-red-700 font-medium">Error: {queryError}</p>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <span className="text-[13px] text-[#64748b] font-medium">{result.rowCount} row(s) returned in {result.duration}ms</span>
              </div>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                {result.rows.length > 0 ? (
                  <table className="w-full text-[13px]">
                    <thead><tr className="bg-gray-100 text-[#64748b]">
                      {result.fields.map((f) => <th key={f} className="text-left px-4 py-2.5 font-semibold whitespace-nowrap">{f}</th>)}
                    </tr></thead>
                    <tbody>
                      {result.rows.map((row, i) => (
                        <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                          {result.fields.map((f) => (
                            <td key={f} className="px-4 py-2 text-[13px] text-[#374151] whitespace-nowrap max-w-[300px] truncate">{String(row[f] ?? "")}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-[13px] text-[#94a3b8] text-center py-8">Query executed successfully — no rows returned</p>
                )}
              </div>
            </div>
          )}


        </div>
      )}

      {/* ───── Error Log Tab ───── */}
      {tab === "errors" && <ErrorLogTab />}

      {/* ───── Activity Log Tab ───── */}
      {tab === "activity" && <ActivityLogTab />}

      {/* ───── Table Health Tab ───── */}
      {tab === "health" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-[#0b1c30]">Table Health</h2>
              <p className="text-[13px] text-[#64748b] mt-1">
                Monitor table size, dead tuples, and maintenance status from PostgreSQL statistics.
              </p>
            </div>
            <button onClick={loadMaintenance} disabled={maintenanceLoading}
              className="px-4 py-1.5 text-[13px] font-medium bg-[#006e2f] text-white rounded-lg hover:bg-[#005a26] disabled:opacity-50"
            >{maintenanceLoading ? "Refreshing..." : "Refresh"}</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { label: "Tables", value: maintenanceData.length, color: "border-gray-200 bg-white text-gray-900" },
              { label: "Good", value: maintenanceData.filter((t) => t.health === "good").length, color: "border-green-200 bg-green-50 text-green-700" },
              { label: "Warning", value: maintenanceData.filter((t) => t.health === "warning").length, color: "border-orange-200 bg-orange-50 text-orange-700" },
              { label: "Critical", value: maintenanceData.filter((t) => t.health === "critical").length, color: "border-red-200 bg-red-50 text-red-700" },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl border p-4 ${item.color}`}>
                <p className="text-[11px] font-semibold uppercase tracking-widest opacity-70">{item.label}</p>
                <p className="mt-1 text-2xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-gray-50 text-[#64748b]">
                    <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">Table</th>
                    <th className="text-right px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">Dead Tuples</th>
                    <th className="text-right px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">Size</th>
                    <th className="text-center px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">Health</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceLoading ? (
                    <tr><td colSpan={4} className="px-4 py-10 text-center text-[13px] text-[#94a3b8]">Loading table health...</td></tr>
                  ) : maintenanceData.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-10 text-center text-[13px] text-[#94a3b8]">No table health data available.</td></tr>
                  ) : (
                    maintenanceData.map((t, i) => (
                      <tr key={`${t.name}-${i}`} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-[#0b1c30]">{t.name}</td>
                        <td className="px-4 py-3 text-right text-[#64748b]">{t.dead_tuples}</td>
                        <td className="px-4 py-3 text-right text-[#64748b]">{t.size}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                            t.health === "critical" ? "bg-red-100 text-red-700" :
                            t.health === "warning" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
                          }`}>{t.health}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-[12px] text-[#94a3b8]">Maintenance actions can be run through query presets in Database Tools.</p>
        </div>
      )}

      {/* ───── Modals ───── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-[14px] text-[#0b1c30] mb-4">Create Custom Preset</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[13px] font-medium text-[#64748b]">Title</label>
                <input value={createTitle} onChange={(e) => setCreateTitle(e.target.value)}
                  className="w-full text-[13px] px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#006e2f]" />
              </div>
              <div>
                <label className="text-[13px] font-medium text-[#64748b]">SQL Query</label>
                <textarea value={createSql} onChange={(e) => setCreateSql(e.target.value)} rows={5}
                  className="w-full font-mono text-[13px] px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#006e2f]" />
              </div>
              <div>
                <label className="text-[13px] font-medium text-[#64748b]">Category</label>
                <select value={createCategory} onChange={(e) => setCreateCategory(e.target.value)}
                  className="w-full text-[13px] px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#006e2f]">
                  {CATEGORIES.filter((c) => c.value).map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleCreatePreset}
                  className="px-4 py-2 text-[13px] font-medium bg-[#006e2f] text-white rounded-lg hover:bg-[#16213e]">Create</button>
                <button onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-[13px] font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingPreset && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setEditingPreset(null)}>
          <div className="bg-white rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-[14px] text-[#0b1c30] mb-4">Edit Preset</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[13px] font-medium text-[#64748b]">Title</label>
                <input value={editingPreset.title} onChange={(e) => setEditingPreset({ ...editingPreset, title: e.target.value })}
                  className="w-full text-[13px] px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#006e2f]" />
              </div>
              <div>
                <label className="text-[13px] font-medium text-[#64748b]">SQL Query</label>
                <textarea value={editingPreset.query_string} onChange={(e) => setEditingPreset({ ...editingPreset, query_string: e.target.value })} rows={5}
                  className="w-full font-mono text-[13px] px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#006e2f]" />
              </div>
              <div>
                <label className="text-[13px] font-medium text-[#64748b]">Category</label>
                <select value={editingPreset.category} onChange={(e) => setEditingPreset({ ...editingPreset, category: e.target.value })}
                  className="w-full text-[13px] px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#006e2f]">
                  {CATEGORIES.filter((c) => c.value).map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleUpdatePreset}
                  className="px-4 py-2 text-[13px] font-medium bg-[#006e2f] text-white rounded-lg hover:bg-[#16213e]">Save</button>
                <button onClick={() => setEditingPreset(null)}
                  className="px-4 py-2 text-[13px] font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAllModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowAllModal(false)}>
          <div className="bg-white rounded-xl p-6 w-[700px] max-h-[80vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[14px] text-[#0b1c30]">All Presets ({allTotal})</h3>
              <button onClick={() => setShowAllModal(false)} className="text-gray-400 hover:text-gray-600 text-[16px]">✕</button>
            </div>
            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {allPresets.map((p) => (
                <div key={p.id} className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-50 text-[13px]">
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-[#0b1c30]">{p.title}</span>
                    <div className="flex gap-1.5 mt-0.5">
                      {categoryBadge(p.category)}
                      <span className="text-[11px] text-gray-400">{p.is_system_preset ? "system" : "custom"}</span>
                      <span className="text-[11px] text-gray-400">used: {p.last_used_at ? new Date(p.last_used_at).toLocaleDateString() : "never"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {allTotal > 20 && (
              <div className="flex justify-center gap-2 mt-4">
                <button disabled={allPage <= 1} onClick={() => loadAllPresets(allPage - 1)}
                  className="px-3 py-1 text-[13px] bg-gray-100 rounded disabled:opacity-50">Prev</button>
                <span className="text-[13px] text-[#94a3b8] py-1">Page {allPage}</span>
                <button onClick={() => loadAllPresets(allPage + 1)}
                  className="px-3 py-1 text-[13px] bg-gray-100 rounded">Next</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
