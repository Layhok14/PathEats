import { useState } from "react";
import { Plus, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";
import { Avatar } from "../../../shared/components/Avatar";
import { Button } from "../../../shared/components/Button";
import { CS_TICKETS } from "../../../shared/constants/customerServiceData";
import type { TicketPriority, TicketStatus } from "../../../shared/constants/customerServiceData";

const PRIORITY_LEVELS = ["All", "Critical", "High", "Medium", "Low"] as const;
const STATUS_OPTIONS = ["All Statuses", "Open", "In Progress", "Resolved", "Pending"] as const;

const PRIORITY_BADGE: Record<TicketPriority, string> = {
  CRITICAL: "bg-red-100 text-red-700",
  HIGH:     "bg-amber-100 text-amber-700",
  MEDIUM:   "bg-blue-100 text-blue-700",
  LOW:      "bg-gray-100 text-gray-500",
};

const STATUS_DOT: Record<TicketStatus, string> = {
  Open:        "#ef4444",
  "In Progress": "#f59e0b",
  Resolved:    "#006e2f",
  Pending:     "#ef4444",
};

const PAGE_SIZE = 5;

export default function ComplaintsPage() {
  const [priority, setPriority] = useState("All");
  const [status, setStatus]     = useState("All Statuses");
  const [page, setPage]         = useState(1);

  const filtered = CS_TICKETS.filter((t) => {
    const matchP = priority === "All" || t.priority === priority.toUpperCase();
    const matchS = status === "All Statuses" || t.status === status;
    return matchP && matchS;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible    = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar searchPlaceholder="Search tickets…" actionLabel="" />

      <div className="flex-1 p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">Ticket Resolution Center</h1>
            <p className="text-[13px] text-[#64748b] mt-1">Manage and respond to system-wide customer and vendor complaints.</p>
          </div>
          <Button icon={<Plus size={14} />}>New Ticket</Button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Critical Issues"  value="12"   sub="↑ +3%"    subVariant="red"   topBorderColor="#ef4444" accent="#ef4444" />
          <MetricCard label="In Progress"      value="48"   sub="— Stable" subVariant="amber" topBorderColor="#f59e0b" accent="#f59e0b" />
          <MetricCard label="Resolved Today"   value="124"  sub="↑ +12%"   subVariant="green" topBorderColor="#006e2f" accent="#006e2f" />
          <MetricCard label="Avg. Resolution"  value="4.2h" sub="↓ -15m"   subVariant="blue"  topBorderColor="#005ac2" accent="#005ac2" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5 flex items-center gap-6 flex-wrap">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold text-[#64748b]">Priority Level</p>
            <div className="flex gap-1">
              {PRIORITY_LEVELS.map((p) => (
                <button
                  key={p}
                  onClick={() => { setPriority(p); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${
                    priority === p
                      ? "bg-[#006e2f] text-white border-[#006e2f]"
                      : "border-[#e2e8f0] text-[#64748b] hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold text-[#64748b]">Ticket Status</p>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="text-[12px] px-3 py-1.5 border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] min-w-[130px]"
            >
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <button className="ml-auto flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] rounded-lg text-[12px] font-medium text-[#64748b] hover:bg-gray-50 transition-colors">
            <SlidersHorizontal size={13} /> Advanced Filters
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc]">
                {["TICKET ID", "USER NAME", "SUBJECT", "PRIORITY", "TIME OPEN", "STATUS"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((t) => (
                <tr key={t.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-3 font-mono text-[12px] font-semibold text-[#006e2f]">#{t.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={t.user} initials={t.initials} color={t.avatarColor} size="sm" />
                      <span className="text-[13px] font-medium text-[#0b1c30]">{t.user}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-[#64748b] max-w-[220px] truncate">{t.subject}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${PRIORITY_BADGE[t.priority]}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-[#64748b]">{t.timeOpen}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_DOT[t.status] }} />
                      <span className="text-[13px]" style={{ color: STATUS_DOT[t.status] }}>{t.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#f1f5f9]">
            <p className="text-[12px] text-[#94a3b8]">Showing {visible.length} of {filtered.length} tickets</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-7 h-7 flex items-center justify-center rounded border border-[#e2e8f0] text-[#64748b] hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-7 h-7 flex items-center justify-center rounded border border-[#e2e8f0] text-[#64748b] hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
