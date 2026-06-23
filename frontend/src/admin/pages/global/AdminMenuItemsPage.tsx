import { useEffect, useState } from "react";
import { Search, Edit3, Check, X, Trash2, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { getAdminAllMenuItems, updateAdminMenuItem, type AdminMenuItemRow } from "../../services/adminDashboardService";
import api from "../../../shared/services/axiosService";

const PAGE_SIZE = 15;
const CATEGORIES = ["All", "main course", "drink", "snack", "dessert"];

export default function AdminMenuItemsPage() {
  const [items, setItems] = useState<AdminMenuItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", category: "" });

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getAdminAllMenuItems();
      setItems(data);
    } catch (err) {
      toast.error("Could not load menu items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, []);

  const filtered = items.filter((item) => {
    const matchSearch = !query || item.name.toLowerCase().includes(query.toLowerCase()) || item.placeName?.toLowerCase().includes(query.toLowerCase());
    const matchCat = catFilter === "All" || item.category === catFilter;
    return matchSearch && matchCat;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const startEdit = (item: AdminMenuItemRow) => {
    setEditingId(item.id);
    setEditForm({ name: item.name, price: String(item.price), category: item.category });
  };

  const saveEdit = async (item: AdminMenuItemRow) => {
    try {
      await updateAdminMenuItem(item.id, editForm);
      toast.success(`"${editForm.name}" updated (override).`);
      setEditingId(null);
      await loadItems();
    } catch (err) {
      toast.error("Update failed.");
    }
  };

  const toggleAvailability = async (item: AdminMenuItemRow) => {
    try {
      await updateAdminMenuItem(item.id, { isAvailable: !item.isAvailable });
      toast.success(item.isAvailable ? "Item disabled." : "Item enabled.");
      await loadItems();
    } catch (err) {
      toast.error("Toggle failed.");
    }
  };

  const handleDelete = async (item: AdminMenuItemRow) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
      await deleteAdminMenuItem(item.id);
      toast.success(`"${item.name}" deleted.`);
      await loadItems();
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-8 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">Menu Items</h1>
            <p className="text-[14px] text-[#64748b] mt-1">Absolute override control over all menu items across every stall.</p>
          </div>
          <button onClick={loadItems} className="inline-flex items-center gap-2 rounded-lg border border-[#bccbb9] bg-white px-3 py-1.5 text-[12px] font-medium hover:bg-gray-50 shadow-sm">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Total Items</p>
            <p className="text-[28px] font-bold text-[#0b1c30] mt-1">{items.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Available</p>
            <p className="text-[28px] font-bold text-[#006e2f] mt-1">{items.filter((i) => i.isAvailable).length}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Disabled</p>
            <p className="text-[28px] font-bold text-[#ba1a1a] mt-1">{items.filter((i) => !i.isAvailable).length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-[#f1f5f9] flex-wrap gap-3">
            <div className="flex gap-1">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => { setCatFilter(c); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium ${catFilter === c ? "bg-[#006e2f] text-white" : "text-[#64748b] hover:bg-gray-100"}`}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input type="text" placeholder="Search items or stall..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white w-[240px]" />
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-[13px] text-[#94a3b8]">Loading...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#f8fafc]">
                  {["ITEM", "STALL", "PRICE", "CATEGORY", "STATUS", "ACTIONS"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    {editingId === item.id ? (
                      <>
                        <td className="px-6 py-3"><input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className="border border-[#e2e8f0] rounded px-2 py-1 text-[12px] w-[160px]" /></td>
                        <td className="px-6 py-3 text-[12px] text-[#64748b]">{item.placeName}</td>
                        <td className="px-6 py-3"><input value={editForm.price} onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))} className="border border-[#e2e8f0] rounded px-2 py-1 text-[12px] w-[80px]" /></td>
                        <td className="px-6 py-3">
                          <select value={editForm.category} onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))} className="border border-[#e2e8f0] rounded px-2 py-1 text-[12px] bg-white">
                            <option value="main course">Main Course</option>
                            <option value="drink">Drink</option>
                            <option value="snack">Snack</option>
                            <option value="dessert">Dessert</option>
                          </select>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`text-[12px] font-medium ${item.isAvailable ? "text-[#006e2f]" : "text-[#ba1a1a]"}`}>{item.isAvailable ? "Available" : "Disabled"}</span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => saveEdit(item)} className="p-1.5 rounded text-[#006e2f] hover:bg-green-50" title="Save"><Save size={15} /></button>
                            <button onClick={() => setEditingId(null)} className="p-1.5 rounded text-[#64748b] hover:bg-gray-100" title="Cancel"><X size={15} /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.isAvailable ? "#006e2f" : "#e2e8f0" }} />
                            <span className="text-[13px] font-medium text-[#0b1c30]">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-[12px] text-[#64748b]">{item.placeName || "—"}</td>
                        <td className="px-6 py-3 text-[13px] font-mono text-[#0b1c30]">${parseFloat(String(item.price)).toFixed(2)}</td>
                        <td className="px-6 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#f1f5f9] text-[#475569]">{item.category}</span>
                        </td>
                        <td className="px-6 py-3">
                          <button onClick={() => toggleAvailability(item)} className={`px-3 py-1 rounded-lg text-[11px] font-semibold ${item.isAvailable ? "bg-green-50 text-[#006e2f] hover:bg-green-100" : "bg-red-50 text-[#ba1a1a] hover:bg-red-100"}`}>
                            {item.isAvailable ? "Available" : "Disabled"}
                          </button>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(item)} className="p-1.5 rounded text-[#005ac2] hover:bg-blue-50" title="Override"><Edit3 size={15} /></button>
                            <button onClick={() => handleDelete(item)} className="p-1.5 rounded text-[#ef4444] hover:bg-red-50" title="Delete"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-[13px] text-[#94a3b8]">No menu items found.</td></tr>
                )}
              </tbody>
            </table>
          )}

          <div className="flex items-center justify-between px-6 py-3 border-t border-[#f1f5f9]">
            <p className="text-[12px] text-[#94a3b8]">Page {page} of {totalPages} ({filtered.length} items)</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}