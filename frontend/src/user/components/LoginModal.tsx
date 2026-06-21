// Auth gate — design follows VendorLoginLight-2 Figma spec.
// Flow: login | signup → otp | forgotPassword | loggedOut

import { useState, useRef } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Send, UserX } from "lucide-react";
import { useAuth } from "../../shared/hooks/useAuth";
import imgLogo from "../../styles/PathEat.png";

// ── Shared primitives ────────────────────────────────────────────────────────

const poppins = { fontFamily: "Poppins, sans-serif" };

function InputField({ label, icon: Icon, type = "text", placeholder, value, onChange, right }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[14px] font-medium text-[#0b1c30]" style={poppins}>{label}</label>
      <div className="relative w-full">
        <div className="absolute left-[12px] top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
          <Icon size={16} color="#94a3b8" />
        </div>
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          className="w-full bg-[#f1f5f9] border border-[#bccbb9] rounded-[4px] pl-[41px] pr-[13px] pt-[12px] pb-[13px] text-[16px] text-[#0b1c30] focus:outline-none focus:border-[#22c55e] transition-colors"
          style={{ ...poppins, fontWeight: 400 }} />
        {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
      </div>
    </div>
  );
}

function GreenBtn({ children, disabled, onClick, type = "submit" }) {
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className="w-full bg-[#22c55e] text-white rounded-[4px] py-[13px] px-[17px] text-[14px] text-center transition-all hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
      style={{ ...poppins, fontWeight: 700 }}>
      {children}
    </button>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
function Card({ children }) {
  return (
    <div className="bg-white border border-[#bccbb9] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full overflow-hidden">
      {children}
    </div>
  );
}

// ── Login view ────────────────────────────────────────────────────────────────
function LoginView({ onSignUp, onForgot, onGuest }) {
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try { await login(email, password); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-[23px] p-[33px]">
        {/* Header */}
        <div className="flex flex-col gap-[3px]">
          <p className="text-[24px] font-semibold text-[#0b1c30] text-center" style={poppins}>Welcome back, Customer</p>
          <p className="text-[14px] font-medium text-[#94a3b8] text-center" style={poppins}>Please enter your details to sign in.</p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-[15px]">
          <InputField label="Email Address" icon={Mail} type="email" placeholder="User@patheat.com" value={email} onChange={e => setEmail(e.target.value)} />
          <InputField label="Password" icon={Lock} type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
            right={<button type="button" onClick={() => setShowPw(v => !v)}>{showPw ? <EyeOff size={15} color="#94a3b8" /> : <Eye size={15} color="#94a3b8" />}</button>} />

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between pt-px pb-[13px]">
            <label className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setRemember(v => !v)}>
              <div className="w-4 h-4 border border-[#bccbb9] rounded-[4px] bg-[#f1f5f9] flex items-center justify-center shrink-0">
                {remember && <div className="w-2.5 h-2.5 rounded-sm bg-[#22c55e]" />}
              </div>
              <span className="text-[14px] font-medium text-[#0b1c30]" style={poppins}>Remember me</span>
            </label>
            <button type="button" onClick={onForgot} className="text-[14px] font-medium text-[#006e2f] hover:underline" style={poppins}>Forgot password?</button>
          </div>
        </div>

        {error && <p className="text-[13px] text-red-500 text-center -mt-2" style={poppins}>{error}</p>}

        <GreenBtn disabled={loading}>{loading ? "Signing in…" : "Sign in"}</GreenBtn>

        {/* Footer */}
        <div className="border-t border-[#bccbb9] pt-[17px] flex flex-col gap-3">
          <p className="text-[12px] text-[#94a3b8] text-center tracking-[0.24px]" style={poppins}>
            Having trouble logging in?<br />
            Contact <span className="text-[#006e2f] cursor-pointer hover:underline">Support</span>
          </p>
          <div className="flex flex-col items-center gap-1.5">
            <button type="button" onClick={onSignUp} className="text-[13px] font-medium text-[#006e2f] hover:underline" style={poppins}>
              Don't have an account? <span className="font-semibold">Sign up</span>
            </button>
            <button type="button" onClick={onGuest} className="flex items-center gap-1.5 text-[12px] text-[#94a3b8] hover:text-[#006e2f] transition-colors" style={poppins}>
              <UserX size={13} /> Continue as Guest
            </button>
          </div>
          <p className="text-[11px] text-[#bccbb9] text-center" style={poppins}>Demo: sophea@patheat.app / any password</p>
        </div>
      </form>
    </Card>
  );
}

// ── Sign Up view ──────────────────────────────────────────────────────────────
function SignUpView({ onLogin, onOtp, onGuest }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!firstName.trim()) { setError("First name is required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    // Pass registration data to OTP step
    onOtp({ firstName, lastName, email, password });
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-[23px] p-[33px]">
        <div className="flex flex-col gap-[3px]">
          <p className="text-[24px] font-semibold text-[#0b1c30] text-center" style={poppins}>Create your account</p>
          <p className="text-[14px] font-medium text-[#94a3b8] text-center" style={poppins}>We'll send a verification code to your email.</p>
        </div>

        <div className="flex flex-col gap-[15px]">
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#0b1c30]" style={poppins}>First Name</label>
              <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Sophea" required
                className="w-full bg-[#f1f5f9] border border-[#bccbb9] rounded-[4px] px-3 pt-[12px] pb-[13px] text-[16px] text-[#0b1c30] focus:outline-none focus:border-[#22c55e]"
                style={{ ...poppins, fontWeight: 400 }} />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#0b1c30]" style={poppins}>Last Name</label>
              <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Meng"
                className="w-full bg-[#f1f5f9] border border-[#bccbb9] rounded-[4px] px-3 pt-[12px] pb-[13px] text-[16px] text-[#0b1c30] focus:outline-none focus:border-[#22c55e]"
                style={{ ...poppins, fontWeight: 400 }} />
            </div>
          </div>
          <InputField label="Email Address" icon={Mail} type="email" placeholder="User@patheat.com" value={email} onChange={e => setEmail(e.target.value)} />
          <InputField label="Password" icon={Lock} type={showPw ? "text" : "password"} placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)}
            right={<button type="button" onClick={() => setShowPw(v => !v)}>{showPw ? <EyeOff size={15} color="#94a3b8" /> : <Eye size={15} color="#94a3b8" />}</button>} />
        </div>

        {error && <p className="text-[13px] text-red-500 text-center -mt-2" style={poppins}>{error}</p>}

        <GreenBtn>Continue → Verify Email</GreenBtn>

        <div className="border-t border-[#bccbb9] pt-[17px] flex flex-col items-center gap-2">
          <button type="button" onClick={onLogin} className="text-[13px] font-medium text-[#006e2f] hover:underline" style={poppins}>
            Already have an account? <span className="font-semibold">Sign in</span>
          </button>
          <button type="button" onClick={onGuest} className="flex items-center gap-1.5 text-[12px] text-[#94a3b8] hover:text-[#006e2f] transition-colors" style={poppins}>
            <UserX size={13} /> Continue as Guest
          </button>
        </div>
      </form>
    </Card>
  );
}

