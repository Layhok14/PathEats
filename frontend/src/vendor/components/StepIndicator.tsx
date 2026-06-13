import { Check } from "lucide-react";

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number; // 0-indexed
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, index) => {
        const done = index < currentStep;
        const active = index === currentStep;

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
                style={{
                  background: done || active ? "var(--primary)" : "var(--muted)",
                  color: done || active ? "var(--primary-foreground)" : "var(--muted-foreground)",
                  fontFamily: "var(--font-sans, Poppins, sans-serif)",
                }}
              >
                {done ? <Check size={14} strokeWidth={2.5} /> : index + 1}
              </div>
              <span
                className="text-xs whitespace-nowrap"
                style={{
                  color: active ? "var(--foreground)" : "var(--muted-foreground)",
                  fontFamily: "var(--font-sans, Poppins, sans-serif)",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div
                className="h-px flex-1 mx-2 mt-[-1rem] transition-colors"
                style={{ background: index < currentStep ? "var(--primary)" : "var(--border)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
