import { useState } from "react";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";

const CS_TICKETS = [
  { id: "TK-8821", user: "Jane Doe", initials: "JD", avatarColor: "#dbeafe", subject: "Order #9921 marked as delivered but not received", priority: "CRITICAL", timeOpen: "2h 15m", status: "Open" },
  { id: "TK-8819", user: "Marcus Smith", initials: "MS", avatarColor: "#dcfce7", subject: "Vendor app crashing on route calculation", priority: "HIGH", timeOpen: "5h 40m", status: "In Progress" },
  { id: "TK-8815", user: "Anna Lee", initials: "AL", avatarColor: "#fef3c7", subject: "Incorrect dietary label on restaurant item", priority: "MEDIUM", timeOpen: "1d 2h", status: "Resolved" },
  { id: "TK-8812", user: "Robert King", initials: "RK", avatarColor: "#f3f4f6", subject: "Update email address request", priority: "LOW", timeOpen: "2d 4h", status: "Open" },
  { id: "TK-8809", user: "Priya Nair", initials: "PN", avatarColor: "#ede9fe", subject: "Payment charged twice for same order", priority: "CRITICAL", timeOpen: "30m", status: "In Progress" },
];

const priorityStyle: Record<string, string> = { CRITICAL: "bg-red-100 text-red-700", HIGH: "bg-amber-100 text-amber-700", MEDIUM: "bg-gray-100 text-gray-700", LOW: "bg-blue-100 text-blue-700" };

export default function ComplaintsPage() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar actionLabel="" searchPlaceholder="Search tickets by ID or user…" />
      <div className="flex-1 p-8 flex flex-col gap-6">
        <h1 className="text-[28px] font-bold text-[#0b1c30]">Complaints & Tickets</h1>
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Total Tickets" value="156" sub="All time" subVariant="neutral" topBorderColor="#64748b" />
          <MetricCard label="Open" value="42" sub="Requires action" subVariant="red" topBorderColor="#ef4444" />
          <MetricCard label="In Progress" value="28" sub="Being handled" subVariant="amber" topBorderColor="#f59e0b" />
          <MetricCard label="Resolved Today" value="15" sub="+3 vs yesterday" subVariant="green" topBorderColor="#006e2f" />
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-[#f1f5f9]">
            {["All", "Open", "In Progress", "Resolved"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${filter === f ? "bg-[#006e2f] text-white" : "text-[#64748b] hover:bg-gray-100"}`}>{f}</button>
            ))}
          </div>
          <table className="w-full">
            <thead><tr className="bg-[#f8fafc]">{["TICKET ID", "USER", "SUBJECT", "PRIORITY", "TIME OPEN", "STATUS"].map((h) => (<th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>))}</tr></thead>
            <tbody>
              {CS_TICKETS.filter(t => filter === "All" || t.status === filter).map((t) => (
                <tr key={t.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-3 font-mono text-[12px] text-[#006e2f]">#{t.id}</td>
                  <td className="px-5 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold" style={{ background: t.avatarColor }}>{t.initials}</div><span className="text-[13px] text-[#0b1c30]">{t.user}</span></div></td>
                  <td className="px-5 py-3 text-[13px] text-[#374151]">{t.subject}</td>
                  <td className="px-5 py-3"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${priorityStyle[t.priority]}`}>{t.priority}</span></td>
                  <td className="px-5 py-3 text-[12px] text-[#64748b]">{t.timeOpen}</td>
                  <td className="px-5 py-3"><span className="text-[12px] text-[#64748b]">{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
