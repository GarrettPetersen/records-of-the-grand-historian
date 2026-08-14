#!/usr/bin/env node

/**
 * generate-static-pages.js - Generate static HTML pages for each chapter
 * 
 * Creates individual HTML files for each chapter with full content,
 * proper meta tags, and structured data for SEO.
 * 
 * Usage:
 *   node generate-static-pages.js
 *   node generate-static-pages.js --book shiji
 *   node generate-static-pages.js --book shiji --chapter 006
 *
 * Env:
 *   STATIC_GEN_CONCURRENCY  Parallel chapter HTML jobs per book (max 32). If unset,
 *                           defaults scale with os.availableParallelism() (capped).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defaultStaticGenConcurrency, hardwareConcurrency } from './scripts/build-parallelism.mjs';
import { getBookMetadata, mergeBookInfo } from './scripts/book-metadata.mjs';
import {
  chapterPeopleContext,
  loadPeopleSiteContext,
  peopleSentenceAnchor,
  renderUnitWithPeople,
} from './scripts/lib/people-site.mjs';
import { canonicalUrlForHtmlFile } from './scripts/lib/site-urls.mjs';
import { getBookDesign } from './public/book-design.js';
import {
  kindleProductForBook,
  kindleFooterLine,
  kindleInlineCalloutHtml,
} from './public/kindle-promo-shared.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Canonical origin for og:url, og:image, and <link rel="canonical"> */
const CANONICAL_SITE = (process.env.SITE_URL || 'https://24histories.com').replace(/\/$/, '');
const PUBLICATION_DESCRIPTIONS = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'ebooks', 'publication-descriptions.json'), 'utf8')
);
const PEOPLE_SITE = loadPeopleSiteContext();

function getTableCellEnglish(cell) {
  if (!cell) return '';
  if (typeof cell.translation === 'string' && cell.translation.trim()) return cell.translation;
  if (cell.idiomatic?.trim()) return cell.idiomatic;
  if (cell.literal?.trim()) return cell.literal;
  const t = cell.translations?.[0];
  return t?.idiomatic || t?.literal || '';
}

function getSentenceEnglish(sentence) {
  if (!sentence) return '';
  if (sentence.idiomatic?.trim()) return sentence.idiomatic;
  if (sentence.literal?.trim()) return sentence.literal;
  if (typeof sentence.translation === 'string' && sentence.translation.trim()) return sentence.translation;
  const t = sentence.translations?.[0];
  return t?.idiomatic || t?.literal || '';
}

function addFootnote(translation, footnotes, footnoteCounter) {
  if (!translation?.footnote) return { marker: '', footnoteCounter };
  const footnoteNum = footnoteCounter++;
  footnotes.push({
    number: footnoteNum,
    text: translation.footnote
  });
  return {
    marker: `<sup class="footnote-marker" data-footnote="${footnoteNum}">${footnoteNum}</sup>`,
    footnoteCounter
  };
}

const _staticGenEnv = parseInt(process.env.STATIC_GEN_CONCURRENCY || '', 10);
const STATIC_GEN_FROM_ENV = Number.isFinite(_staticGenEnv) && _staticGenEnv >= 1;
/** Parallel chapter HTML writes per book. */
const STATIC_GEN_CONCURRENCY = STATIC_GEN_FROM_ENV
  ? Math.min(32, _staticGenEnv)
  : defaultStaticGenConcurrency();

/**
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

// Dynamically load book information from data directory
function loadBooks() {
  const dataDir = path.join(__dirname, 'data');
  const books = {};

  try {
    // Get all directories in data folder (excluding files like manifest.json, glossary.json)
    const entries = fs.readdirSync(dataDir, { withFileTypes: true });
    const bookDirs = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    for (const bookId of bookDirs) {
      const bookDataDir = path.join(dataDir, bookId);

      try {
        // Find the first chapter file to extract book metadata
        const chapterFiles = fs.readdirSync(bookDataDir)
          .filter(file => file.endsWith('.json') && /^\d+\.json$/.test(file))
          .sort((a, b) => parseInt(a) - parseInt(b));

        if (chapterFiles.length > 0) {
          const firstChapterPath = path.join(bookDataDir, chapterFiles[0]);
          const chapterData = JSON.parse(fs.readFileSync(firstChapterPath, 'utf8'));

          if (chapterData.meta && chapterData.meta.bookInfo) {
            const merged = mergeBookInfo(bookId, chapterData.meta.bookInfo);
            books[bookId] = {
              name: merged.name || bookId,
              chinese: merged.chinese || bookId,
              pinyin: merged.pinyin || bookId,
              author: merged.author || 'Unknown',
              dynasty: merged.dynasty || 'Unknown',
              category: merged.category || 'twentyFourHistories',
            };
          } else if (getBookMetadata(bookId)) {
            books[bookId] = { ...getBookMetadata(bookId) };
          }
        }
      } catch (err) {
        console.warn(`Warning: Could not load metadata for ${bookId}: ${err.message}`);
      }
    }
  } catch (err) {
    console.error(`Error loading books from data directory: ${err.message}`);
  }

  return books;
}

const BOOKS = loadBooks();

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function publicationIntroForBook(bookId) {
  const text = PUBLICATION_DESCRIPTIONS?.[bookId]?.text || '';
  return String(text).split(/\n{2,}/).map(p => p.trim()).filter(Boolean)[0] || '';
}

function bookTheme(bookId) {
  const color = getBookDesign(bookId).color || '#1a5490';
  const deep = darkenHex(color, 0.32);
  return { color, deep };
}

function darkenHex(hex, amount) {
  const m = String(hex || '').match(/^#?([0-9a-f]{6})$/i);
  if (!m) return '#0d3a66';
  const n = Number.parseInt(m[1], 16);
  const r = Math.max(0, Math.round(((n >> 16) & 255) * (1 - amount)));
  const g = Math.max(0, Math.round(((n >> 8) & 255) * (1 - amount)));
  const b = Math.max(0, Math.round((n & 255) * (1 - amount)));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function siteFooter(prefix = '') {
  const peopleLink = PEOPLE_SITE.active ? `
            <a href="${prefix}people/index.html">People</a> |` : '';
  return `<footer>
        <p>
            <a href="${prefix}index.html">Home</a> |
            <a href="${prefix}about.html">About</a> |
            <a href="${prefix}blog.html">Blog</a> |
            <a href="${prefix}progress.html">Progress</a> |
            ${peopleLink}
            Source texts: <a href="https://chinesenotes.com" target="_blank" rel="noopener noreferrer">Chinese Notes</a>, 
            <a href="https://ctext.org" target="_blank" rel="noopener noreferrer">CText</a>, and 
            <a href="https://zh.wikisource.org" target="_blank" rel="noopener noreferrer">Wikisource</a> |
            <a href="${prefix}privacy.html">Privacy Policy</a>
        </p>
        <p class="site-copyright">English translations © 2026 Garrett M. Petersen. The original Chinese texts are in the public domain.</p>
        ${kindleFooterLine(prefix)}
    </footer>`;
}

function kindlePromoScript(prefix = '') {
  return `<script type="module" src="${prefix}kindle-promo.js?v=20260611-kindle-products"></script>`;
}

function parseTableAttributePrefix(text) {
  const source = String(text || '');
  const match = source.match(/^((?:(?:rowspan|colspan|valign|align|style|class)\s*=\s*"[^"]*"\s*)+)\|\s*/i);
  if (!match) return { text: source };

  const attrs = {};
  for (const attr of match[1].matchAll(/\b(rowspan|colspan)\s*=\s*"(\d+)"/gi)) {
    attrs[attr[1].toLowerCase()] = parseInt(attr[2], 10);
  }

  return {
    ...attrs,
    text: source.slice(match[0].length)
  };
}

