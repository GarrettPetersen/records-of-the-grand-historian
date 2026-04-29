// Query must stay in sync with index.html app.js (cache bust; bare ./app.js can serve stale modules).
import {
  loadManifest,
  buildHistoryCardInnerHtml,
  chapterTranslationSummary,
  translationStatusTooltip,
} from './app.js?v=20260429-og';

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
    const chapterNum = parseInt(chapter.chapter, 10);
    const chapterLabel = Number.isFinite(chapterNum)
      ? `Chapter ${chapterNum}`
      : `Chapter ${chapter.chapter}`;

    const card = document.createElement('a');
    card.className = `history-card history-card--translation-${level}`;
    const chFile = String(chapter.chapter).padStart(3, '0');
    card.href = `/${bookId}/${chFile}.html`;
    card.title = translationStatusTooltip(level, sentenceTotal, translatedTotal, 'chapter');

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
}

renderChapters();
