import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../shared/hooks/useAuth";

const ROLE_REDIRECTS: Record<string, string> = {
  GLOBAL_ADMIN: "/admin",
  DEVELOPER_ADMIN: "/developer",
  BUSINESS_ASSISTANCE: "/admin",
};

export function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      // Read role_scope from localStorage (React state not yet updated after await)
      const stored = localStorage.getItem("auth_user");
      const role = stored ? JSON.parse(stored).role_scope : "";
      const target = from || ROLE_REDIRECTS[role] || "/admin";
      navigate(target, { replace: true });
    } catch (err: any) {
      setError(err.message ?? "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-full bg-[#004b1e] flex items-center justify-center mx-auto mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <h1 className="text-lg font-bold text-[#0b1c30]">Admin Portal</h1>
          <p className="text-xs text-[#64748b] mt-1">Sign in with your admin credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#374151] block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@patheat.app"
              required
              className="w-full px-3 py-2.5 text-[14px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] text-[#374151] placeholder:text-[#94a3b8]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#374151] block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              className="w-full px-3 py-2.5 text-[14px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] text-[#374151] placeholder:text-[#94a3b8]"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#004b1e] text-white text-[14px] font-semibold hover:bg-[#006e2f] disabled:opacity-60 transition-colors"
          >
            {loading ? "Signing in\u2026" : "Sign In"}
          </button>
        </form>
        <p className="text-xs text-center text-[#64748b] mt-6">
          Demo: <strong>admin@patheat.app</strong> / <strong>admin123</strong> or <strong>dev@patheat.app</strong> / <strong>dev123</strong>
        </p>
      </div>
    </div>
  );
}
