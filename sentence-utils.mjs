/**
 * Shared sentence helpers for scraper and validation scripts.
 */

export function isPunctuationOnlySentence(text) {
  const raw = String(text || '').normalize('NFKC').trim();
  if (!raw) return false;
  const stripped = raw.replace(/[\p{P}\p{S}\s\u00A0\u200B\uFEFF]+/gu, '');
  return stripped.length === 0;
}
