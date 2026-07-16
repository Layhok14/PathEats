import type { RouteObject } from "react-router";
import { lazy } from "react";
import { AuthGuard } from "../../shared/components/AuthGuard";

const BusinessLayout = lazy(() => import("../layouts/BusinessLayout"));
const BusinessDashboardPage = lazy(() => import("../pages/global/BusinessDashboardPage"));
const VendorListPage = lazy(() => import("../pages/global/VendorListPage"));
const VendorOnboardingPage = lazy(() => import("../pages/global/VendorOnboardingPage"));
const ReviewModerationPage = lazy(() => import("../pages/global/ReviewModerationPage"));
const AdminStallManagePage = lazy(() => import("../pages/global/AdminStallManagePage"));
const AdminStallDetailPage = lazy(() => import("../pages/global/AdminStallDetailPage"));
const StallCreatePage = lazy(() => import("../../shared/pages/StallCreatePage").then((module) => ({ default: module.StallCreatePage })));

const businessOrGlobal = (page: React.ReactNode) => (
  <AuthGuard requiredRole={["GLOBAL_ADMIN", "BUSINESS_ASSISTANCE"]}>{page}</AuthGuard>
);

const businessRoutes: RouteObject = {
  path: "/business",
  element: <BusinessLayout />,
  children: [
    { index: true, element: businessOrGlobal(<BusinessDashboardPage />) },
    { path: "vendors", element: businessOrGlobal(<VendorListPage />) },
    { path: "vendors/onboarding", element: businessOrGlobal(<VendorOnboardingPage />) },
    { path: "vendors/moderation", element: businessOrGlobal(<ReviewModerationPage />) },
    { path: "vendors/:vendorId", element: businessOrGlobal(<AdminStallManagePage />) },
    { path: "vendors/:vendorId/stall/:stallId", element: businessOrGlobal(<AdminStallDetailPage />) },
    { path: "stalls", element: businessOrGlobal(<AdminStallManagePage />) },
    { path: "stalls/new", element: businessOrGlobal(<StallCreatePage />) },
    { path: "stalls/stall/:stallId", element: businessOrGlobal(<AdminStallDetailPage />) },
  ],
};

export default businessRoutes;
