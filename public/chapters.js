// Keep ?v= in sync with book hub HTML from generate-static-pages.js (chapters.js script tag).
import {
  loadManifest,
  buildHistoryCardInnerHtml,
  chapterTranslationSummary,
  translationStatusTooltip,
  matchesSearchQuery,
  normalizeForSearch,
  escapeHtml,
} from './app.js?v=20260430-searchrank';

const BOOK_SEARCH_BODY_MAX = 48;
const SNIPPET_MAX_ZH = 140;
const SNIPPET_MAX_EN = 160;

/** @type {Map<string, Promise<object|null>>} */
const corpusLoadPromises = new Map();

function corpusUrl(bookId) {
  return `/data/search-corpus/${encodeURIComponent(bookId)}.json`;
}

/**
 * @param {string} bookId
 * @returns {Promise<object|null>}
 */
function loadSearchCorpus(bookId) {
  if (corpusLoadPromises.has(bookId)) return corpusLoadPromises.get(bookId);
  const p = fetch(corpusUrl(bookId))
    .then((res) => {
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .catch(() => null);
  corpusLoadPromises.set(bookId, p);
  return p;
}

/** @param {string} chKey */
function chapterFilePad(chKey) {
  if (/^\d+$/.test(chKey)) return String(parseInt(chKey, 10)).padStart(3, '0');
  return chKey;
}

/** @param {string} rawQuery */
function searchTokens(rawQuery) {
  const q = normalizeForSearch(rawQuery);
  return q.split(/\s+/).filter(Boolean);
}

/** @param {string} t */
function isCjkToken(t) {
  return /[\u4e00-\u9fff]/.test(t);
}

/**
 * @param {string} zh
 * @param {string} en
 * @param {string[]} tokens normalized tokens
 * @param {string} chapterTitleLine
 * @param {string} rawQuery
 */
function bodyHitScore(zh, en, tokens, chapterTitleLine, rawQuery) {
  const zhN = normalizeForSearch(zh);
  const enN = normalizeForSearch(en);
  const nTok = tokens.length;
  const len = zhN.length + enN.length + 4;

  let score = 0;
  let matchedZh = 0;
  let matchedEn = 0;

  for (const t of tokens) {
    const iz = zhN.includes(t);
    const ie = enN.includes(t);
    if (iz) matchedZh += 1;
    if (ie) matchedEn += 1;
    if (iz) score += isCjkToken(t) ? 12 : 7;
    if (ie) score += isCjkToken(t) ? 7 : 11;
    if (iz && ie) score += 4;
  }

  const strictZh = matchedZh === nTok && matchedEn === 0;
  const strictEn = matchedEn === nTok && matchedZh === 0;
  const allZh = matchedZh === nTok;
  const allEn = matchedEn === nTok;
  if (strictZh) score += 95;
  else if (strictEn) score += 78;
  else if (allZh) score += 52;
  else if (allEn) score += 44;
  else score += 12;

  score += (nTok * 95) / Math.log10(len + 10);

  if (chapterTitleLine && matchesSearchQuery(chapterTitleLine, rawQuery)) {
    score += 58;
  }

  return score;
}

/**
 * @param {{ chPad: string, i: number, zh: string, en: string, score: number }[]} arr
 * @param {{ chPad: string, i: number, zh: string, en: string }} hit
 * @param {number} score
 * @param {number} max
 */
function insertTopHit(arr, hit, score, max) {
  const entry = { ...hit, score };
  if (arr.length < max) {
    arr.push(entry);
    arr.sort((a, b) => b.score - a.score);
    return;
  }
  const min = arr[arr.length - 1].score;
  if (score <= min) return;
  arr.push(entry);
  arr.sort((a, b) => b.score - a.score);
  arr.length = max;
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * NFC-normalized single line; indices for slicing match highlighting regex.
 * @param {string} rawText
 * @param {string[]} tokens raw query tokens (before normalize — pass original split from rawQuery)
 * @param {number} maxLen
 */
function snippetWithHighlights(rawText, rawTokens, maxLen) {
  const text = String(rawText || '')
    .replace(/\s+/g, ' ')
    .trim()
    .normalize('NFC');
  if (!text) return '';

  const norms = [...new Set(rawTokens.map((t) => normalizeForSearch(t)).filter(Boolean))].sort(
    (a, b) => b.length - a.length,
  );
  const hay = normalizeForSearch(text);

  let anchor = -1;
  let anchorLen = 1;
  for (const nt of norms) {
    const p = hay.indexOf(nt);
    if (p !== -1 && (anchor === -1 || p < anchor)) {
      anchor = p;
      anchorLen = Math.max(1, nt.length);
    }
  }

  if (anchor === -1) {
    return text.length > maxLen ? `${escapeHtml(text.slice(0, maxLen))}…` : escapeHtml(text);
  }

  const half = Math.floor(maxLen / 2);
  const center = anchor + Math.floor(anchorLen / 2);
  let start = Math.max(0, center - half);
  let end = Math.min(text.length, start + maxLen);
  if (end - start < maxLen) start = Math.max(0, end - maxLen);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < text.length ? '…' : '';
  const frag = text.slice(start, end);

  if (norms.length === 0) return prefix + escapeHtml(frag) + suffix;

  const inner = norms.map(escapeRegExp).join('|');
  const re = new RegExp(`(${inner})`, 'giu');
  const bits = frag.split(re);
  const html = bits
    .map((bit, i) =>
      i % 2 === 1
        ? `<mark class="book-chapter-search-mark">${escapeHtml(bit)}</mark>`
        : escapeHtml(bit),
    )
    .join('');
  return prefix + html + suffix;
}

/**
 * @param {string} zh
 * @param {string} en
 * @param {string[]} tokens normalized
 * @param {string[]} rawTokens original whitespace tokens for regex
 */
function buildSnippetPair(zh, en, tokens, rawTokens) {
  const zhN = normalizeForSearch(zh);
  const enN = normalizeForSearch(en);
  const zhRelevant = tokens.some((t) => zhN.includes(t));
  const enRelevant = tokens.some((t) => enN.includes(t));

  const zHtml = zhRelevant
    ? snippetWithHighlights(zh, rawTokens, SNIPPET_MAX_ZH)
    : zh.trim()
      ? `${escapeHtml(String(zh).replace(/\s+/g, ' ').trim().slice(0, 48))}${
          zh.length > 48 ? '…' : ''
        }`
      : '';

  const eHtml = enRelevant
    ? snippetWithHighlights(en, rawTokens, SNIPPET_MAX_EN)
    : en.trim()
      ? `${escapeHtml(String(en).replace(/\s+/g, ' ').trim().slice(0, 56))}${
          en.length > 56 ? '…' : ''
        }`
      : '';

  return { zhHtml: zHtml, enHtml: eHtml || '—' };
}

function injectBookChapterSearch(main) {
  if (!main || document.getElementById('book-chapter-search-input')) return;
  const wrap = document.createElement('div');
  wrap.className = 'book-chapter-search-wrap';
  wrap.innerHTML = `
    <label class="book-chapter-search-label" for="book-chapter-search-input">Search this book</label>
    <input type="search" id="book-chapter-search-input" class="book-chapter-search-input" autocomplete="off" placeholder="Chinese or English — chapter titles or full chapter text" />
    <p id="book-chapter-search-status" class="book-chapter-search-status" hidden></p>
    <div id="book-chapter-search-text-results" class="book-chapter-search-text-results" hidden></div>
    <p id="book-chapter-search-empty" class="book-chapter-search-empty" hidden>No matching chapters or passages.</p>
  `;
  const back = main.querySelector('.back-link');
  if (back) {
    back.insertAdjacentElement('afterend', wrap);
  } else {
    main.prepend(wrap);
  }
}

/**
 * @param {string} bookId
 * @param {HTMLElement} list
 */
function wireBookChapterSearch(bookId, list) {
  const input = document.getElementById('book-chapter-search-input');
  const emptyMsg = document.getElementById('book-chapter-search-empty');
  const statusEl = document.getElementById('book-chapter-search-status');
  const textResults = document.getElementById('book-chapter-search-text-results');
  if (!input || !list || !statusEl || !textResults) return;

  let debounceTimer = null;
  let runGeneration = 0;

  const apply = async () => {
    const myGen = ++runGeneration;
    const q = input.value;
    const active = normalizeForSearch(q).length > 0;

    if (!active) {
      for (const card of list.querySelectorAll('a.history-card')) {
        card.hidden = false;
      }
      if (emptyMsg) emptyMsg.hidden = true;
      statusEl.hidden = true;
      statusEl.textContent = '';
      textResults.hidden = true;
      textResults.innerHTML = '';
      return;
    }

    statusEl.hidden = false;
    statusEl.textContent = 'Loading full-text index…';
    textResults.hidden = true;
    textResults.innerHTML = '';

    const corpus = await loadSearchCorpus(bookId);
    if (myGen !== runGeneration) return;

    if (!corpus || !corpus.chapters) {
      statusEl.textContent =
        'Full-text search is not available for this book (index missing). Chapter titles still match.';
    } else {
      statusEl.hidden = true;
      statusEl.textContent = '';
    }

    /** @type {Map<string, string>} */
    const chapterMeta = new Map();
    for (const card of list.querySelectorAll('a.history-card')) {
      const ch = card.dataset.chapterFile;
      if (ch) chapterMeta.set(ch, card.dataset.searchText || '');
    }

    const tokens = searchTokens(q);
    const rawTokens = String(q || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    /** @type {Set<string>} */
    const chaptersWithBodyHit = new Set();
    /** @type {{ chPad: string, i: number, zh: string, en: string, score: number }[]} */
    const bodyHits = [];

    if (corpus && corpus.chapters) {
      for (const [chKey, blocks] of Object.entries(corpus.chapters)) {
        const chPad = chapterFilePad(chKey);
        const titleLine = chapterMeta.get(chPad) || '';
        for (const tuple of blocks) {
          const i = tuple[0];
          const zh = tuple[1] || '';
          const en = tuple[2] || '';
          const hay = `${zh}\n${en}`;
          if (matchesSearchQuery(hay, q)) {
            chaptersWithBodyHit.add(chPad);
            const score = bodyHitScore(zh, en, tokens, titleLine, q);
            insertTopHit(bodyHits, { chPad, i, zh, en }, score, BOOK_SEARCH_BODY_MAX);
          }
        }
      }
    }

    let anyCard = false;
    for (const card of list.querySelectorAll('a.history-card')) {
      const chFile = card.dataset.chapterFile || '';
      const titleMatch = matchesSearchQuery(card.dataset.searchText || '', q);
      const bodyChapter = chFile && chaptersWithBodyHit.has(chFile);
      const show = titleMatch || bodyChapter;
      card.hidden = !show;
      if (show) anyCard = true;
    }

    if (bodyHits.length > 0) {
      const items = bodyHits
        .map((hit) => {
          const n = parseInt(hit.chPad, 10);
          const chLabel = Number.isFinite(n) ? `Chapter ${n}` : `Chapter ${hit.chPad}`;
          const { zhHtml, enHtml } = buildSnippetPair(hit.zh, hit.en, tokens, rawTokens);
          const href = `/${bookId}/${hit.chPad}.html#p-${hit.i}`;
          return `<li><a href="${href}"><span class="book-chapter-search-hit-ch">${escapeHtml(chLabel)}</span><span class="book-chapter-search-snippet-zh">${zhHtml}</span><span class="book-chapter-search-snippet-en">${enHtml}</span></a></li>`;
        })
        .join('');
      textResults.innerHTML = `<p class="book-chapter-search-text-heading">Passages in chapter text <span class="book-chapter-search-ranked-note">(top ${bodyHits.length} by relevance)</span></p><ul class="book-chapter-search-hit-list">${items}</ul>`;
      textResults.hidden = false;
    } else {
      textResults.hidden = true;
      textResults.innerHTML = '';
    }

    if (emptyMsg) {
      emptyMsg.hidden = anyCard || bodyHits.length > 0;
    }
  };

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      apply();
    }, 120);
  });
}

