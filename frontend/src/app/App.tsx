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

const AdminLoginPage = lazy(() =>
  import("../admin/pages/AdminLoginPage").then((module) => ({ default: module.AdminLoginPage }))
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

const DEVELOPER_REDIRECTS: Record<string, string> = {
  "/developer": "/admin/developer/dashboard",
  "/developer/backup": "/admin/backups",
  "/developer/users": "/admin/developer/users",
  "/developer/vendors": "/admin/developer/vendors",
  "/developer/reviews": "/admin/developer/reviews",
};

function AppRoutes() {
  return (
    <ThemeProvider>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route index element={<Navigate to="/user" replace />} />
          {UserRoutes()}
          {VendorRoutes()}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/*" element={<AdminGuard>{adminRoutes.element}</AdminGuard>}>
            {adminRoutes.children?.map((child, i) => (
              <Route key={i} index={child.index} path={child.path} element={child.element} />
            ))}
          </Route>
          {Object.entries(DEVELOPER_REDIRECTS).map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}
          <Route path="/developer/*" element={<Navigate to="/admin/developer/dashboard" replace />} />
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
