"use client";

import {
  XIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  InfoIcon,
  XCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastId = 0;
const toastListeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

const notify = (message: string, type: ToastType = "info") => {
  const id = `toast-${toastId++}`;
  toasts = [...toasts, { id, message, type }];
  toastListeners.forEach((listener) => listener(toasts));

  setTimeout(() => {
    removeToast(id);
  }, 4500);
};

const removeToast = (id: string) => {
  toasts = toasts.filter((t) => t.id !== id);
  toastListeners.forEach((listener) => listener(toasts));
};

export const toast = {
  success: (message: string) => notify(message, "success"),
  error: (message: string) => notify(message, "error"),
  info: (message: string) => notify(message, "info"),
  warning: (message: string) => notify(message, "warning"),
};

const styles: Record<
  ToastType,
  {
    card: string;
    iconWrap: string;
    icon: string;
    bar: string;
    label: string;
    labelClass: string;
  }
> = {
  success: {
    card: "border-emerald-200 bg-emerald-50 shadow-[0_12px_40px_rgba(16,185,129,0.18)]",
    iconWrap: "bg-emerald-100 text-emerald-800",
    icon: "text-emerald-700",
    bar: "bg-emerald-600",
    label: "Success",
    labelClass: "text-emerald-800",
  },
  error: {
    card: "border-red-200 bg-red-50 shadow-[0_12px_40px_rgba(239,68,68,0.18)]",
    iconWrap: "bg-red-100 text-red-800",
    icon: "text-red-700",
    bar: "bg-red-600",
    label: "Error",
    labelClass: "text-red-800",
  },
  warning: {
    card: "border-amber-200 bg-amber-50 shadow-[0_12px_40px_rgba(245,158,11,0.2)]",
    iconWrap: "bg-amber-100 text-amber-900",
    icon: "text-amber-700",
    bar: "bg-amber-500",
    label: "Notice",
    labelClass: "text-amber-900",
  },
  info: {
    card: "border-sky-200 bg-sky-50 shadow-[0_12px_40px_rgba(14,165,233,0.18)]",
    iconWrap: "bg-sky-100 text-sky-900",
    icon: "text-sky-700",
    bar: "bg-sky-600",
    label: "Info",
    labelClass: "text-sky-900",
  },
};

function ToastIcon({ type }: { type: ToastType }) {
  const cls = `size-[18px] ${styles[type].icon}`;
  switch (type) {
    case "success":
      return <CheckCircle2Icon className={cls} />;
    case "error":
      return <XCircleIcon className={cls} />;
    case "warning":
      return <AlertTriangleIcon className={cls} />;
    default:
      return <InfoIcon className={cls} />;
  }
}

export default function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setCurrentToasts(newToasts);
    toastListeners.push(listener);
    setCurrentToasts(toasts);
    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) toastListeners.splice(index, 1);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex w-[min(100%-2rem,22rem)] flex-col gap-2.5 pointer-events-none">
      {currentToasts.map((item) => {
        const s = styles[item.type];
        return (
          <div
            key={item.id}
            className={`pointer-events-auto relative overflow-hidden rounded-2xl border ${s.card} animate-[toastIn_0.35s_ease-out]`}
            role="status"
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${s.bar}`} />
            <div className="flex items-start gap-3 p-3.5 pl-4">
              <div
                className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${s.iconWrap}`}
              >
                <ToastIcon type={item.type} />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.12em] ${s.labelClass}`}
                >
                  {s.label}
                </p>
                <p className="mt-0.5 text-sm font-medium leading-snug text-gray-900">
                  {item.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(item.id)}
                className="flex-shrink-0 rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-black/5 hover:text-gray-800"
                aria-label="Dismiss"
              >
                <XIcon size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
