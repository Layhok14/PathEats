import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../shared/hooks/useAuth";
import { consumeSessionNotice } from "../../shared/utils/authRedirect";
import { getApiErrorMessage } from "../../shared/utils/apiError";

const ROLE_REDIRECTS: Record<string, string> = {
  GLOBAL_ADMIN: "/admin",
  DEVELOPER_ADMIN: "/admin/developer/dashboard",
  BUSINESS_ASSISTANCE: "/admin/business",
};

export function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const message = consumeSessionNotice();
    if (message) setNotice(message);

    const handleNotice = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (detail) setNotice(detail);
    };

    window.addEventListener("patheats:session-notice", handleNotice);
    return () => window.removeEventListener("patheats:session-notice", handleNotice);
  }, []);

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password, [
        "GLOBAL_ADMIN",
        "BUSINESS_ASSISTANCE",
        "DEVELOPER_ADMIN",
      ]);
      // Read role_scope from localStorage (React state not yet updated after await)
      const stored = localStorage.getItem("auth_user");
      const role = stored ? JSON.parse(stored).role_scope : "";
      navigate(ROLE_REDIRECTS[role] || "/admin", { replace: true });
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Login failed. Check your credentials."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-8">
        <div className="text-center mb-8">
          <img src="/logo-to-use.png" alt="PathEats" className="w-10 h-10 mx-auto mb-3 object-cover rounded-full" />
          <h1 className="text-lg font-bold text-[#0b1c30]">Admin Portal</h1>
          <p className="text-xs text-[#64748b] mt-1">Sign in with your admin credentials</p>
        </div>
        {notice && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
            {notice}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#374151] block mb-1.5">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
              placeholder="admin@patheat.app"
              className="w-full px-3 py-2.5 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] text-[#374151] placeholder:text-[#94a3b8]"
            />
            {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-[#374151] block mb-1.5">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
              placeholder="Your password"
              className="w-full px-3 py-2.5 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] text-[#374151] placeholder:text-[#94a3b8]"
            />
            {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#006e2f] text-white text-[13px] font-semibold hover:bg-[#005a26] disabled:opacity-60 transition-colors"
          >
            {loading ? "Signing in\u2026" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
