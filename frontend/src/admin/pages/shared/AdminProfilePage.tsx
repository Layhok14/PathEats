import { useEffect, useState } from "react";
import { Mail, Phone, Shield, Calendar, Eye, EyeOff, Save, AlertCircle } from "lucide-react";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { getAdminProfile, changeAdminPassword, type AdminProfile } from "../../services/adminDashboardService";
import { useAuth } from "../../../shared/hooks/useAuth";
import { toast } from "sonner";

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAdminProfile();
        setProfile(data);
      } catch {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both fields.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading profile..." />;

  const displayName = profile
    ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || profile.email
    : "Admin";
  const initials = displayName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-8 flex flex-col gap-6 max-w-3xl">
        <div>
          <h1 className="text-[28px] font-bold text-[#0b1c30]">My Profile</h1>
          <p className="text-[14px] text-[#64748b] mt-1">View your account information and manage your password.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#f1f5f9] flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#006e2f] flex items-center justify-center text-white text-[20px] font-bold shrink-0">
              {initials}
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#0b1c30]">{displayName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  profile?.roleScope === "GLOBAL_ADMIN" ? "bg-purple-100 text-purple-700" :
                  profile?.roleScope === "DEVELOPER_ADMIN" ? "bg-blue-100 text-blue-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {profile?.roleScope?.replace(/_/g, " ") ?? "Admin"}
                </span>
                {profile?.isBanned && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">Banned</span>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8fafc]">
                <Mail size={16} className="text-[#64748b] shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]">Email</p>
                  <p className="text-[13px] text-[#0b1c30] font-medium">{profile?.email ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8fafc]">
                <Phone size={16} className="text-[#64748b] shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]">Phone</p>
                  <p className="text-[13px] text-[#0b1c30] font-medium">{profile?.phone ?? "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8fafc]">
                <Shield size={16} className="text-[#64748b] shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]">Role</p>
                  <p className="text-[13px] text-[#0b1c30] font-medium">{profile?.roleScope?.replace(/_/g, " ") ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8fafc]">
                <Calendar size={16} className="text-[#64748b] shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]">Joined</p>
                  <p className="text-[13px] text-[#0b1c30] font-medium">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#f1f5f9]">
            <h2 className="text-[16px] font-semibold text-[#0b1c30]">Change Password</h2>
          </div>
          <div className="px-6 py-5 flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b] mb-1 block">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 pr-10 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#0b1c30]"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]">
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b] mb-1 block">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                  className="w-full px-3 py-2 pr-10 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#0b1c30]"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b] mb-1 block">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#0b1c30]"
              />
            </div>
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <div className="flex items-center gap-2 text-[12px] text-red-600">
                <AlertCircle size={14} /> Passwords do not match
              </div>
            )}
            <button
              onClick={handleChangePassword}
              disabled={saving || !currentPassword || !newPassword || !confirmPassword}
              className="self-start inline-flex items-center gap-2 rounded-lg bg-[#006e2f] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#005a26] disabled:opacity-50 transition-colors"
            >
              <Save size={14} />
              {saving ? "Saving..." : "Change Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
