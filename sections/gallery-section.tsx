"use client";

import { useState, useEffect, useCallback } from "react";
import SectionTitle from "@/components/section-title";
import {
  ImageIcon,
  ImagesIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  FacebookIcon,
} from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/i18n";
import type { IPhotoGallery } from "@/types";
import { resolveImageUrl } from "@/lib/image-url";

export default function GallerySection() {
  const { language } = useLanguage();
  const t = translations[language].gallery;

  const [galleries, setGalleries] = useState<IPhotoGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<{
    photos: { id: number; image: string }[];
    index: number;
    sessionTitle: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/galleries")
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => a.display_order - b.display_order);
        setGalleries(sorted);
        if (sorted.length > 0) {
          setExpandedId(sorted[0].id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightbox]);

  const navigateLightbox = useCallback(
    (direction: "prev" | "next") => {
      if (!lightbox) return;
      const total = lightbox.photos.length;
      const next =
        direction === "next"
          ? (lightbox.index + 1) % total
          : (lightbox.index - 1 + total) % total;
      setLightbox({ ...lightbox, index: next });
    },
    [lightbox]
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") navigateLightbox("next");
      if (e.key === "ArrowLeft") navigateLightbox("prev");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, navigateLightbox]);

  const openLightbox = (
    photos: { id: number; image: string }[],
    index: number,
    sessionTitle: string
  ) => {
    setLightbox({ photos, index, sessionTitle });
  };

  if (loading) {
    return (
      <section id="testimonials" className="px-4 md:px-16 lg:px-24 xl:px-32 border-b border-gray-200">
        <div className="p-4 pt-20 md:p-20 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200">
          <SectionTitle icon={ImageIcon} title={t.title} subtitle={t.subtitle} />
          <p className="mt-24 text-gray-500">{t.loading}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="px-4 md:px-16 lg:px-24 xl:px-32 border-b border-gray-200">
      <div className="p-4 pt-20 md:p-20 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200">
        <SectionTitle icon={ImageIcon} title={t.title} subtitle={t.subtitle} />

        {galleries.length > 0 ? (
          <div className="mt-16 md:mt-24 w-full space-y-5 md:space-y-6">
            {galleries.map((gallery) => {
              const isOpen = expandedId === gallery.id;
              const photoCount = gallery.photos?.length ?? 0;
              const previewPhotos = gallery.photos?.slice(0, 3) ?? [];

              return (
                <div
                  key={gallery.id}
                  className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${
                    isOpen
                      ? "shadow-[0_12px_40px_rgba(118,39,39,0.15)] ring-2 ring-[#762727]/20"
                      : "shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(118,39,39,0.12)]"
                  }`}
                >
                  {/* Decorative top gradient strip */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 z-10"
                    style={{
                      background: "linear-gradient(90deg, #762727 0%, rgba(118,39,39,0.4) 50%, #762727 100%)",
                    }}
                  />

                  <div className="bg-white border border-gray-200/80">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isOpen ? null : gallery.id)}
                    className={`relative w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left transition-all duration-500 overflow-hidden ${
                      isOpen
                        ? "bg-gradient-to-r from-[#762727]/[0.06] via-white to-white"
                        : "hover:bg-gradient-to-r hover:from-[#762727]/[0.04] hover:via-white hover:to-white"
                    }`}
                  >
                    {/* Subtle background pattern when collapsed */}
                    {!isOpen && photoCount > 0 && (
                      <div
                        className="absolute right-24 md:right-36 top-0 bottom-0 w-48 opacity-[0.04] pointer-events-none"
                        style={{
                          backgroundImage: `url(${resolveImageUrl(previewPhotos[0]?.image ?? "")})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          maskImage: "linear-gradient(to left, black, transparent)",
                          WebkitMaskImage: "linear-gradient(to left, black, transparent)",
                        }}
                      />
                    )}

                    <div className="flex items-center gap-4 md:gap-5 min-w-0 flex-1 relative z-[1]">
                      {/* Gallery icon */}
                      <div
                        className="relative flex-shrink-0 w-12 h-12 md:w-14 md:h-14 transition-transform duration-500"
                        style={{ transform: isOpen ? "scale(1.05)" : "scale(1)" }}
                      >
                        <div
                          className="absolute inset-0 rounded-2xl rotate-6 transition-all duration-500"
                          style={{
                            backgroundColor: isOpen
                              ? "rgba(118, 39, 39, 0.18)"
                              : "rgba(118, 39, 39, 0.08)",
                          }}
                        />
                        <div
                          className="absolute inset-0 rounded-2xl -rotate-3 border-2 transition-all duration-500"
                          style={{
                            borderColor: isOpen ? "rgba(118, 39, 39, 0.35)" : "rgba(118, 39, 39, 0.15)",
                            backgroundColor: "white",
                          }}
                        />
                        <div
                          className="relative w-full h-full rounded-2xl flex items-center justify-center shadow-sm transition-all duration-500"
                          style={{
                            background: isOpen
                              ? "linear-gradient(135deg, #762727 0%, #9a3a3a 100%)"
                              : "linear-gradient(135deg, rgba(118,39,39,0.12) 0%, rgba(118,39,39,0.04) 100%)",
                          }}
                        >
                          <ImagesIcon
                            size={22}
                            className="md:w-6 md:h-6 transition-colors duration-300"
                            style={{ color: isOpen ? "#ffffff" : "#762727" }}
                            strokeWidth={isOpen ? 2 : 1.75}
                          />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className="text-lg md:text-xl font-bold font-urbanist truncate"
                            style={{ color: "#762727" }}
                          >
                            {gallery.title}
                          </h3>
                          <span
                            className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                            style={{
                              backgroundColor: "rgba(118, 39, 39, 0.1)",
                              color: "#762727",
                            }}
                          >
                            {photoCount} {photoCount === 1 ? t.photo : t.photos}
                          </span>
                        </div>
                        {gallery.description && (
                          <p className="text-sm text-gray-600 mt-1.5 line-clamp-2 md:line-clamp-none leading-relaxed">
                            {gallery.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Mini photo stack preview */}
                    <div className="flex items-center gap-3 flex-shrink-0 relative z-[1]">
                      {previewPhotos.length > 0 && (
                        <div className="hidden sm:flex items-center pr-1">
                          {previewPhotos.map((photo, i) => (
                            <div
                              key={photo.id}
                              className="relative w-10 h-10 md:w-11 md:h-11 rounded-lg overflow-hidden border-2 border-white shadow-md transition-transform duration-300"
                              style={{
                                marginLeft: i > 0 ? "-12px" : 0,
                                zIndex: previewPhotos.length - i,
                                transform: `rotate(${(i - 1) * 4}deg)`,
                              }}
                            >
                              <img
                                src={resolveImageUrl(photo.image)}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {photoCount > 3 && (
                            <span
                              className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ backgroundColor: "rgba(118, 39, 39, 0.12)", color: "#762727" }}
                            >
                              +{photoCount - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isOpen ? "bg-[#762727] text-white shadow-md" : "bg-gray-100"
                        }`}
                        style={isOpen ? {} : { color: "#762727" }}
                      >
                        <ChevronDownIcon
                          size={20}
                          className={`transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </div>
                    </div>
                  </button>

                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 md:px-6 pb-6 pt-0 border-t border-[#762727]/10 bg-gradient-to-b from-[#762727]/[0.02] to-white">
                        {photoCount > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mt-5">
                            {gallery.photos.map((photo, index) => (
                              <button
                                key={photo.id}
                                type="button"
                                onClick={() =>
                                  openLightbox(gallery.photos, index, gallery.title)
                                }
                                className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
                                style={{ focusRingColor: "#762727" } as React.CSSProperties}
                              >
                                <img
                                  src={resolveImageUrl(photo.image)}
                                  alt={`${gallery.title} ${index + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    {t.viewFull}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mt-5 text-center py-8">
                            {t.noPhotosInSession}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-24 text-center text-gray-500">{t.empty}</p>
        )}

        {/* Fullscreen lightbox */}
        {lightbox && (
          <div className="fixed inset-0 z-[300] bg-black/95 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 md:px-6">
              <p className="text-white/80 text-sm font-medium truncate max-w-[60%]">
                {lightbox.sessionTitle} · {lightbox.index + 1} / {lightbox.photos.length}
              </p>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
              >
                <XIcon size={20} />
              </button>
            </div>

            <div className="flex-1 relative flex items-center justify-center px-4 md:px-16 min-h-0">
              {lightbox.photos.length > 1 && (
                <button
                  type="button"
                  onClick={() => navigateLightbox("prev")}
                  className="absolute left-2 md:left-6 z-10 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeftIcon size={24} />
                </button>
              )}

              <img
                src={resolveImageUrl(lightbox.photos[lightbox.index].image)}
                alt={lightbox.sessionTitle}
                className="max-w-full max-h-full object-contain select-none"
              />

              {lightbox.photos.length > 1 && (
                <button
                  type="button"
                  onClick={() => navigateLightbox("next")}
                  className="absolute right-2 md:right-6 z-10 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Next"
                >
                  <ChevronRightIcon size={24} />
                </button>
              )}
            </div>
          </div>
        )}

        <a
          href="https://www.facebook.com/gnoa.nhsl/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-16 md:mt-20 px-4 py-2 rounded-full text-white text-sm font-medium transition-all duration-300 hover:opacity-90 flex items-center gap-2 justify-center"
          style={{ backgroundColor: "#1877F2" }}
        >
          <FacebookIcon size={16} />
          <span className="hidden sm:inline">{t.fbFull}</span>
          <span className="sm:hidden">{t.fbShort}</span>
        </a>
      </div>
    </section>
  );
}
