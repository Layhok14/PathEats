import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { loginPathForArea, authAreaFromPath } from "../utils/authRedirect";

interface Props {
  children: React.ReactNode;
  requiredRole?: string | string[];
  allowGuest?: boolean;
}

export function AuthGuard({ children, requiredRole, allowGuest }: Props) {
  const { user, isGuest } = useAuth();
  const location = useLocation();

  const requiredRoles = requiredRole
    ? Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    : [];

  const loginPath = loginPathForArea(authAreaFromPath(location.pathname));

  if (!user) {
    if (allowGuest && isGuest) {
      return <>{children}</>;
    }
    return <Navigate to={loginPath} replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role_scope)) {
    return <Navigate to={loginPath} replace />;
  }

  return <>{children}</>;
}
