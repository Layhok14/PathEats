import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../../shared/hooks/useAuth";
import { Camera, Save, Lock } from "lucide-react";

export function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Profile saved.");
    setSaving(false);
  }

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setChangingPassword(true);
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Password updated.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setChangingPassword(false);
  }

  const initials = `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "V";

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
    <div className="p-6 flex flex-col gap-5 max-w-[700px] mx-auto">
      <div>
        <p style={{ color: "var(--brand-green-dark)", fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700 }}>Settings</p>
        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", marginTop: "4px" }}>
          Manage your vendor profile, preferences, and security.
        </p>
      </div>

      {/* Profile Information */}
      <div style={sectionCard}>
        <p style={sectionTitle}><Camera size={18} /> Profile Information</p>

        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="relative w-20 h-20">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile" className="w-20 h-20 rounded-full object-cover" style={{ border: "2px solid var(--brand-card-border)" }} />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ background: "var(--brand-green)" }}>
                {initials}
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{ padding: "6px 16px", borderRadius: "6px", border: "1px solid var(--brand-green)", background: "white", color: "var(--brand-green)", fontFamily: "Poppins, sans-serif", fontSize: "13px", cursor: "pointer" }}
          >
            Change picture
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label style={lbl}>First Name</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={lbl}>Last Name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inp} />
          </div>
        </div>

        <div className="mb-4">
          <label style={lbl}>Email Address</label>
          <input type="email" value={user?.email || ""} disabled style={{ ...inp, background: "var(--muted)", color: "var(--brand-text-muted)", cursor: "not-allowed" }} />
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", marginTop: "4px" }}>
            Contact support to change your primary email.
          </p>
        </div>

        <div className="mb-6">
          <label style={lbl}>Phone Number</label>
          <div className="flex gap-2">
            <div style={{ ...inp, width: "60px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>+1</div>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={inp} />
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          style={{ padding: "10px 24px", borderRadius: "6px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}
        >
          <Save size={16} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Security */}
      <div style={sectionCard}>
        <p style={sectionTitle}><Lock size={18} /> Change Password</p>
        <div className="flex flex-col gap-4">
          <div>
            <label style={lbl}>Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" style={inp} />
          </div>
          <div>
            <label style={lbl}>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 8 characters" style={inp} />
          </div>
          <div>
            <label style={lbl}>Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inp} />
          </div>
          <button
            onClick={handleChangePassword}
            disabled={changingPassword}
            style={{ padding: "10px 24px", borderRadius: "6px", border: "none", background: "var(--brand-text-dark)", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer", alignSelf: "flex-start", opacity: changingPassword ? 0.7 : 1 }}
          >
            {changingPassword ? "Sending OTP..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
