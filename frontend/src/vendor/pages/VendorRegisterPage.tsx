import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../shared/hooks/useAuth";
import { getApiErrorMessage } from "../../shared/utils/apiError";

export function VendorRegisterPage() {
  const { vendorSignup } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await vendorSignup({ firstName, lastName, email, password });
      navigate("/vendor/stalls", { replace: true });
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Registration failed."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-8">
        <div className="text-center mb-8">
          <img src="/logo-to-use.png" alt="PathEats" className="w-10 h-10 mx-auto mb-3 object-cover rounded-full" />
          <h1 className="text-lg font-bold text-[#0b1c30]">Vendor Registration</h1>
          <p className="text-xs text-[#64748b] mt-1">Create your vendor account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-[#374151] block mb-1.5">First name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First"
                required
                className="w-full px-3 py-2.5 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-[#374151] block mb-1.5">Last name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last"
                className="w-full px-3 py-2.5 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#374151] block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vendor@example.com"
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
              placeholder="At least 6 characters"
              required
              minLength={6}
              className="w-full px-3 py-2.5 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-[13px] font-semibold bg-[#006e2f] text-white hover:bg-[#005a26] transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account\u2026" : "Create Account"}
          </button>
        </form>
        <p className="text-xs text-center text-[#64748b] mt-6">
          Already have an account?{" "}
          <Link to="/vendor/login" className="text-[#006e2f] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
