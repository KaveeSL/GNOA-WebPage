"use client";
import { links } from "@/data/links";
import { ILink } from "@/types";
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import AnimatedContent from "./animated-content";
import { useLanguage } from "./language-context";
import { translations } from "@/lib/i18n";

export default function Navbar() {
    const { language, setLanguage } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [hasBanner, setHasBanner] = useState(false);
    const [bannerHeight, setBannerHeight] = useState(0);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollPosition = window.scrollY;
                    setIsScrolled(scrollPosition > 50);
                    ticking = false;
                });
                ticking = true;
            }
        };

        let resizeObserver: ResizeObserver | null = null;
        let observedBanner: HTMLElement | null = null;

        const applyBannerMetrics = (el: HTMLElement | null) => {
            if (el) {
                const height = el.offsetHeight;
                setHasBanner(true);
                setBannerHeight((prev) => (prev === height ? prev : height));
            } else {
                setHasBanner(false);
                setBannerHeight((prev) => (prev === 0 ? prev : 0));
            }
        };

        const detachResizeObserver = () => {
            resizeObserver?.disconnect();
            resizeObserver = null;
            observedBanner = null;
        };

        const attachResizeObserver = (el: HTMLElement) => {
            if (observedBanner === el && resizeObserver) return;
            detachResizeObserver();
            observedBanner = el;
            resizeObserver = new ResizeObserver(() => {
                applyBannerMetrics(el);
            });
            resizeObserver.observe(el);
        };

        const syncBanner = () => {
            const el = document.querySelector('[data-banner="true"]') as HTMLElement | null;
            if (el) {
                applyBannerMetrics(el);
                attachResizeObserver(el);
            } else {
                detachResizeObserver();
                applyBannerMetrics(null);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        syncBanner();
        const timer = setTimeout(syncBanner, 150);

        // Only react to DOM structure changes (banner mount/unmount), not every class toggle
        // across the page — watching all `class` mutations on body was freezing the dev tab.
        const mo = new MutationObserver(() => {
            syncBanner();
        });
        mo.observe(document.body, { childList: true, subtree: true });

        window.addEventListener("resize", syncBanner);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", syncBanner);
            clearTimeout(timer);
            mo.disconnect();
            detachResizeObserver();
        };
    }, []);

    const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                const elementTop = (element as HTMLElement).offsetTop;
                const navbarElement = document.getElementById('navbar-container');
                const navbarHeight = navbarElement?.offsetHeight || 0;
                const currentBannerHeight = hasBanner ? bannerHeight : 0;
                const offset = navbarHeight + currentBannerHeight + 20;
                window.scrollTo({
                    top: elementTop - offset,
                    behavior: 'smooth'
                });
            }
            setIsMenuOpen(false);
        }
    };

    return (
        <>
            <div 
                className="fixed w-full z-[102] transition-all duration-300" 
                id="navbar-container"
                style={{ top: hasBanner ? `${bannerHeight}px` : '0px' }}
            >
                <AnimatedContent reverse>
                    <nav className={`w-full px-4 md:px-16 lg:px-24 xl:px-32 py-4 transition-all duration-500 relative overflow-hidden ${
                        isScrolled 
                            ? 'bg-white shadow-md' 
                            : 'bg-transparent'
                    }`}>
                        <div className="relative z-[103] max-w-7xl mx-auto flex items-center justify-between gap-4">
                            <Link href="#!" className="flex items-center gap-3">
                                <Image src="/assets/gnoalogo.png" alt="GNOA Logo" width={120} height={40} className="h-12 w-auto" />
                                <span className="font-bold text-xl uppercase tracking-wide transition-colors duration-500" style={{ color: '#762727' }}>GNOA</span>
                            </Link>

                            <div className="hidden md:flex gap-3 items-center">
                                {links.map((link: ILink) => {
                                    const tNav = translations[language].navbar;
                                    const mappedName =
                                        link.name === "Home" ? tNav.home :
                                        link.name === "About" ? tNav.about :
                                        link.name === "Leadership" ? tNav.leadership :
                                        link.name === "In Action" ? tNav.inAction :
                                        link.name === "Videos" ? tNav.videos :
                                        link.name;

                                    return (
                                        <Link 
                                            key={link.name} 
                                            href={link.href} 
                                            onClick={link.name === "Home" ? handleHomeClick : (e) => handleAnchorClick(e, link.href)}
                                            className={`py-1 px-3 transition-colors duration-500 cursor-pointer relative z-[104] ${
                                                isScrolled ? 'hover:text-zinc-500 text-gray-800' : 'text-gray-900 hover:text-gray-700'
                                            }`}
                                        >
                                            {mappedName}
                                        </Link>
                                    );
                                })}
                                <div className="flex items-center gap-1 text-xs rounded-full bg-white/70 border border-gray-200 px-2 py-1">
                                    <button
                                        type="button"
                                        onClick={() => setLanguage("en")}
                                        className={`px-1 font-semibold ${language === "en" ? "text-[#762727]" : "text-gray-500"}`}
                                    >
                                        EN
                                    </button>
                                    <span className="text-gray-400">|</span>
                                    <button
                                        type="button"
                                        onClick={() => setLanguage("si")}
                                        className={`px-1 font-semibold ${language === "si" ? "text-[#762727]" : "text-gray-500"}`}
                                    >
                                        සිං
                                    </button>
                                    <span className="text-gray-400">|</span>
                                    <button
                                        type="button"
                                        onClick={() => setLanguage("ta")}
                                        className={`px-1 font-semibold ${language === "ta" ? "text-[#762727]" : "text-gray-500"}`}
                                    >
                                        த‍ம்
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 md:hidden">
                                <div className="flex items-center gap-1 text-[10px] rounded-full bg-white/80 border border-gray-200 px-1.5 py-0.5">
                                    <button
                                        type="button"
                                        onClick={() => setLanguage("en")}
                                        className={`px-0.5 font-semibold ${language === "en" ? "text-[#762727]" : "text-gray-500"}`}
                                    >
                                        EN
                                    </button>
                                    <span className="text-gray-400">|</span>
                                    <button
                                        type="button"
                                        onClick={() => setLanguage("si")}
                                        className={`px-0.5 font-semibold ${language === "si" ? "text-[#762727]" : "text-gray-500"}`}
                                    >
                                        සිං
                                    </button>
                                    <span className="text-gray-400">|</span>
                                    <button
                                        type="button"
                                        onClick={() => setLanguage("ta")}
                                        className={`px-0.5 font-semibold ${language === "ta" ? "text-[#762727]" : "text-gray-500"}`}
                                    >
                                        த‍ம்
                                    </button>
                                </div>
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                    <MenuIcon className={`size-6.5 transition-colors duration-500 ${isScrolled ? 'text-gray-800' : 'text-gray-900'}`} />
                                </button>
                            </div>

                            <Link 
                                href="https://apply.gnoasl.lk/" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden md:inline-block py-2.5 px-6 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)] text-white rounded-full transition-all duration-500 cursor-pointer relative z-[104]" 
                                style={{ backgroundColor: '#762727' }}
                            >
                                Join Us
                            </Link>
                        </div>
                    </nav>
                </AnimatedContent>
            </div>
            <div 
                className={`fixed right-0 z-[105] w-full bg-white shadow-xl shadow-black/5 transition-all duration-300 ease-in-out ${isMenuOpen ? "h-screen overflow-y-auto" : "h-0 overflow-hidden"}`}
                style={{ top: hasBanner ? `${bannerHeight}px` : '0px' }}
            >
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Image src="/assets/gnoalogo.png" alt="GNOA Logo" width={120} height={40} className="h-12 w-auto" />
                        <span className="font-bold text-xl uppercase tracking-wide" style={{ color: '#762727' }}>GNOA</span>
                    </div>
                    <XIcon className="size-6.5" onClick={() => setIsMenuOpen(false)} />
                </div>
                <div className="flex flex-col gap-4 p-4 text-base">
                    {links.map((link: ILink) => {
                        const tNav = translations[language].navbar;
                        const mappedName =
                            link.name === "Home" ? tNav.home :
                            link.name === "About" ? tNav.about :
                            link.name === "Leadership" ? tNav.leadership :
                            link.name === "In Action" ? tNav.inAction :
                            link.name === "Videos" ? tNav.videos :
                            link.name;

                        return (
                            <Link 
                                key={link.name} 
                                href={link.href} 
                                className="py-1 px-3 cursor-pointer" 
                                onClick={link.name === "Home" ? handleHomeClick : (e) => {
                                    handleAnchorClick(e, link.href);
                                    setIsMenuOpen(false);
                                }}
                            >
                                {mappedName}
                            </Link>
                        );
                    })}
                    <Link 
                        href="https://apply.gnoasl.lk/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-6 w-max text-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)] text-white rounded-full cursor-pointer" 
                        style={{ backgroundColor: '#762727' }}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Join Us
                    </Link>
                </div>
            </div>
        </>
    );
}