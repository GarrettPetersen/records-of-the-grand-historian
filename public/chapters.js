// Keep ?v= in sync with book hub HTML from generate-static-pages.js (chapters.js script tag).
import {
  loadManifest,
  buildHistoryCardInnerHtml,
  chapterTranslationSummary,
  translationStatusTooltip,
  matchesSearchQuery,
  normalizeForSearch,
} from './app.js?v=20260429-search';

function injectBookChapterSearch(main) {
  if (!main || document.getElementById('book-chapter-search-input')) return;
  const wrap = document.createElement('div');
  wrap.className = 'book-chapter-search-wrap';
  wrap.innerHTML = `
    <label class="book-chapter-search-label" for="book-chapter-search-input">Search chapters in this book</label>
    <input type="search" id="book-chapter-search-input" class="book-chapter-search-input" autocomplete="off" placeholder="Chinese or English title, chapter number…" />
    <p id="book-chapter-search-empty" class="book-chapter-search-empty" hidden>No matching chapters.</p>
  `;
  const back = main.querySelector('.back-link');
  if (back) {
    back.insertAdjacentElement('afterend', wrap);
  } else {
    main.prepend(wrap);
  }
}

function wireBookChapterSearch(list) {
  const input = document.getElementById('book-chapter-search-input');
  const emptyMsg = document.getElementById('book-chapter-search-empty');
  if (!input || !list) return;

  let debounceTimer = null;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const q = input.value;
      const cards = list.querySelectorAll('a.history-card');
      let anyVisible = false;
      for (const card of cards) {
        const hay = card.dataset.searchText || '';
        const show = matchesSearchQuery(hay, q);
        card.hidden = !show;
        if (show) anyVisible = true;
      }
      if (emptyMsg) {
        const active = normalizeForSearch(q).length > 0;
        emptyMsg.hidden = !active || anyVisible;
      }
    }, 100);
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

  wireBookChapterSearch(list);
}

renderChapters();
