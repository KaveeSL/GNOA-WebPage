"use client";
import AnimatedContent from "@/components/animated-content";
import CustomIcon from "@/components/custom-icon";
import { SparkleIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, type MouseEvent } from "react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/i18n";
import { scrollToHash } from "@/lib/scroll-to-hash";

export default function HeroSection() {
    const { language } = useLanguage();
    const [topPadding, setTopPadding] = useState(96);

    const handleSectionClick = (e: MouseEvent<HTMLAnchorElement>, hash: string) => {
        e.preventDefault();
        window.history.replaceState(null, "", hash);
        scrollToHash(hash);
    };

    useEffect(() => {
        let resizeTimeout: number | undefined;

        const calculatePadding = () => {
            const bannerElement = document.querySelector('[data-banner="true"]') as HTMLElement | null;
            const navbarElement = document.getElementById("navbar-container") as HTMLElement | null;

            let totalHeight = 0;

            if (bannerElement && bannerElement.offsetHeight > 0) {
                totalHeight += bannerElement.offsetHeight;
            }

            if (navbarElement && navbarElement.offsetHeight > 0) {
                totalHeight += navbarElement.offsetHeight;
            }

            if (totalHeight === 0) {
                totalHeight = 96;
            } else {
                const isMobile = window.innerWidth < 768;
                totalHeight += isMobile ? 32 : 24;
            }

            setTopPadding((prev) => {
                const next = Math.max(totalHeight, 96);
                return next === prev ? prev : next;
            });
        };

        const handleResize = () => {
            if (resizeTimeout !== undefined) window.clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(calculatePadding, 100);
        };

        calculatePadding();
        // Banner can mount async — one delayed pass is enough (do NOT watch navbar class/style)
        const boot = window.setTimeout(calculatePadding, 200);
        window.addEventListener("resize", handleResize);

        const bannerElement = document.querySelector('[data-banner="true"]');
        let ro: ResizeObserver | null = null;
        if (bannerElement instanceof HTMLElement) {
            ro = new ResizeObserver(() => calculatePadding());
            ro.observe(bannerElement);
        }

        const mo = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of [...mutation.addedNodes, ...mutation.removedNodes]) {
                    if (
                        node instanceof HTMLElement &&
                        (node.matches?.('[data-banner="true"]') ||
                            node.querySelector?.('[data-banner="true"]'))
                    ) {
                        calculatePadding();
                        return;
                    }
                }
            }
        });
        mo.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener("resize", handleResize);
            if (resizeTimeout !== undefined) window.clearTimeout(resizeTimeout);
            window.clearTimeout(boot);
            ro?.disconnect();
            mo.disconnect();
        };
    }, []);

    return (
        <section className="relative px-4 md:px-16 lg:px-24 xl:px-32 overflow-hidden bg-[#f7f1ea]">
            <Image
                src="/assets/hero-gradient-bg.png"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-center pointer-events-none select-none z-0"
                aria-hidden
            />
            <Image
                src="/assets/bgimg.webp"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-center opacity-35 pointer-events-none select-none z-0"
                aria-hidden
            />
            <div
                className="relative z-10 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-screen"
                style={{ paddingTop: `${topPadding}px` }}
            >
                <AnimatedContent
                    reverse
                    distance={12}
                    className="flex items-center gap-2 bg-white/50 p-1 rounded-full mb-4 md:mb-0"
                >
                    <div className="flex items-center gap-1 pr-3">
                        <StarIcon className="size-4.5" style={{ fill: "#762727", stroke: "#762727" }} />
                        <span className="text-xs md:text-sm">{translations[language].hero.badge}</span>
                    </div>
                </AnimatedContent>
                <AnimatedContent distance={12} delay={0.04} className="relative mt-2 md:mt-4">
                    <h2
                        className="text-center font-urbanist text-2xl md:text-4xl font-bold uppercase tracking-wider mb-2"
                        style={{ color: "#762727" }}
                    >
                        {translations[language].hero.titleShort}
                    </h2>
                    <h1 className="text-center font-urbanist text-3xl md:text-6xl leading-tight md:leading-[1.125] font-bold max-w-3xl px-2">
                        {translations[language].hero.titleMain}
                        <span className="block mt-1 md:mt-2" style={{ color: "#762727" }}>
                            {translations[language].hero.titleCountry}
                        </span>
                    </h1>
                    <div className="absolute -top-5 right-13 hidden md:block">
                        <CustomIcon icon={SparkleIcon} dir="right" />
                    </div>
                </AnimatedContent>
                <AnimatedContent distance={12} delay={0.08}>
                    <p className="text-center text-sm md:text-base leading-relaxed text-zinc-500 max-w-2xl mt-4 px-4">
                        {translations[language].hero.subtitle}
                    </p>
                </AnimatedContent>
                <AnimatedContent
                    delay={0.1}
                    distance={12}
                    className="flex flex-col md:flex-row items-center gap-4 mt-6 w-full md:w-auto px-4"
                >
                    <a
                        href="#features"
                        onClick={(e) => handleSectionClick(e, "#features")}
                        className="py-3 md:py-2.5 w-full md:w-auto px-8 border text-white text-center rounded-full transition-transform duration-200 hover:scale-105"
                        style={{ backgroundColor: "#762727", borderColor: "#762727" }}
                    >
                        {translations[language].hero.ctaLearnMore}
                    </a>
                    <a
                        href="#team"
                        onClick={(e) => handleSectionClick(e, "#team")}
                        className="relative py-3 md:py-2.5 w-full md:w-auto px-8 bg-white/50 text-gray-600 font-medium text-center border border-white rounded-full transition-transform duration-200 hover:scale-105"
                    >
                        {translations[language].hero.ctaLeadership}
                        <span className="absolute size-8 pointer-events-none right-0 top-full -translate-y-1/2">
                            <Image
                                src="/assets/mouse-arrow.svg"
                                alt=""
                                fill
                                sizes="32px"
                                className="object-contain"
                            />
                        </span>
                    </a>
                </AnimatedContent>
            </div>
        </section>
    );
}
