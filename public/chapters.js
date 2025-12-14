import { BOOKS, loadManifest } from './app.js';

async function renderChapters() {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('book');
  
  if (!bookId || !BOOKS[bookId]) {
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
    const link = document.createElement('a');
    link.className = 'chapter-link';
    link.href = `reader.html?book=${bookId}&chapter=${chapter.chapter}`;
    
    const titleZh = chapter.title?.zh || `卷${chapter.chapter}`;
    const hasTranslation = chapter.translatedCount > 0;
    const chapterNum = parseInt(chapter.chapter, 10);
    
    link.innerHTML = `
      <div style="font-size: 0.85rem; color: #999; margin-bottom: 0.25rem;">Chapter ${chapterNum}</div>
      <div style="font-size: 1.1rem; margin-bottom: 0.5rem; font-weight: 600;">${titleZh}</div>
      <div style="font-size: 0.85rem; color: #666;">${chapter.sentenceCount} sentences</div>
      ${hasTranslation ? '<div style="font-size: 0.75rem; color: #8b4513; margin-top: 0.25rem;">✓ Translated</div>' : ''}
    `;
    list.appendChild(link);
  }
}

renderChapters();