async function renderChapters() {
  const params = new URLSearchParams(window.location.search);
  const bookId =
    params.get('book') || document.body?.dataset?.book?.trim() || null;

  if (!bookId) {
    document.getElementById('loading').textContent = 'Invalid book ID';
    return;
  }

  const manifest = await loadManifest();
  const bookData = manifest.books[bookId];

  if (!bookData) {
    document.getElementById('loading').textContent = 'Book not found in manifest';
    return;
  }

  document.title = `${bookData.chinese} - Chapters`;
  document.getElementById('book-title').textContent = bookData.chinese;
  document.getElementById('book-subtitle').textContent = `${bookData.name} (${bookData.pinyin})`;

  const loading = document.getElementById('loading');
  const list = document.getElementById('chapter-list');
  const main = document.querySelector('main');

  injectBookChapterSearch(main);

  loading.style.display = 'none';
  list.style.display = 'grid';

  if (!bookData.chapters || bookData.chapters.length === 0) {
    list.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No chapters found.</p>';
    return;
  }

  for (const chapter of bookData.chapters) {
    const { level, sentenceTotal, translatedTotal } = chapterTranslationSummary(chapter);
    const titleZh = chapter.title?.zh || `卷${chapter.chapter}`;
    const titleEn = chapter.title?.en || '\u2014';
    const titleRaw = chapter.title?.raw || '';
    const chapterNum = parseInt(chapter.chapter, 10);
    const chapterLabel = Number.isFinite(chapterNum)
      ? `Chapter ${chapterNum}`
      : `Chapter ${chapter.chapter}`;

    const card = document.createElement('a');
    card.className = `history-card history-card--translation-${level}`;
    const chFile = String(chapter.chapter).padStart(3, '0');
    card.href = `/${bookId}/${chFile}.html`;
    card.title = translationStatusTooltip(level, sentenceTotal, translatedTotal, 'chapter');
    card.dataset.chapterFile = chFile;

    card.dataset.searchText = [
      titleZh,
      titleEn,
      titleRaw,
      chapterLabel,
      String(chapter.chapter),
      chFile,
      bookData.chinese,
      bookData.name,
      bookData.pinyin || '',
    ]
      .join(' ')
      .trim();

    const footerLine =
      sentenceTotal > 0
        ? `${translatedTotal.toLocaleString()} of ${sentenceTotal.toLocaleString()} sentences`
        : '';

    card.innerHTML = buildHistoryCardInnerHtml({
      titleZh,
      level,
      secondaryLine: chapterLabel,
      secondaryLineClass: 'pinyin--chapter-index',
      englishLine: titleEn,
      footerLine,
    });

    list.appendChild(card);
  }

  wireBookChapterSearch(bookId, list);
}

renderChapters();
