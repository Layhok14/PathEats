import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../shared/hooks/useAuth";
import api from "../../shared/services/axiosService";
import { consumeSessionNotice } from "../../shared/utils/authRedirect";
import { getApiErrorMessage } from "../../shared/utils/apiError";
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";

type Step = "login" | "signup" | "forgot" | "otp" | "reset" | "success";

export default function UserLoginPage() {
  const { login, signup, continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("login");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
    setSuccessMsg("");
  }

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validate(stepName: Step): boolean {
    const errs: Record<string, string> = {};
    if (stepName === "login" || stepName === "signup") {
      if (stepName === "login" || stepName === "signup") {
        if (!email.trim()) errs.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
      }
      if (stepName === "login") {
        if (!password) errs.password = "Password is required";
      }
      if (stepName === "signup") {
        if (!firstName.trim()) errs.firstName = "First name is required";
        if (!password) errs.password = "Password is required";
        else if (password.length < 8) errs.password = "At least 8 characters";
      }
    }
    if (stepName === "forgot") {
      if (!email.trim()) errs.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
    }
    if (stepName === "reset") {
      if (!newPassword) errs.newPassword = "New password is required";
      else if (newPassword.length < 8) errs.newPassword = "At least 8 characters";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function goTo(s: Step) {
    resetForm();
    setStep(s);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate("login")) return;
    setLoading(true);
    try {
      await login(email, password, "CONSUMER");
      navigate("/user", { replace: true });
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate("signup")) return;
    setLoading(true);
    try {
      await signup({ firstName, lastName, email, password });
      setStep("success");
      setSuccessMsg("Account created successfully! You can now explore PathEats.");
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Registration failed."));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate("forgot")) return;
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
      if (step === "signup") {
        setStep("success");
        setSuccessMsg("Email verified successfully!");
      } else {
        setStep("reset");
      }
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Invalid OTP."));
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate("reset")) return;
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      setStep("success");
      setSuccessMsg("Password has been reset. You can now sign in.");
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Failed to reset password."));
    } finally {
      setLoading(false);
    }
  }

  const inp = "w-full px-3 py-2.5 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]";

  function handleGuest() {
    continueAsGuest();
    navigate("/user", { replace: true });
  }

  const stepsWithBack = new Set<Step>(["forgot", "otp", "reset", "success"]);
  const title: Record<Step, string> = {
    login: "Sign in",
    signup: "Create account",
    forgot: "Reset password",
    otp: "Verify OTP",
    reset: "New password",
    success: "All done",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div className="px-8 pt-8 pb-4 text-center">
          <img src="/logo-to-use.png" alt="PathEats" className="w-11 h-11 mx-auto mb-3 object-cover rounded-full" />
          <h1 className="text-lg font-bold" style={{ color: NAVY }}>PathEats</h1>
          <p className="text-xs mt-1" style={{ color: "#64748b" }}>Discover food along your route</p>
        </div>

        {notice && (
          <div className="mx-8 mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
            {notice}
          </div>
        )}

        {(step === "login" || step === "signup") && (
          <div className="mx-8 mb-5 flex gap-1.5">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => goTo(t)}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={
                  step === t
                    ? { background: "white", color: NAVY, boxShadow: "0 1px 2px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }
                    : { background: "#f1f5f9", color: "#64748b", border: "1px solid transparent" }
                }
              >
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
        )}

        {stepsWithBack.has(step) && (
          <div className="px-8 mb-3">
            <button
              onClick={() => {
                if (step === "otp") goTo("forgot");
                else if (step === "reset") goTo("forgot");
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

        {step === "login" && (
          <form onSubmit={handleLogin} className="px-8 pb-8 space-y-4">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#374151" }}>Email *</label>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }} placeholder="sophea@patheat.app" className={inp} />
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#374151" }}>Password *</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }} placeholder="Your password" className={inp + " pr-10"} />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
            </div>
            <div className="flex justify-end -mt-1">
              <button type="button" onClick={() => { setEmail(email); goTo("forgot"); }} className="text-[11px] font-medium hover:underline" style={{ color: GREEN }}>
                Forgot password?
              </button>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-[13px] font-semibold text-white transition-colors disabled:opacity-50 hover:bg-[#005a26]"
              style={{ background: GREEN }}
            >
              {loading ? "Signing in\u2026" : "Sign In"}
            </button>
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e2e8f0]" /></div>
              <div className="relative flex justify-center"><span className="px-2 text-[10px] bg-white" style={{ color: "#94a3b8" }}>or</span></div>
            </div>
            <button type="button" onClick={handleGuest}
              className="w-full py-2.5 rounded-lg text-[13px] font-medium border border-[#e2e8f0] transition-colors hover:bg-[#f8fafc]"
              style={{ color: "#64748b" }}
            >
              Continue as Guest
            </button>
          </form>
        )}

        {step === "signup" && (
          <form onSubmit={handleSignup} className="px-8 pb-8 space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium block mb-1.5" style={{ color: "#374151" }}>First name *</label>
                <input type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); clearFieldError("firstName"); }} placeholder="First" className={inp} />
                {fieldErrors.firstName && <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>}
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium block mb-1.5" style={{ color: "#374151" }}>Last name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last" className={inp} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#374151" }}>Email *</label>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }} placeholder="your@email.com" className={inp} />
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#374151" }}>Password *</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }} placeholder="At least 6 characters" className={inp + " pr-10"} />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-[13px] font-semibold text-white transition-colors disabled:opacity-50 hover:bg-[#005a26]"
              style={{ background: GREEN }}
            >
              {loading ? "Creating account\u2026" : "Create Account"}
            </button>
          </form>
        )}

        {step === "forgot" && (
          <form onSubmit={handleForgotPassword} className="px-8 pb-8 space-y-4">
            <p className="text-xs" style={{ color: "#64748b" }}>Enter your email and we'll send a verification code.</p>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#374151" }}>Email *</label>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }} placeholder="your@email.com" className={inp} />
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-[13px] font-semibold text-white transition-colors disabled:opacity-50 hover:bg-[#005a26]"
              style={{ background: GREEN }}
            >
              {loading ? "Sending\u2026" : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="px-8 pb-8 space-y-4">
            <p className="text-xs" style={{ color: "#64748b" }}>
              {successMsg} Enter the code sent to{" "}
              <span className="font-semibold" style={{ color: NAVY }}>{email}</span>
            </p>
            <div>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000" required maxLength={6}
                className={inp + " tracking-[0.5em] text-center text-lg font-bold"} />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={loading || otp.length < 6}
              className="w-full py-2.5 rounded-lg text-[13px] font-semibold text-white transition-colors disabled:opacity-50 hover:bg-[#005a26]"
              style={{ background: GREEN }}
            >
              {loading ? "Verifying\u2026" : "Verify"}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="px-8 pb-8 space-y-4">
            <p className="text-xs" style={{ color: "#64748b" }}>
              Choose a new password for <span className="font-semibold" style={{ color: NAVY }}>{email}</span>
            </p>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#374151" }}>New password *</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={newPassword} onChange={(e) => { setNewPassword(e.target.value); clearFieldError("newPassword"); }}
                  placeholder="At least 8 characters" className={inp + " pr-10"} />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {fieldErrors.newPassword && <p className="text-xs text-red-500 mt-1">{fieldErrors.newPassword}</p>}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-[13px] font-semibold text-white transition-colors disabled:opacity-50 hover:bg-[#005a26]"
              style={{ background: GREEN }}
            >
              {loading ? "Resetting\u2026" : "Reset Password"}
            </button>
          </form>
        )}

        {step === "success" && (
          <div className="px-8 pb-8 space-y-4">
            <div className="flex flex-col items-center py-6 gap-3">
              <CheckCircle size={44} className="text-emerald-500" />
              <p className="text-sm font-semibold text-center" style={{ color: NAVY }}>{successMsg}</p>
            </div>
            <button
              onClick={() => {
                if (successMsg?.includes("password has been reset")) goTo("login");
                else navigate("/user", { replace: true });
              }}
              className="w-full py-2.5 rounded-lg text-[13px] font-semibold text-white transition-colors hover:bg-[#005a26]"
              style={{ background: GREEN }}
            >
              {successMsg?.includes("password has been reset") ? "Sign In" : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
