// Consumer domain React Router sub-routes — Owner: Kong Leak Smey.

import { Route } from "react-router";
import { lazy } from "react";

const UserMainLayout = lazy(() => import("../layouts/UserMainLayout"));
const UserLoginPage = lazy(() => import("../pages/UserLoginPage"));
const UserSearchPage = lazy(() => import("../pages/UserSearchPage"));
const UserVendorDetailPage = lazy(() => import("../pages/UserVendorDetailPage"));
const UserReviewsPage = lazy(() => import("../pages/UserReviewsPage"));

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
