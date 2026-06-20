import type { RouteObject } from "react-router";
import AdminMainLayout from "../layouts/AdminMainLayout";
import DashboardPage from "../pages/global/DashboardPage";
import UserManagementPage from "../pages/global/UserManagementPage";
import RestaurantManagementPage from "../pages/global/RestaurantManagementPage";

const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminMainLayout />,
  children: [
    { index: true, element: <DashboardPage /> },
    { path: "users", element: <UserManagementPage /> },
    { path: "restaurants", element: <RestaurantManagementPage /> },
  ],
};

export default adminRoutes;
