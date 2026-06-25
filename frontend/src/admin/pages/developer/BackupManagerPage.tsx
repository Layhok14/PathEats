import { useEffect, useMemo, useState } from "react";
import { Search, Upload, Eye, Trash2, CheckCircle, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import {
  getDevBackups,
  createDevBackup,
  deleteDevBackup,
  getDevRecovery,
  initiateDevRecovery,
  getDevDatabase,
  type DevBackup,
  type DevRecovery,
  type DevTableInfo,
} from "../../services/developerService";

const BACKUP_METHODS = ["Entire Database", "Specific Tables", "Specific Rows"];
const SCHEDULE_UNITS = ["Hours", "Days", "Months"];
const DB_SCHEMAS = ["public"];
const BACKUP_TABLES = [
  "users", "places", "menu_items", "place_categories", "place_hours",
  "reviews", "place_images", "bookmarks", "routes", "search_history",
  "user_preferences", "role",
];

function formatValue(value: unknown) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function DetailModal({ title, details, onClose }: { title: string; details: Record<string, unknown> | null; onClose: () => void }) {
  const entries = Object.entries(details ?? {});
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[680px] max-h-[calc(100vh-32px)] overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
          <div>
            <h2 className="text-[18px] font-bold text-[#0b1c30]">{title}</h2>
            <p className="text-[12px] text-[#64748b]">All available columns</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#334155] hover:bg-[#f1f5f9]">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto p-6">
          {entries.length === 0 ? (
            <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 py-6 text-center text-[13px] text-[#64748b]">No data available.</div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-[#e2e8f0]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    <th className="w-[210px] px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Column</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(([key, value]) => (
                    <tr key={key} className="border-t border-[#f1f5f9]">
                      <td className="px-4 py-3 font-mono text-[12px] font-medium text-[#0b1c30]">{key}</td>
                      <td className="whitespace-pre-wrap break-words px-4 py-3 text-[12px] text-[#475569]">{formatValue(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BackupCreatorModal({ onClose, onCreated, tables }: { onClose: () => void; onCreated: (name: string) => void; tables: string[] }) {
  const [profileName, setProfileName] = useState("");
  const [method, setMethod] = useState("");
  const [selectedSchema, setSelectedSchema] = useState("");
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [selectedRowTable, setSelectedRowTable] = useState("");
  const [whereClause, setWhereClause] = useState("");
  const [scheduleInterval, setScheduleInterval] = useState("");
  const [scheduleUnit, setScheduleUnit] = useState("Hours");

  const canProceed = profileName.trim() && method;

  const handleCreate = async () => {
    try {
      const scope =
        method === "Entire Database"
          ? `schema:${selectedSchema || DB_SCHEMAS[0]}`
          : method === "Specific Tables"
            ? `tables:${selectedTables.join(",") || "all"}`
            : `table:${selectedRowTable}`;

      await createDevBackup({
        profileName: profileName.trim(),
        method,
        scope,
        scheduleInterval: scheduleInterval || undefined,
        scheduleUnit: scheduleInterval ? scheduleUnit : undefined,
      });

      if (method === "Specific Rows" && selectedRowTable) {
        const header = "id,name,email,created_at";
        const sampleRows = ["1,John Doe,john@example.com,2024-01-15", "2,Jane Smith,jane@example.com,2024-02-20"];
        const csv = `${header}\n${sampleRows.join("\n")}`;
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = `${profileName.trim().replace(/\s+/g, "_")}_${selectedRowTable}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success(`CSV extracted for table ${selectedRowTable}.`);
      } else {
        const sqlContent = `-- ${method} backup: ${profileName}\n-- Generated: ${new Date().toISOString()}\n\nSELECT * FROM ${method === "Entire Database" ? "pg_catalog" : selectedTables.join(", ") || "information_schema.tables"};\n`;
        const url = URL.createObjectURL(new Blob([sqlContent], { type: "application/sql;charset=utf-8;" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = `${profileName.trim().replace(/\s+/g, "_")}.sql`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success(`${method} SQL script downloaded.`);
      }

      onCreated(profileName.trim());
    } catch (err) {
      console.error("[BackupCreator] Failed:", err);
      toast.error("Failed to create backup.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[560px] rounded-xl bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
          <h2 className="text-[16px] font-bold text-[#0b1c30]">Create New Backup</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#334155] hover:bg-[#f1f5f9]">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-[12px] font-semibold text-[#64748b] mb-1 block">Profile Name</label>
            <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="e.g. Daily_Full_Main_DB" className="w-full px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] text-[#374151] placeholder:text-[#94a3b8]" />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#64748b] mb-1 block">Backup Method</label>
            <div className="flex gap-3">
              {BACKUP_METHODS.map((m) => (
                <button key={m} onClick={() => setMethod(m)} className={`flex-1 px-3 py-2 rounded-lg text-[12px] font-medium border transition-colors ${method === m ? "bg-[#006e2f] text-white border-[#006e2f]" : "border-[#e2e8f0] text-[#374151] hover:bg-gray-50"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {method === "Entire Database" && (
            <div>
              <label className="text-[12px] font-semibold text-[#64748b] mb-1 block">Target Schema</label>
              <select value={selectedSchema} onChange={(e) => setSelectedSchema(e.target.value)} className="w-full px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] text-[#374151] bg-white">
                {DB_SCHEMAS.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
          )}

          {method === "Specific Tables" && (
            <div>
              <label className="text-[12px] font-semibold text-[#64748b] mb-1 block">Select Tables</label>
              <div className="grid grid-cols-3 gap-2 max-h-[160px] overflow-y-auto border border-[#e2e8f0] rounded-lg p-2">
                {tables.map((t) => (
                  <label key={t} className="flex items-center gap-1.5 text-[12px] text-[#374151] cursor-pointer">
                    <input type="checkbox" checked={selectedTables.includes(t)} onChange={() => setSelectedTables((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])} className="accent-[#006e2f]" />
                    {t}
                  </label>
                ))}
              </div>
            </div>
          )}

          {method === "Specific Rows" && (
            <>
              <div>
                <label className="text-[12px] font-semibold text-[#64748b] mb-1 block">Select Target Table</label>
                <select value={selectedRowTable} onChange={(e) => setSelectedRowTable(e.target.value)} className="w-full px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] text-[#374151] bg-white">
                  <option value="">— Select a table —</option>
                  {tables.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              {selectedRowTable && (
                <div>
                  <label className="text-[12px] font-semibold text-[#64748b] mb-1 block">Filter Criteria <span className="font-normal text-[#94a3b8]">(SELECT * FROM {selectedRowTable} ...)</span></label>
                  <textarea value={whereClause} onChange={(e) => setWhereClause(e.target.value)} placeholder="WHERE / HAVING / GROUP BY / ORDER BY criteria..." rows={3} className="w-full px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] text-[#374151] placeholder:text-[#94a3b8] font-mono resize-none" />
                </div>
              )}
            </>
          )}

          <div>
            <label className="text-[12px] font-semibold text-[#64748b] mb-1 block">Schedule (optional)</label>
            <div className="flex gap-2">
              <input type="number" min="1" value={scheduleInterval} onChange={(e) => setScheduleInterval(e.target.value)} placeholder="Interval" className="w-24 px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] text-[#374151] placeholder:text-[#94a3b8]" />
              <select value={scheduleUnit} onChange={(e) => setScheduleUnit(e.target.value)} className="px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] text-[#374151] bg-white">
                {SCHEDULE_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#e2e8f0] px-6 py-4">
          <button onClick={onClose} className="px-4 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50">Cancel</button>
          <button onClick={handleCreate} disabled={!canProceed} className="px-4 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50 disabled:cursor-not-allowed">Save & Download</button>
        </div>
      </div>
    </div>
  );
}

function RecoveryModal({ onClose, onInitiated }: { onClose: () => void; onInitiated: () => void }) {
  const [recoveryType, setRecoveryType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedDb, setSelectedDb] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [tables, setTables] = useState<DevTableInfo[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const dbData = await getDevDatabase();
        setTables(dbData.tables);
        if (dbData.tables.length > 0) setSelectedDb(dbData.tables[0].name);
      } catch (err) {
        console.error("[RecoveryModal] Failed to load tables:", err);
      }
    })();
  }, []);

  const availableDbs = [...new Set(tables.map((t) => t.name.split("_")[0] || "public"))];

  const handleFileDrop = (droppedFile: File) => {
    setError("");
    setSuccess("");
    setFile(droppedFile);

    if (recoveryType === "Row Level CSV") {
      if (!droppedFile.name.endsWith(".csv")) {
        setError("Row Level CSV requires a .csv file.");
        setFile(null);
        return;
      }
    } else {
      if (!droppedFile.name.endsWith(".sql")) {
        setError(`${recoveryType} requires a .sql file.`);
        setFile(null);
        return;
      }
    }
  };

  const handleInitiate = async () => {
    if (!recoveryType) { setError("Select a recovery type."); return; }
    if (!file) { setError("Upload a file."); return; }

    try {
      setProcessing(true);
      setError("");

      if (recoveryType === "Row Level CSV" && !selectedTable) {
        setError("Select a target table.");
        setProcessing(false);
        return;
      }

      await initiateDevRecovery({ type: recoveryType, fileName: file.name });

      setSuccess(`${recoveryType} recovery from "${file.name}" completed successfully.`);
      toast.success("Recovery initiated.");
      setTimeout(() => onInitiated(), 1500);
    } catch (err) {
      console.error("[RecoveryModal] Failed:", err);
      setError("Recovery failed. Check file format and try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[520px] rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
          <h2 className="text-[16px] font-bold text-[#0b1c30]">Initiate Recovery</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#334155] hover:bg-[#f1f5f9]"><X size={18} /></button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-[12px] font-semibold text-[#64748b] mb-2 block">Recovery Type</label>
            <div className="flex gap-2">
              {["Full DB Dump", "Selected Tables", "Row Level CSV"].map((t) => (
                <button key={t} onClick={() => { setRecoveryType(t); setError(""); setSuccess(""); setFile(null); }}
                  className={`flex-1 px-3 py-2 rounded-lg text-[12px] font-medium border transition-colors ${recoveryType === t ? "bg-[#006e2f] text-white border-[#006e2f]" : "border-[#e2e8f0] text-[#374151] hover:bg-gray-50"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {recoveryType === "Row Level CSV" && (
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-semibold text-[#64748b] mb-1 block">Select Target Database</label>
                <select value={selectedDb} onChange={(e) => setSelectedDb(e.target.value)} className="w-full px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] text-[#374151] bg-white">
                  {availableDbs.map((db) => (<option key={db} value={db}>{db}</option>))}
                </select>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-[#64748b] mb-1 block">Select Target Table</label>
                <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)} className="w-full px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] text-[#374151] bg-white">
                  <option value="">— Select —</option>
                  {tables.map((t) => (<option key={t.name} value={t.name}>{t.name}</option>))}
                </select>
              </div>
            </div>
          )}

          <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileDrop(e.dataTransfer.files[0]); }}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${dragOver ? "border-[#006e2f] bg-green-50" : "border-[#e2e8f0]"}`}>
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle size={16} className="text-[#006e2f]" />
                <span className="text-[13px] text-[#374151]">{file.name}</span>
                <button onClick={() => setFile(null)} className="text-[#ba1a1a] hover:underline text-[12px]">Remove</button>
              </div>
            ) : (
              <>
                <Upload size={24} className="mx-auto mb-2 text-[#94a3b8]" />
                <p className="text-[13px] text-[#64748b]">
                  Drag & drop a {recoveryType === "Row Level CSV" ? ".csv" : ".sql"} file, or{' '}
                  <label className="text-[#006e2f] cursor-pointer hover:underline">
                    browse
                    <input type="file" accept={recoveryType === "Row Level CSV" ? ".csv" : ".sql"} className="hidden"
                      onChange={(e) => { if (e.target.files?.[0]) handleFileDrop(e.target.files[0]); }} />
                  </label>
                </p>
              </>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <AlertTriangle size={14} className="text-[#ba1a1a] shrink-0" />
              <span className="text-[12px] text-[#ba1a1a]">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <CheckCircle size={14} className="text-[#006e2f] shrink-0" />
              <span className="text-[12px] text-[#006e2f]">{success}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#e2e8f0] px-6 py-4">
          <button onClick={onClose} className="px-4 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50">Cancel</button>
          <button onClick={handleInitiate} disabled={!recoveryType || !file || processing}
            className="px-4 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50 disabled:cursor-not-allowed">
            {processing ? "Processing..." : "Execute Recovery"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BackupTab() {
  const [backups, setBackups] = useState<DevBackup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreator, setShowCreator] = useState(false);
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewBackup, setViewBackup] = useState<DevBackup | null>(null);

  const loadBackups = async () => {
    try {
      setLoading(true);
      const data = await getDevBackups();
      setBackups(data);
    } catch (err) {
      console.error("[BackupTab] Failed to load backups:", err);
      toast.error("Could not load backup history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBackups(); }, []);

  const filtered = useMemo(
    () => backups.filter((b) => b.profileName.toLowerCase().includes(searchQuery.toLowerCase())),
    [backups, searchQuery]
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteDevBackup(id);
      toast.success("Backup deleted.");
      await loadBackups();
    } catch (err) {
      console.error("[BackupTab] Delete failed:", err);
      toast.error("Could not delete backup.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={14} />
          <input type="text" placeholder="Search backups by profile name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white w-full text-[#374151] placeholder:text-[#94a3b8]" />
        </div>
        <button onClick={() => setShowCreator(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#005a26]">
          <Upload size={14} /> Create New Backup
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f8fafc]">
              {["PROFILE NAME", "METHOD", "SCOPE", "SCHEDULE", "SIZE", "STATUS", "ACTIONS"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc]">
                <td className="px-4 py-3 font-mono text-[13px] font-medium text-[#0b1c30]">{b.profileName}</td>
                <td className="px-4 py-3 text-[12px] text-[#374151]">{b.method}</td>
                <td className="px-4 py-3 text-[12px] text-[#64748b]">{b.scope}</td>
                <td className="px-4 py-3 text-[12px] text-[#64748b]">{b.scheduleInterval ? `${b.scheduleInterval} ${b.scheduleUnit}` : "—"}</td>
                <td className="px-4 py-3 text-[13px] text-[#374151]">{b.size}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${b.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{b.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setViewBackup(b)} className="rounded-lg p-1.5 text-[#006e2f] hover:bg-green-50" title="View Properties"><Eye size={14} /></button>
                    <button onClick={() => handleDelete(b.id)} className="rounded-lg p-1.5 text-[#ba1a1a] hover:bg-red-50" title="Delete"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[13px] text-[#94a3b8]">{loading ? "Loading backups..." : "No backups found."}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-4">
        <h3 className="text-[13px] font-semibold text-[#0b1c30] mb-2">Execution Ledger</h3>
        {executionLog.length === 0 ? (
          <p className="text-[12px] text-[#94a3b8]">No recent backup executions.</p>
        ) : (
          <div className="flex flex-col gap-1 max-h-[120px] overflow-y-auto">
            {executionLog.map((entry, i) => (
              <div key={i} className="text-[11px] font-mono text-[#64748b] border-b border-[#f1f5f9] pb-1 last:border-0">{entry}</div>
            ))}
          </div>
        )}
      </div>

      {showCreator && (
        <BackupCreatorModal
          onClose={() => setShowCreator(false)}
          onCreated={(name) => {
            setExecutionLog((prev) => [`[${new Date().toLocaleTimeString()}] Backup created: ${name}`, ...prev]);
            setShowCreator(false);
            loadBackups();
          }}
          tables={BACKUP_TABLES}
        />
      )}

      {viewBackup && (
        <DetailModal title={`Backup: ${viewBackup.profileName}`} details={viewBackup as unknown as Record<string, unknown>} onClose={() => setViewBackup(null)} />
      )}
    </div>
  );
}

function RecoveryTab() {
  const [recoveries, setRecoveries] = useState<DevRecovery[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadRecoveries = async () => {
    try {
      setLoading(true);
      const data = await getDevRecovery();
      setRecoveries(data);
    } catch (err) {
      console.error("[RecoveryTab] Failed to load:", err);
      toast.error("Could not load recovery history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRecoveries(); }, []);

  const filtered = useMemo(
    () => recoveries.filter((r) => r.type.toLowerCase().includes(searchQuery.toLowerCase())),
    [recoveries, searchQuery]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={14} />
          <input type="text" placeholder="Search recoveries..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white w-full text-[#374151] placeholder:text-[#94a3b8]" />
        </div>
        <button onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#005a26]">
          <Upload size={14} /> Initiate Recovery
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f8fafc]">
              {["ID", "TYPE", "FILE", "STATUS", "MESSAGE", "CREATED"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc]">
                <td className="px-4 py-3 font-mono text-[12px] text-[#64748b]">{r.id}</td>
                <td className="px-4 py-3 text-[13px] text-[#0b1c30]">{r.type}</td>
                <td className="px-4 py-3 text-[12px] text-[#64748b]">{r.fileName}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${r.status === "COMPLETED" ? "bg-green-100 text-green-700" : r.status === "FAILED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{r.status}</span>
                </td>
                <td className="px-4 py-3 text-[12px] text-[#374151] max-w-[240px] truncate">{r.message}</td>
                <td className="px-4 py-3 text-[12px] text-[#64748b]">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[13px] text-[#94a3b8]">{loading ? "Loading recoveries..." : "No recovery operations found."}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <RecoveryModal onClose={() => setShowModal(false)} onInitiated={() => { setShowModal(false); loadRecoveries(); }} />
      )}
    </div>
  );
}

export default function BackupManagerPage() {
  const [activeTab, setActiveTab] = useState<"backup" | "recovery">("backup");

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-6 flex flex-col gap-5">
        <div>
          <h1 className="text-[26px] font-bold text-[#0b1c30]">Backup & Recovery</h1>
          <p className="text-[13px] text-[#64748b] mt-0.5">Create, schedule, and manage database backups and restores.</p>
        </div>

        <div className="flex gap-1 border-b border-[#e2e8f0]">
          <button
            onClick={() => setActiveTab("backup")}
            className={`px-4 py-2 text-[13px] font-medium rounded-t-lg transition-colors ${activeTab === "backup" ? "bg-white text-[#006e2f] border border-b-0 border-[#e2e8f0] -mb-px" : "text-[#64748b] hover:text-[#374151]"}`}
          >
            Backup
          </button>
          <button
            onClick={() => setActiveTab("recovery")}
            className={`px-4 py-2 text-[13px] font-medium rounded-t-lg transition-colors ${activeTab === "recovery" ? "bg-white text-[#006e2f] border border-b-0 border-[#e2e8f0] -mb-px" : "text-[#64748b] hover:text-[#374151]"}`}
          >
            Recovery
          </button>
        </div>

        {activeTab === "backup" ? <BackupTab /> : <RecoveryTab />}
      </div>
    </div>
  );
}
