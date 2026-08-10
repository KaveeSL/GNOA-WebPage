"use client";

import {
  AlertTriangleIcon,
  InfoIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useEffect } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "warning",
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const meta =
    type === "danger"
      ? {
          icon: Trash2Icon,
          iconWrap: "bg-red-50 text-red-600",
          confirmBtn: "bg-red-600 hover:bg-red-700 focus-visible:outline-red-600",
        }
      : type === "info"
        ? {
            icon: InfoIcon,
            iconWrap: "bg-[#762727]/10 text-[#762727]",
            confirmBtn:
              "bg-[#762727] hover:bg-[#5f1f1f] focus-visible:outline-[#762727]",
          }
        : {
            icon: AlertTriangleIcon,
            iconWrap: "bg-amber-50 text-amber-600",
            confirmBtn:
              "bg-[#762727] hover:bg-[#5f1f1f] focus-visible:outline-[#762727]",
          };

  const Icon = meta.icon;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px] animate-[fadeIn_0.2s_ease-out]"
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[#762727]/15 bg-white shadow-[0_20px_60px_rgba(118,39,39,0.18)] animate-[dialogIn_0.28s_ease-out]"
      >
        <div className="h-1 w-full bg-[#762727]" />
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${meta.iconWrap}`}
            >
              <Icon size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                id="confirm-dialog-title"
                className="font-urbanist text-lg font-bold text-gray-900 leading-snug"
              >
                {title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {message}
              </p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >
              <XIcon size={18} />
            </button>
          </div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-full border-2 border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${meta.confirmBtn}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
