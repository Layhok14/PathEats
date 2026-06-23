import { useEffect, useState, useRef } from "react";
import { Terminal, Database, Bug, Play, RotateCcw, Search, ChevronDown, AlertTriangle, CheckCircle, XCircle, Download } from "lucide-react";
import { toast } from "sonner";
import {
  getDevQueryPresets, postDevQuery,
  getDevMaintenanceStatus, postDevVacuum, postDevAnalyze,
  getDevErrors,
  type QueryPreset, type QueryResult, type TableMaintenanceRow, type DevErrorSummary,
} from "../../services/developerService";

type ToolsTab = "query" | "maintenance" | "bugs";

function formatDate(value: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function DeveloperToolsPage() {
  const [tab, setTab] = useState<ToolsTab>("query");

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#0b1c30]">Database Tools</h1>
          <p className="text-[14px] text-[#64748b] mt-1">Query the database, perform maintenance, and track issues.</p>
        </div>

        <div className="flex gap-1 border-b border-[#e2e8f0]">
          {([
            { key: "query" as ToolsTab, label: "Query Editor", icon: <Terminal size={15} /> },
            { key: "maintenance" as ToolsTab, label: "Maintenance", icon: <Database size={15} /> },
            { key: "bugs" as ToolsTab, label: "Bug Tracking", icon: <Bug size={15} /> },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-[13px] font-medium rounded-t-lg transition-all ${
                tab === t.key
                  ? "bg-white text-[#006e2f] border border-b-white border-[#e2e8f0] -mb-px"
                  : "text-[#64748b] hover:text-[#0b1c30] hover:bg-gray-50"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === "query" && <QueryEditorSection />}
        {tab === "maintenance" && <MaintenanceSection />}
        {tab === "bugs" && <BugTrackingSection />}
      </div>
    </div>
  );
}

function QueryEditorSection() {
  const [presets, setPresets] = useState<QueryPreset[]>([]);
  const [sql, setSql] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getDevQueryPresets().then(setPresets).catch(() => {});
  }, []);

  const handlePresetSelect = (preset: QueryPreset) => {
    setSql(preset.sql);
    setSelectedPreset(preset.name);
    setShowPresets(false);
    setResult(null);
    setError("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleRun = async () => {
    if (!sql.trim()) {
      toast.error("Enter a SQL query first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await postDevQuery(sql);
      setResult(res);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Query execution failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSql("");
    setResult(null);
    setError("");
    setSelectedPreset("");
  };

  const filteredPresets = presets.filter((p) =>
    !selectedPreset || p.name.toLowerCase().includes(selectedPreset.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-semibold text-[#0b1c30]">SQL Query</h2>
          <div className="relative">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-2 px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50"
            >
              <ChevronDown size={14} /> {selectedPreset || "Select a preset query..."}
            </button>
            {showPresets && (
              <div className="absolute right-0 top-full mt-1 w-[420px] bg-white border border-[#e2e8f0] rounded-xl shadow-lg z-20 max-h-[320px] overflow-y-auto">
                {filteredPresets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => handlePresetSelect(p)}
                    className="w-full text-left px-4 py-3 border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors last:border-0"
                  >
                    <p className="text-[13px] font-medium text-[#0b1c30]">{p.name}</p>
                    <p className="text-[11px] text-[#94a3b8]">{p.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <textarea
          ref={textareaRef}
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          placeholder={`Enter a SELECT or WITH query...\n\nExample:\nSELECT * FROM users LIMIT 10;`}
          className="w-full border border-[#e2e8f0] rounded-lg p-4 text-[13px] font-mono outline-none focus:border-[#006e2f] resize-y"
          style={{ minHeight: "150px", background: "#fafbfc" }}
          spellCheck={false}
        />

        <div className="flex items-center justify-between mt-4">
          <button onClick={handleClear} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#64748b] hover:bg-gray-50">
            <RotateCcw size={13} /> Clear
          </button>
          <button
            onClick={handleRun}
            disabled={loading || !sql.trim()}
            className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50"
          >
            <Play size={14} /> {loading ? "Running..." : "Run Query"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-8 text-center text-[13px] text-[#94a3b8]">
          <div className="w-5 h-5 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Executing query...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-[#fde68a] bg-[#fffbeb] px-5 py-4 text-[13px] text-[#92400e]">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Query Error</p>
              <p className="mt-0.5 font-mono text-[12px]">{error}</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-[#f1f5f9] flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-[#0b1c30]">
              Results <span className="text-[12px] font-normal text-[#64748b]">({result.rowCount} row{result.rowCount !== 1 ? "s" : ""})</span>
            </h2>
            <button
              onClick={() => {
                const csv = [
                  result.fields.join(","),
                  ...result.rows.map((r) => result.fields.map((f) => JSON.stringify(r[f] ?? "")).join(",")),
                ].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "query-results.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50"
            >
              <Download size={13} /> Export CSV
            </button>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-[#f8fafc] sticky top-0">
                  {result.fields.map((f) => (
                    <th key={f} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b] whitespace-nowrap">{f}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row, i) => (
                  <tr key={i} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    {result.fields.map((f) => (
                      <td key={f} className="px-4 py-2 text-[12px] text-[#374151] max-w-[300px] truncate font-mono" title={String(row[f] ?? "")}>
                        {row[f] != null ? String(row[f]) : <span className="text-[#94a3b8] italic">NULL</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function MaintenanceSection() {
  const [tables, setTables] = useState<TableMaintenanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [runningAction, setRunningAction] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getDevMaintenanceStatus();
      setTables(data);
    } catch {
      toast.error("Could not load maintenance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleVacuum = async (table: string) => {
    setRunningAction(`vacuum-${table}`);
    try {
      const res = await postDevVacuum(table);
      setActionMsg(res.message);
      await loadData();
    } catch {
      toast.error(`VACUUM failed on "${table}".`);
    } finally {
      setRunningAction(null);
    }
  };

  const handleAnalyze = async (table: string) => {
    setRunningAction(`analyze-${table}`);
    try {
      const res = await postDevAnalyze(table);
      setActionMsg(res.message);
      await loadData();
    } catch {
      toast.error(`ANALYZE failed on "${table}".`);
    } finally {
      setRunningAction(null);
    }
  };

  const healthColor = (h: string) => {
    switch (h) {
      case "critical": return { bg: "bg-red-50", text: "text-[#ba1a1a]", dot: "bg-[#ba1a1a]" };
      case "warning": return { bg: "bg-amber-50", text: "text-[#b45309]", dot: "bg-[#f59e0b]" };
      default: return { bg: "bg-green-50", text: "text-[#006e2f]", dot: "bg-[#006e2f]" };
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {actionMsg && (
        <div className="rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-5 py-3 text-[13px] text-[#166534] flex items-center gap-2">
          <CheckCircle size={16} /> {actionMsg}
          <button onClick={() => setActionMsg(null)} className="ml-auto text-[#166534] hover:text-[#14532d]"><XCircle size={14} /></button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-[14px] text-[#64748b]">{loading ? "Loading..." : `${tables.length} table(s) monitored`}</p>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50"
        >
          <RotateCcw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-[13px] text-[#94a3b8]">
            <div className="w-5 h-5 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading maintenance data...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-[#f8fafc]">
                  {["Table", "Live Tuples", "Dead Tuples", "Dead %", "Size", "Health", "Last Vacuum", "Last Analyze", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tables.map((t) => {
                  const total = t.live_tuples + t.dead_tuples;
                  const deadPct = total > 0 ? ((t.dead_tuples / total) * 100).toFixed(1) : "0.0";
                  const colors = healthColor(t.health);
                  return (
                    <tr key={t.name} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                      <td className="px-4 py-3 text-[13px] font-medium text-[#0b1c30]">{t.name}</td>
                      <td className="px-4 py-3 text-[12px] text-[#374151]">{t.live_tuples.toLocaleString()}</td>
                      <td className="px-4 py-3 text-[12px] text-[#374151]">{t.dead_tuples.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[12px] font-semibold ${deadPct === "0.0" ? "text-[#006e2f]" : Number(deadPct) > 5 ? "text-[#ba1a1a]" : "text-[#b45309]"}`}>{deadPct}%</span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#64748b] font-mono">{t.size}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${colors.bg} ${colors.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                          {t.health === "critical" ? "Critical" : t.health === "warning" ? "Warning" : "Good"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-[#64748b]">{t.last_vacuum ? formatDate(t.last_vacuum) : t.last_autovacuum ? `Auto: ${formatDate(t.last_autovacuum)}` : "Never"}</td>
                      <td className="px-4 py-3 text-[11px] text-[#64748b]">{t.last_analyze ? formatDate(t.last_analyze) : t.last_autoanalyze ? `Auto: ${formatDate(t.last_autoanalyze)}` : "Never"}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleVacuum(t.name)}
                            disabled={runningAction === `vacuum-${t.name}`}
                            className="px-2 py-1 text-[11px] font-semibold rounded bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50"
                          >
                            {runningAction === `vacuum-${t.name}` ? "..." : "VACUUM"}
                          </button>
                          <button
                            onClick={() => handleAnalyze(t.name)}
                            disabled={runningAction === `analyze-${t.name}`}
                            className="px-2 py-1 text-[11px] font-semibold rounded bg-[#005ac2] text-white hover:bg-[#004d9e] disabled:opacity-50"
                          >
                            {runningAction === `analyze-${t.name}` ? "..." : "ANALYZE"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {tables.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-[13px] text-[#94a3b8]">No table data available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function BugTrackingSection() {
  const [data, setData] = useState<DevErrorSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const d = await getDevErrors();
      setData(d);
    } catch {
      toast.error("Could not load error summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-[14px] text-[#64748b]">Insights from audit logs, errors, and banned accounts.</p>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50"
        >
          <RotateCcw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-10 text-center text-[13px] text-[#94a3b8]">
          <div className="w-5 h-5 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading error summary...
        </div>
      ) : !data ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-10 text-center text-[13px] text-[#94a3b8]">No data available.</div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Audit Errors</p>
              <p className="text-[28px] font-bold text-[#0b1c30] mt-1">{data.totalErrors}</p>
              <p className="text-[12px] text-[#94a3b8] mt-0.5">Failed actions from audit_log</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Banned Accounts</p>
              <p className="text-[28px] font-bold text-[#ba1a1a] mt-1">{data.totalBanned}</p>
              <p className="text-[12px] text-[#94a3b8] mt-0.5">Users with is_banned = true</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Health Score</p>
              <p className={`text-[28px] font-bold mt-1 ${data.totalErrors === 0 && data.totalBanned === 0 ? "text-[#006e2f]" : "text-[#b45309]"}`}>
                {data.totalErrors === 0 && data.totalBanned === 0 ? "Good" : "Needs Review"}
              </p>
              <p className="text-[12px] text-[#94a3b8] mt-0.5">Based on errors + banned ratio</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-[#f1f5f9]">
                <h2 className="text-[14px] font-semibold text-[#0b1c30]">Audit Errors / Failures</h2>
                <p className="text-[11px] text-[#94a3b8]">Recent problematic actions from the audit log.</p>
              </div>
              {data.auditErrors.length === 0 ? (
                <div className="px-5 py-8 text-center text-[13px] text-[#94a3b8]">
                  <CheckCircle size={20} className="mx-auto mb-2 text-[#006e2f]" />
                  No error actions recorded.
                </div>
              ) : (
                <div className="divide-y divide-[#f1f5f9] max-h-[300px] overflow-y-auto">
                  {data.auditErrors.map((e, i) => (
                    <div key={i} className="px-5 py-3 hover:bg-[#f8fafc] transition-colors">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={13} className="text-[#b45309] shrink-0" />
                        <span className="text-[12px] font-medium text-[#0b1c30]">{e.action}</span>
                        {e.target_type && <span className="text-[11px] text-[#94a3b8]">on {e.target_type}</span>}
                      </div>
                      {e.details && <p className="text-[11px] text-[#94a3b8] mt-0.5 truncate">{JSON.stringify(e.details)}</p>}
                      <p className="text-[10px] text-[#bec6e0] mt-0.5">{formatDate(e.created_at)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-[#f1f5f9]">
                <h2 className="text-[14px] font-semibold text-[#0b1c30]">Banned Users</h2>
                <p className="text-[11px] text-[#94a3b8]">Accounts flagged as banned in the system.</p>
              </div>
              {data.bannedUsers.length === 0 ? (
                <div className="px-5 py-8 text-center text-[13px] text-[#94a3b8]">
                  <CheckCircle size={20} className="mx-auto mb-2 text-[#006e2f]" />
                  No banned users.
                </div>
              ) : (
                <div className="divide-y divide-[#f1f5f9] max-h-[300px] overflow-y-auto">
                  {data.bannedUsers.map((u) => (
                    <div key={u.id} className="px-5 py-3 flex items-center justify-between hover:bg-[#f8fafc]">
                      <div>
                        <span className="text-[12px] text-[#0b1c30]">{u.email}</span>
                        <p className="text-[10px] text-[#94a3b8]">{formatDate(u.created_at)}</p>
                      </div>
                      <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-red-50 text-[#ba1a1a]">BANNED</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
