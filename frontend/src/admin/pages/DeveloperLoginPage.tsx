import AdminLoginForm from "../../shared/components/AdminLoginForm";

const ROLE_REDIRECTS: Record<string, string> = {
  GLOBAL_ADMIN: "/developer",
  DEVELOPER_ADMIN: "/developer",
};

export function DeveloperLoginPage() {
  return (
    <AdminLoginForm
      title="Developer Portal"
      subtitle="Sign in with your developer credentials"
      redirectMap={ROLE_REDIRECTS}
      defaultRedirect="/developer"
      expectedRoles={["GLOBAL_ADMIN", "DEVELOPER_ADMIN"]}
    />
  );
}
