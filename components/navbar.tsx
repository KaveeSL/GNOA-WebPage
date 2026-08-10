"use client";

import { links } from "@/data/links";
import { ILink } from "@/types";
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "./language-context";
import { translations } from "@/lib/i18n";
import { scrollToHash } from "@/lib/scroll-to-hash";

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasBanner, setHasBanner] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(0);
  const scrolledRef = useRef(false);

  // Solid bar on inner pages, or after scrolling on the homepage
  const solidNav = !isHome || isScrolled || isMenuOpen;

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const next = window.scrollY > 50;
        if (next !== scrolledRef.current) {
          scrolledRef.current = next;
          setIsScrolled(next);
        }
        ticking = false;
      });
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

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    syncBanner();
    const timer = setTimeout(syncBanner, 150);

    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of [...mutation.addedNodes, ...mutation.removedNodes]) {
          if (
            node instanceof HTMLElement &&
            (node.matches?.('[data-banner="true"]') ||
              node.querySelector?.('[data-banner="true"]'))
          ) {
            syncBanner();
            return;
          }
        }
      }
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

  // After landing on home with a hash (e.g. /#news), scroll to that section
  useEffect(() => {
    if (!isHome) return;
    const hash = window.location.hash;
    if (!hash) return;

    const run = () => scrollToHash(hash);
    run();
    const t1 = setTimeout(run, 150);
    const t2 = setTimeout(run, 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isHome, pathname, hasBanner, bannerHeight]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsMenuOpen(false);
    if (!isHome) {
      // Let Next.js navigate to /
      return;
    }
    e.preventDefault();
    window.history.replaceState(null, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMenuOpen(false);

    if (href === "/" || href === "") {
      handleHomeClick(e);
      return;
    }

    if (!href.startsWith("#") && !href.startsWith("/#")) {
      return; // normal link
    }

    const hash = href.startsWith("/#") ? href.slice(1) : href.startsWith("#") ? href : `#${href}`;
    e.preventDefault();

    if (!isHome) {
      // Full navigation so the hash is applied reliably after the home page loads
      window.location.assign(`/${hash}`);
      return;
    }

    window.history.replaceState(null, "", `/${hash}`);
    scrollToHash(hash);
  };

  const navHref = (href: string) => {
    if (href.startsWith("#")) return `/${href}`;
    return href;
  };

  const mappedLinkName = (name: string) => {
    const tNav = translations[language].navbar;
    switch (name) {
      case "Home":
        return tNav.home;
      case "About":
        return tNav.about;
      case "Leadership":
        return tNav.leadership;
      case "News":
        return tNav.news;
      case "In Action":
        return tNav.inAction;
      case "Videos":
        return tNav.videos;
      default:
        return name;
    }
  };

  return (
    <>
      <div
        className="fixed w-full z-[102] pointer-events-none"
        id="navbar-container"
        style={{ top: hasBanner ? `${bannerHeight}px` : "0px" }}
      >
        <nav
          className={`w-full px-4 md:px-16 lg:px-24 xl:px-32 py-4 relative overflow-hidden transition-[background-color,box-shadow] duration-200 ${
            solidNav
              ? "bg-white shadow-md pointer-events-auto"
              : "bg-transparent shadow-none pointer-events-none"
          }`}
        >
          <div className="relative z-[103] max-w-7xl mx-auto flex items-center justify-between gap-4 pointer-events-auto">
            <Link href="/" onClick={handleHomeClick} className="flex items-center gap-3">
              <Image
                src="/assets/gnoalogo.png"
                alt="GNOA Logo"
                width={120}
                height={40}
                className="h-12 w-auto"
                priority
                loading="eager"
                fetchPriority="high"
              />
              <span
                className="font-bold text-xl uppercase tracking-wide"
                style={{ color: "#762727" }}
              >
                GNOA
              </span>
            </Link>

            <div className="hidden md:flex gap-3 items-center">
              {links.map((link: ILink) => (
                <Link
                  key={link.name}
                  href={navHref(link.href)}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="py-1 px-3 text-gray-800 hover:text-zinc-500 cursor-pointer relative z-[104]"
                >
                  {mappedLinkName(link.name)}
                </Link>
              ))}
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
              <button
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                <MenuIcon className="size-6.5 text-gray-800" />
              </button>
            </div>

            <Link
              href="https://apply.gnoasl.lk/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-block py-2.5 px-6 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)] text-white rounded-full cursor-pointer relative z-[104]"
              style={{ backgroundColor: "#762727" }}
            >
              Join Us
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed right-0 z-[105] w-full bg-white shadow-xl shadow-black/5 transition-[height] duration-200 ease-out ${
          isMenuOpen
            ? "h-screen overflow-y-auto pointer-events-auto"
            : "h-0 overflow-hidden pointer-events-none"
        }`}
        style={{ top: hasBanner ? `${bannerHeight}px` : "0px" }}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex items-center justify-between p-4">
          <Link href="/" onClick={handleHomeClick} className="flex items-center gap-3">
            <Image
              src="/assets/gnoalogo.png"
              alt="GNOA Logo"
              width={120}
              height={40}
              className="h-12 w-auto"
            />
            <span
              className="font-bold text-xl uppercase tracking-wide"
              style={{ color: "#762727" }}
            >
              GNOA
            </span>
          </Link>
          <button type="button" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
            <XIcon className="size-6.5" />
          </button>
        </div>
        <div className="flex flex-col gap-4 p-4 text-base">
          {links.map((link: ILink) => (
            <Link
              key={link.name}
              href={navHref(link.href)}
              className="py-1 px-3 cursor-pointer"
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {mappedLinkName(link.name)}
            </Link>
          ))}
          <Link
            href="https://apply.gnoasl.lk/"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-6 w-max text-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)] text-white rounded-full cursor-pointer"
            style={{ backgroundColor: "#762727" }}
            onClick={() => setIsMenuOpen(false)}
          >
            Join Us
          </Link>
        </div>
      </div>
    </>
  );
}
