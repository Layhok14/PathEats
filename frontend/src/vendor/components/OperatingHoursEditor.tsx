import type { OperatingSchedule } from "../../shared/types";

interface OperatingHoursEditorProps {
  value: OperatingSchedule;
  onChange: (schedule: OperatingSchedule) => void;
}

const inputStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  background: "var(--input-background)",
  color: "var(--foreground)",
  borderRadius: "var(--radius)",
  padding: "0.375rem 0.625rem",
  fontSize: "0.875rem",
  fontFamily: "var(--font-sans, Poppins, sans-serif)",
  outline: "none",
  width: "100%",
};

interface HoursRowProps {
  label: string;
  open: string;
  close: string;
  onOpenChange: (v: string) => void;
  onCloseChange: (v: string) => void;
}

function HoursRow({ label, open, close, onOpenChange, onCloseChange }: HoursRowProps) {
  return (
    <div className="flex items-center gap-4">
      <span
        className="w-28 text-sm shrink-0"
        style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-sans, Poppins, sans-serif)" }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2 flex-1">
        <input
          type="time"
          value={to24h(open)}
          onChange={(e) => onOpenChange(to12h(e.target.value))}
          style={inputStyle}
          aria-label={`${label} opening time`}
        />
        <span style={{ color: "var(--muted-foreground)" }}>–</span>
        <input
          type="time"
          value={to24h(close)}
          onChange={(e) => onCloseChange(to12h(e.target.value))}
          style={inputStyle}
          aria-label={`${label} closing time`}
        />
      </div>
    </div>
  );
}

// Helpers to convert between "09:00 AM" display format and "HH:MM" input value
function to24h(time12: string): string {
  const match = time12.match(/(\d+):(\d+)\s?(AM|PM)/i);
  if (!match) return "09:00";
  let [, h, m, period] = match;
  let hours = parseInt(h);
  if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${m}`;
}

function to12h(time24: string): string {
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr);
  const period = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${String(h).padStart(2, "0")}:${mStr} ${period}`;
}

export function OperatingHoursEditor({ value, onChange }: OperatingHoursEditorProps) {
  return (
    <div className="flex flex-col gap-4">
      <HoursRow
        label="Mon – Fri"
        open={value.weekdays.open}
        close={value.weekdays.close}
        onOpenChange={(v) => onChange({ ...value, weekdays: { ...value.weekdays, open: v } })}
        onCloseChange={(v) => onChange({ ...value, weekdays: { ...value.weekdays, close: v } })}
      />
      <HoursRow
        label="Sat – Sun"
        open={value.weekends.open}
        close={value.weekends.close}
        onOpenChange={(v) => onChange({ ...value, weekends: { ...value.weekends, open: v } })}
        onCloseChange={(v) => onChange({ ...value, weekends: { ...value.weekends, close: v } })}
      />
    </div>
  );
}
