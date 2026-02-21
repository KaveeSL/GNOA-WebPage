"use client";
import { AlertTriangleIcon, XIcon } from "lucide-react";
import { useEffect } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning'
}: ConfirmDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-500',
          button: 'bg-red-500 hover:bg-red-600',
          title: 'text-red-800'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-500',
          button: 'bg-yellow-500 hover:bg-yellow-600',
          title: 'text-yellow-800'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-500',
          button: 'bg-blue-500 hover:bg-blue-600',
          title: 'text-blue-800'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className={`${colors.bg} ${colors.border} border-2 rounded-xl shadow-2xl max-w-md w-full p-6 animate-[slideUp_0.3s_ease-out]`}>
        <div className="flex items-start gap-4 mb-4">
          <div className={`flex-shrink-0 ${colors.icon}`}>
            <AlertTriangleIcon size={32} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-bold mb-2 ${colors.title}`}>
              {title}
            </h3>
            <p className="text-gray-700 text-sm">
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="flex-shrink-0 hover:opacity-70 transition-opacity text-gray-500"
          >
            <XIcon size={20} />
          </button>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 text-sm font-semibold transition-all duration-300 hover:bg-gray-100"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 ${colors.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
