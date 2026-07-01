import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider, useAuth } from "../shared/hooks/useAuth";
import { ThemeProvider } from "../shared/hooks/useTheme";
import { loginPathForArea, authAreaFromPath } from "../shared/utils/authRedirect";
import { UserRoutes } from "../user/routes/userRoutes";
import { VendorRoutes } from "../vendor/routes/vendorRoutes";
import adminRoutes from "../admin/routes/adminRoutes";
// import customerServiceRoutes from "../admin/routes/customerServiceRoutes";

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
          {/* Customer service routes disabled */}
          <Route path="/developer" element={<Navigate to="/admin/developer/dashboard" replace />} />
          <Route path="/developer/backup" element={<Navigate to="/admin/backups" replace />} />
          <Route path="/developer/users" element={<Navigate to="/admin/developer/users" replace />} />
          <Route path="/developer/vendors" element={<Navigate to="/admin/developer/vendors" replace />} />
          <Route path="/developer/vendors/:vendorId" element={<Navigate to="/admin/developer/vendors" replace />} />
          <Route path="/developer/reviews" element={<Navigate to="/admin/developer/reviews" replace />} />
          <Route path="/developer/*" element={<Navigate to="/admin/developer/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/user" replace />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}

function RouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-[13px] font-medium text-[#64748b]">
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
