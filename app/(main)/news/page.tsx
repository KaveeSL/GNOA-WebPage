"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, CalendarDaysIcon, NewspaperIcon } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/i18n";
import { resolveImageUrl } from "@/lib/image-url";
import PageTopSpacer from "@/components/page-top-spacer";
import type { INewsItem } from "@/types";

function formatDate(value: string | null | undefined, language: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const locale = language === "si" ? "si-LK" : language === "ta" ? "ta-LK" : "en-LK";
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function NewsIndexPage() {
  const { language } = useLanguage();
  const t = translations[language].news;
  const [items, setItems] = useState<INewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) setItems(data);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <PageTopSpacer>
        <div className="max-w-5xl mx-auto">
          <a
            href="/#news"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#762727] transition-colors mb-8"
          >
            <ArrowLeftIcon size={16} />
            {t.backHome}
          </a>

          <div className="mb-10 md:mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#762727" }}>
              GNOA
            </p>
            <h1 className="font-urbanist text-3xl md:text-5xl font-bold text-gray-900">
              {t.title}
            </h1>
            <p className="mt-3 text-zinc-500 max-w-2xl">{t.subtitle}</p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500 py-16">{t.loading}</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500 py-16">{t.empty}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {items.map((item) => {
                const cover = item.images?.[0]?.image;
                return (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-[0_10px_40px_rgba(118,39,39,0.1)] transition-shadow"
                  >
                    <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                      {cover ? (
                        <img
                          src={resolveImageUrl(cover)}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#762727]/25">
                          <NewspaperIcon size={40} />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "#762727" }}>
                        <CalendarDaysIcon size={12} />
                        {formatDate(item.published_at || item.created_at, language)}
                      </p>
                      <h2 className="font-semibold text-lg text-gray-900 group-hover:text-[#762727] transition-colors line-clamp-2">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                        {item.summary || item.content}
                      </p>
                      <span className="mt-4 inline-block text-sm font-semibold" style={{ color: "#762727" }}>
                        {t.readMore} →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </PageTopSpacer>
    </main>
  );
}
