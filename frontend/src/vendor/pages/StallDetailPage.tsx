import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Trash2, CheckSquare, Plus, X, Pencil, Search, Expand } from "lucide-react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { PhotoUpload } from "../components/PhotoUpload";
import { LoadingSpinner } from "../../shared/components/LoadingSpinner";
import { SuccessModal } from "../../shared/components/SuccessModal";
import { useStalls } from "../../shared/hooks/useStalls";
import { useMenuItems } from "../../shared/hooks/useMenuItems";
import { STALL_CATEGORIES, MENU_CATEGORIES } from "../../shared/constants/categories";
import { formatPrice } from "../../shared/utils/formatters";
import { LIGHT_VECTOR_STYLE, PHNOM_PENH_CENTER } from "../../shared/constants/appConfig";
import {
  attachMapContextRecovery,
  removeMapSafely,
} from "../../shared/utils/maplibreLifecycle";
import type { StallFormData, StallCategory, VendorMenuItem as MenuItem, MenuCategory } from "../../shared/types";
import type { MenuItemFormData } from "../../shared/hooks/useMenuItems";
import api from "../../shared/services/axiosService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../app/components/ui/dialog";

const DEFAULT: StallFormData = {
  name: "", photoUrl: "", category: "Rice", description: "",
  operatingHours: { weekdays: { open: "09:00 AM", close: "09:00 PM" }, weekends: { open: "09:00 AM", close: "09:00 PM" } },
  status: "open",
  location: { landmark: "", latitude: 11.5564, longitude: 104.9282 },
  menuItemIds: [],
};

