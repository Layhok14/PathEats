import { useEffect, useState } from "react";
import { ExternalLink, ShieldCheck, CheckCircle, AlertTriangle, MessageCircle, Loader } from "lucide-react";
import api from "../../shared/services/axiosService";

interface OnboardingData {
  telegram_link: string;
  message: string;
}

const guidelines = [
  {
    icon: ShieldCheck,
    title: "Verify the official account",
    desc: "Our official Telegram account is linked below. Always check that the account handle matches exactly — scammers often use lookalike names (e.g., extra underscores or swapped letters).",
  },
  {
    icon: CheckCircle,
    title: "Never share your password",
    desc: "PathEat staff will NEVER ask for your password, OTP codes, or payment details on Telegram. Any such request is a scam — report immediately.",
  },
  {
    icon: AlertTriangle,
    title: "Cross-check in-app",
    desc: "If someone contacts you claiming to be PathEat support, open the app and check your notifications or message center. Legitimate communications always appear in-app.",
  },
  {
    icon: MessageCircle,
    title: "Report suspicious activity",
    desc: "If you receive a suspicious message, forward it to our support Telegram account and block the sender. You can also report via the app's help center.",
  },
];

export function OnboardingPage() {
  const [config, setConfig] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/vendor/onboarding").then((r) => {
      setConfig(r.data.data);
    }).catch(() => {
      setConfig({ telegram_link: "", message: "" });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader className="animate-spin text-[#006e2f]" size={24} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-bold text-[#0b1c30]">Vendor Onboarding</h1>
        <p className="text-[14px] text-[#64748b] mt-1">
          {config?.message || "Connect your vendor account to Telegram for real-time notifications, support, and verification."}
        </p>
      </div>

      {config?.telegram_link ? (
        <a
          href={config.telegram_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 self-start rounded-xl bg-[#006e2f] px-6 py-3 text-[15px] font-semibold text-white hover:bg-[#005a26] transition-colors shadow-sm"
        >
          <ExternalLink size={20} />
          Connect via Telegram
        </a>
      ) : (
        <div className="rounded-xl border border-[#fde68a] bg-[#fffbeb] px-5 py-4 text-[13px] text-[#92400e] flex items-start gap-3">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <span>Telegram onboarding is not yet configured. Please check back later or contact support.</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#f1f5f9]">
          <h2 className="text-[16px] font-semibold text-[#0b1c30]">How it works</h2>
        </div>
        <div className="p-6 grid gap-4">
          {[
            { num: 1, label: "Click the button above to open Telegram" },
            { num: 2, label: "Our onboarding bot will guide you through verification" },
            { num: 3, label: "Once verified, your vendor account is linked to Telegram" },
            { num: 4, label: "You'll receive order and support notifications directly" },
          ].map((step) => (
            <div key={step.num} className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#006e2f] text-[13px] font-bold text-white">{step.num}</div>
              <p className="pt-1.5 text-[14px] text-[#334155]">{step.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#006e2f]" />
          <h2 className="text-[16px] font-semibold text-[#0b1c30]">Scam Prevention Guidelines</h2>
        </div>
        <div className="p-6 grid gap-5">
          {guidelines.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.title} className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#006e2f]"><Icon size={18} /></div>
                <div>
                  <p className="text-[14px] font-semibold text-[#0b1c30]">{g.title}</p>
                  <p className="text-[13px] text-[#64748b] mt-0.5 leading-relaxed">{g.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-[#e2e8f0] bg-white px-6 py-5 flex items-start gap-4 shadow-sm">
        <AlertTriangle size={20} className="shrink-0 mt-0.5 text-[#f59e0b]" />
        <div>
          <p className="text-[14px] font-semibold text-[#0b1c30]">Still unsure?</p>
          <p className="text-[13px] text-[#64748b] mt-0.5">
            If something feels off, pause and verify through the official app channels. You can always reach PathEat support from inside your vendor dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
