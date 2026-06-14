import { Activity, AlertCircle, Globe, Cloud, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";
import { RECENT_ERROR_LOGS, SYSTEM_HEALTH } from "../../../shared/constants/developerData";

const STATUS_CODE_STYLE: Record<number, string> = {
  500: "bg-red-100 text-red-700",
  503: "bg-red-100 text-red-700",
  404: "bg-amber-100 text-amber-700",
  429: "bg-orange-100 text-orange-700",
  400: "bg-blue-100 text-blue-700",
  200: "bg-green-100 text-green-700",
};

const HEALTH_DOT: Record<string, string> = {
  Online: "#006e2f",
  "Latency High": "#f59e0b",
  Offline: "#ef4444",
};

export default function DeveloperDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar searchPlaceholder="Search system logs, users, or endpoints…" actionLabel="" />

      <div className="flex-1 p-8 flex flex-col gap-6">
        {/* Page header */}
        <div>
          <h1 className="text-[24px] font-bold text-[#0b1c30]">System Overview</h1>
          <p className="text-[13px] text-[#64748b] mt-0.5">Real-time developer dashboard for PathEat core infrastructure.</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label="System Uptime"
            value="98.7%"
            sub="↑ +0.02% this week"
            subVariant="green"
            topBorderColor="#006e2f"
            icon={<Activity size={18} />}
            accent="#006e2f"
          />
          <MetricCard
            label="Total Errors (24h)"
            value="142"
            sub="↓ -12% vs yesterday"
            subVariant="red"
            topBorderColor="#ef4444"
            icon={<AlertCircle size={18} />}
            accent="#ef4444"
          />
          <MetricCard
            label="API Requests"
            value="1.2M"
            sub="⚡ High Traffic"
            subVariant="amber"
            topBorderColor="#f59e0b"
            icon={<Globe size={18} />}
            accent="#f59e0b"
          />
          <MetricCard
            label="Scheduled Backups"
            value="Successful"
            sub="Last: 4h ago"
            subVariant="green"
            topBorderColor="#005ac2"
            icon={<Cloud size={18} />}
            accent="#005ac2"
          />
        </div>

        {/* Error logs + System health */}
        <div className="grid grid-cols-[1fr_300px] gap-4">
          {/* Recent error logs */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="flex items-start justify-between px-6 py-4 border-b border-[#f1f5f9]">
              <div>
                <h2 className="text-[15px] font-semibold text-[#0b1c30]">Recent Error Logs</h2>
                <p className="text-[12px] text-[#64748b] mt-0.5">Live streaming logs from production</p>
              </div>
              <button
                onClick={() => navigate("/developer/error-logs")}
                className="flex items-center gap-1 text-[12px] font-medium text-[#006e2f] hover:underline"
              >
                View All <ExternalLink size={11} />
              </button>
            </div>

            <table className="w-full">
              <thead>
                <tr className="bg-[#f8fafc]">
                  {["STATUS", "ENDPOINT", "MESSAGE"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_ERROR_LOGS.map((log) => (
                  <tr key={log.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${STATUS_CODE_STYLE[log.status] ?? "bg-gray-100 text-gray-700"}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-[12px] text-[#006e2f] max-w-[220px] truncate">
                      {log.endpoint}
                    </td>
                    <td className="px-5 py-3 text-[12px] text-[#374151] max-w-[180px] truncate">
                      {log.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* System health */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 flex flex-col gap-3">
            <h2 className="text-[15px] font-semibold text-[#0b1c30]">System Health</h2>
            <div className="flex flex-col divide-y divide-[#f1f5f9]">
              {SYSTEM_HEALTH.map((item) => {
                const dotColor = HEALTH_DOT[item.status] ?? "#94a3b8";
                return (
                  <div key={item.name} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-[13px] font-medium text-[#0b1c30]">{item.name}</p>
                      <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider mt-0.5">{item.sub}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dotColor }} />
                      <span className="text-[12px] font-semibold" style={{ color: dotColor }}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
