/** Resolve stored image paths so uploads work without a dev-server restart. */
export function resolveImageUrl(url: string): string {
  if (!url) return url;

  const [pathPart, query] = url.split("?");

  if (pathPart.startsWith("/uploads/")) {
    const filename = pathPart.slice("/uploads/".length);
    return query ? `/api/uploads/${filename}?${query}` : `/api/uploads/${filename}`;
  }

  return url;
}
