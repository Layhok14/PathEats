import { Outlet, NavLink, useNavigate } from "react-router";

const navItems = [
  { label: "Dashboard", path: "/customer-service", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
  { label: "Complaints", path: "/customer-service/complaints", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" },
  { label: "User Information", path: "/customer-service/users", icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" },
];

export default function CustomerServiceLayout() {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "#f8fafc" }}>
      <aside className="w-[260px] flex flex-col h-full shrink-0" style={{ background: "#004b1e" }}>
        <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: "1px solid rgba(188,203,185,0.15)" }}>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#004b1e"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <div><p className="text-white font-bold text-[18px] leading-tight">PathEat Admin</p><p className="text-[11px]" style={{ color: "#bec6e0" }}>Customer Service</p></div>
        </div>
        <div className="px-6 pt-5 pb-1"><p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(188,203,185,0.5)" }}>Menu</p></div>
        <nav className="flex-1 px-4 pb-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === "/customer-service"}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${isActive ? "bg-white/15 text-white" : "text-[#bec6e0] hover:bg-white/10 hover:text-white"}`}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d={item.icon} /></svg>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 pb-4" style={{ borderTop: "1px solid rgba(188,203,185,0.15)" }}>
          <div className="pt-3 flex flex-col gap-0.5">
            <button onClick={() => navigate("/")} className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-[#bec6e0] hover:bg-white/10 hover:text-white w-full text-left">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
              Logout
            </button>
          </div>
          <div className="flex items-center gap-3 px-3 py-3 mt-1" style={{ borderTop: "1px solid rgba(188,203,185,0.1)" }}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-[11px] font-bold shrink-0">SC</div>
            <div className="flex-1 min-w-0"><p className="text-white text-[12px] font-medium truncate">System Controller</p><p className="text-[11px] truncate" style={{ color: "#bec6e0" }}>admin@patheat.com</p></div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto relative"><Outlet /></main>
    </div>
  );
}
