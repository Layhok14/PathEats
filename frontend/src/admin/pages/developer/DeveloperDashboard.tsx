import { useEffect, useState } from "react";
import { Activity, AlertTriangle, Server, Database } from "lucide-react";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";
import { getDevHealth, getDevLogs, getDevApiMetrics, type DevHealth, type DevLogEntry } from "../../services/developerService";

export default function DeveloperDashboard() {
  const [health, setHealth] = useState<DevHealth | null>(null);
  const [logs, setLogs] = useState<DevLogEntry[]>([]);
  const [metrics, setMetrics] = useState<{ totalTables: number; avgLatency: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [healthData, logsData, metricsData] = await Promise.all([
          getDevHealth(),
          getDevLogs({ limit: 5 }),
          getDevApiMetrics(),
        ]);
        setHealth(healthData);
        setLogs(logsData.logs);
        setMetrics(metricsData);
      } catch (err) {
        console.error("[DeveloperDashboard] Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const healthColor = health?.status === "healthy" ? "green" : "amber";
  const totalLogs = logs.length;
  const warningCount = logs.filter((l) => l.level === "WARNING" || l.level === "CRITICAL").length;

  const uptimeDisplay = health
    ? `${Math.floor(health.uptime / 86400)}d ${Math.floor((health.uptime % 86400) / 3600)}h`
    : "N/A";

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar actionLabel="" searchPlaceholder="Search logs, endpoints, or services…" />
      <div className="flex-1 p-8 flex flex-col gap-6">
        <h1 className="text-[28px] font-bold text-[#0b1c30]">Developer Dashboard</h1>

        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label="System Status"
            value={health?.status === "healthy" ? "Healthy" : "Degraded"}
            sub={health ? `DB: ${health.dbConnected ? "Connected" : "Disconnected"}` : "Loading..."}
            subVariant={healthColor as "green" | "amber"}
            topBorderColor={health?.status === "healthy" ? "#006e2f" : "#f59e0b"}
            icon={<Activity size={18} />}
            accent={health?.status === "healthy" ? "#006e2f" : "#f59e0b"}
          />
          <MetricCard
            label="Issues (24h)"
            value={String(warningCount)}
            sub={health?.dbConnected ? "System operational" : "DB disconnected"}
            subVariant={health?.dbConnected ? "green" : "red"}
            topBorderColor={health?.dbConnected ? "#006e2f" : "#ef4444"}
            icon={<AlertTriangle size={18} />}
            accent={health?.dbConnected ? "#006e2f" : "#ef4444"}
          />
          <MetricCard
            label="DB Latency"
            value={health ? `${health.dbLatency}ms` : "N/A"}
            sub={`Uptime: ${uptimeDisplay}`}
            subVariant="blue"
            topBorderColor="#005ac2"
            icon={<Server size={18} />}
            accent="#005ac2"
          />
          <MetricCard
            label="Database Tables"
            value={String(metrics?.totalTables ?? "—")}
            sub={`Avg latency: ${metrics?.avgLatency ?? "—"}`}
            subVariant="amber"
            topBorderColor="#f59e0b"
            icon={<Database size={18} />}
            accent="#f59e0b"
          />
        </div>

        <div className="grid grid-cols-[1fr_280px] gap-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
            <h2 className="text-[16px] font-semibold text-[#0b1c30] mb-4">Recent Error Logs</h2>
            {loading ? (
              <p className="text-[13px] text-[#94a3b8]">Loading logs...</p>
            ) : logs.length === 0 ? (
              <p className="text-[13px] text-[#94a3b8]">No recent log entries.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    {["LEVEL", "STATUS", "ENDPOINT", "MESSAGE"].map((h) => (
                      <th key={h} className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={log.id || i} className="border-t border-[#f1f5f9]">
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-bold px-2 py-1 rounded ${log.level === "CRITICAL" ? "bg-red-100 text-red-700" : log.level === "WARNING" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                          {log.level}
                        </span>
                      </td>
                      <td className="px-4 py-3"><span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">{log.status}</span></td>
                      <td className="px-4 py-3 font-mono text-[12px] text-[#006e2f] max-w-[180px] truncate">{log.endpoint}</td>
                      <td className="px-4 py-3 text-[12px] text-[#374151] max-w-[200px] truncate">{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
            <h2 className="text-[14px] font-semibold text-[#0b1c30] mb-4">System Health</h2>
            <div className="flex flex-col gap-3">
              {[
                { name: "Database Cluster", status: health?.dbConnected ? "Online" : "Offline" },
                { name: "API Gateway", status: "Online" },
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
