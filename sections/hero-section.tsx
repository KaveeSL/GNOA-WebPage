"use client";
import AnimatedContent from "@/components/animated-content";
import CustomIcon from "@/components/custom-icon";
import { SparkleIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/i18n";

export default function HeroSection() {
    const { language } = useLanguage();
    const [topPadding, setTopPadding] = useState(96); // Default padding for navbar only

    useEffect(() => {
        let resizeTimeout: number | undefined;

        const calculatePadding = () => {
            const bannerElement = document.querySelector('[data-banner="true"]') as HTMLElement | null;
            const navbarElement = document.getElementById('navbar-container') as HTMLElement | null;
            
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
                const extraPadding = isMobile ? 32 : 24;
                totalHeight += extraPadding;
            }
            
            setTopPadding((prev) => {
                const next = Math.max(totalHeight, 96);
                return next === prev ? prev : next;
            });
        };

        const handleResize = () => {
            if (resizeTimeout !== undefined) {
                window.clearTimeout(resizeTimeout);
            }
            resizeTimeout = window.setTimeout(calculatePadding, 100);
        };

        calculatePadding();
        window.addEventListener('resize', handleResize);

        const bannerElement = document.querySelector('[data-banner="true"]');
        const navbarElement = document.getElementById('navbar-container');
        const observerTargets = [bannerElement, navbarElement].filter(
            (el): el is HTMLElement => !!el
        );

        const observer = new MutationObserver(() => {
            calculatePadding();
        });

        observerTargets.forEach((el) =>
            observer.observe(el, {
                attributes: true,
                attributeFilter: ['class', 'style'],
            })
        );

        return () => {
            window.removeEventListener('resize', handleResize);
            if (resizeTimeout !== undefined) {
                window.clearTimeout(resizeTimeout);
            }
            observer.disconnect();
        };
    }, []);

    return (
        <section className="relative bg-[url('/assets/hero-gradient-bg.png')] bg-cover bg-center bg-no-repeat px-4 md:px-16 lg:px-24 xl:px-32 overflow-hidden" style={{ zIndex: 1 }}>
            <div className="absolute inset-0 bg-[url('/assets/bgimg.png')] bg-cover bg-center bg-no-repeat opacity-35" style={{ zIndex: 0, backgroundAttachment: 'fixed' }}></div>
            <div 
                className="relative max-w-7xl mx-auto flex flex-col items-center justify-center min-h-screen" 
                style={{ zIndex: 1, paddingTop: `${topPadding}px` }}
            >
                <AnimatedContent reverse distance={30} className="flex items-center gap-2 bg-white/50 backdrop-blur p-1 rounded-full mb-4 md:mb-0">
                    <div className="flex items-center gap-1 pr-3">
                        <StarIcon className="size-4.5" style={{ fill: '#762727', stroke: '#762727' }} />
                        <span className="text-xs md:text-sm">{translations[language].hero.badge}</span>
                    </div>
                </AnimatedContent>
                <AnimatedContent distance={30} delay={0.1} className="relative mt-2 md:mt-4">
                    <h2 className="text-center font-urbanist text-2xl md:text-4xl font-bold uppercase tracking-wider mb-2" style={{ color: '#762727' }}>
                        {translations[language].hero.titleShort}
                    </h2>
                    <h1 className="text-center font-urbanist text-3xl md:text-6xl leading-tight md:leading-[1.125] font-bold max-w-3xl px-2">
                        {translations[language].hero.titleMain}
                        <span className="block mt-1 md:mt-2" style={{ color: '#762727' }}>{translations[language].hero.titleCountry}</span>
                    </h1>
                    <div className="absolute -top-5 right-13 hidden md:block">
                        <CustomIcon icon={SparkleIcon} dir="right" />
                    </div>
                </AnimatedContent>
                <AnimatedContent distance={30} delay={0.2}>
                    <p className="text-center text-sm md:text-base leading-relaxed text-zinc-500 max-w-2xl mt-4 px-4">
                        {translations[language].hero.subtitle}
                    </p>
                </AnimatedContent>
                <AnimatedContent className="flex flex-col md:flex-row items-center gap-4 mt-6 w-full md:w-auto px-4">
                    <Link href="#features" className="py-3 md:py-2.5 w-full md:w-auto px-8 border text-white text-center rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg" style={{ backgroundColor: '#762727', borderColor: '#762727' }}>
                        {translations[language].hero.ctaLearnMore}
                    </Link>
                    <Link href="#team" className="relative py-3 md:py-2.5 w-full md:w-auto px-8 bg-white/50 text-gray-600 font-medium text-center border border-white rounded-full transition-all duration-300 hover:scale-105">
                        {translations[language].hero.ctaLeadership}
                        <AnimatedContent direction="horizontal" className="absolute size-8 pointer-events-none right-0 top-full -translate-y-1/2">
                            <Image
                                src="/assets/mouse-arrow.svg"
                                alt="mouse-arrow"
                                width={24}
                                height={24}
                            />
                        </AnimatedContent>
                    </Link>
                </AnimatedContent>
            </div>
        </section>
    );
}