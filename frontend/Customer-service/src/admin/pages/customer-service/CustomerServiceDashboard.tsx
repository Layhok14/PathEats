import { Flag, Clock, CheckCircle, Timer, Eye, UserSearch } from "lucide-react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";
import { ASSIGNED_COMPLAINTS, RECENT_UPDATES } from "../../../shared/constants/customerServiceData";

const STATUS_STYLE: Record<string, string> = {
  "OPEN":        "bg-red-100 text-red-700 border border-red-200",
  "IN PROGRESS": "bg-green-100 text-green-700 border border-green-200",
  "PENDING":     "bg-amber-100 text-amber-700 border border-amber-200",
  "RESOLVED":    "bg-gray-100 text-gray-600 border border-gray-200",
};

const PRIORITY_DOT: Record<string, string> = {
  High:   "#ef4444",
  Medium: "#f59e0b",
  Low:    "#94a3b8",
};

export default function CustomerServiceDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar
        searchPlaceholder="Search route data, users, or vendors…"
        actionLabel="↓ Export Reports"
        onAction={() => {}}
      />

      <div className="flex-1 p-8 flex flex-col gap-6">
        {/* Breadcrumb + header */}
        <div>
          <p className="text-[12px] text-[#94a3b8] mb-1">
            Customer Service &rsaquo; <span className="text-[#006e2f] font-medium">Dashboard</span>
          </p>
          <h1 className="text-[28px] font-bold text-[#0b1c30]">Customer Service Overview</h1>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Open Complaints"    value="24"   sub="! Critical"    subVariant="red"   topBorderColor="#ef4444" icon={<Flag size={18} />}        accent="#ef4444" />
          <MetricCard label="In Progress"        value="18"   sub="↑ +6.3%"      subVariant="green" topBorderColor="#006e2f" icon={<Clock size={18} />}       accent="#006e2f" />
          <MetricCard label="Resolved This Week" value="142"  sub="↑ +18%"       subVariant="green" topBorderColor="#005ac2" icon={<CheckCircle size={18} />} accent="#005ac2" />
          <MetricCard label="Avg. Response Time" value="2.1h" sub="↓ -5%"        subVariant="amber" topBorderColor="#f59e0b" icon={<Timer size={18} />}       accent="#f59e0b" />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-[1fr_280px] gap-4">
          {/* Assigned complaints table */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
              <h2 className="text-[15px] font-semibold text-[#0b1c30]">My Assigned Complaints</h2>
              <button
                onClick={() => navigate("/customer-service/complaints")}
                className="text-[12px] font-medium text-[#006e2f] hover:underline"
              >
                View All
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-[#f8fafc]">
                  {["ID", "USER", "SUBJECT", "STATUS", "PRIORITY"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ASSIGNED_COMPLAINTS.map((c) => (
                  <tr key={c.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors cursor-pointer" onClick={() => navigate("/customer-service/complaints")}>
                    <td className="px-5 py-4 font-mono text-[12px] font-semibold text-[#006e2f]">#{c.id}</td>
                    <td className="px-5 py-4 text-[13px] text-[#0b1c30]">{c.user}</td>
                    <td className="px-5 py-4 text-[13px] text-[#64748b] max-w-[180px] truncate">{c.subject}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[c.status] ?? ""}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PRIORITY_DOT[c.priority] ?? "#94a3b8" }} />
                        <span className="text-[13px]" style={{ color: PRIORITY_DOT[c.priority] ?? "#94a3b8" }}>{c.priority}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-4">
            {/* Quick actions */}
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5 flex flex-col gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Quick Actions</p>
              <button
                onClick={() => navigate("/customer-service/complaints")}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "#006e2f" }}
              >
                <Eye size={15} /> View All Complaints
              </button>
              <button
                onClick={() => navigate("/customer-service/users")}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "#006e2f" }}
              >
                <UserSearch size={15} /> Search User
              </button>
            </div>

            {/* Recent updates */}
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5 flex flex-col gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Recent Updates</p>
              <div className="flex flex-col gap-3">
                {RECENT_UPDATES.map((u) => (
                  <div key={u.id} className="flex gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#006e2f] shrink-0 mt-1.5" />
                    <div>
                      <p className="text-[13px] font-semibold text-[#0b1c30]">{u.title}</p>
                      <p className="text-[12px] text-[#64748b]">{u.sub}</p>
                      <p className="text-[11px] text-[#94a3b8] mt-0.5">{u.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-6 right-6 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity z-50" style={{ background: "#006e2f" }}>
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
      </button>
    </div>
  );
}
