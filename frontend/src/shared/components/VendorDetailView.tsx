import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Search, Star, ListOrdered, Store, Plus, X, Eye } from "lucide-react";
import { toast } from "sonner";
import api from "../services/axiosService";
import { ReviewsManager } from "./ReviewsManager";
import { SuccessModal } from "./SuccessModal";
import type { AdminStallRow, AdminMenuItemRow } from "../../admin/services/adminDashboardService";

type Tab = "stalls" | "menu-items" | "reviews";

interface StallOptions {
  vendors: Array<{ id: string; name: string; email: string }>;
  categories: Array<{ id: string; name: string }>;
  places: Array<{ id: string; name: string }>;
}

interface VendorDetailViewProps {
  vendorId: string;
  backPath: string;
  title?: string;
  readonly?: boolean;
}

export function VendorDetailView({ vendorId, backPath, title = "Vendor Detail", readonly = false }: VendorDetailViewProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("stalls");
  const [stalls, setStalls] = useState<AdminStallRow[]>([]);
  const [menuItems, setMenuItems] = useState<AdminMenuItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [stallSearch, setStallSearch] = useState("");
  const [menuSearch, setMenuSearch] = useState("");
  const [options, setOptions] = useState<StallOptions | null>(null);

  // Modals
  const [editStall, setEditStall] = useState<AdminStallRow | null>(null);
  const [editMenuItem, setEditMenuItem] = useState<AdminMenuItemRow | null>(null);
  const [showCreateStall, setShowCreateStall] = useState(false);
  const [showCreateMenuItem, setShowCreateMenuItem] = useState(false);
  const [successState, setSuccessState] = useState<{ message: string } | null>(null);

  const loadData = () => {
    Promise.all([
      api.get<{ success: boolean; data: AdminStallRow[] }>(`/admin/stalls/owner/${vendorId}`),
      api.get<{ success: boolean; data: AdminMenuItemRow[] }>("/admin/menu-items"),
      api.get<{ success: boolean; data: StallOptions }>("/admin/stall-management/options"),
    ])
      .then(([stallRes, menuRes, optRes]) => {
        setStalls(stallRes.data.data || []);
        setMenuItems(menuRes.data.data || []);
        setOptions(optRes.data.data || null);
      })
      .catch((err) => {
        console.error("[VendorDetailView] Failed to load data:", err);
        toast.error("Could not load vendor data.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [vendorId]);

  const vendorStallIds = stalls.map((s) => s.id);

  const filteredStalls = stalls.filter((s) =>
    s.name.toLowerCase().includes(stallSearch.toLowerCase())
  );

  const filteredMenu = menuItems.filter((m) =>
    vendorStallIds.includes(m.placeId) &&
    (m.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
     m.placeName?.toLowerCase().includes(menuSearch.toLowerCase()))
  );

  const vendorName = stalls[0]?.ownerName || `Vendor #${vendorId.slice(0, 8)}`;

  // Stall actions
  const handleToggleStall = async (stall: AdminStallRow) => {
    try {
      await api.patch(`/admin/stalls/${stall.id}/toggle`);
      toast.success(`${stall.name} is now ${stall.isOpen ? "closed" : "open"}.`);
      loadData();
    } catch (err) {
      console.error("[VendorDetailView] Failed to toggle stall:", err);
      toast.error("Could not toggle stall status.");
    }
  };

  const handleDeleteStall = async (stall: AdminStallRow) => {
    if (!confirm(`Delete "${stall.name}"? This will also remove its menu items, hours, and reviews.`)) return;
    try {
      await api.delete(`/admin/stalls/${stall.id}`);
      toast.success(`"${stall.name}" deleted.`);
      loadData();
    } catch (err) {
      console.error("[VendorDetailView] Failed to delete stall:", err);
      toast.error("Could not delete stall.");
    }
  };

  const handleEditStallSave = async () => {
    if (!editStall) return;
    try {
      await api.patch(`/admin/stalls/${editStall.id}`, {
        name: editStall.name,
        description: editStall.description,
        address: editStall.address,
      });
      setEditStall(null);
      loadData();
      setSuccessState({ message: "Stall updated." });
    } catch (err) {
      console.error("[VendorDetailView] Failed to update stall:", err);
      toast.error("Could not update stall.");
    }
  };

  // Menu item actions
  const handleToggleMenuItem = async (item: AdminMenuItemRow) => {
    try {
      await api.patch(`/admin/menu-items/${item.id}`, { isAvailable: !item.isAvailable });
      toast.success(`"${item.name}" is now ${item.isAvailable ? "unavailable" : "available"}.`);
      loadData();
    } catch (err) {
      console.error("[VendorDetailView] Failed to toggle menu item:", err);
      toast.error("Could not toggle menu item.");
    }
  };

  const handleDeleteMenuItem = async (item: AdminMenuItemRow) => {
    if (!confirm(`Delete menu item "${item.name}"?`)) return;
    try {
      await api.delete(`/admin/stalls/menu-items/${item.id}`);
      toast.success(`"${item.name}" deleted.`);
      loadData();
    } catch (err) {
      console.error("[VendorDetailView] Failed to delete menu item:", err);
      toast.error("Could not delete menu item.");
    }
  };

  const handleEditMenuItemSave = async () => {
    if (!editMenuItem) return;
    try {
      await api.patch(`/admin/menu-items/${editMenuItem.id}`, {
        name: editMenuItem.name,
        price: editMenuItem.price,
        category: editMenuItem.category,
      });
      setEditMenuItem(null);
      loadData();
      setSuccessState({ message: "Menu item updated." });
    } catch (err) {
      console.error("[VendorDetailView] Failed to update menu item:", err);
      toast.error("Could not update menu item.");
    }
  };

  // Create stall modal
  const [createForm, setCreateForm] = useState({ categoryId: "", name: "" });
  const handleCreateStall = async () => {
    if (!createForm.name.trim() || !createForm.categoryId) {
      toast.error("Name and category required.");
      return;
    }
    try {
      await api.post("/admin/stalls", { ownerId: vendorId, ...createForm });
      setShowCreateStall(false);
      setCreateForm({ categoryId: "", name: "" });
      loadData();
      setSuccessState({ message: "Stall created." });
    } catch (err) {
      console.error("[VendorDetailView] Failed to create stall:", err);
      toast.error("Could not create stall.");
    }
  };

  // Create menu item modal
  const [menuCreateForm, setMenuCreateForm] = useState({ placeId: "", name: "", price: "", category: "snack" });
  const handleCreateMenuItem = async () => {
    if (!menuCreateForm.name.trim() || !menuCreateForm.price || !menuCreateForm.placeId) {
      toast.error("Name, price, and stall required.");
      return;
    }
    try {
      await api.post(`/admin/stalls/${menuCreateForm.placeId}/menu-items`, {
        name: menuCreateForm.name,
        price: menuCreateForm.price,
        category: menuCreateForm.category,
      });
      setShowCreateMenuItem(false);
      setMenuCreateForm({ placeId: "", name: "", price: "", category: "snack" });
      loadData();
      setSuccessState({ message: "Menu item created." });
    } catch (err) {
      console.error("[VendorDetailView] Failed to create menu item:", err);
      toast.error("Could not create menu item.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-[13px] text-[#94a3b8]">Loading vendor data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      {/* Header */}
      <div className="h-14 bg-white border-b border-[#e2e8f0] flex items-center px-8 gap-4 shrink-0">
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center gap-1.5 text-[12px] font-medium text-[#64748b] hover:text-[#0b1c30] transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div className="w-px h-6 bg-[#e2e8f0]" />
        <h1 className="text-[15px] font-bold text-[#0b1c30]">{vendorName}</h1>
        <span className="text-[11px] text-[#94a3b8]">Vendor ID: {vendorId.slice(0, 12)}...</span>
      </div>

      {/* Tab bar */}
      <div className="h-12 bg-white border-b border-[#e2e8f0] flex items-center px-8 gap-0 shrink-0">
        {([
          { key: "stalls" as Tab, label: "Stalls", icon: <Store size={14} /> },
          { key: "menu-items" as Tab, label: "Menu Items", icon: <ListOrdered size={14} /> },
          { key: "reviews" as Tab, label: "Reviews", icon: <Star size={14} /> },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-5 py-2.5 text-[12px] font-semibold border-b-2 transition-colors ${tab === t.key ? "border-[#006e2f] text-[#006e2f]" : "border-transparent text-[#64748b] hover:text-[#0b1c30]"}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-6">
        {/* Stalls tab */}
        {tab === "stalls" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#0b1c30]">Stalls ({filteredStalls.length})</h2>
              <div className="flex items-center gap-3">
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={14} />
                  <input
                    value={stallSearch}
                    onChange={(e) => setStallSearch(e.target.value)}
                    placeholder="Filter stalls..."
                    className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]"
                  />
                </div>
                {!readonly && (
                  <button
                    onClick={() => setShowCreateStall(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#005a26]"
                  >
                    <Plus size={14} /> Create Stall
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="bg-[#f8fafc]">
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Name</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Category</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Rating</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Status</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Address</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStalls.length === 0 ? (
                      <tr><td colSpan={6} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">No stalls found for this vendor.</td></tr>
                    ) : filteredStalls.map((stall) => (
                      <tr key={stall.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                        <td className="px-5 py-3">
                          <p className="text-[13px] font-medium text-[#0b1c30]">{stall.name}</p>
                          {stall.description && <p className="text-[11px] text-[#94a3b8]">{stall.description}</p>}
                        </td>
                        <td className="px-5 py-3 text-[12px] text-[#64748b]">{stall.category?.name || "—"}</td>
                        <td className="px-5 py-3 text-[13px] text-[#64748b]">{stall.rating != null ? Number(stall.rating).toFixed(1) : "—"}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${stall.isOpen ? "bg-green-50 text-[#006e2f]" : "bg-red-50 text-[#ba1a1a]"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${stall.isOpen ? "bg-[#006e2f]" : "bg-[#ba1a1a]"}`} />
                            {stall.isOpen ? "Open" : "Closed"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[12px] text-[#64748b] max-w-[200px] truncate">{stall.address || "—"}</td>
                        <td className="px-5 py-3">
                          {!readonly && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate(`/admin/restaurants/stall/${stall.id}`)}
                                className="px-2.5 py-1 rounded text-[11px] font-semibold bg-[#e8f5e9] text-[#006e2f] hover:bg-[#c8e6c9] flex items-center gap-1"
                              >
                                <Eye size={12} /> View
                              </button>
                              <button
                                onClick={() => handleToggleStall(stall)}
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold ${stall.isOpen ? "bg-red-50 text-[#ba1a1a] hover:bg-red-100" : "bg-green-50 text-[#006e2f] hover:bg-green-100"}`}
                              >
                                {stall.isOpen ? "Close" : "Open"}
                              </button>
                              <button
                                onClick={() => setEditStall(stall)}
                                className="px-2.5 py-1 rounded text-[11px] font-semibold bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteStall(stall)}
                                className="px-2.5 py-1 rounded text-[11px] font-semibold bg-red-50 text-[#ba1a1a] hover:bg-red-100"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items tab */}
        {tab === "menu-items" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#0b1c30]">Menu Items ({filteredMenu.length})</h2>
              <div className="flex items-center gap-3">
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={14} />
                  <input
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Filter menu items..."
                    className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]"
                  />
                </div>
                {!readonly && stalls.length > 0 && (
                  <button
                    onClick={() => setShowCreateMenuItem(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#005a26]"
                  >
                    <Plus size={14} /> Add Menu Item
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="bg-[#f8fafc]">
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Stall</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Name</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Price</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Category</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Available</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMenu.length === 0 ? (
                      <tr><td colSpan={6} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">No menu items found for this vendor.</td></tr>
                    ) : filteredMenu.map((item) => (
                      <tr key={item.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                        <td className="px-5 py-3 text-[12px] font-medium text-[#0b1c30]">{item.placeName}</td>
                        <td className="px-5 py-3">
                          <p className="text-[13px] font-medium text-[#0b1c30]">{item.name}</p>
                          {item.description && <p className="text-[11px] text-[#94a3b8]">{item.description}</p>}
                        </td>
                        <td className="px-5 py-3 text-[13px] text-[#0b1c30] font-medium">${item.price}</td>
                        <td className="px-5 py-3 text-[12px] text-[#64748b]">{item.category}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${item.isAvailable ? "bg-green-50 text-[#006e2f]" : "bg-gray-50 text-[#94a3b8]"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? "bg-[#006e2f]" : "bg-[#94a3b8]"}`} />
                            {item.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {!readonly && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleMenuItem(item)}
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold ${item.isAvailable ? "bg-gray-50 text-[#64748b] hover:bg-gray-100" : "bg-green-50 text-[#006e2f] hover:bg-green-100"}`}
                              >
                                {item.isAvailable ? "Disable" : "Enable"}
                              </button>
                              <button
                                onClick={() => setEditMenuItem(item)}
                                className="px-2.5 py-1 rounded text-[11px] font-semibold bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteMenuItem(item)}
                                className="px-2.5 py-1 rounded text-[11px] font-semibold bg-red-50 text-[#ba1a1a] hover:bg-red-100"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reviews tab */}
        {tab === "reviews" && (
          <ReviewsManager
            endpoint="/admin/reviews"
            title={`Reviews for ${vendorName}`}
            subtitle={`Customer feedback for all stalls owned by this vendor.`}
          />
        )}
      </div>

      {/* Edit Stall Modal */}
      {editStall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-[16px] font-bold text-[#0b1c30]">Edit Stall</h2>
              <button onClick={() => setEditStall(null)} className="p-1 rounded text-[#64748b] hover:bg-[#f1f5f9]"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Name</label>
                <input value={editStall.name} onChange={(e) => setEditStall({ ...editStall, name: e.target.value })} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Description</label>
                <textarea value={editStall.description || ""} onChange={(e) => setEditStall({ ...editStall, description: e.target.value })} rows={3} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f] resize-none" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Address</label>
                <input value={editStall.address || ""} onChange={(e) => setEditStall({ ...editStall, address: e.target.value })} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e2e8f0] px-6 py-4">
              <button onClick={() => setEditStall(null)} className="px-4 py-2 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50">Cancel</button>
              <button onClick={handleEditStallSave} className="px-4 py-2 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26]">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Menu Item Modal */}
      {editMenuItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-[16px] font-bold text-[#0b1c30]">Edit Menu Item</h2>
              <button onClick={() => setEditMenuItem(null)} className="p-1 rounded text-[#64748b] hover:bg-[#f1f5f9]"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Name</label>
                <input value={editMenuItem.name} onChange={(e) => setEditMenuItem({ ...editMenuItem, name: e.target.value })} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Price</label>
                <input value={editMenuItem.price} onChange={(e) => setEditMenuItem({ ...editMenuItem, price: e.target.value })} placeholder="0.00" inputMode="decimal" className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Category</label>
                <select value={editMenuItem.category} onChange={(e) => setEditMenuItem({ ...editMenuItem, category: e.target.value })} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]">
                  {["snack", "main course", "drink", "dessert"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e2e8f0] px-6 py-4">
              <button onClick={() => setEditMenuItem(null)} className="px-4 py-2 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50">Cancel</button>
              <button onClick={handleEditMenuItemSave} className="px-4 py-2 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26]">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Stall Modal */}
      {showCreateStall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-[16px] font-bold text-[#0b1c30]">Create Stall</h2>
              <button onClick={() => setShowCreateStall(false)} className="p-1 rounded text-[#64748b] hover:bg-[#f1f5f9]"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Stall Name *</label>
                <input value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} placeholder="Enter stall name" className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Category *</label>
                <select value={createForm.categoryId} onChange={(e) => setCreateForm({ ...createForm, categoryId: e.target.value })} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]">
                  <option value="">Select category...</option>
                  {(options?.categories || []).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-[#94a3b8]">Owner: {vendorName} (pre-filled)</p>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e2e8f0] px-6 py-4">
              <button onClick={() => setShowCreateStall(false)} className="px-4 py-2 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreateStall} className="px-4 py-2 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26]">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Menu Item Modal */}
      {showCreateMenuItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-[16px] font-bold text-[#0b1c30]">Add Menu Item</h2>
              <button onClick={() => setShowCreateMenuItem(false)} className="p-1 rounded text-[#64748b] hover:bg-[#f1f5f9]"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Stall *</label>
                <select value={menuCreateForm.placeId} onChange={(e) => setMenuCreateForm({ ...menuCreateForm, placeId: e.target.value })} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]">
                  <option value="">Select stall...</option>
                  {stalls.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Item Name *</label>
                <input value={menuCreateForm.name} onChange={(e) => setMenuCreateForm({ ...menuCreateForm, name: e.target.value })} placeholder="Enter item name" className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Price *</label>
                <input value={menuCreateForm.price} onChange={(e) => setMenuCreateForm({ ...menuCreateForm, price: e.target.value })} placeholder="0.00" inputMode="decimal" className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Category</label>
                <select value={menuCreateForm.category} onChange={(e) => setMenuCreateForm({ ...menuCreateForm, category: e.target.value })} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]">
                  {["snack", "main course", "drink", "dessert"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e2e8f0] px-6 py-4">
              <button onClick={() => setShowCreateMenuItem(false)} className="px-4 py-2 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreateMenuItem} className="px-4 py-2 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26]">Add</button>
            </div>
          </div>
        </div>
      )}

      {successState && (
        <SuccessModal
          message={successState.message}
          onContinue={() => setSuccessState(null)}
          onGoBack={() => setSuccessState(null)}
        />
      )}
    </div>
  );
}
