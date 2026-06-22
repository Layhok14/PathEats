import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "../../components/TopBar";
import {
  getAdminVendorManagementOverview,
  type AdminVendorOverviewRow,
} from "../../services/adminDashboardService";
import { DetailModal, SummaryCell } from "./devShared";

const PAGE_SIZE = 8;

export default function DeveloperVendorManagementPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<AdminVendorOverviewRow[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeDetail, setActiveDetail] = useState<{ title: string; details: Record<string, unknown> | null } | null>(null);

  const loadOverview = async (searchText = query) => {
    try {
      setLoading(true);
      const overviewRows = await getAdminVendorManagementOverview(searchText);
      setRows(overviewRows);
    } catch (err) {
      console.error("[VendorManagementPage] Failed to load:", err);
      toast.error("Could not load vendor data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOverview(""); }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { loadOverview(query); setPage(1); }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const visibleRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar actionLabel="" searchPlaceholder="Search vendors…" />
      <div className="flex-1 p-6 flex flex-col gap-5">
        <div>
          <h1 className="text-[26px] font-bold text-[#0b1c30]">Vendor Management</h1>
          <p className="text-[13px] text-[#64748b] mt-0.5">Oversee vendor accounts, menu items, categories, hours, and reviews.</p>
        </div>

        {activeDetail && <DetailModal title={activeDetail.title} details={activeDetail.details} onClose={() => setActiveDetail(null)} />}

        <div className="flex items-center justify-between">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={14} />
            <input type="text" placeholder="Search vendors..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white w-full text-[#374151] placeholder:text-[#94a3b8]" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] table-fixed">
              <thead>
                <tr className="bg-[#f8fafc]">
                  <th className="w-[18%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Users</th>
                  <th className="w-[18%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Menu Items</th>
                  <th className="w-[18%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Categories</th>
                  <th className="w-[18%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Hours</th>
                  <th className="w-[18%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Reviews</th>
                  <th className="w-[10%] px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc]">
                    <td className="px-6 py-3"><SummaryCell tableName="users" cell={row.user} onView={() => setActiveDetail({ title: "users row details", details: row.user.details })} /></td>
                    <td className="px-6 py-3"><SummaryCell tableName="menu_items" cell={row.menuItem} onView={() => setActiveDetail({ title: "menu_items row details", details: row.menuItem.details })} /></td>
                    <td className="px-6 py-3"><SummaryCell tableName="place_categories" cell={row.placeCategory} onView={() => setActiveDetail({ title: "place_categories row details", details: row.placeCategory.details })} /></td>
                    <td className="px-6 py-3"><SummaryCell tableName="place_hours" cell={row.placeHour} onView={() => setActiveDetail({ title: "place_hours row details", details: row.placeHour.details })} /></td>
                    <td className="px-6 py-3"><SummaryCell tableName="reviews" cell={row.review} onView={() => setActiveDetail({ title: "reviews row details", details: row.review.details })} /></td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => {
                          const ownerId = (row.user.details as Record<string, unknown> | null)?.id as string | undefined;
                          if (ownerId) {
                            navigate(`/developer/vendors/${ownerId}`);
                          } else {
                            toast.error("Owner ID not found for this row.");
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#005a26]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleRows.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-[13px] text-[#94a3b8]">No vendor data found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
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
