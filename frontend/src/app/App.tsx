import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "../shared/hooks/useAuth";
import { ThemeProvider } from "../shared/hooks/useTheme";
import { UserRoutes } from "../user/routes/userRoutes";
import { VendorRoutes } from "../vendor/routes/vendorRoutes";
import adminRoutes from "../admin/routes/adminRoutes";
// import customerServiceRoutes from "../admin/routes/customerServiceRoutes";
import developerRoutes from "../admin/routes/developerRoutes";
import { AdminLoginPage } from "../admin/pages/AdminLoginPage";

function AppRoutes() {
  return (
    <ThemeProvider>
      <Routes>
        <Route index element={<Navigate to="/user/login" replace />} />
        {UserRoutes()}
        {VendorRoutes()}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/*" element={adminRoutes.element}>
          {adminRoutes.children?.map((child, i) => (
            <Route key={i} index={child.index} path={child.path} element={child.element} />
          ))}
        </Route>
        {/* Customer service routes disabled */}
        <Route path="/developer/*" element={developerRoutes.element}>
          {developerRoutes.children?.map((child, i) => (
            <Route key={i} index={child.index} path={child.path} element={child.element} />
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/user/login" replace />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
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
