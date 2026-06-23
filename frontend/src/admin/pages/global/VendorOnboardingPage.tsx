import { useEffect, useState } from "react";
import { ExternalLink, ShieldCheck, Save, AlertTriangle, Eye, Edit3, Loader } from "lucide-react";
import { toast } from "sonner";
import {
  getAdminOnboardingConfig,
  updateAdminOnboardingConfig,
  type OnboardingConfig,
} from "../../services/adminDashboardService";

const guidelines = [
  {
    title: "Verify the official account",
    desc: "Our official Telegram account is linked below. Always check that the account handle matches exactly — scammers often use lookalike names (e.g., extra underscores or swapped letters).",
  },
  {
    title: "Never share your password",
    desc: "PathEat staff will NEVER ask for your password, OTP codes, or payment details on Telegram. Any such request is a scam — report immediately.",
  },
  {
    title: "Cross-check in-app",
    desc: "If someone contacts you claiming to be PathEat support, open the app and check your notifications or message center. Legitimate communications always appear in-app.",
  },
  {
    title: "Report suspicious activity",
    desc: "If you receive a suspicious message, forward it to our support Telegram account and block the sender. You can also report via the app's help center.",
  },
];

export default function VendorOnboardingPage() {
  const [config, setConfig] = useState<OnboardingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ telegramLink: "", message: "" });

  useEffect(() => {
    getAdminOnboardingConfig()
      .then((c) => {
        setConfig(c);
        setForm({ telegramLink: c.telegram_link, message: c.message });
      })
      .catch(() => toast.error("Could not load onboarding config"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const updated = await updateAdminOnboardingConfig(form);
      setConfig(updated);
      setEditing(false);
      toast.success("Onboarding configuration saved. Vendors will see the updated content.");
    } catch {
      toast.error("Could not save onboarding config.");
    }
  };

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
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">Vendor Onboarding</h1>
            <p className="text-[14px] text-[#64748b] mt-1">
              Configure the Telegram onboarding page that vendors see. Edits take effect immediately.
            </p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-[#bccbb9] bg-white px-3 py-1.5 text-[12px] font-medium text-[#374151] hover:bg-gray-50 shadow-sm"
            >
              <Edit3 size={14} /> Edit Content
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#005a26] shadow-sm"
            >
              <Save size={14} /> Save Changes
            </button>
          )}
        </div>

        {editing ? (
          <>
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f1f5f9]">
                <h2 className="text-[16px] font-semibold text-[#0b1c30]">Onboarding Content</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-[12px] font-medium text-[#64748b]">Telegram Link</label>
                  <input
                    value={form.telegramLink}
                    onChange={(e) => setForm({ ...form, telegramLink: e.target.value })}
                    placeholder="https://t.me/patheat_bot"
                    className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f] text-[#374151]"
                  />
                  <p className="text-[11px] text-[#94a3b8] mt-1">The Telegram deep link or bot URL vendors click to connect.</p>
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[#64748b]">Subtitle / Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                    className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f] text-[#374151] resize-y"
                  />
                  <p className="text-[11px] text-[#94a3b8] mt-1">Displayed below the page title to describe the onboarding process.</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#fde68a] bg-[#fffbeb] px-5 py-4 text-[13px] text-[#92400e] flex items-start gap-3 shadow-sm">
              <Eye size={18} className="shrink-0 mt-0.5" />
              <span>Preview what vendors will see below ↓</span>
            </div>
          </>
        ) : null}

        {/* Vendor-facing preview */}
        <div className={`bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden ${editing ? "ring-2 ring-[#f59e0b]" : ""}`}>
          <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#006e2f]" />
            <h2 className="text-[16px] font-semibold text-[#0b1c30]">Vendor Preview</h2>
            {editing && <span className="ml-auto text-[11px] text-[#f59e0b] font-medium">Live preview</span>}
          </div>
          <div className="p-6 flex flex-col gap-4">
            <p className="text-[13px] text-[#64748b]">{form.message || config?.message}</p>

            {form.telegramLink || config?.telegram_link ? (
              <a
                href={form.telegramLink || config?.telegram_link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 self-start rounded-lg bg-[#006e2f] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#005a26] transition-colors"
              >
                <ExternalLink size={16} /> Connect via Telegram
              </a>
            ) : (
              <div className="rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-[12px] text-[#92400e]">
                No Telegram link configured — vendors will see a "not configured" message.
              </div>
            )}

            <div className="border-t border-[#f1f5f9] pt-4 mt-2">
              <p className="text-[12px] font-semibold text-[#0b1c30] mb-3">Scam Prevention Guidelines (static)</p>
              <div className="grid gap-3">
                {guidelines.map((g) => (
                  <div key={g.title} className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#f1f5f9] text-[#006e2f] text-[11px] font-bold">
                      <ShieldCheck size={13} />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-[#0b1c30]">{g.title}</p>
                      <p className="text-[11px] text-[#64748b] mt-0.5">{g.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white px-6 py-5 flex items-start gap-4 shadow-sm">
          <AlertTriangle size={20} className="shrink-0 mt-0.5 text-[#f59e0b]" />
          <div>
            <p className="text-[14px] font-semibold text-[#0b1c30]">What vendors see</p>
            <p className="text-[13px] text-[#64748b] mt-0.5">
              This page is viewable by vendors under <strong>Vendor Portal → Onboarding</strong>. The scam prevention
              guidelines are static and cannot be edited. Only the Telegram link and subtitle message are configurable here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
