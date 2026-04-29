#!/usr/bin/env node
/**
 * Build Open Graph PNGs (1200×630) for the homepage, each book hub, and each chapter.
 * Uses Satori + Resvg.
 *
 * Fonts: Satori matches `fontFamily` to the **name inside the font file** (name table).
 * We download the full **Noto Serif CJK SC** OTF (Simplified Chinese build, classical coverage),
 * ~20 MB once, cached as `fonts/.cache/NotoSerifCJKsc-Regular.otf`. If you see tofu boxes,
 * delete `fonts/.cache/*.otf` and re-run, or set `OG_FONT_PATH` + `OG_FONT_FAMILY` to match
 * your file’s family name (see Font Book / `fc-query`).
 *
 * SVG vs PNG for social cards: `og:image` pointing at SVG is **not** reliably supported
 * (Facebook, Slack, iMessage, etc. expect raster). PNGs are written under `public/og/`
 * (typically gitignored in the repo; produced on each `npm run build` / Pages build).
 * `npm run build` ends with this script and `scripts/verify-og-assets.mjs`.
 *
 * Usage:
 *   node generate-og-images.js
 *   node generate-og-images.js --book shiji --chapter 002
 *   node generate-og-images.js --book shiji --incremental
 *
 * Incremental skips rasterizing a chapter when its PNG exists and is at least as new
 * as the source JSON (same for book hubs vs data/manifest.json). Use --force or
 * OG_FORCE=1 after changing card layout/fonts. CI: set OG_INCREMENTAL=1 and cache
 * public/og + fonts/.cache between Pages builds so only changed chapters re-render.
 *
 * Env:
 *   SITE_URL       Canonical origin (default https://24histories.com)
 *   OG_FONT_PATH     Path to .otf/.ttf/.woff (not woff2) with Latin + CJK for all strings
 *   OG_FONT_FAMILY   CSS font-family matching that file (default: Noto Serif CJK SC)
 *   OG_DEBUG_SVG     If set to a file path, writes the first Satori SVG attempt there
 *   OG_VERBOSE       Log when a chapter OG image uses a simplified fallback layout
 *   OG_CHAPTER_CONCURRENCY  Parallel chapter renders (default 4, max 16). Higher uses
 *                      more CPU on the build machine; try 8–12 on Pages if stable.
 *   OG_INCREMENTAL      If 1, same as passing --incremental (skip up-to-date PNGs).
 *   OG_FORCE            If 1, same as --force (ignore incremental skips).
 *   OG_BOOK_RESVG_CHUNK   Book-hub PNGs Resvg'd N at a time in one child (default 16).
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import satori from 'satori';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_URL = (process.env.SITE_URL || 'https://24histories.com').replace(/\/$/, '');
const OG_W = 1200;
const OG_H = 630;
const HEADER_BLUE = '#1a5490';
const HEADER_BLUE_DEEP = '#0d3a66';
/** Long CJK-only excerpts can trigger Resvg panics; cap per paragraph before layout. */
const OG_SNIPPET_CHAR_CAP = 420;

function envPositiveInt(name, defaultVal, max) {
  const v = parseInt(process.env[name] || '', 10);
  if (!Number.isFinite(v) || v < 1) return defaultVal;
  return Math.min(max, v);
}

/** Concurrent chapter OG pipelines (each: Satori + Resvg worker). */
const OG_CHAPTER_CONCURRENCY = envPositiveInt('OG_CHAPTER_CONCURRENCY', 4, 16);
/** Book hub cards batched into one `og-resvg-batch` child per chunk (fewer spawns). */
const OG_BOOK_RESVG_CHUNK = envPositiveInt('OG_BOOK_RESVG_CHUNK', 16, 64);

const args = process.argv.slice(2);
function argVal(name) {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
}
const filterBook = argVal('--book');
const filterChapter = argVal('--chapter');
const incremental =
  args.includes('--incremental') ||
  process.env.OG_INCREMENTAL === '1' ||
  process.env.OG_INCREMENTAL === 'true';
const force =
  args.includes('--force') ||
  process.env.OG_FORCE === '1' ||
  process.env.OG_FORCE === 'true';

