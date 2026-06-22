import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SuccessModal } from "../../../shared/components/SuccessModal";
import { Plus, Search, List, Map, X } from "lucide-react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  getAdminAllStalls,
  createAdminStall,
  deleteAdminStall,
  toggleAdminStallStatus,
  updateAdminStall,
  getAdminAllMenuItems,
  createAdminStallMenuItem,
  deleteAdminStallMenuItem,
  updateAdminMenuItem,
  getStallManagementOptions,
  type AdminStallRow,
  type AdminMenuItemRow,
  type StallManagementOptions,
} from "../../services/adminDashboardService";
import { LIGHT_VECTOR_STYLE } from "../../../shared/constants/appConfig";

type Tab = "stalls" | "menu-items";
type ViewMode = "list" | "map";

const PAGE_SIZE = 10;

function StallMap({ stalls, loading = false, onPinClick }: { stalls: AdminStallRow[]; loading?: boolean; onPinClick: (id: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (mapRef.current || !containerRef.current || stalls.length === 0) return;

    const withLoc = stalls.filter((s) => s.location?.coordinates);
    if (withLoc.length === 0) return;

    const lngs = withLoc.map((s) => s.location!.coordinates[0]);
    const lats = withLoc.map((s) => s.location!.coordinates[1]);

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: LIGHT_VECTOR_STYLE,
      center: [(Math.min(...lngs) + Math.max(...lngs)) / 2, (Math.min(...lats) + Math.max(...lats)) / 2],
      zoom: 12,
      attributionControl: false,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    mapRef.current = map;

    map.on("load", () => {
      withLoc.forEach((stall) => {
        const el = document.createElement("div");
        const color = stall.isOpen ? "#006e2f" : "#d4183d";
        el.innerHTML = `<svg width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 28 12 28s12-19 12-28C24 5.4 18.6 0 12 0z" fill="${color}" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="white"/></svg>`;
        el.style.cursor = "pointer";
        el.title = stall.name;
        const marker = new maplibregl.Marker({ element: el.firstElementChild as HTMLElement })
          .setLngLat(stall.location!.coordinates as [number, number])
          .addTo(map);
        markersRef.current.push(marker);
      });
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [stalls]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 rounded-xl border border-[#e2e8f0] bg-white">
        <div className="w-6 h-6 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-[13px] text-[#94a3b8]">Loading stalls from database...</p>
      </div>
    );
  }

  if (stalls.length === 0) return <div className="flex items-center justify-center h-80 text-[13px] text-[#94a3b8]">No stalls to display on map.</div>;
  return <div ref={containerRef} className="w-full rounded-lg overflow-hidden" style={{ height: "480px" }} />;
}

export default function AdminStallManagePage() {
  const [tab, setTab] = useState<Tab>("stalls");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Stalls state
  const [stalls, setStalls] = useState<AdminStallRow[]>([]);
  const [stallSearch, setStallSearch] = useState("");
  const [stallPage, setStallPage] = useState(1);
  const [loadingStalls, setLoadingStalls] = useState(true);

  // Menu items state
  const [menuItems, setMenuItems] = useState<AdminMenuItemRow[]>([]);
  const [menuSearch, setMenuSearch] = useState("");
  const [menuPage, setMenuPage] = useState(1);
  const [loadingMenu, setLoadingMenu] = useState(true);

  // Options
  const [options, setOptions] = useState<StallManagementOptions | null>(null);

  // Edit modals
  const [editStall, setEditStall] = useState<AdminStallRow | null>(null);
  const [editMenuItem, setEditMenuItem] = useState<AdminMenuItemRow | null>(null);

  // Create modals
  const [showCreateStall, setShowCreateStall] = useState(false);
  const [showCreateMenuItem, setShowCreateMenuItem] = useState(false);

  // Success modal
  const [successState, setSuccessState] = useState<{ message: string } | null>(null);

  const loadStalls = async () => {
    try {
      setLoadingStalls(true);
      const data = await getAdminAllStalls();
      setStalls(data);
    } catch (err) {
      console.error("[AdminStallManagePage] Failed to load stalls:", err);
      toast.error("Could not load stalls.");
    } finally {
      setLoadingStalls(false);
    }
  };

  const loadMenuItems = async () => {
    try {
      setLoadingMenu(true);
      const data = await getAdminAllMenuItems();
      setMenuItems(data);
    } catch (err) {
      console.error("[AdminStallManagePage] Failed to load menu items:", err);
      toast.error("Could not load menu items.");
    } finally {
      setLoadingMenu(false);
    }
  };

  const loadOptions = async () => {
    try {
      const opts = await getStallManagementOptions();
      setOptions(opts);
    } catch (err) {
      console.error("[AdminStallManagePage] Failed to load options:", err);
    }
  };

  useEffect(() => {
    loadStalls();
    loadOptions();
  }, []);

  useEffect(() => {
    if (tab === "menu-items") loadMenuItems();
  }, [tab]);

  // Filtered data
  const filteredStalls = stalls.filter((s) =>
    s.name.toLowerCase().includes(stallSearch.toLowerCase()) ||
    s.ownerName?.toLowerCase().includes(stallSearch.toLowerCase()) ||
    s.ownerEmail?.toLowerCase().includes(stallSearch.toLowerCase())
  );
  const stallTotalPages = Math.max(1, Math.ceil(filteredStalls.length / PAGE_SIZE));
  const visibleStalls = filteredStalls.slice((stallPage - 1) * PAGE_SIZE, stallPage * PAGE_SIZE);

  const filteredMenu = menuItems.filter((m) =>
    m.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
    m.placeName?.toLowerCase().includes(menuSearch.toLowerCase()) ||
    m.category?.toLowerCase().includes(menuSearch.toLowerCase())
  );
  const menuTotalPages = Math.max(1, Math.ceil(filteredMenu.length / PAGE_SIZE));
  const visibleMenu = filteredMenu.slice((menuPage - 1) * PAGE_SIZE, menuPage * PAGE_SIZE);

  // Stall actions
  const handleToggleStall = async (stall: AdminStallRow) => {
    try {
      await toggleAdminStallStatus(stall.id);
      toast.success(`${stall.name} is now ${stall.isOpen ? "closed" : "open"}.`);
      await loadStalls();
    } catch (err) {
      console.error("[AdminStallManagePage] Failed to toggle stall:", err);
      toast.error("Could not toggle stall status.");
    }
  };

  const handleDeleteStall = async (stall: AdminStallRow) => {
    if (!confirm(`Delete "${stall.name}"? This will also remove its menu items, hours, and reviews.`)) return;
    try {
      await deleteAdminStall(stall.id);
      toast.success(`"${stall.name}" deleted.`);
      await loadStalls();
    } catch (err) {
      console.error("[AdminStallManagePage] Failed to delete stall:", err);
      toast.error("Could not delete stall.");
    }
  };

  const handleEditStallSave = async () => {
    if (!editStall) return;
    try {
      await updateAdminStall(editStall.id, {
        name: editStall.name,
        description: editStall.description,
        address: editStall.address,
      });
      setEditStall(null);
      await loadStalls();
      setSuccessState({ message: "Stall updated." });
    } catch (err) {
      console.error("[AdminStallManagePage] Failed to update stall:", err);
      toast.error("Could not update stall.");
    }
  };

  // Menu item actions
  const handleToggleMenuItem = async (item: AdminMenuItemRow) => {
    try {
      await updateAdminMenuItem(item.id, { isAvailable: !item.isAvailable });
      toast.success(`"${item.name}" is now ${item.isAvailable ? "unavailable" : "available"}.`);
      await loadMenuItems();
    } catch (err) {
      console.error("[AdminStallManagePage] Failed to toggle menu item:", err);
      toast.error("Could not toggle menu item.");
    }
  };

  const handleDeleteMenuItem = async (item: AdminMenuItemRow) => {
    if (!confirm(`Delete menu item "${item.name}"?`)) return;
    try {
      await deleteAdminStallMenuItem(item.id);
      toast.success(`"${item.name}" deleted.`);
      await loadMenuItems();
    } catch (err) {
      console.error("[AdminStallManagePage] Failed to delete menu item:", err);
      toast.error("Could not delete menu item.");
    }
  };

  const handleEditMenuItemSave = async () => {
    if (!editMenuItem) return;
    try {
      await updateAdminMenuItem(editMenuItem.id, {
        name: editMenuItem.name,
        price: editMenuItem.price,
        category: editMenuItem.category,
      });
      setEditMenuItem(null);
      await loadMenuItems();
      setSuccessState({ message: "Menu item updated." });
    } catch (err) {
      console.error("[AdminStallManagePage] Failed to update menu item:", err);
      toast.error("Could not update menu item.");
    }
  };

  // Create stall modal
  const [createForm, setCreateForm] = useState({ ownerId: "", categoryId: "", name: "" });
  const handleCreateStall = async () => {
    if (!createForm.name.trim() || !createForm.ownerId || !createForm.categoryId) {
      toast.error("Name, owner, and category required.");
      return;
    }
    try {
      await createAdminStall(createForm);
      setShowCreateStall(false);
      setCreateForm({ ownerId: "", categoryId: "", name: "" });
      await loadStalls();
      setSuccessState({ message: "Stall created." });
    } catch (err) {
      console.error("[AdminStallManagePage] Failed to create stall:", err);
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
      const { placeId: _p, ...menuPayload } = menuCreateForm;
      await createAdminStallMenuItem(menuCreateForm.placeId, menuPayload);
      setShowCreateMenuItem(false);
      setMenuCreateForm({ placeId: "", name: "", price: "", category: "snack" });
      await loadMenuItems();
      setSuccessState({ message: "Menu item created." });
    } catch (err) {
      console.error("[AdminStallManagePage] Failed to create menu item:", err);
      toast.error("Could not create menu item.");
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      {/* Tab bar */}
      <div className="h-14 bg-white border-b border-[#e2e8f0] flex items-center px-8 gap-0 shrink-0">
        {(["stalls", "menu-items"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setStallPage(1); setMenuPage(1); }}
            className={`px-5 py-3.5 text-[13px] font-semibold border-b-2 transition-colors ${tab === t ? "border-[#006e2f] text-[#006e2f]" : "border-transparent text-[#64748b] hover:text-[#0b1c30]"}`}
          >
            {t === "stalls" ? "Stalls" : "Menu Items"}
          </button>
        ))}
      </div>

      {/* Stalls tab */}
      {tab === "stalls" && (
        <div className="flex-1 p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h1 className="text-[22px] font-bold text-[#0b1c30]">All Stalls</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateStall(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#005a26]"
              >
                <Plus size={14} /> Create Stall
              </button>
            </div>
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={14} />
              <input
                value={stallSearch}
                onChange={(e) => { setStallSearch(e.target.value); setStallPage(1); }}
                placeholder="Search stalls..."
                className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]"
              />
            </div>
            <div className="flex rounded-lg border border-[#e2e8f0] bg-white p-0.5">
              {([["list", <List size={14} />], ["map", <Map size={14} />]] as const).map(([mode, icon]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-[12px] font-medium ${viewMode === mode ? "bg-[#006e2f] text-white" : "text-[#64748b] hover:bg-[#f1f5f9]"}`}
                >
                  {icon} {mode === "list" ? "List" : "Map"}
                </button>
              ))}
            </div>
          </div>

          {/* Map view */}
          {viewMode === "map" && <StallMap stalls={filteredStalls} loading={loadingStalls} onPinClick={() => {}} />}

          {/* List view */}
          {viewMode === "list" && (
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              {loadingStalls ? (
                <div className="p-8 text-center text-[13px] text-[#94a3b8]">
                  <div className="w-5 h-5 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading stalls from database...
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead>
                        <tr className="bg-[#f8fafc]">
                          {["Name", "Owner", "Category", "Rating", "Status", "Actions"].map((h) => (
                            <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {visibleStalls.map((stall) => (
                          <tr key={stall.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                            <td className="px-5 py-3">
                              <p className="text-[13px] font-medium text-[#0b1c30]">{stall.name}</p>
                              <p className="text-[11px] text-[#94a3b8]">{stall.address || "No address"}</p>
                            </td>
                            <td className="px-5 py-3">
                              <p className="text-[12px] text-[#0b1c30]">{stall.ownerName || stall.ownerEmail || "—"}</p>
                            </td>
                            <td className="px-5 py-3 text-[12px] text-[#64748b]">{stall.category?.name || "—"}</td>
                            <td className="px-5 py-3 text-[13px] text-[#64748b]">{stall.rating != null ? stall.rating.toFixed(1) : "—"}</td>
                            <td className="px-5 py-3">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${stall.isOpen ? "bg-green-50 text-[#006e2f]" : "bg-red-50 text-[#ba1a1a]"}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${stall.isOpen ? "bg-[#006e2f]" : "bg-[#ba1a1a]"}`} />
                                {stall.isOpen ? "Open" : "Closed"}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
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
                            </td>
                          </tr>
                        ))}
                        {visibleStalls.length === 0 && (
                          <tr><td colSpan={6} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">No stalls found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3 border-t border-[#f1f5f9]">
                    <p className="text-[12px] text-[#94a3b8]">Page {stallPage} of {stallTotalPages}</p>
                    <div className="flex gap-2">
                      <button disabled={stallPage <= 1} onClick={() => setStallPage((p) => p - 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
                      <button disabled={stallPage >= stallTotalPages} onClick={() => setStallPage((p) => p + 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50">Next</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Menu Items tab */}
      {tab === "menu-items" && (
        <div className="flex-1 p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h1 className="text-[22px] font-bold text-[#0b1c30]">All Menu Items</h1>
            <button
              onClick={() => { loadOptions(); setShowCreateMenuItem(true); }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#005a26]"
            >
              <Plus size={14} /> Add Menu Item
            </button>
          </div>

          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={14} />
            <input
              value={menuSearch}
              onChange={(e) => { setMenuSearch(e.target.value); setMenuPage(1); }}
              placeholder="Search menu items..."
              className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]"
            />
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            {loadingMenu ? (
              <div className="p-8 text-center text-[13px] text-[#94a3b8]">
                <div className="w-5 h-5 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading menu items from database...
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-[#f8fafc]">
                        {["Stall", "Name", "Price", "Category", "Available", "Actions"].map((h) => (
                          <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleMenu.map((item) => (
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
                          </td>
                        </tr>
                      ))}
                      {visibleMenu.length === 0 && (
                        <tr><td colSpan={6} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">No menu items found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between px-5 py-3 border-t border-[#f1f5f9]">
                  <p className="text-[12px] text-[#94a3b8]">Page {menuPage} of {menuTotalPages}</p>
                  <div className="flex gap-2">
                    <button disabled={menuPage <= 1} onClick={() => setMenuPage((p) => p - 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
                    <button disabled={menuPage >= menuTotalPages} onClick={() => setMenuPage((p) => p + 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50">Next</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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
                <label className="text-[12px] font-medium text-[#64748b]">Owner *</label>
                <select value={createForm.ownerId} onChange={(e) => setCreateForm({ ...createForm, ownerId: e.target.value })} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]">
                  <option value="">Select vendor...</option>
                  {(options?.vendors || []).map((v) => (
                    <option key={v.id} value={v.id}>{v.name} ({v.email})</option>
                  ))}
                </select>
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
                  {(stalls || []).map((s) => (
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
