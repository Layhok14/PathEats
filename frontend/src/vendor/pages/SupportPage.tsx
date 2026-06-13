import { useState } from "react";
import { toast } from "sonner";

type SupportType = "" | "setup" | "technical" | "payment" | "menu" | "other";

const SUPPORT_TYPES: { value: SupportType; label: string }[] = [
  { value: "setup", label: "Help setting up my stall" },
  { value: "technical", label: "Technical issue with the app" },
  { value: "payment", label: "Payment or billing issue" },
  { value: "menu", label: "Help with menu management" },
  { value: "other", label: "Other" },
];

export function SupportPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", supportType: "" as SupportType });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.supportType) { toast.error("Please select a support type."); return; }
    setSubmitted(true);
  }

  const inp: React.CSSProperties = {
    width: "100%", border: "1px solid #334155", borderRadius: "4px",
    padding: "12px 17px", fontSize: "16px",
    fontFamily: "Poppins, sans-serif", color: "var(--brand-text-dark)",
    background: "var(--card)", outline: "none",
  };
  const lbl: React.CSSProperties = {
    fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 500,
    color: "var(--brand-text-dark)", display: "block", marginBottom: "8px",
  };
  const sectionTitle: React.CSSProperties = {
    fontFamily: "Poppins, sans-serif", fontSize: "20px", fontWeight: 500,
    color: "var(--brand-text-dark)", paddingBottom: "9px",
    borderBottom: "1px solid #334155", marginBottom: "16px",
  };

  if (submitted) {
    return (
      <div className="p-8 flex flex-col items-center justify-center" style={{ minHeight: "80vh" }}>
        <div style={{
          background: "var(--card)", border: "1px solid var(--brand-card-border)",
          borderRadius: "16px", padding: "48px 40px", maxWidth: "520px", width: "100%",
          textAlign: "center",
        }}>
          <div className="text-6xl mb-5">✅</div>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700, color: "var(--brand-text-dark)", marginBottom: "12px" }}>
            We've received your request!
          </h2>
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "var(--brand-text-muted)", lineHeight: 1.6, marginBottom: "20px" }}>
            Hi <strong>{form.firstName}</strong>, our support team has received your message and will contact you via{" "}
            <strong style={{ color: "#0088cc" }}>Telegram</strong> at the number you provided.
          </p>
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", marginBottom: "32px" }}>
            📱 <strong>{form.phone}</strong>
          </p>
          <div style={{ padding: "16px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: "28px" }}>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "#166534", margin: 0 }}>
              🕒 Typical response time: <strong>within 24 hours</strong>
            </p>
          </div>
          <button
            onClick={() => { setSubmitted(false); setForm({ firstName: "", lastName: "", phone: "", supportType: "" }); }}
            style={{ padding: "12px 32px", borderRadius: "8px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col items-center">
      <div className="text-center mb-8 max-w-[600px]">
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "32px", fontWeight: 700, color: "var(--brand-text-dark)" }}>
          Assisted Onboarding
        </h1>
        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "var(--brand-text-dark)", marginTop: "12px", lineHeight: 1.6 }}>
          Need help? Fill out the details below and our support team will contact you via Telegram.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "600px" }}>
        <div style={{ background: "var(--card)", border: "1px solid #334155", borderRadius: "12px", padding: "32px", boxShadow: "0 1px 1px rgba(0,0,0,0.05)" }}>

          {/* Personal Info */}
          <section className="mb-6">
            <p style={sectionTitle}>Your Information</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label style={lbl}>First Name *</label>
                <input type="text" required placeholder="Jane" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} style={inp} />
              </div>
              <div>
                <label style={lbl}>Last Name *</label>
                <input type="text" required placeholder="Doe" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} style={inp} />
              </div>
            </div>
            <div>
              <label style={lbl}>Phone Number (Telegram) *</label>
              <input type="tel" required placeholder="+855 12 345 678" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} style={inp} />
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", marginTop: "6px" }}>
                We'll reach you via Telegram at this number.
              </p>
            </div>
          </section>

          {/* Support Type */}
          <section className="mb-8">
            <p style={sectionTitle}>Type of Support</p>
            <div className="flex flex-col gap-3">
              {SUPPORT_TYPES.map((opt) => {
                const sel = form.supportType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, supportType: opt.value }))}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "14px 18px", borderRadius: "8px",
                      border: sel ? "2px solid var(--brand-green)" : "2px solid var(--brand-card-border)",
                      background: sel ? "#f0fdf4" : "var(--card)",
                      cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    }}
                  >
                    <div style={{ width: "20px", height: "20px", borderRadius: "9999px", border: sel ? "none" : "2px solid var(--brand-card-border)", background: sel ? "var(--brand-green)" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {sel && <div style={{ width: "8px", height: "8px", borderRadius: "9999px", background: "white" }} />}
                    </div>
                    <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "15px", color: "var(--brand-text-dark)" }}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <button
            type="submit"
            style={{ width: "100%", padding: "16px", borderRadius: "8px", border: "none", background: "var(--brand-green)", color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
          >
            🎧 Request Support
          </button>
        </div>
      </form>
    </div>
  );
}
