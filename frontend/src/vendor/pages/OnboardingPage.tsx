import { useEffect, useState } from "react";
import {
  ExternalLink, MessageCircle, ShieldCheck, Loader,
  ArrowRight, Smartphone, Bell, UserCheck
} from "lucide-react";
import { toast } from "sonner";
import api from "../../shared/services/axiosService";

interface OnboardingData {
  telegram_link: string;
  message: string;
}

const steps = [
  { icon: MessageCircle, label: "Tap the button to open Telegram" },
  { icon: UserCheck, label: "Bot guides your verification" },
  { icon: Smartphone, label: "Account linked automatically" },
  { icon: Bell, label: "Get real-time notifications" },
];

export function OnboardingPage() {
  const [config, setConfig] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/vendor/onboarding").then((r) => {
      setConfig(r.data.data);
    }).catch(() => {
      toast.error("Could not load onboarding config");
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

  const hasTelegram = !!config?.telegram_link;

  return (
    <div className="min-h-full bg-gradient-to-b from-[#f0fdf4] to-[#f8fafc]">
      <div className="max-w-lg mx-auto px-6 py-12 flex flex-col items-center text-center gap-8">
        <div className="w-16 h-16 rounded-2xl bg-[#006e2f] flex items-center justify-center shadow-lg shadow-[#006e2f]/20">
          <MessageCircle size={32} className="text-white" />
        </div>

        <div>
          <h1 className="text-[26px] font-bold text-[#0b1c30]">Vendor Onboarding</h1>
          <p className="text-[14px] text-[#64748b] mt-2 leading-relaxed">
            {config?.message || "Connect your vendor account to Telegram for real-time notifications, support, and verification."}
          </p>
        </div>

        {hasTelegram ? (
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
            <span>Telegram onboarding not yet available. Check back later or contact support.</span>
          </div>
        )}

        <div className="w-full bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
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

        <div className="w-full bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
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
  );
}
