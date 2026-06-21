import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { Clock, Download, Eye, ListOrdered, Search, Star, Tags, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";
import {
  getAdminVendorManagementOverview,
  type AdminUserOverviewCell,
  type AdminVendorOverviewRow,
} from "../../services/adminDashboardService";

const PAGE_SIZE = 10;

function formatValue(value: unknown) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function DetailModal({ title, details, onClose }: { title: string; details: Record<string, unknown> | null; onClose: () => void }) {
  const entries = Object.entries(details ?? {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[720px] max-h-[calc(100vh-32px)] overflow-hidden rounded-xl bg-white shadow-xl">
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
              No row exists for this vendor in this table.
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

function SummaryCell({ tableName, icon, cell, onView }: { tableName: string; icon: ReactNode; cell: AdminUserOverviewCell; onView: () => void }) {
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

export default function RestaurantManagementPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<AdminVendorOverviewRow[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeDetail, setActiveDetail] = useState<{ title: string; details: Record<string, unknown> | null } | null>(null);

  const loadOverview = async (searchText = query) => {
    try {
      setLoading(true);
      setMessage("");
      const overviewRows = await getAdminVendorManagementOverview(searchText);
      setRows(overviewRows);
    } catch {
      const text = "Could not load vendor management data.";
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
    return rows;
  }, [rows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const visibleRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const withMenu = rows.filter((row) => row.menuItem.details).length;
  const withHours = rows.filter((row) => row.placeHour.details).length;
  const withReviews = rows.filter((row) => row.review.details).length;

  const handleExport = () => {
    if (rows.length === 0) {
      toast.error("No vendor data to export.");
      return;
    }

    const csvRows = [
      ["Vendor", "User", "Menu Item", "Place Category", "Place Hour", "Review"],
      ...rows.map((row) => [row.placeName, row.user.label, row.menuItem.label, row.placeCategory.label, row.placeHour.label, row.review.label]),
    ];
    const csv = csvRows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "patheat-vendor-management.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Vendor management data exported.");
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar actionLabel="" searchPlaceholder="Search vendors, menus, categories, hours, or reviews..." />
      {activeDetail && <DetailModal title={activeDetail.title} details={activeDetail.details} onClose={() => setActiveDetail(null)} />}

      <div className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">Vendor Management</h1>
            <p className="text-[14px] text-[#64748b] mt-1">
              {loading ? "Loading vendor tables..." : "Manage stalls and view vendor-related tables."}
            </p>
          </div>
          <button onClick={handleExport} className="inline-flex items-center gap-2 font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 shadow-sm px-3 py-1.5 text-[12px]">
            <Download size={14} />Export CSV
          </button>
        </div>

        {message && <div className="rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-[13px] text-[#92400e]">{message}</div>}

        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Vendors" value={String(rows.length)} sub="Based on places" subVariant="green" topBorderColor="#006e2f" icon={<UserRound size={18} />} accent="#006e2f" />
          <MetricCard label="Menu Items" value={String(withMenu)} sub="Rows with menu data" subVariant="blue" topBorderColor="#005ac2" icon={<ListOrdered size={18} />} accent="#005ac2" />
          <MetricCard label="Place Hours" value={String(withHours)} sub="Rows with opening hours" subVariant="amber" topBorderColor="#f59e0b" icon={<Clock size={18} />} accent="#f59e0b" />
          <MetricCard label="Reviews" value={String(withReviews)} sub="View only" subVariant="neutral" topBorderColor="#64748b" icon={<Star size={18} />} accent="#64748b" />
        </div>



        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9] flex-wrap gap-3">
            <div>
              <h2 className="text-[16px] font-semibold text-[#0b1c30]">Vendor Table Viewer</h2>
              <p className="text-[12px] text-[#64748b]">View-only. Click the eye icon to see every column in that row.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={14} />
              <input
                type="text"
                placeholder="Search vendor table data..."
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                className="pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white w-[260px] text-[#374151] placeholder:text-[#94a3b8]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1280px] table-fixed">
              <thead>
                <tr className="bg-[#f8fafc]">
                  <th className="w-[16%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Users</th>
                  <th className="w-[16%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Menu Items</th>
                  <th className="w-[16%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Place Categories</th>
                  <th className="w-[16%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Place Hours</th>
                  <th className="w-[16%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Reviews</th>
                  <th className="w-[20%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    <td className="px-6 py-3"><SummaryCell tableName="users" icon={<UserRound size={16} />} cell={row.user} onView={() => setActiveDetail({ title: "users row details", details: row.user.details })} /></td>
                    <td className="px-6 py-3"><SummaryCell tableName="menu_items" icon={<ListOrdered size={16} />} cell={row.menuItem} onView={() => setActiveDetail({ title: "menu_items row details", details: row.menuItem.details })} /></td>
                    <td className="px-6 py-3"><SummaryCell tableName="place_categories" icon={<Tags size={16} />} cell={row.placeCategory} onView={() => setActiveDetail({ title: "place_categories row details", details: row.placeCategory.details })} /></td>
                    <td className="px-6 py-3"><SummaryCell tableName="place_hours" icon={<Clock size={16} />} cell={row.placeHour} onView={() => setActiveDetail({ title: "place_hours row details", details: row.placeHour.details })} /></td>
                    <td className="px-6 py-3"><SummaryCell tableName="reviews" icon={<Star size={16} />} cell={row.review} onView={() => setActiveDetail({ title: "reviews row details", details: row.review.details })} /></td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => navigate(`/admin/restaurants/manage/${row.id}`)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#005a26] transition-colors"
                      >
                        Manage Stall
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleRows.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-[13px] text-[#94a3b8]">No vendor table data found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

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
