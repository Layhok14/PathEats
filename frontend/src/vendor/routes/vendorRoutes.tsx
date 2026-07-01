import { Route, Navigate } from "react-router";
import { lazy } from "react";
import { AuthGuard } from "../../shared/components/AuthGuard";

const VendorLayout = lazy(() =>
  import("../layouts/VendorLayout").then((module) => ({ default: module.VendorLayout }))
);
const VendorLoginPage = lazy(() =>
  import("../pages/VendorLoginPage").then((module) => ({ default: module.VendorLoginPage }))
);
const VendorRegisterPage = lazy(() =>
  import("../pages/VendorRegisterPage").then((module) => ({ default: module.VendorRegisterPage }))
);
const DashboardPage = lazy(() =>
  import("../pages/DashboardPage").then((module) => ({ default: module.DashboardPage }))
);
const StallListPage = lazy(() =>
  import("../pages/StallListPage").then((module) => ({ default: module.StallListPage }))
);
const StallCreatePage = lazy(() =>
  import("../pages/StallCreatePage").then((module) => ({ default: module.StallCreatePage }))
);
const StallDetailPage = lazy(() =>
  import("../pages/StallDetailPage").then((module) => ({ default: module.StallDetailPage }))
);
const StallViewPage = lazy(() =>
  import("../pages/StallViewPage").then((module) => ({ default: module.StallViewPage }))
);
const LocationPinpointPage = lazy(() =>
  import("../pages/LocationPinpointPage").then((module) => ({ default: module.LocationPinpointPage }))
);
const MenuItemsPage = lazy(() =>
  import("../pages/MenuItemsPage").then((module) => ({ default: module.MenuItemsPage }))
);
const ReviewsPage = lazy(() =>
  import("../pages/ReviewsPage").then((module) => ({ default: module.ReviewsPage }))
);
const OnboardingPage = lazy(() =>
  import("../pages/OnboardingPage").then((module) => ({ default: module.OnboardingPage }))
);
const SettingsPage = lazy(() =>
  import("../pages/SettingsPage").then((module) => ({ default: module.SettingsPage }))
);

export function VendorRoutes() {
  return (
    <>
      <Route path="/vendor/login" element={<VendorLoginPage />} />
      <Route path="/vendor/register" element={<VendorRegisterPage />} />
      <Route path="/vendor" element={<VendorLayout />}>
        <Route index element={<AuthGuard requiredRole="VENDOR"><DashboardPage /></AuthGuard>} />
        <Route path="stalls" element={<AuthGuard requiredRole="VENDOR"><StallListPage /></AuthGuard>} />
        <Route path="stalls/new" element={<AuthGuard requiredRole="VENDOR"><StallCreatePage /></AuthGuard>} />
        <Route path="stalls/:id" element={<AuthGuard requiredRole="VENDOR"><StallDetailPage /></AuthGuard>} />
        <Route path="stalls/:id/view" element={<AuthGuard requiredRole="VENDOR"><StallViewPage /></AuthGuard>} />
        <Route path="stalls/location-pinpoint" element={<AuthGuard requiredRole="VENDOR"><LocationPinpointPage /></AuthGuard>} />
        <Route path="stalls/:id/location" element={<AuthGuard requiredRole="VENDOR"><LocationPinpointPage /></AuthGuard>} />
        <Route path="menu" element={<AuthGuard requiredRole="VENDOR"><MenuItemsPage /></AuthGuard>} />
        <Route path="reviews" element={<AuthGuard requiredRole="VENDOR"><ReviewsPage /></AuthGuard>} />
        <Route path="onboarding" element={<AuthGuard requiredRole="VENDOR"><OnboardingPage /></AuthGuard>} />
        <Route path="settings" element={<AuthGuard requiredRole="VENDOR"><SettingsPage /></AuthGuard>} />
      </Route>
      <Route path="/vendor/*" element={<Navigate to="/vendor/stalls" replace />} />
    </>
  );
}
