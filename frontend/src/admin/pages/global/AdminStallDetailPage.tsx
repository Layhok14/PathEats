import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import {
  ArrowLeft, Star, MapPin, Store, ListOrdered, Edit, Trash2,
  CheckSquare, Pencil, X, Plus, Search, Expand, Clock, DollarSign, Camera
} from "lucide-react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import api from "../../../shared/services/axiosService";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { formatPrice } from "../../../shared/utils/formatters";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { ReviewsManager } from "../../../shared/components/ReviewsManager";
import { SuccessModal } from "../../../shared/components/SuccessModal";
import { getAdminPlaceCategories, type AdminStallRow, type AdminMenuItemRow } from "../../services/adminDashboardService";
import { LIGHT_VECTOR_STYLE } from "../../../shared/constants/appConfig";
import {
  attachMapContextRecovery,
  removeMapSafely,
} from "../../../shared/utils/maplibreLifecycle";
import { portalPath, useManagementPortalBase } from "../../utils/portalPath";

type Tab = "info" | "menu" | "reviews";

function LocationPreviewMap({ lat, lng, onChange }: { lat: number; lng: number; onChange: (lat: number, lng: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const detachRecoveryRef = useRef<(() => void) | null>(null);
  const [mapRecovering, setMapRecovering] = useState(false);

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (!container || !mapRef.current) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
        requestAnimationFrame(() => mapRef.current?.resize());
      }).catch((err) => {
        if (err.name !== "AbortError") console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handler = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      if (isFs && mapRef.current) {
        requestAnimationFrame(() => mapRef.current?.resize());
      } else if (!isFs && mapRef.current) {
        setTimeout(() => mapRef.current?.resize(), 100);
      }
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: LIGHT_VECTOR_STYLE,
      center: [lng, lat],
      zoom: 15,
      attributionControl: false,
      interactive: true,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    mapRef.current = map;

    detachRecoveryRef.current = attachMapContextRecovery(map, {
      onLost: () => setMapRecovering(true),
      onRestored: () => setMapRecovering(false),
    });

    map.on("load", () => {
      setMapRecovering(false);
      map.resize();
      const el = document.createElement("div");
      el.innerHTML = `<svg width="28" height="40" viewBox="0 0 24 40" fill="none"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 28 12 28s12-19 12-28C24 5.4 18.6 0 12 0z" fill="#006e2f" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="white"/></svg>`;
      el.style.cursor = "grab";
      el.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.3))";
      const marker = new maplibregl.Marker({ element: el.firstElementChild as HTMLElement, draggable: true })
        .setLngLat([lng, lat])
        .addTo(map);
      markerRef.current = marker;

      marker.on("dragend", () => {
        const ll = marker.getLngLat();
        onChange(ll.lat, ll.lng);
      });
      map.on("click", (e) => {
        marker.setLngLat(e.lngLat);
        onChange(e.lngLat.lat, e.lngLat.lng);
      });
    });

    return () => {
      detachRecoveryRef.current?.();
      detachRecoveryRef.current = null;
      removeMapSafely(mapRef);
      markerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden" }}>
      {mapRecovering && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80">
          <LoadingSpinner message="Recovering map view..." />
        </div>
      )}
      <div ref={containerRef} className="w-full" style={{ height: isFullscreen ? "100vh" : "200px" }} />
      <button
        onClick={handleFullscreen}
        style={{
          position: "absolute", bottom: "12px", right: "12px", zIndex: 10,
          padding: "7px 12px", borderRadius: "6px", border: "none",
          background: "rgba(0,0,0,0.65)", color: "white",
          fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
        }}
      >
        <Expand size={14} /> {isFullscreen ? "Exit Full Screen" : "Full Screen"}
      </button>
    </div>
  );
}

