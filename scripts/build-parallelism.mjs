/**
 * Shared defaults for parallel build steps (OG raster, static HTML).
 * Cloudflare Pages does not document vCPU count; Node reports logical threads here.
 */
import os from 'node:os';

export function hardwareConcurrency() {
  try {
    if (typeof os.availableParallelism === 'function') {
      const n = os.availableParallelism();
      if (Number.isFinite(n) && n >= 1) return n;
    }
  } catch {
    /* ignore */
  }
  const cpus = os.cpus();
  return cpus && cpus.length > 0 ? cpus.length : 4;
}

/**
 * Chapter OG jobs are heavy (Satori + Resvg + fallbacks). Stay slightly under core count.
 */
export function defaultOgChapterConcurrency() {
  const cores = hardwareConcurrency();
  return Math.min(16, Math.max(2, Math.floor(cores * 0.75)));
}

/**
 * Chapter HTML is lighter per job; use up to one task per logical thread (capped).
 */
export function defaultStaticGenConcurrency() {
  const cores = hardwareConcurrency();
  return Math.min(24, Math.max(2, cores));
}
