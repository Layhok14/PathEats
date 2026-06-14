import { NavLink, Outlet, useNavigate } from "react-router";
import { LayoutDashboard, Store, UtensilsCrossed, HelpCircle, Settings, LogOut, Star } from "lucide-react";

const NAV = [
  { to: "/vendor", label: "Dashboard", icon: <LayoutDashboard size={16} />, end: true },
  { to: "/vendor/stalls", label: "Stall Management", icon: <Store size={16} /> },
  { to: "/vendor/menu", label: "Menu Items", icon: <UtensilsCrossed size={16} /> },
  { to: "/vendor/reviews", label: "Reviews", icon: <Star size={16} /> },
  { to: "/vendor/support", label: "Support/Onboarding", icon: <HelpCircle size={16} /> },
  { to: "/vendor/settings", label: "Settings", icon: <Settings size={16} /> },
];

export function VendorLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8f9ff]">
      <aside className="flex flex-col w-[220px] shrink-0 h-full bg-[#004b1e]">
        <div className="px-4 py-4 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#004b1e"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            </div>
            <div>
              <p className="text-white font-bold text-[16px]">PathEat</p>
              <p className="text-[#bec6e0] text-[11px]">Vendor Portal</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 flex flex-col">
          {NAV.map((item) => (
            <NavLink
              key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-white text-[13px] font-medium transition-all ${isActive ? "bg-white/15 border-l-4 border-l-green-400" : "hover:bg-white/10"}`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 px-4 py-2.5 text-white text-[13px] font-medium w-full hover:bg-white/10 rounded-lg">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="shrink-0 h-14 flex items-center justify-end px-6 bg-white border-b border-[#e2e8f0]">
          <div className="w-7 h-7 rounded-full bg-[#006e2f] flex items-center justify-center text-white text-[11px] font-bold">V</div>
        </header>
        <main className="flex-1 overflow-y-auto bg-[#f8fafc]"><Outlet /></main>
      </div>
    </div>
  );
}
