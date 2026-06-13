import { useState } from "react";
import { Eye, Trash2, MoreHorizontal, CheckCircle, Ban } from "lucide-react";
import { Avatar } from "../../shared/components/Avatar";
import { Badge } from "../../shared/components/Badge";
import { Button } from "../../shared/components/Button";
import { SearchBar } from "../../shared/components/SearchBar";
import type { User, UserRole, UserStatus } from "../../shared/types";

const roleBadge: Record<UserRole, "blue" | "green" | "purple"> = {
  Student: "blue",
  Vendor: "green",
  Commuter: "purple",
  Admin: "gray" as never,
};

const statusDot: Record<UserStatus, string> = {
  Active: "#006e2f",
  Pending: "#f59e0b",
  Suspended: "#ef4444",
};

const TABS = ["All Members", "Students", "Vendors", "Commuters"] as const;
type Tab = (typeof TABS)[number];

const PAGE_SIZE = 5;

interface Props {
  users: User[];
}

export function UserTable({ users }: Props) {
  const [tab, setTab] = useState<Tab>("All Members");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = users.filter((u) => {
    const matchTab =
      tab === "All Members" ||
      (tab === "Students" && u.role === "Student") ||
      (tab === "Vendors" && u.role === "Vendor") ||
      (tab === "Commuters" && u.role === "Commuter");
    const matchQ = !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
    return matchTab && matchQ;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
      {/* Tabs + search */}
      <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-[#f1f5f9] flex-wrap gap-3">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setPage(1); }}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${tab === t ? "bg-[#006e2f] text-white" : "text-[#64748b] hover:bg-gray-100"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <SearchBar placeholder="Search users…" value={query} onChange={(v) => { setQuery(v); setPage(1); }} />
          <span className="text-[12px] text-[#94a3b8] whitespace-nowrap">
            Showing {visible.length} of {filtered.length.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="bg-[#f8fafc]">
            {["USER", "EMAIL ADDRESS", "ROLE", "STATUS", "ACTIONS"].map((h) => (
              <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.map((u) => (
            <tr key={u.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={u.name} initials={u.avatarInitials} avatarUrl={u.avatarUrl} color={u.avatarColor} />
                  <span className="text-[13px] font-medium text-[#0b1c30]">{u.name}</span>
                </div>
              </td>
              <td className="px-6 py-3 text-[13px] text-[#64748b]">{u.email}</td>
              <td className="px-6 py-3">
                <Badge label={u.role} variant={roleBadge[u.role] ?? "gray"} />
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: statusDot[u.status] }} />
                  <span className="text-[13px]" style={{ color: statusDot[u.status] }}>{u.status}</span>
                </div>
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded text-[#64748b] hover:bg-gray-100 transition-colors" title="View">
                    <Eye size={15} />
                  </button>
                  <button className="p-1.5 rounded text-[#006e2f] hover:bg-green-50 transition-colors" title="Approve">
                    <CheckCircle size={15} />
                  </button>
                  <button className="p-1.5 rounded text-[#ef4444] hover:bg-red-50 transition-colors" title="Suspend">
                    <Ban size={15} />
                  </button>
                  <button className="p-1.5 rounded text-[#94a3b8] hover:bg-gray-100 transition-colors" title="More">
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-[#f1f5f9]">
        <p className="text-[12px] text-[#94a3b8]">Page {page} of {Math.max(totalPages, 1)}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <Button size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
