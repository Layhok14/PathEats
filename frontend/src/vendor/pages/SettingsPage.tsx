import { useState } from "react";
import { toast } from "sonner";
import imgAvatar from "../../imports/SettingsLight-1/5ca851e66f74e55219ac0be53917ce61059b346e.png";

export function SettingsPage() {
  const [profile, setProfile] = useState({
    firstName: "David", lastName: "Chen",
    email: "david.c@patheat-vendor.com", phone: "(555) 123-4567",
  });
  const [notifications, setNotifications] = useState({ orders: true, reviews: true, summary: true });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
    return (
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "44px", height: "24px", borderRadius: "9999px", border: "none",
          background: on ? "var(--brand-green)" : "#cbced4",
          cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0,
        }}
      >
        <div style={{ position: "absolute", top: "2px", left: on ? "22px" : "2px", width: "20px", height: "20px", borderRadius: "9999px", background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </button>
    );
  }

  const sectionCard: React.CSSProperties = {
    background: "var(--card)", border: "1px solid var(--brand-card-border)",
    borderRadius: "10px", padding: "24px",
  };
  const inp: React.CSSProperties = {
    width: "100%", border: "1px solid #334155", borderRadius: "4px",
    padding: "10px 14px", fontSize: "14px", fontFamily: "Poppins, sans-serif",
    color: "var(--brand-text-dark)", background: "var(--card)", outline: "none",
  };
  const lbl: React.CSSProperties = {
    fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "var(--brand-text-muted)", display: "block", marginBottom: "6px",
  };
  const sectionTitle: React.CSSProperties = {
    fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600,
    color: "var(--brand-text-dark)", display: "flex", alignItems: "center",
    gap: "8px", marginBottom: "20px",
  };

  return (
    <div className="p-6 flex flex-col gap-5 max-w-[700px]">
      <div>
        <p style={{ color: "var(--brand-green-dark)", fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700 }}>Settings</p>
        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", marginTop: "4px" }}>
          Manage your vendor profile, preferences, and security.
        </p>
      </div>

      {/* Profile Information */}
      <div style={sectionCard}>
        <p style={sectionTitle}>👤 Profile Information</p>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <img src={imgAvatar} alt="Profile" className="w-20 h-20 rounded-full object-cover" style={{ border: "2px solid var(--brand-card-border)" }} />
          <button
            style={{ padding: "6px 16px", borderRadius: "6px", border: "1px solid var(--brand-green)", background: "white", color: "var(--brand-green)", fontFamily: "Poppins, sans-serif", fontSize: "13px", cursor: "pointer" }}
          >
            Change picture
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label style={lbl}>First Name</label>
            <input type="text" value={profile.firstName} onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} style={inp} />
          </div>
          <div>
            <label style={lbl}>Last Name</label>
            <input type="text" value={profile.lastName} onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} style={inp} />
          </div>
        </div>

        <div className="mb-4">
          <label style={lbl}>Email Address</label>
          <input type="email" value={profile.email} disabled style={{ ...inp, background: "var(--muted)", color: "var(--brand-text-muted)", cursor: "not-allowed" }} />
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", marginTop: "4px" }}>
            Contact support to change your primary email.
          </p>
        </div>

        <div className="mb-6">
          <label style={lbl}>Phone Number</label>
          <div className="flex gap-2">
            <div style={{ ...inp, width: "60px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>+1</div>
            <input type="tel" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} style={inp} />
          </div>
        </div>

        <button
          onClick={() => toast.success("Profile saved.")}
          style={{ padding: "10px 24px", borderRadius: "6px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
        >
          Save Changes
        </button>
      </div>

      {/* Notification Preferences */}
      <div style={sectionCard}>
        <p style={sectionTitle}>🔔 Notification Preferences</p>
        {[
          { key: "orders" as const, label: "New Order Alerts", desc: "Receive an immediate push notification for every new incoming order." },
          { key: "reviews" as const, label: "Customer Review Alerts", desc: "Get notified when a customer leaves a review or rating for your stall." },
          { key: "summary" as const, label: "Daily Summary Email", desc: "Receive a daily email wrap-up of total sales, top items, and traffic metrics." },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between py-4 border-b last:border-0" style={{ borderColor: "var(--brand-card-border)" }}>
            <div>
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--brand-text-dark)", margin: 0 }}>{item.label}</p>
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "var(--brand-text-muted)", marginTop: "2px" }}>{item.desc}</p>
            </div>
            <Toggle on={notifications[item.key]} onToggle={() => setNotifications((n) => ({ ...n, [item.key]: !n[item.key] }))} />
          </div>
        ))}
      </div>

      {/* Security */}
      <div style={sectionCard}>
        <p style={sectionTitle}>🔒 Security</p>
        <div className="flex flex-col gap-4">
          <div>
            <label style={lbl}>Current Password</label>
            <input type="password" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} placeholder="••••••••" style={inp} />
          </div>
          <div>
            <label style={lbl}>New Password</label>
            <input type="password" value={passwords.newPass} onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))} placeholder="Min. 8 characters" style={inp} />
          </div>
          <div>
            <label style={lbl}>Confirm New Password</label>
            <input type="password" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} style={inp} />
          </div>
          <button
            onClick={() => {
              if (passwords.newPass !== passwords.confirm) { toast.error("Passwords do not match."); return; }
              if (passwords.newPass.length < 8) { toast.error("Password must be at least 8 characters."); return; }
              toast.success("Password updated.");
              setPasswords({ current: "", newPass: "", confirm: "" });
            }}
            style={{ padding: "10px 24px", borderRadius: "6px", border: "none", background: "var(--brand-text-dark)", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer", alignSelf: "flex-start" }}
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
