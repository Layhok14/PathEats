import { useEffect, useState } from "react";
import {
  ExternalLink, Save, Loader, MessageCircle, Link2, Check, X, Eye,
  ArrowRight, Smartphone, Bell, UserCheck, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import {
  getAdminOnboardingConfig,
  updateAdminOnboardingConfig,
  type OnboardingConfig,
} from "../../services/adminDashboardService";

const steps = [
  { icon: MessageCircle, label: "Tap the button to open Telegram" },
  { icon: UserCheck, label: "Bot guides your verification" },
  { icon: Smartphone, label: "Account linked automatically" },
  { icon: Bell, label: "Get real-time notifications" },
];

export default function VendorOnboardingPage() {
  const [config, setConfig] = useState<OnboardingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [telegramLink, setTelegramLink] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getAdminOnboardingConfig()
      .then((c) => {
        setConfig(c);
        setTelegramLink(c.telegram_link);
        setMessage(c.message);
      })
      .catch(() => toast.error("Could not load onboarding config"))
      .finally(() => setLoading(false));
  }, []);

  const isValidTelegram = (url: string) =>
    !url || url.startsWith("https://t.me/");

  const handleSave = async () => {
    if (telegramLink && !isValidTelegram(telegramLink)) {
      toast.error("Telegram link must start with https://t.me/");
      return;
    }
    setSaving(true);
    try {
      const updated = await updateAdminOnboardingConfig({ telegramLink, message });
      setConfig(updated);
      toast.success("Onboarding config updated");
    } catch {
      toast.error("Could not save");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    telegramLink !== (config?.telegram_link ?? "") ||
    message !== (config?.message ?? "");

  const hasTelegram = telegramLink || config?.telegram_link;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader className="animate-spin text-[#006e2f]" size={24} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-8 flex flex-col gap-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">Vendor Onboarding</h1>
            <p className="text-[14px] text-[#64748b] mt-1">Configure the vendor Telegram connection page.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="inline-flex items-center gap-2 rounded-lg bg-[#006e2f] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#005a26] disabled:opacity-40 shadow-sm transition-all"
          >
            <Save size={14} /> {saving ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center gap-2">
            <MessageCircle size={16} className="text-[#006e2f]" />
            <h2 className="text-[16px] font-semibold text-[#0b1c30]">Telegram Connection</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="text-[13px] font-medium text-[#0b1c30]">Telegram Link</label>
              <div className="relative mt-1.5">
                <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  value={telegramLink}
                  onChange={(e) => setTelegramLink(e.target.value)}
                  placeholder="https://t.me/patheat_bot"
                  className="w-full pl-9 pr-8 py-2 rounded-lg border border-[#e2e8f0] text-[13px] outline-none focus:border-[#006e2f] text-[#374151]"
                />
                {telegramLink && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isValidTelegram(telegramLink) ? (
                      <Check size={14} className="text-[#006e2f]" />
                    ) : (
                      <X size={14} className="text-[#ba1a1a]" />
                    )}
                  </div>
                )}
              </div>
              {telegramLink && !isValidTelegram(telegramLink) && (
                <p className="text-[11px] text-[#ba1a1a] mt-1">Must start with https://t.me/</p>
              )}
            </div>
            <div>
              <label className="text-[13px] font-medium text-[#0b1c30]">Subtitle Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                placeholder="Connect your vendor account to Telegram..."
                className="w-full mt-1.5 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f] text-[#374151] resize-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Eye size={16} className="text-[#f59e0b]" />
            <h3 className="text-[14px] font-semibold text-[#0b1c30]">Vendor Preview</h3>
          </div>
          <div className="min-h-[80vh] bg-gradient-to-b from-[#f0fdf4] to-[#f8fafc] rounded-xl border border-[#e2e8f0] p-6">
            <div className="max-w-lg mx-auto flex flex-col items-center text-center gap-8">
              <div className="w-16 h-16 rounded-2xl bg-[#006e2f] flex items-center justify-center shadow-lg shadow-[#006e2f]/20">
                <MessageCircle size={32} className="text-white" />
              </div>

              <div>
                <h1 className="text-[26px] font-bold text-[#0b1c30]">Vendor Onboarding</h1>
                <p className="text-[14px] text-[#64748b] mt-2 leading-relaxed">
                  {message || "Connect your vendor account to Telegram for real-time notifications, support, and verification."}
                </p>
              </div>

              {hasTelegram ? (
                <a
                  href={telegramLink || config?.telegram_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-xl bg-[#006e2f] px-7 py-3.5 text-[15px] font-bold text-white hover:bg-[#005a26] transition-all shadow-lg shadow-[#006e2f]/25 hover:shadow-[#006e2f]/35 hover:-translate-y-0.5"
                >
                  <ExternalLink size={20} />
                  Connect via Telegram
                  <ArrowRight size={18} />
                </a>
              ) : (
                <div className="rounded-xl border border-[#fde68a] bg-[#fffbeb] px-6 py-4 text-[13px] text-[#92400e] flex items-center gap-3 w-full max-w-xs">
                  <ShieldCheck size={18} className="shrink-0" />
                  <span>Telegram onboarding not yet available. Check back later or contact support.</span>
                </div>
              )}

              <div className="w-full max-w-lg bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
                <h2 className="text-[15px] font-semibold text-[#0b1c30] mb-5">How it works</h2>
                <div className="grid gap-4">
                  {steps.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={i} className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#006e2f]/10 text-[#006e2f] shrink-0">
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-[13px] font-medium text-[#0b1c30]">{s.label}</p>
                        </div>
                        <span className="text-[11px] font-bold text-[#94a3b8] shrink-0">Step {i + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="w-full max-w-lg bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={16} className="text-[#006e2f]" />
                  <h2 className="text-[15px] font-semibold text-[#0b1c30]">Stay Safe</h2>
                </div>
                <div className="grid gap-3 text-left">
                  {[
                    "We never ask for your password or OTP on Telegram",
                    "Always verify the account handle matches exactly",
                    "Report suspicious messages via the app",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <ShieldCheck size={14} className="text-[#006e2f] mt-0.5 shrink-0" />
                      <p className="text-[12px] text-[#64748b] leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-[#94a3b8]">
                Questions? Contact support from your vendor dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
