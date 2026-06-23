import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Store, UserPlus, ShieldAlert, Loader, TrendingUp, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { getAdminAllReviews, getAdminUsers, type AdminReview, type AdminUser } from "../../services/adminDashboardService";

export default function BusinessDashboardPage() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<AdminUser[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminUsers().catch(() => [] as AdminUser[]),
      getAdminAllReviews().catch(() => [] as AdminReview[]),
    ]).then(([v, r]) => {
      setVendors(v.filter((u) => u.role === "VENDOR"));
      setReviews(r);
    }).catch(() => toast.error("Could not load business data"))
    .finally(() => setLoading(false));
  }, []);

  const stallsCount = vendors.length;
  const flaggedCount = reviews.filter((r) => r.flagged_at && !r.deleted_at).length;
  const removedCount = reviews.filter((r) => r.deleted_at).length;

  const cards = [
    {
      label: "Total Vendors",
      value: vendors.length,
      sub: "Registered vendor accounts",
      color: "#006e2f",
      icon: Store,
      link: "/admin/vendors",
    },
    {
      label: "Vendors Onboarded",
      value: "—",
      sub: "Telegram-connected accounts",
      color: "#005ac2",
      icon: UserPlus,
      link: "/admin/vendors/onboarding",
    },
    {
      label: "Flagged Reviews",
      value: flaggedCount,
      sub: "Awaiting moderation",
      color: "#f59e0b",
      icon: ShieldAlert,
      link: "/admin/vendors/moderation",
    },
    {
      label: "Removed Reviews",
      value: removedCount,
      sub: "Soft-deleted, ratings recalculated",
      color: "#ef4444",
      icon: TrendingUp,
      link: "/admin/vendors/moderation",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader className="animate-spin text-[#006e2f]" size={24} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#0b1c30]">Business Assistance Dashboard</h1>
          <p className="text-[14px] text-[#64748b] mt-1">Overview of vendor activity, onboarding, and review moderation.</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
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

        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#0b1c30]">Quick Actions</h2>
          </div>
          <div className="p-6 grid grid-cols-3 gap-4">
            {[
              { label: "Manage Vendors", desc: "View, create, and edit vendor accounts", path: "/admin/vendors", icon: Store },
              { label: "Onboarding Settings", desc: "Configure Telegram link and onboarding message", path: "/admin/vendors/onboarding", icon: UserPlus },
              { label: "Review Moderation", desc: "Flag or remove inappropriate reviews", path: "/admin/vendors/moderation", icon: ShieldAlert },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex items-start gap-4 rounded-lg border border-[#e2e8f0] p-4 text-left hover:border-[#006e2f] hover:bg-[#f0fdf4] transition-all cursor-pointer"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#006e2f]">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#0b1c30]">{action.label}</p>
                    <p className="text-[11px] text-[#64748b] mt-0.5">{action.desc}</p>
                  </div>
                  <ArrowRight size={16} className="shrink-0 mt-1 text-[#94a3b8]" />
                </button>
              );
            })}
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
                  {["Name", "Email", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vendors.slice(0, 10).map((v) => (
                  <tr key={v.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    <td className="px-5 py-3 text-[13px] font-medium text-[#0b1c30]">{v.name}</td>
                    <td className="px-5 py-3 text-[12px] text-[#64748b]">{v.email}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${v.status === "Active" ? "bg-green-50 text-[#006e2f]" : "bg-red-50 text-[#ba1a1a]"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${v.status === "Active" ? "bg-[#006e2f]" : "bg-[#ba1a1a]"}`} />
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {vendors.length === 0 && (
                  <tr><td colSpan={3} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">No vendors registered yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
