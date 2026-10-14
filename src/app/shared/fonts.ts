const loaded = new Set<string>();

/**
 * Loads Google Fonts on demand (once per family spec).
 * Call from a demo component's constructor:
 *   loadGoogleFonts('Playfair+Display:ital,wght@0,400;0,700;1,400', 'Source+Serif+4:wght@400;600');
 */
export function loadGoogleFonts(...families: string[]): void {
  if (typeof document === 'undefined') return;
  const missing = families.filter((f) => !loaded.has(f));
  if (!missing.length) return;
  missing.forEach((f) => loaded.add(f));
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${missing.map((f) => `family=${f}`).join('&')}&display=swap`;
  document.head.appendChild(link);
}