function tableSpanValue(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 1 ? n : null;
}

function tableSpanAttrs(item, parsed, fallback) {
  const rowspan = tableSpanValue(item?.rowspan) || tableSpanValue(parsed.rowspan) || tableSpanValue(fallback.rowspan);
  const colspan = tableSpanValue(item?.colspan) || tableSpanValue(parsed.colspan) || tableSpanValue(fallback.colspan);
  let attrs = '';
  if (rowspan) attrs += ` rowspan="${rowspan}"`;
  if (colspan) attrs += ` colspan="${colspan}"`;
  return attrs;
}

function renderTableCell(cell, text, language, chapterPeople, afterHtml = '') {
  const parsed = parseTableAttributePrefix(text);
  const fallback = parseTableAttributePrefix(cell?.content || cell?.zh || '');
  const attrs = tableSpanAttrs(cell, parsed, fallback);
  const cellText = cell?.id && language
    ? renderUnitWithPeople({
        unitId: cell.id,
        text: parsed.text,
        language,
        chapterContext: chapterPeople,
      })
    : escapeHtml(parsed.text);
  const className = parsed.text.trim() || afterHtml ? 'table-cell' : 'table-cell empty-cell';
  const sentence = cell?.id && language
    ? `<span class="sentence" id="${peopleSentenceAnchor(language, cell.id)}" ` +
      `data-sentence-id="${escapeHtml(cell.id)}">${cellText}${afterHtml}</span>`
    : `${cellText}${afterHtml}`;
  return `<td class="${className}"${attrs}>${sentence}</td>`;
}

function renderTableHeaderCell(sentence, text, language, chapterPeople, afterHtml = '') {
  const parsed = parseTableAttributePrefix(text);
  const fallback = parseTableAttributePrefix(sentence?.zh || '');
  const attrs = tableSpanAttrs(sentence, parsed, fallback);
  const cellText = sentence?.id && language
    ? renderUnitWithPeople({
        unitId: sentence.id,
        text: parsed.text,
        language,
        chapterContext: chapterPeople,
      })
    : escapeHtml(parsed.text);
  const rendered = sentence?.id && language
    ? `<span class="sentence" id="${peopleSentenceAnchor(language, sentence.id)}" ` +
      `data-sentence-id="${escapeHtml(sentence.id)}">${cellText}${afterHtml}</span>`
    : `${cellText}${afterHtml}`;
  return `<th class="table-header"${attrs}>${rendered}</th>`;
}

function tableLikeBlocksForQingDraft(bookId, chapterNum, content, startIndex) {
  if (bookId !== 'qingshigao' || chapterNum < 178 || chapterNum > 208) return null;
  const startBlock = content[startIndex];
  if (!startBlock || (startBlock.type !== 'table_header' && startBlock.type !== 'table_row')) return null;

  const blocks = [];
  let j = startIndex;
  while (j < content.length && (content[j].type === 'table_header' || content[j].type === 'table_row')) {
    blocks.push(content[j]);
    j++;
  }

  return blocks.length > 1 ? { blocks, endIndex: j - 1 } : null;
}

function tableBlockCells(block) {
  if (block.type === 'table_header') {
    return block.sentences || [];
  }
  return block.cells || [];
}

function renderTableBodyRow(block, language, footnoteContext = null, chapterPeople = null) {
  const cells = tableBlockCells(block);
  return `<tr>${cells.map(cell => {
    if (language === 'zh') {
      return renderTableCell(cell, cell.content || cell.zh || '', language, chapterPeople);
    }

    if (block.type === 'table_header') {
      const translation = cell.translations && cell.translations.length > 0 ? cell.translations[0] : null;
      let cellText = getSentenceEnglish(cell);
      let marker = '';
      if (translation && footnoteContext) {
        const footnote = addFootnote(translation, footnoteContext.footnotes, footnoteContext.footnoteCounter);
        footnoteContext.footnoteCounter = footnote.footnoteCounter;
        marker = footnote.marker;
      }
      return renderTableCell(cell, cellText, language, chapterPeople, marker);
    }

    return renderTableCell(cell, getTableCellEnglish(cell), language, chapterPeople);
  }).join('')}</tr>`;
}

function generateChapterMeta(bookId, chapterData) {
  const book = BOOKS[bookId];
  const chapterNum = parseInt(chapterData.meta.chapter, 10);
  const zhTitle = chapterData.meta.title.zh || `Chapter ${chapterNum}`;
  const enTitle = chapterData.meta.title.en;
  const title = enTitle ? `${zhTitle} ${enTitle}` : zhTitle;
  const translationPercent = chapterData.meta.sentenceCount > 0
    ? Math.round((chapterData.meta.translatedCount / chapterData.meta.sentenceCount) * 100)
    : 0;

  let description = `${book.chinese} (${book.name}) - ${zhTitle}`;
  if (enTitle) {
    description += ` (${enTitle})`;
  }
  if (translationPercent === 100) {
    description += '. Complete English translation available.';
  } else if (translationPercent > 0) {
    description += `. ${translationPercent}% translated to English.`;
  }

  return {
    zhTitle,
    enTitle,
    title: enTitle ? `${enTitle} - ${book.chinese}` : `${zhTitle} - ${book.chinese}`,
    description: description.substring(0, 160),
    translationPercent
  };
}

