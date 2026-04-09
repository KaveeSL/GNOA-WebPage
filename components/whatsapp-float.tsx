"use client";

import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/i18n";
import { WHATSAPP_HREF } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/whatsapp-icon";

const HINT_SESSION_KEY = "gnoa_whatsapp_hint_seen";

export default function WhatsAppFloat() {
  const { language } = useLanguage();
  const [showHint, setShowHint] = useState(false);
  const t = translations[language].whatsappFloat;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem(HINT_SESSION_KEY);
    if (!seen) {
      setShowHint(true);
      const hide = window.setTimeout(() => {
        setShowHint(false);
        sessionStorage.setItem(HINT_SESSION_KEY, "1");
      }, 8000);
      return () => window.clearTimeout(hide);
    }
  }, []);

  const openHint = useCallback(() => {
    setShowHint(true);
    window.setTimeout(() => setShowHint(false), 5000);
  }, []);

  return (
    <div
      className="fixed bottom-5 right-4 z-[107] flex flex-col items-end gap-2 md:bottom-8 md:right-8"
      aria-live="polite"
    >
      <div
        className={`relative max-w-[min(16rem,calc(100vw-5rem))] rounded-2xl border border-[#762727]/15 bg-white px-3.5 py-2.5 text-xs leading-snug text-gray-800 shadow-lg shadow-[#762727]/10 transition-all duration-500 md:text-sm ${
          showHint
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-1 opacity-0"
        }`}
      >
        <p className="font-medium" style={{ color: "#762727" }}>
          {t.hintTitle}
        </p>
        <p className="mt-0.5 text-gray-600">{t.hintBody}</p>
        <span
          className="pointer-events-none absolute -bottom-1.5 right-5 h-2.5 w-2.5 rotate-45 border-b border-r border-[#762727]/15 bg-white"
          aria-hidden
        />
      </div>

      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => {
          if (!sessionStorage.getItem(HINT_SESSION_KEY)) return;
          openHint();
        }}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-900/25 ring-2 ring-white/30 transition-transform duration-300 hover:scale-105 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] md:h-[3.75rem] md:w-[3.75rem]"
        aria-label={t.chatAria}
        title={t.chatAria}
      >
        <WhatsAppIcon size={30} className="transition-transform group-hover:scale-105 md:w-8 md:h-8" />
      </a>
    </div>
  );
}
