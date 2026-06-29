import { useEffect, useState } from "react";
import { RefreshCw, Activity, UserCheck, Shield, Database, Trash2, Edit3, UserPlus, Server, Wifi, Clock } from "lucide-react";
import { toast } from "sonner";
import { getAdminAuditLogs, type AuditLogEntry } from "../../services/adminDashboardService";
import { getDevHealth, type DevHealth } from "../../services/developerService";

const ACTION_ICONS: Record<string, React.ReactNode> = {
  create_user: <UserPlus size={14} />,
  update_user: <Edit3 size={14} />,
  delete_user: <Trash2 size={14} />,
  create_role: <Shield size={14} />,
  update_role: <Edit3 size={14} />,
  delete_role: <Trash2 size={14} />,
  update_status: <UserCheck size={14} />,
};

const ACTION_COLORS: Record<string, string> = {
  create_user: "bg-green-50 text-[#006e2f]",
  update_user: "bg-blue-50 text-[#005ac2]",
  delete_user: "bg-red-50 text-[#ba1a1a]",
  create_role: "bg-green-50 text-[#006e2f]",
  update_role: "bg-blue-50 text-[#005ac2]",
  delete_role: "bg-red-50 text-[#ba1a1a]",
  update_status: "bg-amber-50 text-[#b45309]",
};

function getActionLabel(action: string): string {
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getActionColor(action: string): string {
  return ACTION_COLORS[action] || "bg-gray-50 text-[#64748b]";
}

function getActionIcon(action: string): React.ReactNode {
  return ACTION_ICONS[action] || <Activity size={14} />;
}

function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AdminActivityDashboard() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [health, setHealth] = useState<DevHealth | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [data, h] = await Promise.all([
        getAdminAuditLogs(100),
        getDevHealth().catch(() => null),
      ]);
      setLogs(data);
      setHealth(h);
    } catch (err) {
      console.error("[AdminActivityDashboard] Failed to load:", err);
      setError("Could not load activity log.");
      toast.error("Could not load activity log.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">Activity Dashboard</h1>
            <p className="text-[14px] text-[#64748b] mt-1">
              Track admin actions and database changes made through the system.
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#bccbb9] bg-white px-3 py-1.5 text-[12px] font-medium text-[#374151] hover:bg-gray-50 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-[13px] text-[#92400e]">{error}</div>
        )}

        {/* System Health */}
        {health && (
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <Server size={16} className={health.status === "healthy" ? "text-[#006e2f]" : "text-[#ba1a1a]"} />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">System Status</p>
              </div>
              <p className={`text-[20px] font-bold mt-1 ${health.status === "healthy" ? "text-[#006e2f]" : "text-[#ba1a1a]"}`}>{health.status}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <Wifi size={16} className={health.dbConnected ? "text-[#006e2f]" : "text-[#ba1a1a]"} />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Database</p>
              </div>
              <p className={`text-[20px] font-bold mt-1 ${health.dbConnected ? "text-[#006e2f]" : "text-[#ba1a1a]"}`}>{health.dbConnected ? "Connected" : "Disconnected"}</p>
              <p className="text-[11px] text-[#64748b] mt-0.5">Latency: {health.dbLatency}ms</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-[#005ac2]" />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Uptime</p>
              </div>
              <p className="text-[20px] font-bold text-[#0b1c30] mt-1">{Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <Database size={16} className="text-[#b45309]" />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Total Actions</p>
              </div>
              <p className="text-[20px] font-bold text-[#0b1c30] mt-1">{logs.length}</p>
              <p className="text-[11px] text-[#64748b] mt-0.5">Recorded in audit_log</p>
            </div>
          </div>
        )}

        {!health && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Total Actions</p>
            <p className="text-[32px] font-bold text-[#0b1c30] leading-none mt-2">{logs.length}</p>
            <p className="text-[12px] font-medium text-[#006e2f] mt-1">Recorded in audit_log</p>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">User Actions</p>
            <p className="text-[32px] font-bold text-[#0b1c30] leading-none mt-2">
              {logs.filter((l) => l.action?.includes("user")).length}
            </p>
            <p className="text-[12px] font-medium text-[#005ac2] mt-1">Create / Update / Delete</p>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Role Actions</p>
            <p className="text-[32px] font-bold text-[#0b1c30] leading-none mt-2">
              {logs.filter((l) => l.action?.includes("role")).length}
            </p>
            <p className="text-[12px] font-medium text-[#b45309] mt-1">Create / Update / Delete</p>
          </div>
        </div>
        )}

        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#f1f5f9]">
            <h2 className="text-[16px] font-semibold text-[#0b1c30]">Activity Log</h2>
            <p className="text-[12px] text-[#64748b]">Recent admin actions recorded in the audit log.</p>
          </div>

          {loading && logs.length === 0 ? (
            <div className="p-10 text-center text-[13px] text-[#94a3b8]">
              <div className="w-5 h-5 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading activity log...
            </div>
          ) : (
            <div className="divide-y divide-[#f1f5f9]">
              {logs.length === 0 ? (
                <div className="px-6 py-12 text-center text-[13px] text-[#94a3b8]">
                  <Activity size={24} className="mx-auto mb-2 opacity-50" />
                  No activity recorded yet. Actions will appear here once you start managing roles and users.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="px-6 py-4 flex items-start gap-4 hover:bg-[#f8fafc] transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-[#0b1c30]">{getActionLabel(log.action)}</span>
                        {log.targetType && (
                          <span className="text-[11px] text-[#64748b]">
                            on {log.targetType}{log.targetId ? ` #${log.targetId.slice(0, 8)}` : ""}
                          </span>
                        )}
                      </div>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <p className="text-[11px] text-[#94a3b8] mt-0.5 truncate max-w-[500px]">
                          {JSON.stringify(log.details)}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-[#94a3b8]">{formatTimeAgo(log.createdAt)}</p>
                      <p className="text-[10px] text-[#bec6e0]">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}