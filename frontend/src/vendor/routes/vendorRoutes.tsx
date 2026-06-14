import { Route } from "react-router";
import { VendorLayout } from "../layouts/VendorLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { StallListPage } from "../pages/StallListPage";
import { StallCreatePage } from "../pages/StallCreatePage";
import { StallDetailPage } from "../pages/StallDetailPage";
import { StallViewPage } from "../pages/StallViewPage";
import { LocationPinpointPage } from "../pages/LocationPinpointPage";
import { ReviewsPage } from "../pages/ReviewsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { SupportPage } from "../pages/SupportPage";
import { MenuItemsPage } from "../pages/MenuItemsPage";

export function VendorRoutes() {
  return (
    <Route path="/vendor" element={<VendorLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="stalls" element={<StallListPage />} />
      <Route path="stalls/new" element={<StallCreatePage />} />
      <Route path="stalls/:id" element={<StallDetailPage />} />
      <Route path="stalls/:id/view" element={<StallViewPage />} />
      <Route path="stalls/:id/location" element={<LocationPinpointPage />} />
      <Route path="menu" element={<MenuItemsPage />} />
      <Route path="reviews" element={<ReviewsPage />} />
      <Route path="support" element={<SupportPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
  );
}
