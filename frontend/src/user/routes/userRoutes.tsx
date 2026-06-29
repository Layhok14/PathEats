// Consumer domain React Router sub-routes — Owner: Kong Leak Smey.

import { Route } from "react-router";
import UserMainLayout from "../layouts/UserMainLayout";
import UserLoginPage from "../pages/UserLoginPage";
import UserSearchPage from "../pages/UserSearchPage";
import UserVendorDetailPage from "../pages/UserVendorDetailPage";
import UserReviewsPage from "../pages/UserReviewsPage";

export function UserRoutes() {
  return (
    <>
      <Route path="/user/login" element={<UserLoginPage />} />
      <Route path="/user" element={<UserMainLayout />}>
        <Route index element={<UserSearchPage />} />
        <Route path="vendor/:id" element={<UserVendorDetailPage />} />
        <Route path="reviews" element={<UserReviewsPage />} />
      </Route>
    </>
  );
}