function generateBookLandingHTML(bookId) {
  const book = BOOKS[bookId];
  if (!book) return '';
  const theme = bookTheme(bookId);
  const kindleProduct = kindleProductForBook(bookId);
  const kindleIntro = publicationIntroForBook(bookId);
  const title = `${book.chinese} — ${book.name}`;
  const pageUrl = canonicalUrlForHtmlFile(CANONICAL_SITE, `book/${bookId}.html`);
  const ogImage = `${CANONICAL_SITE}/og/books/${bookId}.png`;
  const desc = `Browse chapters of ${book.name} (${book.chinese}).`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(desc)}">
    <link rel="icon" type="image/x-icon" href="../favicon.ico">
    <link rel="stylesheet" href="../styles.css?v=20260527-book-colors">
    <link rel="canonical" href="${pageUrl}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(desc)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(desc)}">
    <meta name="twitter:image" content="${ogImage}">
</head>
<body data-book="${escapeHtml(bookId)}"${kindleProduct ? ` data-kindle-intro="${escapeHtml(kindleIntro)}"` : ''} style="--book-color: ${escapeHtml(theme.color)}; --book-color-deep: ${escapeHtml(theme.deep)};">
    <header>
        <h1 id="book-title">Loading...</h1>
        <h2 id="book-subtitle"></h2>
    </header>

    <main>
        <a href="../index.html" class="back-link">← Back to all histories</a>

        ${kindleProduct ? kindleInlineCalloutHtml({ bookId, variant: 'hub', intro: kindleIntro }) : ''}

        <div id="loading">Loading chapters...</div>
        <div class="chapter-list" id="chapter-list" style="display: none;"></div>
    </main>

    ${siteFooter('../')}
    ${kindleProduct ? kindlePromoScript('../') : ''}

    <script type="module" src="../chapters.js?v=20260611-search-retry"></script>
