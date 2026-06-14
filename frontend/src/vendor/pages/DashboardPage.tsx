import { useNavigate } from "react-router";
import { Star } from "lucide-react";
import imgBaiSach from "../../imports/VendorDashboardLight-1/3048f6f12148eeea4287f0fca295f192a3c56447.png";
import imgKuyteav from "../../imports/VendorDashboardLight-1/617a1a225ae66b185e6c03269982907fbece9a08.png";
import imgFriedRice from "../../imports/VendorDashboardLight-1/66a037bcc802045147a6711455fa000235fc2231.png";

// Pure SVG line chart — avoids recharts' internal key conflicts with Figma Make's FGCmp inspector
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
      {/* Horizontal grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = PAD.top + chartH * (1 - t);
        return <line key={t} x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />;
      })}
      {/* Area fill */}
      <path d={area} fill="#22c55e" fillOpacity={0.08} />
      {/* Line */}
      <path d={path} fill="none" stroke="#22c55e" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {/* Dots */}
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r={4} fill="#22c55e" />
      ))}
      {/* X-axis labels */}
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

const reviews = [
  { name: "Sokun Nuth", rating: 5.0, text: "Delicious and cheap! Very good service.", time: "2 days ago" },
  { name: "Dara Kim", rating: 4.0, text: "Good taste and fast!", time: "3 days ago" },
  { name: "Ravy Touch", rating: 5.0, text: "My favorite place on the way home.", time: "5 days ago" },
];

const topItems = [
  { name: "Bai Sach Chrouk", price: "$2.00", color: "#22c55e" },
  { name: "Kuyteav Soup", price: "$1.75", color: "#3b82f6" },
  { name: "Fried Rice", price: "$2.00", color: "#f59e0b" },
];

const stats = [
  { label: "Menu Items", value: "25", icon: "🍴", color: "#22c55e" },
  { label: "Total Views", value: "560", icon: "👁", color: "#3b82f6" },
  { label: "Average Rating", value: "4.6", icon: "⭐", color: "#f59e0b" },
  { label: "Total Reviews", value: "120", icon: "💬", color: "#a855f7" },
];

export function DashboardPage() {
  const navigate = useNavigate();

  const card: React.CSSProperties = {
    background: "var(--card)",
    border: "1px solid var(--brand-card-border)",
    borderRadius: "10px",
    padding: "24px",
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Page title */}
      <div>
        <p style={{ color: "var(--brand-green-dark)", fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700 }}>
          Dashboard
        </p>
      </div>

      {/* Greeting */}
      <div>
        <h1 style={{ color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "28px", fontWeight: 700, lineHeight: "1.2" }}>
          Good morning, Layhok!
        </h1>
        <p style={{ color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "14px", marginTop: "4px" }}>
          Here's what's happening with your stall today.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
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

      {/* Reviews + Top Items */}
      <div className="grid grid-cols-2 gap-4">
        {/* Recent Reviews */}
        <div style={card}>
          <div className="flex items-center justify-between mb-4">
            <span style={{ color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600 }}>
              Recent Reviews
            </span>
          </div>
          <div className="flex flex-col gap-5">
            {reviews.map((r) => (
              <div key={r.name} className="flex gap-3">
                <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
                  style={{ background: "var(--muted)" }}>
                  <span style={{ color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600 }}>
                    {r.name[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span style={{ color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600 }}>{r.name}</span>
                    <span style={{ color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "12px" }}>{r.time}</span>
                  </div>
                  <div className="flex items-center gap-1 my-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} fill={i < Math.floor(r.rating) ? "#22c55e" : "none"} stroke={i < Math.floor(r.rating) ? "#22c55e" : "#ccc"} />
                    ))}
                    <span style={{ color: "var(--brand-green)", fontFamily: "Poppins, sans-serif", fontSize: "12px", marginLeft: "4px" }}>{r.rating}</span>
                  </div>
                  <p style={{ color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "13px" }}>{r.text}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/vendor/reviews")}
            className="mt-4 w-full text-center hover:opacity-80 transition-opacity"
            style={{ color: "var(--brand-green)", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
          >
            View all reviews
          </button>
        </div>

        {/* Top Selling Items */}
        <div style={card}>
          <span style={{ color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600 }}>
            Top Selling Items
          </span>
          <div className="flex flex-col gap-3 mt-4">
            {topItems.map((item) => (
              <div key={item.name} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: "var(--brand-card-border)" }}>
                <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center text-white font-bold" style={{ background: item.color }}>{item.name[0]}</div>
                <div>
                  <p style={{ color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600 }}>{item.name}</p>
                  <p style={{ color: "var(--brand-green)", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 500 }}>{item.price}</p>
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

      {/* Analytics Chart */}
      <div style={card}>
        <p style={{ color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600, marginBottom: "20px" }}>
          Analytics <span style={{ color: "var(--brand-text-muted)", fontWeight: 400 }}>(This Week)</span>
        </p>
        <SvgLineChart data={analyticsData} />
      </div>
    </div>
  );
}
