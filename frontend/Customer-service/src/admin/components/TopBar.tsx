import { Bell, HelpCircle } from "lucide-react";
import { SearchBar } from "../../shared/components/SearchBar";
import { Button } from "../../shared/components/Button";
import { useState } from "react";

interface Props {
  actionLabel?: string;
  onAction?: () => void;
  searchPlaceholder?: string;
}

export function TopBar({ actionLabel = "+ Add Vendor", onAction, searchPlaceholder = "Search system logs, users, or restaurants…" }: Props) {
  const [query, setQuery] = useState("");

  return (
    <div className="h-16 bg-[#f8f9ff] border-b border-[#e2e8f0] flex items-center justify-between px-8 gap-4 shrink-0 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sticky top-0 z-10">
      <SearchBar placeholder={searchPlaceholder} value={query} onChange={setQuery} />
      <div className="flex items-center gap-3 ml-auto">
        <button className="relative p-2 rounded-lg text-[#64748b] hover:bg-gray-100 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button className="p-2 rounded-lg text-[#64748b] hover:bg-gray-100 transition-colors">
          <HelpCircle size={18} />
        </button>
        {actionLabel && (
          <Button onClick={onAction} size="md">
            {actionLabel}
          </Button>
        )}
        <div className="flex items-center gap-2 pl-2 border-l border-[#e2e8f0]">
          <div className="text-right">
            <p className="text-[12px] font-semibold text-[#0b1c30]">Alex Rivera</p>
            <p className="text-[11px] text-[#64748b]">Admin</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#006e2f] flex items-center justify-center text-white text-[13px] font-bold shrink-0">
            AR
          </div>
        </div>
      </div>
    </div>
  );
}