</body>
</html>`;
}

function generateStructuredData(bookId, chapterData) {
  const book = BOOKS[bookId];
  const chapterNum = parseInt(chapterData.meta.chapter, 10);
  const title = chapterData.meta.title.zh;

  const translators = chapterData.meta.translators || [];
  const translatorNames = translators.map(t => t.name).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "author": {
      "@type": "Person",
      "name": book.author
    },
    "translator": translatorNames.length > 0 ? translatorNames.map(name => ({
      "@type": "Person",
      "name": name
    })) : undefined,
    "inLanguage": ["zh", "en"],
    "isPartOf": {
      "@type": "Book",
      "name": book.chinese,
      "author": {
        "@type": "Person",
        "name": book.author
      }
    },
    "position": chapterNum
  };
}

function generateChapterHTML(bookId, chapterData, allChapters = []) {
  const book = BOOKS[bookId];
  const theme = bookTheme(bookId);
  const kindleProduct = kindleProductForBook(bookId);
  const kindleIntro = publicationIntroForBook(bookId);
  const meta = generateChapterMeta(bookId, chapterData);
  const structuredData = generateStructuredData(bookId, chapterData);
  const chapterNum = parseInt(chapterData.meta.chapter, 10);
  const zhTitle = meta.zhTitle;
  const enTitle = meta.enTitle;
  const chapterPeople = chapterPeopleContext(PEOPLE_SITE, bookId, chapterData.meta.chapter);

  // Find previous and next chapters
  const currentIndex = allChapters.findIndex(c => c === chapterData.meta.chapter);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  // Generate content HTML (paragraphs and tables)
  let contentHTML = '';
  let footnotes = [];
  let footnoteCounter = 1;
  let tableCounter = 1;

  for (let i = 0; i < chapterData.content.length; i++) {
    const block = chapterData.content[i];
    const qingDraftTableRun = tableLikeBlocksForQingDraft(bookId, chapterNum, chapterData.content, i);
    if (qingDraftTableRun) {
      const tableTitle = `Table ${tableCounter}`;
      tableCounter++;

      const footnoteContext = { footnotes, footnoteCounter };
      const zhRows = qingDraftTableRun.blocks
        .map(tableBlock => renderTableBodyRow(tableBlock, 'zh', null, chapterPeople)).join('');
      const enRows = qingDraftTableRun.blocks
        .map(tableBlock => renderTableBodyRow(tableBlock, 'en', footnoteContext, chapterPeople)).join('');
      footnoteCounter = footnoteContext.footnoteCounter;

      contentHTML += `<div class="tabular-content" id="p-${i}" data-paragraph="${i}" style="margin: 5rem 0;">
            <!-- Table citation button -->
            <div class="table-citation-header">
                <button class="cite-table-btn" data-table="${tableCounter - 1}" title="Cite this table">📋 ${tableTitle}</button>
            </div>

            <!-- Chinese table -->
            <div class="table-container chinese-table">
              <div class="table-scroll">
                <table class="genealogical-table">
                  <tbody>${zhRows}</tbody>
                </table>
              </div>
            </div>

            <!-- English table -->
            <div class="table-container english-table">
              <div class="table-scroll">
                <table class="genealogical-table">
                  <tbody>${enRows}</tbody>
                </table>
              </div>
            </div>
          </div>`;

      i = qingDraftTableRun.endIndex;
      continue;
    }

    // Handle tables without headers (consecutive table_row blocks)
    if (block.type === 'table_row') {
      // Check if this is the start of a table (not following a table_header)
      let tableRows = [block];
      let j = i + 1;
      while (j < chapterData.content.length && chapterData.content[j].type === 'table_row') {
        tableRows.push(chapterData.content[j]);
        j++;
      }

      if (tableRows.length > 0) {
        // Create table without header - use generic title
        const tableTitle = `Table ${tableCounter}`;
        tableCounter++;

        let tableHtml = `<div class="tabular-content" id="p-${i}" data-paragraph="${i}" style="margin: 5rem 0;">
            <!-- Table citation button -->
            <div class="table-citation-header">
                <button class="cite-table-btn" data-table="${tableCounter - 1}" title="Cite this table">📋 ${tableTitle}</button>
            </div>

            <!-- Chinese table -->
            <div class="table-container chinese-table">
              <div class="table-scroll">
                <table class="genealogical-table">
                  <tbody>`;

        tableRows.forEach(tableRow => {
          tableHtml += `<tr>`;
          tableRow.cells.forEach(cell => {
            tableHtml += renderTableCell(cell, cell.content, 'zh', chapterPeople);
          });
          tableHtml += `</tr>`;
        });

        tableHtml += `</tbody>
                </table>
              </div>
            </div>

            <!-- English table -->
            <div class="table-container english-table">
              <div class="table-scroll">
                <table class="genealogical-table">
                  <tbody>`;

        tableRows.forEach(tableRow => {
          tableHtml += `<tr>`;
          tableRow.cells.forEach(cell => {
            const cellEnText = getTableCellEnglish(cell);
            tableHtml += renderTableCell(cell, cellEnText, 'en', chapterPeople);
          });
          tableHtml += `</tr>`;
        });

        tableHtml += `</tbody>
                </table>
              </div>
            </div>
          </div>`;

        contentHTML += tableHtml;

        // Skip the table rows we just processed
        i = j - 1;
        continue;
      }
    }

    if (block.type === 'paragraph') {
      const visibleSentences = (block.sentences || []).filter(s => (s.zh || '').trim() || getSentenceEnglish(s).trim());
      if (visibleSentences.length === 0) {
        continue;
      }
      const paraNum = i + 1;

      // Chinese text - create sentence spans with word segmentation
      const zhSentences = visibleSentences.map(s => {
        const id = s.id;
        const linkedText = renderUnitWithPeople({
          unitId: id,
          text: s.zh,
          language: 'zh',
          chapterContext: chapterPeople,
        });
        return `<span class="sentence" id="${peopleSentenceAnchor('zh', id)}" ` +
          `data-sentence-id="${escapeHtml(id)}">${linkedText}</span>`;
      }).join(' ');

      // English text - create sentence spans with translations
      const enSentences = visibleSentences.map(s => {
        const id = s.id;
        const sentenceEnglish = getSentenceEnglish(s);
        const translation = s.translations && s.translations.length > 0 ? s.translations[0] : null;

        let text = '';
        if (sentenceEnglish) {
          text = renderUnitWithPeople({
            unitId: id,
            text: sentenceEnglish,
            language: 'en',
            chapterContext: chapterPeople,
          });

          const footnote = addFootnote(translation, footnotes, footnoteCounter);
          footnoteCounter = footnote.footnoteCounter;
          text += footnote.marker;
        } else if (translation?.footnote) {
          const footnote = addFootnote(translation, footnotes, footnoteCounter);
          footnoteCounter = footnote.footnoteCounter;
          text = footnote.marker;
        } else {
          text = '(No translation available)';
        }

        return `<span class="sentence" id="${peopleSentenceAnchor('en', id)}" ` +
          `data-sentence-id="${escapeHtml(id)}">${text}</span>`;
      }).join(' ');

      // No special styling for concluding paragraph - display like any other paragraph

      contentHTML += `
        <div class="paragraph-block" id="p-${i}" data-paragraph="${i}">
          <div class="paragraph-number">${paraNum}</div>
          <div class="paragraph-content">
            <div class="paragraph chinese">
              <div class="chinese-text">${zhSentences}</div>
            </div>
            <div class="paragraph english">
              <div class="english-text">${enSentences}</div>
            </div>
          </div>
          <button class="cite-paragraph-btn" data-paragraph="${i}" title="Cite this paragraph">📋</button>
        </div>`;
    } else if (block.type === 'table_header') {
      // Check if this is followed by table_row blocks - if so, create toggleable tables
      let tableRows = [];
      let j = i + 1;
      while (j < chapterData.content.length && chapterData.content[j].type === 'table_row') {
        tableRows.push(chapterData.content[j]);
        j++;
      }

      if (tableRows.length > 0) {
        // Generate header rows from table_header sentences
        const zhHeaderRow = block.sentences
          .map(s => renderTableHeaderCell(s, s.zh, 'zh', chapterPeople)).join('');
        const enHeaderRow = block.sentences.map(s => {
          const translation = s.translations && s.translations.length > 0 ? s.translations[0] : null;
          if (!translation || (!translation.idiomatic && !translation.literal && !translation.footnote)) {
            return renderTableHeaderCell(s, '', 'en', chapterPeople);
          }

          const text = translation.idiomatic || translation.literal || '';

          const footnote = addFootnote(translation, footnotes, footnoteCounter);
          footnoteCounter = footnote.footnoteCounter;
          return renderTableHeaderCell(s, text, 'en', chapterPeople, footnote.marker);
        }).join('');

        const tableTitle = `Table ${tableCounter}`;
        tableCounter++;

        let tableHtml = `<div class="tabular-content" id="p-${i}" data-paragraph="${i}" style="margin: 5rem 0;">
            <!-- Table citation button -->
            <div class="table-citation-header">
                <button class="cite-table-btn" data-table="${tableCounter - 1}" title="Cite this table">📋 ${tableTitle}</button>
            </div>

            <!-- Chinese table -->
            <div class="table-container chinese-table">
                <div class="table-scroll">
                <table class="genealogical-table">
                  <thead>
                    <tr>${zhHeaderRow}</tr>
                  </thead>
                  <tbody>`;

        tableRows.forEach(tableRow => {
          tableHtml += `<tr>`;
          tableRow.cells.forEach(cell => {
            tableHtml += renderTableCell(cell, cell.content, 'zh', chapterPeople);
          });
          tableHtml += `</tr>`;
        });

        tableHtml += `</tbody>
                </table>
              </div>
            </div>

            <!-- English table -->
            <div class="table-container english-table">
              <div class="table-scroll">
                <table class="genealogical-table">
                  <thead>
                    <tr>${enHeaderRow}</tr>
                  </thead>
                  <tbody>`;

        tableRows.forEach(tableRow => {
          tableHtml += `<tr>`;
          tableRow.cells.forEach(cell => {
            const cellEnText = getTableCellEnglish(cell);
            tableHtml += renderTableCell(cell, cellEnText, 'en', chapterPeople);
          });
          tableHtml += `</tr>`;
        });

        tableHtml += `</tbody>
                </table>
              </div>
            </div>
          </div>`;

        contentHTML += tableHtml;

        // Skip the table rows we just processed
        i = j - 1;
      } else {
        const tableTitle = `Table ${tableCounter}`;
        tableCounter++;
        const footnoteContext = { footnotes, footnoteCounter };
        const zhRow = renderTableBodyRow(block, 'zh', null, chapterPeople);
        const enRow = renderTableBodyRow(block, 'en', footnoteContext, chapterPeople);
        footnoteCounter = footnoteContext.footnoteCounter;

        contentHTML += `<div class="tabular-content" id="p-${i}" data-paragraph="${i}" style="margin: 5rem 0;">
            <!-- Table citation button -->
            <div class="table-citation-header">
                <button class="cite-table-btn" data-table="${tableCounter - 1}" title="Cite this table">📋 ${tableTitle}</button>
            </div>

            <!-- Chinese table -->
            <div class="table-container chinese-table">
              <div class="table-scroll">
                <table class="genealogical-table">
                  <tbody>${zhRow}</tbody>
                </table>
              </div>
            </div>

            <!-- English table -->
            <div class="table-container english-table">
              <div class="table-scroll">
                <table class="genealogical-table">
                  <tbody>${enRow}</tbody>
                </table>
              </div>
            </div>
          </div>`;
      }
    } else {
      // Just a header without table rows
      const zhText = block.sentences.map((sentence) =>
        `<span class="sentence" id="${peopleSentenceAnchor('zh', sentence.id)}" ` +
        `data-sentence-id="${escapeHtml(sentence.id)}">${renderUnitWithPeople({
          unitId: sentence.id,
          text: sentence.zh,
          language: 'zh',
          chapterContext: chapterPeople,
        })}</span>`
      ).join('');
      const enText = block.sentences.map((sentence) => {
        const text = getSentenceEnglish(sentence);
        if (!text) return '';
        return `<span class="sentence" id="${peopleSentenceAnchor('en', sentence.id)}" ` +
          `data-sentence-id="${escapeHtml(sentence.id)}">${renderUnitWithPeople({
            unitId: sentence.id,
            text,
            language: 'en',
            chapterContext: chapterPeople,
          })}</span>`;
      }).filter(Boolean).join(' ');

      contentHTML += `
          <div class="table-header-block">
            <h3 class="table-title">
              <span class="chinese-text">${zhText}</span>
              ${enText ? `<span class="english-text">${enText}</span>` : ''}
            </h3>
          </div>`;
    }
  }

  const chapterSlug = String(chapterData.meta.chapter).padStart(3, '0');
  const chapterUrl = canonicalUrlForHtmlFile(CANONICAL_SITE, `${bookId}/${chapterSlug}.html`);
  const ogImageUrl = `${CANONICAL_SITE}/og/chapters/${bookId}/${chapterSlug}.png`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}">
    <link rel="icon" type="image/x-icon" href="../favicon.ico">
    <link rel="stylesheet" href="../styles.css?v=20260527-book-colors">
    <link rel="canonical" href="${chapterUrl}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${escapeHtml(meta.title)}">
    <meta property="og:description" content="${escapeHtml(meta.description)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${chapterUrl}">
    <meta property="og:image" content="${ogImageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(meta.title)}">
    <meta name="twitter:description" content="${escapeHtml(meta.description)}">
    <meta name="twitter:image" content="${ogImageUrl}">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
${JSON.stringify(structuredData, null, 2)}
    </script>
    
    <style>
      .static-content {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
      }
      .paragraph-block {
        display: grid;
        grid-template-columns: 40px 1fr 40px;
        gap: 1rem;
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid #eee;
      }
      .paragraph-number {
        color: #999;
        font-size: 0.85rem;
        text-align: right;
        padding-top: 0.25rem;
      }
      .paragraph-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
      .paragraph.chinese {
        grid-column: 1;
      }
      .paragraph.english {
        grid-column: 2;
      }
      .paragraph.chinese .chinese-text {
        font-size: 1.1rem;
        line-height: 1.8;
        color: #2c3e50;
      }
      .paragraph.english .english-text {
        font-size: 1rem;
        line-height: 1.7;
        color: #34495e;
      }
      .sentence {
        display: inline;
        margin-right: 0.25em;
        scroll-margin-top: 7rem;
      }
      .sentence:target {
        background: #fff2b2;
        box-shadow: 0 0 0 2px #fff2b2;
      }
      .person-link {
        color: #0b57a2;
        text-decoration: underline;
        text-decoration-color: rgba(11, 87, 162, 0.35);
        text-underline-offset: 0.12em;
      }
      .person-link:hover,
      .person-link:focus-visible {
        color: #073b70;
        text-decoration-color: currentColor;
      }
      .cite-paragraph-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0.3;
        transition: opacity 0.2s;
        padding: 0;
        height: fit-content;
      }
      .cite-paragraph-btn:hover {
        opacity: 1;
      }
      .nav-btn {
        display: inline-block;
        padding: 0.5rem 1rem;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        text-decoration: none;
        color: #1a5490;
        font-weight: 500;
        transition: all 0.2s ease;
      }
      .nav-btn:hover:not(.disabled) {
        background: #e3f2fd;
        border-color: #1a5490;
      }
      .nav-btn.disabled {
        color: #999;
        cursor: not-allowed;
        opacity: 0.5;
      }
      .table-row-block {
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid #eee;
      }
      .table-row-header {
        background: #f8f9fa;
        padding: 0.75rem 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        font-weight: 600;
        color: #2c3e50;
        border-left: 4px solid #3498db;
      }
      .table-row-content {
        overflow-x: auto;
      }
      .tabular-content {
        margin: 2rem 0;
        border-top: 1px solid #e1e8ed;
        padding-top: 1rem;
      }
      .tabular-content h3 {
        margin: 0 0 1rem 0;
        color: #2c3e50;
        font-size: 1.2rem;
      }
      .table-scroll {
        overflow-x: auto;
        max-height: 80vh;
      }
      .table-pair {
        display: grid;
        grid-template-columns: 1fr 1px 1fr;
        gap: 1rem;
      }
      .table-half {
        display: flex;
        flex-direction: column;
      }
      .table-half .table-title {
        margin-bottom: 1rem;
        color: #2c3e50;
        font-size: 1.1rem;
        font-weight: 600;
      }
      .genealogical-table {
        width: 100%;
        border-collapse: collapse;
        margin: 0;
        font-size: 0.85rem;
        min-width: 1200px;
      }
      .genealogical-table thead {
        display: table-header-group;
      }
      .genealogical-table thead th {
        padding: 0.75rem 0.25rem;
        background: #2c3e50 !important;
        color: white !important;
        font-weight: 600;
        text-align: center;
        border: 1px solid #dee2e6;
        position: sticky;
        top: 0;
        z-index: 10;
        font-size: 14px !important;
        display: table-cell;
      }
      .footnote-marker {
        color: #e74c3c;
        font-weight: bold;
        cursor: pointer;
        text-decoration: none;
        font-size: 0.8em;
        vertical-align: super;
        margin-left: 0.1em;
      }
      .footnote-marker:hover {
        color: #c0392b;
      }
      .footnotes-section {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid #dee2e6;
      }
      .footnotes-section h3 {
        color: #2c3e50;
        font-size: 1.2rem;
        margin-bottom: 1rem;
      }
      .footnotes-list {
        padding-left: 1.5rem;
      }
      .footnotes-list li {
        margin-bottom: 0.5rem;
        line-height: 1.4;
      }
      .genealogical-table td {
        padding: 0.5rem 0.25rem;
        border: 1px solid #dee2e6;
        vertical-align: top;
        text-align: center;
        min-height: 3rem;
      }
      .genealogical-table .table-cell {
        min-width: 80px;
        padding: 0.5rem;
      }
      .genealogical-table .empty-cell {
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
      }
      .genealogical-table th {
        background-color: #f8f9fa;
        font-weight: bold;
        border: 1px solid #dee2e6;
        padding: 8px;
        text-align: center;
        position: sticky;
        top: 0;
        z-index: 10;
      }
      .view-controls {
        display: flex;
        gap: 0.5rem;
      }
      .view-btn {
        padding: 0.5rem 1rem;
        border: 1px solid rgba(255,255,255,0.3);
        background: rgba(255,255,255,0.1);
        color: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s;
      }
      .view-btn.active {
        background: rgba(255,255,255,0.2);
        border-color: rgba(255,255,255,0.5);
      }
      .view-btn:hover {
        background: rgba(255,255,255,0.15);
      }

      .tabular-content {
        margin: 2rem 0;
        border-top: 1px solid #e1e8ed;
        padding-top: 1rem;
      }
      .table-container {
        display: none;
      }
      .tabular-content.show-both .chinese-table,
      .tabular-content.show-both .english-table,
      .tabular-content.show-chinese .chinese-table,
      .tabular-content.show-english .english-table {
        display: block;
        width: 100%;
        float: none;
      }
      .table-header-block {
        margin-bottom: 2rem;
        text-align: center;
      }
      .table-title {
        font-size: 1.5rem;
        color: #2c3e50;
        margin: 0;
        padding: 1rem 0;
        border-bottom: 2px solid #3498db;
      }
      .table-title .english-text {
        display: block;
        font-size: 1rem;
        color: #7f8c8d;
        font-weight: normal;
        margin-top: 0.25rem;
      }
      @media (max-width: 768px) {
        .paragraph-content {
          grid-template-columns: 1fr;
        }
        .paragraph-block {
          grid-template-columns: 30px 1fr 30px;
        }
        .genealogical-table .chinese-cell,
        .genealogical-table .english-cell {
          display: block;
          width: 100%;
        }
        .genealogical-table {
          margin-bottom: 1rem;
        }
      }
      @media (max-width: 480px) {
        .static-content {
          padding: 1rem 0.5rem;
        }
        .paragraph-block {
          grid-template-columns: 24px 1fr 24px;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
        }
        .paragraph-number {
          font-size: 0.75rem;
          padding-top: 0.1rem;
        }
        .paragraph-content {
          gap: 0.75rem;
        }
        .paragraph.chinese {
          grid-column: 1;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .paragraph.english {
          grid-column: 1;
          padding-top: 0.75rem;
        }
        .cite-paragraph-btn {
          font-size: 0.65rem;
          padding: 0.2rem 0.4rem;
          margin-left: 0.25rem;
        }
      }
    </style>
    <script type="module" src="../reader.js?v=20260527-book-colors"></script>
</head>
<body data-book="${escapeHtml(bookId)}" style="--book-color: ${escapeHtml(theme.color)}; --book-color-deep: ${escapeHtml(theme.deep)};">
    <header style="padding: 1.5rem 2rem; background: linear-gradient(135deg, var(--book-color) 0%, var(--book-color-deep) 100%);">
        <div style="max-width: 1400px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                <a href="../book/${bookId}.html" class="back-link" style="color: white; opacity: 0.9;">← Back to ${book.chinese}</a>
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <div class="view-controls">
                        <button class="view-btn active" data-view="both">Both</button>
                        <button class="view-btn" data-view="chinese">中文</button>
                        <button class="view-btn" data-view="english">English</button>
                    </div>
                    <button id="cite-chapter-btn" class="cite-btn" title="Cite this chapter">
                        📋 Cite
                    </button>
                </div>
            </div>
            <div class="chapter-title" style="border: none; padding: 0; margin-top: 1rem;">
                <h1 style="color: white; margin: 0; font-size: 1.8rem;" class="chapter-title-text chinese-text">${escapeHtml(zhTitle)}</h1>
                ${enTitle ? `<h2 style="color: rgba(255,255,255,0.9); margin: 0.25rem 0 0 0; font-size: 1.2rem; font-weight: 400;" class="chapter-title-text english-text">${escapeHtml(enTitle)}</h2>` : ''}
                <div class="subtitle" style="color: rgba(255,255,255,0.8);">
                  Chapter ${chapterNum} of ${book.chinese} · ${escapeHtml(book.name)}
                </div>
            </div>
        </div>
    </header>

    <main class="static-content">
        <div class="chapter-navigation" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #dee2e6;">
            <div>
                ${prevChapter ? `<a href="${prevChapter}.html" class="nav-btn prev-btn">← Previous Chapter</a>` : '<span class="nav-btn disabled">← Previous Chapter</span>'}
            </div>
            <div style="color: #666; font-size: 0.9rem;">Chapter ${chapterNum}</div>
            <div>
                ${nextChapter ? `<a href="${nextChapter}.html" class="nav-btn next-btn">Next Chapter →</a>` : '<span class="nav-btn disabled">Next Chapter →</span>'}
            </div>
        </div>

${contentHTML}

        ${footnotes.length > 0 ? `
        <div class="footnotes-section" style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #dee2e6;">
            <h3 style="margin-bottom: 1rem; color: #2c3e50;">Footnotes</h3>
            <ol class="footnotes-list" style="padding-left: 1.5rem;">
                ${footnotes.map(fn => `<li id="footnote-${fn.number}" style="margin-bottom: 0.5rem;">${escapeHtml(fn.text)}</li>`).join('')}
            </ol>
        </div>
        ` : ''}

        <div class="chapter-navigation" style="display: flex; justify-content: space-between; align-items: center; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #dee2e6;">
            <div>
                ${prevChapter ? `<a href="${prevChapter}.html" class="nav-btn prev-btn">← Previous Chapter</a>` : '<span class="nav-btn disabled">← Previous Chapter</span>'}
            </div>
            <div>
                <a href="../book/${bookId}.html" class="nav-btn">Back to Chapters</a>
            </div>
            <div>
                ${nextChapter ? `<a href="${nextChapter}.html" class="nav-btn next-btn">Next Chapter →</a>` : '<span class="nav-btn disabled">Next Chapter →</span>'}
            </div>
        </div>

        ${kindleProduct ? kindleInlineCalloutHtml({ bookId, variant: 'chapter', intro: kindleIntro }) : ''}
    </main>

    ${siteFooter('../')}

    <!-- Citation Modal -->
    <div id="citation-modal" class="modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="citation-title">Cite this Chapter</h3>
                <button class="modal-close" id="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="citation-tabs">
                    <button class="citation-tab active" data-format="chicago">Chicago</button>
                    <button class="citation-tab" data-format="apa">APA</button>
                    <button class="citation-tab" data-format="mla">MLA</button>
                    <button class="citation-tab" data-format="bibtex">BibTeX</button>
                </div>
                <div class="citation-content">
                    <textarea id="citation-text" readonly></textarea>
                    <button id="copy-citation" class="btn-primary">Copy to Clipboard</button>
                </div>
            </div>
        </div>
    </div>

    <script>
      // Embed chapter data for citations
      window.currentChapterData = ${JSON.stringify(chapterData)};
      window.currentBookInfo = ${JSON.stringify(book)};
      window.currentBookId = '${bookId}';

      // Simple citation functions for static pages
      function generateCitation(format, type, paragraphIdx, block) {
        const book = window.currentBookInfo;
        const chapterNum = window.currentChapterData.meta.chapter;
        const chapterTitle = window.currentChapterData.meta.title.en || window.currentChapterData.meta.title.zh || ('Chapter ' + chapterNum);
        const author = book.author || 'Unknown';

        const baseCitation = author + '. "' + chapterTitle + '." In ' + book.name + ' (' + book.chinese + '), translated by Garrett M. Petersen, 2026.';

        if (type === 'paragraph' && paragraphIdx !== null) {
          return baseCitation + ' Paragraph ' + (paragraphIdx + 1) + '.';
        }

        return baseCitation;
      }

      function openCitationModal(type, paragraphIdx = null, block = null) {
        const modal = document.getElementById('citation-modal');
        const title = document.getElementById('citation-title');
        const citationText = document.getElementById('citation-text');

        title.textContent = type === 'chapter' ? 'Cite this Chapter' : ('Cite Paragraph ' + (paragraphIdx + 1));

        // Store citation context
        modal.dataset.citationType = type;
        modal.dataset.paragraphIdx = paragraphIdx;
        if (block) {
          modal.dataset.blockData = JSON.stringify(block);
        }

        // Generate initial citation (Chicago)
        const initialCitation = generateCitation('chicago', type, paragraphIdx, block);
        citationText.value = initialCitation;

        // Set active tab
        document.querySelectorAll('.citation-tab').forEach(tab => {
          tab.classList.remove('active');
          if (tab.dataset.format === 'chicago') {
            tab.classList.add('active');
          }
        });

        modal.style.display = 'flex';
      }

      function setupCitationModal() {
        const modal = document.getElementById('citation-modal');
        const closeBtn = document.getElementById('close-modal');
        const copyBtn = document.getElementById('copy-citation');
        const citationText = document.getElementById('citation-text');
        const tabs = document.querySelectorAll('.citation-tab');

        // Close modal
        closeBtn.onclick = () => modal.style.display = 'none';
        modal.onclick = (e) => {
          if (e.target === modal) modal.style.display = 'none';
        };

        // Copy citation
        copyBtn.onclick = () => {
          citationText.select();
          navigator.clipboard.writeText(citationText.value).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓ Copied!';
            setTimeout(() => {
              copyBtn.textContent = originalText;
            }, 2000);
          }).catch(() => {
            // Fallback for older browsers
            citationText.select();
            document.execCommand('copy');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓ Copied!';
            setTimeout(() => {
              copyBtn.textContent = originalText;
            }, 2000);
          });
        };

        // Tab switching
        tabs.forEach(tab => {
          tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const format = tab.dataset.format;
            const type = modal.dataset.citationType;
            const paragraphIdx = parseInt(modal.dataset.paragraphIdx);
            const block = modal.dataset.blockData ? JSON.parse(modal.dataset.blockData) : null;

            citationText.value = generateCitation(format, type, paragraphIdx, block);
          };
        });
      }
      
      // Initialize citation functionality for static pages
      document.addEventListener('DOMContentLoaded', () => {
        // Set up chapter citation button
        const citeChapterBtn = document.getElementById('cite-chapter-btn');
        if (citeChapterBtn) {
          citeChapterBtn.addEventListener('click', () => {
            openCitationModal('chapter');
          });
        }
        
        // Set up paragraph citation buttons
        const citeParagraphBtns = document.querySelectorAll('.cite-paragraph-btn');
        citeParagraphBtns.forEach(btn => {
          const paragraphIdx = parseInt(btn.dataset.paragraph, 10);
          const block = window.currentChapterData.content[paragraphIdx];
          if (block) {
            btn.addEventListener('click', () => {
              openCitationModal('paragraph', paragraphIdx, block);
            });
          }
        });
        
        // Set up citation modal close and copy buttons
        setupCitationModal();

        // Set up view controls
        const viewBtns = document.querySelectorAll('.view-btn');
        const contentContainer = document.querySelector('.static-content');

        // Initialize default view (both) for all tables
        const tabularContents = document.querySelectorAll('.tabular-content');
        if (tabularContents.length > 0) {
          tabularContents.forEach(tabularContent => {
            tabularContent.classList.add('show-both');
          });
          contentContainer.style.gridTemplateColumns = '1fr 1px 1fr';
          document.querySelectorAll('.chinese-text, .english-text').forEach(el => el.style.display = 'block');
        }

        viewBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const view = btn.dataset.view;

            // Update active button
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update paragraph content visibility and layout
            if (view === 'both') {
              contentContainer.style.gridTemplateColumns = '1fr 1px 1fr';
              document.querySelectorAll('.paragraph-content').forEach(el => el.style.gridTemplateColumns = '1fr 1fr');
              document.querySelectorAll('.chinese-text, .english-text').forEach(el => el.style.display = 'block');
            } else if (view === 'chinese') {
              contentContainer.style.gridTemplateColumns = '1fr';
              document.querySelectorAll('.paragraph-content').forEach(el => el.style.gridTemplateColumns = '1fr');
              document.querySelectorAll('.chinese-text').forEach(el => el.style.display = 'block');
              document.querySelectorAll('.english-text').forEach(el => el.style.display = 'none');
            } else if (view === 'english') {
              contentContainer.style.gridTemplateColumns = '1fr';
              document.querySelectorAll('.paragraph-content').forEach(el => el.style.gridTemplateColumns = '1fr');
              document.querySelectorAll('.chinese-text').forEach(el => el.style.display = 'none');
              document.querySelectorAll('.english-text').forEach(el => el.style.display = 'block');
            }

            // Update table views (all tables on the page)
            const tabularContents = document.querySelectorAll('.tabular-content');
            tabularContents.forEach(tabularContent => {
              // Remove all view classes
              tabularContent.classList.remove('show-both', 'show-chinese', 'show-english');
              // Add the appropriate view class
              tabularContent.classList.add('show-' + view);
            });
          });
        });

        // Set up footnote functionality
        const footnoteMarkers = document.querySelectorAll('.footnote-marker');
        footnoteMarkers.forEach(marker => {
          marker.addEventListener('click', (e) => {
            e.preventDefault();
            const footnoteNum = marker.dataset.footnote;
            const footnoteElement = document.getElementById('footnote-' + footnoteNum);
            if (footnoteElement) {
              footnoteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              footnoteElement.style.backgroundColor = '#fff3cd';
              setTimeout(() => {
                footnoteElement.style.backgroundColor = '';
              }, 2000);
            }
          });
        });

      });
    </script>
    <div id="tooltip" class="tooltip" style="display: none;"></div>
</body>
</html>`;
}

