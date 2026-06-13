import { Outlet, NavLink, useNavigate } from "react-router";
import imgLogo from "../../imports/Container/ef70e21ec0aaa2ffee26b321703893d006871c50.png";

const navItems = [
  {
    label: "Dashboard",
    path: "/developer",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Database Management",
    path: "/developer/database",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zm6 12c0 .5-2.13 2-6 2s-6-1.5-6-2v-2.23C7.61 15.58 9.72 16 12 16s4.39-.42 6-1.23V17zm0-5c0 .5-2.13 2-6 2s-6-1.5-6-2V9.77C7.61 10.58 9.72 11 12 11s4.39-.42 6-1.23V12z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Error Logs",
    path: "/developer/error-logs",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Backup & Recovery",
    path: "/developer/backup",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" fill="currentColor" />
      </svg>
    ),
  },
];

const bottomItems = [
  {
    label: "Documentation",
    path: "/developer/docs",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Settings",
    path: "/developer/settings",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor" />
      </svg>
    ),
  },
];

export default function DeveloperLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "#f8fafc" }}>
      <aside className="w-[260px] flex flex-col h-full shrink-0" style={{ background: "#004b1e" }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: "1px solid rgba(188,203,185,0.15)" }}>
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
            <img src={imgLogo} alt="PathEat logo" className="w-7 h-7 object-contain" style={{ transform: "scaleY(-1) rotate(180deg)" }} />
          </div>
          <div>
            <p className="text-white font-bold text-[15px] leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>PathEat Admin</p>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: "#bec6e0", fontFamily: "Poppins, sans-serif" }}>Developer Portal</p>
          </div>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/developer"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  isActive
                    ? "bg-[#006e2f] text-white"
                    : "text-[#bec6e0] hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom nav + user */}
        <div className="px-3 pb-3 flex flex-col gap-0.5" style={{ borderTop: "1px solid rgba(188,203,185,0.15)" }}>
          <div className="pt-3 pb-2 flex flex-col gap-0.5">
            {bottomItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                    isActive
                      ? "bg-[#006e2f] text-white"
                      : "text-[#bec6e0] hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 mt-1" style={{ borderTop: "1px solid rgba(188,203,185,0.1)" }}>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[11px] font-bold shrink-0">AU</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[11px] font-medium truncate">Admin User</p>
              <p className="text-[10px] truncate" style={{ color: "#bec6e0" }}>Superuser</p>
            </div>
            <button onClick={() => navigate("/")} title="Logout" className="shrink-0 transition-colors hover:text-white" style={{ color: "#bec6e0" }}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto relative">
        <Outlet />
      </main>
    </div>
  );
}
