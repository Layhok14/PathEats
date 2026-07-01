import { NavLink, Outlet } from "react-router";
import { LayoutDashboard, Store, UtensilsCrossed, Star, UserPlus, Settings } from "lucide-react";

const NAV = [
  { to: "/vendor", label: "Dashboard", icon: <LayoutDashboard size={16} />, end: true },
  { to: "/vendor/stalls", label: "Stall Management", icon: <Store size={16} /> },
  { to: "/vendor/menu", label: "Menu Items", icon: <UtensilsCrossed size={16} /> },
  { to: "/vendor/reviews", label: "Reviews", icon: <Star size={16} /> },
  { to: "/vendor/onboarding", label: "Onboarding", icon: <UserPlus size={16} /> },
  { to: "/vendor/settings", label: "Settings", icon: <Settings size={16} /> },
];

export function VendorLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8f9ff]">
      <aside className="flex flex-col w-[240px] shrink-0 h-full bg-[#004b1e]">
        <div className="px-4 py-4 pb-6">
          <div className="flex items-center gap-2">
            <img src="/logo-to-use.png" alt="PathEats" className="w-8 h-8 rounded-full object-cover shrink-0" />
            <div>
              <p className="text-white font-bold text-[16px]">PathEats</p>
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
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-[#f8fafc]"><Outlet /></main>
      </div>
    </div>
  );
}
