import { useState } from "react";
import { Eye, Ban, MoreHorizontal, CheckCircle } from "lucide-react";

const TABS = ["All Members", "Students", "Vendors", "Commuters"] as const;
type Tab = (typeof TABS)[number];
const PAGE_SIZE = 5;

interface User { id: string; name: string; email: string; role: string; status: string; avatarInitials?: string; avatarColor?: string }
interface Props {
  users: User[];
  onActivate?: (id: string) => void;
  onSuspend?: (id: string) => void;
  onRoleChange?: (id: string, role: string) => void;
}

export function UserTable({ users, onActivate, onSuspend, onRoleChange }: Props) {
  const [tab, setTab] = useState<Tab>("All Members");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = users.filter((u) => {
    const roleMap: Record<Tab, string | null> = {
      "All Members": null,
      Students: "CONSUMER",
      Vendors: "VENDOR",
      Commuters: "CONSUMER",
    };
    const expectedRole = roleMap[tab];
    const matchTab = !expectedRole || u.role === expectedRole;
    const matchQ = !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
    return matchTab && matchQ;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-[#f1f5f9] flex-wrap gap-3">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button key={t} onClick={() => { setTab(t); setPage(1); }} className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${tab === t ? "bg-[#006e2f] text-white" : "text-[#64748b] hover:bg-gray-100"}`}>{t}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            <input type="text" placeholder="Search users…" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white w-[180px] text-[#374151] placeholder:text-[#94a3b8]" />
          </div>
        </div>
      </div>
      <table className="w-full">
        <thead><tr className="bg-[#f8fafc]">{["USER", "EMAIL ADDRESS", "ROLE", "STATUS", "ACTIONS"].map((h) => (<th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>))}</tr></thead>
        <tbody>
          {visible.map((u) => (
            <tr key={u.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-[12px] shrink-0" style={{ background: u.avatarColor ?? "#e5e7eb", color: "#374151" }}>{u.avatarInitials ?? u.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>
                  <span className="text-[13px] font-medium text-[#0b1c30]">{u.name}</span>
                </div>
              </td>
              <td className="px-6 py-3 text-[13px] text-[#64748b]">{u.email}</td>
              <td className="px-6 py-3"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#dbeafe] text-[#1e40af]">{u.role}</span></td>
              <td className="px-6 py-3"><span className="text-[13px]" style={{ color: u.status === "Active" ? "#006e2f" : u.status === "Pending" ? "#f59e0b" : "#ef4444" }}>{u.status}</span></td>
              <td className="px-6 py-3"><div className="flex items-center gap-2">
                <button className="p-1.5 rounded text-[#64748b] hover:bg-gray-100"><Eye size={15} /></button>
                <button
                  onClick={() => onActivate?.(u.id)}
                  className="p-1.5 rounded text-[#006e2f] hover:bg-green-50"
                  title="Activate user"
                >
                  <CheckCircle size={15} />
                </button>
                <button
                  onClick={() => onSuspend?.(u.id)}
                  className="p-1.5 rounded text-[#ef4444] hover:bg-red-50"
                  title="Suspend user"
                >
                  <Ban size={15} />
                </button>
                <select
                  value={u.role}
                  onChange={(event) => onRoleChange?.(u.id, event.target.value)}
                  className="text-[11px] rounded border border-[#e2e8f0] px-1 py-1 text-[#64748b]"
                  title="Change role"
                >
                  <option value="CONSUMER">Consumer</option>
                  <option value="VENDOR">Vendor</option>
                  <option value="GLOBAL_ADMIN">Global Admin</option>
                  <option value="CUSTOMER_SERVICE_ADMIN">CS Admin</option>
                  <option value="DEVELOPER_ADMIN">Dev Admin</option>
                </select>
                <button className="p-1.5 rounded text-[#94a3b8] hover:bg-gray-100"><MoreHorizontal size={15} /></button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-6 py-3 border-t border-[#f1f5f9]">
        <p className="text-[12px] text-[#94a3b8]">Page {page} of {Math.max(totalPages, 1)}</p>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p-1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p+1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