async function generateStaticPages(
  bookId = null,
  chapterNum = null,
  outputDir = path.join(__dirname, 'public'),
  peopleAnnotatedOnly = false,
) {
  const dataDir = path.join(__dirname, 'data');

  // Get list of books to process
  if (peopleAnnotatedOnly && !PEOPLE_SITE.active) {
    throw new Error('--people-annotated requires an active people catalog or PEOPLE_SITE_PREVIEW=1');
  }
  const annotatedChapters = peopleAnnotatedOnly
    ? Object.values(PEOPLE_SITE.siteIndex.chapters)
    : [];
  let booksToProcess = Object.keys(BOOKS);
  if (peopleAnnotatedOnly) {
    booksToProcess = [...new Set(annotatedChapters.map((chapter) => chapter.book))].sort();
  }
  if (bookId) booksToProcess = [bookId];

  let totalGenerated = 0;

  console.log(
    `(STATIC_GEN_CONCURRENCY=${STATIC_GEN_CONCURRENCY}${
      STATIC_GEN_FROM_ENV ? '' : ` auto from ${hardwareConcurrency()} logical`
    })`,
  );
  console.log(
    PEOPLE_SITE.active
      ? `People links: ${PEOPLE_SITE.preview ? 'preview' : 'publication'} mode`
      : `People links: disabled (${PEOPLE_SITE.reason})`,
  );

  for (const book of booksToProcess) {
    if (!BOOKS[book]) {
      console.error(`Unknown book: ${book}`);
      continue;
    }

    const bookDataDir = path.join(dataDir, book);
    if (!fs.existsSync(bookDataDir)) {
      console.error(`Data directory not found: ${bookDataDir}`);
      continue;
    }

    // Create output directory for this book
    const bookOutputDir = path.join(outputDir, book);
    if (!fs.existsSync(bookOutputDir)) {
      fs.mkdirSync(bookOutputDir, { recursive: true });
    }

    // Get chapters to process
    let chapterFiles = fs.readdirSync(bookDataDir).filter(f => f.endsWith('.json'));
    if (peopleAnnotatedOnly) {
      chapterFiles = annotatedChapters
        .filter((chapter) => chapter.book === book)
        .map((chapter) => `${chapter.chapter}.json`)
        .sort();
    }
    if (chapterNum) chapterFiles = [`${String(chapterNum).padStart(3, '0')}.json`];

    console.log(`\nGenerating static pages for ${book}...`);

    // Get all chapter numbers sorted
    const allChapterNums = fs.readdirSync(bookDataDir)
      .filter(f => f.endsWith('.json'))
      .map(f => path.basename(f, '.json'))
      .sort();

    await runPool(chapterFiles, STATIC_GEN_CONCURRENCY, async (file) => {
      const chapterPath = path.join(bookDataDir, file);
      const chapterData = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));

      const chapterNumStr = path.basename(file, '.json');
      const outputPath = path.join(bookOutputDir, `${chapterNumStr}.html`);

      const html = generateChapterHTML(book, chapterData, allChapterNums);
      fs.writeFileSync(outputPath, html, 'utf8');

      const translationPercent = chapterData.meta.sentenceCount > 0
        ? Math.round((chapterData.meta.translatedCount / chapterData.meta.sentenceCount) * 100)
        : 0;

      console.log(`  ✓ ${chapterNumStr}.html (${translationPercent}% translated)`);
      return 1;
    });
    totalGenerated += chapterFiles.length;

    const bookHubDir = path.join(outputDir, 'book');
    if (!fs.existsSync(bookHubDir)) {
      fs.mkdirSync(bookHubDir, { recursive: true });
    }
    const bookHubHtml = generateBookLandingHTML(book);
    if (bookHubHtml) {
      fs.writeFileSync(path.join(bookHubDir, `${book}.html`), bookHubHtml, 'utf8');
      console.log(`  ✓ book/${book}.html`);
    }
  }

  console.log(`\n✅ Generated ${totalGenerated} static HTML pages`);
  console.log(`Output directory: ${path.join(outputDir)}`);
}

