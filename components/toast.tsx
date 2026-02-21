"use client";
import { XIcon, CheckCircleIcon, AlertCircleIcon, InfoIcon, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastId = 0;
const toastListeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

const notify = (message: string, type: ToastType = 'info') => {
  const id = `toast-${toastId++}`;
  const newToast: Toast = { id, message, type };
  toasts = [...toasts, newToast];
  toastListeners.forEach(listener => listener(toasts));
  
  setTimeout(() => {
    removeToast(id);
  }, 5000);
};

const removeToast = (id: string) => {
  toasts = toasts.filter(t => t.id !== id);
  toastListeners.forEach(listener => listener(toasts));
};

export const toast = {
  success: (message: string) => notify(message, 'success'),
  error: (message: string) => notify(message, 'error'),
  info: (message: string) => notify(message, 'info'),
  warning: (message: string) => notify(message, 'warning'),
};

export default function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setCurrentToasts(newToasts);
    };
    toastListeners.push(listener);
    setCurrentToasts(toasts);

    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) {
        toastListeners.splice(index, 1);
      }
    };
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon size={20} className="text-green-500" />;
      case 'error':
        return <XCircleIcon size={20} className="text-red-500" />;
      case 'warning':
        return <AlertCircleIcon size={20} className="text-yellow-500" />;
      default:
        return <InfoIcon size={20} className="text-blue-500" />;
    }
  };

  const getBgColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-md">
      {currentToasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getBgColor(toast.type)} border-2 rounded-lg shadow-lg p-4 flex items-start gap-3 animate-[slideIn_0.3s_ease-out] min-w-[300px]`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(toast.type)}
          </div>
          <div className="flex-1 text-sm font-medium">
            {toast.message}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <XIcon size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
