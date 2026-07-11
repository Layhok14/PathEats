import { Outlet, NavLink, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge: boolean;
  description: string;
}

export interface NavSection {
  title: string;
  subtitle: string;
  items: NavItem[];
}

interface Props {
  sections: NavSection[];
  portalSubtitle: string;
  logoutRedirect?: string;
}

export default function AdminSidebar({ sections, portalSubtitle, logoutRedirect = "/admin/login" }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email
    : "Admin";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "#f8fafc" }}>
      <aside className="w-[240px] flex flex-col h-full shrink-0" style={{ background: "#004b1e" }}>
        <div className="flex items-center gap-2 px-4 py-4" style={{ borderBottom: "1px solid rgba(188,203,185,0.15)" }}>
          <img src="/logo-to-use.png" alt="PathEats" className="w-8 h-8 rounded-full object-cover shrink-0" />
          <div>
            <p className="text-white font-bold text-[16px] leading-tight">PathEats</p>
            <p className="text-[10px]" style={{ color: "#bec6e0" }}>{portalSubtitle}</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-4 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="px-3 mb-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(188,203,185,0.6)" }}>
                  {section.title}
                </p>
                <p className="text-[9px]" style={{ color: "rgba(188,203,185,0.35)" }}>
                  {section.subtitle}
                </p>
              </div>
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === section.items[0]?.path}
                    title={item.description}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${isActive ? "bg-white/15 text-white" : "text-[#bec6e0] hover:bg-white/10 hover:text-white"}`
                    }
                  >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="shrink-0">
                      <path d={item.icon} />
                    </svg>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        0
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="px-3 pb-3" style={{ borderTop: "1px solid rgba(188,203,185,0.15)" }}>
          <div className="flex items-center gap-2 px-3 py-2 mt-1">
            <button onClick={() => navigate(logoutRedirect.replace("/login", "/profile"))} className="flex items-center gap-2 flex-1 min-w-0 text-left hover:bg-white/10 rounded-lg p-1 -m-1 transition-colors">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[11px] font-medium truncate">{displayName}</p>
                <p className="text-[10px] truncate" style={{ color: "#bec6e0" }}>{user?.role_scope ?? "Admin"}</p>
              </div>
            </button>
            <button onClick={async () => { await logout(); navigate(logoutRedirect, { replace: true }); }} title="Sign out" className="shrink-0 transition-colors hover:text-white" style={{ color: "#bec6e0" }}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto relative"><div className="mx-auto max-w-7xl w-full"><Outlet /></div></main>
    </div>
  );
}
