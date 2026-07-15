import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../../shared/hooks/useAuth";
import api from "../../shared/services/axiosService";
import { getApiErrorMessage } from "../../shared/utils/apiError";
import { Camera, Save, Lock, LogOut } from "lucide-react";
import { LoadingSpinner } from "../../shared/components/LoadingSpinner";

interface VendorProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  role_scope: string;
  profile_image_url?: string | null;
}

export function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pwFieldErrors, setPwFieldErrors] = useState<Record<string, string>>({});

  function clearFieldError(field: string, isPw = false) {
    const setter = isPw ? setPwFieldErrors : setFieldErrors;
    setter((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get("/vendor/profile")
      .then((res) => {
        const p = res.data.data as VendorProfile;
        setProfile(p);
        setFirstName(p.first_name || "");
        setLastName(p.last_name || "");
        setPhone(p.phone_number || "");
        setAvatarPreview(p.profile_image_url || null);
      })
      .catch((err) => toast.error(getApiErrorMessage(err, "Failed to load profile")))
      .finally(() => setLoading(false));
  }, []);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile() {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "First name is required";
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaving(true);
    try {
      const { data } = await api.put("/vendor/profile", { firstName, lastName, phone: phone || undefined });
      setProfile(data.data);
      if (avatarFile) {
        const formData = new FormData();
        formData.append("image", avatarFile);
        formData.append("altText", `${firstName} ${lastName}`.trim() || "Vendor profile image");
        const imageResponse = await api.post("/vendor/profile/image", formData);
        setAvatarPreview(imageResponse.data.data.profile_image_url || null);
        setAvatarFile(null);
      }
      toast.success("Profile saved.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save profile"));
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    const errs: Record<string, string> = {};
    if (!currentPassword) errs.currentPassword = "Current password is required";
    if (!newPassword) errs.newPassword = "New password is required";
    else if (newPassword.length < 8) errs.newPassword = "At least 8 characters";
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (newPassword !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    setPwFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setChangingPassword(true);
    try {
      await api.post("/vendor/change-password", { currentPassword, newPassword });
      toast.success("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassword(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to change password"));
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleSignOut() {
    await logout();
    navigate("/vendor/login", { replace: true });
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
    color: "var(--brand-sidebar)", display: "flex", alignItems: "center",
    gap: "8px", marginBottom: "20px",
  };

  if (loading) {
    return <LoadingSpinner message="Loading settings..." />;
  }

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
            <label style={lbl}>First Name *</label>
            <input type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); clearFieldError("firstName"); }} style={inp} />
            {fieldErrors.firstName && <p style={{ color: "#d4183d", fontSize: "12px", marginTop: "4px", fontFamily: "Poppins, sans-serif" }}>{fieldErrors.firstName}</p>}
          </div>
          <div>
            <label style={lbl}>Last Name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inp} />
          </div>
        </div>

        <div className="mb-4">
          <label style={lbl}>Email Address</label>
          <input type="email" value={profile?.email || user?.email || ""} disabled style={{ ...inp, background: "var(--muted)", color: "var(--brand-text-muted)", cursor: "not-allowed" }} />
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
        {!showChangePassword ? (
          <button
            onClick={() => { setShowChangePassword(true); setPwFieldErrors({}); }}
            style={{ padding: "10px 24px", borderRadius: "6px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <Lock size={16} /> Change Password
          </button>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label style={lbl}>Current Password *</label>
              <input type="password" value={currentPassword} onChange={(e) => { setCurrentPassword(e.target.value); clearFieldError("currentPassword", true); }} placeholder="Enter current password" style={inp} />
              {pwFieldErrors.currentPassword && <p style={{ color: "#d4183d", fontSize: "12px", marginTop: "4px", fontFamily: "Poppins, sans-serif" }}>{pwFieldErrors.currentPassword}</p>}
            </div>
            <div>
              <label style={lbl}>New Password *</label>
              <input type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); clearFieldError("newPassword", true); }} placeholder="At least 8 characters" style={inp} />
              {pwFieldErrors.newPassword && <p style={{ color: "#d4183d", fontSize: "12px", marginTop: "4px", fontFamily: "Poppins, sans-serif" }}>{pwFieldErrors.newPassword}</p>}
            </div>
            <div>
              <label style={lbl}>Confirm New Password *</label>
              <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError("confirmPassword", true); }} placeholder="Re-enter new password" style={inp} />
              {pwFieldErrors.confirmPassword && <p style={{ color: "#d4183d", fontSize: "12px", marginTop: "4px", fontFamily: "Poppins, sans-serif" }}>{pwFieldErrors.confirmPassword}</p>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                style={{ padding: "10px 24px", borderRadius: "6px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", opacity: changingPassword ? 0.7 : 1 }}
              >
                <Lock size={16} />
                {changingPassword ? "Updating..." : "Update Password"}
              </button>
              <button
                onClick={() => { setShowChangePassword(false); setPwFieldErrors({}); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }}
                disabled={changingPassword}
                style={{ padding: "10px 24px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#64748b", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600, cursor: "pointer", opacity: changingPassword ? 0.7 : 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sign Out */}
      <div style={sectionCard}>
        <p style={sectionTitle}><LogOut size={18} /> Sign Out</p>
        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", marginBottom: "16px" }}>
          Sign out of your vendor account and return to the login page.
        </p>
        <button
          onClick={handleSignOut}
          style={{ padding: "10px 24px", borderRadius: "6px", border: "1px solid #ef4444", background: "white", color: "#ef4444", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
        >
          <LogOut size={16} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
