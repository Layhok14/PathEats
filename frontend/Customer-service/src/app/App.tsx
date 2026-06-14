import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import adminRoutes from "../admin/routes/adminRoutes";
import customerServiceRoutes from "../admin/routes/customerServiceRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/admin" replace />,
  },
  adminRoutes,
  customerServiceRoutes,
]);

export default function App() {
  return <RouterProvider router={router} />;
}
