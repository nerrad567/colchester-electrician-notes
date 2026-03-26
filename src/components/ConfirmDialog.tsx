"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export function ConfirmDialog({
  open,
  title,
  message,
  advice,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  advice?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const colors = {
    danger: {
      icon: "text-red-400",
      iconBg: "bg-red-400/10",
      border: "border-red-400/20",
      btn: "bg-red-500 hover:bg-red-400 text-white",
      glow: "rgba(239, 68, 68, 0.08)",
    },
    warning: {
      icon: "text-amber-400",
      iconBg: "bg-amber-400/10",
      border: "border-amber-400/20",
      btn: "bg-amber-500 hover:bg-amber-400 text-on-accent",
      glow: "rgba(251, 191, 36, 0.08)",
    },
  };
  const c = colors[variant];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`relative w-full max-w-md rounded-2xl border ${c.border} bg-panel p-0 shadow-[var(--shadow-lg)]`}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow accent at top */}
              <div
                className="absolute -top-px left-4 right-4 h-px rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${c.glow.replace("0.08", "0.5")}, transparent)` }}
              />

              {/* Close button */}
              <button
                onClick={onCancel}
                className="absolute right-4 top-4 rounded-lg p-1 text-muted transition-colors hover:bg-panel-soft hover:text-text"
              >
                <X size={16} />
              </button>

              {/* Content */}
              <div className="p-8">
                {/* Icon */}
                <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${c.iconBg}`}>
                  <AlertTriangle className={`h-7 w-7 ${c.icon}`} />
                </div>

                {/* Title */}
                <h2 className="mb-2 text-center text-lg font-bold text-text">
                  {title}
                </h2>

                {/* Message */}
                <p className="mb-4 text-center text-[0.88rem] leading-relaxed text-muted">
                  {message}
                </p>

                {/* Advice box */}
                {advice && (
                  <div className={`mb-6 rounded-lg border ${c.border} p-4`} style={{ backgroundColor: c.glow }}>
                    <p className="text-[0.82rem] leading-relaxed text-muted-strong">
                      {advice}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onCancel}
                    className="flex-1 rounded-lg border border-border px-4 py-2.5 text-[0.84rem] font-medium text-muted transition-colors hover:border-accent-border hover:text-text"
                  >
                    {cancelLabel}
                  </button>
                  <button
                    onClick={onConfirm}
                    className={`flex-1 rounded-lg px-4 py-2.5 text-[0.84rem] font-semibold transition-all hover:-translate-y-px ${c.btn}`}
                  >
                    {confirmLabel}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
