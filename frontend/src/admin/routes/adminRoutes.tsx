import type { RouteObject } from "react-router";
import AdminMainLayout from "../layouts/AdminMainLayout";
import AdminManagementPage from "../pages/global/AdminManagementPage";
import UserManagementPage from "../pages/global/UserManagementPage";
import AdminMessagesPage from "../pages/global/AdminMessagesPage";
import AdminStallManagePage from "../pages/global/AdminStallManagePage";
import AdminStallDetailPage from "../pages/global/AdminStallDetailPage";
import AdminActivityDashboard from "../pages/global/AdminActivityDashboard";
import AdminBackupsPage from "../pages/global/AdminBackupsPage";
import AdminRecoveryPage from "../pages/global/AdminRecoveryPage";
import AdminAuditPage from "../pages/global/AdminAuditPage";

const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminMainLayout />,
  children: [
    { index: true, element: <AdminManagementPage /> },
    { path: "users", element: <UserManagementPage /> },
    { path: "messages", element: <AdminMessagesPage /> },
    { path: "restaurants", element: <AdminStallManagePage /> },
    { path: "restaurants/stall/:stallId", element: <AdminStallDetailPage /> },
    { path: "dashboard", element: <AdminActivityDashboard /> },
    { path: "backups", element: <AdminBackupsPage /> },
    { path: "recovery", element: <AdminRecoveryPage /> },
    { path: "audit", element: <AdminAuditPage /> },
  ],
};

export default adminRoutes;