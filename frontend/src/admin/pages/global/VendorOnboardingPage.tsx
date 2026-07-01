import { useEffect, useState } from "react";
import {
  ExternalLink, Save, Loader, MessageCircle, Link2, Check, X, Eye,
  ArrowRight, Smartphone, Bell, UserCheck, ShieldCheck, Plus, Trash2
} from "lucide-react";
import { toast } from "sonner";
import {
  getAdminOnboardingConfig,
  updateAdminOnboardingConfig,
  type OnboardingConfig,
} from "../../services/adminDashboardService";

const STEP_ICONS = [MessageCircle, UserCheck, Smartphone, Bell];

export default function VendorOnboardingPage() {
  const [config, setConfig] = useState<OnboardingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [telegramLink, setTelegramLink] = useState("");
  const [message, setMessage] = useState("");
  const [steps, setSteps] = useState<string[]>([
    "Tap the button to open Telegram",
    "Bot guides your verification",
    "Account linked automatically",
    "Get real-time notifications",
  ]);
  const [safetyTips, setSafetyTips] = useState<string[]>([
    "We never ask for your password or OTP on Telegram",
    "Always verify the account handle matches exactly",
    "Use only the official Telegram link shown on this page",
  ]);
  const [footer, setFooter] = useState("Questions? Vendors should use the official Telegram channel configured here.");

  useEffect(() => {
    getAdminOnboardingConfig()
      .then((c) => {
        setConfig(c);
        setTelegramLink(c.telegram_link);
        setMessage(c.message);
        if (c.steps && c.steps.length > 0) setSteps(c.steps);
        if (c.safety_tips && c.safety_tips.length > 0) setSafetyTips(c.safety_tips);
        if (c.footer) setFooter(c.footer);
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
      const updated = await updateAdminOnboardingConfig({
        telegramLink,
        message,
        steps,
        safetyTips,
        footer,
      });
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
    message !== (config?.message ?? "") ||
    JSON.stringify(steps) !== JSON.stringify(config?.steps ?? []) ||
    JSON.stringify(safetyTips) !== JSON.stringify(config?.safety_tips ?? []) ||
    footer !== (config?.footer ?? "");

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
      <div className="flex-1 p-8 flex flex-col gap-6 mx-auto max-w-5xl w-full">
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Editor Column */}
          <div className="flex flex-col gap-6">
            {/* Telegram Connection */}
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

            {/* Steps Editor */}
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center gap-2">
                <MessageCircle size={16} className="text-[#006e2f]" />
                <h2 className="text-[16px] font-semibold text-[#0b1c30]">How It Works (Steps)</h2>
              </div>
              <div className="p-6 space-y-3">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#94a3b8] shrink-0 w-10">Step {i + 1}</span>
                    <input
                      value={s}
                      onChange={(e) => {
                        const next = [...steps];
                        next[i] = e.target.value;
                        setSteps(next);
                      }}
                      className="flex-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f] text-[#374151]"
                    />
                    <button
                      onClick={() => setSteps(steps.filter((_, j) => j !== i))}
                      className="p-1.5 rounded text-[#ef4444] hover:bg-red-50"
                      disabled={steps.length <= 1}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setSteps([...steps, ""])}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#006e2f] hover:text-[#005a26]"
                >
                  <Plus size={14} /> Add Step
                </button>
              </div>
            </div>

            {/* Safety Tips Editor */}
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#006e2f]" />
                <h2 className="text-[16px] font-semibold text-[#0b1c30]">Stay Safe (Tips)</h2>
              </div>
              <div className="p-6 space-y-3">
                {safetyTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <textarea
                      value={tip}
                      onChange={(e) => {
                        const next = [...safetyTips];
                        next[i] = e.target.value;
                        setSafetyTips(next);
                      }}
                      rows={2}
                      className="flex-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f] text-[#374151] resize-none"
                    />
                    <button
                      onClick={() => setSafetyTips(safetyTips.filter((_, j) => j !== i))}
                      className="p-1.5 rounded text-[#ef4444] hover:bg-red-50 mt-1"
                      disabled={safetyTips.length <= 1}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setSafetyTips([...safetyTips, ""])}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#006e2f] hover:text-[#005a26]"
                >
                  <Plus size={14} /> Add Tip
                </button>
              </div>
            </div>

            {/* Footer Editor */}
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center gap-2">
                <MessageCircle size={16} className="text-[#006e2f]" />
                <h2 className="text-[16px] font-semibold text-[#0b1c30]">Footer Text</h2>
              </div>
              <div className="p-6">
                <textarea
                  value={footer}
                  onChange={(e) => setFooter(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f] text-[#374151] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Preview Column */}
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
                    {message || "Connect your vendor account to Telegram for onboarding help, account verification, and vendor updates."}
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
                    <span>Telegram onboarding is not configured yet. Add the official Telegram link above.</span>
                  </div>
                )}

                <div className="w-full max-w-lg bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
                  <h2 className="text-[15px] font-semibold text-[#0b1c30] mb-5">How it works</h2>
                  <div className="grid gap-4">
                    {steps.map((label, i) => {
                      const Icon = STEP_ICONS[i] || MessageCircle;
                      return (
                        <div key={i} className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#006e2f]/10 text-[#006e2f] shrink-0">
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-[13px] font-medium text-[#0b1c30]">{label || `Step ${i + 1}`}</p>
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
                    {safetyTips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <ShieldCheck size={14} className="text-[#006e2f] mt-0.5 shrink-0" />
                        <p className="text-[12px] text-[#64748b] leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-[#94a3b8]">{footer}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
