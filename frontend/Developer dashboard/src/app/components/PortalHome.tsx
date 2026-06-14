import { useNavigate } from "react-router";
import imgLogo from "../../imports/Container/ef70e21ec0aaa2ffee26b321703893d006871c50.png";

const portals = [
  {
    path: "/admin",
    title: "Admin Portal",
    subtitle: "Management Portal",
    description: "Manage users, restaurants, complaints and system settings.",
    color: "#004b1e",
    badge: "5 modules",
    items: ["Dashboard", "User Management", "Restaurant Management", "Complaints", "Settings"],
  },
  {
    path: "/developer",
    title: "Developer Portal",
    subtitle: "Developer Tools",
    description: "Monitor infrastructure, error logs, database and backup systems.",
    color: "#0f1f13",
    badge: "4 modules",
    items: ["System Overview", "Database Management", "Error Logs", "Backup & Recovery"],
  },
];

export default function PortalHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-8">
      {/* Logo + title */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-full bg-[#004b1e] flex items-center justify-center overflow-hidden">
          <img
            src={imgLogo}
            alt="PathEat"
            className="w-9 h-9 object-contain"
            style={{ transform: "scaleY(-1) rotate(180deg)" }}
          />
        </div>
        <div>
          <p className="text-[22px] font-bold text-[#0b1c30]" style={{ fontFamily: "Poppins, sans-serif" }}>PathEat</p>
          <p className="text-[12px] text-[#64748b]">Select a portal to continue</p>
        </div>
      </div>

      {/* Portal cards */}
      <div className="flex gap-6 w-full max-w-3xl">
        {portals.map((p) => (
          <button
            key={p.path}
            onClick={() => navigate(p.path)}
            className="flex-1 text-left bg-white rounded-2xl border border-[#e2e8f0] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden group"
          >
            {/* Header band */}
            <div className="px-6 py-5 flex items-center gap-3" style={{ background: p.color }}>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                <img
                  src={imgLogo}
                  alt="PathEat"
                  className="w-7 h-7 object-contain"
                  style={{ transform: "scaleY(-1) rotate(180deg)" }}
                />
              </div>
              <div>
                <p className="text-white font-bold text-[15px]">{p.title}</p>
                <p className="text-[11px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.6)" }}>{p.subtitle}</p>
              </div>
              <span className="ml-auto text-[11px] font-medium bg-white/20 text-white px-2.5 py-0.5 rounded-full">{p.badge}</span>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-4">
              <p className="text-[13px] text-[#64748b]">{p.description}</p>
              <ul className="flex flex-col gap-1.5">
                {p.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[13px] text-[#374151]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006e2f] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div
                className="mt-2 w-full py-2.5 rounded-lg text-white text-[13px] font-semibold text-center group-hover:opacity-90 transition-opacity"
                style={{ background: p.color }}
              >
                Open Portal →
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
