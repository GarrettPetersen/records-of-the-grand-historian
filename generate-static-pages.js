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
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BOOKS = {
  shiji: {
    name: 'Records of the Grand Historian',
    chinese: '史記',
    pinyin: 'Shǐjì',
    author: 'Sima Qian',
    dynasty: 'Xia to Han'
  }
};

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateChapterMeta(bookId, chapterData) {
  const book = BOOKS[bookId];
  const chapterNum = parseInt(chapterData.meta.chapter, 10);
  const title = chapterData.meta.title.zh || `Chapter ${chapterNum}`;
  const translationPercent = chapterData.meta.sentenceCount > 0
    ? Math.round((chapterData.meta.translatedCount / chapterData.meta.sentenceCount) * 100)
    : 0;
  
  let description = `${book.chinese} (${book.name}) - ${title}`;
  if (translationPercent === 100) {
    description += '. Complete English translation available.';
  } else if (translationPercent > 0) {
    description += `. ${translationPercent}% translated to English.`;
  }
  
  return {
    title: `${title} - ${book.chinese}`,
    description: description.substring(0, 160),
    translationPercent
  };
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
  const meta = generateChapterMeta(bookId, chapterData);
  const structuredData = generateStructuredData(bookId, chapterData);
  const chapterNum = parseInt(chapterData.meta.chapter, 10);
  const title = chapterData.meta.title.zh;
  
  // Find previous and next chapters
  const currentIndex = allChapters.findIndex(c => c === chapterData.meta.chapter);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;
  
  // Generate paragraph HTML
  let paragraphsHTML = '';
  
  for (let i = 0; i < chapterData.content.length; i++) {
    const block = chapterData.content[i];
    if (block.type !== 'paragraph') continue;
    
    const paraNum = i + 1;
    
    // Chinese text
    const zhText = block.sentences.map(s => escapeHtml(s.zh)).join('');
    
    // English text - use block translation if available, otherwise sentence translations
    let enText = '';
    if (block.translations && block.translations.length > 0 && block.translations[0].text) {
      enText = escapeHtml(block.translations[0].text);
    } else {
      // Fallback to sentence-level translations
      const sentenceTexts = block.sentences
        .map(s => s.translations && s.translations.length > 0 ? s.translations[0].text : '')
        .filter(t => t);
      enText = sentenceTexts.map(t => escapeHtml(t)).join(' ');
    }
    
    paragraphsHTML += `
      <div class="paragraph-block" data-paragraph="${i}">
        <div class="paragraph-number">${paraNum}</div>
        <div class="paragraph-content">
          <div class="chinese-text">${zhText}</div>
          ${enText ? `<div class="english-text">${enText}</div>` : ''}
        </div>
        <button class="cite-paragraph-btn" data-paragraph="${i}" title="Cite this paragraph">📋</button>
      </div>`;
  }
  
  const translationBadge = meta.translationPercent === 100 
    ? '✓ Translated'
    : meta.translationPercent > 0 
    ? `${meta.translationPercent}% Translated`
    : 'Untranslated';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}">
    <link rel="icon" type="image/x-icon" href="../favicon.ico">
    <link rel="stylesheet" href="../styles.css">
    <link rel="canonical" href="https://24histories.com/${bookId}/${chapterData.meta.chapter}.html">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${escapeHtml(meta.title)}">
    <meta property="og:description" content="${escapeHtml(meta.description)}">
    <meta property="og:type" content="article">
    
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
      .chinese-text {
        font-size: 1.1rem;
        line-height: 1.8;
        color: #2c3e50;
      }
      .english-text {
        font-size: 1rem;
        line-height: 1.7;
        color: #34495e;
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
      .translation-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-size: 0.85rem;
        margin-left: 1rem;
      }
      .badge-complete {
        background: #d4edda;
        color: #155724;
      }
      .badge-partial {
        background: #fff3cd;
        color: #856404;
      }
      @media (max-width: 768px) {
        .paragraph-content {
          grid-template-columns: 1fr;
        }
        .paragraph-block {
          grid-template-columns: 30px 1fr 30px;
        }
      }
    </style>
