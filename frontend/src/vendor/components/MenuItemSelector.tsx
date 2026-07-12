import { useState } from "react";
import { MenuItemCard } from "../../shared/components/MenuItemCard";
import { useMenuItems } from "../../shared/hooks/useMenuItems";
import { MENU_CATEGORIES } from "../../shared/constants/categories";
import type { MenuCategory, VendorMenuItem } from "../../shared/types";

interface MenuItemSelectorProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
  items?: VendorMenuItem[];
}

export function MenuItemSelector({ selectedIds, onToggle, items: providedItems }: MenuItemSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("All");
  const { items: vendorItems } = useMenuItems(activeCategory, { disabled: Boolean(providedItems) });
  const items = (providedItems ?? vendorItems).filter((item) => activeCategory === "All" || item.category === activeCategory);

  return (
    <div className="flex flex-col gap-4">
      {/* Category filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {MENU_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-1.5 rounded-full text-sm transition-colors border"
            style={{
              background: activeCategory === cat ? "var(--primary)" : "var(--card)",
              color: activeCategory === cat ? "var(--primary-foreground)" : "var(--foreground)",
              borderColor: activeCategory === cat ? "var(--primary)" : "var(--border)",
              fontFamily: "var(--font-sans, Poppins, sans-serif)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Selection count badge */}
      {selectedIds.length > 0 && (
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          <span style={{ color: "var(--foreground)", fontFamily: "var(--font-sans, Poppins, sans-serif)" }}>
            {selectedIds.length}
          </span>{" "}
          item{selectedIds.length !== 1 ? "s" : ""} selected
        </p>
      )}

      {/* Item grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            selected={selectedIds.includes(item.id)}
            onToggle={onToggle}
          />
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-sm py-8 text-center" style={{ color: "var(--muted-foreground)" }}>
          No items in this category.
        </p>
      )}
    </div>
  );
}
