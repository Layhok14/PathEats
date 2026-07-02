import { useEffect, useState } from "react";
import {
  ExternalLink, MessageCircle, ShieldCheck,
  ArrowRight, Smartphone, Bell, UserCheck
} from "lucide-react";
import { toast } from "sonner";
import api from "../../shared/services/axiosService";
import { LoadingSpinner } from "../../shared/components/LoadingSpinner";

interface OnboardingData {
  telegram_link: string;
  message: string;
  steps: string[];
  safety_tips: string[];
  footer: string;
}

const STEP_ICONS = [MessageCircle, UserCheck, Smartphone, Bell];

export function OnboardingPage() {
  const [config, setConfig] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/vendor/onboarding").then((r) => {
      setConfig(r.data.data);
    }).catch(() => {
      setFetchError("Could not load onboarding config. Please try again later.");
      toast.error("Could not load onboarding config");
    }).finally(() => setLoading(false));
  }, []);

  const hasTelegram = !!config?.telegram_link;
  const steps = config?.steps?.length ? config.steps : [
    "Tap the button to open Telegram",
    "Bot guides your verification",
    "Account linked automatically",
    "Get real-time notifications",
  ];
  const safetyTips = config?.safety_tips?.length ? config.safety_tips : [
    "We never ask for your password or OTP on Telegram",
    "Always verify the account handle matches exactly",
    "Use only the official Telegram link shown on this page",
  ];
  const footer = config?.footer || "Questions? Use the official Telegram channel configured by PathEats.";

  if (loading) {
    return (
      <div className="min-h-full bg-gradient-to-b from-[#f0fdf4] to-[#f8fafc] flex flex-col">
        <div className="max-w-lg mx-auto px-6 py-12 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#006e2f] flex items-center justify-center shadow-lg shadow-[#006e2f]/20">
            <MessageCircle size={32} className="text-white" />
          </div>
          <h1 className="text-[26px] font-bold text-[#0b1c30]">Vendor Onboarding</h1>
          <p className="text-[14px] text-[#64748b] mt-2 leading-relaxed">Connecting to Telegram...</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner message="Loading onboarding..." />
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-full bg-gradient-to-b from-[#f0fdf4] to-[#f8fafc] flex items-center justify-center">
        <p className="text-[14px] text-red-500">{fetchError}</p>
      </div>
    );
  }

  const body = hasTelegram ? (
    <a
      href={config!.telegram_link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 rounded-xl bg-[#006e2f] px-7 py-3.5 text-[15px] font-bold text-white hover:bg-[#005a26] transition-all shadow-lg shadow-[#006e2f]/25 hover:shadow-[#006e2f]/35 hover:-translate-y-0.5"
    >
      <ExternalLink size={20} />
      Connect via Telegram
      <ArrowRight size={18} />
    </a>
  ) : (
    <div className="rounded-xl border border-[#fde68a] bg-[#fffbeb] px-6 py-4 text-[13px] text-[#92400e] flex items-center gap-3 w-full">
      <ShieldCheck size={18} className="shrink-0" />
      <span>Telegram onboarding is not configured yet. Ask an administrator to add the official Telegram link.</span>
    </div>
  );

  return (
    <div className="min-h-full bg-gradient-to-b from-[#f0fdf4] to-[#f8fafc]">
      <div className="max-w-lg mx-auto px-6 py-12 flex flex-col items-center text-center gap-8">
        <div className="w-16 h-16 rounded-2xl bg-[#006e2f] flex items-center justify-center shadow-lg shadow-[#006e2f]/20">
          <MessageCircle size={32} className="text-white" />
        </div>

        <div>
          <h1 className="text-[26px] font-bold text-[#0b1c30]">Vendor Onboarding</h1>
          <p className="text-[14px] text-[#64748b] mt-2 leading-relaxed">
            {config?.message || "Connect your vendor account to Telegram for onboarding help, account verification, and vendor updates."}
          </p>
        </div>

        {body}

        <div className="w-full bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
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
                    <p className="text-[13px] font-medium text-[#0b1c30]">{label}</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#94a3b8] shrink-0">Step {i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
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

        <p className="text-[11px] text-[#94a3b8]">
          Questions? Use the official Telegram channel configured by PathEats.
        </p>
      </div>
    </div>
  );
}
