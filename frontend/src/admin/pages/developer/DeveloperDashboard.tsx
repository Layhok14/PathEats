import { Activity, AlertTriangle, Server, Database } from "lucide-react";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";

export default function DeveloperDashboard() {
  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar actionLabel="" searchPlaceholder="Search logs, endpoints, or services…" />
      <div className="flex-1 p-8 flex flex-col gap-6">
        <h1 className="text-[28px] font-bold text-[#0b1c30]">Developer Dashboard</h1>
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="System Uptime" value="99.98%" sub="Stable" subVariant="green" topBorderColor="#006e2f" icon={<Activity size={18} />} accent="#006e2f" />
          <MetricCard label="Total Errors (24h)" value="12" sub="↓ -8% vs yesterday" subVariant="red" topBorderColor="#ef4444" icon={<AlertTriangle size={18} />} accent="#ef4444" />
          <MetricCard label="API Requests" value="48.2K" sub="+5.3% this week" subVariant="blue" topBorderColor="#005ac2" icon={<Server size={18} />} accent="#005ac2" />
          <MetricCard label="Scheduled Backups" value="4" sub="All successful" subVariant="amber" topBorderColor="#f59e0b" icon={<Database size={18} />} accent="#f59e0b" />
        </div>
        <div className="grid grid-cols-[1fr_280px] gap-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
            <h2 className="text-[16px] font-semibold text-[#0b1c30] mb-4">Recent Error Logs</h2>
            <table className="w-full">
              <thead><tr className="bg-[#f8fafc]">{["LEVEL", "STATUS", "ENDPOINT"].map((h) => (<th key={h} className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>))}</tr></thead>
              <tbody>
                {[
                  { level: "CRITICAL", status: 500, endpoint: "/api/v1/orders/create" },
                  { level: "WARNING", status: 404, endpoint: "/api/v1/users/assets/logo.png" },
                  { level: "INFO", status: 200, endpoint: "/api/v1/user/profile" },
                ].map((log, i) => (
                  <tr key={i} className="border-t border-[#f1f5f9]">
                    <td className="px-4 py-3"><span className={`text-[11px] font-bold px-2 py-1 rounded ${log.level === "CRITICAL" ? "bg-red-100 text-red-700" : log.level === "WARNING" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{log.level}</span></td>
                    <td className="px-4 py-3"><span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">{log.status}</span></td>
                    <td className="px-4 py-3 font-mono text-[12px] text-[#006e2f]">{log.endpoint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
            <h2 className="text-[14px] font-semibold text-[#0b1c30] mb-4">System Health</h2>
            <div className="flex flex-col gap-3">
              {[
                { name: "Database Cluster", status: "Online" },
                { name: "API Gateway", status: "Online" },
                { name: "Storage S3", status: "Latency High" },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between py-2 border-b border-[#f1f5f9] last:border-0">
                  <span className="text-[13px] text-[#374151]">{s.name}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.status === "Online" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
