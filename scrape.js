#!/usr/bin/env node

/**
 * scrape.js - Universal scraper for the 24 Dynastic Histories from chinesenotes.com
 * 
 * Outputs structured JSON with sentence-level segmentation and word annotations.
 * Extracts English translations when available.
 * Maintains a global glossary across all chapters.
 * 
 * Usage:
 *   node scrape.js <book> <chapter> [--glossary <path>]
 *   node scrape.js --list
 * 
 * Examples:
 *   node scrape.js shiji 001
 *   node scrape.js songshi 369 --glossary data/glossary.json
 *   node scrape.js --list
 */

import { load } from 'cheerio';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { alignTranslations } from './align-translations.js';

// The 24 Dynastic Histories with their romanized names and metadata
const BOOKS = {
  shiji: {
    name: 'Records of the Grand Historian',
    chinese: '史記',
    pinyin: 'Shǐjì',
    dynasty: 'Xia to Han',
    urlPattern: 'https://chinesenotes.com/shiji/shiji{chapter}.html',
    ctextUrlPattern: 'https://ctext.org/shiji/{chapter}'
  },
  hanshu: {
    name: 'Book of Han',
    chinese: '漢書',
    pinyin: 'Hànshū',
    dynasty: 'Western Han',
    urlPattern: 'https://chinesenotes.com/hanshu/hanshu{chapter}.html'
  },
  houhanshu: {
    name: 'Book of Later Han',
    chinese: '後漢書',
    pinyin: 'Hòu Hànshū',
    dynasty: 'Eastern Han',
    urlPattern: 'https://chinesenotes.com/houhanshu/houhanshu{chapter}.html'
  },
  sanguozhi: {
    name: 'Records of the Three Kingdoms',
    chinese: '三國志',
    pinyin: 'Sānguó Zhì',
    dynasty: 'Three Kingdoms',
    urlPattern: 'https://chinesenotes.com/sanguozhi/sanguozhi{chapter}.html'
  },
  jinshu: {
    name: 'Book of Jin',
    chinese: '晉書',
    pinyin: 'Jìnshū',
    dynasty: 'Jin',
    urlPattern: 'https://chinesenotes.com/jinshu/jinshu{chapter}.html'
  },
  songshu: {
    name: 'Book of Song',
    chinese: '宋書',
    pinyin: 'Sòngshū',
    dynasty: 'Liu Song',
    urlPattern: 'https://chinesenotes.com/songshu/songshu{chapter}.html'
  },
  nanqishu: {
    name: 'Book of Southern Qi',
    chinese: '南齊書',
    pinyin: 'Nán Qíshū',
    dynasty: 'Southern Qi',
    urlPattern: 'https://chinesenotes.com/nanqishu/nanqishu{chapter}.html'
  },
  liangshu: {
    name: 'Book of Liang',
    chinese: '梁書',
    pinyin: 'Liángshū',
    dynasty: 'Liang',
    urlPattern: 'https://chinesenotes.com/liangshu/liangshu{chapter}.html'
  },
  chenshu: {
    name: 'Book of Chen',
    chinese: '陳書',
    pinyin: 'Chénshū',
    dynasty: 'Chen',
    urlPattern: 'https://chinesenotes.com/chenshu/chenshu{chapter}.html'
  },
  weishu: {
    name: 'Book of Wei',
    chinese: '魏書',
    pinyin: 'Wèishū',
    dynasty: 'Northern Wei',
    urlPattern: 'https://chinesenotes.com/weishu/weishu{chapter}.html'
  },
  beiqishu: {
    name: 'Book of Northern Qi',
    chinese: '北齊書',
    pinyin: 'Běi Qíshū',
    dynasty: 'Northern Qi',
    urlPattern: 'https://chinesenotes.com/beiqishu/beiqishu{chapter}.html'
  },
  zhoushu: {
    name: 'Book of Zhou',
    chinese: '周書',
    pinyin: 'Zhōushū',
    dynasty: 'Northern Zhou',
    urlPattern: 'https://chinesenotes.com/zhoushu/zhoushu{chapter}.html'
  },
  suishu: {
    name: 'Book of Sui',
    chinese: '隋書',
    pinyin: 'Suíshū',
    dynasty: 'Sui',
    urlPattern: 'https://chinesenotes.com/suishu/suishu{chapter}.html'
  },
  nanshi: {
    name: 'History of the Southern Dynasties',
    chinese: '南史',
    pinyin: 'Nánshǐ',
    dynasty: 'Southern Dynasties',
    urlPattern: 'https://chinesenotes.com/nanshi/nanshi{chapter}.html'
  },
  beishi: {
    name: 'History of the Northern Dynasties',
    chinese: '北史',
    pinyin: 'Běishǐ',
    dynasty: 'Northern Dynasties',
    urlPattern: 'https://chinesenotes.com/beishi/beishi{chapter}.html'
  },
  jiutangshu: {
    name: 'Old Book of Tang',
    chinese: '舊唐書',
    pinyin: 'Jiù Tángshū',
    dynasty: 'Tang',
    urlPattern: 'https://chinesenotes.com/jiutangshu/jiutangshu{chapter}.html'
  },
  xintangshu: {
    name: 'New Book of Tang',
    chinese: '新唐書',
    pinyin: 'Xīn Tángshū',
    dynasty: 'Tang',
    urlPattern: 'https://chinesenotes.com/xintangshu/xintangshu{chapter}.html'
  },
  jiuwudaishi: {
    name: 'Old History of the Five Dynasties',
    chinese: '舊五代史',
    pinyin: 'Jiù Wǔdàishǐ',
    dynasty: 'Five Dynasties',
    urlPattern: 'https://chinesenotes.com/jiuwudaishi/jiuwudaishi{chapter}.html'
  },
  xinwudaishi: {
    name: 'New History of the Five Dynasties',
    chinese: '新五代史',
    pinyin: 'Xīn Wǔdàishǐ',
    dynasty: 'Five Dynasties',
    urlPattern: 'https://chinesenotes.com/xinwudaishi/xinwudaishi{chapter}.html'
  },
  songshi: {
    name: 'History of Song',
    chinese: '宋史',
    pinyin: 'Sòngshǐ',
    dynasty: 'Song',
    urlPattern: 'https://chinesenotes.com/songshi/songshi{chapter}.html'
  },
  liaoshi: {
    name: 'History of Liao',
    chinese: '遼史',
    pinyin: 'Liáoshǐ',
    dynasty: 'Liao (Khitan)',
    urlPattern: 'https://chinesenotes.com/liaoshi/liaoshi{chapter}.html'
  },
  jinshi: {
    name: 'History of Jin',
    chinese: '金史',
    pinyin: 'Jīnshǐ',
    dynasty: 'Jin (Jurchen)',
    urlPattern: 'https://chinesenotes.com/jinshi/jinshi{chapter}.html'
  },
  yuanshi: {
    name: 'History of Yuan',
    chinese: '元史',
    pinyin: 'Yuánshǐ',
    dynasty: 'Yuan (Mongol)',
    urlPattern: 'https://chinesenotes.com/yuanshi/yuanshi{chapter}.html'
  },
  mingshi: {
    name: 'History of Ming',
    chinese: '明史',
    pinyin: 'Míngshǐ',
    dynasty: 'Ming',
    urlPattern: 'https://chinesenotes.com/mingshi/mingshi{chapter}.html'
  }
};

