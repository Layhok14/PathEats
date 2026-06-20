// Consumer domain React Router sub-routes — Owner: Kong Leak Smey.

import { Route } from "react-router";
import UserMainLayout from "../layouts/UserMainLayout";
import UserSearchPage from "../pages/UserSearchPage";
import UserVendorDetailPage from "../pages/UserVendorDetailPage";

export function UserRoutes() {
  return (
    <Route path="/user" element={<UserMainLayout />}>
      <Route index element={<UserSearchPage />} />
      <Route path="vendor/:id" element={<UserVendorDetailPage />} />
      {/* Future: /user/profile, /user/routes/saved */}
    </Route>
  );
}
