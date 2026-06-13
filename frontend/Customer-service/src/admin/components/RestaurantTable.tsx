import { useState } from "react";
import { Star, MoreHorizontal } from "lucide-react";
import { Badge } from "../../shared/components/Badge";
import { Button } from "../../shared/components/Button";
import type { Restaurant, RestaurantCategory, RestaurantStatus } from "../../shared/types";

const CATEGORIES = ["All", "Noodles", "Rice", "Cafe", "Dessert", "Fine Dining", "Street Food"] as const;

const statusStyle: Record<RestaurantStatus, { dot: string; label: string }> = {
  Active: { dot: "#006e2f", label: "ACTIVE" },
  Suspended: { dot: "#f59e0b", label: "SUSPENDED" },
  Inactive: { dot: "#94a3b8", label: "INACTIVE" },
  Pending: { dot: "#005ac2", label: "PENDING" },
};

const categoryBadge: Record<RestaurantCategory, "blue" | "green" | "purple" | "amber" | "gray"> = {
  Noodles: "blue",
  Rice: "green",
  Cafe: "blue",
  Dessert: "purple",
  "Fine Dining": "amber",
  "Fast Casual": "gray",
  "Artisan Coffee": "amber",
  "Street Food": "amber",
};

const PAGE_SIZE = 5;

interface Props {
  restaurants: Restaurant[];
}

export function RestaurantTable({ restaurants }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = restaurants.filter(
    (r) => activeCategory === "All" || r.category === activeCategory
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
      <div className="flex items-start justify-between px-6 py-4 border-b border-[#f1f5f9] flex-wrap gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-[#0b1c30]">Active Directory</h2>
          <p className="text-[12px] text-[#64748b]">Manage and monitor all currently listed vendors</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => { setActiveCategory(c); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${activeCategory === c ? "bg-[#006e2f] text-white" : "text-[#64748b] border border-[#e2e8f0] hover:bg-gray-50"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="bg-[#f8fafc]">
            {["RESTAURANT", "LOCATION", "CATEGORY", "STATUS", "RATING", "ACTIONS"].map((h) => (
              <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.map((r) => {
            const s = statusStyle[r.status];
            return (
              <tr key={r.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#005ac2] text-[13px] font-bold shrink-0">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#0b1c30]">{r.name}</p>
                      <p className="text-[11px] text-[#94a3b8]">ID: {r.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-[13px] text-[#64748b]">{r.location}</td>
                <td className="px-6 py-3">
                  <Badge label={r.category} variant={categoryBadge[r.category] ?? "gray"} />
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.dot }} />
                    <span className="text-[12px] font-semibold" style={{ color: s.dot }}>{s.label}</span>
                  </div>
                </td>
                <td className="px-6 py-3">
                  {r.rating ? (
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-[#f59e0b] fill-[#f59e0b]" />
                      <span className="text-[13px] font-medium text-[#0b1c30]">{r.rating}</span>
                    </div>
                  ) : (
                    <span className="text-[12px] text-[#94a3b8]">N/A</span>
                  )}
                </td>
                <td className="px-6 py-3">
                  <button className="p-1.5 rounded text-[#94a3b8] hover:bg-gray-100 transition-colors">
                    <MoreHorizontal size={15} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex items-center justify-between px-6 py-3 border-t border-[#f1f5f9]">
        <p className="text-[12px] text-[#94a3b8]">Showing {visible.length} of {filtered.length} active vendors</p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          {Array.from({ length: Math.min(totalPages, 4) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded text-[12px] font-medium transition-colors ${page === p ? "bg-[#006e2f] text-white" : "text-[#64748b] hover:bg-gray-100"}`}
            >
              {p}
            </button>
          ))}
          {totalPages > 4 && <span className="text-[#94a3b8] text-[12px] px-1">…</span>}
          <Button size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
