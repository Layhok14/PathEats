import AdminLoginForm from "../../shared/components/AdminLoginForm";

const ROLE_REDIRECTS: Record<string, string> = {
  GLOBAL_ADMIN: "/admin",
  DEVELOPER_ADMIN: "/admin/developer/dashboard",
  BUSINESS_ASSISTANCE: "/admin/business",
};

export function AdminLoginPage() {
  return (
    <AdminLoginForm
      title="Admin Portal"
      subtitle="Sign in with your admin credentials"
      redirectMap={ROLE_REDIRECTS}
      defaultRedirect="/admin"
      expectedRoles="GLOBAL_ADMIN"
    />
  );
}
