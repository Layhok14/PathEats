import { Check, X } from "lucide-react";
import { evaluatePassword, isStrongPassword, passwordRequirements } from "../utils/passwordPolicy";

export function PasswordRequirementChecklist({ password, className = "" }: { password: string; className?: string }) {
  const results = evaluatePassword(password);
  const strong = isStrongPassword(password);

  return (
    <div className={`mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 ${className}`} aria-live="polite">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-600">Password strength</span>
        <span data-testid="password-strength" className={strong ? "text-emerald-700" : "text-red-600"}>
          {strong ? "Strong" : "Weak"}
        </span>
      </div>
      <ul className="grid gap-1 text-[11px] sm:grid-cols-2">
        {passwordRequirements.map(({ key, label }) => {
          const met = results[key];
          const color = met ? "text-emerald-700" : password ? "text-red-600" : "text-slate-400";
          return (
            <li key={key} data-requirement={key} data-met={met} className={`flex items-center gap-1.5 ${color}`}>
              {met ? <Check size={13} aria-hidden="true" /> : <X size={13} aria-hidden="true" />}
              <span>{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
