import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Ban, CheckCircle, Database, Download, Eye, Search, Settings, Users, X } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";
import {
  checkAdminDatabase,
  getAdminUserManagementOverview,
  updateAdminUserStatus,
  type AdminUserOverviewCell,
  type AdminUserOverviewRow,
} from "../../services/adminDashboardService";

const PAGE_SIZE = 10;
const STATUS_FILTERS = ["All", "Active", "Banned"] as const;

function formatValue(value: unknown) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function DetailModal({
  title,
  details,
  onClose,
}: {
  title: string;
  details: Record<string, unknown> | null;
  onClose: () => void;
}) {
  const entries = Object.entries(details ?? {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[680px] max-h-[calc(100vh-32px)] overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
          <div>
            <h2 className="text-[18px] font-bold text-[#0b1c30]">{title}</h2>
            <p className="text-[12px] text-[#64748b]">All available columns from this table row</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#334155] hover:bg-[#f1f5f9]">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-6">
          {entries.length === 0 ? (
            <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 py-6 text-center text-[13px] text-[#64748b]">
              No row exists for this user in this table.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-[#e2e8f0]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    <th className="w-[210px] px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Column</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(([key, value]) => (
                    <tr key={key} className="border-t border-[#f1f5f9]">
                      <td className="px-4 py-3 font-mono text-[12px] font-medium text-[#0b1c30]">{key}</td>
                      <td className="whitespace-pre-wrap break-words px-4 py-3 text-[12px] text-[#475569]">{formatValue(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCell({
  tableName,
  icon,
  cell,
  onView,
}: {
  tableName: string;
  icon: ReactNode;
  cell: AdminUserOverviewCell;
  onView: () => void;
}) {
  const hasDetails = Boolean(cell.details);

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#006e2f]">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-[#0b1c30]">{cell.label}</p>
          <p className="truncate text-[11px] text-[#64748b]">{cell.subLabel || tableName}</p>
        </div>
      </div>
      <button
        onClick={onView}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${hasDetails ? "text-[#006e2f] hover:bg-green-50" : "text-[#94a3b8] hover:bg-gray-50"}`}
        title={`View ${tableName} details`}
      >
        <Eye size={15} />
      </button>
    </div>
  );
}

export default function UserManagementPage() {
  const [rows, setRows] = useState<AdminUserOverviewRow[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [activeDetail, setActiveDetail] = useState<{ title: string; details: Record<string, unknown> | null } | null>(null);

  const loadOverview = async (searchText = query) => {
    try {
      setLoading(true);
      setMessage("");
      const [overviewRows, dbStatus] = await Promise.all([
        getAdminUserManagementOverview(searchText),
        checkAdminDatabase().catch(() => ({ connected: false, checkedAt: null })),
      ]);
      setRows(overviewRows);
      setDbConnected(dbStatus.connected);
    } catch (err) {
      console.error("[UserManagementPage] Failed to load overview:", err);
      const text = "Could not load user management data.";
      setMessage(text);
      toast.error(text);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview("");
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadOverview(query);
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Banned" ? row.status === "Suspended" : row.status === "Active");

      return matchesStatus;
    });
  }, [rows, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const visibleRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const usersWithPreferences = rows.filter((row) => row.preference.details).length;
  const bannedUsers = rows.filter((row) => row.status === "Suspended").length;

  const handleExport = () => {
    if (rows.length === 0) {
      toast.error("No user data to export.");
      return;
    }

    const csvRows = [
      ["User Name", "Email", "Theme", "Search Filter", "Search Query"],
      ...rows.map((row) => [
        row.user.label,
        row.user.subLabel ?? "",
        row.preference.label,
        row.search.label,
        row.search.subLabel ?? "",
      ]),
    ];
    const csv = csvRows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "patheat-user-management.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("User management data exported.");
  };

  const handleUserStatus = async (row: AdminUserOverviewRow) => {
    const nextStatus = row.status === "Suspended" ? "Active" : "Suspended";
    try {
      await updateAdminUserStatus(row.id, nextStatus);
      toast.success(nextStatus === "Active" ? "User unbanned." : "User banned.");
      await loadOverview(query);
    } catch (err) {
      console.error("[UserManagementPage] Failed to update user status:", err);
      toast.error("Could not update user account.");
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar searchPlaceholder="Search users, preferences, or search history..." />
      {activeDetail && (
        <DetailModal
          title={activeDetail.title}
          details={activeDetail.details}
          onClose={() => setActiveDetail(null)}
        />
      )}

      <div className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">User Management</h1>
            <p className="text-[14px] text-[#64748b] mt-1">
              {loading ? "Loading user tables..." : "View users, preferences, and search history with one-click row details."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold ${dbConnected ? "bg-green-50 text-[#006e2f]" : "bg-red-50 text-[#ba1a1a]"}`}>
              DB {dbConnected ? "Connected" : "Not Connected"}
            </span>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 shadow-sm px-3 py-1.5 text-[12px]"
            >
              <Download size={14} />Export CSV
            </button>
          </div>
        </div>

        {message && (
          <div className="rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-[13px] text-[#92400e]">
            {message}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <MetricCard label="Users Table" value={String(rows.length)} sub="Showing latest users" subVariant="green" topBorderColor="#006e2f" icon={<Users size={18} />} accent="#006e2f" />
          <MetricCard label="User Preferences" value={String(usersWithPreferences)} sub="Rows with theme data" subVariant="blue" topBorderColor="#005ac2" icon={<Settings size={18} />} accent="#005ac2" />
          <MetricCard label="Banned Users" value={String(bannedUsers)} sub="Visible for easy unban" subVariant="amber" topBorderColor="#f59e0b" icon={<Ban size={18} />} accent="#f59e0b" />
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9] flex-wrap gap-3">
            <div>
              <h2 className="text-[16px] font-semibold text-[#0b1c30]">User Table Viewer</h2>
              <p className="text-[12px] text-[#64748b]">Click the eye icon beside any value to see every column in that row.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-[#e2e8f0] bg-white p-1">
                {STATUS_FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setStatusFilter(filter);
                      setPage(1);
                    }}
                    className={`rounded-md px-3 py-1 text-[12px] font-medium ${statusFilter === filter ? "bg-[#006e2f] text-white" : "text-[#64748b] hover:bg-[#f1f5f9]"}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                <input
                  type="text"
                  placeholder="Search table data..."
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                  className="pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white w-[240px] text-[#374151] placeholder:text-[#94a3b8]"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-[13px] text-[#94a3b8]">
              <div className="w-5 h-5 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading user data from database...
            </div>
          ) : (
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-[#f8fafc]">
                <th className="w-[30%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Users</th>
                <th className="w-[27%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">User Preferences</th>
                <th className="w-[28%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Search History</th>
                <th className="w-[15%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Account</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                  <td className="px-6 py-3">
                    <SummaryCell
                      tableName="users"
                      icon={<Database size={16} />}
                      cell={row.user}
                      onView={() => setActiveDetail({ title: "users row details", details: row.user.details })}
                    />
                  </td>
                  <td className="px-6 py-3">
                    <SummaryCell
                      tableName="user_preferences"
                      icon={<Settings size={16} />}
                      cell={row.preference}
                      onView={() => setActiveDetail({ title: "user_preferences row details", details: row.preference.details })}
                    />
                  </td>
                  <td className="px-6 py-3">
                    <SummaryCell
                      tableName="search_history"
                      icon={<Search size={16} />}
                      cell={row.search}
                      onView={() => setActiveDetail({ title: "search_history row details", details: row.search.details })}
                    />
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleUserStatus(row)}
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12px] font-semibold ${row.status === "Suspended" ? "bg-green-50 text-[#006e2f] hover:bg-green-100" : "bg-red-50 text-[#ba1a1a] hover:bg-red-100"}`}
                    >
                      {row.status === "Suspended" ? <CheckCircle size={14} /> : <Ban size={14} />}
                      {row.status === "Suspended" ? "Unban" : "Ban"}
                    </button>
                    <p className={`mt-1 text-[11px] ${row.status === "Suspended" ? "text-[#ba1a1a]" : "text-[#64748b]"}`}>{row.status}</p>
                  </td>
                </tr>
              ))}
              {visibleRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-[13px] text-[#94a3b8]">
                    No user table data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          )}

          <div className="flex items-center justify-between px-6 py-3 border-t border-[#f1f5f9]">
            <p className="text-[12px] text-[#94a3b8]">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
              <button disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
