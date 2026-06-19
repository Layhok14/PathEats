import { Outlet, NavLink, useNavigate } from "react-router";

const navItems = [
  { label: "Dashboard", path: "/developer", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
  { label: "User Management", path: "/developer/users", icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" },
  { label: "Vendor Management", path: "/developer/vendors", icon: "M4 6V4h16v2h-1v4c0 1.1-.9 2-2 2-.75 0-1.4-.41-1.73-1-.35.59-.98 1-1.72 1-.75 0-1.39-.41-1.73-1-.35.59-.98 1-1.72 1s-1.38-.41-1.72-1c-.35.59-.99 1-1.73 1-1.1 0-2-.9-2-2V6H4zm1 8h14v6H5v-6zm3 2v2h8v-2H8z" },
  { label: "Database Management", path: "/developer/database", icon: "M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zm6 12c0 .5-2.13 2-6 2s-6-1.5-6-2v-2.23C7.61 15.58 9.72 16 12 16s4.39-.42 6-1.23V17zm0-5c0 .5-2.13 2-6 2s-6-1.5-6-2V9.77C7.61 10.58 9.72 11 12 11s4.39-.42 6-1.23V12z" },
  { label: "Error Logs", path: "/developer/error-logs", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" },
  { label: "Backup & Recovery", path: "/developer/backup", icon: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" },
];

export default function DeveloperLayout() {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "#f8fafc" }}>
      <aside className="w-[210px] flex flex-col h-full shrink-0" style={{ background: "#004b1e" }}>
        <div className="flex items-center gap-2 px-4 py-4" style={{ borderBottom: "1px solid rgba(188,203,185,0.15)" }}>
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#004b1e"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <div><p className="text-white font-bold text-[15px] leading-tight">PathEat</p><p className="text-[10px] uppercase tracking-widest" style={{ color: "#bec6e0" }}>Developer Portal</p></div>
        </div>
        <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === "/developer"}
              className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${isActive ? "bg-[#006e2f] text-white" : "text-[#bec6e0] hover:bg-white/10 hover:text-white"}`}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d={item.icon} /></svg>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 pb-3" style={{ borderTop: "1px solid rgba(188,203,185,0.15)" }}>
          <div className="flex items-center gap-2 px-3 py-2.5 mt-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[11px] font-bold shrink-0">AU</div>
            <div className="flex-1 min-w-0"><p className="text-white text-[11px] font-medium truncate">Developer User</p><p className="text-[10px] truncate" style={{ color: "#bec6e0" }}>Developer Admin</p></div>
            <button onClick={() => navigate("/")} title="Logout" className="shrink-0 transition-colors hover:text-white" style={{ color: "#bec6e0" }}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto relative"><Outlet /></main>
    </div>
  );
}
