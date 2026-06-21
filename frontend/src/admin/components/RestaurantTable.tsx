import { useState } from "react";
import { Star, MoreHorizontal } from "lucide-react";

const PAGE_SIZE = 5;

interface Restaurant { id: string; name: string; location: string; category: string; status: string; rating: number | null }
interface Props {
  restaurants: Restaurant[];
  categories: string[];
}

const statusDot: Record<string, string> = { Active: "#006e2f", Suspended: "#f59e0b", Inactive: "#94a3b8", Pending: "#005ac2" };

export function RestaurantTable({ restaurants, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");
  const categoryOptions = ["All", ...categories.filter((category) => category !== "All")];
  const [page, setPage] = useState(1);
  const filtered = restaurants.filter((r) => activeCategory === "All" || r.category === activeCategory);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
      <div className="flex items-start justify-between px-6 py-4 border-b border-[#f1f5f9] flex-wrap gap-3">
        <div><h2 className="text-[16px] font-semibold text-[#0b1c30]">Vendor Directory</h2><p className="text-[12px] text-[#64748b]">Manage and monitor all currently listed vendors</p></div>
        <div className="flex items-center gap-2 flex-wrap">
          {categoryOptions.map((c) => (<button key={c} onClick={() => { setActiveCategory(c); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${activeCategory === c ? "bg-[#006e2f] text-white" : "text-[#64748b] border border-[#e2e8f0] hover:bg-gray-50"}`}>{c}</button>))}
        </div>
      </div>
      <table className="w-full">
        <thead><tr className="bg-[#f8fafc]">{["VENDOR", "LOCATION", "CATEGORY", "STATUS", "RATING", "ACTIONS"].map((h) => (<th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>))}</tr></thead>
        <tbody>
          {visible.map((r) => (
            <tr key={r.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#005ac2] text-[13px] font-bold shrink-0">{r.name[0]}</div>
                  <div><p className="text-[13px] font-medium text-[#0b1c30]">{r.name}</p><p className="text-[11px] text-[#94a3b8]">ID: {r.id}</p></div>
                </div>
              </td>
              <td className="px-6 py-3 text-[13px] text-[#64748b]">{r.location}</td>
              <td className="px-6 py-3"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#dbeafe] text-[#1e40af]">{r.category}</span></td>
              <td className="px-6 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: statusDot[r.status] }} />
                  <span className="text-[12px] font-semibold" style={{ color: statusDot[r.status] }}>{r.status.toUpperCase()}</span>
                </div>
              </td>
              <td className="px-6 py-3">{r.rating ? <div className="flex items-center gap-1"><Star size={13} className="text-[#f59e0b] fill-[#f59e0b]" /><span className="text-[13px] font-medium text-[#0b1c30]">{r.rating}</span></div> : <span className="text-[12px] text-[#94a3b8]">N/A</span>}</td>
              <td className="px-6 py-3"><button className="p-1.5 rounded text-[#94a3b8] hover:bg-gray-100"><MoreHorizontal size={15} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-6 py-3 border-t border-[#f1f5f9]">
        <p className="text-[12px] text-[#94a3b8]">Showing {visible.length} of {filtered.length}</p>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p-1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p+1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
