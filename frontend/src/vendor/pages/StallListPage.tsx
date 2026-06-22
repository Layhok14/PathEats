import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Star, MapPin, Plus, List, Map } from "lucide-react";
import { useStalls } from "../../shared/hooks/useStalls";
import { StallMapView } from "../components/StallMapView";
import { STALL_CATEGORIES } from "../../shared/constants/categories";
import type { StallCategory } from "../../shared/types";

type ViewMode = "list" | "map";

export function StallListPage() {
  const navigate = useNavigate();
  const { stalls, loading } = useStalls();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<StallCategory | "All">("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed">("all");
  const [sortBy, setSortBy] = useState<"name" | "rating">("name");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const filtered = stalls
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .filter((s) => category === "All" || s.category === category)
    .filter((s) => statusFilter === "all" || s.status === statusFilter)
    .sort((a, b) => sortBy === "rating" ? (b.rating ?? 0) - (a.rating ?? 0) : a.name.localeCompare(b.name));

  const selectStyle: React.CSSProperties = {
    padding: "8px 12px", border: "1px solid var(--brand-card-border)",
    borderRadius: "6px", background: "var(--card)",
    fontFamily: "Poppins, sans-serif", fontSize: "14px",
    color: "var(--brand-text-dark)", cursor: "pointer", outline: "none",
  };

  function ViewToggle() {
    return (
      <div className="flex items-center rounded-lg overflow-hidden" style={{ border: "1px solid var(--brand-card-border)", background: "var(--card)" }}>
        {([["list", <List size={15} />, "List"] as const, ["map", <Map size={15} />, "Map"] as const]).map(([mode, icon, label]) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "7px 14px", border: "none",
              background: viewMode === mode ? "var(--brand-green)" : "transparent",
              color: viewMode === mode ? "white" : "var(--brand-text-muted)",
              fontFamily: "Poppins, sans-serif", fontSize: "13px",
              fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {icon}{label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <p style={{ color: "var(--brand-green-dark)", fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700 }}>
        Stall Management
      </p>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "28px", fontWeight: 700, color: "var(--brand-text-dark)" }}>My Stalls</h1>
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", marginTop: "4px" }}>
            Overview and management of all your active vending locations.
          </p>
        </div>
        <button
          onClick={() => navigate("/vendor/stalls/new")}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 20px", borderRadius: "6px", border: "none",
            background: "var(--brand-green)", color: "white",
            fontFamily: "Poppins, sans-serif", fontSize: "14px",
            fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          <Plus size={16} /> Register New Stall
        </button>
      </div>

      {/* Filters + view toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--brand-text-muted)" }} />
          <input
            type="text"
            placeholder="Search stalls..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "8px 12px 8px 36px",
              border: "1px solid var(--brand-card-border)", borderRadius: "6px",
              background: "var(--card)", fontFamily: "Poppins, sans-serif",
              fontSize: "14px", color: "var(--brand-text-dark)", outline: "none",
            }}
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value as StallCategory | "All")} style={selectStyle}>
          <option value="All">Category</option>
          {STALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "name" | "rating")} style={selectStyle}>
          <option value="name">Sort By: Name</option>
          <option value="rating">Sort By: Rating</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | "open" | "closed")} style={selectStyle}>
          <option value="all">All Stalls</option>
          <option value="open">Open Only</option>
          <option value="closed">Closed Only</option>
        </select>
        <ViewToggle />
      </div>

      {/* Loading state for both views */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border" style={{ borderColor: "var(--brand-card-border)", background: "var(--card)" }}>
          <div className="w-6 h-6 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-sm" style={{ color: "var(--brand-text-muted)" }}>Loading stalls from database...</p>
        </div>
      )}

      {/* Map view */}
      {!loading && viewMode === "map" && (
        <StallMapView stalls={filtered} loading={false} onPinClick={(id) => navigate(`/vendor/stalls/${id}`)} />
      )}

      {/* List view */}
      {!loading && viewMode === "list" && (
        filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((stall) => {
              const isOpen = stall.status === "open";
              return (
                <div
                  key={stall.id}
                  style={{
                    background: "var(--card)", borderRadius: "10px",
                    border: "1px solid var(--brand-card-border)",
                    overflow: "hidden", opacity: isOpen ? 1 : 0.7,
                  }}
                >
                  <div className="relative h-44 overflow-hidden" style={{ background: "var(--muted)" }}>
                    <img src={stall.photoUrl} alt={stall.name} className="w-full h-full object-cover" />
                    <span style={{
                      position: "absolute", top: "12px", left: "12px",
                      padding: "3px 10px", borderRadius: "9999px",
                      background: isOpen ? "var(--brand-green)" : "#6b7280",
                      color: "white", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: 600,
                    }}>
                      {isOpen ? "Open" : "Closed"}
                    </span>
                    <span style={{
                      position: "absolute", top: "12px", right: "12px",
                      padding: "3px 10px", borderRadius: "9999px",
                      background: "rgba(255,255,255,0.9)",
                      color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "11px", fontWeight: 500,
                    }}>
                      {stall.category}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "15px", fontWeight: 600, color: "var(--brand-text-dark)" }}>{stall.name}</p>
                      <div className="flex items-center gap-1">
                        <Star size={13} fill="#22c55e" stroke="#22c55e" />
                        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "var(--brand-text-muted)" }}>{Number(stall.rating ?? 0).toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-4">
                      <MapPin size={13} style={{ color: "var(--brand-text-muted)", flexShrink: 0 }} />
                      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "var(--brand-text-muted)" }} className="truncate">
                        {stall.location.landmark}
                      </span>
                    </div>

                    {/* View + Manage buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/vendor/stalls/${stall.id}/view`)}
                        style={{
                          flex: 1, padding: "8px 0", borderRadius: "6px",
                          border: "1px solid var(--brand-card-border)",
                          background: "var(--card)", color: "var(--brand-text-dark)",
                          fontFamily: "Poppins, sans-serif", fontSize: "13px",
                          fontWeight: 500, cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/vendor/stalls/${stall.id}`)}
                        style={{
                          flex: 1, padding: "8px 0", borderRadius: "6px",
                          border: "none", background: "var(--brand-green)",
                          color: "white", fontFamily: "Poppins, sans-serif",
                          fontSize: "13px", fontWeight: 600, cursor: "pointer",
                        }}
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 rounded-xl border" style={{ borderColor: "var(--brand-card-border)", background: "var(--card)" }}>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "var(--brand-text-muted)" }}>No stalls match your search.</p>
            <button
              onClick={() => { setSearch(""); setCategory("All"); }}
              style={{ marginTop: "12px", fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-green)", background: "none", border: "none", cursor: "pointer" }}
            >
              Clear filters
            </button>
          </div>
        )
      )}
    </div>
  );
}
