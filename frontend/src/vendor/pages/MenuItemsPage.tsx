import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { PhotoUpload } from "../components/PhotoUpload";
import { toast } from "sonner";
import { useMenuItems } from "../../shared/hooks/useMenuItems";
import type { MenuItemFormData } from "../../shared/hooks/useMenuItems";
import { MENU_CATEGORIES } from "../../shared/constants/categories";
import { formatPrice } from "../../shared/utils/formatters";
import type { VendorMenuItem as MenuItem, MenuCategory } from "../../shared/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../app/components/ui/dialog";

const inp: React.CSSProperties = {
  width: "100%", border: "1px solid var(--brand-input-border)", borderRadius: "4px",
  padding: "10px 14px", fontSize: "14px", fontFamily: "Poppins, sans-serif",
  color: "var(--brand-text-dark)", background: "var(--card)", outline: "none",
};
const lbl: React.CSSProperties = {
  fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: 500,
  color: "var(--brand-text-dark)", display: "block", marginBottom: "6px",
};

function ItemFormModal({
  item, onClose, onSave,
}: { item: MenuItem | null; onClose: () => void; onSave: (data: MenuItemFormData) => Promise<void> }) {
  const [form, setForm] = useState({
    name: item?.name ?? "",
    description: item?.description ?? "",
    price: item ? String(item.price) : "",
    imageUrl: item?.imageUrl ?? "",
    storageImage: item?.storageImage ?? null,
    category: (item?.category as MenuCategory) ?? "Snack",
    isAvailable: item?.isAvailable ?? true,
  });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Item name is required."); return; }
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum < 0) { toast.error("Valid price is required."); return; }
    setSaving(true);
    try {
      await onSave({
        name: form.name,
        description: form.description,
        price: priceNum,
        imageUrl: form.imageUrl,
        storageImage: form.storageImage,
        category: form.category,
        isAvailable: form.isAvailable,
      });
      toast.success(item ? "Menu item updated." : "New item created.");
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not save menu item.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent style={{ maxWidth: "480px" }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "Poppins, sans-serif" }}>
            {item ? "Edit Menu Item" : "Add New Menu Item"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4 mt-2">
          <div>
            <label style={lbl}>Item Name *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Chicken Rice" style={inp} />
          </div>
          <div>
            <label style={lbl}>Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} style={{ ...inp, resize: "vertical" }} placeholder="Brief description" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={lbl}>Price ($) *</label>
              <input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="0.00" inputMode="decimal" style={inp} />
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
            <button type="button" onClick={() => setForm((f) => ({ ...f, isAvailable: !f.isAvailable }))} style={{ width: "44px", height: "24px", borderRadius: "9999px", border: "none", background: form.isAvailable ? "var(--brand-green)" : "#cbced4", cursor: "pointer", position: "relative", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: "2px", left: form.isAvailable ? "22px" : "2px", width: "20px", height: "20px", borderRadius: "9999px", background: "white", transition: "left 0.2s" }} />
            </button>
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-dark)" }}>
              {form.isAvailable ? "Available" : "Sold out"}
            </span>
          </div>
          <DialogFooter>
            <button type="button" onClick={onClose} style={{ padding: "10px 20px", borderRadius: "6px", border: "1px solid var(--brand-card-border)", background: "var(--card)", fontFamily: "Poppins, sans-serif", cursor: "pointer" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : item ? "Update Item" : "Add Item"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function MenuItemsPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("All");
  const [search, setSearch] = useState("");
  const [modalItem, setModalItem] = useState<MenuItem | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);

  const { items, allItems, createItem, updateItem, deleteItem } = useMenuItems(activeCategory);

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  async function handleSave(data: MenuItemFormData) {
    if (modalItem && modalItem !== "new") {
      await updateItem((modalItem as MenuItem).id, data);
    } else {
      await createItem(data);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteItem(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not delete menu item.");
    }
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <p style={{ color: "var(--brand-green-dark)", fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700 }}>Menu Items</p>

      {/* Summary chips */}
      <div className="flex gap-4 flex-wrap">
        <div style={{ background: "var(--card)", border: "1px solid var(--brand-card-border)", borderRadius: "8px", padding: "12px 20px" }}>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "22px", fontWeight: 700, color: "var(--brand-text-dark)" }}>{allItems.length}</span>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "var(--brand-text-muted)", marginLeft: "8px" }}>Total Items</span>
        </div>
        <div style={{ background: "var(--card)", border: "1px solid var(--brand-card-border)", borderRadius: "8px", padding: "12px 20px" }}>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "22px", fontWeight: 700, color: "var(--brand-green)" }}>{allItems.filter((i) => i.isAvailable).length}</span>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "var(--brand-text-muted)", marginLeft: "8px" }}>Available</span>
        </div>
        <div style={{ background: "var(--card)", border: "1px solid var(--brand-card-border)", borderRadius: "8px", padding: "12px 20px" }}>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "22px", fontWeight: 700, color: "#d4183d" }}>{allItems.filter((i) => !i.isAvailable).length}</span>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "var(--brand-text-muted)", marginLeft: "8px" }}>Sold Out</span>
        </div>
      </div>

      {/* Search + Add */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--brand-text-muted)" }} />
          <input
            type="text" placeholder="Search items..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "8px 12px 8px 36px", border: "1px solid var(--brand-card-border)", borderRadius: "6px", background: "var(--card)", fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-dark)", outline: "none" }}
          />
        </div>
        <button
          onClick={() => setModalItem("new")}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "6px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
        >
          <Plus size={16} /> Add Menu Item
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {MENU_CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: "6px 18px", borderRadius: "9999px", border: "none", background: activeCategory === cat ? "var(--brand-green)" : "var(--muted)", color: activeCategory === cat ? "white" : "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "14px", cursor: "pointer", transition: "all 0.15s" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div key={item.id} style={{ background: "var(--card)", borderRadius: "10px", border: "1px solid var(--brand-card-border)", overflow: "hidden", opacity: item.isAvailable ? 1 : 0.65 }}>
              <div className="relative h-36 overflow-hidden" style={{ background: "var(--muted)" }}>
                {item.imageUrl
                  ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center" style={{ color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "24px" }}>🍽</div>
                }
                {!item.isAvailable && (
                  <span style={{ position: "absolute", top: "8px", right: "8px", padding: "2px 8px", borderRadius: "9999px", background: "#d4183d", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "11px", fontWeight: 600 }}>Sold out</span>
                )}
                <span style={{ position: "absolute", bottom: "8px", left: "8px", padding: "2px 8px", borderRadius: "9999px", background: "rgba(0,0,0,0.55)", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "11px" }}>{item.category}</span>
              </div>
              <div className="p-3 flex flex-col gap-1">
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--brand-text-dark)", margin: 0 }}>{item.name}</p>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } as React.CSSProperties}>{item.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "15px", fontWeight: 700, color: "var(--brand-green)" }}>{formatPrice(item.price)}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => setModalItem(item)} style={{ padding: "5px 10px", borderRadius: "5px", border: "1px solid var(--brand-card-border)", background: "var(--card)", fontFamily: "Poppins, sans-serif", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", color: "var(--brand-text-dark)" }}>
                      <Pencil size={11} /> Edit
                    </button>
                    <button onClick={() => setDeleteTarget(item)} style={{ padding: "5px 8px", borderRadius: "5px", border: "1px solid #d4183d", background: "var(--card)", cursor: "pointer", display: "flex", alignItems: "center", color: "#d4183d" }}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-16" style={{ color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
          No items found. {activeCategory !== "All" && <button onClick={() => setActiveCategory("All")} style={{ color: "var(--brand-green)", background: "none", border: "none", cursor: "pointer", marginLeft: "6px" }}>Show all</button>}
        </div>
      )}

      {/* Add/Edit modal */}
      {modalItem !== null && (
        <ItemFormModal
          item={modalItem === "new" ? null : modalItem}
          onClose={() => setModalItem(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <Dialog open onOpenChange={() => setDeleteTarget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: "Poppins, sans-serif" }}>Delete Item</DialogTitle>
            </DialogHeader>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)" }}>
              Delete <strong>{deleteTarget.name}</strong>? This removes it from the catalog and all linked stalls.
            </p>
            <DialogFooter>
              <button onClick={() => setDeleteTarget(null)} style={{ padding: "10px 20px", borderRadius: "6px", border: "1px solid var(--brand-card-border)", background: "var(--card)", fontFamily: "Poppins, sans-serif", cursor: "pointer" }}>Cancel</button>
              <button onClick={confirmDelete} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", background: "#d4183d", color: "white", fontFamily: "Poppins, sans-serif", fontWeight: 600, cursor: "pointer" }}>Delete</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
