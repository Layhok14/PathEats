import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../app/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
}

const variantStyles: Record<string, { bg: string; hover: string }> = {
  danger: { bg: "#d4183d", hover: "#b01233" },
  warning: { bg: "#f59e0b", hover: "#d97706" },
  info: { bg: "#6366f1", hover: "#4f46e5" },
};

export function ConfirmDialog({
  open,
  title,
  description,
  itemName,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const styles = variantStyles[variant];

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "Poppins, sans-serif", color: "#0b1c30" }}>
            {title}
          </DialogTitle>
          <DialogDescription style={{ fontFamily: "Poppins, sans-serif" }}>
            {description}
            {itemName && (
              <>
                <br />
                <strong style={{ color: "#0b1c30" }}>{itemName}</strong>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            onClick={onCancel}
            style={{
              padding: "10px 20px",
              borderRadius: "6px",
              border: "1px solid var(--brand-card-border)",
              background: "var(--card)",
              fontFamily: "Poppins, sans-serif",
              fontSize: "13px",
              cursor: "pointer",
              color: "#374151",
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              background: styles.bg,
              color: "white",
              fontFamily: "Poppins, sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = styles.hover)}
            onMouseOut={(e) => (e.currentTarget.style.background = styles.bg)}
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
