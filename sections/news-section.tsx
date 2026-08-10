"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CalendarDaysIcon, NewspaperIcon } from "lucide-react";
import SectionTitle from "@/components/section-title";
import AnimatedContent from "@/components/animated-content";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/i18n";
import { resolveImageUrl } from "@/lib/image-url";
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

function SideCard({
  item,
  language,
  readMore,
}: {
  item: INewsItem;
  language: string;
  readMore: string;
}) {
  const cover = item.images?.[0]?.image;
  const blurb = (item.summary || item.content || "").trim();

  return (
    <Link
      href={`/news/${item.id}`}
      className="group flex h-full max-h-[148px] sm:max-h-none min-h-[112px] sm:min-h-[124px] gap-3 sm:gap-4 overflow-hidden rounded-2xl border-2 border-[#762727]/15 bg-[#fffaf8] p-3 sm:p-3.5 shadow-sm transition-all hover:border-[#762727]/40 hover:bg-white hover:shadow-[0_8px_28px_rgba(118,39,39,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#762727]"
    >
      <div className="relative w-[80px] sm:w-[100px] aspect-square rounded-xl overflow-hidden bg-[#762727]/10 flex-shrink-0 ring-1 ring-[#762727]/10 self-start">
        {cover ? (
          <img
            src={resolveImageUrl(cover)}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#762727]/40">
            <NewspaperIcon size={24} />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 flex flex-col justify-center overflow-hidden py-0.5">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide mb-1 text-[#762727]">
          <CalendarDaysIcon size={12} className="flex-shrink-0" />
          <span className="truncate">
            {formatDate(item.published_at || item.created_at, language)}
          </span>
        </p>
        <h4 className="font-urbanist font-bold text-[15px] sm:text-base text-gray-900 leading-snug line-clamp-2 group-hover:text-[#762727] transition-colors">
          {item.title}
        </h4>
        {blurb && (
          <p className="mt-1 text-xs sm:text-sm text-gray-600 line-clamp-1 sm:line-clamp-2 leading-snug break-words">
            {blurb}
          </p>
        )}
        <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#762727] opacity-80 group-hover:opacity-100">
          {readMore}
          <ArrowRightIcon
            size={12}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

export default function NewsSection() {
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

  // Same on mobile + desktop: featured + up to 3 side cards = max 4
  const featured = items[0];
  const rest = items.slice(1, 4);

  return (
    <section id="news" className="px-4 md:px-16 lg:px-24 xl:px-32 border-b border-gray-200">
      <div className="p-4 pt-20 pb-20 md:p-20 md:pb-24 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200">
        <SectionTitle icon={NewspaperIcon} title={t.title} subtitle={t.subtitle} />

        <div className="w-full mt-12 md:mt-16">
          {loading ? (
            <p className="text-center text-gray-500 text-sm py-10">{t.loading}</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-10">{t.empty}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 lg:items-stretch">
                {featured && (
                  <AnimatedContent distance={0} className="h-full">
                    <Link
                      href={`/news/${featured.id}`}
                      className="group flex h-full min-h-[280px] sm:min-h-[340px] lg:min-h-[400px] flex-col overflow-hidden rounded-2xl border-2 border-[#762727]/15 bg-white shadow-[0_8px_30px_rgba(118,39,39,0.08)] transition-shadow hover:shadow-[0_12px_40px_rgba(118,39,39,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#762727]"
                    >
                      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:flex-1 lg:min-h-[200px] bg-[#762727]/10 overflow-hidden">
                        {featured.images?.[0]?.image ? (
                          <img
                            src={resolveImageUrl(featured.images[0].image)}
                            alt={featured.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#762727] to-[#4a1818] text-white/40">
                            <NewspaperIcon size={48} />
                          </div>
                        )}
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#762727] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          {t.featured}
                        </span>
                      </div>
                      <div className="flex flex-col justify-center gap-2 p-5 sm:p-6 lg:p-7 border-t border-[#762727]/10 bg-[#fffaf8] min-w-0">
                        <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#762727]">
                          <CalendarDaysIcon size={13} />
                          {formatDate(
                            featured.published_at || featured.created_at,
                            language
                          )}
                        </p>
                        <h3 className="font-urbanist text-xl sm:text-2xl lg:text-[1.75rem] font-bold leading-snug text-gray-900 line-clamp-2 group-hover:text-[#762727] transition-colors break-words">
                          {featured.title}
                        </h3>
                        {(featured.summary || featured.content) && (
                          <p className="text-sm sm:text-base text-gray-600 line-clamp-2 sm:line-clamp-3 leading-relaxed break-words">
                            {featured.summary || featured.content}
                          </p>
                        )}
                        <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-[#762727]">
                          {t.readMore}
                          <ArrowRightIcon
                            size={14}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </Link>
                  </AnimatedContent>
                )}

                {rest.length > 0 && (
                  <div className="flex flex-col gap-3 sm:gap-4 h-full lg:min-h-[400px]">
                    {rest.map((item, index) => (
                      <AnimatedContent
                        key={item.id}
                        delay={0.03 * (index + 1)}
                        distance={0}
                        className="flex-1 min-h-0"
                      >
                        <div className="h-full min-h-0">
                          <SideCard
                            item={item}
                            language={language}
                            readMore={t.readMore}
                          />
                        </div>
                      </AnimatedContent>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 1 && (
                <div className="mt-5 sm:mt-6 flex justify-center">
                  <Link
                    href="/news"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-[#762727] bg-white px-6 py-3 text-sm font-bold text-[#762727] transition-colors duration-200 hover:bg-[#762727] hover:text-white active:bg-[#5f1f1f] active:text-white"
                  >
                    {t.viewAll}
                    <ArrowRightIcon size={14} />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