/** Skip raster work when output exists and is at least as new as the source file. */
function outputIsFresh(outPath, srcPath) {
  if (force || !incremental) return false;
  if (!fs.existsSync(outPath) || !fs.existsSync(srcPath)) return false;
  try {
    return fs.statSync(outPath).mtimeMs >= fs.statSync(srcPath).mtimeMs;
  } catch {
    return false;
  }
}

/** Must match the font file’s family name (Noto CJK SC OTF → "Noto Serif CJK SC"). */
function fontFamilyName() {
  return (process.env.OG_FONT_FAMILY || 'Noto Serif CJK SC').trim();
}

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/** Full Simplified Chinese serif (classical coverage); one-time ~20 MB download */
const NOTO_SERIF_CJK_SC_OTF_URL =
  'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Serif/OTF/SimplifiedChinese/NotoSerifCJKsc-Regular.otf';

/**
 * @returns {{ fonts: import('satori').FontOptions[], resvgFontPath: string }}
 */
async function loadFonts() {
  const family = fontFamilyName();
  const custom = process.env.OG_FONT_PATH;
  if (custom && fs.existsSync(custom)) {
    const abs = path.resolve(custom);
    const data = fs.readFileSync(custom);
    return {
      fonts: [{ name: family, data, weight: 400, style: 'normal' }],
      resvgFontPath: abs,
    };
  }

  const cacheDir = path.join(__dirname, 'fonts', '.cache');
  mkdirp(cacheDir);

  const cachePath = path.join(cacheDir, 'NotoSerifCJKsc-Regular.otf');
  let buf;
  if (fs.existsSync(cachePath)) {
    buf = fs.readFileSync(cachePath);
  } else {
    console.log('Downloading Noto Serif CJK SC (full OTF, ~20 MB) for Chinese glyphs…');
    buf = Buffer.from(
      await fetch(NOTO_SERIF_CJK_SC_OTF_URL).then((r) => {
        if (!r.ok) throw new Error(`Font fetch ${NOTO_SERIF_CJK_SC_OTF_URL}: ${r.status}`);
        return r.arrayBuffer();
      }),
    );
    fs.writeFileSync(cachePath, buf);
  }

  return {
    fonts: [{ name: family, data: buf, weight: 400, style: 'normal' }],
    resvgFontPath: path.resolve(cachePath),
  };
}

/**
 * Run Resvg in a child process so a native panic does not abort the whole generator
 * (see e.g. resvg geom.rs unwrap on some Satori SVGs).
 */
