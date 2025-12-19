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
    title: enTitle ? `${enTitle} - ${book.chinese}` : `${zhTitle} - ${book.chinese}`,
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

  // Generate content HTML (paragraphs and tables)
  let contentHTML = '';
  let footnotes = [];
  let footnoteCounter = 1;

  for (let i = 0; i < chapterData.content.length; i++) {
    const block = chapterData.content[i];

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
        const zhTitle = '';
        const enTitle = '';

        let tableHtml = `<div class="tabular-content" data-paragraph="${i}">
            <!-- Chinese table -->
            <div class="table-container chinese-table">
              <div class="table-scroll">
                <table class="genealogical-table">
                  <tbody>`;

        tableRows.forEach(tableRow => {
          tableHtml += `<tr>`;
          tableRow.cells.forEach(cell => {
            const cellZh = escapeHtml(cell.content);
            if (cellZh.trim()) {
              tableHtml += `<td class="table-cell">${cellZh}</td>`;
            } else {
              tableHtml += `<td class="table-cell empty-cell"></td>`;
            }
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
            const cellEn = cell.translation ? escapeHtml(cell.translation) : '';
            if (cellEn.trim()) {
              tableHtml += `<td class="table-cell">${cellEn}</td>`;
            } else {
              tableHtml += `<td class="table-cell empty-cell"></td>`;
            }
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
      const paraNum = i + 1;

      // Chinese text
      const zhText = block.sentences.map(s => escapeHtml(s.zh)).join('');

      // English text - use sentence-level translations with footnote support
      const sentenceTexts = block.sentences
        .map(s => {
          const translation = s.translation || (s.translations && s.translations.length > 0 ? s.translations[0] : null);
          if (!translation || !translation.text) return '';

          let text = escapeHtml(translation.text);

          // Check for footnote
          if (translation.footnote) {
            const footnoteNum = footnoteCounter++;
            footnotes.push({
              number: footnoteNum,
              text: translation.footnote
            });
            text += `<sup class="footnote-marker" data-footnote="${footnoteNum}">${footnoteNum}</sup>`;
          }

          return text;
        })
        .filter(t => t);
      const enText = sentenceTexts.join(' ');

      // No special styling for concluding paragraph - display like any other paragraph

      contentHTML += `
        <div class="paragraph-block" data-paragraph="${i}">
          <div class="paragraph-number">${paraNum}</div>
          <div class="paragraph-content">
            <div class="chinese-text">${zhText}</div>
            ${enText ? `<div class="english-text">${enText}</div>` : ''}
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
        const zhHeaderRow = block.sentences.map(s => `<th class="table-header">${escapeHtml(s.zh)}</th>`).join('');
        const enHeaderRow = block.sentences.map(s => {
          const translation = s.translations && s.translations.length > 0 ? s.translations[0] : null;
          if (!translation || !translation.text) return '<th class="table-header"></th>';

          let text = escapeHtml(translation.text);

          // Check for footnote
          if (translation.footnote) {
            const footnoteNum = footnoteCounter++;
            footnotes.push({
              number: footnoteNum,
              text: translation.footnote
            });
            text += `<sup class="footnote-marker" data-footnote="${footnoteNum}">${footnoteNum}</sup>`;
          }

          return `<th class="table-header">${text}</th>`;
        }).join('');

        let tableHtml = `<div class="tabular-content" data-paragraph="${i}">
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
            const cellZh = escapeHtml(cell.content);
            if (cellZh.trim()) {
              tableHtml += `<td class="table-cell">${cellZh}</td>`;
            } else {
              tableHtml += `<td class="table-cell empty-cell"></td>`;
            }
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
            const cellEn = cell.translation ? escapeHtml(cell.translation) : '';
            if (cellEn.trim()) {
              tableHtml += `<td class="table-cell">${cellEn}</td>`;
            } else {
              tableHtml += `<td class="table-cell empty-cell"></td>`;
            }
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
        // Just a header without table rows
        const zhText = block.sentences.map(s => escapeHtml(s.zh)).join('');
        const enText = block.translations && block.translations.length > 0 && block.translations[0].text
          ? escapeHtml(block.translations[0].text)
          : '';

        contentHTML += `
          <div class="table-header-block">
            <h3 class="table-title">
              <span class="chinese-text">${zhText}</span>
              ${enText ? `<span class="english-text">${enText}</span>` : ''}
            </h3>
          </div>`;
      }
    } else {
      // Just a header without table rows
      const zhText = block.sentences.map(s => escapeHtml(s.zh)).join('');
      const enText = block.translations && block.translations.length > 0 && block.translations[0].text
        ? escapeHtml(block.translations[0].text)
        : '';

      contentHTML += `
          <div class="table-header-block">
            <h3 class="table-title">
              <span class="chinese-text">${zhText}</span>
              ${enText ? `<span class="english-text">${enText}</span>` : ''}
            </h3>
          </div>`;
    }
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
    </style>
</head>
<body>
    <header style="padding: 1.5rem 2rem;">
        <div style="max-width: 1400px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                <a href="../chapters.html?book=${bookId}" class="back-link" style="color: white; opacity: 0.9;">← Back to ${book.chinese}</a>
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
      window.currentChapterData = ${JSON.stringify(chapterData)};
      window.currentBookInfo = ${JSON.stringify(book)};
      window.currentBookId = '${bookId}';

      // Simple citation functions for static pages
      function generateCitation(format, type, paragraphIdx, block) {
        const book = window.currentBookInfo;
        const chapterNum = window.currentChapterData.meta.chapter;
        const chapterTitle = window.currentChapterData.meta.title.en || ('Chapter ' + chapterNum);

        const baseCitation = book.name + '. "' + chapterTitle + '." In ' + book.chinese + ', translated by Garrett M. Petersen, 2025.';

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
              document.querySelectorAll('.chinese-text, .english-text').forEach(el => el.style.display = 'block');
            } else if (view === 'chinese') {
              contentContainer.style.gridTemplateColumns = '1fr';
              document.querySelectorAll('.chinese-text').forEach(el => el.style.display = 'block');
              document.querySelectorAll('.english-text').forEach(el => el.style.display = 'none');
            } else if (view === 'english') {
              contentContainer.style.gridTemplateColumns = '1fr';
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