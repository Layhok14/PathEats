import { useEffect, useState } from "react";
import { RefreshCw, Upload, Search, Activity, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { getDevRecovery, initiateDevRecovery, type DevRecovery } from "../../services/developerService";

export default function AdminRecoveryPage() {
  const [recoveries, setRecoveries] = useState<DevRecovery[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [recoveryType, setRecoveryType] = useState("full_db");

  const loadRecoveries = async () => {
    try {
      setLoading(true);
      const data = await getDevRecovery();
      setRecoveries(data);
    } catch (err) {
      toast.error("Could not load recovery operations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRecoveries(); }, []);

  const handleInitiate = async () => {
    try {
      await initiateDevRecovery({ type: recoveryType, file: null as any });
      toast.success("Recovery initiated.");
      setShowModal(false);
      await loadRecoveries();
    } catch (err) {
      toast.error("Recovery failed.");
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-8 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">Recovery</h1>
            <p className="text-[14px] text-[#64748b] mt-1">Restore database from backup snapshots.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={loadRecoveries} className="inline-flex items-center gap-2 rounded-lg border border-[#bccbb9] bg-white px-3 py-1.5 text-[12px] font-medium hover:bg-gray-50 shadow-sm">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#006e2f] text-white px-3 py-1.5 text-[12px] font-medium hover:bg-[#005a26] shadow-sm">
              <Upload size={14} /> Initiate Recovery
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Total Operations</p>
            <p className="text-[28px] font-bold text-[#0b1c30] mt-1">{recoveries.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Successful</p>
            <p className="text-[28px] font-bold text-[#006e2f] mt-1">{recoveries.filter((r) => r.status === "completed").length}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Failed</p>
            <p className="text-[28px] font-bold text-[#ba1a1a] mt-1">{recoveries.filter((r) => r.status === "failed").length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          {loading && recoveries.length === 0 ? (
            <div className="p-10 text-center text-[13px] text-[#94a3b8]">Loading...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#f8fafc]">
                  {["TYPE", "FILENAME", "STATUS", "MESSAGE", "CREATED"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recoveries.map((r) => (
                  <tr key={r.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    <td className="px-6 py-3 text-[12px] text-[#64748b]">
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-[#006e2f]" />
                        {r.type}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-[12px] font-mono text-[#0b1c30]">{r.filename || "—"}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${r.status === "completed" ? "bg-green-50 text-[#006e2f]" : r.status === "failed" ? "bg-red-50 text-[#ba1a1a]" : "bg-amber-50 text-[#b45309]"}`}>
                        {r.status === "completed" ? <CheckCircle size={12} /> : r.status === "failed" ? <XCircle size={12} /> : null}
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[12px] text-[#64748b] max-w-[200px] truncate">{r.message || "—"}</td>
                    <td className="px-6 py-3 text-[12px] text-[#64748b]">{r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}</td>
                  </tr>
                ))}
                {recoveries.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-[13px] text-[#94a3b8]">No recovery operations found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[480px] p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-[#0b1c30]">Initiate Recovery</h2>
              <button onClick={() => setShowModal(false)} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-[#f1f5f9]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium mb-1.5">Recovery Type</label>
                <select value={recoveryType} onChange={(e) => setRecoveryType(e.target.value)} className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 outline-none focus:border-[#006e2f] text-[13px] bg-white">
                  <option value="full_db">Full DB Dump</option>
                  <option value="selected_tables">Selected Tables</option>
                  <option value="row_level">Row Level CSV</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium mb-1.5">Upload File</label>
                <div className="border-2 border-dashed border-[#e2e8f0] rounded-lg p-6 text-center hover:border-[#006e2f] transition-colors cursor-pointer">
                  <Upload size={24} className="mx-auto mb-2 text-[#94a3b8]" />
                  <p className="text-[12px] text-[#64748b]">Drop .sql or .csv file here</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#f1f5f9]">
              <button onClick={() => setShowModal(false)} className="border border-[#e2e8f0] px-4 py-2 rounded-lg hover:bg-[#f8fafc] text-[13px]">Cancel</button>
              <button onClick={handleInitiate} className="bg-[#006e2f] text-white px-4 py-2 rounded-lg hover:bg-[#005a26] text-[13px] font-medium">Initiate Recovery</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}