function resvgWorkerPng(svg, resvgFontPath) {
  const family = fontFamilyName();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'og-resvg-'));
  const svgPath = path.join(dir, 'in.svg');
  const pngPath = path.join(dir, 'out.png');
  try {
    fs.writeFileSync(svgPath, svg, 'utf8');
    const worker = path.join(__dirname, 'scripts', 'og-resvg-worker.mjs');
    const r = spawnSync(
      process.execPath,
      [worker, svgPath, pngPath, String(OG_W), family, resvgFontPath],
      { maxBuffer: 64 * 1024 * 1024 },
    );
    if (r.signal) {
      return { ok: false, reason: `signal ${r.signal}` };
    }
    if (r.status !== 0) {
      return {
        ok: false,
        reason: (r.stderr && String(r.stderr)) || `exit ${r.status}`,
      };
    }
    if (!fs.existsSync(pngPath)) {
      return { ok: false, reason: 'missing output png' };
    }
    return { ok: true, png: fs.readFileSync(pngPath) };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Render several SVG strings in one child process when possible; falls back to
 * one `og-resvg-worker` spawn per SVG if the batch child fails.
 * @param {string[]} svgs
 * @param {string} resvgFontPath
 * @returns {Buffer[]}
 */
function resvgBatchBuffers(svgs, resvgFontPath) {
  if (svgs.length === 0) return [];
  if (svgs.length === 1) {
    const r = resvgWorkerPng(svgs[0], resvgFontPath);
    if (!r.ok) throw new Error(r.reason || 'resvg failed');
    return [r.png];
  }

  const family = fontFamilyName();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'og-rbatch-'));
  try {
    const jobs = [];
    for (let i = 0; i < svgs.length; i += 1) {
      const svgPath = path.join(dir, `b${i}.svg`);
      const pngPath = path.join(dir, `b${i}.png`);
      fs.writeFileSync(svgPath, svgs[i], 'utf8');
      jobs.push({ svgPath, pngPath });
    }
    const manifest = {
      width: OG_W,
      fontFamily: family,
      fontFilePath: resvgFontPath,
      jobs,
    };
    const manPath = path.join(dir, 'manifest.json');
    fs.writeFileSync(manPath, JSON.stringify(manifest), 'utf8');
    const batchWorker = path.join(__dirname, 'scripts', 'og-resvg-batch.mjs');
    const r = spawnSync(process.execPath, [batchWorker, manPath], {
      maxBuffer: 128 * 1024 * 1024,
    });
    if (r.signal || r.status !== 0) {
      return svgs.map((svg) => {
        const one = resvgWorkerPng(svg, resvgFontPath);
        if (!one.ok) throw new Error(one.reason || 'resvg failed');
        return one.png;
      });
    }
    return jobs.map((j) => fs.readFileSync(j.pngPath));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Run async work over `items` with at most `limit` concurrent executions.
 * @template T, R
 * @param {T[]} items
 * @param {number} limit
 * @param {(item: T, index: number) => Promise<R>} fn
 * @returns {Promise<R[]>}
 */
async function runPool(items, limit, fn) {
  if (items.length === 0) return [];
  const results = new Array(items.length);
  let next = 0;
  const n = Math.min(Math.max(1, limit), items.length);
  const worker = async () => {
    while (true) {
      const i = next;
      next += 1;
      if (i >= items.length) break;
      results[i] = await fn(items[i], i);
    }
  };
  await Promise.all(Array.from({ length: n }, () => worker()));
  return results;
}

/**
 * @param {import('react').ReactNode} element
 * @param {import('satori').FontOptions[]} fonts
 * @param {string} resvgFontPath
 * @param {{ fallbackElements?: import('react').ReactNode[] }} [options]
 */
async function renderPng(element, fonts, resvgFontPath, options = {}) {
  const { fallbackElements = [] } = options;
  const chain = [element, ...fallbackElements];

  let lastReason = '';
  for (let i = 0; i < chain.length; i += 1) {
    const el = chain[i];
    const svg = await satori(el, {
      width: OG_W,
      height: OG_H,
      fonts,
    });
    if (process.env.OG_DEBUG_SVG && i === 0) {
      fs.writeFileSync(process.env.OG_DEBUG_SVG, svg, 'utf8');
    }
    const r = resvgWorkerPng(svg, resvgFontPath);
    if (r.ok) {
      if (i > 0 && process.env.OG_VERBOSE) {
        console.warn(`  (OG used fallback layout ${i}/${chain.length - 1})`);
      }
      return r.png;
    }
    lastReason = r.reason;
  }
  throw new Error(`OG Resvg failed after ${chain.length} attempt(s): ${lastReason}`);
}

function baseTextStyle() {
  return {
    fontFamily: fontFamilyName(),
    fontWeight: 400,
  };
}

function siteOgElement() {
  return createElement(
    'div',
    {
      style: {
        width: OG_W,
        height: OG_H,
        background: `linear-gradient(135deg, ${HEADER_BLUE} 0%, ${HEADER_BLUE_DEEP} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
      },
    },
    createElement(
      'div',
      {
        style: {
          ...baseTextStyle(),
          color: '#ffffff',
          fontSize: 88,
          textAlign: 'center',
          lineHeight: 1.15,
        },
      },
      '二十四史',
    ),
    createElement(
      'div',
      {
        style: {
          ...baseTextStyle(),
          color: 'rgba(255,255,255,0.95)',
          fontSize: 40,
          marginTop: 28,
          textAlign: 'center',
          lineHeight: 1.25,
        },
      },
      'The Twenty-Four Histories',
    ),
  );
}

/**
 * Satori’s line breaker can insert a break after U+2019 before the following letter,
 * yielding “Xuanyuan'  s”. Use ASCII apostrophe for Latin strings on OG cards.
 */
function normalizeOgLatinTypography(text) {
  return String(text || '')
    .replace(/\u2019/g, "'") // RIGHT SINGLE QUOTATION MARK (typographic apostrophe)
    .replace(/\u2018/g, "'"); // LEFT SINGLE QUOTATION MARK (sometimes used as apostrophe)
}

function bookOgElement(chinese, englishName) {
  return createElement(
    'div',
    {
      style: {
        width: OG_W,
        height: OG_H,
        background: `linear-gradient(135deg, ${HEADER_BLUE} 0%, ${HEADER_BLUE_DEEP} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 56,
      },
    },
    createElement(
      'div',
      {
        style: {
          ...baseTextStyle(),
          color: '#ffffff',
          fontSize: Math.min(96, 3200 / Math.max(4, chinese.length)),
          textAlign: 'center',
          lineHeight: 1.2,
        },
      },
      chinese,
    ),
    createElement(
      'div',
      {
        style: {
          ...baseTextStyle(),
          color: 'rgba(255,255,255,0.95)',
          fontSize: 36,
          marginTop: 24,
          textAlign: 'center',
          lineHeight: 1.3,
          maxWidth: 1080,
        },
      },
      normalizeOgLatinTypography(englishName),
    ),
  );
}

/**
 * One OG “paragraph” per source `paragraph` block: prefer block-level English, else join sentences.
 * @returns {{ english: boolean, text: string } | null}
 */
function paragraphSnippetFromBlock(block) {
  const blockTr = (block.translations || []).find((t) => t.lang === 'en') || block.translations?.[0];
  if (blockTr) {
    const t = String(blockTr.idiomatic || blockTr.literal || blockTr.text || '').trim();
    if (t) return { english: true, text: t };
  }

  const pieces = [];
  let anyEn = false;
  for (const s of block.sentences || []) {
    const tr = (s.translations || []).find((x) => x.lang === 'en') || s.translations?.[0];
    const en = tr && String(tr.idiomatic || tr.literal || tr.text || '').trim();
    const zh = String(s.zh || '').trim();
    if (en) {
      anyEn = true;
      pieces.push(en);
    } else if (zh) {
      pieces.push(zh);
    }
  }
  if (pieces.length === 0) return null;
  const text = anyEn ? pieces.join(' ') : pieces.join('');
  return { english: anyEn, text };
}

/**
 * Opening excerpt as one snippet per original paragraph block (not per sentence).
 */
/**
 * Teaser for social cards: low character budget (large type), but allow several short
 * paragraphs so choppy source structure still yields multiple blocks on the card.
 */
function collectOpeningSnippet(chapterData, maxChars = 1000, maxParagraphs = 6) {
  const parts = [];
  let len = 0;
  for (const block of chapterData.content || []) {
    if (block.type !== 'paragraph') continue;
    const snippet = paragraphSnippetFromBlock(block);
    if (!snippet?.text) continue;
    const nextLen = len + snippet.text.length + (parts.length > 0 ? 1 : 0);
    if (parts.length > 0 && nextLen > maxChars) break;
    parts.push(snippet);
    len = nextLen;
    if (parts.length >= maxParagraphs) break;
  }
  return parts;
}

/** Horizontal padding on the chapter card text column (left + right). */
const CHAPTER_SNIPPET_PAD_X = 40 + 40;
/** Vertical padding (top + bottom). */
const CHAPTER_SNIPPET_PAD_Y = 44 + 44;
const CHAPTER_LEFT_RAIL = 400;
/** White panel width (px); fixed so flex + % widths do not clip in Satori. */
const CHAPTER_RIGHT_W = OG_W - CHAPTER_LEFT_RAIL;
/** Text area inside that panel after horizontal padding. */
const CHAPTER_SNIPPET_INNER_W = CHAPTER_RIGHT_W - CHAPTER_SNIPPET_PAD_X;
/**
 * Slightly narrower than INNER_W so glyphs (e.g. “e”) are not clipped at the raster edge
 * after Satori/Resvg layout + justify rounding.
 */
const CHAPTER_SNIPPET_TEXT_W = CHAPTER_SNIPPET_INNER_W - 14;
/** Fade band at bottom of snippet column (px). */
const CHAPTER_SNIPPET_FADE_HEIGHT = 112;

/**
 * Large teaser type: sizing assumes a short excerpt (see collectOpeningSnippet); caps keep
 * body text big on 1200×630 cards. Overflow is clipped by the snippet column.
 */
function computeChapterSnippetTypography(snippetParts) {
  const innerW = CHAPTER_SNIPPET_TEXT_W;
  const innerH = OG_H - CHAPTER_SNIPPET_PAD_Y;

  const blocks =
    snippetParts.length > 0
      ? snippetParts
      : [
          {
            english: true,
            text: 'Opening text will appear here when translation or source sentences are available.',
          },
        ];

  const sumLen = Math.max(1, blocks.reduce((a, p) => a + p.text.length, 0));
  /** Biased low so sqrt() lands near the upper clamp — teaser should feel headline-sized. */
  const sizingLen = Math.min(sumLen, 420);
  const n = blocks.length;
  const targetH = innerH * 0.8;
  const cw = 0.5;
  const lh = 1.46;
  const gapFor = (fs) => Math.max(14, Math.round(fs * 0.5 + 10));

  let fs = Math.sqrt((targetH * innerW) / (sizingLen * cw * lh));
  if (n > 1) {
    const gapApprox = gapFor(fs) * (n - 1);
    fs = Math.sqrt((Math.max(targetH - gapApprox, innerH * 0.36) * innerW) / (sizingLen * cw * lh));
  }
  fs = Math.max(25, Math.min(32, Math.round(fs * 10) / 10));

  return {
    enSize: Math.min(34, Math.round((fs + 1.35) * 10) / 10),
    zhSize: fs,
    gap: gapFor(fs),
    lineHeight: lh,
  };
}

/** Minimal chapter card: no excerpt, no absolute overlays (last-resort Resvg escape hatch). */
function chapterOgFallbackTitlesElement(zhTitle, enTitle) {
  const leftChildren = [
    createElement(
      'div',
      {
        style: {
          ...baseTextStyle(),
          color: '#ffffff',
          fontSize: 44,
          lineHeight: 1.25,
          fontWeight: 600,
          maxWidth: '100%',
          wordBreak: 'break-all',
        },
      },
      zhTitle,
    ),
  ];
  if (enTitle) {
    leftChildren.push(
      createElement(
        'div',
        {
          style: {
            ...baseTextStyle(),
            color: 'rgba(255,255,255,0.92)',
            fontSize: 26,
            marginTop: 20,
            lineHeight: 1.35,
            maxWidth: '100%',
            wordBreak: 'break-word',
          },
        },
        normalizeOgLatinTypography(enTitle),
      ),
    );
  }

  return createElement(
    'div',
    {
      style: {
        width: OG_W,
        height: OG_H,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#ffffff',
      },
    },
    createElement(
      'div',
      {
        style: {
          width: CHAPTER_LEFT_RAIL,
          height: OG_H,
          background: `linear-gradient(180deg, ${HEADER_BLUE} 0%, ${HEADER_BLUE_DEEP} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 40,
          paddingRight: 36,
          flexShrink: 0,
        },
      },
      ...leftChildren,
    ),
    createElement(
      'div',
      {
        style: {
          width: CHAPTER_RIGHT_W,
          flexShrink: 0,
          height: OG_H,
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingLeft: 36,
          paddingRight: 36,
        },
      },
      createElement(
        'div',
        {
          style: {
            ...baseTextStyle(),
            color: '#444444',
            fontSize: 28,
            textAlign: 'center',
            lineHeight: 1.4,
            maxWidth: CHAPTER_SNIPPET_INNER_W,
          },
        },
        'Chapter preview unavailable for this card layout.',
      ),
    ),
  );
}

/**
 * @param {{ english: boolean, text: string }[]} snippetParts
 * @param {{ noBottomFade?: boolean }} [layout]
 */
function chapterOgElement(zhTitle, enTitle, snippetParts, layout = {}) {
  const { noBottomFade = false } = layout;
  const leftChildren = [
    createElement(
      'div',
      {
        style: {
          ...baseTextStyle(),
          color: '#ffffff',
          fontSize: 44,
          lineHeight: 1.25,
          fontWeight: 600,
          maxWidth: '100%',
          wordBreak: 'break-all',
        },
      },
      zhTitle,
    ),
  ];
  if (enTitle) {
    leftChildren.push(
      createElement(
        'div',
        {
          style: {
            ...baseTextStyle(),
            color: 'rgba(255,255,255,0.92)',
            fontSize: 26,
            marginTop: 20,
            lineHeight: 1.35,
            maxWidth: '100%',
            wordBreak: 'break-word',
          },
        },
        normalizeOgLatinTypography(enTitle),
      ),
    );
  }

  const paragraphStyleBase = {
    ...baseTextStyle(),
    width: CHAPTER_SNIPPET_TEXT_W,
    maxWidth: CHAPTER_SNIPPET_TEXT_W,
    minWidth: 0,
    whiteSpace: 'normal',
    textAlign: 'left',
    hyphens: 'none',
  };

  const typo = computeChapterSnippetTypography(snippetParts);

  const snippetBlocks =
    snippetParts.length > 0
      ? snippetParts.map((p, i) =>
          createElement(
            'div',
            {
              key: i,
              style: {
                ...paragraphStyleBase,
                flexShrink: 0,
                wordBreak: p.english ? 'break-word' : 'break-all',
                overflowWrap: 'break-word',
                color: p.english ? '#1a1a1a' : '#252525',
                fontSize: p.english ? typo.enSize : typo.zhSize,
                lineHeight: typo.lineHeight,
                marginBottom: i < snippetParts.length - 1 ? typo.gap : 0,
              },
            },
            p.english ? normalizeOgLatinTypography(p.text) : p.text,
          ),
        )
      : [
          createElement(
            'div',
            {
              key: 'placeholder',
              style: {
                ...paragraphStyleBase,
                flexShrink: 0,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                color: '#555555',
                fontSize: typo.enSize,
                lineHeight: typo.lineHeight,
              },
            },
            'Opening text will appear here when translation or source sentences are available.',
          ),
        ];

  /* Top-aligned stack + overflow clip: vertical centering with justify:center caused
   overlapping lines in Satori when total text height exceeded the panel. */
  const snippetColumn = createElement(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        minHeight: 0,
        minWidth: 0,
        width: CHAPTER_SNIPPET_TEXT_W,
        maxWidth: CHAPTER_SNIPPET_TEXT_W,
        overflow: 'hidden',
        paddingTop: 8,
      },
    },
    ...snippetBlocks,
  );

  /** Inset text from the right edge without relying on boxSizing (Satori/Yoga). */
  const snippetInset = createElement(
    'div',
    {
      style: {
        width: CHAPTER_SNIPPET_INNER_W,
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
    snippetColumn,
  );

  const bottomFade = createElement('div', {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: CHAPTER_SNIPPET_FADE_HEIGHT,
      background:
        'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 38%, rgba(255,255,255,0.92) 72%, #ffffff 100%)',
    },
  });

  const rightPanelChildren = noBottomFade ? [snippetInset] : [snippetInset, bottomFade];

  return createElement(
    'div',
    {
      style: {
        width: OG_W,
        height: OG_H,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#ffffff',
      },
    },
    createElement(
      'div',
      {
        style: {
          width: CHAPTER_LEFT_RAIL,
          height: OG_H,
          background: `linear-gradient(180deg, ${HEADER_BLUE} 0%, ${HEADER_BLUE_DEEP} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 40,
          paddingRight: 36,
          flexShrink: 0,
        },
      },
      ...leftChildren,
    ),
    createElement(
      'div',
      {
        style: {
          width: CHAPTER_RIGHT_W,
          flexShrink: 0,
          height: OG_H,
          backgroundColor: '#ffffff',
          paddingTop: 44,
          paddingBottom: 44,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: noBottomFade ? 'static' : 'relative',
          overflow: 'hidden',
          minWidth: 0,
        },
      },
      ...rightPanelChildren,
    ),
  );
}

async function main() {
  const manifestPath = path.join(__dirname, 'data', 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('Missing data/manifest.json. Run make manifest first.');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const books = manifest.books || {};

  console.log('');
  console.log('=== Open Graph: generate-og-images.js (raster share cards) ===');
  console.log(
    `  (parallelism: OG_CHAPTER_CONCURRENCY=${OG_CHAPTER_CONCURRENCY}, book Resvg chunk=${OG_BOOK_RESVG_CHUNK})`,
  );
  if (incremental) {
    console.log(
      '  (incremental: skipping PNGs newer than source JSON / manifest; use --force after layout or font changes)',
    );
  }
  console.log('Loading fonts for OG images…');
  const { fonts, resvgFontPath } = await loadFonts();

  const outRoot = path.join(__dirname, 'public', 'og');
  mkdirp(outRoot);
  mkdirp(path.join(outRoot, 'books'));

  const sitePng = await renderPng(siteOgElement(), fonts, resvgFontPath);
  fs.writeFileSync(path.join(outRoot, 'site.png'), sitePng);
  console.log('  ✓ og/site.png');

  const bookIds = Object.keys(books).filter((id) => !filterBook || id === filterBook);

  for (let c = 0; c < bookIds.length; c += OG_BOOK_RESVG_CHUNK) {
    const chunkIds = bookIds.slice(c, c + OG_BOOK_RESVG_CHUNK);
    const needIds = chunkIds.filter(
      (bookId) => !outputIsFresh(path.join(outRoot, 'books', `${bookId}.png`), manifestPath),
    );
    for (const bookId of chunkIds) {
      if (!needIds.includes(bookId)) {
        console.log(`  ○ og/books/${bookId}.png (up to date)`);
      }
    }
    if (needIds.length === 0) continue;
    const svgs = await Promise.all(
      needIds.map((bookId) => {
        const b = books[bookId];
        return satori(bookOgElement(b.chinese, b.name), {
          width: OG_W,
          height: OG_H,
          fonts,
        });
      }),
    );
    const pngs = resvgBatchBuffers(svgs, resvgFontPath);
    for (let k = 0; k < needIds.length; k += 1) {
      fs.writeFileSync(path.join(outRoot, 'books', `${needIds[k]}.png`), pngs[k]);
    }
    for (const bookId of needIds) {
      console.log(`  ✓ og/books/${bookId}.png`);
    }
  }

  const chapterJobs = [];
  for (const bookId of bookIds) {
    const b = books[bookId];
    const chapterEntries = (b.chapters || []).filter((ch) => {
      if (filterChapter) {
        const n = String(ch.chapter).padStart(3, '0');
        const f = String(filterChapter).padStart(3, '0');
        return n === f;
      }
      return true;
    });
    for (const ch of chapterEntries) {
      const chNum = String(ch.chapter).padStart(3, '0');
      const jsonPath = path.join(__dirname, 'data', bookId, `${chNum}.json`);
      if (!fs.existsSync(jsonPath)) continue;
      chapterJobs.push({ bookId, chNum, jsonPath });
    }
  }

  const chapterJobsToRun = chapterJobs.filter((job) => {
    const pngPath = path.join(outRoot, 'chapters', job.bookId, `${job.chNum}.png`);
    return !outputIsFresh(pngPath, job.jsonPath);
  });
  if (incremental && chapterJobs.length > chapterJobsToRun.length) {
    console.log(
      `  (incremental: skipping ${chapterJobs.length - chapterJobsToRun.length} chapter PNGs already up to date)`,
    );
  }

  const chapterCounts = new Map();
  for (const bookId of bookIds) {
    chapterCounts.set(bookId, 0);
  }

  await runPool(chapterJobsToRun, OG_CHAPTER_CONCURRENCY, async (job) => {
    const { bookId, chNum, jsonPath } = job;
    const chapterData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const zhTitle = chapterData.meta?.title?.zh || `卷${chNum}`;
    const enTitle = chapterData.meta?.title?.en || '';
    const snippetRaw = collectOpeningSnippet(chapterData);
    const snippet = snippetRaw.map((p) => ({
      ...p,
      text: p.text.length > OG_SNIPPET_CHAR_CAP ? p.text.slice(0, OG_SNIPPET_CHAR_CAP) : p.text,
    }));
    const png = await renderPng(chapterOgElement(zhTitle, enTitle, snippet), fonts, resvgFontPath, {
      fallbackElements: [
        chapterOgElement(zhTitle, enTitle, snippet, { noBottomFade: true }),
        chapterOgFallbackTitlesElement(zhTitle, enTitle),
      ],
    });
    const chDir = path.join(outRoot, 'chapters', bookId);
    mkdirp(chDir);
    fs.writeFileSync(path.join(chDir, `${chNum}.png`), png);
    chapterCounts.set(bookId, (chapterCounts.get(bookId) || 0) + 1);
  });

  let totalChapterPng = 0;
  for (const bookId of bookIds) {
    const n = chapterCounts.get(bookId) || 0;
    totalChapterPng += n;
    console.log(`  ✓ og/chapters/${bookId}/ (${n} images)`);
  }

  console.log(
    `\n✅ Open Graph done: ${totalChapterPng} chapter PNG(s) written, ${bookIds.length} book(s) in scope, site card → public/og/`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
