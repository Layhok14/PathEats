import { Check } from "lucide-react";
import { formatPrice } from "../utils/formatters";
import type { VendorMenuItem as MenuItem } from "../types";

interface MenuItemCardProps {
  item: MenuItem;
  selected: boolean;
  onToggle: (id: string) => void;
}

export function MenuItemCard({ item, selected, onToggle }: MenuItemCardProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(item.id)}
      className="relative rounded-[var(--radius-lg)] border overflow-hidden text-left transition-all focus:outline-none focus-visible:ring-2"
      style={{
        borderColor: selected ? "var(--primary)" : "var(--border)",
        background: "var(--card)",
        boxShadow: selected ? "0 0 0 2px var(--primary)" : undefined,
        opacity: item.isAvailable ? 1 : 0.5,
        cursor: item.isAvailable ? "pointer" : "not-allowed",
      }}
      disabled={!item.isAvailable}
      aria-pressed={selected}
    >
      {/* Checkmark overlay */}
      {selected && (
        <div
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center z-10"
          style={{ background: "var(--primary)" }}
        >
          <Check size={13} color="var(--primary-foreground)" strokeWidth={2.5} />
        </div>
      )}

      {/* Image */}
      <div className="h-32 w-full overflow-hidden bg-[var(--muted)] flex items-center justify-center text-3xl text-[#94a3b8]">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          "🍽"
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        <span
          className="text-sm leading-snug"
          style={{ color: "var(--card-foreground)", fontFamily: "var(--font-sans, Poppins, sans-serif)" }}
        >
          {item.name}
        </span>
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {item.description}
        </span>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-medium" style={{ color: "var(--primary)" }}>
            {formatPrice(item.price)}
          </span>
          {!item.isAvailable && (
            <span className="text-xs" style={{ color: "var(--destructive)" }}>
              Sold out
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
