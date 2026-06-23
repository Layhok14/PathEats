import { Route, Navigate } from "react-router";
import { AuthGuard } from "../../shared/components/AuthGuard";
import { VendorLayout } from "../layouts/VendorLayout";
import { VendorLoginPage } from "../pages/VendorLoginPage";
import { VendorRegisterPage } from "../pages/VendorRegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { StallListPage } from "../pages/StallListPage";
import { StallCreatePage } from "../pages/StallCreatePage";
import { StallDetailPage } from "../pages/StallDetailPage";
import { StallViewPage } from "../pages/StallViewPage";
import { LocationPinpointPage } from "../pages/LocationPinpointPage";
import { ReviewsPage } from "../pages/ReviewsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { SupportPage } from "../pages/SupportPage";
import { OnboardingPage } from "../pages/OnboardingPage";
import { MenuItemsPage } from "../pages/MenuItemsPage";

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
        <Route path="support" element={<AuthGuard requiredRole="VENDOR"><SupportPage /></AuthGuard>} />
        <Route path="settings" element={<AuthGuard requiredRole="VENDOR"><SettingsPage /></AuthGuard>} />
      </Route>
      <Route path="/vendor/*" element={<Navigate to="/vendor/stalls" replace />} />
    </>
  );
}
