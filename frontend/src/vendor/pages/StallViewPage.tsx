import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, MapPin, Star, Edit } from "lucide-react";
import { useStalls } from "../../shared/hooks/useStalls";
import { LoadingSpinner } from "../../shared/components/LoadingSpinner";
import { formatPrice } from "../../shared/utils/formatters";
import api from "../../shared/services/axiosService";
import type { Stall, VendorMenuItem as MenuItem } from "../../shared/types";

export function StallViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getStall, loading } = useStalls();
  const [stall, setStall] = useState<Stall | null>(null);
  const [linkedItems, setLinkedItems] = useState<MenuItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setStall(getStall(id));
  }, [id, getStall]);

  useEffect(() => {
    if (!id) return;
    setItemsLoading(true);
    setItemsError(null);
    api.get(`/vendor/stalls/${id}/items`).then(({ data }) => {
      setLinkedItems(data.data.map(mapItem));
    }).catch(() => {
      setItemsError("Failed to load menu items.");
    }).finally(() => setItemsLoading(false));
  }, [id]);

  if (loading || itemsLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!stall) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64 gap-4">
        <p style={{ fontFamily: "Poppins, sans-serif", color: "var(--brand-text-muted)" }}>Stall not found.</p>
        <button onClick={() => navigate("/vendor/stalls")} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", cursor: "pointer" }}>
          Back to Stalls
        </button>
      </div>
    );
  }

  if (itemsError) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64 gap-4">
        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "#ef4444" }}>{itemsError}</p>
        <button onClick={() => navigate("/vendor/stalls")} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", cursor: "pointer" }}>
          Back to Stalls
        </button>
      </div>
    );
  }

  const linkedItemsForDisplay = linkedItems;
  function mapItem(row: any): MenuItem {
    return {
      id: row.id,
      name: row.name,
      description: row.description || "",
      price: parseFloat(row.price),
      imageUrl: row.image_url || "",
      category: (row.category === "main course" ? "Main Course" : row.category === "snack" ? "Snack" : row.category === "drink" ? "Drink" : row.category === "dessert" ? "Dessert" : "All") as any,
      isAvailable: row.is_available,
    };
  }
  const isOpen = stall.status === "open";

  const card: React.CSSProperties = {
    background: "var(--card)", border: "1px solid var(--brand-card-border)",
    borderRadius: "10px", padding: "24px",
  };
  const label: React.CSSProperties = {
    fontFamily: "Poppins, sans-serif", fontSize: "12px",
    color: "var(--brand-text-muted)", textTransform: "uppercase",
    letterSpacing: "0.5px", marginBottom: "4px",
  };
  const value: React.CSSProperties = {
    fontFamily: "Poppins, sans-serif", fontSize: "15px",
    color: "var(--brand-text-dark)",
  };

  return (
    <div className="p-6 flex flex-col gap-5 max-w-[900px]">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/vendor/stalls")}
          style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}
        >
          <ChevronLeft size={16} /> Back to My Stalls
        </button>
        <button
          onClick={() => navigate(`/vendor/stalls/${id}`)}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 20px", borderRadius: "6px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
        >
          <Edit size={15} /> Manage Stall
        </button>
      </div>

      {/* Stall header */}
      <div style={card}>
        <div className="flex gap-5">
          {stall.photoUrl && (
            <img src={stall.photoUrl} alt={stall.name} loading="lazy" className="w-36 h-36 object-cover rounded-lg shrink-0" style={{ border: "1px solid var(--brand-card-border)" }} />
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700, color: "var(--brand-text-dark)", margin: 0 }}>{stall.name}</h1>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", marginTop: "4px" }}>{stall.category}</p>
              </div>
              <span style={{ padding: "4px 14px", borderRadius: "9999px", background: isOpen ? "var(--brand-green)" : "#6b7280", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: 600 }}>
                {isOpen ? "Open" : "Closed"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-3">
              <Star size={14} fill="#22c55e" stroke="#22c55e" />
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--brand-text-dark)" }}>{Number(stall.rating ?? 0).toFixed(1)}</span>
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "var(--brand-text-muted)" }}>({stall.reviewCount ?? 0} reviews)</span>
            </div>

            <div className="flex items-center gap-1.5 mt-2">
              <MapPin size={14} style={{ color: "var(--brand-text-muted)" }} />
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)" }}>{stall.location.landmark}</span>
            </div>

            {stall.description && (
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-dark)", marginTop: "12px", lineHeight: 1.6 }}>{stall.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-5">
        <div style={card}>
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600, color: "var(--brand-text-dark)", marginBottom: "16px" }}>Operating Hours</p>
          <div className="flex flex-col gap-3">
            {(["weekdays", "weekends"] as const).map((part) => (
              <div key={part} className="flex justify-between">
                <span style={label}>{part === "weekdays" ? "Mon–Fri" : "Sat–Sun"}</span>
                <span style={value}>{stall.operatingHours[part].open} – {stall.operatingHours[part].close}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600, color: "var(--brand-text-dark)", marginBottom: "16px" }}>Location</p>
          <div className="flex flex-col gap-3">
            <div>
              <p style={label}>Landmark</p>
              <p style={value}>{stall.location.landmark}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p style={label}>Latitude</p>
                <p style={value}>{stall.location.latitude}</p>
              </div>
              <div>
                <p style={label}>Longitude</p>
                <p style={value}>{stall.location.longitude}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div style={card}>
        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600, color: "var(--brand-text-dark)", marginBottom: "16px" }}>
          Menu Items ({linkedItemsForDisplay.length})
        </p>
        {linkedItemsForDisplay.length === 0 ? (
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)" }}>No menu items linked.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {linkedItemsForDisplay.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: "var(--brand-card-border)", opacity: item.isAvailable ? 1 : 0.5 }}>
                <img src={item.imageUrl} alt={item.name} loading="lazy" className="w-12 h-12 object-cover rounded-lg shrink-0" />
                <div>
                  <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--brand-text-dark)", margin: 0 }}>{item.name}</p>
                  <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "var(--brand-green)", margin: 0 }}>{formatPrice(item.price)}</p>
                  {!item.isAvailable && <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "11px", color: "var(--destructive)", margin: 0 }}>Sold out</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
