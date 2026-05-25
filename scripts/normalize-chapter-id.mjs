/**
 * Normalize chapter ids to three-digit strings (e.g. 42 → "042").
 * @param {string|number} chapter
 * @returns {string}
 */
export function normalizeChapterId(chapter) {
  const normalized = String(chapter).trim();
  if (/^\d+$/.test(normalized)) {
    return normalized.padStart(3, '0');
  }
  const m = normalized.match(/^(\d+)\.json$/);
  if (m) return m[1].padStart(3, '0');
  if (/^\d{3}$/.test(normalized)) return normalized;
  throw new Error(`Invalid chapter id: ${chapter} (use e.g. 042 or 42)`);
}
