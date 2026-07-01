import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../shared/hooks/useAuth";
import { consumeSessionNotice } from "../../shared/utils/authRedirect";
import { getApiErrorMessage } from "../../shared/utils/apiError";

export function VendorLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, "VENDOR");
      navigate("/vendor/stalls", { replace: true });
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Login failed."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-8">
        <div className="text-center mb-8">
          <img src="/logo-to-use.png" alt="PathEats" className="w-10 h-10 mx-auto mb-3 object-cover rounded-full" />
          <h1 className="text-lg font-bold text-[#0b1c30]">Vendor Sign In</h1>
          <p className="text-xs text-[#64748b] mt-1">Access your vendor dashboard</p>
        </div>
        {notice && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
            {notice}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#374151] block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-3 py-2.5 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]"
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
              className="w-full px-3 py-2.5 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-[13px] font-semibold bg-[#006e2f] text-white hover:bg-[#005a26] transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in\u2026" : "Sign In"}
          </button>
        </form>
        <p className="text-xs text-center text-[#64748b] mt-6">
          Don't have an account?{" "}
          <Link to="/vendor/register" className="text-[#006e2f] font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