// Classical Chinese sentence-ending punctuation
const SENTENCE_ENDINGS = /([。！？；])/;

function normalizeWhitespace(text) {
  return text.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Parse title attribute from vocabulary span
 * Format: "pinyin | 1. def1, 2. def2, ..." or "pinyin | definition"
 */
function parseAnnotation(title) {
  if (!title) return null;

  const pipeIdx = title.indexOf(' | ');
  if (pipeIdx === -1) {
    return { pinyin: title.trim(), definitions: [] };
  }

  const pinyin = title.slice(0, pipeIdx).trim();
  const defPart = title.slice(pipeIdx + 3).trim();

  // Parse numbered definitions: "1. def1, 2. def2" or single definition
  const definitions = [];
  const defMatches = defPart.match(/\d+\.\s*[^,\d]+(?:,\s*)?/g);

  if (defMatches) {
    for (const match of defMatches) {
      const def = match.replace(/^\d+\.\s*/, '').replace(/,\s*$/, '').trim();
      if (def) definitions.push(def);
    }
  } else if (defPart) {
    definitions.push(defPart);
  }

  return { pinyin, definitions };
}

/**
 * Extract annotated tokens from vocabulary spans
 */
function extractTokensFromSpans($, $spans) {
  const tokens = [];

  $spans.each((_, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    if (!text) return;

    const title = $el.attr('title');
    const headwordId = $el.attr('value');
    const isProperNoun = $el.hasClass('propernoun');

    const annotation = parseAnnotation(title);

    tokens.push({
      text,
      headwordId: headwordId ? parseInt(headwordId, 10) : null,
      isProperNoun,
      ...annotation
    });
  });

  return tokens;
}

/**
 * Update global glossary with new tokens
 */
function updateGlossary(existingGlossary, tokens) {
  const glossary = { ...existingGlossary };

  for (const token of tokens) {
    if (!token.headwordId) continue;

    const key = String(token.headwordId);
    if (!glossary[key]) {
      glossary[key] = {
        id: token.headwordId,
        text: token.text,
        pinyin: token.pinyin,
        definitions: token.definitions,
        isProperNoun: token.isProperNoun
      };
    }
  }

  return glossary;
}

/**
 * Segment Chinese text into sentences based on punctuation
 */
function segmentSentences(text) {
  const sentences = [];
  const parts = text.split(SENTENCE_ENDINGS);

  let current = '';
  for (let i = 0; i < parts.length; i++) {
    current += parts[i];
    // If this part is punctuation (odd indices after split), complete the sentence
    if (i % 2 === 1 && current.trim()) {
      sentences.push(current.trim());
      current = '';
    }
  }

  // Don't forget remaining text without ending punctuation
  if (current.trim()) {
    sentences.push(current.trim());
  }

  // Post-process: merge standalone closing quotes and move leading quotes
  const merged = [];
  const closeQuotesOnly = /^[」"'』】)]+$/;
  const startsWithCloseQuote = /^([」"'』】)]+)(.+)/;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];

    // Case 1: Sentence is only a closing quote - append to previous
    if (closeQuotesOnly.test(sentence) && merged.length > 0) {
      merged[merged.length - 1] += sentence;
    }
    // Case 2: Sentence starts with closing quote - move quote to end of previous
    else {
      const match = sentence.match(startsWithCloseQuote);
      if (match && merged.length > 0) {
        const [, quotes, rest] = match;
        // Only add quotes if previous doesn't already end with them
        if (!merged[merged.length - 1].endsWith(quotes)) {
          merged[merged.length - 1] += quotes;
        }
        merged.push(rest);
      } else {
        merged.push(sentence);
      }
    }
  }

  return merged;
}

/**
 * Check if text is primarily Chinese
 */
function isMostlyChinese(text) {
  const t = text.replace(/[\s\u200B\uFEFF]+/g, '');
  if (!t) return false;
  const chineseMatches = t.match(/[\p{Script=Han}]/gu);
  const latinMatches = t.match(/[A-Za-z]/g);
  const chineseCount = chineseMatches ? chineseMatches.length : 0;
  const latinCount = latinMatches ? latinMatches.length : 0;
  return chineseCount > 0 && chineseCount >= latinCount;
}

/**
 * Check if text is primarily English
 */
function isMostlyEnglish(text) {
  const t = text.replace(/[\s\u200B\uFEFF]+/g, '');
  if (!t) return false;
  const latinMatches = t.match(/[A-Za-z]/g);
  const chineseMatches = t.match(/[\p{Script=Han}]/gu);
  const latinCount = latinMatches ? latinMatches.length : 0;
  const chineseCount = chineseMatches ? chineseMatches.length : 0;
  return latinCount > 0 && latinCount > chineseCount;
}

/**
 * Check if text looks like a section header (e.g., "Annals of Xiang Yu:")
 * These are typically short English lines ending with a colon
 */
function isSectionHeader(text) {
  // Section headers are typically:
  // - Short (< 50 chars)
  // - End with a colon
  // - Mostly English words
  // - No periods (actual translations have periods)
  if (text.length > 50) return false;
  if (!text.endsWith(':')) return false;
  if (text.includes('.')) return false;

  // Check if it's mostly English
  const words = text.split(/\s+/);
  const englishWords = words.filter(w => /^[A-Za-z]+$/.test(w));
  return englishWords.length >= words.length * 0.7;
}

/**
 * Check if text is boilerplate/public domain notice rather than actual translation
 */
function isBoilerplateText(text) {
  if (!text) return true;

  const t = text.toLowerCase().trim();

  // Common boilerplate patterns that should not be attributed to Herbert J. Allen
  const boilerplatePatterns = [
    'public domain',
    'this text is',
    'copyright',
    'all rights reserved',
    'permission granted',
    'free to copy',
    'distributed under',
    'creative commons',
    'gnu general public',
    'wikipedia',
    '維基百科',
    'dictionary cache',
    'jump to dictionary',
    'show parallel',
    'chinese text project',
    'home',
    'source:'
  ];

  return boilerplatePatterns.some(pattern => t.includes(pattern));
}

/**
 * Check if text looks like a table of contents entry or should be skipped
 */
function shouldSkipLine(text) {
  // TOC entries typically start with numbers like "1 ", "1.1 ", "2 "
  // But don't skip BCE year entries like "206 高皇帝..." (3+ digit years are table data)
  if (/^\d{1,2}(\.\d+)?\s+[^\d]/.test(text) && !/^\d+\s+[高孝元]/.test(text)) return true;
  if (text === '目录') return true;
  // Skip Wikipedia references
  if (text.includes('維基百科') || text.includes('维基百科')) return true;
  // Skip single character or very short lines that are likely headers
  if (text.length <= 2 && !text.includes('。')) return true;
  // Skip section headers
  if (isSectionHeader(text)) return true;
  return false;
}

/**
 * Parse HTML tables from ctext.org pages
 */
function parseCtextTables($, $table, startSentenceCounter, customHeaderText = '', url = '') {
  const content = [];
  let sentenceCounter = startSentenceCounter;

  console.error(`Processing table with ${$table.find('tr').length} rows and ${$table.find('td, th').length} cells`);

  // Check if this looks like a genealogical table
  const cellCount = $table.find('td, th').length;
  const rowCount = $table.find('tr').length;

  if (cellCount < 20 || rowCount < 5) {
    console.error(`Table too small (${rowCount} rows, ${cellCount} cells), skipping`);
    return { content, tokens: [] };
  }

  console.error('Processing genealogical table...');

  // Don't create a separate table header - the first row will be treated as the header

  // Process all rows including headers
  let headerContent = null;

  // Process each row
  $table.find('tr').each((rowIndex, rowElement) => {
    const $row = $(rowElement);
    const cells = [];

    // Extract ALL cell data from td, th elements (including headers)
    $row.find('td, th').each((cellIndex, cellElement) => {
      const cellText = $(cellElement).text().trim();
      // Include empty cells to preserve table structure
      const isEmpty = !cellText || cellText === '—' || cellText === '－' || cellText === '';
      cells.push({
        id: `s${++sentenceCounter}`,
        zh: isEmpty ? '' : cellText,
        translations: [{ lang: 'en', literal: '', idiomatic: '', translator: '' }]
      });
    });

    console.error(`Processing row ${rowIndex} with ${cells.length} cells`);
    if (rowIndex <= 3) {
      console.error(`Row ${rowIndex} cell contents: ${cells.slice(0, 5).map(c => `"${c.zh || 'empty'}"`).join(', ')}`);
    }
    if (rowIndex === 1) {
      console.error(`Row 1 detailed cells: ${cells.map(c => `"${c.zh}"`).join(' | ')}`);
    }

    // Skip rows with too many cells (likely header/combined rows)
    if (cells.length > 50) {
      console.error(`Skipping row ${rowIndex}: too many cells (${cells.length})`);
      return;
    }

    // Skip rows with too few cells
    if (cells.length < 2) {
      console.error(`Skipping row ${rowIndex}: too few cells (${cells.length})`);
      return;
    }

    // Create generic table row with array of cells (preserving empty cells)
    const rowCells = cells.map((cell, cellIndex) => ({
      id: `s${startSentenceCounter++}`,
      content: cell.zh || '',
      translation: '' // Will be filled by translation process
    }));

    if (rowIndex === 0) {
      // First row is the table header
      headerContent = rowCells.map(c => c.content).join('|');
      console.error(`Creating table header with ${rowCells.length} cells: ${rowCells.slice(0, 3).map(c => `"${c.content}"`).join(', ')}`);
      const headerObj = {
        type: 'table_header',
        sentences: rowCells.map(cell => ({
          id: cell.id,
          zh: cell.content,
          translations: [{ lang: 'en', literal: '', idiomatic: '', translator: '' }]
        })),
        translations: []
      };
      console.error(`Pushing header to content array (content.length before: ${content.length})`);
      content.push(headerObj);
      console.error(`Content array now has ${content.length} items`);
    } else {
      // Check if this row has the same content as the header (repeated headers)
      const rowContent = rowCells.map(c => c.content.trim()).join('|');
      const trimmedHeaderContent = headerContent.trim();

      // Also check if first few cells match header
      const firstThreeRow = rowCells.slice(0, 3).map(c => c.content.trim()).join('|');
      const firstThreeHeader = headerContent.split('|').slice(0, 3).join('|');

      // Also check if first cell is "公元前" (should only appear in header)
      const firstCell = rowCells[0]?.content?.trim();

      if (rowContent === trimmedHeaderContent || firstThreeRow === firstThreeHeader || firstCell === '公元前') {
        console.error(`Skipping row ${rowIndex}: duplicate header content (first cell: "${firstCell}")`);
        return;
      }

      // Subsequent rows are table data
      const rowObj = {
        type: 'table_row',
        cells: rowCells
      };
      content.push(rowObj);
    }
  });

  console.error(`Parsed ${content.length} table elements from ctext.org genealogical table`);
  return { content, tokens: [], sentenceCounter: startSentenceCounter }; // Return updated sentence counter
}

/**
 * Extract all content from ctext.org pages (paragraphs and tables)
 */
function extractCtextContent($, startSentenceCounter, url = '', chapter = '') {
  const content = [];
  let sentenceCounter = startSentenceCounter;

  // For ctext.org, find the main content table and extract from third column
  let $main = $('body');
  const $contentCells = $main.find('td.ctext, td[class*="ctext"]').filter((i, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    // Include substantial content cells
    if (text.length < 10) return false;
    if (text.includes('Jump to dictionary') ||
      text.includes('Show parallel') ||
      text.includes('Chinese Text Project') ||
      text.includes('Home')) {
      return false;
    }
    return true;
  });

  console.error(`Found ${$contentCells.length} content cells in ctext.org table`);
  $contentCells.each((index, element) => {
    const $cell = $(element);
    const html = $cell.html();
    const text = $cell.text().trim();

    console.error(`Processing content cell ${index}: ${text.substring(0, 50)}...`);

    // Check if this cell contains a table
    if (html.includes('<table') && $cell.find('table').length > 0) {
      // This cell contains a table - parse it
      console.error(`Cell ${index} contains a table - parsing as table`);
      const $table = $cell.find('table');
      const tableResult = parseCtextTables($, $table, sentenceCounter, '', url);
      if (tableResult.content.length > 0) {
        content.push(...tableResult.content);
        sentenceCounter = tableResult.sentenceCounter;
      }
    } else {
      // This cell contains paragraph text - parse as paragraphs
      console.error(`Cell ${index} contains paragraph text - parsing as paragraphs`);
      const sentences = segmentSentences(text);
      if (sentences.length > 0) {
        const paragraphContent = {
          type: 'paragraph',
          sentences: sentences.map((sentence, idx) => ({
            id: `s${(++sentenceCounter).toString().padStart(4, '0')}`,
            zh: sentence,
            translations: [{ lang: 'en', literal: '', idiomatic: '', translator: '' }]
          })),
          translations: [{ lang: 'en', literal: '', idiomatic: '', translator: '' }]
        };
        content.push(paragraphContent);
      }
    }
  });

  // Get all vocabulary spans for the glossary
  const $allSpans = $main.find('span.vocabulary, span.propernoun, a[href*="/dictionary.pl"]');
  const tokens = extractTokensFromSpans($, $allSpans);

  // Check for replacement characters that indicate encoding corruption
  let corruptionFound = false;
  for (const block of content) {
    if (block.type === 'paragraph' && block.sentences) {
      for (const sentence of block.sentences) {
        if (sentence.zh && sentence.zh.includes('�')) {
          console.error(`WARNING: Replacement character found in text: "${sentence.zh}"`);
          corruptionFound = true;
        }
      }
    } else if (block.type === 'table_row' && block.cells) {
      for (const cell of block.cells) {
        if (cell.content && cell.content.includes('�')) {
          console.error(`WARNING: Replacement character found in table cell: "${cell.content}"`);
          corruptionFound = true;
        }
      }
    }
  }

  if (corruptionFound) {
    console.error('WARNING: Unicode replacement characters detected. This indicates UTF-8 encoding corruption in the source HTML.');
  }

  // Minimal targeted logic for known genealogical tables (chapters 13-16)
  // These specific chapters have predictable structures and need proper header extraction
  const tableIndices = [];
  content.forEach((item, index) => {
    if (item.type === 'table_row') {
      tableIndices.push(index);
    }
  });

  // Group consecutive table rows into table groups
  const tableGroups = [];
  let currentGroup = [];
  for (let i = 0; i < tableIndices.length; i++) {
    const index = tableIndices[i];
    if (currentGroup.length === 0 || index === tableIndices[i - 1] + 1) {
      currentGroup.push(index);
    } else {
      tableGroups.push([...currentGroup]);
      currentGroup = [index];
    }
  }
  if (currentGroup.length > 0) {
    tableGroups.push(currentGroup);
  }

  // For chapters 13-16 (known genealogical tables), detect and extract headers
  if (['013', '014', '015', '016'].includes(chapter)) {
    tableGroups.forEach(groupIndices => {
      if (groupIndices.length > 0) {
        const firstRowIndex = groupIndices[0];
        const firstRow = content[firstRowIndex];

        // Check if first row contains state/dynasty names (indicating it's a header)
        const hasStateNames = firstRow.cells.some(cell =>
          ['周', '魯', '齊', '晉', '秦', '楚', '宋', '衛', '陳', '蔡', '曹', '鄭', '燕', '吳', '韓', '魏', '趙'].includes(cell.content.trim())
        );

        if (hasStateNames) {
          // Convert to table_header
          const headerRow = {
            type: 'table_header',
            sentences: firstRow.cells.map(cell => ({
              id: cell.id,
              zh: cell.content,
              translations: [{ lang: 'en', literal: '', idiomatic: '', translator: '' }]
            }))
          };

          content.splice(firstRowIndex, 1, headerRow);
          console.error(`Converted first row to table_header with ${firstRow.cells.length} columns for known genealogical table`);
        }
      }
    });
  }

  console.error(`Extracted ${content.length} content blocks from ctext.org`);
  return { content, tokens, sentenceCounter };
}

/**
 * Extract structured content from the page
 * Handle both Chinese-only and Chinese-English parallel text
 */
function extractContent($, isFromCtext = false, startSentenceCounter = 0, url = '', chapter = '') {
  const content = [];
  let sentenceCounter = startSentenceCounter;

  // Handle ctext.org pages - extract all content including paragraphs and tables
  if (isFromCtext) {
    const result = extractCtextContent($, sentenceCounter, url, chapter);
    return result;
  }

  // Get the main content area
  let $main = $('main.main-content');
  if (!$main.length) {
    // Try ctext.org specific selectors
    $main = $('#content3');
  }
  if (!$main.length) {
    // Fallback to body
    $main = $('body');
  }

  // Get all vocabulary spans for the glossary
  const $allSpans = $main.find('span.vocabulary, span.propernoun');
  const allTokens = extractTokensFromSpans($, $allSpans);

  // Get the HTML content and split by <br> tags to find paragraphs
  let html = $main.html();

  // Extract text between </header> and <footer (or end)
  const headerEndMatch = html.match(/<\/header>/i);
  const footerMatch = html.match(/<footer/i);

  if (headerEndMatch) {
    const startIdx = headerEndMatch.index + headerEndMatch[0].length;
    const endIdx = footerMatch ? footerMatch.index : html.length;
    html = html.slice(startIdx, endIdx);
  }

  // Remove the "Click on any word" paragraph
  html = html.replace(/<p>\s*Click on any word[^<]*<\/p>/gi, '');

  // Remove the footer source/copyright text that appears on every page
  html = html.replace(/Source:\s*Chinese Text Project[^]*?<\/p>/gi, '');
  html = html.replace(/Dictionary cache status:[^<]*<\/p>/gi, '');
  html = html.replace(/Copyright Fo Guang Shan[^]*?<\/p>/gi, '');
  html = html.replace(/Glossary and Other Vocabulary<\/a>/gi, '');

  // Replace <br/> and <br> with a marker we can split on
  const BR_MARKER = '\n§BR§\n';
  html = html.replace(/<br\s*\/?>/gi, BR_MARKER);

  // Load the cleaned HTML
  const $content = load(html, { decodeEntities: true });

  // Get the text, which now has our markers
  let text = $content.root().text();

  // Split into paragraphs by our marker
  const paragraphs = text.split('§BR§')
    .map(p => normalizeWhitespace(p))
    .filter(p => p);

  // Process paragraphs - look for Chinese-English pairs
  let i = 0;
  while (i < paragraphs.length) {
    const para = paragraphs[i];

    if (shouldSkipLine(para)) {
      i++;
      continue;
    }

    // Skip paragraphs that appear to be tabular data formatted as text
    // This happens when chinesenotes presents genealogical tables as formatted paragraphs
    const stateNames = ['魯', '齊', '晉', '秦', '楚', '宋', '衛', '陳', '蔡', '曹', '燕'];
    const hasStateNames = stateNames.some(state => para.includes(state));

    // Check for many Chinese names (typical of table rows)
    const namePatterns = para.match(/[\u4e00-\u9fff]{2,4}[\s\u3000]/g) || [];
    const hasManyNames = namePatterns.length > 5; // Lower threshold

    // Check for tabular patterns - be more specific to avoid false positives
    const hasTabularPatterns = para.includes('初封') || para.includes('王弟') ||
      para.includes('薨') || para.includes('元年') || para.includes('即位') ||
      // Look for very regular numeric patterns typical of tables
      (para.match(/\d{1,2}[\s\u3000]+\d{1,2}[\s\u3000]+\d{1,2}/g) || []).length > 2;

    // For chapter 15, also skip paragraphs that look like table data (years followed by numbers)
    const looksLikeTableData = /^\d{3,4}[\s\u3000]+.*[\d一二三四五六七八九十百千]+.*$/.test(para) && para.length < 100;

    // Only skip if it has both state names AND tabular patterns, or has many names in a short space, or looks like table data
    const shouldSkip = (hasStateNames && hasTabularPatterns) ||
      (hasManyNames && para.length < 300 && (para.match(/[\u4e00-\u9fff]{2,}[，。]/g) || []).length > 6) ||
      looksLikeTableData;

    if (shouldSkip) {
      console.error(`Skipping apparent table data formatted as text: ${para.substring(0, 50)}...`);
      i++;
      continue;
    }

    if (isMostlyChinese(para)) {
      // Check if next paragraph is English translation
      // Skip any section headers first
      let nextIdx = i + 1;
      while (nextIdx < paragraphs.length && isSectionHeader(paragraphs[nextIdx])) {
        nextIdx++;
      }
      const nextPara = nextIdx < paragraphs.length ? paragraphs[nextIdx] : null;
      const hasEnglishTranslation = nextPara && isMostlyEnglish(nextPara);

      // Segment Chinese into sentences
      const zhSentences = segmentSentences(para);

      if (hasEnglishTranslation) {
        // We have parallel text - attempt to align sentence-by-sentence
        const enText = nextPara;
        const alignedTranslations = alignTranslations(zhSentences, enText);

        // Only attribute to Herbert J. Allen if the translation isn't boilerplate
        const isActualTranslation = !isBoilerplateText(enText);

        const block = {
          type: 'paragraph',
          sentences: zhSentences.map((s, idx) => ({
            id: `s${String(++sentenceCounter).padStart(4, '0')}`,
            zh: s,
            translations: [{
              lang: 'en',
              literal: (alignedTranslations[idx] && isActualTranslation) ? alignedTranslations[idx] : '',
              idiomatic: '',
              translator: (alignedTranslations[idx] && isActualTranslation) ? 'Herbert J. Allen (1894)' : ''
            }]
          })),
          translations: [{
            lang: 'en',
            literal: isActualTranslation ? enText : '',
            idiomatic: '',
            translator: isActualTranslation ? 'Herbert J. Allen (1894)' : ''
          }]
        };
        content.push(block);
        // Skip Chinese, any headers, and English
        const headersSkipped = nextIdx - (i + 1);
        i = nextIdx + 1; // Move past the English translation
      } else {
        // Chinese only
        const block = {
          type: 'paragraph',
          sentences: zhSentences.map(s => ({
            id: `s${String(++sentenceCounter).padStart(4, '0')}`,
            zh: s,
            translations: [{
              lang: 'en',
              literal: '',
              idiomatic: '',
              translator: ''
            }]
          })),
          translations: [{
            lang: 'en',
            literal: '',
            idiomatic: '',
            translator: ''
          }]
        };
        content.push(block);
        i++;
      }
    } else {
      // Skip non-Chinese content (like English without Chinese)
      i++;
    }
  }

  return { content, tokens: allTokens, sentenceCounter };
}

/**
 * Parse the chapter title
 */
function parseTitle($) {
  const h3 = $('h3').first().text() || $('h2').first().text() || '';
  const text = normalizeWhitespace(h3);

  // Try to split Chinese/English parts
  // Format usually: "卷三百六十九 列傳... Volume 369 Biographies..."
  const volumeMatch = text.match(/^(.+?)\s+(Volume\s+\d+.*)$/i);

  if (volumeMatch) {
    return {
      zh: volumeMatch[1].trim(),
      en: volumeMatch[2].trim(),
      raw: text
    };
  }

  return {
    zh: text,
    en: null,
    raw: text
  };
}

function listBooks() {
  console.log('\nAvailable books (24 Dynastic Histories):\n');
  console.log('Book ID'.padEnd(20) + 'English Name'.padEnd(45) + 'Chinese'.padEnd(12) + 'Dynasty/Period');
  console.log('='.repeat(120));

  for (const [id, info] of Object.entries(BOOKS)) {
    console.log(
      id.padEnd(20) +
      info.name.padEnd(45) +
      info.chinese.padEnd(12) +
      info.dynasty
    );
  }

  console.log('\nUsage: node scrape.js <book-id> <chapter-number> [--glossary <path>] [--url <custom-url>]');
  console.log('Example: node scrape.js songshi 369 --glossary data/glossary.json');
  console.log('Example: node scrape.js shiji 013 --url https://ctext.org/shiji/san-dai-shi-biao\n');
}

// Check if text contains Chinese characters
function containsChinese(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

function countSentences(content) {
  return content.reduce((sum, block) => {
    if (block.type === 'paragraph') {
      return sum + block.sentences.filter(s => s.zh && s.zh.trim() !== '').length;
    } else if (block.type === 'table_row') {
      return sum + block.cells.filter(cell => cell.content && cell.content.trim() !== '').length;
    } else if (block.type === 'table_header') {
      return sum + block.sentences.filter(s => s.zh && s.zh.trim() !== '').length;
    }
    return sum;
  }, 0);
}

function getCtextUrl(bookId, chapter) {
  // Try to load URL mappings from a data file instead of hardcoding
  try {
    const ctextUrlsPath = path.join(process.cwd(), 'data', 'ctext-urls.json');
    if (fs.existsSync(ctextUrlsPath)) {
      const ctextUrls = JSON.parse(fs.readFileSync(ctextUrlsPath, 'utf8'));
      return ctextUrls[bookId]?.[chapter];
    }
  } catch (err) {
    console.error(`Warning: Could not load ctext URLs from data file: ${err.message}`);
  }

  // Fallback: try common patterns for shiji chapters
  if (bookId === 'shiji') {
    // For now, return null - we'll need to add URL mappings to a data file
    // This forces the system to detect tabular content dynamically
    return null;
  }

  return null;
}

async function scrapeTabularChapter(bookId, chapter, glossaryPath, customUrl) {
  const book = BOOKS[bookId];

  // Load existing glossary if provided
  let glossary = {};
  if (glossaryPath && fs.existsSync(glossaryPath)) {
    try {
      const data = fs.readFileSync(glossaryPath, 'utf8');
      glossary = JSON.parse(data);
      console.error(`Loaded glossary with ${Object.keys(glossary).length} entries from ${glossaryPath}`);
    } catch (err) {
      console.error(`Warning: Could not load glossary from ${glossaryPath}: ${err.message}`);
    }
  }

  // Get ctext URL for this chapter
  const ctextUrl = customUrl || getCtextUrl(bookId, chapter);
  if (!ctextUrl) {
    console.error(`No ctext URL configured for ${bookId} chapter ${chapter}. Add it to data/ctext-urls.json to enable table scraping.`);
    console.error('Falling back to regular chinesenotes scraping...');

    // Fall back to regular scraping
    const chinesenotesUrl = book.urlPattern.replace('{chapter}', chapter);
    const chinesenotesHtml = await fetchContent(chinesenotesUrl);
    const chinesenotes$ = load(chinesenotesHtml, { decodeEntities: true });
    const chinesenotesTitle = parseTitle(chinesenotes$);
    const { content: finalContent, tokens: finalTokens } = extractContent(chinesenotes$);

    const result = {
      meta: {
        book: bookId,
        bookInfo: book,
        chapter: chapter,
        url: chinesenotesUrl,
        title: chinesenotesTitle,
        sentenceCount: countSentences(finalContent),
        translatedCount: 0,
        glossarySize: Object.keys(glossary).length,
        scrapedAt: new Date().toISOString()
      },
      content: finalContent
    };

    return result;
  }

  // Use ctext.org exclusively for all tabular chapters - it contains both intro and table content
  console.error('Using ctext.org exclusively for tabular chapter...');
  const ctextHtml = await fetchContent(ctextUrl);
  const ctext$ = load(ctextHtml, { decodeEntities: true });
  const ctextTitle = parseTitle(ctext$);
  const { content: tableContent, tokens: tableTokens, sentenceCounter: tableCounter } = extractContent(ctext$, true, 0, ctextUrl, chapter);
  console.error(`Table content has ${tableContent.length} items`);

  const finalContent = tableContent;
  const finalTokens = tableTokens;
  const finalCounter = tableCounter;
  const title = ctextTitle;
  const url = ctextUrl;
  console.error(`Final content has ${finalContent.length} items, total sentences: ${finalCounter}`);

  // Update glossary
  glossary = updateGlossary(glossary, finalTokens);

  // Generate metadata
  const meta = {
    book: bookId,
    bookInfo: book,
    chapter,
    url: url, // Use the appropriate URL based on scraping method
    ctextUrl: ctextUrl, // Store ctext URL for reference
    title: title,
    sentenceCount: countSentences(finalContent),
    translatedCount: finalContent.reduce((sum, block) => {
      if (block.type === 'paragraph') {
        return sum + block.sentences.filter(s => {
          // Skip empty content
          if (!s.zh || s.zh.trim() === '') return false;
          // Check if translation exists and doesn't contain Chinese characters
          const translation = s.translations?.[0]?.text;
          return translation && translation.trim() !== '' && !containsChinese(translation);
        }).length;
      } else if (block.type === 'table_row') {
        return sum + block.cells.filter(cell => {
          // Skip empty content
          if (!cell.content || cell.content.trim() === '') return false;
          // Check if translation exists and doesn't contain Chinese characters
          const translation = cell.translation;
          return translation && translation.trim() !== '' && !containsChinese(translation);
        }).length;
      } else if (block.type === 'table_header') {
        return sum + block.sentences.filter(s => {
          // Skip empty content
          if (!s.zh || s.zh.trim() === '') return false;
          // Check if translation exists and doesn't contain Chinese characters
          const translation = s.translations?.[0]?.text;
          return translation && translation.trim() !== '' && !containsChinese(translation);
        }).length;
      }
      return sum;
    }, 0),
    glossarySize: Object.keys(glossary).length,
    scrapedAt: new Date().toISOString()
  };

  const result = {
    meta,
    content: finalContent
  };

  return result;
}

async function fetchContent(url) {
  // Always use curl to avoid SSL certificate issues
  // Add encoding options to ensure proper UTF-8 handling
  const curl = spawn('curl', [
    '-k',           // Ignore SSL certificate issues
    '-s',           // Silent mode
    '--compressed', // Handle compressed responses
    '-H', 'Accept-Encoding: gzip,deflate',
    '-H', 'Accept-Charset: utf-8',
    '--user-agent', 'Mozilla/5.0 (compatible; records-scraper/1.0)',
    url
  ], { stdio: ['pipe', 'pipe', 'inherit'] });

  let output = '';
  curl.stdout.on('data', (data) => {
    // Explicitly decode as UTF-8
    output += data.toString('utf8');
  });

  await new Promise((resolve, reject) => {
    curl.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`curl exited with code ${code}`));
      }
    });
    curl.on('error', reject);
  });
  return output;
}

