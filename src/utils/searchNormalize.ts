/**
 * Normalizes Arabic, Pashto, Persian, and Latin text for forgiving search:
 * - Strips Arabic diacritics/tashkeel and Quranic annotation marks
 * - Unifies Alef variants (أ إ آ ٱ -> ا), Ya variants (ى ی ئ -> ي), Ta Marbuta (ة -> ه), Waw Hamza (ؤ -> و)
 * - Unifies Persian/Pashto Kaf (ک -> ك) for Arabic script cross-matching while keeping Pashto/Persian letters usable
 */
export function normalizeSearchText(input: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ىيئ]/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ک/g, 'ك')
    .replace(/ی/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchesNormalized(haystack: string | undefined | null, needle: string): boolean {
  if (!needle.trim()) return true;
  if (!haystack) return false;
  return normalizeSearchText(haystack).includes(normalizeSearchText(needle));
}
