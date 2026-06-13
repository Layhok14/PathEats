import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { MapPin, Trash2, CheckSquare, Plus, X, Pencil } from "lucide-react";
import { PhotoUpload } from "../components/PhotoUpload";
import { useStalls } from "../../shared/hooks/useStalls";
import { useMenuItems, getAllMenuItems } from "../../shared/hooks/useMenuItems";
import { STALL_CATEGORIES, MENU_CATEGORIES } from "../../shared/constants/categories";
import { formatPrice } from "../../shared/utils/formatters";
import type { StallFormData, StallCategory, MenuItem, MenuCategory } from "../../shared/types";
import type { MenuItemFormData } from "../../shared/hooks/useMenuItems";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../app/components/ui/dialog";

const DEFAULT: StallFormData = {
  name: "", photoUrl: "", category: "Rice Bowls", description: "",
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
    category: (item?.category as MenuCategory) ?? "Rice",
    isAvailable: item?.isAvailable ?? true,
  });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
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
              onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
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
  const { items } = useMenuItems(catFilter);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent style={{ maxWidth: "600px", maxHeight: "80vh", overflow: "auto" }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "Poppins, sans-serif" }}>Add from Catalog</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 flex-wrap mb-4">
          {MENU_CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)} style={{ padding: "4px 12px", borderRadius: "9999px", border: "none", background: catFilter === c ? "var(--brand-green)" : "var(--muted)", color: catFilter === c ? "white" : "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "13px", cursor: "pointer" }}>
              {c}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => {
            const sel = selectedIds.includes(item.id);
            return (
              <button key={item.id} onClick={() => onToggle(item.id)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "8px", border: `2px solid ${sel ? "var(--brand-green)" : "var(--brand-card-border)"}`, background: sel ? "#f0fdf4" : "var(--card)", cursor: "pointer", textAlign: "left" }}>
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded" />}
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

export function StallDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getStall, updateStall, deleteStall, loading } = useStalls();
  const { forkItem, createItem, refresh } = useMenuItems();

  const [form, setForm] = useState<StallFormData>(DEFAULT);
  const [tab, setTab] = useState<ActiveTab>("info");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null | "new">(null);
  const [showCatalog, setShowCatalog] = useState(false);

  useEffect(() => {
    if (!id) return;
    const stall = getStall(id);
    if (!stall) { setNotFound(true); return; }
    setForm({ name: stall.name, photoUrl: stall.photoUrl, category: stall.category, description: stall.description, operatingHours: stall.operatingHours, status: stall.status, location: stall.location, menuItemIds: stall.menuItemIds });
  }, [id, getStall]);

  function setHours(part: "weekdays" | "weekends", field: "open" | "close", val: string) {
    setForm((f) => ({ ...f, operatingHours: { ...f.operatingHours, [part]: { ...f.operatingHours[part], [field]: to12h(val) } } }));
  }

  async function handleUpdate() {
    if (!id) return;
    await updateStall(id, form);
    toast.success("Stall details updated.");
  }

  async function handleDelete() {
    if (!id) return;
    await deleteStall(id);
    toast.success("Stall deleted.");
    navigate("/vendor/stalls");
  }

  // Save menu item: fork if editing existing, create if new
  async function handleSaveItem(data: MenuItemFormData) {
    if (!id) return;
    if (editingItem && editingItem !== "new" && editingItem.id) {
      // Fork the item (creates new entry in catalog)
      const forked = await forkItem(editingItem.id, data);
      // Replace old id with forked id in stall
      const newIds = form.menuItemIds.map((mid) => mid === editingItem.id ? forked.id : mid);
      const updated = { ...form, menuItemIds: newIds };
      setForm(updated);
      await updateStall(id, updated);
      toast.success("Menu item updated — new version added to catalog.");
    } else {
      // Brand new item
      const created = await createItem(data);
      const newIds = [...form.menuItemIds, created.id];
      const updated = { ...form, menuItemIds: newIds };
      setForm(updated);
      await updateStall(id, updated);
      toast.success("New menu item created and added to stall.");
    }
    refresh();
  }

  async function handleCatalogToggle(itemId: string) {
    if (!id) return;
    const newIds = form.menuItemIds.includes(itemId)
      ? form.menuItemIds.filter((x) => x !== itemId)
      : [...form.menuItemIds, itemId];
    const updated = { ...form, menuItemIds: newIds };
    setForm(updated);
    await updateStall(id, updated);
  }

  async function removeItemFromStall(itemId: string) {
    if (!id) return;
    const newIds = form.menuItemIds.filter((x) => x !== itemId);
    const updated = { ...form, menuItemIds: newIds };
    setForm(updated);
    await updateStall(id, updated);
    toast.success("Item removed from stall.");
  }

  const linkedItems = getAllMenuItems().filter((m) => form.menuItemIds.includes(m.id));

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
                  onChange={(url) => setForm((f) => ({ ...f, photoUrl: url }))}
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

              {/* Map preview — click to open dedicated pinpoint page */}
              <button
                type="button"
                onClick={() => navigate(`/vendor/stalls/${id}/location`)}
                style={{
                  width: "100%", height: "160px", borderRadius: "8px", border: "1px solid var(--brand-card-border)",
                  background: "#eff4ff", cursor: "pointer", position: "relative", overflow: "hidden",
                  backgroundImage: "linear-gradient(90deg,rgba(0,0,0,.04) 2.5%,transparent 2.5%),linear-gradient(rgba(0,0,0,.04) 2.5%,transparent 2.5%),linear-gradient(90deg,#e2e8f0,#e2e8f0)",
                  backgroundSize: "40px 40px, 40px 40px, 100% 100%",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px",
                }}
              >
                <div style={{ width: "40px", height: "40px", borderRadius: "9999px", background: "#006e2f", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
                  <MapPin size={18} color="white" />
                </div>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "var(--brand-text-dark)", background: "rgba(255,255,255,0.85)", padding: "4px 12px", borderRadius: "9999px", margin: 0 }}>
                  Click to set location on map
                </p>
              </button>

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
                    <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", margin: 0 }}>{form.status === "open" ? "Visible to customers" : "Hidden from customers"}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setForm((f) => ({ ...f, status: f.status === "open" ? "closed" : "open" }))} style={{ width: "48px", height: "26px", borderRadius: "9999px", border: "none", background: form.status === "open" ? "var(--brand-green)" : "#cbced4", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                  <div style={{ position: "absolute", top: "3px", left: form.status === "open" ? "25px" : "3px", width: "20px", height: "20px", borderRadius: "9999px", background: "white", transition: "left 0.2s" }} />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button onClick={() => setDeleteOpen(true)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "6px", border: "1px solid #d4183d", background: "var(--card)", color: "#d4183d", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
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
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-cover rounded-lg shrink-0" />}
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
          selectedIds={form.menuItemIds}
          onToggle={handleCatalogToggle}
          onClose={() => setShowCatalog(false)}
        />
      )}
    </div>
  );
}
