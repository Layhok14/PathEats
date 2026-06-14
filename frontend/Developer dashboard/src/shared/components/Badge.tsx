interface Props {
  label: string;
  variant?: "green" | "blue" | "amber" | "red" | "gray" | "purple";
}

const styles: Record<string, string> = {
  green: "bg-[#dcfce7] text-[#166534]",
  blue: "bg-[#dbeafe] text-[#1e40af]",
  amber: "bg-[#fef3c7] text-[#92400e]",
  red: "bg-[#fee2e2] text-[#991b1b]",
  gray: "bg-[#f1f5f9] text-[#475569]",
  purple: "bg-[#ede9fe] text-[#5b21b6]",
};

export function Badge({ label, variant = "gray" }: Props) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${styles[variant]}`}>
      {label}
    </span>
  );
}