// Parse command line arguments
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage:
  node generate-static-pages.js                    Generate all chapters for all books
  node generate-static-pages.js --book <book-id>   Generate all chapters for one book
  node generate-static-pages.js --book <book-id> --chapter <num>
  node generate-static-pages.js --output-dir <path>
  node generate-static-pages.js --people-annotated --output-dir <path>

Automatically discovers all books from the data directory.
--people-annotated emits only chapters present in the generated people site index.

Examples:
  node generate-static-pages.js
  node generate-static-pages.js --book shiji
  node generate-static-pages.js --book shiji --chapter 006
`);
    process.exit(0);
  }

  let bookId = null;
  let chapterNum = null;
  let outputDir = path.join(__dirname, 'public');
  const peopleAnnotatedOnly = args.includes('--people-annotated');

  const bookIdx = args.indexOf('--book');
  if (bookIdx !== -1 && bookIdx + 1 < args.length) {
    bookId = args[bookIdx + 1];
  }

  const chapterIdx = args.indexOf('--chapter');
  if (chapterIdx !== -1 && chapterIdx + 1 < args.length) {
    chapterNum = args[chapterIdx + 1];
  }

  const outputIdx = args.indexOf('--output-dir');
  if (outputIdx !== -1 && outputIdx + 1 < args.length) {
    outputDir = path.resolve(__dirname, args[outputIdx + 1]);
  }

  await generateStaticPages(bookId, chapterNum, outputDir, peopleAnnotatedOnly);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
