interface Props {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: Props) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-[44px] h-[24px] rounded-full transition-colors ${checked ? "bg-[#006e2f]" : "bg-[#d1d5db]"}`}
      >
        <span
          className={`absolute top-[2px] left-[2px] w-[20px] h-[20px] bg-white rounded-full shadow transition-transform ${checked ? "translate-x-[20px]" : "translate-x-0"}`}
        />
      </div>
      {label && <span className="text-[13px] text-[#374151]">{label}</span>}
    </label>
  );
}
