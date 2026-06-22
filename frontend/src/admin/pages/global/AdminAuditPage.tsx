import { useEffect, useState } from "react";
import { RefreshCw, Activity } from "lucide-react";
import { toast } from "sonner";
import { getAdminAuditActivity, type AuditActivityRow } from "../../services/adminDashboardService";

export default function AdminAuditPage() {
  const [rows, setRows] = useState<AuditActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadActivity = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminAuditActivity();
      setRows(data);
    } catch (err) {
      console.error("[AdminAuditPage] Failed to load activity:", err);
      setError("Could not load database activity. Make sure PostgreSQL is running.");
      toast.error("Could not load database activity.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivity();
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">Database Activity</h1>
            <p className="text-[14px] text-[#64748b] mt-1">
              Live queries from <code className="text-[#006e2f] bg-green-50 px-1.5 py-0.5 rounded text-[13px]">pg_stat_activity</code>
            </p>
          </div>
          <button
            onClick={loadActivity}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#bccbb9] bg-white px-3 py-1.5 text-[12px] font-medium text-[#374151] hover:bg-gray-50 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-[13px] text-[#92400e]">{error}</div>
        )}

        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            {loading && rows.length === 0 ? (
              <div className="p-10 text-center text-[13px] text-[#94a3b8]">
                <div className="w-5 h-5 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading database activity from pg_stat_activity...
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    {["PID", "User", "Application", "State", "Query", "Wait Event", "Started"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.pid || i} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                      <td className="px-5 py-3 text-[12px] font-mono text-[#0b1c30]">{row.pid}</td>
                      <td className="px-5 py-3 text-[12px] text-[#64748b]">{row.username}</td>
                      <td className="px-5 py-3 text-[12px] text-[#64748b]">{row.application_name || "—"}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          row.state === "active" ? "bg-green-50 text-[#006e2f]" :
                          row.state === "idle in transaction" ? "bg-yellow-50 text-[#92400e]" :
                          "bg-gray-50 text-[#64748b]"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            row.state === "active" ? "bg-[#006e2f]" :
                            row.state === "idle in transaction" ? "bg-[#f59e0b]" :
                            "bg-[#94a3b8]"
                          }`} />
                          {row.state}
                        </span>
                      </td>
                      <td className="px-5 py-3 max-w-[360px]">
                        <p className="text-[11px] font-mono text-[#0b1c30] truncate" title={row.query}>{row.query}</p>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-[#64748b]">
                        {row.wait_event ? `${row.wait_event_type || ""} ${row.wait_event}`.trim() : "—"}
                      </td>
                      <td className="px-5 py-3 text-[12px] text-[#64748b] whitespace-nowrap">
                        {row.query_start ? new Date(row.query_start).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">No active database connections found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-1 text-[12px] text-[#94a3b8]">
          <Activity size={14} />
          Showing {rows.length} connection(s). Idle connections are hidden.
        </div>
      </div>
    </div>
  );
}
