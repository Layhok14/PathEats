import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Star, ChevronLeft, MessageSquare, Search } from "lucide-react";
import { formatDate } from "../../shared/utils/formatters";
import api from "../../shared/services/axiosService";
import { LoadingSpinner } from "../../shared/components/LoadingSpinner";

interface Review {
  id: string;
  user_name: string;
  stars: number;
  body: string;
  created_at: string;
  place_name: string;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rating ? "#22c55e" : "none"}
          stroke={i < rating ? "#22c55e" : "#d1d5db"}
        />
      ))}
      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "var(--brand-green)", marginLeft: "6px", fontWeight: 500 }}>
        {rating}.0
      </span>
    </div>
  );
}

export function ReviewsPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api.get("/vendor/reviews").then(({ data }) => {
      setReviews(data.data || []);
    }).catch(() => {
      setFetchError("Failed to load reviews.");
    }).finally(() => setLoading(false));
  }, []);

  const filtered = reviews.filter((r) => {
    if (starFilter !== null && r.stars !== starFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      return r.body?.toLowerCase().includes(q) || r.user_name?.toLowerCase().includes(q);
    }
    return true;
  });

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.stars, 0) / reviews.length
    : 0;
  const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => { dist[r.stars] = (dist[r.stars] || 0) + 1; });

  const card: React.CSSProperties = {
    background: "var(--card)", border: "1px solid var(--brand-card-border)",
    borderRadius: "10px", padding: "20px",
  };

  const inpStyle: React.CSSProperties = {
    width: "100%", border: "1px solid var(--brand-input-border)", borderRadius: "6px",
    padding: "9px 12px 9px 34px", fontSize: "13px", fontFamily: "Poppins, sans-serif",
    color: "var(--brand-text-dark)", background: "var(--card)", outline: "none",
  };

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[800px] mx-auto">
      <button
        onClick={() => navigate("/vendor")}
        style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}
      >
        <ChevronLeft size={16} /> Back to Dashboard
      </button>

      <div>
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "28px", fontWeight: 700, color: "var(--brand-text-dark)" }}>All Reviews</h1>
        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", marginTop: "4px" }}>
          Customer feedback across all your stalls
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading reviews..." />
      ) : fetchError ? (
        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "#ef4444" }}>{fetchError}</p>
      ) : reviews.length === 0 ? (
        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)" }}>No reviews yet.</p>
      ) : (
        <>
          {/* Summary card */}
          <div style={card} className="flex items-center gap-8">
            <div className="text-center">
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "48px", fontWeight: 700, color: "var(--brand-text-dark)", lineHeight: 1 }}>
                {avgRating.toFixed(1)}
              </p>
              <StarRow rating={Math.round(avgRating)} />
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", marginTop: "6px" }}>
                {reviews.length} reviews
              </p>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "var(--brand-text-muted)", width: "16px" }}>{star}</span>
                  <Star size={12} fill="#22c55e" stroke="#22c55e" />
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${((dist[star] || 0) / reviews.length) * 100}%`, background: "var(--brand-green)" }}
                    />
                  </div>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", width: "20px" }}>
                    {dist[star] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--brand-text-muted)", pointerEvents: "none" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by review or submitter name..."
                style={inpStyle}
              />
            </div>
            <div className="flex gap-1">
              {[null, 5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star === null ? "all" : star}
                  onClick={() => setStarFilter(star)}
                  style={{
                    padding: "6px 12px", borderRadius: "9999px", border: "none",
                    background: starFilter === star ? "var(--brand-green)" : "var(--muted)",
                    color: starFilter === star ? "white" : "var(--brand-text-dark)",
                    fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: 600,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: "3px",
                  }}
                >
                  {star === null ? "All" : <>{star}<Star size={10} fill={starFilter === star ? "white" : "currentColor"} /></>}
                </button>
              ))}
            </div>
            {filtered.length < reviews.length && (
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)" }}>
                Showing {filtered.length} of {reviews.length}
              </span>
            )}
          </div>

          {/* Review list */}
          <div className="flex flex-col gap-4">
            {filtered.length === 0 ? (
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", textAlign: "center", padding: "20px" }}>
                No reviews match your filters.
              </p>
            ) : filtered.map((review) => (
              <div key={review.id} style={card}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "var(--muted)" }}
                    >
                      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "15px", fontWeight: 600, color: "var(--brand-text-muted)" }}>
                        {review.user_name?.[0] || "?"}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--brand-text-dark)", margin: 0 }}>
                        {review.user_name || "Anonymous"}
                      </p>
                      <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", margin: 0 }}>
                        {review.place_name}
                      </p>
                    </div>
                  </div>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", whiteSpace: "nowrap" }}>
                    {formatDate(review.created_at, true)}
                  </span>
                </div>
                <StarRow rating={review.stars} />
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-dark)", marginTop: "10px", lineHeight: 1.6 }}>
                  {review.body || "No comment."}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