async function scrapeChapter(bookId, chapter, glossaryPath, customUrl) {
  const book = BOOKS[bookId];
  if (!book) {
    console.error(`Error: Unknown book "${bookId}"`);
    console.error('Use --list to see available books');
    process.exit(1);
  }

  // Check if existing chapter has ctext.org URL (indicating it's a tabular chapter)
  const existingFile = `data/${bookId}/${chapter.padStart(3, '0')}.json`;
  let isTabularChapter = !!customUrl;

  // For shiji chapters with ctext URLs configured, use ctext.org
  const ctextUrl = getCtextUrl(bookId, chapter);
  if (ctextUrl) {
    console.error(`Chapter ${chapter} has ctext.org URL configured - will use ctext.org`);
    isTabularChapter = true;
    customUrl = ctextUrl;
  }

  if (!isTabularChapter && fs.existsSync(existingFile)) {
    try {
      const existingData = JSON.parse(fs.readFileSync(existingFile, 'utf8'));
      if (existingData.meta && existingData.meta.url && existingData.meta.url.includes('ctext.org')) {
        console.error('Existing chapter has ctext.org URL - treating as tabular chapter');
        isTabularChapter = true;
        customUrl = existingData.meta.url; // Use the existing ctext URL
      }
    } catch (e) {
      // Ignore errors reading existing file
    }
  }

  if (isTabularChapter) {
    console.error('Custom URL provided - treating as tabular chapter');
    // Use ctext exclusively for tabular chapters, or hybrid for others
    return await scrapeTabularChapter(bookId, chapter, glossaryPath, customUrl);
  }

  const targetUrl = customUrl || book.urlPattern.replace('{chapter}', chapter);

  // Load existing glossary if provided
  let glossary = {};
  if (glossaryPath && fs.existsSync(glossaryPath)) {
    try {
      const data = fs.readFileSync(glossaryPath, 'utf8');
      glossary = JSON.parse(data);
      console.error(`Loaded glossary with ${Object.keys(glossary).length} entries from ${glossaryPath}`);
    } catch (err) {
      console.error(`Warning: Could not load glossary from ${glossaryPath}: ${err.message}`);
    }
  }

  let html;
  try {
    if (customUrl && customUrl.includes('ctext.org')) {
      // Use curl for ctext.org URLs
      const curl = spawn('curl', ['-k', '-s', targetUrl], { stdio: ['pipe', 'pipe', 'inherit'] });

      let output = '';
      curl.stdout.on('data', (data) => {
        output += data.toString();
      });

      await new Promise((resolve, reject) => {
        curl.on('close', (code) => {
          if (code === 0) {
            html = output;
            resolve();
          } else {
            reject(new Error(`curl exited with code ${code}`));
          }
        });
        curl.on('error', reject);
      });
    } else {
      // Use fetch for other URLs
      const res = await fetch(targetUrl, {
        headers: { 'user-agent': 'records-grand-historian-scraper/1.0' }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch ${targetUrl}: ${res.status} ${res.statusText}`);
      }

      html = await res.text();
    }
    const $ = load(html);

    const title = parseTitle($);
    const isFromCtext = customUrl && customUrl.includes('ctext.org');
    const { content, tokens } = extractContent($, isFromCtext);

    // Update glossary with new tokens
    glossary = updateGlossary(glossary, tokens);

    // Count sentences and translations
    let sentenceCount = 0;
    let translatedCount = 0;
    for (const block of content) {
      sentenceCount += block.sentences.length;
      // Count sentences that have actual translation text
      for (const sentence of block.sentences) {
        if (sentence.translations && sentence.translations.length > 0 && sentence.translations[0].text) {
          translatedCount++;
        }
      }
    }

    // Save updated glossary if path provided
    if (glossaryPath) {
      try {
        const dir = path.dirname(glossaryPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(glossaryPath, JSON.stringify(glossary, null, 2), 'utf8');
        console.error(`Saved glossary with ${Object.keys(glossary).length} entries to ${glossaryPath}`);
      } catch (err) {
        console.error(`Warning: Could not save glossary to ${glossaryPath}: ${err.message}`);
      }
    }

    // Prepare result without glossary (it's stored separately)
    const result = {
      meta: {
        book: bookId,
        bookInfo: {
          name: book.name,
          chinese: book.chinese,
          pinyin: book.pinyin,
          dynasty: book.dynasty
        },
        chapter,
        url: targetUrl,
        title,
        sentenceCount,
        translatedCount,
        glossarySize: Object.keys(glossary).length,
        scrapedAt: new Date().toISOString()
      },
      content
    };

    return result;
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log('\nUsage:');
    console.log('  node scrape.js <book-id> <chapter> [--glossary <path>]');
    console.log('                                      Scrape a specific chapter');
    console.log('  node scrape.js --list               List all available books');
    console.log('  node scrape.js --help               Show this help\n');
    console.log('Options:');
    console.log('  --glossary <path>  Path to global glossary JSON file');
    console.log('                     Will be loaded if exists, updated with new words\n');
    console.log('Output format:');
    console.log('  - meta: Book info, chapter, title, counts');
    console.log('  - content: Array of paragraph blocks with sentences');
    console.log('             When English exists, stored as block.en');
    console.log('  - glossary: Updated global word annotations\n');
    process.exit(0);
  }

  if (args[0] === '--list' || args[0] === '-l') {
    listBooks();
    process.exit(0);
  }

  if (args.length < 2) {
    console.error('Error: Please provide both book ID and chapter number');
    console.error('Usage: node scrape.js <book-id> <chapter>');
    console.error('Use --list to see available books');
    process.exit(1);
  }

  const bookId = args[0];
  const chapter = args[1];

  // Check for --glossary option
  let glossaryPath = null;
  const glossaryIdx = args.indexOf('--glossary');
  if (glossaryIdx !== -1 && glossaryIdx + 1 < args.length) {
    glossaryPath = args[glossaryIdx + 1];
  }

  // Check for --url option
  let customUrl = null;
  const urlIdx = args.indexOf('--url');
  if (urlIdx !== -1 && urlIdx + 1 < args.length) {
    customUrl = args[urlIdx + 1];
  }

  const result = await scrapeChapter(bookId, chapter, glossaryPath, customUrl);
  if (result) {
    // Save to data file
    const dataDir = `data/${bookId}`;
    const fileName = `${chapter.padStart(3, '0')}.json`;
    const filePath = `${dataDir}/${fileName}`;

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf8');
    console.error(`✅ Saved to ${filePath}`);

    // Also print to console for debugging
    console.log(JSON.stringify(result, null, 2));
  }
}

await main();