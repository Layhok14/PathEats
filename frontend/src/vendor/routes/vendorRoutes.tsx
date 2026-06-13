import { Route } from "react-router";
import { VendorLayout } from "../layouts/VendorLayout";
import { StallListPage } from "../pages/StallListPage";
import { StallCreatePage } from "../pages/StallCreatePage";
import { StallDetailPage } from "../pages/StallDetailPage";

// Vendor sub-routes — imported and rendered inside App.jsx's root <Routes>
export function VendorRoutes() {
  return (
    <Route path="/vendor" element={<VendorLayout />}>
      <Route index element={<StallListPage />} />
      <Route path="stalls" element={<StallListPage />} />
      <Route path="stalls/new" element={<StallCreatePage />} />
      <Route path="stalls/:id" element={<StallDetailPage />} />
    </Route>
  );
}