function MenuItemModal({
  item, onClose, onSave, categories,
}: {
  item: Partial<AdminMenuItemRow> | null;
  onClose: () => void;
  onSave: (data: { name: string; price: string; category: string; description?: string; imageUrl?: string; isAvailable?: boolean }) => Promise<void>;
  categories: string[];
}) {
  const [form, setForm] = useState({
    name: item?.name ?? "",
    price: item?.price ?? "",
    category: item?.category ?? "snack",
    description: item?.description ?? "",
    imageUrl: item?.imageUrl ?? "",
    isAvailable: item?.isAvailable ?? true,
  });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Item name is required."); return; }
    const priceTrimmed = form.price.trim();
    if (!priceTrimmed) { toast.error("Price is required."); return; }
    if (!/^\d+(\.\d{1,2})?$/.test(priceTrimmed)) { toast.error("Enter a valid price (e.g. 12.50)."); return; }
    if (parseFloat(priceTrimmed) > 99999.99) { toast.error("Price must be between 0 and 99,999.99."); return; }
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
          <h2 className="text-[16px] font-bold text-[#0b1c30]">{item?.id ? "Edit Menu Item" : "Add Menu Item"}</h2>
          <button onClick={onClose} className="p-1 rounded text-[#64748b] hover:bg-[#f1f5f9]"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="text-[12px] font-medium text-[#64748b]">Item Name *</label>
            <input required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Chicken Rice" className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748b]">Description</label>
            <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Short description" className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-[#64748b]">Price ($) *</label>
              <input required value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" inputMode="decimal" className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#64748b]">Category</label>
              <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748b]">Image URL</label>
            <input value={form.imageUrl} onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setForm(f => ({ ...f, isAvailable: !f.isAvailable }))} className={`w-11 h-[26px] rounded-full border-none relative cursor-pointer transition-colors ${form.isAvailable ? "bg-[#006e2f]" : "bg-[#cbced4]"}`}>
              <div className={`absolute top-[3px] w-5 h-5 rounded-full bg-white transition-all ${form.isAvailable ? "left-[22px]" : "left-[3px]"}`} />
            </button>
            <span className="text-[13px] text-[#0b1c30]">{form.isAvailable ? "Available" : "Unavailable"}</span>
          </div>
          <div className="flex justify-end gap-3 border-t border-[#e2e8f0] pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26]">{saving ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminStallDetailPage() {
  const { vendorId, stallId } = useParams<{ vendorId: string; stallId: string }>();
  const navigate = useNavigate();
  const portalBase = useManagementPortalBase();
  const [tab, setTab] = useState<Tab>("info");
  const [stall, setStall] = useState<AdminStallRow | null>(null);
  const [menuItems, setMenuItems] = useState<AdminMenuItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<AdminStallRow>>({});
  const [editItem, setEditItem] = useState<Partial<AdminMenuItemRow> | null>(null);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItemTarget, setDeleteItemTarget] = useState<AdminMenuItemRow | null>(null);
  const [categories, setCategories] = useState<string[]>(["snack", "main course", "drink", "dessert"]);

  const loadData = async () => {
    if (!stallId) return;
    setLoading(true);
    try {
      const [stallRes, menuRes, catRes] = await Promise.all([
        api.get<{ success: boolean; data: AdminStallRow }>(`/admin/stalls/${stallId}`),
        api.get<{ success: boolean; data: AdminMenuItemRow[] }>(`/admin/menu-items?placeId=${stallId}`),
        getAdminPlaceCategories().catch(() => [] as { name: string }[]),
      ]);
      setStall(stallRes.data.data);
      setEditForm(stallRes.data.data);
      setMenuItems(menuRes.data.data);
      if (catRes.length > 0) setCategories(catRes.map((c: { name: string }) => c.name));
    } catch (err) {
      console.error("[AdminStallDetailPage] Failed to load data:", err);
      toast.error("Could not load stall data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [stallId]);

  const stallItems = menuItems;

  const handleSaveInfo = async () => {
    if (!stallId || !stall) return;
    try {
      await api.patch(`/admin/stalls/${stallId}`, editForm);
      setStall({ ...stall, ...editForm });
      setEditMode(false);
      setSuccessMsg("Stall details updated.");
    } catch (err) {
      console.error("[AdminStallDetailPage] Failed to update stall:", err);
      toast.error("Could not update stall.");
    }
  };

  const handleToggleOpen = async () => {
    if (!stallId || !stall) return;
    try {
      const { data } = await api.patch(`/admin/stalls/${stallId}/toggle`);
      setStall({
        ...stall,
        isOpen: data.data.is_open,
        status: data.data.status,
        isAdminManaged: data.data.is_admin_managed,
      });
      toast.success(`Stall is now ${stall.isOpen ? "closed" : "open"}.`);
    } catch (err) {
      toast.error("Could not toggle status.");
    }
  };

  const handleDelete = async () => {
    if (!stallId) return;
    try {
      await api.delete(`/admin/stalls/${stallId}`);
      toast.success("Stall deleted.");
      navigate(portalPath(portalBase, vendorId ? `/vendors/${vendorId}` : "/stalls"));
    } catch (err) {
      toast.error("Could not delete stall.");
    }
  };

  const handleSaveItem = async (data: { name: string; price: string; category: string; description?: string; imageUrl?: string; isAvailable?: boolean }) => {
    if (!stallId) return;
    if (editItem?.id) {
      await api.patch(`/admin/menu-items/${editItem.id}`, data);
      setSuccessMsg("Menu item updated.");
    } else {
      await api.post(`/admin/stalls/${stallId}/menu-items`, data);
      setSuccessMsg("Menu item created.");
    }
    await loadData();
  };

  const handleDeleteItem = async (item: AdminMenuItemRow) => {
    setDeleteItemTarget(item);
  };

  const confirmDeleteItem = async () => {
    if (!deleteItemTarget) return;
    try {
      await api.delete(`/admin/stalls/menu-items/${deleteItemTarget.id}`, { params: { placeId: stallId } });
      toast.success(`"${deleteItemTarget.name}" deleted.`);
      setDeleteItemTarget(null);
      await loadData();
    } catch (err) {
      toast.error("Could not delete menu item.");
      setDeleteItemTarget(null);
    }
  };

  const handleToggleItem = async (item: AdminMenuItemRow) => {
    try {
      await api.patch(`/admin/menu-items/${item.id}`, { isAvailable: !item.isAvailable, placeId: stallId });
      toast.success(`"${item.name}" is now ${item.isAvailable ? "unavailable" : "available"}.`);
      await loadData();
    } catch (err) {
      toast.error("Could not toggle menu item.");
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading stall details..." />;
  }

  if (!stall) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-[13px] text-[#94a3b8]">Stall not found.</p>
        <button onClick={() => navigate(portalPath(portalBase, vendorId ? `/vendors/${vendorId}` : "/stalls"))} className="px-4 py-2 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white">Back to Stalls</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="h-14 bg-white border-b border-[#e2e8f0] flex items-center px-8 gap-4 shrink-0">
        <button onClick={() => navigate(portalPath(portalBase, vendorId ? `/vendors/${vendorId}` : "/stalls"))} className="flex items-center gap-1.5 text-[12px] font-medium text-[#64748b] hover:text-[#0b1c30]">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="w-px h-6 bg-[#e2e8f0]" />
        <h1 className="text-[15px] font-bold text-[#0b1c30]">{stall.name}</h1>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${stall.isOpen ? "bg-green-50 text-[#006e2f]" : "bg-red-50 text-[#ba1a1a]"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${stall.isOpen ? "bg-[#006e2f]" : "bg-[#ba1a1a]"}`} />
          {stall.isOpen ? "Open" : "Closed"}
        </span>
      </div>

      <div className="h-12 bg-white border-b border-[#e2e8f0] flex items-center px-8 gap-0 shrink-0">
        {([
          { key: "info" as Tab, label: "Stall Info", icon: <Store size={14} /> },
          { key: "menu" as Tab, label: `Menu Items (${stallItems.length})`, icon: <ListOrdered size={14} /> },
          { key: "reviews" as Tab, label: "Reviews", icon: <Star size={14} /> },
        ]).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-5 py-2.5 text-[12px] font-semibold border-b-2 transition-colors ${tab === t.key ? "border-[#006e2f] text-[#006e2f]" : "border-transparent text-[#64748b] hover:text-[#0b1c30]"}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-6">
        {tab === "info" && (
          <div className="max-w-4xl space-y-5">
            {editMode ? (
              <div className="grid grid-cols-[1fr_300px] gap-5">
                <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 space-y-4">
                  <h3 className="text-[16px] font-bold text-[#0b1c30]">Basic Information</h3>
                  <div>
                    <label className="text-[12px] font-medium text-[#64748b]">Name</label>
                    <input value={editForm.name || ""} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#64748b]">Description</label>
                    <textarea value={editForm.description || ""} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f] resize-none" />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#64748b]">Address</label>
                    <input value={editForm.address || ""} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#64748b]">Price Range</label>
                    <select value={editForm.priceRange || ""} onChange={e => setEditForm(f => ({ ...f, priceRange: e.target.value }))} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]">
                      <option value="">Not set</option>
                      <option value="$">$</option>
                      <option value="$$">$$</option>
                      <option value="$$$">$$$</option>
                      <option value="$$$$">$$$$</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#64748b]">Photo URL</label>
                    <input value={editForm.photoUrl || ""} onChange={e => setEditForm(f => ({ ...f, photoUrl: e.target.value }))} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
                  <h3 className="text-[16px] font-bold text-[#0b1c30] mb-4">Location</h3>
                  <LocationPreviewMap
                    lat={stall.location?.coordinates?.[1] ?? 11.5564}
                    lng={stall.location?.coordinates?.[0] ?? 104.9282}
                    onChange={(lat, lng) => setEditForm(f => ({ ...f, latitude: lat, longitude: lng }))}
                  />
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div>
                      <label className="text-[12px] font-medium text-[#64748b]">Latitude</label>
                      <input type="number" step="0.0001" value={stall.location?.coordinates?.[1] ?? ""} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none bg-gray-50 text-[#94a3b8]" readOnly />
                    </div>
                    <div>
                      <label className="text-[12px] font-medium text-[#64748b]">Longitude</label>
                      <input type="number" step="0.0001" value={stall.location?.coordinates?.[0] ?? ""} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none bg-gray-50 text-[#94a3b8]" readOnly />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-[1fr_300px] gap-5">
                <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-bold text-[#0b1c30]">Basic Information</h3>
                    <button onClick={() => navigate(portalPath(portalBase, vendorId ? `/vendors/${vendorId}/stall/${stallId}/edit` : `/stalls/stall/${stallId}/edit`))} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f1f5f9] text-[#475569] text-[12px] font-medium hover:bg-[#e2e8f0]">
                      <Edit size={13} /> Edit
                    </button>
                  </div>
                  {stall.photoUrl && (
                    <img src={stall.photoUrl} alt={stall.name} loading="lazy" className="w-full h-48 object-cover rounded-lg" />
                  )}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] mb-1">Name</p>
                    <p className="text-[15px] font-semibold text-[#0b1c30]">{stall.name}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] mb-1">Category</p>
                    <p className="text-[13px] text-[#0b1c30]">{stall.category?.name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] mb-1">Description</p>
                    <p className="text-[13px] text-[#64748b]">{stall.description || "No description"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] mb-1">Address</p>
                    <p className="text-[13px] text-[#64748b] flex items-center gap-1"><MapPin size={13} /> {stall.address || "No address"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] mb-1">Price Range</p>
                    <p className="text-[13px] text-[#64748b] flex items-center gap-1"><DollarSign size={13} /> {stall.priceRange || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] mb-1">Rating</p>
                    <p className="text-[13px] text-[#64748b] flex items-center gap-1"><Star size={13} className="text-amber-400 fill-amber-400" /> {stall.rating != null ? Number(stall.rating).toFixed(1) : "No ratings"} ({stall.ratingCount ?? 0} reviews)</p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
                    <h3 className="text-[16px] font-bold text-[#0b1c30] mb-4">Status</h3>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-[#e2e8f0] bg-[#f8fafc]">
                      <div className="flex items-center gap-3">
                        <CheckSquare size={18} className="text-[#006e2f]" />
                        <div>
                          <p className="text-[14px] font-semibold text-[#0b1c30]">Currently {stall.isOpen ? "Open" : "Closed"}</p>
                          <p className="text-[12px] text-[#94a3b8]">{stall.isOpen ? "Visible to customers" : "Hidden from customers"}</p>
                        </div>
                      </div>
                      <button onClick={handleToggleOpen} className={`w-12 h-[26px] rounded-full relative cursor-pointer transition-colors ${stall.isOpen ? "bg-[#006e2f]" : "bg-[#cbced4]"}`}>
                        <div className={`absolute top-[3px] w-5 h-5 rounded-full bg-white transition-all ${stall.isOpen ? "left-[25px]" : "left-[3px]"}`} />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#94a3b8] mt-3">Owner: {stall.ownerName || stall.ownerEmail || "Unknown"}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
                    <h3 className="text-[16px] font-bold text-[#0b1c30] mb-4">Location</h3>
                    {stall.location?.coordinates ? (
                      <>
                        <LocationPreviewMap
                          lat={stall.location.coordinates[1]}
                          lng={stall.location.coordinates[0]}
                          onChange={() => {}}
                        />
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Lat</p>
                            <p className="text-[13px] text-[#0b1c30]">{stall.location.coordinates[1].toFixed(5)}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Lng</p>
                            <p className="text-[13px] text-[#0b1c30]">{stall.location.coordinates[0].toFixed(5)}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-[13px] text-[#94a3b8]">No location data.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              {editMode ? (
                <>
                  <button onClick={() => { setEditMode(false); setEditForm(stall); }} className="px-4 py-2 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50">Cancel</button>
                  <button onClick={handleSaveInfo} className="px-4 py-2 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26]">Save Changes</button>
                </>
              ) : (
                <>
                  <button onClick={() => setDeleteOpen(true)} className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium rounded-lg border border-red-200 text-[#ba1a1a] hover:bg-red-50">
                    <Trash2 size={13} /> Delete Stall
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {tab === "menu" && (
          <div className="max-w-4xl">
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[16px] font-bold text-[#0b1c30]">Menu Items ({stallItems.length})</h3>
                <button onClick={() => setShowCreateItem(true)} className="flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#005a26]">
                  <Plus size={14} /> Add Item
                </button>
              </div>
              {stallItems.length === 0 ? (
                <p className="py-10 text-center text-[13px] text-[#94a3b8]">No menu items for this stall.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {stallItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border border-[#e2e8f0]" style={{ opacity: item.isAvailable ? 1 : 0.5 }}>
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} loading="lazy" className="w-14 h-14 object-cover rounded-lg shrink-0" />}
                      <div className="flex-1">
                        <p className="text-[14px] font-semibold text-[#0b1c30]">{item.name}</p>
                        {item.description && <p className="text-[12px] text-[#94a3b8]">{item.description}</p>}
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[13px] font-semibold text-[#006e2f]">{formatPrice(Number(item.price))}</span>
                          <span className="text-[12px] text-[#64748b]">{item.category}</span>
                          <span className={`text-[12px] ${item.isAvailable ? "text-[#006e2f]" : "text-[#ba1a1a]"}`}>
                            {item.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleToggleItem(item)} className={`px-2.5 py-1 rounded text-[11px] font-semibold ${item.isAvailable ? "bg-gray-50 text-[#64748b] hover:bg-gray-100" : "bg-green-50 text-[#006e2f] hover:bg-green-100"}`}>
                          {item.isAvailable ? "Disable" : "Enable"}
                        </button>
                        <button onClick={() => setEditItem(item)} className="px-2.5 py-1 rounded text-[11px] font-semibold bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] flex items-center gap-1">
                          <Pencil size={11} /> Edit
                        </button>
                        <button onClick={() => handleDeleteItem(item)} className="px-2.5 py-1 rounded text-[11px] font-semibold bg-red-50 text-[#ba1a1a] hover:bg-red-100">
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <ReviewsManager
            endpoint={`/admin/stalls/${stallId}/reviews`}
            title={`Reviews for ${stall.name}`}
            subtitle="Customer feedback for this stall."
          />
        )}
      </div>

      {editItem !== null && (
        <MenuItemModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleSaveItem}
          categories={categories}
        />
      )}

      {showCreateItem && (
        <MenuItemModal
          item={null}
          onClose={() => setShowCreateItem(false)}
          onSave={handleSaveItem}
          categories={categories}
        />
      )}

      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden p-6">
            <h2 className="text-[16px] font-bold text-[#0b1c30] mb-2">Delete Stall</h2>
            <p className="text-[13px] text-[#64748b] mb-4">Are you sure you want to delete <strong>{stall.name}</strong>? This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteOpen(false)} className="px-4 py-2 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 text-[12px] font-medium rounded-lg bg-[#ba1a1a] text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteItemTarget)}
        title="Remove menu item from stall?"
        description="The shared menu item remains in the vendor catalog and in any other stalls that reference it."
        itemName={deleteItemTarget?.name}
        confirmLabel="Remove Item"
        onConfirm={confirmDeleteItem}
        onCancel={() => setDeleteItemTarget(null)}
      />

      {successMsg && (
        <SuccessModal
          message={successMsg}
          onContinue={() => setSuccessMsg(null)}
          onGoBack={() => setSuccessMsg(null)}
        />
      )}
    </div>
  );
}
