/** Smooth-scroll to a page section, accounting for fixed banner + navbar. */
export function scrollToHash(hash: string) {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!id) return;

  const element = document.getElementById(id);
  if (!element) return;

  const banner = document.querySelector('[data-banner="true"]') as HTMLElement | null;
  const navbar = document.getElementById("navbar-container");
  const bannerHeight = banner?.offsetHeight || 0;
  const navbarHeight = navbar?.offsetHeight || 80;
  const offset = navbarHeight + bannerHeight + 20;
  const top = element.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}
