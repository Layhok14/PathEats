import { useEffect, useState } from "react";
import { Flag, Trash2, Search, RotateCcw, ShieldAlert, Download } from "lucide-react";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { toast } from "sonner";
import {
  getAdminAllReviews,
  flagAdminReview,
  unflagAdminReview,
  removeAdminReview,
  type AdminReview,
} from "../../services/adminDashboardService";
import { exportXlsx } from "../../../shared/utils/exportXlsx";

const PAGE_SIZE = 15;

export default function ReviewModerationPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "flagged" | "active" | "removed">("all");
  const [page, setPage] = useState(1);
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; placeName: string } | null>(null);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getAdminAllReviews();
      setReviews(data);
    } catch {
      toast.error("Could not load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, []);

  const filtered = reviews.filter((r) => {
    const matchesSearch =
      !query ||
      r.body?.toLowerCase().includes(query.toLowerCase()) ||
      r.user_name?.toLowerCase().includes(query.toLowerCase()) ||
      r.place_name?.toLowerCase().includes(query.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "flagged" && r.flagged_at) ||
      (filter === "active" && !r.flagged_at && !r.deleted_at) ||
      (filter === "removed" && r.deleted_at);

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFlag = async (id: string) => {
    try {
      await flagAdminReview(id);
      toast.success("Review flagged for review.");
      await loadReviews();
    } catch {
      toast.error("Could not flag review.");
    }
  };

  const handleUnflag = async (id: string) => {
    try {
      await unflagAdminReview(id);
      toast.success("Review flag cleared.");
      await loadReviews();
    } catch {
      toast.error("Could not unflag review.");
    }
  };

  const handleRemove = async (id: string, placeName: string) => {
    setConfirmTarget({ id, placeName });
  };

  const confirmRemove = async () => {
    if (!confirmTarget) return;
    try {
      await removeAdminReview(confirmTarget.id);
      toast.success("Review removed.");
      await loadReviews();
    } catch {
      toast.error("Could not remove review.");
    } finally {
      setConfirmTarget(null);
    }
  };

  function exportReviews() {
    const active = reviews.filter((r) => !r.deleted_at);
    const removed = reviews.filter((r) => r.deleted_at);
    exportXlsx([
      {
        name: "All Reviews",
        headers: ["User", "Stall", "Rating", "Review", "Date", "Status"],
        rows: reviews.map((r) => [
          r.user_name, r.place_name, r.stars, r.body || "",
          new Date(r.created_at).toLocaleDateString(),
          r.deleted_at ? "Removed" : r.flagged_at ? "Flagged" : "Active",
        ]),
      },
      {
        name: "Active",
        headers: ["User", "Stall", "Rating", "Review", "Date"],
        rows: active.map((r) => [
          r.user_name, r.place_name, r.stars, r.body || "",
          new Date(r.created_at).toLocaleDateString(),
        ]),
      },
      {
        name: "Removed",
        headers: ["User", "Stall", "Rating", "Review", "Date"],
        rows: removed.map((r) => [
          r.user_name, r.place_name, r.stars, r.body || "",
          new Date(r.created_at).toLocaleDateString(),
        ]),
      },
    ], "reviews.xlsx");
  }

  const flaggedCount = reviews.filter((r) => r.flagged_at && !r.deleted_at).length;
  const removedCount = reviews.filter((r) => r.deleted_at).length;

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">Review Moderation</h1>
            <p className="text-[14px] text-[#64748b] mt-1">
              Flag inappropriate reviews, clear flags, or remove reviews. Removing a review recalculates the stall's rating.
            </p>
          </div>
          <button onClick={exportReviews} className="inline-flex items-center gap-1.5 rounded-lg border border-[#bccbb9] px-3 py-1.5 text-[12px] font-semibold text-[#374151] bg-white hover:bg-gray-50 shrink-0">
            <Download size={14} /> Export
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4">
            <p className="text-[12px] text-[#64748b] font-medium">Total Reviews</p>
            <p className="text-[28px] font-bold text-[#0b1c30] mt-1">{reviews.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4">
            <p className="text-[12px] text-[#64748b] font-medium">Flagged</p>
            <p className="text-[28px] font-bold text-[#f59e0b] mt-1">{flaggedCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4">
            <p className="text-[12px] text-[#64748b] font-medium">Removed</p>
            <p className="text-[28px] font-bold text-[#ef4444] mt-1">{removedCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9] flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-[#e2e8f0] bg-white p-1">
                {(["all", "active", "flagged", "removed"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => { setFilter(f); setPage(1); }}
                    className={`rounded-md px-3 py-1 text-[12px] font-medium capitalize ${filter === f ? "bg-[#006e2f] text-white" : "text-[#64748b] hover:bg-[#f1f5f9]"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={14} />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search reviews, users, stalls..."
                className="pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white w-[260px] text-[#374151] placeholder:text-[#94a3b8]"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center">
              <LoadingSpinner message="Loading reviews..." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    {["User", "Stall", "Rating", "Review", "Date", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r) => (
                    <tr key={r.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                      <td className="px-5 py-3 text-[12px] font-medium text-[#0b1c30]">{r.user_name}</td>
                      <td className="px-5 py-3 text-[12px] text-[#64748b]">{r.place_name}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#fffbeb] px-2 py-0.5 text-[12px] font-semibold text-[#f59e0b]">
                          {r.stars} ★
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-[#475569] max-w-[280px] truncate">{r.body || "—"}</td>
                      <td className="px-5 py-3 text-[12px] text-[#94a3b8]">{new Date(r.created_at).toLocaleDateString()}</td>
                      <td className="px-5 py-3">
                        {r.deleted_at ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-[#ef4444]">
                            <Trash2 size={11} /> Removed
                          </span>
                        ) : r.flagged_at ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-[#f59e0b]">
                            <Flag size={11} /> Flagged
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-[#006e2f]">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          {r.deleted_at ? (
                            <span className="text-[11px] text-[#94a3b8]">—</span>
                          ) : r.flagged_at ? (
                            <>
                              <button
                                onClick={() => handleUnflag(r.id)}
                                title="Clear flag"
                                className="p-1.5 rounded text-[#006e2f] hover:bg-green-50"
                              >
                                <RotateCcw size={14} />
                              </button>
                              <button
                                onClick={() => handleRemove(r.id, r.place_name)}
                                title="Remove review"
                                className="p-1.5 rounded text-[#ef4444] hover:bg-red-50"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleFlag(r.id)}
                                title="Flag as inappropriate"
                                className="p-1.5 rounded text-[#f59e0b] hover:bg-amber-50"
                              >
                                <Flag size={14} />
                              </button>
                              <button
                                onClick={() => handleRemove(r.id, r.place_name)}
                                title="Remove review"
                                className="p-1.5 rounded text-[#ef4444] hover:bg-red-50"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visible.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">
                        <ShieldAlert size={24} className="mx-auto mb-2 text-[#94a3b8]" />
                        No reviews found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between px-6 py-3 border-t border-[#f1f5f9]">
            <p className="text-[12px] text-[#94a3b8]">Page {page} of {totalPages} ({filtered.length} total)</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={confirmTarget !== null}
        title="Remove Review"
        description="Remove this review and recalculate the stall rating?"
        itemName={confirmTarget?.placeName}
        confirmLabel="Remove"
        variant="danger"
        onConfirm={confirmRemove}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
