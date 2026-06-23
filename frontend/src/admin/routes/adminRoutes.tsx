import type { RouteObject } from "react-router";
import AdminMainLayout from "../layouts/AdminMainLayout";
import AdminManagementPage from "../pages/global/AdminManagementPage";
import ConsumerManagementPage from "../pages/global/ConsumerManagementPage";
import VendorListPage from "../pages/global/VendorListPage";
import AdminStallManagePage from "../pages/global/AdminStallManagePage";
import AdminStallDetailPage from "../pages/global/AdminStallDetailPage";
import BusinessDashboardPage from "../pages/global/BusinessDashboardPage";
import VendorOnboardingPage from "../pages/global/VendorOnboardingPage";
import ReviewModerationPage from "../pages/global/ReviewModerationPage";
import AdminAuditPage from "../pages/global/AdminAuditPage";
import AdminActivityDashboard from "../pages/global/AdminActivityDashboard";
// Developer pages
import DeveloperDashboard from "../pages/developer/DeveloperDashboard";
import BackupPage from "../pages/developer/BackupPage";
import RecoveryPage from "../pages/developer/RecoveryPage";
import DeveloperToolsPage from "../pages/developer/DeveloperToolsPage";

const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminMainLayout />,
  children: [
    { index: true, element: <AdminManagementPage /> },
    { path: "users", element: <ConsumerManagementPage /> },
    { path: "business", element: <BusinessDashboardPage /> },
    { path: "vendors", element: <VendorListPage /> },
    { path: "vendors/onboarding", element: <VendorOnboardingPage /> },
    { path: "vendors/moderation", element: <ReviewModerationPage /> },
    { path: "vendors/:vendorId", element: <AdminStallManagePage /> },
    { path: "vendors/:vendorId/stall/:stallId", element: <AdminStallDetailPage /> },
    { path: "dashboard", element: <AdminActivityDashboard /> },
    { path: "backups", element: <BackupPage /> },
    { path: "recovery", element: <RecoveryPage /> },
    { path: "developer/dashboard", element: <DeveloperDashboard /> },
    { path: "developer/tools", element: <DeveloperToolsPage /> },
    { path: "audit", element: <AdminAuditPage /> },
  ],
};

export default adminRoutes;