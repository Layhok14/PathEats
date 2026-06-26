import type { RouteObject } from "react-router";
import DeveloperLayout from "../layouts/DeveloperLayout";
import DeveloperDashboard from "../pages/developer/DeveloperDashboard";
import BackupManagerPage from "../pages/developer/BackupManagerPage";
import DeveloperUserManagementPage from "../pages/developer/DeveloperUserManagementPage";
import DeveloperVendorManagementPage from "../pages/developer/DeveloperVendorManagementPage";
import DeveloperVendorDetailPage from "../pages/developer/DeveloperVendorDetailPage";
import { AuthGuard } from "../../shared/components/AuthGuard";

const developerRoutes: RouteObject = {
  path: "/developer",
  element: <DeveloperLayout />,
  children: [
    {
      index: true,
      element: (
        <AuthGuard requiredRole="DEVELOPER_ADMIN">
          <DeveloperDashboard />
        </AuthGuard>
      ),
    },
    {
      path: "backup",
      element: (
        <AuthGuard requiredRole="DEVELOPER_ADMIN">
          <BackupManagerPage />
        </AuthGuard>
      ),
    },
    {
      path: "users",
      element: (
        <AuthGuard requiredRole="DEVELOPER_ADMIN">
          <DeveloperUserManagementPage />
        </AuthGuard>
      ),
    },
    {
      path: "vendors",
      element: (
        <AuthGuard requiredRole="DEVELOPER_ADMIN">
          <DeveloperVendorManagementPage />
        </AuthGuard>
      ),
    },
    {
      path: "vendors/:vendorId",
      element: (
        <AuthGuard requiredRole="DEVELOPER_ADMIN">
          <DeveloperVendorDetailPage />
        </AuthGuard>
      ),
    },
  ],
};

export default developerRoutes;
