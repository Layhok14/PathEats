// User profile modal — personal info form and notification preferences.

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  X,
  User,
  Camera,
  Mail,
  Phone,
  Bell,
  Check,
} from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";
import { useAuth } from "../../shared/hooks/useAuth";
import api from "../../shared/services/axiosService";

/**
 * @param {{ onClose: ()=>void }} props
 */
export function UserProfileModal({ onClose }) {
  const { darkMode, tm } = useTheme();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    firstName: user?.firstName ?? "Guest",
    lastName: user?.lastName ?? "User",
    email: user?.email ?? "user@patheat.app",
    phone: user?.phone ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notifs, setNotifs] = useState({
    orders: true,
    reviews: true,
    summary: false,
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;

    api.get("/user/profile")
      .then((response) => {
        const profile = response.data.data;
        setForm({
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          email: profile.email || "",
          phone: profile.phone_number || "",
        });
        setAvatarPreview(profile.profile_image_url || null);
      })
      .catch((error) => {
        console.error("[UserProfileModal] Failed to load profile:", error);
      });
  }, [user]);

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile() {
    const errors: Record<string, string> = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.phone.trim()) errors.phone = "Phone number is required";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      await api.put("/user/profile", {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
      });

      if (avatarFile) {
        const formData = new FormData();
        formData.append("image", avatarFile);
        formData.append(
          "altText",
          `${form.firstName} ${form.lastName}`.trim() || "Consumer profile image"
        );
        const imageResponse = await api.post("/user/profile/image", formData);
        setAvatarPreview(imageResponse.data.data.profile_image_url || null);
        setAvatarFile(null);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      toast.success("Profile saved.");
    } catch (error) {
      console.error("[UserProfileModal] Failed to save profile:", error);
      toast.error("Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  const panelBg = darkMode ? "#111828" : "#ffffff";
  const inp = {
    background: tm.inputBg,
    border: `1px solid ${tm.inputBorder}`,
    color: tm.text1,
  };
  const sec = {
    border: `1px solid ${tm.border}`,
    background: darkMode ? "#1a2438" : "#f8fafc",
  };

  return (
    <AnimatePresence>
      <motion.div
        key="profile-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[700]"
        style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      <motion.div
        key="profile-panel"
        initial={{ opacity: 0, x: 32 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 32 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-y-4 right-4 z-[701] w-[400px] rounded-2xl overflow-y-auto [&::-webkit-scrollbar]:w-1"
        style={{
          background: panelBg,
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
          border: `1px solid ${tm.border}`,
        }}
      >
        <div
          className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
          style={{
            background: panelBg,
            borderBottom: `1px solid ${tm.border}`,
          }}
        >
          <h2 className="text-base font-bold" style={{ color: tm.text1 }}>
            My Profile
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-black/5"
            style={{ background: tm.surface2 }}
          >
            <X size={14} style={{ color: tm.text3 }} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={`${form.firstName} ${form.lastName}`.trim() || "Profile"}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: tm.primary }}
                >
                  <User size={28} className="text-white" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile image"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: tm.surface2,
                  border: `2px solid ${panelBg}`,
                }}
              >
                <Camera size={10} style={{ color: tm.text3 }} />
              </button>
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: tm.text1 }}>
                {form.firstName} {form.lastName}
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: tm.text4 }}>
                {form.email}
              </div>
              <div
                className="text-[10px] mt-1 px-2 py-0.5 rounded-full inline-block font-semibold"
                style={{
                  background: "rgba(34,197,94,0.12)",
                  color: tm.primary,
                }}
              >
                CONSUMER
              </div>
            </div>
          </div>

          {/* Personal info */}
          <section className="rounded-2xl overflow-hidden" style={sec}>
            <div
              className="px-5 py-3.5 flex items-center gap-2"
              style={{ borderBottom: `1px solid ${tm.border}` }}
            >
              <User size={13} style={{ color: tm.primary }} />
              <span
                className="text-xs font-semibold"
                style={{ color: tm.text1 }}
              >
                Personal Information
              </span>
            </div>
            <div className="px-5 py-4 space-y-3.5">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label
                    className="text-[10px] uppercase tracking-wider mb-1 block"
                    style={{ color: tm.text4 }}
                  >
                    First Name *
                  </label>
                  <input
                    value={form.firstName}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, firstName: e.target.value }));
                      clearFieldError("firstName");
                    }}
                    className="w-full px-3 py-2 rounded-xl text-[13px] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/30"
                    style={inp}
                  />
                  {fieldErrors.firstName && <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>}
                </div>
                <div className="flex-1">
                  <label
                    className="text-[10px] uppercase tracking-wider mb-1 block"
                    style={{ color: tm.text4 }}
                  >
                    Last Name
                  </label>
                  <input
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, lastName: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl text-[13px] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/30"
                    style={inp}
                  />
                </div>
              </div>
              <div>
                <label
                  className="text-[10px] uppercase tracking-wider mb-1 block"
                  style={{ color: tm.text4 }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: tm.text4 }}
                  />
                  <input
                    value={form.email}
                    readOnly
                    className="w-full pl-8 pr-3 py-2 rounded-xl text-[13px] cursor-not-allowed"
                    style={{ ...inp, color: tm.text3 }}
                  />
                </div>
              </div>
              <div>
                <label
                  className="text-[10px] uppercase tracking-wider mb-1 block"
                  style={{ color: tm.text4 }}
                >
                  Phone Number *
                </label>
                <div className="flex gap-2">
                  <div
                    className="px-3 py-2 rounded-xl text-[13px] shrink-0 flex items-center gap-1.5"
                    style={{ ...inp, color: tm.text3 }}
                  >
                    <Phone size={11} /> +855
                  </div>
                  <input
                    value={form.phone}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, phone: e.target.value }));
                      clearFieldError("phone");
                    }}
                    placeholder="012 345 678"
                    className="flex-1 px-3 py-2 rounded-xl text-[13px] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/30"
                    style={inp}
                  />
                </div>
                {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all hover:brightness-110 active:scale-95"
                style={{ background: tm.primary, color: tm.primaryText }}
              >
                {saved ? (
                  <>
                    <Check size={13} /> Saved!
                  </>
                ) : (
                  saving ? "Saving..." : "Save Changes"
                )}
              </button>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-2xl overflow-hidden" style={sec}>
            <div
              className="px-5 py-3.5 flex items-center gap-2"
              style={{ borderBottom: `1px solid ${tm.border}` }}
            >
              <Bell size={13} style={{ color: tm.primary }} />
              <span
                className="text-xs font-semibold"
                style={{ color: tm.text1 }}
              >
                Notifications
              </span>
            </div>
            {[
              {
                key: "orders",
                title: "New Vendor Alerts",
                desc: "Deals near your saved routes.",
              },
              {
                key: "reviews",
                title: "Review Replies",
                desc: "When a vendor responds to your review.",
              },
              {
                key: "summary",
                title: "Weekly Digest",
                desc: "Top-rated vendors along your frequent routes.",
              },
            ].map(({ key, title, desc }) => (
              <div
                key={key}
                className="px-5 py-3.5 flex items-center gap-4"
                style={{ borderBottom: `1px solid ${tm.border}` }}
              >
                <div className="flex-1">
                  <div
                    className="text-[13px] font-medium"
                    style={{ color: tm.text1 }}
                  >
                    {title}
                  </div>
                  <div
                    className="text-[11px] mt-0.5"
                    style={{ color: tm.text4 }}
                  >
                    {desc}
                  </div>
                </div>
                <button
                  onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key] }))}
                  className="w-10 h-5 rounded-full relative transition-colors shrink-0"
                  style={{ background: notifs[key] ? "#10b981" : tm.surface3 }}
                >
                  <div
                    className="absolute top-[2px] w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                    style={{ left: notifs[key] ? "22px" : "2px" }}
                  />
                </button>
              </div>
            ))}
          </section>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-[13px] font-semibold transition-colors hover:bg-red-500/10"
            style={{
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#f87171",
            }}
          >
            Close
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
