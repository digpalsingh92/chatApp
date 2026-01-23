"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  closable?: boolean;
}

interface ToastContextValue {
  toasts: Toast[];
  create: (toast: Omit<Toast, "id">) => void;
  remove: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const create = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { ...toast, id }]);

    if (toast.duration) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration);
    }
  }, []);

  const remove = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  React.useEffect(() => {
    toaster.setCreateFn(create);
  }, [create]);

  return (
    <ToastContext.Provider value={{ toasts, create, remove }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) => {
  return (
    <div className="fixed top-4 left-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "relative min-w-[300px] rounded-lg border p-4 shadow-lg",
            toast.type === "success" && "border-green-200 bg-green-50",
            toast.type === "error" && "border-red-200 bg-red-50",
            toast.type === "warning" && "border-yellow-200 bg-yellow-50",
            (!toast.type || toast.type === "info") && "border-blue-200 bg-blue-50"
          )}
        >
          {toast.title && (
            <div className="font-semibold text-gray-900 mb-1">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm text-gray-700">{toast.description}</div>
          )}
          {toast.closable && (
            <button
              onClick={() => onRemove(toast.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

// Singleton toaster for backward compatibility
class ToasterSingleton {
  private createFn: ((toast: Omit<Toast, "id">) => void) | null = null;

  setCreateFn(fn: (toast: Omit<Toast, "id">) => void) {
    this.createFn = fn;
  }

  create(toast: Omit<Toast, "id">) {
    if (this.createFn) {
      this.createFn(toast);
    } else {
      console.warn("ToastProvider not found. Please wrap your app with ToastProvider.");
    }
  }
}

export const toaster = new ToasterSingleton();
