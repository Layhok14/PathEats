import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, Eye, EyeOff, ArrowLeft, CheckCircle, KeyRound } from "lucide-react";
import { useAuth } from "../../shared/hooks/useAuth";
import { useTheme } from "../../shared/hooks/useTheme";
import api from "../../shared/services/axiosService";

interface Props {
  onClose: () => void;
  prompt?: string;
}

type Step = "login" | "signup" | "forgot" | "otp" | "reset" | "success";

export function AuthModal({ onClose, prompt }: Props) {
  const { tm } = useTheme();
  const { login, signup, continueAsGuest } = useAuth();

  const [step, setStep] = useState<Step>("login");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function resetForm() {
    setError("");
    setLoading(false);
    setPassword("");
    setOtp("");
    setNewPassword("");
    setSuccessMsg("");
  }

  function goTo(s: Step) {
    resetForm();
    setStep(s);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, "CONSUMER");
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) { setError("First name is required."); return; }
    setError("");
    setLoading(true);
    try {
      await signup({ email, password, firstName, lastName });
      setStep("success");
      setSuccessMsg("Account created successfully! You can now explore PathEats.");
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setStep("otp");
      setSuccessMsg("OTP sent to your email.");
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? "Failed to send OTP.");
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
      setError(err.response?.data?.message ?? err.message ?? "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      setStep("success");
      setSuccessMsg("Password has been reset. You can now sign in.");
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  const inp = {
    background: tm.inputBg,
    border: `1px solid ${tm.inputBorder}`,
    color: tm.text1,
  };

  const stepsWithBack = new Set<Step>(["forgot", "otp", "reset", "success"]);
  const title: Record<Step, string> = {
    login: "Welcome back",
    signup: "Create account",
    forgot: "Reset password",
    otp: "Verify OTP",
    reset: "New password",
    success: "All done",
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[800] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          className="relative w-full max-w-sm rounded-2xl overflow-hidden"
          initial={{ scale: 0.93, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.93, y: 16 }}
          transition={{ duration: 0.2 }}
          style={{
            background: tm.dropdown,
            border: `1px solid ${tm.border}`,
            boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
          }}
        >
          <div className="px-6 pt-6 pb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              {stepsWithBack.has(step) && step !== "success" && (
                <button
                  onClick={() => step === "reset" || step === "otp" && successMsg?.includes("OTP") ? goTo("forgot") : goTo("login")}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-black/10 shrink-0"
                  style={{ background: tm.surface2 }}
                >
                  <ArrowLeft size={13} style={{ color: tm.text3 }} />
                </button>
              )}
              <div>
                <h2 className="text-base font-bold" style={{ color: tm.text1 }}>
                  {title[step]}
                </h2>
                {prompt && step === "login" && (
                  <p className="text-xs mt-0.5" style={{ color: tm.text4 }}>
                    {prompt}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-black/10"
              style={{ background: tm.surface2 }}
            >
              <X size={13} style={{ color: tm.text3 }} />
            </button>
          </div>

          {step === "login" && (
            <div>
              <div
                className="mx-6 mb-5 flex rounded-xl p-1"
                style={{ background: tm.surface1 }}
              >
                {(["login", "signup"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => goTo(t)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={
                      step === t
                        ? { background: tm.primary, color: tm.primaryText }
                        : { color: tm.text3 }
                    }
                  >
                    {t === "login" ? "Sign In" : "Sign Up"}
                  </button>
                ))}
              </div>
              <form onSubmit={handleLogin} className="px-6 pb-6 space-y-3">
                <div className="relative">
                  <Mail
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: tm.text4 }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sophea@patheat.app"
                    required
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/30"
                    style={inp}
                  />
                </div>
                <div className="relative">
                  <Lock
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: tm.text4 }}
                  />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full pl-8 pr-9 py-2.5 rounded-xl text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/30"
                    style={inp}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: tm.text4 }}
                  >
                    {showPw ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setEmail(email); goTo("forgot"); }}
                    className="text-[10px] font-medium hover:underline"
                    style={{ color: tm.primary }}
                  >
                    Forgot password?
                  </button>
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                  style={{ background: tm.primary, color: tm.primaryText }}
                >
                  {loading ? "Signing in\u2026" : "Sign In"}
                </button>
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div style={{ borderTop: `1px solid ${tm.border}`, width: "100%" }} />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 text-[10px]" style={{ background: tm.dropdown, color: tm.text4 }}>or</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { continueAsGuest(); onClose(); }}
                  className="w-full py-2 rounded-xl text-xs font-medium transition-all hover:brightness-110 active:scale-95"
                  style={{ border: `1px solid ${tm.border}`, color: tm.text3, background: tm.surface1 }}
                >
                  Continue as Guest
                </button>
              </form>
            </div>
          )}

          {step === "signup" && (
            <div>
              <div
                className="mx-6 mb-5 flex rounded-xl p-1"
                style={{ background: tm.surface1 }}
              >
                {(["login", "signup"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => goTo(t)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={
                      step === t
                        ? { background: tm.primary, color: tm.primaryText }
                        : { color: tm.text3 }
                    }
                  >
                    {t === "login" ? "Sign In" : "Sign Up"}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSignup} className="px-6 pb-6 space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <User
                      size={12}
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: tm.text4 }}
                    />
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      required
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/30"
                      style={inp}
                    />
                  </div>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="flex-1 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/30"
                    style={inp}
                  />
                </div>
                <div className="relative">
                  <Mail
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: tm.text4 }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/30"
                    style={inp}
                  />
                </div>
                <div className="relative">
                  <Lock
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: tm.text4 }}
                  />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (min 8 chars)"
                    required
                    minLength={8}
                    className="w-full pl-8 pr-9 py-2.5 rounded-xl text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/30"
                    style={inp}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: tm.text4 }}
                  >
                    {showPw ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                  style={{ background: tm.primary, color: tm.primaryText }}
                >
                  {loading ? "Creating account\u2026" : "Create Account"}
                </button>
              </form>
            </div>
          )}

          {step === "forgot" && (
            <form onSubmit={handleForgotPassword} className="px-6 pb-6 space-y-3">
              <p className="text-xs" style={{ color: tm.text4 }}>
                Enter your email and we'll send a verification code.
              </p>
              <div className="relative">
                <Mail
                  size={12}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: tm.text4 }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/30"
                  style={inp}
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                style={{ background: tm.primary, color: tm.primaryText }}
              >
                {loading ? "Sending\u2026" : "Send OTP"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="px-6 pb-6 space-y-3">
              <p className="text-xs" style={{ color: tm.text4 }}>
                {successMsg} Enter the 6-digit code sent to{" "}
                <span className="font-medium" style={{ color: tm.text2 }}>{email}</span>
              </p>
              <div className="relative">
                <KeyRound
                  size={12}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: tm.text4 }}
                />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  required
                  maxLength={6}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/30 tracking-widest text-center"
                  style={inp}
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                style={{ background: tm.primary, color: tm.primaryText }}
              >
                {loading ? "Verifying\u2026" : "Verify"}
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="px-6 pb-6 space-y-3">
              <p className="text-xs" style={{ color: tm.text4 }}>
                Choose a new password for{" "}
                <span className="font-medium" style={{ color: tm.text2 }}>{email}</span>
              </p>
              <div className="relative">
                <Lock
                  size={12}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: tm.text4 }}
                />
                <input
                  type={showPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min 8 chars)"
                  required
                  minLength={8}
                  className="w-full pl-8 pr-9 py-2.5 rounded-xl text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/30"
                  style={inp}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: tm.text4 }}
                >
                  {showPw ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                style={{ background: tm.primary, color: tm.primaryText }}
              >
                {loading ? "Resetting\u2026" : "Reset Password"}
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="px-6 pb-6 space-y-4">
              <div className="flex flex-col items-center py-4 gap-3">
                <CheckCircle size={40} className="text-emerald-500" />
                <p className="text-sm font-semibold text-center" style={{ color: tm.text1 }}>
                  {successMsg}
                </p>
              </div>
              <button
                onClick={() => {
                  if (successMsg?.includes("password has been reset")) {
                    goTo("login");
                  } else {
                    onClose();
                  }
                }}
                className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-95"
                style={{ background: tm.primary, color: tm.primaryText }}
              >
                {successMsg?.includes("password has been reset") ? "Sign In" : "Continue"}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
