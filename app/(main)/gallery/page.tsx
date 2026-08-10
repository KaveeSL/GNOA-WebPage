"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ImageIcon, ImagesIcon } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/i18n";
import { resolveImageUrl } from "@/lib/image-url";
import PageTopSpacer from "@/components/page-top-spacer";
import type { IPhotoGallery } from "@/types";

function ListingCollage({
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
      <div className="w-full h-full flex items-center justify-center text-[#762727]/25">
        <ImageIcon size={40} />
      </div>
    );
  }

  if (!b) {
    return (
      <img
        src={resolveImageUrl(a.image)}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
    );
  }

  if (!c) {
    return (
      <div className="absolute inset-0 grid grid-cols-2 gap-0.5">
        {[a, b].map((p) => (
          <div key={p.id} className="relative overflow-hidden">
            <img
              src={resolveImageUrl(p.image)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5">
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

export default function GalleryIndexPage() {
  const { language } = useLanguage();
  const t = translations[language].gallery;
  const [items, setItems] = useState<IPhotoGallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/galleries");
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) {
          setItems(
            [...data].sort((a, b) => a.display_order - b.display_order)
          );
        }
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
            href="/#testimonials"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#762727] transition-colors mb-8"
          >
            <ArrowLeftIcon size={16} />
            {t.backHome}
          </a>

          <div className="mb-10 md:mb-14">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "#762727" }}
            >
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
                const count = item.photos?.length ?? 0;
                const preview = (item.photos ?? []).slice(0, 3);
                return (
                  <Link
                    key={item.id}
                    href={`/gallery/${item.id}`}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-[0_10px_40px_rgba(118,39,39,0.1)] transition-shadow"
                  >
                    <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                      <ListingCollage photos={preview} title={item.title} />
                      {count > 3 && (
                        <span className="absolute bottom-2.5 right-2.5 rounded-full bg-[#762727] px-2 py-0.5 text-[10px] font-bold text-white">
                          +{count - 3}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <p
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide mb-2"
                        style={{ color: "#762727" }}
                      >
                        <ImagesIcon size={12} />
                        {count} {count === 1 ? t.photo : t.photos}
                      </p>
                      <h2 className="font-semibold text-lg text-gray-900 group-hover:text-[#762727] transition-colors line-clamp-2">
                        {item.title}
                      </h2>
                      {item.description && (
                        <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                          {item.description}
                        </p>
                      )}
                      <span
                        className="mt-4 inline-block text-sm font-semibold"
                        style={{ color: "#762727" }}
                      >
                        {t.viewPhotos} →
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
