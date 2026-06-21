
import { useState } from "react";

interface Props {
  actionLabel?: string;
  secondActionLabel?: string;
  onAction?: () => void;
  onSecondAction?: () => void;
  searchPlaceholder?: string;
}

export function TopBar({
  actionLabel = "",
  secondActionLabel,
  onAction,
  onSecondAction,
  searchPlaceholder = "Search system logs, users, or restaurants…"
}: Props) {
  const [query, setQuery] = useState("");

  return (
    <div className="h-16 bg-[#f8f9ff] border-b border-[#e2e8f0] flex items-center justify-between px-8 gap-4 shrink-0 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sticky top-0 z-10">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white w-[260px] text-[#374151] placeholder:text-[#94a3b8]"
        />
      </div>
      <div className="flex items-center gap-3 ml-auto">
        {secondActionLabel && (
          <button
            onClick={onSecondAction}
            className="inline-flex items-center gap-2 font-medium rounded-lg transition-all bg-[#006e2f] text-white hover:bg-[#005a26] shadow-sm px-4 py-2 text-[13px]"
          >
            {secondActionLabel}
          </button>
        )}

        {actionLabel && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 font-medium rounded-lg transition-all bg-[#006e2f] text-white hover:bg-[#005a26] shadow-sm px-4 py-2 text-[13px]"
          >
            {actionLabel}
          </button>
        )}
        <div className="flex items-center gap-2 pl-2 border-l border-[#e2e8f0]">
          <div className="text-right">
            <p className="text-[12px] font-semibold text-[#0b1c30]">Alex Rivera</p>
            <p className="text-[11px] text-[#64748b]">Admin</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#006e2f] flex items-center justify-center text-white text-[13px] font-bold shrink-0">AR</div>
        </div>
      </div>
    </div>
  );
}
