import { useEffect, useState } from "react";
import { Cloud, Database, HardDrive, RotateCcw, Shield, Upload } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";
import {
  createDeveloperBackup,
  getDeveloperBackups,
  PROJECT_TABLES,
  recoverDeveloperBackup,
  type DeveloperBackup,
} from "../../services/developerService";

type BackupScope = "database" | "table" | "row";

export default function BackupRecoveryPage() {
  const [backups, setBackups] = useState<DeveloperBackup[]>([]);
  const [scope, setScope] = useState<BackupScope>("database");
  const [tableName, setTableName] = useState("users");
  const [rowId, setRowId] = useState("");
  const [selectedBackupId, setSelectedBackupId] = useState("");
  const [loading, setLoading] = useState(true);

  const loadBackups = async () => {
    try {
      setLoading(true);
      const rows = await getDeveloperBackups();
      setBackups(rows);
      setSelectedBackupId((current) => current || rows[0]?.id || "");
    } catch {
      toast.error("Could not load backup records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBackups();
  }, []);

  const handleBackup = async () => {
    if (scope === "row" && !rowId.trim()) {
      toast.error("Enter the row id before creating a row backup.");
      return;
    }

    try {
      await createDeveloperBackup({
        scope,
        tableName: scope === "database" ? undefined : tableName,
        rowId: scope === "row" ? rowId.trim() : undefined,
      });
      toast.success("Logical backup created.");
      await loadBackups();
    } catch {
      toast.error("Could not create backup.");
    }
  };

  const handleRecovery = async () => {
    if (!selectedBackupId) {
      toast.error("Choose a backup to recover.");
      return;
    }
    if (!confirm("Recover this logical backup now?")) return;

    try {
      await recoverDeveloperBackup(selectedBackupId);
      toast.success("Recovery completed.");
      await loadBackups();
    } catch {
      toast.error("Could not recover backup.");
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar actionLabel="" searchPlaceholder="Search backups..." />
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">Backup & Recovery</h1>
            <p className="text-[14px] text-[#64748b] mt-1">
              {loading ? "Loading backups..." : "Create logical backups for the database, one table, or one row."}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleBackup} className="inline-flex items-center gap-2 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-[#005a26]"><Upload size={14} />Backup</button>
            <button onClick={handleRecovery} className="inline-flex items-center gap-2 rounded-lg border border-[#bccbb9] bg-white px-3 py-1.5 text-[12px] font-medium text-[#374151] shadow-sm hover:bg-gray-50"><RotateCcw size={14} />Recovery</button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Backup Records" value={String(backups.length)} sub="Stored as logical snapshots" subVariant="green" topBorderColor="#006e2f" icon={<HardDrive size={18} />} accent="#006e2f" />
          <MetricCard label="Database Backups" value={String(backups.filter((b) => b.scope === "database").length)} sub="Full logical scope" subVariant="blue" topBorderColor="#005ac2" icon={<Database size={18} />} accent="#005ac2" />
          <MetricCard label="Table Backups" value={String(backups.filter((b) => b.scope === "table").length)} sub="Single-table scope" subVariant="amber" topBorderColor="#f59e0b" icon={<Cloud size={18} />} accent="#f59e0b" />
          <MetricCard label="Recovered" value={String(backups.filter((b) => b.status === "RECOVERED").length)} sub="Recovery runs" subVariant="green" topBorderColor="#006e2f" icon={<Shield size={18} />} accent="#006e2f" />
        </div>

        <div className="grid grid-cols-[340px_1fr] gap-4 items-start">
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 flex flex-col gap-4">
            <h2 className="text-[16px] font-semibold text-[#0b1c30]">Logical Backup</h2>
            <label className="text-[12px] font-semibold text-[#374151]">Backup Type
              <select value={scope} onChange={(event) => setScope(event.target.value as BackupScope)} className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]">
                <option value="database">Backup database</option>
                <option value="table">Backup table</option>
                <option value="row">Backup row</option>
              </select>
            </label>
            {scope !== "database" && (
              <label className="text-[12px] font-semibold text-[#374151]">Table
                <select value={tableName} onChange={(event) => setTableName(event.target.value)} className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]">
                  {PROJECT_TABLES.map((table) => <option key={table} value={table}>{table}</option>)}
                </select>
              </label>
            )}
            {scope === "row" && (
              <label className="text-[12px] font-semibold text-[#374151]">Row ID
                <input value={rowId} onChange={(event) => setRowId(event.target.value)} placeholder="Paste row id" className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
              </label>
            )}
            <label className="text-[12px] font-semibold text-[#374151]">Recovery Point
              <select value={selectedBackupId} onChange={(event) => setSelectedBackupId(event.target.value)} className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]">
                <option value="">Select backup</option>
                {backups.map((backup) => <option key={backup.id} value={backup.id}>{backup.name}</option>)}
              </select>
            </label>
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#f1f5f9]"><h2 className="text-[16px] font-semibold text-[#0b1c30]">Backup Archive</h2></div>
            <table className="w-full">
              <thead><tr className="bg-[#f8fafc]">{["NAME", "SCOPE", "TABLE", "ROWS", "STATUS", "CREATED"].map((header) => <th key={header} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{header}</th>)}</tr></thead>
              <tbody>
                {backups.map((backup) => (
                  <tr key={backup.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc]">
                    <td className="px-5 py-4 font-mono text-[12px] font-medium text-[#0b1c30]">{backup.name}</td>
                    <td className="px-5 py-4"><span className="rounded-full bg-[#dbeafe] px-2.5 py-0.5 text-[11px] font-medium uppercase text-[#1e40af]">{backup.scope}</span></td>
                    <td className="px-5 py-4 text-[12px] text-[#64748b]">{backup.tableName ?? "All tables"}</td>
                    <td className="px-5 py-4 text-[13px] text-[#374151]">{backup.rowCount}</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${backup.status === "RECOVERED" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{backup.status}</span></td>
                    <td className="px-5 py-4 text-[12px] text-[#64748b]">{new Date(backup.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {backups.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">No backup records yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
