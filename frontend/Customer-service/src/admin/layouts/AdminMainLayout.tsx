import { Outlet, NavLink, useNavigate } from "react-router";
import imgLogo from "../../imports/Container/ef70e21ec0aaa2ffee26b321703893d006871c50.png";

const navItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "User Management",
    path: "/admin/users",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Restaurant Management",
    path: "/admin/restaurants",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-3.5-3.37-5.99-7.52-5.99S1 11.49 1 14.99v1h15.03v-1z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Complaints",
    path: "/admin/complaints",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor" />
      </svg>
    ),
  },
];


export default function AdminMainLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "#f8fafc" }}>
      {/* Sidebar — matches Figma dark green #004b1e */}
      <aside className="w-[260px] flex flex-col h-full shrink-0" style={{ background: "#004b1e" }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: "1px solid rgba(188,203,185,0.15)" }}>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
            <img src={imgLogo} alt="PathEat logo" className="w-8 h-8 object-contain" style={{ transform: "scaleY(-1) rotate(180deg)" }} />
          </div>
          <div>
            <p className="text-white font-bold text-[18px] leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>PathEat</p>
            <p className="text-[11px]" style={{ color: "#bec6e0", fontFamily: "Poppins, sans-serif" }}>Management Portal</p>
          </div>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-4 py-5 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-[#bec6e0] hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 pb-2 flex flex-col gap-1" style={{ borderTop: "1px solid rgba(188,203,185,0.15)" }}>
          {/* User footer */}
          <div className="flex items-center gap-3 px-3 py-3" style={{ borderTop: "1px solid rgba(188,203,185,0.1)" }}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-[12px] font-bold shrink-0">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[12px] font-medium truncate">Alex Rivera</p>
              <p className="text-[11px] truncate" style={{ color: "#bec6e0" }}>Admin</p>
            </div>
            <button
              onClick={() => navigate("/")}
              title="Logout"
              className="shrink-0 transition-colors hover:text-white"
              style={{ color: "#bec6e0" }}
            >
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto relative">
        <Outlet />
      </main>
    </div>
  );
}
