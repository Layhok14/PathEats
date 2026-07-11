import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Users, Store, Star, Map, Clock, ArrowRight, Activity, Plus, Pencil, Trash2 } from "lucide-react";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { getAdminDashboardTelemetry, getAuditLogsByRole, type AdminDashboardTelemetry, type AuditLogEntry } from "../../services/adminDashboardService";
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

function getCrudInfo(action: string): { label: string; color: string; icon: typeof Plus } {
  if (action.startsWith("create")) return { label: "CREATE", color: "bg-green-50 text-[#006e2f]", icon: Plus };
  if (action.startsWith("update")) return { label: "UPDATE", color: "bg-blue-50 text-[#005ac2]", icon: Pencil };
  if (action.startsWith("delete")) return { label: "DELETE", color: "bg-red-50 text-[#ba1a1a]", icon: Trash2 };
  return { label: action.toUpperCase(), color: "bg-gray-50 text-[#64748b]", icon: Activity };
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
          getAuditLogsByRole("GLOBAL_ADMIN", 100).catch(() => []),
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

  const creates = auditLogs.filter((l) => l.action.startsWith("create")).length;
  const updates = auditLogs.filter((l) => l.action.startsWith("update")).length;
  const deletes = auditLogs.filter((l) => l.action.startsWith("delete")).length;

  const ACTIONS = [
    { label: "Admin Management", desc: "Manage admin roles & permissions", path: "/admin/manage", icon: Users },
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

        {/* Platform Stats */}
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

        {/* CRUD Activity Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
              <Plus size={16} className="text-[#006e2f]" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Created</p>
            </div>
            <p className="text-[24px] font-bold text-[#0b1c30] mt-1">{creates}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
              <Pencil size={16} className="text-[#005ac2]" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Updated</p>
            </div>
            <p className="text-[24px] font-bold text-[#0b1c30] mt-1">{updates}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
              <Trash2 size={16} className="text-[#ba1a1a]" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Deleted</p>
            </div>
            <p className="text-[24px] font-bold text-[#0b1c30] mt-1">{deletes}</p>
          </div>
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
              <h2 className="text-[16px] font-semibold text-[#0b1c30]">Recent Admin Activity</h2>
              <button
                onClick={() => navigate("/admin/audit")}
                className="text-[12px] font-medium text-[#006e2f] hover:text-[#005a26] inline-flex items-center gap-1"
              >
                View All <ArrowRight size={12} />
              </button>
            </div>
            {auditLogs.length === 0 ? (
              <div className="p-6 text-center text-[13px] text-[#94a3b8]">No recent activity.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f8fafc]">
                      {["Time", "Who", "Email", "Role", "Action", "Target"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.slice(0, 10).map((log) => {
                      const { label, color, icon: ActionIcon } = getCrudInfo(log.action);
                      const actorName = [log.actorFirstName, log.actorLastName].filter(Boolean).join(" ") || "—";
                      return (
                        <tr key={log.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                          <td className="px-5 py-3 text-[11px] text-[#64748b] whitespace-nowrap">
                            <span className="inline-flex items-center gap-1"><Clock size={11} /> {timeAgo(log.createdAt)}</span>
                          </td>
                          <td className="px-5 py-3 text-[12px] text-[#374151] font-medium">{actorName}</td>
                          <td className="px-5 py-3 text-[12px] text-[#64748b]">{log.actorEmail || "—"}</td>
                          <td className="px-5 py-3 text-[11px] text-[#64748b]">{log.roleScope || "—"}</td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${color}`}>
                              <ActionIcon size={10} />{label}
                            </span>
                            <p className="text-[10px] text-[#94a3b8] mt-0.5">{log.action.replace(/_/g, " ")}</p>
                          </td>
                          <td className="px-5 py-3 text-[12px] text-[#64748b]">
                            {log.targetType || "—"}
                            {log.targetId && <p className="text-[10px] text-[#94a3b8] font-mono truncate max-w-[120px]" title={log.targetId}>{log.targetId.slice(0, 8)}…</p>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Weekly growth chart */}
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
