import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import DeveloperLayout from "../layouts/DeveloperLayout";
import BackupRecoveryPage from "../pages/developer/BackupRecoveryPage";
import DeveloperUserManagementPage from "../pages/developer/DeveloperUserManagementPage";
import DeveloperVendorManagementPage from "../pages/developer/DeveloperVendorManagementPage";

const developerRoutes: RouteObject = {
  path: "/developer",
  element: <DeveloperLayout />,
  children: [
    { index: true, element: <Navigate to="/developer/users" replace /> },
    { path: "users", element: <DeveloperUserManagementPage /> },
    { path: "vendors", element: <DeveloperVendorManagementPage /> },
    { path: "backup", element: <BackupRecoveryPage /> },
  ],
};

export default developerRoutes;
