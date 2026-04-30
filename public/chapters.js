// Keep ?v= in sync with book hub HTML from generate-static-pages.js (chapters.js script tag).
import {
  loadManifest,
  buildHistoryCardInnerHtml,
  chapterTranslationSummary,
  translationStatusTooltip,
  matchesSearchQuery,
  normalizeForSearch,
  escapeHtml,
} from './app.js?v=20260430-searchux';

const BOOK_SEARCH_BODY_MAX = 48;

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

/**
 * @param {string} zh
 * @param {string} en
 * @param {number} max
 */
function snippetPair(zh, en, max) {
  const z = String(zh || '').replace(/\s+/g, ' ').trim();
  const e = String(en || '').replace(/\s+/g, ' ').trim();
  const cut = (s) => (s.length > max ? `${s.slice(0, max)}…` : s);
  return { zh: cut(z), en: cut(e) };
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

    /** @type {Set<string>} */
    const chaptersWithBodyHit = new Set();
    /** @type {{ chPad: string, i: number, zh: string, en: string }[]} */
    const bodyHits = [];

    if (corpus && corpus.chapters) {
      for (const [chKey, blocks] of Object.entries(corpus.chapters)) {
        const chPad = chapterFilePad(chKey);
        for (const tuple of blocks) {
          const i = tuple[0];
          const zh = tuple[1] || '';
          const en = tuple[2] || '';
          const hay = `${zh}\n${en}`;
          if (matchesSearchQuery(hay, q)) {
            chaptersWithBodyHit.add(chPad);
            if (bodyHits.length < BOOK_SEARCH_BODY_MAX) {
              bodyHits.push({ chPad, i, zh, en });
            }
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
          const { zh: zSnip, en: eSnip } = snippetPair(hit.zh, hit.en, 140);
          const href = `/${bookId}/${hit.chPad}.html#p-${hit.i}`;
          return `<li><a href="${href}"><span class="book-chapter-search-hit-ch">${escapeHtml(chLabel)}</span><span class="book-chapter-search-snippet-zh">${escapeHtml(zSnip)}</span><span class="book-chapter-search-snippet-en">${escapeHtml(eSnip || '—')}</span></a></li>`;
        })
        .join('');
      textResults.innerHTML = `<p class="book-chapter-search-text-heading">Passages in chapter text</p><ul class="book-chapter-search-hit-list">${items}</ul>`;
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
