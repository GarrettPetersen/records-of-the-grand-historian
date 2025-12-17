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
    urlPattern: 'https://chinesenotes.com/shiji/shiji{chapter}.html'
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
function parseCtextTables($, $container, startSentenceCounter, customHeaderText = '', url = '') {
  const content = [];
  let sentenceCounter = startSentenceCounter;

  // Find the main genealogical table (skip navigation/header tables)
  const $mainTable = $container.find('table').filter((i, table) => {
    const $table = $(table);
    // Look for table with resrow class cells (genealogical data) or colhead headers
    return $table.find('td.resrow, td.resrowalt, th.colhead').length > 0;
  }).first();

  if ($mainTable.length === 0) {
    console.error('No genealogical table found in ctext.org HTML');
    return { content, tokens: [] };
  }

  const $table = $mainTable;

  // Create table header - use custom header text if provided, otherwise extract from URL
  let headerText = customHeaderText || '三代世表';

  // Try to extract table name from URL
  if (url && url.includes('/shiji/')) {
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    console.error(`URL parsing: url=${url}, lastPart=${lastPart}`);
    if (lastPart) {
      // Convert URL slug to Chinese title
      const titleMap = {
        'san-dai-shi-biao': '三代世表',
        'shi-er-zhu-hou-nian-biao': '十二諸侯年表',
        'liu-guo-nian-biao': '六國年表',
        'qin-chu-zhi-ji-yue-biao': '秦楚之際月表'
      };
      if (titleMap[lastPart]) {
        headerText = titleMap[lastPart];
        console.error(`Using table header from URL: ${headerText}`);
      }
    }
  }
  content.push({
    type: 'table_header',
    sentences: [{
      id: `s${++sentenceCounter}`,
      zh: headerText,
      translations: [{ lang: 'en', text: '', translator: '' }]
    }],
    translations: []
  });

  // Process all rows including headers

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
        translations: [{ lang: 'en', text: '', translator: '' }]
      });
    });

    console.error(`Row ${rowIndex}: found ${cells.length} cells`);
    console.error(`  Cell contents: ${cells.slice(0, 5).map(c => `"${c.zh || 'empty'}"`).join(', ')}`);

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

    console.error(`Creating table row ${rowIndex} with ${rowCells.length} cells: ${rowCells.slice(0, 3).map(c => `"${c.content}"`).join(', ')}`);

    content.push({
      type: 'table_row',
      cells: rowCells
    });
  });

  console.error(`Parsed ${content.length} table elements from ctext.org genealogical table`);
  return { content, tokens: [], sentenceCounter: startSentenceCounter }; // Return updated sentence counter
}

/**
 * Extract all content from ctext.org pages (paragraphs and tables)
 */
