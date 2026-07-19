import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

const variantStyles = {
  danger: {
    icon: "text-rose-500",
    button: "bg-rose-500 hover:bg-rose-600 text-white",
    bg: "bg-rose-50"
  },
  warning: {
    icon: "text-peach",
    button: "bg-peach hover:bg-peach/90 text-white",
    bg: "bg-peach/10"
  },
  info: {
    icon: "text-blue-500",
    button: "bg-brand-green hover:bg-brand-green/90 text-white",
    bg: "bg-brand-green/10"
  }
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  variant = "danger"
}: ConfirmDialogProps) {
  const styles = variantStyles[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6">
        <div className={`w-14 h-14 ${styles.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <AlertTriangle size={28} className={styles.icon} />
        </div>

        <h3 className="font-display font-bold text-lg text-green-dark text-center mb-2">
          {title}
        </h3>
        <p className="text-sm text-ink/70 text-center mb-6">
          {message}
        </p>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 ${styles.button}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}