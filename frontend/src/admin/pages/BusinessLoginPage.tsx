import AdminLoginForm from "../../shared/components/AdminLoginForm";

const ROLE_REDIRECTS: Record<string, string> = {
  GLOBAL_ADMIN: "/business",
  BUSINESS_ASSISTANCE: "/business",
};

export function BusinessLoginPage() {
  return (
    <AdminLoginForm
      title="Business Portal"
      subtitle="Sign in with your business assistance credentials"
      redirectMap={ROLE_REDIRECTS}
      defaultRedirect="/business"
      expectedRoles={["GLOBAL_ADMIN", "BUSINESS_ASSISTANCE"]}
    />
  );
}
