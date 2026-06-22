import { useEffect, useMemo, useState } from "react";
import { Search, Ban, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";
import {
  getAdminUserManagementOverview,
  updateAdminUserStatus,
  type AdminUserOverviewRow,
} from "../../services/adminDashboardService";
import { DetailModal, SummaryCell, USER_STATUS_FILTERS } from "./devShared";

export default function DeveloperUserManagementPage() {
  const [rows, setRows] = useState<AdminUserOverviewRow[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof USER_STATUS_FILTERS)[number]>("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeDetail, setActiveDetail] = useState<{ title: string; details: Record<string, unknown> | null } | null>(null);
  const PAGE_SIZE = 8;

  const loadOverview = async (searchText = query) => {
    try {
      setLoading(true);
      const overviewRows = await getAdminUserManagementOverview(searchText);
      setRows(overviewRows);
    } catch (err) {
      console.error("[UserManagementPage] Failed to load:", err);
      toast.error("Could not load user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOverview(""); }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { loadOverview(query); setPage(1); }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      statusFilter === "All" ||
      (statusFilter === "Banned" ? row.status === "Suspended" : row.status === "Active")
    );
  }, [rows, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const visibleRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const bannedUsers = rows.filter((row) => row.status === "Suspended").length;

  const handleUserStatus = async (row: AdminUserOverviewRow) => {
    const nextStatus = row.status === "Suspended" ? "Active" : "Suspended";
    try {
      await updateAdminUserStatus(row.id, nextStatus);
      toast.success(nextStatus === "Active" ? "User unbanned." : "User banned.");
      await loadOverview(query);
    } catch (err) {
      console.error("[UserManagementPage] Status update failed:", err);
      toast.error("Could not update user account.");
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar actionLabel="" searchPlaceholder="Search users…" />
      <div className="flex-1 p-6 flex flex-col gap-5">
        <div>
          <h1 className="text-[26px] font-bold text-[#0b1c30]">User Management</h1>
          <p className="text-[13px] text-[#64748b] mt-0.5">View, search, and manage platform users and their accounts.</p>
        </div>

        {activeDetail && <DetailModal title={activeDetail.title} details={activeDetail.details} onClose={() => setActiveDetail(null)} />}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-[#e2e8f0] bg-white p-1">
              {USER_STATUS_FILTERS.map((filter) => (
                <button key={filter} onClick={() => { setStatusFilter(filter); setPage(1); }}
                  className={`rounded-md px-3 py-1 text-[12px] font-medium ${statusFilter === filter ? "bg-[#006e2f] text-white" : "text-[#64748b] hover:bg-[#f1f5f9]"}`}>
                  {filter}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={14} />
              <input type="text" placeholder="Search users..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                className="pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white w-[220px] text-[#374151] placeholder:text-[#94a3b8]" />
            </div>
          </div>
          <MetricCard label="Banned" value={String(bannedUsers)} sub="" subVariant="amber" topBorderColor="#f59e0b" icon={<Ban size={14} />} accent="#f59e0b" />
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-[#f8fafc]">
                <th className="w-[30%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Users</th>
                <th className="w-[27%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Preferences</th>
                <th className="w-[28%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Search History</th>
                <th className="w-[15%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Account</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc]">
                  <td className="px-6 py-3">
                    <SummaryCell tableName="users" cell={row.user} onView={() => setActiveDetail({ title: "users row details", details: row.user.details })} />
                  </td>
                  <td className="px-6 py-3">
                    <SummaryCell tableName="user_preferences" cell={row.preference} onView={() => setActiveDetail({ title: "user_preferences row details", details: row.preference.details })} />
                  </td>
                  <td className="px-6 py-3">
                    <SummaryCell tableName="search_history" cell={row.search} onView={() => setActiveDetail({ title: "search_history row details", details: row.search.details })} />
                  </td>
                  <td className="px-6 py-3">
                    <button onClick={() => handleUserStatus(row)}
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12px] font-semibold ${row.status === "Suspended" ? "bg-green-50 text-[#006e2f] hover:bg-green-100" : "bg-red-50 text-[#ba1a1a] hover:bg-red-100"}`}>
                      {row.status === "Suspended" ? <CheckCircle size={14} /> : <Ban size={14} />}
                      {row.status === "Suspended" ? "Unban" : "Ban"}
                    </button>
                    <p className={`mt-1 text-[11px] ${row.status === "Suspended" ? "text-[#ba1a1a]" : "text-[#64748b]"}`}>{row.status}</p>
                  </td>
                </tr>
              ))}
              {visibleRows.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-[13px] text-[#94a3b8]">No user data found.</td></tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-6 py-3 border-t border-[#f1f5f9]">
            <p className="text-[12px] text-[#94a3b8]">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((c) => c - 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
              <button disabled={page >= totalPages} onClick={() => setPage((c) => c + 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
