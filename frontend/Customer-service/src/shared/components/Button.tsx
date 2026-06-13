import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md";
  children: ReactNode;
  icon?: ReactNode;
}

export function Button({ variant = "primary", size = "md", children, icon, className = "", ...rest }: Props) {
  const base = "inline-flex items-center gap-2 font-medium rounded-lg transition-all focus:outline-none cursor-pointer disabled:opacity-50";

  const sizes = {
    sm: "px-3 py-1.5 text-[12px]",
    md: "px-4 py-2 text-[13px]",
  };

  const variants = {
    primary: "bg-[#006e2f] text-white hover:bg-[#005a26] shadow-sm",
    outline: "border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 shadow-sm",
    ghost: "text-[#374151] hover:bg-gray-100",
    danger: "border border-[#ef4444] text-[#ef4444] bg-white hover:bg-red-50",
  };

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
