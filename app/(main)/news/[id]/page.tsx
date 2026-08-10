"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  NewspaperIcon,
  XIcon,
} from "lucide-react";
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
    month: "long",
    day: "numeric",
  });
}

export default function NewsDetailPage() {
  const params = useParams<{ id: string }>();
  const { language } = useLanguage();
  const t = translations[language].news;
  const [item, setItem] = useState<INewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/news/${params.id}`);
        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }
        const data = await res.json();
        if (!cancelled && data?.id) setItem(data);
        else if (!cancelled) setNotFound(true);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (!item?.images?.length) return;
      if (e.key === "ArrowRight") {
        setLightboxIndex((i) => (i === null ? 0 : (i + 1) % item.images.length));
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((i) =>
          i === null ? 0 : (i - 1 + item.images.length) % item.images.length
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, item]);

  const cover = item?.images?.[0]?.image;
  const gallery = item?.images || [];

  return (
    <main className="min-h-screen bg-white">
      <PageTopSpacer>
        <div className="max-w-4xl mx-auto">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#762727] mb-8 rounded-full border-2 border-[#762727]/25 bg-[#fffaf8] px-4 py-2 hover:bg-[#762727] hover:text-white hover:border-[#762727] transition-colors cursor-pointer"
          >
            <ArrowLeftIcon size={16} />
            {t.backToNews}
          </Link>

          {loading ? (
            <p className="text-center text-gray-500 py-24">{t.loading}</p>
          ) : notFound || !item ? (
            <div className="text-center py-24">
              <NewspaperIcon className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-600 mb-6">{t.notFound}</p>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-[#762727] hover:bg-[#5f1f1f] transition-colors"
              >
                <ArrowLeftIcon size={14} />
                {t.backToNews}
              </Link>
            </div>
          ) : (
            <article>
              <header className="mb-8 md:mb-10">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-4 text-[#762727]">
                  <CalendarDaysIcon size={14} />
                  {formatDate(item.published_at || item.created_at, language)}
                </p>
                <h1 className="font-urbanist text-3xl md:text-5xl font-bold leading-tight text-gray-900">
                  {item.title}
                </h1>
                {item.summary && (
                  <p className="mt-4 text-base md:text-lg text-zinc-500 leading-relaxed max-w-2xl">
                    {item.summary}
                  </p>
                )}
              </header>

              {cover && (
                <button
                  type="button"
                  onClick={() => setLightboxIndex(0)}
                  className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 mb-8 md:mb-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#762727]"
                >
                  <img
                    src={resolveImageUrl(cover)}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              )}

              <div className="prose-news text-base md:text-[1.05rem] leading-8 text-gray-700 whitespace-pre-wrap">
                {item.content}
              </div>

              {gallery.length > 1 && (
                <div className="mt-12 md:mt-16">
                  <h2 className="font-urbanist text-xl font-semibold mb-5 text-[#762727]">
                    {t.gallery}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {gallery.map((img, index) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setLightboxIndex(index)}
                        className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#762727]"
                      >
                        <img
                          src={resolveImageUrl(img.image)}
                          alt=""
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-14 pt-8 border-t border-gray-200 flex flex-col sm:flex-row flex-wrap gap-3">
                <Link
                  href="/news"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#762727] px-5 py-2.5 text-sm font-semibold text-[#762727] bg-white hover:bg-[#762727] hover:text-white transition-colors"
                >
                  <ArrowLeftIcon size={14} />
                  {t.backToNews}
                </Link>
                <a
                  href="/#news"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-[#762727] hover:bg-[#5f1f1f] transition-colors"
                >
                  {t.backHome}
                </a>
              </div>
            </article>
          )}
        </div>
      </PageTopSpacer>

      {lightboxIndex !== null && gallery[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[200] bg-black/92 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
          >
            <XIcon size={22} />
          </button>
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-3 md:left-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(
                    (lightboxIndex - 1 + gallery.length) % gallery.length
                  );
                }}
              >
                <ChevronLeftIcon size={24} />
              </button>
              <button
                type="button"
                className="absolute right-3 md:right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % gallery.length);
                }}
              >
                <ChevronRightIcon size={24} />
              </button>
            </>
          )}
          <img
            src={resolveImageUrl(gallery[lightboxIndex].image)}
            alt=""
            className="max-h-[85vh] max-w-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}
