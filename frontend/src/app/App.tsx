import { lazy, Suspense, type ReactNode } from "react";
import NotFoundPage from "../shared/pages/NotFoundPage";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider, useAuth } from "../shared/hooks/useAuth";
import { ThemeProvider } from "../shared/hooks/useTheme";
import { ErrorBoundary } from "../shared/components/ErrorBoundary";
import { LoadingSpinner } from "../shared/components/LoadingSpinner";
import { loginPathForArea, authAreaFromPath } from "../shared/utils/authRedirect";
import { UserRoutes } from "../user/routes/userRoutes";
import { VendorRoutes } from "../vendor/routes/vendorRoutes";
import adminRoutes from "../admin/routes/adminRoutes";
import developerRoutes from "../admin/routes/developerRoutes";
import businessRoutes from "../admin/routes/businessRoutes";

const AdminLoginPage = lazy(() =>
  import("../admin/pages/AdminLoginPage").then((module) => ({ default: module.AdminLoginPage }))
);

const DeveloperLoginPage = lazy(() =>
  import("../admin/pages/DeveloperLoginPage").then((module) => ({ default: module.DeveloperLoginPage }))
);

const BusinessLoginPage = lazy(() =>
  import("../admin/pages/BusinessLoginPage").then((module) => ({ default: module.BusinessLoginPage }))
);

const ADMIN_ROLES = ["GLOBAL_ADMIN", "BUSINESS_ASSISTANCE", "DEVELOPER_ADMIN"];

function AdminGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  const loginPath = loginPathForArea(authAreaFromPath(location.pathname));

  if (!user) {
    return <Navigate to={loginPath} replace />;
  }

  if (!ADMIN_ROLES.includes(user.role_scope)) {
    return <Navigate to={loginPath} replace />;
  }

  return <>{children}</>;
}

function renderRouteTree(routeObj: { element: ReactNode; children?: any[] }) {
  if (!routeObj.children?.length) return null;
  return (
    <Route key={routeObj.path} path={`${routeObj.path}/*`} element={<AdminGuard>{routeObj.element}</AdminGuard>}>
      {routeObj.children.map((child: any, i: number) => (
        <Route key={i} index={child.index} path={child.path} element={child.element} />
      ))}
    </Route>
  );
}

function AppRoutes() {
  return (
    <ThemeProvider>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route index element={<Navigate to="/user" replace />} />
          {UserRoutes()}
          {VendorRoutes()}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/developer/login" element={<DeveloperLoginPage />} />
          <Route path="/business/login" element={<BusinessLoginPage />} />
          {renderRouteTree(adminRoutes)}
          {renderRouteTree(developerRoutes)}
          {renderRouteTree(businessRoutes)}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}

function RouteLoading() {
  return <LoadingSpinner fullScreen message="Loading..." />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
