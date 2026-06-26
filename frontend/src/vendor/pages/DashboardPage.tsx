import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Star } from "lucide-react";
import api from "../../shared/services/axiosService";

function SvgLineChart({ data }: { data: { day: string; views: number }[] }) {
  const W = 860, H = 200, PAD = { top: 16, right: 20, bottom: 32, left: 10 };
  const vals = data.map((d) => d.views);
  const minV = Math.min(...vals), maxV = Math.max(...vals);
  const range = maxV - minV || 1;
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const xs = data.map((_, i) => PAD.left + (i / (data.length - 1)) * chartW);
  const ys = data.map((d) => PAD.top + chartH - ((d.views - minV) / range) * chartH);
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const area = `${path} L${xs[xs.length - 1].toFixed(1)},${(PAD.top + chartH).toFixed(1)} L${xs[0].toFixed(1)},${(PAD.top + chartH).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = PAD.top + chartH * (1 - t);
        return <line key={t} x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />;
      })}
      <path d={area} fill="#22c55e" fillOpacity={0.08} />
      <path d={path} fill="none" stroke="#22c55e" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r={4} fill="#22c55e" />
      ))}
      {data.map((d, i) => (
        <text key={i} x={xs[i]} y={H - 6} textAnchor="middle" fontSize={10} fill="#565e74" fontFamily="Poppins, sans-serif">
          {d.day}
        </text>
      ))}
    </svg>
  );
}

const analyticsData = [
  { day: "MAY 10", views: 120 },
  { day: "MAY 11", views: 220 },
  { day: "MAY 12", views: 180 },
  { day: "MAY 13", views: 310 },
  { day: "MAY 14", views: 160 },
  { day: "MAY 15", views: 390 },
  { day: "MAY 16", views: 420 },
];

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

export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reviews, setReviews] = useState<DashboardReview[]>([]);

  useEffect(() => {
    api.get("/vendor/dashboard").then(({ data }) => setStats(data.data)).catch(() => {});
    api.get("/vendor/reviews").then(({ data }) => setReviews(data.data)).catch(() => {});
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

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <p style={{ color: "var(--brand-green-dark)", fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700 }}>
          Dashboard
        </p>
      </div>

      <div>
        <h1 style={{ color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "28px", fontWeight: 700, lineHeight: "1.2" }}>
          Good morning!
        </h1>
        <p style={{ color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "14px", marginTop: "4px" }}>
          Here's what's happening with your stall today.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {statCards.map((s) => (
          <div key={s.label} style={card}>
            <div className="text-2xl mb-3">{s.icon}</div>
            <div style={{ color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "36px", fontWeight: 700, lineHeight: "1" }}>
              {s.value}
            </div>
            <div style={{ color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "14px", marginTop: "8px" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div style={card}>
          <div className="flex items-center justify-between mb-4">
            <span style={{ color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600 }}>
              Recent Reviews
            </span>
          </div>
          {reviews.length === 0 ? (
            <p style={{ color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
              No reviews yet.
            </p>
          ) : (
            <div className="flex flex-col gap-5">
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
            Top Selling Items
          </span>
          <div className="flex flex-col gap-3 mt-4">
            {[
              { name: "Bai Sach Chrouk", price: 2.00, color: "#22c55e" },
              { name: "Kuyteav Soup", price: 1.75, color: "#3b82f6" },
              { name: "Fried Rice", price: 2.00, color: "#f59e0b" },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: "var(--brand-card-border)" }}>
                <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center text-white font-bold" style={{ background: item.color }}>{item.name[0]}</div>
                <div>
                  <p style={{ color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600 }}>{item.name}</p>
                  <p style={{ color: "var(--brand-green)", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 500 }}>${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/vendor/menu")}
            className="mt-4 w-full text-center hover:opacity-80 transition-opacity"
            style={{ color: "var(--brand-green)", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
          >
            View all menu items
          </button>
        </div>
      </div>

      <div style={card}>
        <p style={{ color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600, marginBottom: "20px" }}>
          Analytics <span style={{ color: "var(--brand-text-muted)", fontWeight: 400 }}>(This Week)</span>
        </p>
        <SvgLineChart data={analyticsData} />
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
