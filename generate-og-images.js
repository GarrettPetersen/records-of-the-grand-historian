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
 * (Facebook, Slack, iMessage, etc. expect raster). All PNGs under `public/og/` are
 * gitignored; Cloudflare Pages runs `npm run build`, which ends with this script.
 *
 * Usage:
 *   node generate-og-images.js
 *   node generate-og-images.js --book shiji --chapter 002
 *
 * Env:
 *   SITE_URL       Canonical origin (default https://24histories.com)
 *   OG_FONT_PATH     Path to .otf/.ttf/.woff (not woff2) with Latin + CJK for all strings
 *   OG_FONT_FAMILY   CSS font-family matching that file (default: Noto Serif CJK SC)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_URL = (process.env.SITE_URL || 'https://24histories.com').replace(/\/$/, '');
const OG_W = 1200;
const OG_H = 630;
const HEADER_BLUE = '#1a5490';
const HEADER_BLUE_DEEP = '#0d3a66';

const args = process.argv.slice(2);
function argVal(name) {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
}
const filterBook = argVal('--book');
const filterChapter = argVal('--chapter');

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

/** Resvg often does not use SVG-embedded @font-face; load the same file via fontFiles for CJK. */
function renderPng(element, fonts, resvgFontPath) {
  const family = fontFamilyName();
  return satori(element, {
    width: OG_W,
    height: OG_H,
    fonts,
  }).then((svg) => {
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: OG_W },
      background: 'white',
      font: {
        loadSystemFonts: false,
        defaultFontFamily: family,
        fontFiles: [resvgFontPath],
      },
    });
    return resvg.render().asPng();
  });
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

function chapterOgElement(zhTitle, enTitle, snippetParts) {
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
    textAlign: 'justify',
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
          position: 'relative',
          overflow: 'hidden',
          minWidth: 0,
        },
      },
      snippetInset,
      bottomFade,
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

  console.log('Loading fonts for OG images…');
  const { fonts, resvgFontPath } = await loadFonts();

  const outRoot = path.join(__dirname, 'public', 'og');
  mkdirp(outRoot);
  mkdirp(path.join(outRoot, 'books'));

  const sitePng = await renderPng(siteOgElement(), fonts, resvgFontPath);
  fs.writeFileSync(path.join(outRoot, 'site.png'), sitePng);
  console.log('  ✓ og/site.png');

  const bookIds = Object.keys(books).filter((id) => !filterBook || id === filterBook);

  for (const bookId of bookIds) {
    const b = books[bookId];
    const bookPng = await renderPng(bookOgElement(b.chinese, b.name), fonts, resvgFontPath);
    fs.writeFileSync(path.join(outRoot, 'books', `${bookId}.png`), bookPng);
    console.log(`  ✓ og/books/${bookId}.png`);

    const chDir = path.join(outRoot, 'chapters', bookId);
    mkdirp(chDir);

    const chapterEntries = (b.chapters || []).filter((ch) => {
      if (filterChapter) {
        const n = String(ch.chapter).padStart(3, '0');
        const f = String(filterChapter).padStart(3, '0');
        return n === f;
      }
      return true;
    });

    let chapterImages = 0;
    for (const ch of chapterEntries) {
      const chNum = String(ch.chapter).padStart(3, '0');
      const jsonPath = path.join(__dirname, 'data', bookId, `${chNum}.json`);
      if (!fs.existsSync(jsonPath)) continue;

      const chapterData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const zhTitle = chapterData.meta?.title?.zh || `卷${chNum}`;
      const enTitle = chapterData.meta?.title?.en || '';
      const snippet = collectOpeningSnippet(chapterData);
      const png = await renderPng(chapterOgElement(zhTitle, enTitle, snippet), fonts, resvgFontPath);
      fs.writeFileSync(path.join(chDir, `${chNum}.png`), png);
      chapterImages += 1;
    }
    console.log(`  ✓ og/chapters/${bookId}/ (${chapterImages} images)`);
  }

  console.log('\n✅ OG images written under public/og/');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
