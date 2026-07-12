import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

interface SuccessModalProps {
  message: string;
  onContinue: () => void;
  onGoBack: () => void;
  backLabel?: string;
  continueLabel?: string;
}

export function SuccessModal({ message, onContinue, onGoBack, backLabel = "Go Back", continueLabel = "Continue" }: SuccessModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const continueBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const prev = document.activeElement as HTMLElement | null;
    continueBtnRef.current?.focus();
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onContinue();
      if (e.key === "Tab") {
        const focusable = el.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      prev?.focus();
    };
  }, [onContinue]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Success"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onContinue}
    >
      <div
        className="w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden p-6 text-center"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === "Escape" && onContinue()}
      >
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
          <Check size={24} className="text-[#006e2f]" />
        </div>
        <h3 className="text-[16px] font-bold text-[#0b1c30] mb-2">Success!</h3>
        <p className="text-[13px] text-[#64748b] mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            ref={continueBtnRef}
            onClick={onContinue}
            className="flex-1 px-4 py-2 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50 transition-colors"
          >
            {continueLabel}
          </button>
          <button
            onClick={onGoBack}
            className="flex-1 px-4 py-2 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] transition-colors"
          >
            {backLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
