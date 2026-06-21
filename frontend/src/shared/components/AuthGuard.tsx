import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

interface Props {
  children: React.ReactNode;
  requiredRole?: string;
}

export function AuthGuard({ children, requiredRole }: Props) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/vendor/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role_scope !== requiredRole) {
    return <Navigate to="/vendor/login" replace />;
  }

  return <>{children}</>;
}
