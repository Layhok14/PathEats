import { MapPin, Star } from "lucide-react";
import { Badge } from "../../app/components/ui/badge";
import { Button } from "../../app/components/ui/button";
import { formatRating } from "../utils/formatters";
import type { Stall } from "../types";

interface StallCardProps {
  stall: Stall;
  onManage: (id: string) => void;
}

export function StallCard({ stall, onManage }: StallCardProps) {
  const isOpen = stall.status === "open";

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] overflow-hidden flex flex-col"
      style={{ opacity: isOpen ? 1 : 0.65 }}
    >
      {/* Stall image with status + category badges */}
      <div className="relative h-44 w-full overflow-hidden bg-[var(--muted)]">
        <img
          src={stall.photoUrl}
          alt={stall.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            className="text-xs font-medium"
            style={{
              background: isOpen ? "var(--color-success, #22c55e)" : "var(--muted)",
              color: isOpen ? "#fff" : "var(--muted-foreground)",
            }}
          >
            {isOpen ? "Open" : "Closed"}
          </Badge>
          <Badge
            className="text-xs font-medium"
            style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
          >
            {stall.category}
          </Badge>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Name + rating */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-base leading-snug"
            style={{ color: "var(--card-foreground)", fontFamily: "var(--font-sans, Poppins, sans-serif)" }}
          >
            {stall.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={14} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
            <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {formatRating(stall.rating)}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5">
          <MapPin size={13} style={{ color: "var(--muted-foreground)" }} />
          <span className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
            {stall.location.landmark}
          </span>
        </div>

        {/* Action */}
        <Button
          size="sm"
          className="mt-auto w-full"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          onClick={() => onManage(stall.id)}
        >
          Manage
        </Button>
      </div>
    </div>
  );
}