function extractCtextContent($, startSentenceCounter, url = '') {
  const content = [];
  let sentenceCounter = startSentenceCounter;

  // Get all text content and tables from the main content area
  const $main = $('main.main-content, #content, body').first();
  if (!$main.length) {
    console.error('No main content area found in ctext.org HTML');
    return { content, tokens: [], sentenceCounter };
  }

  // Find ALL potential content elements - we'll filter them later
  const $contentElements = $main.find('p, div, span, section, table').filter((i, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    // Include any element with substantial text content
    return text.length > 5;
  });
  let pendingTableHeader = '';

  $contentElements.each((index, element) => {
    const $el = $(element);

    if ($el.is('table')) {
      // Use the <table> HTML tag to detect tables
      // Extract table content with any pending table header
      const tableResult = parseCtextTables($, $el, sentenceCounter, pendingTableHeader, url);
      if (tableResult.content.length > 0) {
        console.error(`Adding ${tableResult.content.length} table items to content (first: ${tableResult.content[0]?.type || 'none'})`);
        content.push(...tableResult.content);
        sentenceCounter = tableResult.sentenceCounter;
      }
      // Clear the pending header after using it
      pendingTableHeader = '';
    } else if ($el.is('p, div')) {
      // Extract paragraph content, but skip elements inside tables
      if ($el.closest('table').length > 0) {
        return; // Skip elements that are inside <table> tags
      }

      const text = $el.text().trim();

      if (text && text.length > 5) { // Include more content
        // Skip obvious navigation/header content
        if (text.includes('Chinese Text Project') ||
          text.includes('Home') ||
          text.match(/^\d+\s+comments?$/) ||
          text === '简体中文版' ||
          text === 'Advanced' ||
          text.length < 10) {
          return;
        }

        // Check if this is the introductory text we're looking for
        if (text.includes('太史公') && text.includes('讀春秋')) {
          console.error(`Found introductory text: ${text.substring(0, 50)}...`);
          const sentences = segmentSentences(text);
          if (sentences.length > 0) {
            content.push({
              type: 'paragraph',
              sentences: sentences.map(text => ({
                id: `s${++sentenceCounter}`,
                zh: text,
                translations: [{ lang: 'en', text: '', translator: '' }]
              })),
              translations: []
            });
          }
          return;
        }

        // Check if this looks like a table header (many state names)
        const stateNames = ['魯', '齊', '晉', '秦', '楚', '宋', '衛', '陳', '蔡', '曹', '燕', '魏', '吳', '周'];
        const stateCount = stateNames.filter(state => text.includes(state)).length;

        if (stateCount >= 8 && text.length < 150 && text.includes('周')) {
          // This looks like a table header - save it for the next table
          pendingTableHeader = text;
          console.error(`Detected table header: ${text.substring(0, 50)}...`);
          return; // Don't add this as a regular paragraph
        }

        // Skip table data rows (many numbers + state references)
        const numberCount = (text.match(/\d+/g) || []).length;
        if (numberCount >= 2 && stateCount >= 1 && text.length < 250) {
          console.error(`Skipping table data: ${text.substring(0, 50)}...`);
          return;
        }

        // For ctext.org, be more permissive with content extraction
        const sentences = segmentSentences(text);
        if (sentences.length > 0 && sentences[0].length > 20) { // Ensure substantial content
          content.push({
            type: 'paragraph',
            sentences: sentences.map(text => ({
              id: `s${++sentenceCounter}`,
              zh: text,
              translations: [{ lang: 'en', text: '', translator: '' }]
            })),
            translations: []
          });
        }
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

  // Force the table header row with "公元前" to be the first table row
  const tableRows = content.filter(item => item.type === 'table_row');
  if (tableRows.length > 0) {
    const firstTableRowIndex = content.findIndex(item => item.type === 'table_row');

    // Create header row
    const headerCells = [
      { id: `s${++sentenceCounter}`, content: '公元前', translation: '' },
      { id: `s${++sentenceCounter}`, content: '年', translation: '' },
      { id: `s${++sentenceCounter}`, content: '周', translation: '' },
      { id: `s${++sentenceCounter}`, content: '魯', translation: '' },
      { id: `s${++sentenceCounter}`, content: '齊', translation: '' },
      { id: `s${++sentenceCounter}`, content: '晉', translation: '' },
      { id: `s${++sentenceCounter}`, content: '秦', translation: '' },
      { id: `s${++sentenceCounter}`, content: '楚', translation: '' },
      { id: `s${++sentenceCounter}`, content: '宋', translation: '' },
      { id: `s${++sentenceCounter}`, content: '衛', translation: '' },
      { id: `s${++sentenceCounter}`, content: '陳', translation: '' },
      { id: `s${++sentenceCounter}`, content: '蔡', translation: '' },
      { id: `s${++sentenceCounter}`, content: '曹', translation: '' },
      { id: `s${++sentenceCounter}`, content: '鄭', translation: '' },
      { id: `s${++sentenceCounter}`, content: '燕', translation: '' },
      { id: `s${++sentenceCounter}`, content: '吳', translation: '' }
    ];

    const headerRow = {
      type: 'table_row',
      cells: headerCells
    };

    // Replace the first table row with the header row
    content.splice(firstTableRowIndex, 1, headerRow);
    console.error('Replaced first table row with header row containing 公元前');
  }

  console.error(`Extracted ${content.length} content blocks from ctext.org`);
  return { content, tokens, sentenceCounter };
}

/**
 * Extract structured content from the page
 * Handle both Chinese-only and Chinese-English parallel text
 */
function extractContent($, isFromCtext = false, startSentenceCounter = 0, url = '') {
  const content = [];
  let sentenceCounter = startSentenceCounter;

  // Handle ctext.org pages - extract all content including paragraphs and tables
  if (isFromCtext) {
    const result = extractCtextContent($, sentenceCounter, url);
    return result;
  }

  // Get the main content area
  const $main = $('main.main-content');
  if (!$main.length) {
    return { content: [], tokens: [] };
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

    // Check for tabular patterns
    const hasTabularPatterns = para.includes('初封') || para.includes('王弟') ||
      para.includes('二年') || para.includes('三年') ||
      (para.match(/\w{2,}[，。]\w{2,}[，。]/) && para.length < 200) ||
      (para.match(/[\u4e00-\u9fff]{2,}[，。]/g) || []).length > 4; // Many short segments

    if ((hasStateNames && (hasTabularPatterns || hasManyNames)) || hasManyNames) {
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

        const block = {
          type: 'paragraph',
          sentences: zhSentences.map((s, idx) => ({
            id: `s${String(++sentenceCounter).padStart(4, '0')}`,
            zh: s,
            translations: [{
              lang: 'en',
              text: alignedTranslations[idx] || '',
              translator: alignedTranslations[idx] ? 'Herbert J. Allen (1894)' : ''
            }]
          })),
          translations: [{
            lang: 'en',
            text: enText,
            translator: 'Herbert J. Allen (1894)'
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
              text: '',
              translator: ''
            }]
          })),
          translations: [{
            lang: 'en',
            text: '',
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

function countSentences(content) {
  return content.reduce((sum, block) => {
    if (block.type === 'paragraph') {
      return sum + block.sentences.length;
    } else if (block.type === 'table_row') {
      return sum + block.cells.length;
    } else if (block.type === 'table_header') {
      return sum + block.sentences.length;
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

async function scrapeTabularChapter(bookId, chapter, glossaryPath) {
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
  const ctextUrl = getCtextUrl(bookId, chapter);
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

  // Try to get introductory text from chinesenotes first
  console.error('Step 1: Getting introductory text from chinesenotes.com...');
  const chinesenotesUrl = book.urlPattern.replace('{chapter}', chapter);
  const chinesenotesHtml = await fetchContent(chinesenotesUrl);
  const chinesenotes$ = load(chinesenotesHtml, { decodeEntities: true });
  const { content: introContent, tokens: introTokens } = extractContent(chinesenotes$);

  // Scrape table content from ctext.org
  console.error('Step 2: Scraping table content from ctext.org...');
  const ctextHtml = await fetchContent(ctextUrl);
  const ctext$ = load(ctextHtml, { decodeEntities: true });
  const ctextTitle = parseTitle(ctext$);
  const { content: tableContent, tokens: tableTokens } = extractContent(ctext$, true, ctextUrl);

  // Combine intro content and table content
  const finalContent = [...introContent, ...tableContent];
  const finalTokens = [...introTokens, ...tableTokens];

  // Update glossary
  glossary = updateGlossary(glossary, finalTokens);

  // Generate metadata
  const meta = {
    book: bookId,
    bookInfo: book,
    chapter,
    url: ctextUrl,
    title: ctextTitle,
    sentenceCount: countSentences(finalContent),
    translatedCount: finalContent.reduce((sum, block) => {
      if (block.type === 'paragraph') {
        return sum + block.sentences.filter(s => s.translations?.[0]?.text).length;
      } else if (block.type === 'table_row') {
        return sum + block.cells.filter(cell => {
          // Empty cells are considered translated (nothing to translate)
          if (!cell.content || cell.content.trim() === '') return true;
          // Cells with content are translated if they have a translation
          return cell.translation && cell.translation.trim() !== '';
        }).length;
      } else if (block.type === 'table_header') {
        return sum + block.sentences.filter(s => s.translations?.[0]?.text).length;
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

  // Determine if this is a tabular chapter
  // chinesenotes NEVER has proper HTML table structures
  // Tabular chapters are identified by providing a custom ctext.org URL
  const isTabularChapter = !!customUrl;

  if (isTabularChapter) {
    console.error('Custom URL provided - treating as tabular chapter');
    // Hybrid scraping: get text content from chinesenotes, table from ctext
    return await scrapeTabularChapter(bookId, chapter, glossaryPath);
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

    console.log(JSON.stringify(result, null, 2));
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

  await scrapeChapter(bookId, chapter, glossaryPath, customUrl);
}

await main();