// ── OTP view ──────────────────────────────────────────────────────────────────
function OtpView({ regData, onBack }) {
  const { signup } = useAuth();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);

  function handleDigit(i, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) { setError("Please enter all 6 digits."); return; }
    // Mock: accept any 6-digit code (backend will validate real OTP)
    setLoading(true);
    try { await signup(regData); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-[28px] p-[33px]">
        {/* Back */}
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-[13px] font-medium text-[#006e2f] hover:underline w-fit" style={poppins}>
          <ArrowLeft size={14} /> Back
        </button>

        {/* Header */}
        <div className="flex flex-col gap-[6px]">
          <div className="w-14 h-14 bg-[#22c55e] rounded-2xl flex items-center justify-center mx-auto shadow-[0px_8px_16px_-2px_rgba(34,197,94,0.25)]">
            <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>
          <p className="text-[22px] font-semibold text-[#0b1c30] text-center" style={poppins}>Verify your email</p>
          <p className="text-[14px] text-[#94a3b8] text-center" style={poppins}>
            We sent a 6-digit code to<br />
            <span className="text-[#0b1c30] font-medium">{regData.email}</span>
          </p>
        </div>

        {/* 6-digit input */}
        <div className="flex gap-2 justify-center">
          {digits.map((d, i) => (
            <input key={i} ref={el => refs.current[i] = el}
              type="text" inputMode="numeric" maxLength={1} value={d}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="w-11 h-12 text-center text-[20px] font-semibold text-[#0b1c30] bg-[#f1f5f9] border border-[#bccbb9] rounded-[8px] focus:outline-none focus:border-[#22c55e] transition-colors"
              style={poppins} />
          ))}
        </div>

        {error && <p className="text-[13px] text-red-500 text-center -mt-2" style={poppins}>{error}</p>}

        <GreenBtn disabled={loading}>{loading ? "Verifying…" : "Verify Code"}</GreenBtn>

        <p className="text-[12px] text-[#94a3b8] text-center" style={poppins}>
          Didn't receive the code?{" "}
          <span className="text-[#006e2f] font-semibold cursor-pointer hover:underline">Resend Code</span>
        </p>
      </form>
    </Card>
  );
}

