import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { VendorLayout } from "../vendor/layouts/VendorLayout";
import { DashboardPage } from "../vendor/pages/DashboardPage";
import { StallListPage } from "../vendor/pages/StallListPage";
import { StallCreatePage } from "../vendor/pages/StallCreatePage";
import { StallDetailPage } from "../vendor/pages/StallDetailPage";
import { StallViewPage } from "../vendor/pages/StallViewPage";
import { LocationPinpointPage } from "../vendor/pages/LocationPinpointPage";
import { ReviewsPage } from "../vendor/pages/ReviewsPage";
import { SettingsPage } from "../vendor/pages/SettingsPage";
import { SupportPage } from "../vendor/pages/SupportPage";
import { MenuItemsPage } from "../vendor/pages/MenuItemsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/vendor" replace />} />

        <Route path="/vendor" element={<VendorLayout />}>
          <Route index element={<DashboardPage />} />

          {/* Stall management */}
          <Route path="stalls" element={<StallListPage />} />
          <Route path="stalls/new" element={<StallCreatePage />} />
          <Route path="stalls/:id" element={<StallDetailPage />} />
          <Route path="stalls/:id/view" element={<StallViewPage />} />
          <Route path="stalls/:id/location" element={<LocationPinpointPage />} />

          {/* Other sections */}
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="menu" element={<MenuItemsPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/vendor" replace />} />
      </Routes>

      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}
