import AdminSidebar from "../../shared/components/AdminSidebar";
import type { NavSection } from "../../shared/components/AdminSidebar";

const sections: NavSection[] = [
  {
    title: "Developer",
    subtitle: "System operations & technical tasks",
    items: [
      { label: "Developer Dashboard", path: "/developer", icon: "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z", badge: false, description: "System metrics, analytics & performance" },
      { label: "Backup & Recovery", path: "/developer/backup", icon: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z", badge: false, description: "Database backups, scheduling & restore operations" },
      { label: "Database Tools", path: "/developer/tools", icon: "M12 2C8.13 2 5 4.69 5 8c0 1.64.81 3.09 2.08 4.1-.08.29-.08.6-.08.9 0 3.31 3.13 6 7 6s7-2.69 7-6c0-.3-.01-.61-.08-.9C18.19 11.09 19 9.64 19 8c0-3.31-3.13-6-7-6zm0 2c2.7 0 5 1.31 5 3s-2.3 3-5 3-5-1.31-5-3 2.3-3 5-3zm0 14c-2.7 0-5-1.31-5-3 0-.19.02-.37.05-.55.22.14.47.27.73.37l.12.06C8.49 16.28 10.21 17 12 17s3.51-.72 4.1-2.12l.12-.06c.26-.1.51-.23.73-.37.03.18.05.36.05.55 0 1.69-2.3 3-5 3zm0-4c-1.76 0-3.38-.51-4.61-1.31C8.55 11.95 10.18 12 12 12s3.45-.05 4.61-1.31C15.38 11.49 13.76 12 12 12z", badge: false, description: "SQL query runner, DB maintenance, and bug tracking" },
      { label: "Database Activity", path: "/developer/activity", icon: "M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z", badge: false, description: "Audit logs, query history, and login events" },
    ],
  },
];

export default function DeveloperLayout() {
  return <AdminSidebar sections={sections} portalSubtitle="Developer Portal" logoutRedirect="/developer/login" />;
}
