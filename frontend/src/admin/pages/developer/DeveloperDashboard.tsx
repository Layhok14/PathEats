import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Activity, AlertTriangle, Server, Database, ExternalLink } from "lucide-react";
import { MetricCard } from "../../components/MetricCard";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { getDevHealth, getDevActivityLog, getDevApiMetrics, type DevHealth, type ActivityLogEntry } from "../../services/developerService";

export default function DeveloperDashboard() {
  const navigate = useNavigate();
  const [health, setHealth] = useState<DevHealth | null>(null);
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [metrics, setMetrics] = useState<{ totalTables: number; avgLatency: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [healthData, logsData, metricsData] = await Promise.all([
          getDevHealth(),
          getDevActivityLog({ limit: 10 }),
          getDevApiMetrics(),
        ]);
        setHealth(healthData);
        setLogs(logsData);
        setMetrics(metricsData);
      } catch (err) {
        console.error("[DeveloperDashboard] Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const healthColor = health?.status === "healthy" ? "green" : "amber";
  const errorLogs = logs.filter((l) => (l.payload ?? "").toUpperCase().includes("ERROR") || l.event_type === "login_failed");
  const warningCount = errorLogs.length;
  const totalLogs = logs.length;

  const uptimeDisplay = health
    ? `${Math.floor(health.uptime / 86400)}d ${Math.floor((health.uptime % 86400) / 3600)}h`
    : "N/A";

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-8 flex flex-col gap-6">
        <h1 className="text-[28px] font-bold text-[#0b1c30]">Developer Dashboard</h1>

        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label="System Status"
            value={health?.status === "healthy" ? "Healthy" : "Degraded"}
            sub={health ? `DB: ${health.dbConnected ? "Connected" : "Disconnected"}` : "Loading data..."}
            subVariant={healthColor as "green" | "amber"}
            topBorderColor={health?.status === "healthy" ? "#22c55e" : "#f59e0b"}
            icon={<Activity size={18} />}
            accent={health?.status === "healthy" ? "#22c55e" : "#f59e0b"}
          />
          <MetricCard
            label="Issues (24h)"
            value={String(warningCount)}
            sub={health?.dbConnected ? "System operational" : "DB disconnected"}
            subVariant={health?.dbConnected ? "green" : "red"}
            topBorderColor={health?.dbConnected ? "#22c55e" : "#ef4444"}
            icon={<AlertTriangle size={18} />}
            accent={health?.dbConnected ? "#22c55e" : "#ef4444"}
          />
          <MetricCard
            label="DB Latency"
            value={health ? `${health.dbLatency}ms` : "N/A"}
            sub={`Uptime: ${uptimeDisplay}`}
            subVariant="green"
            topBorderColor="#22c55e"
            icon={<Server size={18} />}
            accent="#22c55e"
          />
          <MetricCard
            label="Database Tables"
            value={String(metrics?.totalTables ?? "—")}
            sub={`Avg latency: ${metrics?.avgLatency ?? "—"}`}
            subVariant="green"
            topBorderColor="#22c55e"
            icon={<Database size={18} />}
            accent="#22c55e"
          />
        </div>

        <div className="grid grid-cols-[1fr_280px] gap-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-semibold text-[#0b1c30]">Recent System Events</h2>
              <button onClick={() => navigate("/admin/audit")} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#006e2f] hover:text-[#005a26]">
                View All <ExternalLink size={12} />
              </button>
            </div>
            {loading ? (
              <LoadingSpinner message="Loading events..." />
            ) : logs.length === 0 ? (
              <p className="text-[13px] text-[#94a3b8]">No recent events.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    {["TYPE", "ACTOR", "DETAILS"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => {
                    const isError = (log.payload ?? "").toUpperCase().includes("ERROR") || log.event_type === "login_failed";
                    return (
                    <tr key={log.id || i} className="border-t border-[#f1f5f9]">
                      <td className="px-5 py-3">
                        <span className={`text-[11px] font-bold px-2 py-1 rounded ${
                          isError ? "bg-red-100 text-red-700" :
                          log.event_type === "login_success" ? "bg-green-100 text-green-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {log.event_type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-[#64748b]">{log.actor_email || log.actor_id || "—"}</td>
                      <td className="px-5 py-3 text-[12px] text-[#374151] max-w-[300px] truncate">{log.payload || "—"}</td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
            <h2 className="text-[14px] font-semibold text-[#0b1c30] mb-4">System Health</h2>
            <div className="flex flex-col gap-3">
              {[
                { name: "Database Cluster", status: health?.dbConnected ? "Online" : "Offline" },
                { name: "API Service", status: health ? "Online" : "Offline" },
                { name: "Storage", status: health?.status === "healthy" ? "Online" : "Degraded" },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between py-2 border-b border-[#f1f5f9] last:border-0">
                  <span className="text-[13px] text-[#374151]">{s.name}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.status === "Online" ? "bg-green-100 text-green-700" : s.status === "Offline" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
