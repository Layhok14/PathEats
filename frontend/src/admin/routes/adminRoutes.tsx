import type { RouteObject } from "react-router";
import AdminMainLayout from "../layouts/AdminMainLayout";
import DashboardPage from "../pages/global/DashboardPage";
import UserManagementPage from "../pages/global/UserManagementPage";
import RestaurantManagementPage from "../pages/global/RestaurantManagementPage";
import AdminStallManagePage from "../pages/global/AdminStallManagePage";
import AdminAuditPage from "../pages/global/AdminAuditPage";
import AdminVendorDetailPage from "../pages/global/AdminVendorDetailPage";

const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminMainLayout />,
  children: [
    { index: true, element: <DashboardPage /> },
    { path: "users", element: <UserManagementPage /> },
    { path: "restaurants", element: <RestaurantManagementPage /> },
    { path: "restaurants/manage/:stallId", element: <AdminStallManagePage /> },
    { path: "restaurants/vendor/:vendorId", element: <AdminVendorDetailPage /> },
    { path: "audit", element: <AdminAuditPage /> },
  ],
};

export default adminRoutes;
