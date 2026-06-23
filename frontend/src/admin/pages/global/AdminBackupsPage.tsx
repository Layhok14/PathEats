import { useEffect, useState } from "react";
import { Database, Download, Trash2, RefreshCw, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { getDevBackups, createDevBackup, deleteDevBackup, type DevBackup } from "../../services/developerService";

export default function AdminBackupsPage() {
  const [backups, setBackups] = useState<DevBackup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [method, setMethod] = useState("entire_db");

  const loadBackups = async () => {
    try {
      setLoading(true);
      const data = await getDevBackups();
      setBackups(data);
    } catch (err) { toast.error("Could not load backups."); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadBackups(); }, []);

  const handleCreate = async () => {
    if (!profileName.trim()) { toast.error("Profile name required."); return; }
    try {
      await createDevBackup({ profileName: profileName.trim(), method });
      toast.success("Backup created.");
      setShowModal(false); setProfileName("");
      await loadBackups();
    } catch (err) { toast.error("Backup failed."); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this backup?")) return;
    try {
      await deleteDevBackup(id);
      toast.success("Backup deleted.");
      await loadBackups();
    } catch (err) { toast.error("Delete failed."); }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-8 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div><h1 className="text-[28px] font-bold text-[#0b1c30]">Database Backups</h1><p className="text-[14px] text-[#64748b] mt-1">Create and manage database backups.</p></div>
          <div className="flex gap-2">
            <button onClick={loadBackups} className="inline-flex items-center gap-2 rounded-lg border border-[#bccbb9] bg-white px-3 py-1.5 text-[12px] font-medium hover:bg-gray-50 shadow-sm"><RefreshCw size={14} className={loading?"animate-spin":""} /> Refresh</button>
            <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#006e2f] text-white px-3 py-1.5 text-[12px] font-medium hover:bg-[#005a26] shadow-sm"><Plus size={14} /> Create Backup</button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          {loading && backups.length === 0 ? <div className="p-10 text-center text-[13px] text-[#94a3b8]">Loading...</div> : (
            <table className="w-full">
              <thead><tr className="bg-[#f8fafc]">{["PROFILE", "METHOD", "SCOPE", "SCHEDULE", "STATUS", "ACTIONS"].map(h => <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>)}</tr></thead>
              <tbody>
                {backups.map(b => (
                  <tr key={b.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    <td className="px-6 py-3"><div className="flex items-center gap-3"><Database size={16} className="text-[#006e2f]" /><span className="text-[13px] font-medium text-[#0b1c30]">{b.profileName}</span></div></td>
                    <td className="px-6 py-3 text-[12px] text-[#64748b]">{b.method}</td>
                    <td className="px-6 py-3 text-[12px] text-[#64748b]">{b.scope || "—"}</td>
                    <td className="px-6 py-3 text-[12px] text-[#64748b]">{b.scheduleInterval ? `${b.scheduleInterval} ${b.scheduleUnit}` : "Manual"}</td>
                    <td className="px-6 py-3"><span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${b.status==="completed"?"bg-green-50 text-[#006e2f]":b.status==="failed"?"bg-red-50 text-[#ba1a1a]":"bg-amber-50 text-[#b45309]"}`}>{b.status}</span></td>
                    <td className="px-6 py-3"><div className="flex gap-2"><button className="p-1.5 rounded text-[#005ac2] hover:bg-blue-50"><Download size={15} /></button><button onClick={() => handleDelete(b.id)} className="p-1.5 rounded text-[#ef4444] hover:bg-red-50"><Trash2 size={15} /></button></div></td>
                  </tr>
                ))}
                {backups.length === 0 && <tr><td colSpan={6} className="px-6 py-10 text-center text-[13px] text-[#94a3b8]">No backups found.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[480px] p-6">
            <div className="flex justify-between items-center mb-5"><h2 className="text-xl font-bold">Create Backup</h2><button onClick={()=>setShowModal(false)} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-[#f1f5f9]"><X size={18} /></button></div>
            <div className="space-y-4">
              <div><label className="block text-[13px] font-medium mb-1.5">Profile Name</label><input value={profileName} onChange={e=>setProfileName(e.target.value)} placeholder="e.g. Weekly Full Backup" className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 outline-none focus:border-[#006e2f] text-[13px]" /></div>
              <div><label className="block text-[13px] font-medium mb-1.5">Method</label><select value={method} onChange={e=>setMethod(e.target.value)} className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 outline-none focus:border-[#006e2f] text-[13px] bg-white"><option value="entire_db">Entire Database</option><option value="specific_tables">Specific Tables</option><option value="specific_rows">Specific Rows</option></select></div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#f1f5f9]"><button onClick={()=>setShowModal(false)} className="border border-[#e2e8f0] px-4 py-2 rounded-lg hover:bg-[#f8fafc] text-[13px]">Cancel</button><button onClick={handleCreate} className="bg-[#006e2f] text-white px-4 py-2 rounded-lg hover:bg-[#005a26] text-[13px] font-medium">Create</button></div>
          </div>
        </div>
      )}
    </div>
  );
}