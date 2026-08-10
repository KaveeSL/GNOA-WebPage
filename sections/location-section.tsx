"use client";

import SectionTitle from "@/components/section-title";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/i18n";
import { ExternalLinkIcon, MapPinIcon } from "lucide-react";

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7389134468717!2d79.86845352556949!3d6.921782868405693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2590b0f980331%3A0xed26a4045fecd3e!2z4La74Lai4La64LeaIOC3hOC3meC2ryDgtrHgt5Lgtr3gtrDgt4_gtrvgt5PgtrHgtpzgt5og4LeD4LaC4Lac4La44La6IChHTk9BKQ!5e0!3m2!1sen!2slk!4v1786383537840!5m2!1sen!2slk";

const MAP_OPEN_URL =
  "https://www.google.com/maps/place/Government+Nursing+Officers'+Association+(GNOA)/@6.9217829,79.8684535,17z/data=!3m1!4b1!4m6!3m5!1s0x3ae2590b0f980331:0xed26a4045fecd3e!8m2!3d6.9217829!4d79.8710284!16s%2Fg%2F11c5q0y0y0?entry=ttu";

export default function LocationSection() {
  const { language } = useLanguage();
  const t = translations[language].location;

  return (
    <section
      id="location"
      className="px-4 md:px-16 lg:px-24 xl:px-32 border-b border-gray-200"
    >
      <div className="p-4 pt-20 pb-20 md:p-20 md:pb-24 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200">
        <SectionTitle icon={MapPinIcon} title={t.title} subtitle={t.subtitle} />

        <div className="w-full mt-12 md:mt-16 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6 items-stretch">
            {/* Info panel */}
            <div className="lg:col-span-2 flex flex-col justify-center rounded-2xl border-2 border-[#762727]/15 bg-[#fffaf8] p-5 sm:p-6 lg:p-7">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#762727] mb-2">
                {t.badge}
              </p>
              <h3 className="font-urbanist text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                {t.officeName}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                {t.address}
              </p>
              <a
                href={MAP_OPEN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-[#762727] bg-white px-5 py-2.5 text-sm font-bold text-[#762727] transition-colors hover:bg-[#762727] hover:text-white"
              >
                {t.openMaps}
                <ExternalLinkIcon size={14} />
              </a>
            </div>

            {/* Map */}
            <div className="lg:col-span-3 overflow-hidden rounded-2xl border-2 border-[#762727]/15 bg-gray-100 shadow-[0_8px_30px_rgba(118,39,39,0.08)] min-h-[260px] sm:min-h-[320px] lg:min-h-full">
              <iframe
                title={t.mapTitle}
                src={MAP_EMBED_SRC}
                className="w-full h-[260px] sm:h-[320px] lg:h-full lg:min-h-[360px] border-0"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
