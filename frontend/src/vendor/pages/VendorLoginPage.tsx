import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../shared/hooks/useAuth";
import api from "../../shared/services/axiosService";
import { consumeSessionNotice } from "../../shared/utils/authRedirect";
import { getApiErrorMessage, getApiFieldErrors } from "../../shared/utils/apiError";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { PasswordRequirementChecklist } from "../../shared/components/PasswordRequirementChecklist";
import { isStrongPassword } from "../../shared/utils/passwordPolicy";

type Step = "login" | "forgot" | "otp" | "reset" | "success";

export function VendorLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const NAVY = "#0b1c30";
  const GREEN = "#006e2f";

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

  function resetForm() {
    setError("");
    setFieldErrors({});
    setLoading(false);
    setPassword("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccessMsg("");
  }

  function goTo(s: Step) {
    resetForm();
    setStep(s);
  }

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (step === "login") {
      if (!email.trim()) errs.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
      if (!password) errs.password = "Password is required";
    }
    if (step === "forgot") {
      if (!email.trim()) errs.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
    }
    if (step === "reset") {
      if (!newPassword) errs.newPassword = "New password is required";
      else if (!isStrongPassword(newPassword)) errs.newPassword = "Complete every password requirement";
      if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
      else if (newPassword !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;
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

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setStep("otp");
      setSuccessMsg("OTP sent to your email.");
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Failed to send OTP."));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      setStep("reset");
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Invalid OTP."));
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      setStep("success");
      setSuccessMsg("Password has been reset. You can now sign in.");
    } catch (err: any) {
      const serverFields = getApiFieldErrors(err);
      if (serverFields.password) setFieldErrors((previous) => ({ ...previous, newPassword: serverFields.password }));
      setError(getApiErrorMessage(err, "Failed to reset password."));
    } finally {
      setLoading(false);
    }
  }

  const inp = "w-full px-3 py-2.5 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]";

  const stepsWithBack = new Set<Step>(["forgot", "otp", "reset", "success"]);
  const title: Record<Step, string> = {
    login: "Vendor Sign In",
    forgot: "Reset password",
    otp: "Verify OTP",
    reset: "New password",
    success: "All done",
  };
  const subtitle: Record<Step, string> = {
    login: "Access your vendor dashboard",
    forgot: "",
    otp: "",
    reset: "",
    success: "",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-8">
        <div className="text-center mb-6">
          {stepsWithBack.has(step) && step !== "login" && (
            <div className="mb-3 text-left">
              <button
                onClick={() => {
                  if (step === "otp" || step === "reset") goTo("forgot");
                  else if (step === "success" && successMsg?.includes("password has been reset")) goTo("login");
                  else goTo("login");
                }}
                className="flex items-center gap-1 text-xs font-medium hover:underline"
                style={{ color: GREEN }}
              >
                <ArrowLeft size={13} /> Back
              </button>
            </div>
          )}
          <img src="/logo-to-use.png" alt="PathEats" className="w-10 h-10 mx-auto mb-3 object-cover rounded-full" />
          <h1 className="text-lg font-bold" style={{ color: NAVY }}>{title[step]}</h1>
          {subtitle[step] && <p className="text-xs mt-1" style={{ color: "#64748b" }}>{subtitle[step]}</p>}
        </div>
        {notice && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
            {notice}
          </div>
        )}

        {step === "login" && (
          <>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#374151] block mb-1.5">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                  placeholder="you@example.com"
                  className={inp}
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
                  className={inp}
                />
                {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
              </div>
              <div className="flex justify-end -mt-1">
                <button type="button" onClick={() => { setEmail(email); goTo("forgot"); }} className="text-[11px] font-medium hover:underline" style={{ color: GREEN }}>
                  Forgot password?
                </button>
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
          </>
        )}

        {step === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-xs" style={{ color: "#64748b" }}>Enter your email and we'll send a verification code.</p>
            <div>
              <label className="text-xs font-medium text-[#374151] block mb-1.5">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                placeholder="you@example.com"
                className={inp}
              />
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-[13px] font-semibold bg-[#006e2f] text-white hover:bg-[#005a26] transition-colors disabled:opacity-50"
            >
              {loading ? "Sending\u2026" : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-xs" style={{ color: "#64748b" }}>
              {successMsg} Enter the code sent to{" "}
              <span className="font-semibold" style={{ color: NAVY }}>{email}</span>
            </p>
            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                required
                maxLength={6}
                className={inp + " tracking-[0.5em] text-center text-lg font-bold"}
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-2.5 rounded-lg text-[13px] font-semibold bg-[#006e2f] text-white hover:bg-[#005a26] transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying\u2026" : "Verify"}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-xs" style={{ color: "#64748b" }}>
              Choose a new password for <span className="font-semibold" style={{ color: NAVY }}>{email}</span>
            </p>
            <div>
              <label className="text-xs font-medium text-[#374151] block mb-1.5">New password *</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); clearFieldError("newPassword"); }}
                placeholder="At least 8 characters"
                className={inp}
              />
              {fieldErrors.newPassword && <p className="text-xs text-red-500 mt-1">{fieldErrors.newPassword}</p>}
              <PasswordRequirementChecklist password={newPassword} />
            </div>
            <div>
              <label className="text-xs font-medium text-[#374151] block mb-1.5">Confirm new password *</label>
              <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError("confirmPassword"); }} placeholder="Re-enter new password" className={inp} />
              {fieldErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading || !isStrongPassword(newPassword) || newPassword !== confirmPassword}
              className="w-full py-2.5 rounded-lg text-[13px] font-semibold bg-[#006e2f] text-white hover:bg-[#005a26] transition-colors disabled:opacity-50"
            >
              {loading ? "Resetting\u2026" : "Reset Password"}
            </button>
          </form>
        )}

        {step === "success" && (
          <div className="space-y-4">
            <div className="flex flex-col items-center py-6 gap-3">
              <CheckCircle size={44} className="text-emerald-500" />
              <p className="text-sm font-semibold text-center" style={{ color: NAVY }}>{successMsg}</p>
            </div>
            <button
              onClick={() => goTo("login")}
              className="w-full py-2.5 rounded-lg text-[13px] font-semibold bg-[#006e2f] text-white hover:bg-[#005a26] transition-colors"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
