"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "error" | "success" | "warning" | "info";

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

const ToastContext = createContext<{
  toast: (type: ToastType, title: string, message?: string) => void;
}>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

const icons = {
  error: XCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  error: "border-red-400/30 bg-red-400/5",
  success: "border-accent/30 bg-accent/5",
  warning: "border-amber-400/30 bg-amber-400/5",
  info: "border-blue-400/30 bg-blue-400/5",
};

const iconColors = {
  error: "text-red-400",
  success: "text-accent",
  warning: "text-amber-400",
  info: "text-blue-400",
};

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const Icon = icons[t.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={`flex w-[340px] items-start gap-3 rounded-xl border ${styles[t.type]} p-4 shadow-[var(--shadow-sm)] backdrop-blur-md`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColors[t.type]}`} />
      <div className="min-w-0 flex-1">
        <p className="text-[0.84rem] font-medium text-text">{t.title}</p>
        {t.message && (
          <p className="mt-0.5 text-[0.78rem] leading-relaxed text-muted">{t.message}</p>
        )}
      </div>
      <button onClick={onDismiss} className="shrink-0 text-muted hover:text-text transition-colors">
        <X size={14} />
      </button>
    </motion.div>
  );
}
