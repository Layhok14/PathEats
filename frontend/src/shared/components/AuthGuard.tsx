import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

interface Props {
  children: React.ReactNode;
  requiredRole?: string;
}

const ADMIN_ROLES = ["GLOBAL_ADMIN", "DEVELOPER_ADMIN", "CUSTOMER_SERVICE_ADMIN"];

export function AuthGuard({ children, requiredRole }: Props) {
  const { user } = useAuth();
  const location = useLocation();

  const loginPath = requiredRole && ADMIN_ROLES.includes(requiredRole)
    ? "/admin/login"
    : "/vendor/login";

  if (!user) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredRole && user.role_scope !== requiredRole) {
    return <Navigate to={loginPath} replace />;
  }

  return <>{children}</>;
}
