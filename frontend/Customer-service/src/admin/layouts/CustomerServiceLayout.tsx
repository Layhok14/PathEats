import { Outlet, NavLink, useNavigate } from "react-router";
import imgLogo from "../../imports/Container/ef70e21ec0aaa2ffee26b321703893d006871c50.png";

const navItems = [
  {
    label: "Dashboard",
    path: "/customer-service",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Complaints",
    path: "/customer-service/complaints",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "User Information",
    path: "/customer-service/users",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor" />
      </svg>
    ),
  },
];

export default function CustomerServiceLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "#f8fafc" }}>
      {/* Sidebar — same green as admin */}
      <aside className="w-[260px] flex flex-col h-full shrink-0" style={{ background: "#004b1e" }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: "1px solid rgba(188,203,185,0.15)" }}>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={imgLogo}
              alt="PathEat logo"
              className="w-8 h-8 object-contain"
              style={{ transform: "scaleY(-1) rotate(180deg)" }}
            />
          </div>
          <div>
            <p className="text-white font-bold text-[18px] leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>PathEat Admin</p>
            <p className="text-[11px]" style={{ color: "#bec6e0", fontFamily: "Poppins, sans-serif" }}>Customer Service</p>
          </div>
        </div>

        {/* Nav label */}
        <div className="px-6 pt-5 pb-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(188,203,185,0.5)" }}>Menu</p>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-4 pb-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/customer-service"}
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

        {/* Generate Report button */}
        <div className="px-4 pb-3">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all hover:opacity-90" style={{ background: "#006e2f" }}>
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5z" /></svg>
            Generate Report
          </button>
        </div>

        {/* Bottom: Settings + Logout + User */}
        <div className="px-4 pb-4 flex flex-col gap-1" style={{ borderTop: "1px solid rgba(188,203,185,0.15)" }}>
          <div className="pt-3 flex flex-col gap-0.5">
            {[
              { label: "Settings", icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg> },
              { label: "Logout", icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg> },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => item.label === "Logout" && navigate("/")}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all text-[#bec6e0] hover:bg-white/10 hover:text-white w-full text-left"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* User */}
          <div className="flex items-center gap-3 px-3 py-3 mt-1" style={{ borderTop: "1px solid rgba(188,203,185,0.1)" }}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-[11px] font-bold shrink-0">SC</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[12px] font-medium truncate">System Controller</p>
              <p className="text-[11px] truncate" style={{ color: "#bec6e0" }}>admin@patheat.com</p>
            </div>
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