// ── Forgot Password view ──────────────────────────────────────────────────────
function ForgotView({ onBack }) {
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 800);
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-[23px] p-[33px]">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-[13px] font-medium text-[#006e2f] hover:underline w-fit" style={poppins}>
          <ArrowLeft size={14} /> Back to Login
        </button>
        <div className="flex flex-col gap-[3px]">
          <p className="text-[24px] font-semibold text-[#0b1c30] text-center" style={poppins}>Forgot Password?</p>
          <p className="text-[14px] font-medium text-[#94a3b8] text-center" style={poppins}>Enter your email to receive a reset link.</p>
        </div>
        <InputField label="Email Address" icon={Mail} type="email" placeholder="User@patheat.com" value={email} onChange={e => setEmail(e.target.value)} />
        {sent
          ? <p className="text-[14px] text-[#22c55e] text-center font-medium" style={poppins}>✓ Reset link sent — check your inbox.</p>
          : <GreenBtn disabled={loading}>{loading ? "Sending…" : <span className="flex items-center justify-center gap-2"><span>Send Reset Link</span><Send size={13} /></span>}</GreenBtn>
        }
      </form>
    </Card>
  );
}

// ── Logged Out view ───────────────────────────────────────────────────────────
function LoggedOutView({ onLogin }) {
  return (
    <Card>
      <div className="flex flex-col items-center gap-4 p-[33px]">
        <div className="w-16 h-16 bg-[#eff4ff] rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="#22c55e" width="32" height="32">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z" />
          </svg>
        </div>
        <p className="text-[28px] font-semibold text-[#0b1c30] text-center" style={poppins}>PathEat</p>
        <p className="text-[16px] text-[#3d4a3d] text-center" style={poppins}>You have been safely logged out.</p>
        <button onClick={onLogin}
          className="w-full bg-[#22c55e] text-white rounded-[4px] py-[13px] text-[14px] transition-all hover:brightness-105 mt-2"
          style={{ ...poppins, fontWeight: 500 }}>
          Back to Login
        </button>
      </div>
    </Card>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export function LoginModal({ showLoggedOut = false }) {
  const { continueAsGuest } = useAuth();
  const [view, setView]     = useState(showLoggedOut ? "loggedOut" : "login");
  const [regData, setRegData] = useState(null);

  function goOtp(data) { setRegData(data); setView("otp"); }

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.15)", backdropFilter: "blur(2px)" }}>

      {/* 1280 × 1016 hugged container */}
      <div className="relative flex items-center justify-center overflow-y-auto"
        style={{ width: 1280, height: 1016, background: "linear-gradient(135deg, #f8fafc 0%, #f8fafc 100%)", borderRadius: 0 }}>

        {/* Ambient blurs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bg-[rgba(34,197,94,0.05)] blur-[50px] right-0 top-0 rounded-[9999px] size-[640px] translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bg-[rgba(218,226,253,0.1)] blur-[50px] left-0 bottom-0 rounded-[9999px] size-[560px] -translate-x-1/4 translate-y-1/4" />
        </div>

      <div className="relative flex flex-col gap-6 w-full max-w-[448px] p-6"
        style={(view === "login" || view === "signup") ? { transform: "scale(0.8) translateY(8%)", transformOrigin: "top center" } : {}}>
        {/* Logo header — hidden on OTP/forgot to save vertical space */}
        {(view === "login" || view === "signup" || view === "loggedOut") && (
          <div className="flex flex-col items-center gap-3">
            <img src={imgLogo} alt="PathEat" className="h-20 object-contain" />
            <p className="text-[40px] font-medium text-[#000500] leading-tight text-center" style={poppins}>User Portal</p>
          </div>
        )}

        {view === "login"     && <LoginView    onSignUp={() => setView("signup")} onForgot={() => setView("forgot")} onGuest={continueAsGuest} />}
        {view === "signup"    && <SignUpView   onLogin={() => setView("login")} onOtp={goOtp} onGuest={continueAsGuest} />}
        {view === "otp"       && <OtpView      regData={regData} onBack={() => setView("signup")} />}
        {view === "forgot"    && <ForgotView   onBack={() => setView("login")} />}
        {view === "loggedOut" && <LoggedOutView onLogin={() => setView("login")} />}
      </div>
      </div>
    </div>
  );
}
