import { createHash } from 'node:crypto';

/**
 * Bump when OG layout, snippet rules, fonts-as-rendered, or static site card copy changes.
 * Forces a new fingerprint so incremental builds re-raster affected cards.
 */
export const OG_LAYOUT_VERSION = '1';

/** Sidecar path: one line, 64 lowercase hex chars + optional newline (Option A). */
export function ogSidecarPath(pngPath) {
  return `${pngPath}.sha256`;
}

/**
 * Chapter share card: raw UTF-8 bytes of `data/{book}/{nnn}.json` (same inputs as parse + snippet).
 */
export function fingerprintChapter(layoutVersion, jsonFileBuffer) {
  const h = createHash('sha256');
  h.update(layoutVersion, 'utf8');
  h.update(Buffer.from([0]));
  h.update(jsonFileBuffer);
  return h.digest('hex');
}

/**
 * Book hub card: only fields used by `bookOgElement` (Chinese line + English name).
 */
export function fingerprintBook(layoutVersion, book) {
  const payload = JSON.stringify({
    chinese: book.chinese ?? '',
    name: book.name ?? '',
  });
  const h = createHash('sha256');
  h.update(layoutVersion, 'utf8');
  h.update(Buffer.from([0]));
  h.update(payload, 'utf8');
  return h.digest('hex');
}

/**
 * Homepage site card: fixed template in `siteOgElement` (no SITE_URL in raster).
 */
export function fingerprintSite(layoutVersion) {
  const h = createHash('sha256');
  h.update(layoutVersion, 'utf8');
  h.update(Buffer.from([0]));
  h.update('site-card-v1', 'utf8');
  return h.digest('hex');
}
