import { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";

const ALL_ERROR_LOGS = [
  { id: "e1", level: "CRITICAL", status: 500, timestamp: "2023-10-19 14:22:05", endpoint: "/api/v1/orders/create", message: "NullPointerException at line 142" },
  { id: "e2", level: "WARNING", status: 404, timestamp: "2023-10-19 14:20:11", endpoint: "/api/v1/users/assets/logo.png", message: "Resource not found" },
  { id: "e3", level: "INFO", status: 200, timestamp: "2023-10-19 14:15:10", endpoint: "/api/v1/user/profile", message: "Migration completed" },
  { id: "e4", level: "CRITICAL", status: 500, timestamp: "2023-10-19 14:15:02", endpoint: "/api/v1/payment/stripe-webhook", message: "Timeout connecting to Stripe" },
  { id: "e5", level: "WARNING", status: 400, timestamp: "2023-10-19 14:05:01", endpoint: "/api/v1/search/restaurants", message: "Bad Request: Missing Lat/Lng" },
  { id: "e6", level: "WARNING", status: 429, timestamp: "2023-10-19 14:00:00", endpoint: "/api/v1/auth/login", message: "Rate limit exceeded" },
];

type Level = "CRITICAL" | "WARNING" | "INFO";
const LEVEL_STYLE: Record<Level, string> = { CRITICAL: "bg-red-100 text-red-700", WARNING: "bg-amber-100 text-amber-700", INFO: "bg-blue-100 text-blue-700" };

export default function ErrorLogsPage() {
  const [severity, setSeverity] = useState<"All" | Level>("All");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 4;
  const filtered = ALL_ERROR_LOGS.filter((l) => severity === "All" || l.level === severity);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar searchPlaceholder="Search logs by keyword or trace ID…" actionLabel="" />
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div><h1 className="text-[28px] font-bold text-[#0b1c30]">Error Logs</h1><p className="text-[13px] text-[#64748b] mt-0.5">Real-time system health monitoring and diagnostic tracing.</p></div>
          <div className="flex gap-3">
            <button className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50"><Trash2 size={14} className="inline mr-1" />Clear History</button>
            <button className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26]"><Download size={14} className="inline mr-1" />Download Logs</button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Critical Errors" value="12" sub="↑ +8% vs yesterday" subVariant="red" topBorderColor="#ef4444" />
          <MetricCard label="Warnings" value="84" sub="↓ -12% vs yesterday" subVariant="amber" topBorderColor="#f59e0b" />
          <MetricCard label="API Latency (Avg)" value="245ms" sub="↑ +24ms from baseline" subVariant="blue" topBorderColor="#005ac2" />
          <MetricCard label="Uptime" value="99.98%" sub="Stable" subVariant="green" topBorderColor="#006e2f" />
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[#f1f5f9]">
            <span className="text-[12px] text-[#64748b] font-medium">Filters:</span>
            {(["All", "CRITICAL", "WARNING", "INFO"] as const).map((f) => (
              <button key={f} onClick={() => { setSeverity(f); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${severity === f ? "bg-[#006e2f] text-white border-[#006e2f]" : "border-[#e2e8f0] text-[#64748b] hover:bg-gray-50"}`}>{f === "All" ? "Severity: All" : f}</button>
            ))}
          </div>
          <table className="w-full">
            <thead><tr className="bg-[#f8fafc]">{["LEVEL", "STATUS", "TIMESTAMP", "ENDPOINT", "MESSAGE"].map((h) => (<th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>))}</tr></thead>
            <tbody>
              {visible.map((log) => (
                <tr key={log.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc]">
                  <td className="px-5 py-3"><span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded ${LEVEL_STYLE[log.level as Level]}`}>{log.level}</span></td>
                  <td className="px-5 py-3"><span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">{log.status}</span></td>
                  <td className="px-5 py-3 font-mono text-[12px] text-[#64748b]">{log.timestamp}</td>
                  <td className="px-5 py-3 font-mono text-[12px] text-[#006e2f]">{log.endpoint}</td>
                  <td className="px-5 py-3 text-[12px] text-[#374151]">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#f1f5f9]">
            <p className="text-[12px] text-[#94a3b8]">Page {page} of {Math.ceil(filtered.length / PAGE_SIZE)}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p-1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
              <button disabled={page >= Math.ceil(filtered.length / PAGE_SIZE)} onClick={() => setPage(p => p+1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
