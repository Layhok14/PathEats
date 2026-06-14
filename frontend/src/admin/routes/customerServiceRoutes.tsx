import type { RouteObject } from "react-router";
import CustomerServiceLayout from "../layouts/CustomerServiceLayout";
import CustomerServiceDashboard from "../pages/customer-service/CustomerServiceDashboard";
import ComplaintsPage from "../pages/customer-service/ComplaintsPage";
import UserInformationPage from "../pages/customer-service/UserInformationPage";

const customerServiceRoutes: RouteObject = {
  path: "/customer-service",
  element: <CustomerServiceLayout />,
  children: [
    { index: true, element: <CustomerServiceDashboard /> },
    { path: "complaints", element: <ComplaintsPage /> },
    { path: "users", element: <UserInformationPage /> },
  ],
};

export default customerServiceRoutes;
