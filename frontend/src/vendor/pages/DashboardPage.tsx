import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CircleCheck, MessageSquare, Plus, RefreshCw, Star, Store, UtensilsCrossed } from "lucide-react";
import api from "../../shared/services/axiosService";
import { getApiErrorMessage } from "../../shared/utils/apiError";

interface DashboardStats {
  total_stalls: number;
  open_stalls: number;
  avg_rating: number;
}

interface DashboardReview {
  id: string;
  user_name: string;
  stars: number;
  body: string;
  created_at: string;
  place_name: string;
  place_id: string;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reviews, setReviews] = useState<DashboardReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");
    try {
      const [statsResponse, reviewsResponse] = await Promise.all([
        api.get("/vendor/dashboard"),
        api.get("/vendor/reviews"),
      ]);
      setStats(statsResponse.data.data);
      setReviews(reviewsResponse.data.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load vendor dashboard."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const card: React.CSSProperties = {
    background: "var(--card)",
    border: "1px solid var(--brand-card-border)",
    borderRadius: "10px",
    padding: "24px",
  };

  const statCards = [
    { label: "Total Stalls", value: stats?.total_stalls ?? "—", icon: "🏪", color: "#22c55e" },
    { label: "Open Stalls", value: stats?.open_stalls ?? "—", icon: "👁", color: "#3b82f6" },
    { label: "Average Rating", value: stats ? Number(stats.avg_rating).toFixed(1) : "—", icon: "⭐", color: "#f59e0b" },
  ];

  const statPresentation = [
    { value: stats?.total_stalls ?? "-", icon: <Store size={18} />, color: "#006e2f" },
    { value: stats?.open_stalls ?? "-", icon: <CircleCheck size={18} />, color: "#005ac2" },
    { value: stats ? Number(stats.avg_rating).toFixed(1) : "-", icon: <Star size={18} />, color: "#b45309" },
  ];

  const quickActions = [
    { label: "Create Stall", icon: <Plus size={16} />, onClick: () => navigate("/vendor/stalls/new"), color: "#22c55e" },
    { label: "Manage Menu", icon: <UtensilsCrossed size={16} />, onClick: () => navigate("/vendor/menu"), color: "#3b82f6" },
    { label: "View Reviews", icon: <MessageSquare size={16} />, onClick: () => navigate("/vendor/reviews"), color: "#f59e0b" },
  ];

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <p style={{ color: "var(--brand-green-dark)", fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700 }}>
          Dashboard
        </p>
      </div>

      <div>
        <h1 style={{ color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "28px", fontWeight: 700, lineHeight: "1.2" }}>
          {greeting()}!
        </h1>
        <p style={{ color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "14px", marginTop: "4px" }}>
          Here's what's happening with your stall today.
        </p>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
          <span>{error}</span>
          <button onClick={loadDashboard} className="inline-flex items-center gap-1.5 font-semibold text-amber-900">
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {statCards.map((s, index) => (
          <div key={s.label} style={card}>
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-white" style={{ background: statPresentation[index].color }}>
              {statPresentation[index].icon}
            </div>
            <div style={{ color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "36px", fontWeight: 700, lineHeight: "1" }}>
              {loading ? "-" : statPresentation[index].value}
            </div>
            <div style={{ color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "14px", marginTop: "8px" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div style={card}>
          <span style={{ color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600 }}>
            Recent Reviews
          </span>
          {loading && reviews.length === 0 ? (
            <p style={{ color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "14px", marginTop: "16px" }}>
              Loading recent reviews...
            </p>
          ) : reviews.length === 0 ? (
            <p style={{ color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "14px", marginTop: "16px" }}>
              No reviews yet.
            </p>
          ) : (
            <div className="flex flex-col gap-5 mt-4">
              {reviews.slice(0, 3).map((r) => (
                <div key={r.id} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
                    style={{ background: "var(--muted)" }}>
                    <span style={{ color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600 }}>
                      {(r.user_name || "?")[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span style={{ color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600 }}>{r.user_name}</span>
                      <span style={{ color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "12px" }}>{timeAgo(r.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1 my-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} fill={i < Math.floor(r.stars) ? "#22c55e" : "none"} stroke={i < Math.floor(r.stars) ? "#22c55e" : "#ccc"} />
                      ))}
                      <span style={{ color: "var(--brand-green)", fontFamily: "Poppins, sans-serif", fontSize: "12px", marginLeft: "4px" }}>{r.stars}</span>
                    </div>
                    <p style={{ color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "13px" }}>{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => navigate("/vendor/reviews")}
            className="mt-4 w-full text-center hover:opacity-80 transition-opacity"
            style={{ color: "var(--brand-green)", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
          >
            View all reviews
          </button>
        </div>

        <div style={card}>
          <span style={{ color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600 }}>
            Quick Actions
          </span>
          <div className="flex flex-col gap-3 mt-4">
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={a.onClick}
                className="flex items-center gap-3 p-3 rounded-lg border transition-all hover:brightness-95 active:scale-[0.98] w-full text-left cursor-pointer"
                style={{ borderColor: "var(--brand-card-border)", background: "var(--card)" }}
              >
                <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-white" style={{ background: a.color }}>
                  {a.icon}
                </div>
                <span style={{ color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600 }}>
                  {a.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function timeAgo(iso: string): string {
  const time = new Date(iso).getTime();
  if (isNaN(time)) return "—";
  const diff = Date.now() - time;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
