import { createBrowserRouter, RouterProvider } from "react-router";
import PortalHome from "./components/PortalHome";
import adminRoutes from "../admin/routes/adminRoutes";
import developerRoutes from "../admin/routes/developerRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PortalHome />,
  },
  adminRoutes,
  developerRoutes,
]);

export default function App() {
  return <RouterProvider router={router} />;
}
