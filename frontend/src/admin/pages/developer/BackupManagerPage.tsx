import { useEffect, useMemo, useState } from "react";
import { Search, Upload, Eye, Trash2, CheckCircle, AlertTriangle, X, ShieldAlert, Download } from "lucide-react";
import { toast } from "sonner";
import {
  getDevBackups,
  createDevBackup,
  downloadDevBackup,
  deleteDevBackup,
  getDevRecovery,
  initiateDevRecovery,
  getDevDatabase,
  type DevBackup,
  type DevRecovery,
  type DevTableInfo,
} from "../../services/developerService";
import { DetailModal } from "./devShared";

const BACKUP_METHODS = ["Entire Database", "Specific Tables", "Specific Rows"];
const RECOVERY_TYPES = ["PostgreSQL Dump", "Row Level CSV"];
const SCHEDULE_UNITS = ["Hours", "Days", "Months"];
const DB_SCHEMAS = ["public"];
const MAX_RECOVERY_FILE_BYTES = 100 * 1024 * 1024;
const POSTGRES_DUMP_CONFIRMATION = "RESTORE POSTGRES DUMP";
const DEFAULT_RECOVERY_CONFIRMATION = "RECOVER";

function BackupCreatorModal({ onClose, onCreated, tables }: { onClose: () => void; onCreated: (name: string) => void; tables: string[] }) {
  const [profileName, setProfileName] = useState("");
  const [method, setMethod] = useState("");
  const [selectedSchema, setSelectedSchema] = useState("");
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [rowCondition, setRowCondition] = useState("");
  const [scheduleInterval, setScheduleInterval] = useState("");
  const [scheduleUnit, setScheduleUnit] = useState("Hours");

  const hasBackupTarget =
    method === "Entire Database" ||
    (method === "Specific Tables" && selectedTables.length > 0) ||
    (method === "Specific Rows" && selectedTable);
  const canProceed = profileName.trim() && method && hasBackupTarget;

  const handleCreate = async () => {
    try {
      let scope = "";
      if (method === "Entire Database") {
        scope = `schema:${selectedSchema || DB_SCHEMAS[0]}`;
      } else if (method === "Specific Tables") {
        scope = `tables:${selectedTables.join(",") || "all"}`;
      } else if (method === "Specific Rows") {
        scope = `table:${selectedTable}`;
        if (rowCondition.trim()) {
          scope += `;condition=${rowCondition.trim()}`;
        }
      }

      await createDevBackup({
        profileName: profileName.trim(),
        method,
        scope,
        scheduleInterval: scheduleInterval || undefined,
        scheduleUnit: scheduleInterval ? scheduleUnit : undefined,
      });

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
          <h2 className="text-[16px] font-bold text-[#0b1c30]">Create Backup Profile</h2>
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
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-semibold text-[#64748b] mb-1 block">Select Table</label>
                <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)} className="w-full px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] text-[#374151] bg-white">
                  <option value="">— Select —</option>
                  {tables.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-[#64748b] mb-1 block">WHERE Condition (optional)</label>
                <input
                  type="text"
                  value={rowCondition}
                  onChange={(e) => setRowCondition(e.target.value)}
                  placeholder='e.g. WHERE created_at > NOW() - INTERVAL &apos;30 days&apos;'
                  className="w-full px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] text-[#374151] placeholder:text-[#94a3b8] font-mono"
                />
                <p className="text-[11px] text-[#64748b] mt-1">Generates a CSV file containing only rows matching this condition.</p>
              </div>
            </div>
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
          <button onClick={handleCreate} disabled={!canProceed} className="px-4 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50 disabled:cursor-not-allowed">Create Backup Profile</button>
        </div>
      </div>
    </div>
  );
}

function RecoveryModal({ onClose, onInitiated }: { onClose: () => void; onInitiated: () => void }) {
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [recoveryType, setRecoveryType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedDb, setSelectedDb] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [tables, setTables] = useState<DevTableInfo[]>([]);
  const [processing, setProcessing] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

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
  const allowedExtensions = recoveryType === "Row Level CSV"
    ? [".csv"]
    : [".dump", ".backup", ".pgdump"];
  const expectedExtensionLabel = allowedExtensions.join(", ");
  const requiredConfirmation = recoveryType === "PostgreSQL Dump"
    ? POSTGRES_DUMP_CONFIRMATION
    : DEFAULT_RECOVERY_CONFIRMATION;

  const handleFileDrop = (droppedFile: File) => {
    setError("");
    setSuccess("");

    if (droppedFile.size > MAX_RECOVERY_FILE_BYTES) {
      setError("File exceeds 100 MB limit.");
      setFile(null);
      return;
    }

    const lowerName = droppedFile.name.toLowerCase();
    if (lowerName.endsWith(".csv")) {
      setRecoveryType("Row Level CSV");
    } else if (lowerName.endsWith(".dump") || lowerName.endsWith(".backup") || lowerName.endsWith(".pgdump")) {
      setRecoveryType("PostgreSQL Dump");
    } else {
      setError("Unsupported file type. Use .dump, .backup, .pgdump, or .csv files.");
      setFile(null);
      return;
    }

    setFile(droppedFile);
  };

  const handleReview = () => {
    if (!recoveryType) { setError("Select a recovery type."); return; }
    if (!file) { setError("Upload a file."); return; }
    if (recoveryType === "Row Level CSV" && !selectedTable) { setError("Select a target table."); return; }
    setConfirmationText("");
    setStep("confirm");
  };

  const handleInitiate = async () => {
    if (confirmationText.trim() !== requiredConfirmation) {
      setError(`Type ${requiredConfirmation} to confirm this recovery.`);
      return;
    }
    try {
      setProcessing(true);
      setError("");

      await initiateDevRecovery({
        type: recoveryType,
        file: file!,
        confirmationText: confirmationText.trim(),
        targetTable: recoveryType === "Row Level CSV" ? selectedTable : undefined,
      });

      setSuccess(`${recoveryType} recovery from "${file!.name}" completed successfully.`);
      toast.success("Recovery completed.");
      setTimeout(() => onInitiated(), 1500);
    } catch (err: unknown) {
      const response = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
      const msg = response?.error || response?.message || "Recovery failed. Check file format and try again.";
      setError(msg);
    } finally {
      setProcessing(false);
    }
  };

  if (step === "confirm") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-[520px] rounded-xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
            <h2 className="text-[16px] font-bold text-[#ba1a1a]">Confirm Recovery</h2>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#334155] hover:bg-[#f1f5f9]"><X size={18} /></button>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <ShieldAlert size={20} className="text-[#ba1a1a] shrink-0 mt-0.5" />
              <div>
                <p className="text-[14px] font-bold text-[#ba1a1a]">This action cannot be undone</p>
                <p className="text-[12px] text-[#64748b] mt-1">
                  You are about to execute <strong>{recoveryType}</strong> from <strong>{file?.name}</strong>
                  {selectedTable ? ` into table "${selectedTable}"` : ""}. Existing data may be overwritten or modified.
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
              <label htmlFor="recovery-confirmation" className="block text-[12px] font-semibold text-[#374151]">
                Type {requiredConfirmation} to confirm
              </label>
              <p className="mt-1 text-[11px] text-[#64748b]">
                PostgreSQL dump recovery runs in data-only, single-transaction mode and may insert or overwrite database data.
              </p>
              <input
                id="recovery-confirmation"
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value.toUpperCase())}
                placeholder={requiredConfirmation}
                className="mt-3 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] font-semibold tracking-widest text-[#374151] outline-none focus:border-[#ba1a1a]"
              />
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
            <button onClick={() => setStep("form")} className="px-4 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50">Back</button>
            <button onClick={handleInitiate} disabled={processing || confirmationText.trim() !== requiredConfirmation}
              className="px-4 py-1.5 text-[12px] font-medium rounded-lg bg-[#ba1a1a] text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {processing ? "Executing..." : "Confirm & Execute Recovery"}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="grid grid-cols-2 gap-2">
              {RECOVERY_TYPES.map((t) => (
                <button key={t} onClick={() => { setRecoveryType(t); setError(""); setSuccess(""); setFile(null); }}
                  className={`px-3 py-2 rounded-lg text-[12px] font-medium border transition-colors ${recoveryType === t ? "bg-[#006e2f] text-white border-[#006e2f]" : "border-[#e2e8f0] text-[#374151] hover:bg-gray-50"}`}>
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
                  Drag & drop a {expectedExtensionLabel} file, or{' '}
                  <label className="text-[#006e2f] cursor-pointer hover:underline">
                    browse
                    <input type="file" accept={allowedExtensions.join(",")} className="hidden"
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
          <button onClick={handleReview} disabled={!recoveryType || !file || processing}
            className="px-4 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50 disabled:cursor-not-allowed">
            Review & Confirm
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
  const [tables, setTables] = useState<string[]>([]);

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

  useEffect(() => {
    getDevDatabase().then((db) => {
      setTables(db.tables.map((t) => t.name));
    }).catch(() => {});
  }, []);

  const filtered = useMemo(
    () => backups.filter((b) => b.profileName.toLowerCase().includes(searchQuery.toLowerCase())),
    [backups, searchQuery]
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this backup profile? This does not delete database data.")) return;
    try {
      await deleteDevBackup(id);
      toast.success("Backup deleted.");
      await loadBackups();
    } catch (err) {
      console.error("[BackupTab] Delete failed:", err);
      toast.error("Could not delete backup.");
    }
  };

  const handleDownload = async (backup: DevBackup) => {
    try {
      const { blob, filename } = await downloadDevBackup(backup.id);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setExecutionLog((prev) => [`[${new Date().toLocaleTimeString()}] Local backup downloaded: ${filename}`, ...prev]);
      toast.success("Backup downloaded to your device.");
      await loadBackups();
    } catch (err) {
      console.error("[BackupTab] Download failed:", err);
      toast.error("Could not generate backup file.");
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
          <Upload size={14} /> Create Backup Profile
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
                    <button onClick={() => handleDownload(b)} className="rounded-lg p-1.5 text-[#2563eb] hover:bg-blue-50" title="Download PostgreSQL Dump"><Download size={14} /></button>
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
          <p className="text-[12px] text-[#94a3b8]">No recent backup profile changes.</p>
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
            setExecutionLog((prev) => [`[${new Date().toLocaleTimeString()}] Backup profile configured: ${name}`, ...prev]);
            setShowCreator(false);
            loadBackups();
          }}
          tables={tables}
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
          <p className="text-[13px] text-[#64748b] mt-0.5">Download PostgreSQL dump backups and recover from files selected on this device.</p>
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
