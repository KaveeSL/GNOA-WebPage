"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ImageIcon,
  ImagesIcon,
} from "lucide-react";
import SectionTitle from "@/components/section-title";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/i18n";
import { resolveImageUrl } from "@/lib/image-url";
import type { IPhotoGallery } from "@/types";

const SLIDE_INTERVAL_MS = 5000;

function SessionCollage({
  photos,
  title,
}: {
  photos: { id: number; image: string }[];
  title: string;
}) {
  const a = photos[0];
  const b = photos[1];
  const c = photos[2];

  if (!a) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#762727] to-[#4a1818] text-white/40">
        <ImagesIcon size={36} />
      </div>
    );
  }

  if (!b) {
    return (
      <img
        src={resolveImageUrl(a.image)}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
    );
  }

  if (!c) {
    return (
      <div className="absolute inset-0 grid grid-cols-2 gap-0.5 bg-white">
        <div className="relative overflow-hidden">
          <img
            src={resolveImageUrl(a.image)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <div className="relative overflow-hidden">
          <img
            src={resolveImageUrl(b.image)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 bg-white">
      <div className="relative row-span-2 overflow-hidden">
        <img
          src={resolveImageUrl(a.image)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="relative overflow-hidden">
        <img
          src={resolveImageUrl(b.image)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="relative overflow-hidden">
        <img
          src={resolveImageUrl(c.image)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
    </div>
  );
}

function SessionCard({
  item,
  viewPhotos,
  photoLabel,
  photosLabel,
}: {
  item: IPhotoGallery;
  viewPhotos: string;
  photoLabel: string;
  photosLabel: string;
}) {
  const photos = item.photos ?? [];
  const count = photos.length;
  const preview = photos.slice(0, 3);

  return (
    <Link
      href={`/gallery/${item.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-[#762727]/15 bg-white shadow-[0_6px_22px_rgba(118,39,39,0.07)] transition-shadow hover:shadow-[0_10px_32px_rgba(118,39,39,0.13)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#762727]"
    >
      <div className="relative w-full aspect-[16/10] bg-[#762727]/10 overflow-hidden">
        <SessionCollage photos={preview} title={item.title} />
        <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-black/55 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white">
          <ImagesIcon size={11} />
          {count} {count === 1 ? photoLabel : photosLabel}
        </span>
        {count > 3 && (
          <span className="absolute bottom-2.5 right-2.5 rounded-full bg-[#762727] px-2 py-0.5 text-[10px] font-bold text-white">
            +{count - 3}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5 sm:p-4 border-t border-[#762727]/10 bg-[#fffaf8]">
        <h3 className="font-urbanist font-bold text-base sm:text-lg text-gray-900 leading-snug line-clamp-2 group-hover:text-[#762727] transition-colors">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
        <span className="mt-auto pt-1 inline-flex items-center gap-1 text-xs font-bold text-[#762727]">
          {viewPhotos}
          <ArrowRightIcon
            size={12}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

export default function GallerySection() {
  const { language } = useLanguage();
  const t = translations[language].gallery;
  const [galleries, setGalleries] = useState<IPhotoGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/galleries");
        const data = await res.json();
        if (cancelled) return;
        const sorted = Array.isArray(data)
          ? [...data].sort((a, b) => a.display_order - b.display_order)
          : [];
        setGalleries(sorted);
      } catch {
        if (!cancelled) setGalleries([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Same as Videos: 1 card on mobile, 2 on tablet/desktop
  useEffect(() => {
    const updateVisibleCount = () => {
      if (typeof window === "undefined") return;
      setVisibleCount(window.innerWidth >= 768 ? 2 : 1);
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [visibleCount, galleries.length]);

  const canSlide = galleries.length > visibleCount;
  const maxIndex = Math.max(0, galleries.length - visibleCount);

  useEffect(() => {
    if (paused || !canSlide) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [canSlide, maxIndex, paused]);

  const slidePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const slideNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section
      id="testimonials"
      className="px-4 md:px-16 lg:px-24 xl:px-32 border-b border-gray-200"
    >
      <div className="p-4 pt-20 pb-20 md:p-20 md:pb-24 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200">
        <SectionTitle icon={ImageIcon} title={t.title} subtitle={t.subtitle} />

        <div className="w-full mt-12 md:mt-16">
          {loading ? (
            <p className="text-center text-gray-500 text-sm py-10">{t.loading}</p>
          ) : galleries.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-10">{t.empty}</p>
          ) : (
            <div
              className="w-full max-w-6xl mx-auto relative"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={() => setPaused(true)}
              onTouchEnd={() => setPaused(false)}
            >
              {canSlide && (
                <>
                  <button
                    type="button"
                    onClick={slidePrev}
                    className="absolute left-0 top-[28%] md:top-[32%] -translate-y-1/2 z-10 p-2 md:p-3 rounded-full border-2 bg-white shadow-lg transition-transform duration-200 hover:scale-105 -translate-x-1 md:-translate-x-4"
                    style={{ borderColor: "#762727", color: "#762727" }}
                    aria-label="Previous sessions"
                  >
                    <ChevronLeftIcon size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={slideNext}
                    className="absolute right-0 top-[28%] md:top-[32%] -translate-y-1/2 z-10 p-2 md:p-3 rounded-full border-2 bg-white shadow-lg transition-transform duration-200 hover:scale-105 translate-x-1 md:translate-x-4"
                    style={{ borderColor: "#762727", color: "#762727" }}
                    aria-label="Next sessions"
                  >
                    <ChevronRightIcon size={22} />
                  </button>
                </>
              )}

              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                  }}
                >
                  {galleries.map((item) => (
                    <div
                      key={item.id}
                      className={`flex-shrink-0 px-2 sm:px-3 ${
                        visibleCount === 1 ? "w-full" : "w-1/2"
                      }`}
                    >
                      <SessionCard
                        item={item}
                        viewPhotos={t.viewPhotos}
                        photoLabel={t.photo}
                        photosLabel={t.photos}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {canSlide && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentIndex(i)}
                      className="h-2 rounded-full transition-all duration-200"
                      style={{
                        width: currentIndex === i ? "1.5rem" : "0.5rem",
                        backgroundColor:
                          currentIndex === i
                            ? "#762727"
                            : "rgba(118, 39, 39, 0.25)",
                      }}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              <div className="flex justify-center mt-8">
                <Link
                  href="/gallery"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-[#762727] bg-white px-6 py-3 text-sm font-bold text-[#762727] transition-colors duration-200 hover:bg-[#762727] hover:text-white active:bg-[#5f1f1f] active:text-white"
                >
                  {t.viewAll}
                  <ArrowRightIcon size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
