import type { ReactNode } from "react";

interface Props {
  label: string;
  value: string;
  sub: string;
  subVariant?: "green" | "blue" | "red" | "amber" | "neutral";
  accent?: string;
  icon?: ReactNode;
  topBorderColor?: string;
}

const subColors: Record<string, string> = {
  green: "text-[#22c55e]",
  blue: "text-[#005ac2]",
  red: "text-[#ba1a1a]",
  amber: "text-[#b45309]",
  neutral: "text-[#64748b]",
};

export function MetricCard({ label, value, sub, subVariant = "neutral", accent, icon, topBorderColor }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col">
      {topBorderColor && <div className="h-[4px]" style={{ background: topBorderColor }} />}
      <div className="p-6 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">{label}</p>
          {icon && (
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: accent ? `${accent}1a` : "#f1f5f9" }}>
              <span style={{ color: accent ?? "#64748b" }}>{icon}</span>
            </div>
          )}
        </div>
        <p className="text-[32px] font-bold text-[#0b1c30] leading-none">{value}</p>
        <p className={`text-[12px] font-medium ${subColors[subVariant]}`}>{sub}</p>
      </div>
    </div>
  );
}
