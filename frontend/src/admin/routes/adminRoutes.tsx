import { Navigate } from "react-router";
import type { RouteObject } from "react-router";
import { lazy, type ReactNode } from "react";
import { AuthGuard } from "../../shared/components/AuthGuard";
import { useAuth } from "../../shared/hooks/useAuth";

const AdminMainLayout = lazy(() => import("../layouts/AdminMainLayout"));
const AdminDashboardPage = lazy(() => import("../pages/global/AdminDashboardPage"));
const AdminManagementPage = lazy(() => import("../pages/global/AdminManagementPage"));
const ConsumerManagementPage = lazy(() => import("../pages/global/ConsumerManagementPage"));
const VendorListPage = lazy(() => import("../pages/global/VendorListPage"));
const AdminStallManagePage = lazy(() => import("../pages/global/AdminStallManagePage"));
const AdminStallDetailPage = lazy(() => import("../pages/global/AdminStallDetailPage"));
const StallCreatePage = lazy(() => import("../../vendor/pages/StallCreatePage").then((module) => ({ default: module.StallCreatePage })));
const BusinessDashboardPage = lazy(() => import("../pages/global/BusinessDashboardPage"));
const VendorOnboardingPage = lazy(() => import("../pages/global/VendorOnboardingPage"));
const ReviewModerationPage = lazy(() => import("../pages/global/ReviewModerationPage"));
const AdminAuditPage = lazy(() => import("../pages/global/AdminAuditPage"));
const DeveloperDashboard = lazy(() => import("../pages/developer/DeveloperDashboard"));
const BackupManagerPage = lazy(() => import("../pages/developer/BackupManagerPage"));
const DeveloperToolsPage = lazy(() => import("../pages/developer/DeveloperToolsPage"));


const ADMIN_ROLES = ["GLOBAL_ADMIN", "DEVELOPER_ADMIN", "BUSINESS_ASSISTANCE"];

function AdminHomeRoute() {
  const { user } = useAuth();

  if (user?.role_scope === "BUSINESS_ASSISTANCE") {
    return <Navigate to="/admin/business" replace />;
  }

  if (user?.role_scope === "DEVELOPER_ADMIN") {
    return <Navigate to="/admin/developer/dashboard" replace />;
  }

  return <AdminDashboardPage />;
}

const globalAdmin = (page: ReactNode) => (
  <AuthGuard requiredRole="GLOBAL_ADMIN">{page}</AuthGuard>
);

const devOrGlobal = (page: ReactNode) => (
  <AuthGuard requiredRole={["GLOBAL_ADMIN", "DEVELOPER_ADMIN"]}>{page}</AuthGuard>
);

const developerAdmin = (page: ReactNode) => (
  <AuthGuard requiredRole="DEVELOPER_ADMIN">{page}</AuthGuard>
);

const businessOrGlobal = (page: ReactNode) => (
  <AuthGuard requiredRole={["GLOBAL_ADMIN", "BUSINESS_ASSISTANCE"]}>{page}</AuthGuard>
);

const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminMainLayout />,
  children: [
    { index: true, element: <AuthGuard requiredRole={ADMIN_ROLES}><AdminHomeRoute /></AuthGuard> },
    { path: "manage", element: globalAdmin(<AdminManagementPage />) },
    { path: "users", element: globalAdmin(<ConsumerManagementPage />) },
    { path: "business", element: businessOrGlobal(<BusinessDashboardPage />) },
    { path: "stalls", element: businessOrGlobal(<AdminStallManagePage />) },
    { path: "stalls/new", element: businessOrGlobal(<StallCreatePage />) },
    { path: "stalls/stall/:stallId", element: businessOrGlobal(<AdminStallDetailPage />) },
    { path: "vendors", element: businessOrGlobal(<VendorListPage />) },
    { path: "vendors/onboarding", element: businessOrGlobal(<VendorOnboardingPage />) },
    { path: "vendors/moderation", element: businessOrGlobal(<ReviewModerationPage />) },
    { path: "vendors/:vendorId", element: businessOrGlobal(<AdminStallManagePage />) },
    { path: "vendors/:vendorId/stall/:stallId", element: businessOrGlobal(<AdminStallDetailPage />) },
    { path: "backups", element: devOrGlobal(<BackupManagerPage />) },
    { path: "developer/dashboard", element: devOrGlobal(<DeveloperDashboard />) },
    { path: "developer/users", element: devOrGlobal(<Navigate to="/admin/users" replace />) },
    { path: "developer/vendors", element: devOrGlobal(<Navigate to="/admin/vendors" replace />) },
    { path: "developer/vendors/:vendorId", element: devOrGlobal(<Navigate to="/admin/vendors" replace />) },
    { path: "developer/tools", element: devOrGlobal(<DeveloperToolsPage />) },
    { path: "audit", element: globalAdmin(<AdminAuditPage />) },
  ],
};

export default adminRoutes;
