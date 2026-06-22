import type { RouteObject } from "react-router";
import AdminMainLayout from "../layouts/AdminMainLayout";
import DashboardPage from "../pages/global/DashboardPage";
import UserManagementPage from "../pages/global/UserManagementPage";
import RestaurantManagementPage from "../pages/global/RestaurantManagementPage";
import AdminStallManagePage from "../pages/global/AdminStallManagePage";
import AdminStallDetailPage from "../pages/global/AdminStallDetailPage";
import AdminStallCreatePage from "../pages/global/AdminStallCreatePage";
import AdminStallEditPage from "../pages/global/AdminStallEditPage";
import AdminAuditPage from "../pages/global/AdminAuditPage";
import AdminVendorDetailPage from "../pages/global/AdminVendorDetailPage";

const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminMainLayout />,
  children: [
    { index: true, element: <DashboardPage /> },
    { path: "users", element: <UserManagementPage /> },
    { path: "restaurants", element: <RestaurantManagementPage /> },
    { path: "restaurants/stall/create", element: <AdminStallCreatePage /> },
    { path: "restaurants/stall/edit/:stallId", element: <AdminStallEditPage /> },
    { path: "restaurants/manage/:stallId", element: <AdminStallManagePage /> },
    { path: "restaurants/stall/:stallId", element: <AdminStallDetailPage /> },
    { path: "restaurants/vendor/:vendorId", element: <AdminVendorDetailPage /> },
    { path: "audit", element: <AdminAuditPage /> },
  ],
};

export default adminRoutes;
