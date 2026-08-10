"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Top padding that clears fixed site banner + navbar. */
export function usePageTopOffset(extra = 24) {
  const [offset, setOffset] = useState(160);

  useEffect(() => {
    const measure = () => {
      const banner = document.querySelector(
        '[data-banner="true"]'
      ) as HTMLElement | null;
      const navbar = document.getElementById("navbar-container");
      const bannerH = banner?.offsetHeight ?? 0;
      const navH = navbar?.offsetHeight ?? 80;
      setOffset(bannerH + navH + extra);
    };

    measure();
    const t1 = window.setTimeout(measure, 100);
    const t2 = window.setTimeout(measure, 400);

    window.addEventListener("resize", measure);

    const mo = new MutationObserver(measure);
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "data-banner"],
    });

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", measure);
      mo.disconnect();
    };
  }, [extra]);

  return offset;
}

/** Content wrapper for inner pages (news, gallery, etc.). */
export default function PageTopSpacer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const top = usePageTopOffset(28);

  return (
    <div
      className={`px-4 md:px-16 lg:px-24 xl:px-32 pb-20 ${className}`}
      style={{ paddingTop: top }}
    >
      {children}
    </div>
  );
}
