import { useNavigate } from "react-router";
import { Star, ChevronLeft } from "lucide-react";

const ALL_REVIEWS = [
  { id: 1, name: "Sokun Nuth", rating: 5, comment: "Delicious and cheap! Very good service.", time: "2 days ago", stall: "Healthy Shop" },
  { id: 2, name: "Dara Kim", rating: 4, comment: "Good taste and fast!", time: "3 days ago", stall: "Happy Food" },
  { id: 3, name: "Ravy Touch", rating: 5, comment: "My favorite place on the way home. The rice bowls are always fresh.", time: "5 days ago", stall: "Healthy Shop" },
  { id: 4, name: "Chenda Lim", rating: 3, comment: "Food was ok but had to wait a while. Would come back for the noodles.", time: "1 week ago", stall: "Metro Pizza" },
  { id: 5, name: "Pisey Mao", rating: 5, comment: "Best stall near the station! The portions are generous and prices are great.", time: "1 week ago", stall: "Healthy Shop" },
  { id: 6, name: "Visal Heng", rating: 4, comment: "Really enjoyed the Pad Thai. Will definitely recommend to friends.", time: "2 weeks ago", stall: "Happy Food" },
  { id: 7, name: "Sreyleak Oun", rating: 2, comment: "Stall was closed when I arrived even though it said open. Disappointing.", time: "2 weeks ago", stall: "Zipo Pizza" },
  { id: 8, name: "Bunthoeun Chan", rating: 5, comment: "Authentic flavors! Reminds me of home cooking. Staff is very friendly.", time: "3 weeks ago", stall: "Healthy Shop" },
];

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

  const avgRating = ALL_REVIEWS.reduce((s, r) => s + r.rating, 0) / ALL_REVIEWS.length;
  const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  ALL_REVIEWS.forEach((r) => { dist[r.rating] = (dist[r.rating] || 0) + 1; });

  const card: React.CSSProperties = {
    background: "var(--card)", border: "1px solid var(--brand-card-border)",
    borderRadius: "10px", padding: "20px",
  };

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[800px]">
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

      {/* Summary */}
      <div style={card} className="flex items-center gap-8">
        <div className="text-center">
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "48px", fontWeight: 700, color: "var(--brand-text-dark)", lineHeight: 1 }}>
            {avgRating.toFixed(1)}
          </p>
          <StarRow rating={Math.round(avgRating)} />
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", marginTop: "6px" }}>
            {ALL_REVIEWS.length} reviews
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
                  style={{ width: `${((dist[star] || 0) / ALL_REVIEWS.length) * 100}%`, background: "var(--brand-green)" }}
                />
              </div>
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", width: "20px" }}>
                {dist[star] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review list */}
      <div className="flex flex-col gap-4">
        {ALL_REVIEWS.map((review) => (
          <div key={review.id} style={card}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "var(--muted)" }}
                >
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "15px", fontWeight: 600, color: "var(--brand-text-muted)" }}>
                    {review.name[0]}
                  </span>
                </div>
                <div>
                  <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--brand-text-dark)", margin: 0 }}>
                    {review.name}
                  </p>
                  <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", margin: 0 }}>
                    {review.stall}
                  </p>
                </div>
              </div>
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", whiteSpace: "nowrap" }}>
                {review.time}
              </span>
            </div>
            <StarRow rating={review.rating} />
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-dark)", marginTop: "10px", lineHeight: 1.6 }}>
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
