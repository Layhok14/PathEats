import type { RouteObject } from "react-router";
import DeveloperLayout from "../layouts/DeveloperLayout";
import DeveloperDashboard from "../pages/developer/DeveloperDashboard";
import DatabaseManagementPage from "../pages/developer/DatabaseManagementPage";
import ErrorLogsPage from "../pages/developer/ErrorLogsPage";
import BackupRecoveryPage from "../pages/developer/BackupRecoveryPage";

const developerRoutes: RouteObject = {
  path: "/developer",
  element: <DeveloperLayout />,
  children: [
    { index: true, element: <DeveloperDashboard /> },
    { path: "database", element: <DatabaseManagementPage /> },
    { path: "error-logs", element: <ErrorLogsPage /> },
    { path: "backup", element: <BackupRecoveryPage /> },
  ],
};

export default developerRoutes;