</head>
<body>
    <header style="padding: 1.5rem 2rem;">
        <div style="max-width: 1400px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                <a href="../chapters.html?book=${bookId}" class="back-link" style="color: white; opacity: 0.9;">← Back to ${book.chinese}</a>
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <button id="cite-chapter-btn" class="cite-btn" title="Cite this chapter">
                        📋 Cite
                    </button>
                </div>
            </div>
            <div class="chapter-title" style="border: none; padding: 0; margin-top: 1rem;">
                <h1 style="color: white; margin: 0; font-size: 1.8rem;">${escapeHtml(title)}</h1>
                <div class="subtitle" style="color: rgba(255,255,255,0.8);">
                  Chapter ${chapterNum} of ${book.chinese}
                  <span class="translation-badge ${meta.translationPercent === 100 ? 'badge-complete' : 'badge-partial'}">
                    ${translationBadge}
                  </span>
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

${paragraphsHTML}

        <div class="chapter-navigation" style="display: flex; justify-content: space-between; align-items: center; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #dee2e6;">
            <div>
                ${prevChapter ? `<a href="${prevChapter}.html" class="nav-btn prev-btn">← Previous Chapter</a>` : '<span class="nav-btn disabled">← Previous Chapter</span>'}
            </div>
            <div>
                <a href="../chapters.html?book=${bookId}" class="nav-btn">Back to Chapters</a>
            </div>
            <div>
                ${nextChapter ? `<a href="${nextChapter}.html" class="nav-btn next-btn">Next Chapter →</a>` : '<span class="nav-btn disabled">Next Chapter →</span>'}
            </div>
        </div>
    </main>

    <footer>
        <p><a href="../about.html">About</a> | Source text from <a href="https://chinesenotes.com" target="_blank">Chinese Notes</a> | <a href="../privacy.html">Privacy Policy</a></p>
    </footer>

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
      const currentChapterData = ${JSON.stringify(chapterData)};
      const currentBookInfo = ${JSON.stringify(book)};
      const currentBookId = '${bookId}';
    </script>
    <script type="module" src="../reader.js"></script>
</body>
</html>`;
}

async function generateStaticPages(bookId = null, chapterNum = null) {
  const dataDir = path.join(__dirname, 'data');
  const outputDir = path.join(__dirname, 'public');
  
  // Get list of books to process
  const booksToProcess = bookId ? [bookId] : Object.keys(BOOKS);
  
  let totalGenerated = 0;
  
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
    const chapterFiles = chapterNum 
      ? [`${String(chapterNum).padStart(3, '0')}.json`]
      : fs.readdirSync(bookDataDir).filter(f => f.endsWith('.json'));
    
    console.log(`\nGenerating static pages for ${book}...`);
    
    // Get all chapter numbers sorted
    const allChapterNums = fs.readdirSync(bookDataDir)
      .filter(f => f.endsWith('.json'))
      .map(f => path.basename(f, '.json'))
      .sort();
    
    for (const file of chapterFiles) {
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
      totalGenerated++;
    }
  }
  
  console.log(`\n✅ Generated ${totalGenerated} static HTML pages`);
  console.log(`Output directory: ${path.join(outputDir)}`);
}

// Parse command line arguments
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage:
  node generate-static-pages.js                    Generate all chapters for all books
  node generate-static-pages.js --book <book-id>   Generate all chapters for one book
  node generate-static-pages.js --book <book-id> --chapter <num>
                                                   Generate one specific chapter

Examples:
  node generate-static-pages.js
  node generate-static-pages.js --book shiji
  node generate-static-pages.js --book shiji --chapter 006
`);
    process.exit(0);
  }
  
  let bookId = null;
  let chapterNum = null;
  
  const bookIdx = args.indexOf('--book');
  if (bookIdx !== -1 && bookIdx + 1 < args.length) {
    bookId = args[bookIdx + 1];
  }
  
  const chapterIdx = args.indexOf('--chapter');
  if (chapterIdx !== -1 && chapterIdx + 1 < args.length) {
    chapterNum = args[chapterIdx + 1];
  }
  
  generateStaticPages(bookId, chapterNum);
}

main();