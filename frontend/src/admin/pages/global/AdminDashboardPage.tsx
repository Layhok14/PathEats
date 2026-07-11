import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Users, Store, Star, Map, Clock, ArrowRight, Activity } from "lucide-react";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { getAdminDashboardTelemetry, getAdminAuditLogs, type AdminDashboardTelemetry, type AuditLogEntry } from "../../services/adminDashboardService";
import { useAuth } from "../../../shared/hooks/useAuth";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [telemetry, setTelemetry] = useState<AdminDashboardTelemetry | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [t, logs] = await Promise.all([
          getAdminDashboardTelemetry().catch(() => null),
          getAdminAuditLogs(10).catch(() => []),
        ]);
        setTelemetry(t);
        setAuditLogs(logs);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const m = telemetry?.metrics;
  const stats = [
    { label: "Total Users", value: m?.totalUsers ?? 0, icon: Users, color: "#006e2f", link: "/admin/users" },
    { label: "Active Restaurants", value: m?.activeRestaurants ?? 0, icon: Store, color: "#005ac2", link: "/admin/vendors" },
    { label: "Reviews", value: m?.openComplaints ?? 0, icon: Star, color: "#b45309", link: "/admin/vendors/moderation" },
    { label: "Routes", value: m?.totalRoutes ?? 0, icon: Map, color: "#7c3aed", link: "/admin/business" },
  ];

  const ACTIONS = [
    { label: "Admin Management", desc: "Manage admin roles & permissions", path: "/admin", icon: Users },
    { label: "Consumer Management", desc: "Manage consumer accounts", path: "/admin/users", icon: Users },
    { label: "Vendor Management", desc: "Manage vendors & stalls", path: "/admin/vendors", icon: Store },
    { label: "Review Moderation", desc: "Flag or remove inappropriate reviews", path: "/admin/vendors/moderation", icon: Star },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#0b1c30]">
            Welcome back, {user?.firstName || "Admin"}
          </h1>
          <p className="text-[14px] text-[#64748b] mt-1">Here's what's happening on the platform today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={() => navigate(s.link)}
                className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4 text-left hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[12px] text-[#64748b] font-medium">{s.label}</p>
                  <Icon size={18} style={{ color: s.color }} />
                </div>
                <p className="text-[32px] font-bold text-[#0b1c30] mt-1">{s.value}</p>
              </button>
            );
          })}
        </div>

        {/* Quick Actions + Recent Activity */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#f1f5f9]">
              <h2 className="text-[16px] font-semibold text-[#0b1c30]">Quick Actions</h2>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {ACTIONS.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.label}
                    onClick={() => navigate(a.path)}
                    className="flex items-center gap-4 rounded-lg border border-[#e2e8f0] p-3 text-left hover:border-[#006e2f] hover:bg-[#f0fdf4] transition-all cursor-pointer"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#006e2f]">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#0b1c30]">{a.label}</p>
                      <p className="text-[11px] text-[#64748b]">{a.desc}</p>
                    </div>
                    <ArrowRight size={14} className="shrink-0 text-[#94a3b8]" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[#0b1c30]">Recent Activity</h2>
              <button
                onClick={() => navigate("/admin/activity-log")}
                className="text-[12px] font-medium text-[#006e2f] hover:text-[#005a26] inline-flex items-center gap-1"
              >
                View All <ArrowRight size={12} />
              </button>
            </div>
            {auditLogs.length === 0 ? (
              <div className="p-6 text-center text-[13px] text-[#94a3b8]">No recent activity.</div>
            ) : (
              <div className="divide-y divide-[#f1f5f9]">
                {auditLogs.slice(0, 6).map((log) => (
                  <div key={log.id} className="px-6 py-3 flex items-center gap-3">
                    <Activity size={14} className="shrink-0 text-[#005ac2]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#0b1c30] truncate">
                        <span className="font-medium">{log.adminId || "System"}</span>
                        {" "}<span className="text-[#64748b]">{log.action.replace(/_/g, " ")}</span>
                      </p>
                      {log.targetType && (
                        <p className="text-[11px] text-[#94a3b8] truncate">
                          {log.targetType}{log.targetId ? ` ${log.targetId.slice(0, 8)}...` : ""}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-[11px] text-[#94a3b8] inline-flex items-center gap-1">
                      <Clock size={11} />
                      {timeAgo(log.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Weekly growth chart (simple bar) */}
        {telemetry?.growth && telemetry.growth.length > 0 && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#f1f5f9]">
              <h2 className="text-[16px] font-semibold text-[#0b1c30]">Weekly Search Activity</h2>
            </div>
            <div className="p-6">
              <div className="flex items-end gap-3 h-[120px]">
                {telemetry.growth.map((g) => {
                  const max = Math.max(...telemetry.growth.map((x) => x.orders), 1);
                  const height = Math.max((g.orders / max) * 100, 4);
                  return (
                    <div key={g.day} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-medium text-[#64748b]">{g.orders}</span>
                      <div
                        className="w-full rounded-t-md bg-[#006e2f] transition-all"
                        style={{ height: `${height}%`, minHeight: 4, opacity: g.orders > 0 ? 1 : 0.3 }}
                      />
                      <span className="text-[10px] text-[#94a3b8]">{g.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