function to24h(t: string) {
  const m = t.match(/(\d+):(\d+)\s?(AM|PM)/i);
  if (!m) return "09:00";
  let h = parseInt(m[1]);
  if (m[3].toUpperCase() === "PM" && h !== 12) h += 12;
  if (m[3].toUpperCase() === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}
function to12h(t: string) {
  const [hStr, mStr] = t.split(":");
  let h = parseInt(hStr);
  const p = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${String(h).padStart(2, "0")}:${mStr} ${p}`;
}

const inp: React.CSSProperties = {
  width: "100%", border: "1px solid var(--brand-input-border)", borderRadius: "4px",
  padding: "10px 14px", fontSize: "14px", fontFamily: "Poppins, sans-serif",
  color: "var(--brand-text-dark)", background: "var(--card)", outline: "none",
};
const lbl: React.CSSProperties = {
  fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: 500,
  color: "var(--brand-text-dark)", display: "block", marginBottom: "6px",
};

// Menu item edit / create modal
function MenuItemModal({
  item, onClose, onSave,
}: { item: Partial<MenuItem> | null; onClose: () => void; onSave: (data: MenuItemFormData) => Promise<void> }) {
  const [form, setForm] = useState<MenuItemFormData>({
    name: item?.name ?? "",
    description: item?.description ?? "",
    price: item?.price ?? 0,
    imageUrl: item?.imageUrl ?? "",
    storageImage: item?.storageImage ?? null,
    category: (item?.category as MenuCategory) ?? "Snack",
    isAvailable: item?.isAvailable ?? true,
  });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Item name is required."); return; }
    if (typeof form.price !== "number" || isNaN(form.price) || form.price <= 0 || form.price > 99999.99 || !/^\d+(\.\d{1,2})?$/.test(String(form.price))) { toast.error("Enter a valid price (e.g. 12.50)."); return; }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch {
      // The caller shows the concrete API error.
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent style={{ maxWidth: "480px" }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "Poppins, sans-serif" }}>
            {item?.id ? "Edit Menu Item" : "Add New Menu Item"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label style={lbl}>Item Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={inp} placeholder="e.g. Chicken Rice" />
          </div>
          <div>
            <label style={lbl}>Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} style={{ ...inp, resize: "vertical" }} placeholder="Short description" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={lbl}>Price ($)</label>
              <input type="number" step="0.01" min="0" required value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))} style={inp} />
            </div>
            <div>
              <label style={lbl}>Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as MenuCategory }))} style={{ ...inp, cursor: "pointer" }}>
                {MENU_CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={lbl}>Item Photo</label>
            <PhotoUpload
              value={form.imageUrl}
              onChange={(url, storageImage) => setForm((f) => ({ ...f, imageUrl: url, storageImage }))}
              label="Upload item photo"
              aspectRatio="square"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, isAvailable: !f.isAvailable }))}
              style={{ width: "44px", height: "24px", borderRadius: "9999px", border: "none", background: form.isAvailable ? "var(--brand-green)" : "#cbced4", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}
            >
              <div style={{ position: "absolute", top: "2px", left: form.isAvailable ? "22px" : "2px", width: "20px", height: "20px", borderRadius: "9999px", background: "white", transition: "left 0.2s" }} />
            </button>
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-dark)" }}>
              {form.isAvailable ? "Available" : "Sold out"}
            </span>
          </div>
          {item?.id && (
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", background: "var(--muted)", padding: "8px 12px", borderRadius: "6px" }}>
              ℹ️ Changing price or properties creates a new item version in the menu catalog.
            </p>
          )}
          <DialogFooter>
            <button type="button" onClick={onClose} style={{ padding: "10px 20px", borderRadius: "6px", border: "1px solid var(--brand-card-border)", background: "var(--card)", fontFamily: "Poppins, sans-serif", cursor: "pointer" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", fontWeight: 600, cursor: "pointer" }}>
              {saving ? "Saving..." : "Save"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Add from existing catalog picker
function CatalogPicker({ selectedIds, onToggle, onClose }: { selectedIds: string[]; onToggle: (id: string) => void; onClose: () => void }) {
  const [catFilter, setCatFilter] = useState<MenuCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { items } = useMenuItems(catFilter);

  const q = searchQuery.toLowerCase().trim();
  const filtered = q
    ? items.filter((i) => i.name.toLowerCase().includes(q) || (i.description || "").toLowerCase().includes(q))
    : items;

  const inpStyle: React.CSSProperties = {
    width: "100%", border: "1px solid var(--brand-input-border)", borderRadius: "6px",
    padding: "9px 12px 9px 34px", fontSize: "13px", fontFamily: "Poppins, sans-serif",
    color: "var(--brand-text-dark)", background: "var(--card)", outline: "none",
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent style={{ maxWidth: "600px", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "Poppins, sans-serif" }}>Add from Catalog</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 flex-wrap mb-3">
          {MENU_CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)} style={{ padding: "4px 12px", borderRadius: "9999px", border: "none", background: catFilter === c ? "var(--brand-green)" : "var(--muted)", color: catFilter === c ? "white" : "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "13px", cursor: "pointer" }}>
              {c}
            </button>
          ))}
        </div>
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--brand-text-muted)", pointerEvents: "none" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu items…"
            style={inpStyle}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 overflow-y-auto flex-1" style={{ minHeight: 0 }}>
          {filtered.length === 0 ? (
            <p className="col-span-2 py-8 text-center" style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "var(--brand-text-muted)" }}>No items match your search.</p>
          ) : filtered.map((item) => {
            const sel = selectedIds.includes(item.id);
            return (
              <button key={item.id} onClick={() => onToggle(item.id)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "8px", border: `2px solid ${sel ? "var(--brand-green)" : "var(--brand-card-border)"}`, background: sel ? "#f0fdf4" : "var(--card)", cursor: "pointer", textAlign: "left" }}>
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} loading="lazy" className="w-12 h-12 object-cover rounded" />}
                <div>
                  <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--brand-text-dark)", margin: 0 }}>{item.name}</p>
                  <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "var(--brand-green)", margin: 0 }}>{formatPrice(item.price)}</p>
                </div>
                {sel && <CheckSquare size={16} style={{ color: "var(--brand-green)", marginLeft: "auto", flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
        <DialogFooter style={{ marginTop: "16px" }}>
          <button onClick={onClose} style={{ padding: "10px 24px", borderRadius: "6px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", fontWeight: 600, cursor: "pointer" }}>
            Done ({selectedIds.length} selected)
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type ActiveTab = "info" | "menu";

function LocationPreviewMap({ lat, lng, onOpenFullscreen, onCoordsChange }: { lat: number; lng: number; onOpenFullscreen: () => void; onCoordsChange: (lat: number, lng: number) => void }) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const detachRecoveryRef = useRef<(() => void) | null>(null);
  const [mapRecovering, setMapRecovering] = useState(false);

  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return;
    const map = new maplibregl.Map({
      container: mapDivRef.current,
      style: LIGHT_VECTOR_STYLE,
      center: [lng, lat],
      zoom: 15,
      attributionControl: false,
      interactive: true,
    });
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
        const lngLat = marker.getLngLat();
        onCoordsChange(lngLat.lat, lngLat.lng);
      });

      map.on("click", (e) => {
        if (markerRef.current) {
          markerRef.current.setLngLat(e.lngLat);
          onCoordsChange(e.lngLat.lat, e.lngLat.lng);
        }
      });
    });

    return () => {
      detachRecoveryRef.current?.();
      detachRecoveryRef.current = null;
      removeMapSafely(mapRef);
      markerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const marker = markerRef.current;
    const map = mapRef.current;
    if (!marker || !map) return;

    marker.setLngLat([lng, lat]);
    map.setCenter([lng, lat]);
  }, [lat, lng]);

  return (
    <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden" }}>
      {mapRecovering && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
          <LoadingSpinner message="Recovering map view..." />
        </div>
      )}
      <div ref={mapDivRef} style={{ width: "100%", height: "160px" }} />
      <button
        type="button"
        onClick={onOpenFullscreen}
        style={{
          position: "absolute", bottom: "8px", right: "8px", zIndex: 10,
          padding: "6px 10px", borderRadius: "6px", border: "none",
          background: "rgba(0,0,0,0.65)", color: "white",
          fontFamily: "Poppins, sans-serif", fontSize: "11px", fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
        }}
      >
        <Expand size={12} /> Full Screen
      </button>
    </div>
  );
}

export function StallDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getStall, updateStall, deleteStall, loading } = useStalls();
  const { allItems: catalogItems } = useMenuItems();

  const [form, setForm] = useState<StallFormData>(DEFAULT);
  const [tab, setTab] = useState<ActiveTab>("info");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null | "new">(null);
  const [showCatalog, setShowCatalog] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [stallItems, setStallItems] = useState<MenuItem[]>([]);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [deleteImpact, setDeleteImpact] = useState<{ menuItems: number; reviews: number } | null>(null);

  useEffect(() => {
    if (!id) return;
    const stall = getStall(id);
    if (!stall) {
      if (!loading) setNotFound(true);
      return;
    }
    setNotFound(false);
    setForm({
      name: stall.name,
      photoUrl: stall.photoUrl,
      storageImage: stall.storageImage ?? null,
      category: stall.category,
      description: stall.description,
      operatingHours: stall.operatingHours,
      status: stall.status,
      location: stall.location,
      menuItemIds: stall.menuItemIds,
    });
  }, [id, getStall, loading]);

  useEffect(() => {
    if (!id) return;
    setItemsError(null);
    api.get(`/vendor/stalls/${id}/items`).then(({ data }) => {
      setStallItems(data.data.map(mapItem));
    }).catch(() => {
      setItemsError("Failed to load menu items.");
    });
  }, [id]);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      menuItemIds: stallItems.map((item) => item.id),
    }));
  }, [stallItems]);

  function setHours(part: "weekdays" | "weekends", field: "open" | "close", val: string) {
    setForm((f) => ({ ...f, operatingHours: { ...f.operatingHours, [part]: { ...f.operatingHours[part], [field]: to12h(val) } } }));
  }

  async function handleUpdate() {
    if (!id) return;
    try {
      await updateStall(id, form);
      setSuccessMessage("Stall details updated.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not update stall.");
    }
  }

  async function handleDelete() {
    if (!id) return;
    try {
      await deleteStall(id);
      toast.success("Stall deleted.");
      navigate("/vendor/stalls");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not delete stall.");
    }
  }

  async function handleSaveItem(data: MenuItemFormData) {
    if (!id) return;
    try {
      if (editingItem && editingItem !== "new" && editingItem.id) {
        const { data: res } = await api.put(`/vendor/stalls/${id}/items/${editingItem.id}`, data);
        const updated = mapItem(res.data);
        setStallItems((prev) => prev.map((m) => m.id === editingItem.id ? updated : m));
        setSuccessMessage("Menu item updated.");
      } else {
        const { data: res } = await api.post(`/vendor/stalls/${id}/items`, data);
        const created = mapItem(res.data);
        setStallItems((prev) => [...prev, created]);
        setSuccessMessage("New menu item created.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not save menu item.");
      throw err;
    }
  }

  async function handleCatalogToggle(itemId: string) {
    if (!id) return;
    try {
      const exists = stallItems.find((m) => m.id === itemId);
      if (exists) {
        await api.delete(`/vendor/stalls/${id}/items/${itemId}`);
        setStallItems((prev) => prev.filter((m) => m.id !== itemId));
        toast.success("Item removed from stall.");
      } else {
        const source = catalogItems.find((m) => m.id === itemId);
        if (!source) return;
        const { data: res } = await api.post(`/vendor/stalls/${id}/items`, source);
        const created = mapItem(res.data);
        setStallItems((prev) => [...prev, created]);
        toast.success("Item added to stall.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not update stall menu.");
    }
  }

  async function removeItemFromStall(itemId: string) {
    if (!id) return;
    try {
      await api.delete(`/vendor/stalls/${id}/items/${itemId}`);
      setStallItems((prev) => prev.filter((m) => m.id !== itemId));
      toast.success("Item removed from stall.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not remove menu item.");
    }
  }

  const linkedItems = stallItems;
  const currentStall = id ? getStall(id) : null;
  const isAdminManaged = Boolean(currentStall?.adminManaged);

  if (notFound) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 gap-4">
      <p style={{ fontFamily: "Poppins, sans-serif", color: "var(--brand-text-muted)" }}>Stall not found.</p>
      <button onClick={() => navigate("/vendor/stalls")} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", cursor: "pointer" }}>Back</button>
    </div>
  );

  const sectionCard: React.CSSProperties = { background: "var(--card)", border: "1px solid var(--brand-card-border)", borderRadius: "10px", padding: "24px" };

  return (
    <div className="p-6 flex flex-col gap-5 max-w-[1100px]">
      <p style={{ color: "var(--brand-green-dark)", fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700 }}>Stall Management</p>

      <div>
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "28px", fontWeight: 700, color: "var(--brand-text-dark)" }}>Stall Details</h1>
        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", marginTop: "4px" }}>Keep your stall information up to date to help customers find you.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0" style={{ borderBottom: "2px solid var(--brand-card-border)" }}>
        {(["info", "menu"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "10px 20px", border: "none", background: "none", cursor: "pointer",
              fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 500,
              color: tab === t ? "var(--brand-green-dark)" : "var(--brand-text-muted)",
              borderBottom: tab === t ? "2px solid var(--brand-green)" : "2px solid transparent",
              marginBottom: "-2px",
            }}
          >
            {t === "info" ? "Stall Info" : `Menu Items (${linkedItems.length})`}
          </button>
        ))}
      </div>

      {/* ── STALL INFO TAB ── */}
      {tab === "info" && (
        <>
          <div className="grid grid-cols-[1fr_300px] gap-5">
            {/* Left: Basic Info */}
            <div style={sectionCard}>
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600, color: "var(--brand-text-dark)", marginBottom: "20px" }}>Basic Information</p>

              <div className="mb-4">
                <label style={lbl}>Stall Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Spice & Wok Haven" style={{ ...inp, fontSize: "15px", padding: "12px 14px" }} />
              </div>

              <div className="mb-4">
                <label style={lbl}>Stall Photo</label>
                <PhotoUpload
                  value={form.photoUrl}
                  onChange={(url, storageImage) => setForm((f) => ({ ...f, photoUrl: url, storageImage }))}
                  label="Click or drag to upload stall photo"
                />
              </div>

              <div className="mb-4">
                <label style={lbl}>Primary Category</label>
                <div className="flex flex-wrap gap-2">
                  {STALL_CATEGORIES.map((cat) => {
                    const sel = form.category === cat;
                    return (
                      <button key={cat} type="button" onClick={() => setForm((f) => ({ ...f, category: cat as StallCategory }))} style={{ padding: "5px 14px", borderRadius: "9999px", border: sel ? "none" : "1px solid var(--brand-card-border)", background: sel ? "var(--brand-green)" : "var(--card)", color: sel ? "white" : "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "13px", cursor: "pointer" }}>
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={lbl}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} style={{ ...inp, resize: "vertical" }} />
              </div>
            </div>

            {/* Right: Location Pin */}
            <div style={sectionCard}>
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600, color: "var(--brand-text-dark)", marginBottom: "6px" }}>Location Pin</p>
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "var(--brand-text-muted)", marginBottom: "12px" }}>Click or drag the map to set exact coordinates.</p>

              {/* Embedded Maplibre map with current pin */}
              <LocationPreviewMap
                lat={form.location.latitude}
                lng={form.location.longitude}
                onOpenFullscreen={() => navigate(`/vendor/stalls/${id}/location`)}
                onCoordsChange={(lat, lng) => setForm((f) => ({ ...f, location: { ...f.location, latitude: lat, longitude: lng } }))}
              />

              <div className="mt-4">
                <label style={lbl}>Landmark / Station</label>
                <input type="text" value={form.location.landmark} onChange={(e) => setForm((f) => ({ ...f, location: { ...f.location, landmark: e.target.value } }))} placeholder="e.g. Central Station, East Concourse" style={inp} />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label style={lbl}>Latitude</label>
                  <input type="number" step="0.0001" value={form.location.latitude} onChange={(e) => setForm((f) => ({ ...f, location: { ...f.location, latitude: parseFloat(e.target.value) || 0 } }))} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Longitude</label>
                  <input type="number" step="0.0001" value={form.location.longitude} onChange={(e) => setForm((f) => ({ ...f, location: { ...f.location, longitude: parseFloat(e.target.value) || 0 } }))} style={inp} />
                </div>
              </div>
            </div>
          </div>

          {/* Operating Hours + Status */}
          <div className="grid grid-cols-2 gap-5">
            <div style={sectionCard}>
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600, color: "var(--brand-text-dark)", marginBottom: "20px" }}>Operating Hours</p>
              {(["weekdays", "weekends"] as const).map((part) => (
                <div key={part} className="flex items-center gap-4 mb-4">
                  <span style={{ width: "110px", fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "var(--brand-text-muted)", flexShrink: 0 }}>{part === "weekdays" ? "Mon–Fri" : "Sat–Sun"}</span>
                  <input type="time" value={to24h(form.operatingHours[part].open)} onChange={(e) => setHours(part, "open", e.target.value)} style={{ ...inp, flex: 1, width: "auto", padding: "8px 10px" }} />
                  <span style={{ color: "var(--brand-text-muted)" }}>-</span>
                  <input type="time" value={to24h(form.operatingHours[part].close)} onChange={(e) => setHours(part, "close", e.target.value)} style={{ ...inp, flex: 1, width: "auto", padding: "8px 10px" }} />
                </div>
              ))}
            </div>
            <div style={sectionCard}>
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600, color: "var(--brand-text-dark)", marginBottom: "20px" }}>Operating Status</p>
              <div className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: "var(--brand-card-border)", background: "var(--brand-header-bg)" }}>
                <div className="flex items-center gap-3">
                  <CheckSquare size={18} style={{ color: "var(--brand-green)" }} />
                  <div>
                    <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--brand-text-dark)", margin: 0 }}>Currently {form.status === "open" ? "Open" : "Closed"}</p>
                    <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", margin: 0 }}>
                      {isAdminManaged
                        ? "Closed by admin. Contact Telegram support to reopen."
                        : form.status === "open"
                          ? "Visible to customers"
                          : "Hidden from customers"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isAdminManaged}
                  onClick={() => setForm((f) => ({ ...f, status: f.status === "open" ? "closed" : "open" }))}
                  style={{ width: "48px", height: "26px", borderRadius: "9999px", border: "none", background: form.status === "open" ? "var(--brand-green)" : "#cbced4", cursor: isAdminManaged ? "not-allowed" : "pointer", position: "relative", transition: "background 0.2s", opacity: isAdminManaged ? 0.65 : 1 }}
                >
                  <div style={{ position: "absolute", top: "3px", left: form.status === "open" ? "25px" : "3px", width: "20px", height: "20px", borderRadius: "9999px", background: "white", transition: "left 0.2s" }} />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button onClick={async () => {
              if (id) {
                try {
                  const { data: res } = await api.get(`/vendor/stalls/${id}/impact`);
                  setDeleteImpact(res.data);
                } catch (_err) {
                  // impact unavailable, proceed without
                }
              }
              setDeleteOpen(true);
            }} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "6px", border: "1px solid #d4183d", background: "var(--card)", color: "#d4183d", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
              <Trash2 size={15} /> Delete Stall
            </button>
            <button onClick={handleUpdate} disabled={loading} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 24px", borderRadius: "6px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
              <CheckSquare size={15} /> {loading ? "Saving..." : "Update Details"}
            </button>
          </div>
        </>
      )}

      {/* ── MENU ITEMS TAB ── */}
      {tab === "menu" && (
        <div style={sectionCard}>
          <div className="flex items-center justify-between mb-5">
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600, color: "var(--brand-text-dark)", margin: 0 }}>
              Menu Items ({linkedItems.length})
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowCatalog(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "6px", border: "1px solid var(--brand-card-border)", background: "var(--card)", color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "13px", cursor: "pointer" }}>
                <Plus size={14} /> Add Existing
              </button>
              <button onClick={() => setEditingItem("new")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "6px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                <Plus size={14} /> Create New
              </button>
            </div>
          </div>

          {linkedItems.length === 0 ? (
            <div className="py-10 text-center">
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)" }}>No menu items linked. Add items above.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {linkedItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border" style={{ borderColor: "var(--brand-card-border)", opacity: item.isAvailable ? 1 : 0.6 }}>
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} loading="lazy" className="w-14 h-14 object-cover rounded-lg shrink-0" />}
                  <div className="flex-1">
                    <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--brand-text-dark)", margin: 0 }}>{item.name}</p>
                    <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "var(--brand-text-muted)", margin: 0 }}>{item.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--brand-green)" }}>{formatPrice(item.price)}</span>
                      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: item.isAvailable ? "var(--brand-green)" : "#d4183d" }}>{item.isAvailable ? "Available" : "Sold out"}</span>
                      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)" }}>{item.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setEditingItem(item)} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--brand-card-border)", background: "var(--card)", color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => removeItemFromStall(item.id)} style={{ padding: "6px", borderRadius: "6px", border: "1px solid #d4183d", background: "var(--card)", color: "#d4183d", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "Poppins, sans-serif" }}>Delete Stall</DialogTitle>
          </DialogHeader>
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)" }}>
            Are you sure you want to delete <strong>{form.name}</strong>? This cannot be undone.
          </p>
          {deleteImpact && (deleteImpact.menuItems > 0 || deleteImpact.reviews > 0) && (
            <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "#d4183d", background: "#d4183d15", padding: "10px 14px", borderRadius: "6px", marginTop: "8px" }}>
              This will also remove: {deleteImpact.menuItems > 0 && `${deleteImpact.menuItems} linked menu item(s)`}
              {deleteImpact.menuItems > 0 && deleteImpact.reviews > 0 && " and "}
              {deleteImpact.reviews > 0 && `${deleteImpact.reviews} review(s)`}
            </div>
          )}
          <DialogFooter>
            <button onClick={() => setDeleteOpen(false)} style={{ padding: "10px 20px", borderRadius: "6px", border: "1px solid var(--brand-card-border)", background: "var(--card)", fontFamily: "Poppins, sans-serif", cursor: "pointer" }}>Cancel</button>
            <button onClick={handleDelete} disabled={loading} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", background: "#d4183d", color: "white", fontFamily: "Poppins, sans-serif", fontWeight: 600, cursor: "pointer" }}>{loading ? "Deleting..." : "Yes, Delete"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Menu item edit/create modal */}
      {editingItem !== null && (
        <MenuItemModal
          item={editingItem === "new" ? null : editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveItem}
        />
      )}

      {/* Catalog picker */}
      {showCatalog && (
        <CatalogPicker
          selectedIds={linkedItems.map((item) => item.id)}
          onToggle={handleCatalogToggle}
          onClose={() => setShowCatalog(false)}
        />
      )}

      {successMessage && (
        <SuccessModal
          message={successMessage}
          onContinue={() => setSuccessMessage(null)}
          onGoBack={() => { setSuccessMessage(null); navigate("/vendor/stalls"); }}
          backLabel="Go to My Stalls"
        />
      )}
    </div>
  );
}

function mapItem(row: any): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    price: parseFloat(row.price),
    imageUrl: row.image_url || "",
    storageImage: row.storageImage || (row.image_bucket && row.image_path
      ? {
          bucketName: row.image_bucket,
          objectPath: row.image_path,
          mimeType: row.image_mime_type || null,
          altText: row.image_alt_text || "",
        }
      : null),
    category: (row.category === "main course" ? "Main Course" : row.category === "snack" ? "Snack" : row.category === "drink" ? "Drink" : row.category === "dessert" ? "Dessert" : "All") as MenuCategory,
    isAvailable: row.is_available,
  };
}
