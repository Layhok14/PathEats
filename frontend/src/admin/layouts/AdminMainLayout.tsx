import { Outlet, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../shared/hooks/useAuth";

interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge: boolean;
  description: string;
  roles?: string[];
}

interface NavSection {
  title: string;
  subtitle: string;
  roles: string[];
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: "Admin",
    subtitle: "Platform administration & user management",
    roles: ["GLOBAL_ADMIN"],
    items: [
      { label: "Dashboard", path: "/admin", icon: "M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z", badge: false, description: "Platform overview & recent admin activity" },
      { label: "Admin Management", path: "/admin/manage", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z", badge: false, description: "Manage admin roles, permissions & settings" },
      { label: "Consumer Management", path: "/admin/users", icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z", badge: false, description: "Manage consumer accounts & profiles" },
    ],
  },
  {
    title: "Business Assistance",
    subtitle: "Vendor support & business tools",
    roles: ["GLOBAL_ADMIN", "BUSINESS_ASSISTANCE"],
    items: [
      { label: "Dashboard", path: "/admin/business", icon: "M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z", badge: false, description: "Business assistance overview & vendor activity" },
      { label: "Vendor Management", path: "/admin/vendors", icon: "M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-3.5-3.37-5.99-7.52-5.99S1 11.49 1 14.99v1h15.03v-1z", badge: false, description: "Manage all stalls, menu items, reviews & vendors" },
      { label: "Vendor Onboarding", path: "/admin/vendors/onboarding", icon: "M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.33-8 4v2h16v-2c0-2.67-5.33-4-8-4z", badge: false, description: "Onboard vendors via Telegram connection & scam prevention" },
      { label: "Review Moderation", path: "/admin/vendors/moderation", icon: "M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z", badge: false, description: "Flag or remove spam/inappropriate reviews, update stall ratings" },
    ],
  },
  {
    title: "Developer",
    subtitle: "System operations & technical tasks",
    roles: ["GLOBAL_ADMIN", "DEVELOPER_ADMIN"],
    items: [
      { label: "Developer Dashboard", path: "/admin/developer/dashboard", icon: "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z", badge: false, description: "System metrics, analytics & performance" },
      { label: "Backup & Recovery", path: "/admin/backups", icon: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z", badge: false, description: "Database backups, scheduling & restore operations" },
      { label: "Database Tools", path: "/admin/developer/tools", icon: "M12 2C8.13 2 5 4.69 5 8c0 1.64.81 3.09 2.08 4.1-.08.29-.08.6-.08.9 0 3.31 3.13 6 7 6s7-2.69 7-6c0-.3-.01-.61-.08-.9C18.19 11.09 19 9.64 19 8c0-3.31-3.13-6-7-6zm0 2c2.7 0 5 1.31 5 3s-2.3 3-5 3-5-1.31-5-3 2.3-3 5-3zm0 14c-2.7 0-5-1.31-5-3 0-.19.02-.37.05-.55.22.14.47.27.73.37l.12.06C8.49 16.28 10.21 17 12 17s3.51-.72 4.1-2.12l.12-.06c.26-.1.51-.23.73-.37.03.18.05.36.05.55 0 1.69-2.3 3-5 3zm0-4c-1.76 0-3.38-.51-4.61-1.31C8.55 11.95 10.18 12 12 12s3.45-.05 4.61-1.31C15.38 11.49 13.76 12 12 12z", badge: false, description: "SQL query runner, DB maintenance, and bug tracking" },
      { label: "Database Activity", path: "/admin/audit", roles: ["GLOBAL_ADMIN"], icon: "M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z", badge: false, description: "Real-time queries, locks & database sessions" },
    ],
  },
];

const navRequirements: Record<string, { table?: string; action?: string; capability?: string }> = {
  "/admin/manage": { table: "role", action: "SELECT" },
  "/admin/users": { table: "users", action: "SELECT" },
  "/admin/vendors": { table: "places", action: "SELECT" },
  "/admin/vendors/onboarding": { table: "onboarding_config", action: "SELECT" },
  "/admin/vendors/moderation": { table: "reviews", action: "SELECT" },
  "/admin/backups": { capability: "BACKUP" },
  "/admin/developer/tools": { capability: "QUERY" },
  "/admin/audit": { table: "audit_log", action: "SELECT" },
};

export default function AdminMainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userRole = user?.role_scope ?? "";
  const roleAllowed = (roles: string[]) => roles.includes(userRole);
  const permissionAllowed = (path: string) => {
    const requirement = navRequirements[path];
    if (!requirement) return true;
    if (requirement.capability) {
      return !user?.systemCapabilities || user.systemCapabilities.includes(requirement.capability);
    }
    const actions = requirement.table ? user?.tablePrivileges?.[requirement.table] : undefined;
    return !user?.tablePrivileges || Boolean(requirement.action && actions?.includes(requirement.action));
  };
  const visibleSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        roleAllowed(item.roles ?? section.roles) && permissionAllowed(item.path)
      ),
    }))
    .filter((section) => section.items.length > 0);

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email
    : "Dev Admin";
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
            <p className="text-[10px]" style={{ color: "#bec6e0" }}>Management</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-4 overflow-y-auto">
          {visibleSections.map((section) => (
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
                    end={item.path === "/admin" || item.path === "/admin/vendors" || item.path === "/admin/developer/vendors"}
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
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[11px] font-medium truncate">{displayName}</p>
              <p className="text-[10px] truncate" style={{ color: "#bec6e0" }}>{user?.role_scope ?? "Admin"}</p>
            </div>
            <button onClick={async () => { await logout(); navigate("/admin/login", { replace: true }); }} title="Sign out" className="shrink-0 transition-colors hover:text-white" style={{ color: "#bec6e0" }}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto relative"><div className="mx-auto max-w-7xl w-full"><Outlet /></div></main>
    </div>
  );
}
