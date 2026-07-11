import type { RouteObject } from "react-router";
import DeveloperLayout from "../layouts/DeveloperLayout";
import DeveloperDashboard from "../pages/developer/DeveloperDashboard";
import BackupManagerPage from "../pages/developer/BackupManagerPage";
import DeveloperToolsPage from "../pages/developer/DeveloperToolsPage";
import DeveloperActivityPage from "../pages/developer/DeveloperActivityPage";
import DeveloperUserManagementPage from "../pages/developer/DeveloperUserManagementPage";
import DeveloperVendorManagementPage from "../pages/developer/DeveloperVendorManagementPage";
import DeveloperVendorDetailPage from "../pages/developer/DeveloperVendorDetailPage";
import DeveloperReviewsPage from "../pages/developer/DeveloperReviewsPage";
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
      path: "tools",
      element: (
        <AuthGuard requiredRole="DEVELOPER_ADMIN">
          <DeveloperToolsPage />
        </AuthGuard>
      ),
    },
    {
      path: "activity",
      element: (
        <AuthGuard requiredRole="DEVELOPER_ADMIN">
          <DeveloperActivityPage />
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
    {
      path: "reviews",
      element: (
        <AuthGuard requiredRole="DEVELOPER_ADMIN">
          <DeveloperReviewsPage />
        </AuthGuard>
      ),
    },
  ],
};

export default developerRoutes;
