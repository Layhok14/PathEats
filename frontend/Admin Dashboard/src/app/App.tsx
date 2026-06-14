import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import adminRoutes from "../admin/routes/adminRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/admin" replace />,
  },
  adminRoutes,
]);

export default function App() {
  return <RouterProvider router={router} />;
}
