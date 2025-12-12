#!/usr/bin/env node

/**
 * scrape.js - Universal scraper for the 24 Dynastic Histories from chinesenotes.com
 * 
 * Usage:
 *   node scrape.js <book> <chapter>
 *   node scrape.js --list
 * 
 * Examples:
 *   node scrape.js shiji 1          # Scrape Records of the Grand Historian, chapter 1
 *   node scrape.js songshi 369      # Scrape History of Song, chapter 369
 *   node scrape.js --list           # List all available books
 */

import { load } from 'cheerio';
import fs from 'node:fs';
import path from 'node:path';

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
  nanshu: {
    name: 'Book of Southern Qi',
    chinese: '南齊書',
    pinyin: 'Nán Qíshū',
    dynasty: 'Southern Qi',
    urlPattern: 'https://chinesenotes.com/nanshu/nanshu{chapter}.html'
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

function normalizeWhitespace(text) {
  return text.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
}

function splitTitle(rawTitle) {
  const text = normalizeWhitespace(rawTitle);
  const idx = text.indexOf(' Volume ');
  const chinese = idx !== -1 ? text.slice(0, idx) : text;
  const english = idx !== -1 ? text.slice(idx + 1) : undefined;
  return { chinese, english, raw: text };
}

function isMostlyChinese(text) {
  const t = text.replace(/[\s\u200B\uFEFF]+/g, '');
  if (!t) return false;
  const chineseMatches = t.match(/[\p{Script=Han}]/gu);
  const latinMatches = t.match(/[A-Za-z]/g);
  const chineseCount = chineseMatches ? chineseMatches.length : 0;
  const latinCount = latinMatches ? latinMatches.length : 0;
  // Heuristic: include if there is some Chinese and Chinese chars >= Latin chars
  return chineseCount > 0 && chineseCount >= latinCount;
}

function extractParagraphs($) {
  const paragraphs = [];

  function shouldStop($el) {
    const t = normalizeWhitespace($el.text()).toLowerCase();
    if (!t) return false;
    return (
      t.startsWith('chinese text:') ||
      t.includes('glossary and other vocabulary') ||
      t.startsWith('dictionary cache status') ||
      t.startsWith('copyright') ||
      t.startsWith('abbreviations') ||
      t.startsWith('reference') ||
      t.startsWith('help') ||
      t.startsWith('about')
    );
  }

  function extractFromElement($el) {
    const $clone = $el.clone();
    $clone.find('br').replaceWith('\n');
    const raw = $clone.text().replace(/\r\n?/g, '\n');
    const lines = raw.split(/\n+/).map(normalizeWhitespace).filter(Boolean);
    for (const line of lines) {
      if (isMostlyChinese(line)) paragraphs.push(line);
    }
  }

  const $title = $('h3').first().length ? $('h3').first() : $('h2').first();
  if ($title.length) {
    let $cursor = $title.next();
    const safetyLimit = 2000;
    let steps = 0;
    while ($cursor && $cursor.length && steps < safetyLimit) {
      steps++;
      if (shouldStop($cursor)) break;
      const tag = ($cursor[0].tagName || '').toLowerCase();
      if (tag === 'h2' || tag === 'h3') break;
      if (tag === 'p' || tag === 'div' || tag === 'section' || tag === 'article') {
        extractFromElement($cursor);
      }
      $cursor = $cursor.next();
    }
  }

  // Fallback: if nothing captured, scan all paragraphs and divs
  if (paragraphs.length === 0) {
    $('p, div').each((_, el) => extractFromElement($(el)));
  }

  // De-duplicate consecutive identical lines (rare but can happen)
  const deduped = [];
  for (const line of paragraphs) {
    if (deduped.length === 0 || deduped[deduped.length - 1] !== line) {
      deduped.push(line);
    }
  }
  return deduped;
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
  
  console.log('\nUsage: node scrape.js <book-id> <chapter-number>');
  console.log('Example: node scrape.js songshi 369\n');
}

async function scrapeChapter(bookId, chapter) {
  const book = BOOKS[bookId];
  if (!book) {
    console.error(`Error: Unknown book "${bookId}"`);
    console.error('Use --list to see available books');
    process.exit(1);
  }

  const targetUrl = book.urlPattern.replace('{chapter}', chapter);
  
  try {
    const res = await fetch(targetUrl, {
      headers: { 'user-agent': 'records-grand-historian-scraper/1.0' }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch ${targetUrl}: ${res.status} ${res.statusText}`);
    }
    
    const html = await res.text();
    const $ = load(html);

    const h3 = $('h3').first().text() || $('h2').first().text() || '';
    const title = splitTitle(h3 || '');
    const paragraphs = extractParagraphs($);

    const result = {
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
      count: paragraphs.length,
      paragraphs,
      scrapedAt: new Date().toISOString()
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
    console.log('  node scrape.js <book-id> <chapter>     Scrape a specific chapter');
    console.log('  node scrape.js --list                   List all available books');
    console.log('  node scrape.js --help                   Show this help\n');
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
  
  const [bookId, chapter] = args;
  await scrapeChapter(bookId, chapter);
}

await main();