import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Store, UserPlus, ShieldAlert, TrendingUp, ArrowRight, Activity, Clock, Plus, Pencil, Trash2 } from "lucide-react";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { toast } from "sonner";
import {
  getAdminAllReviews,
  getAdminAllStalls,
  getAdminUsersByRole,
  getAuditLogsByRole,
  type AdminStallRow,
  type AdminUser,
  type AdminReview,
  type AuditLogEntry,
} from "../../services/adminDashboardService";
import { portalPath, useManagementPortalBase } from "../../utils/portalPath";

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

export default function BusinessDashboardPage() {
  const navigate = useNavigate();
  const portalBase = useManagementPortalBase();
  const [vendors, setVendors] = useState<AdminUser[]>([]);
  const [stalls, setStalls] = useState<AdminStallRow[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminUsersByRole("VENDOR").catch(() => [] as AdminUser[]),
      getAdminAllStalls().catch(() => [] as AdminStallRow[]),
      getAdminAllReviews().catch(() => [] as AdminReview[]),
      getAuditLogsByRole("BUSINESS_ASSISTANCE", 100).catch(() => [] as AuditLogEntry[]),
    ]).then(([v, s, r, logs]) => {
      setVendors(v);
      setStalls(s);
      setReviews(r);
      setAuditLogs(logs);
    }).catch(() => toast.error("Could not load business data"))
    .finally(() => setLoading(false));
  }, []);

  const flaggedCount = reviews.filter((r) => r.flagged_at && !r.deleted_at).length;
  const openStallCount = stalls.filter((stall) => stall.isOpen).length;
  const stallCountByVendor = stalls.reduce<Record<string, number>>((counts, stall) => {
    counts[stall.ownerId] = (counts[stall.ownerId] ?? 0) + 1;
    return counts;
  }, {});

  const cards = [
    {
      label: "Total Vendors",
      value: vendors.length,
      sub: "Vendor accounts",
      color: "#006e2f",
      icon: Store,
      link: portalPath(portalBase, "/vendors"),
    },
    {
      label: "Total Stalls",
      value: stalls.length,
      sub: "Database stall records",
      color: "#005ac2",
      icon: Store,
      link: portalPath(portalBase, "/stalls"),
    },
    {
      label: "Open Stalls",
      value: openStallCount,
      sub: "Visible as currently open",
      color: "#f59e0b",
      icon: TrendingUp,
      link: portalPath(portalBase, "/stalls"),
    },
    {
      label: "Flagged Reviews",
      value: flaggedCount,
      sub: "Awaiting moderation",
      color: "#ef4444",
      icon: ShieldAlert,
      link: portalPath(portalBase, "/vendors/moderation"),
    },
  ];

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#0b1c30]">Business Assistance Dashboard</h1>
          <p className="text-[14px] text-[#64748b] mt-1">Overview of vendor activity, onboarding, and review moderation.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.label}
                onClick={() => navigate(c.link)}
                className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4 text-left hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[12px] text-[#64748b] font-medium">{c.label}</p>
                  <Icon size={18} style={{ color: c.color }} />
                </div>
                <p className="text-[32px] font-bold text-[#0b1c30] mt-1">{c.value}</p>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">{c.sub}</p>
              </button>
            );
          })}
        </div>

        {/* CRUD Activity Stats */}
        {auditLogs.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4">
              <div className="flex items-center gap-2 mb-1">
                <Plus size={16} className="text-[#006e2f]" />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Created</p>
              </div>
              <p className="text-[24px] font-bold text-[#0b1c30] mt-1">{auditLogs.filter((l) => l.action.startsWith("create")).length}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4">
              <div className="flex items-center gap-2 mb-1">
                <Pencil size={16} className="text-[#005ac2]" />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Updated</p>
              </div>
              <p className="text-[24px] font-bold text-[#0b1c30] mt-1">{auditLogs.filter((l) => l.action.startsWith("update")).length}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4">
              <div className="flex items-center gap-2 mb-1">
                <Trash2 size={16} className="text-[#ba1a1a]" />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Deleted</p>
              </div>
              <p className="text-[24px] font-bold text-[#0b1c30] mt-1">{auditLogs.filter((l) => l.action.startsWith("delete")).length}</p>
            </div>
          </div>
        )}

        {/* Quick Actions + Recent Activity */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#f1f5f9]">
              <h2 className="text-[16px] font-semibold text-[#0b1c30]">Quick Actions</h2>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {[
                { label: "Manage Vendors", desc: "View, create, and edit vendor accounts", path: portalPath(portalBase, "/vendors"), icon: Store },
                { label: "Manage Stalls", desc: "Inspect stall records, locations, and menu data", path: portalPath(portalBase, "/stalls"), icon: Store },
                { label: "Onboarding Settings", desc: "Configure Telegram link and onboarding message", path: portalPath(portalBase, "/vendors/onboarding"), icon: UserPlus },
                { label: "Review Moderation", desc: "Flag or remove inappropriate reviews", path: portalPath(portalBase, "/vendors/moderation"), icon: ShieldAlert },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-4 rounded-lg border border-[#e2e8f0] p-3 text-left hover:border-[#006e2f] hover:bg-[#f0fdf4] transition-all cursor-pointer"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#006e2f]">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#0b1c30]">{action.label}</p>
                      <p className="text-[11px] text-[#64748b]">{action.desc}</p>
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
                onClick={() => navigate(portalPath(portalBase, "/activity-log"))}
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
                    {auditLogs.slice(0, 8).map((log) => {
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

        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#f1f5f9]">
            <h2 className="text-[16px] font-semibold text-[#0b1c30]">Recent Vendors</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f8fafc]">
                  {["Name", "Email", "Status", "Stalls"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vendors.slice(0, 10).map((vendor) => (
                  <tr key={vendor.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    <td className="px-5 py-3 text-[13px] font-medium text-[#0b1c30]">{vendor.name}</td>
                    <td className="px-5 py-3 text-[12px] text-[#64748b]">{vendor.email}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${vendor.status === "Active" ? "bg-green-50 text-[#006e2f]" : "bg-red-50 text-[#ba1a1a]"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${vendor.status === "Active" ? "bg-[#006e2f]" : "bg-[#ba1a1a]"}`} />
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-[#64748b]">
                      {stallCountByVendor[vendor.id] ?? 0}
                    </td>
                  </tr>
                ))}
                {vendors.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">No vendors registered yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
