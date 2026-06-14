import { Search } from "lucide-react";

interface Props {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}

export function SearchBar({ placeholder = "Search…", value, onChange }: Props) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white w-[260px] text-[#374151] placeholder:text-[#94a3b8]"
      />
    </div>
  );
}
