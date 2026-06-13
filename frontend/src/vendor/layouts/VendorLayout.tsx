import { NavLink, Outlet, useNavigate } from "react-router";
import { LayoutDashboard, Store, UtensilsCrossed, HelpCircle, Settings, LogOut } from "lucide-react";
import imgLogo from "../../imports/LocationPinpointLight-1/ef70e21ec0aaa2ffee26b321703893d006871c50.png";
import imgAvatar from "../../imports/StallManagementLight-1/e7fc7f76e55e9a6f8866aa739ab828f80d5471b8.png";

const NAV = [
  { to: "/vendor", label: "Dashboard", icon: <LayoutDashboard size={18} color="white" />, end: true },
  { to: "/vendor/stalls", label: "Stall Management", icon: <Store size={18} color="white" /> },
  { to: "/vendor/menu", label: "Menu Items", icon: <UtensilsCrossed size={18} color="white" /> },
  { to: "/vendor/support", label: "Support/Onboarding", icon: <HelpCircle size={18} color="white" /> },
  { to: "/vendor/settings", label: "Settings", icon: <Settings size={18} color="white" /> },
];

export function VendorLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col w-[280px] shrink-0 h-full"
        style={{ background: "var(--brand-sidebar)", borderRight: "1px solid rgba(255,255,255,0.15)" }}
      >
        {/* Logo */}
        <div className="px-6 py-6 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={imgLogo}
                alt="PathEat"
                style={{ width: "32px", height: "40px", objectFit: "cover", transform: "rotate(180deg) scaleY(-1)" }}
              />
            </div>
            <div>
              <p style={{ color: "white", fontFamily: "Poppins, sans-serif", fontSize: "20px", fontWeight: 500, margin: 0 }}>PathEat</p>
              <p style={{ color: "#bec6e0", fontFamily: "Poppins, sans-serif", fontSize: "12px", letterSpacing: "0.24px", margin: 0 }}>Vendor Portal</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col overflow-y-auto">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: "16px",
                padding: isActive ? "12px 16px 12px 20px" : "12px 16px",
                background: isActive ? "var(--brand-sidebar-active-bg)" : "transparent",
                borderLeft: isActive ? "4px solid var(--brand-green)" : "4px solid transparent",
                color: "white", fontFamily: "Poppins, sans-serif", fontSize: "14px",
                fontWeight: 500, textDecoration: "none", transition: "background 0.15s",
              })}
            >
              <span className="shrink-0">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-6">
          <button
            onClick={() => navigate("/")}
            style={{
              display: "flex", alignItems: "center", gap: "16px",
              padding: "12px 0", color: "white",
              fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 500,
              background: "none", border: "none", cursor: "pointer", width: "100%",
            }}
          >
            <LogOut size={18} color="white" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className="shrink-0 h-16 flex items-center justify-end px-6"
          style={{ background: "var(--brand-header-bg)", borderBottom: "1px solid var(--brand-header-border)" }}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden" style={{ border: "1px solid var(--brand-header-border)" }}>
            <img src={imgAvatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" style={{ background: "var(--brand-header-bg)" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
