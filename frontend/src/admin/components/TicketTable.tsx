import { useState } from "react";

type TicketPriority = "Critical" | "High" | "Medium" | "Low";
interface Ticket { id: string; user: string; userType: string; subject: string; description: string; priority: TicketPriority; status: string; timeOpen: string }
interface Props { tickets: Ticket[] }

const priorityColors: Record<TicketPriority, string> = { Critical: "bg-[#fee2e2] text-[#991b1b]", High: "bg-[#fef3c7] text-[#92400e]", Medium: "bg-[#f1f5f9] text-[#475569]", Low: "bg-[#dbeafe] text-[#1e40af]" };
const PAGE_SIZE = 5;

export function TicketTable({ tickets }: Props) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"All" | "Open" | "In Progress">("All");
  const filtered = tickets.filter((t) => filter === "All" || t.status === filter);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-semibold text-[#0b1c30]">Active Tickets</h2>
          <span className="flex items-center gap-1 text-[11px] text-[#006e2f] font-medium bg-green-50 border border-green-200 px-2 py-0.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-[#006e2f] inline-block animate-pulse" />Live Feed</span>
        </div>
        <div className="flex gap-1">
          {(["All", "Open", "In Progress"] as const).map((f) => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${filter === f ? "bg-[#006e2f] text-white" : "text-[#64748b] hover:bg-gray-100"}`}>{f}</button>
          ))}
        </div>
      </div>
      <table className="w-full">
        <thead><tr className="bg-[#f8fafc]">{["TICKET ID", "USER / VENDOR", "SUBJECT", "PRIORITY", "TIME OPEN", "ACTIONS"].map((h) => (<th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>))}</tr></thead>
        <tbody>
          {visible.map((t) => (
            <tr key={t.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
              <td className="px-5 py-3 text-[13px] font-mono font-medium text-[#005ac2]">#{t.id}</td>
              <td className="px-5 py-3 text-[13px] text-[#0b1c30]">{t.user}</td>
              <td className="px-5 py-3"><p className="text-[13px] font-medium text-[#0b1c30]">{t.subject}</p><p className="text-[11px] text-[#94a3b8] truncate max-w-[180px]">{t.description}</p></td>
              <td className="px-5 py-3"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${priorityColors[t.priority]}`}>{t.priority}</span></td>
              <td className="px-5 py-3 text-[12px] text-[#64748b]">{t.timeOpen}</td>
              <td className="px-5 py-3"><div className="flex gap-2">
                <button className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50">Assign</button>
                <button className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26]">Resolve</button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-5 py-3 border-t border-[#f1f5f9]">
        <p className="text-[12px] text-[#94a3b8]">Showing {visible.length} of {filtered.length}</p>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p-1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p+1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
