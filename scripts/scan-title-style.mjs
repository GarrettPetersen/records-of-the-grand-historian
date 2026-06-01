#!/usr/bin/env node
/**
 * Scan chapter metadata titles for publication-facing style artifacts.
 *
 * Scraped chapter headings often preserve section labels with hyphens or leave
 * significant English title words in sentence case. Those strings are visible
 * in EPUB TOCs, chapter headings, Open Graph cards, and book pages.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA_DIR = path.join(process.cwd(), 'data');
const SMALL_WORDS = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'nor', 'of', 'on', 'or', 'per', 'since', 'the', 'to', 'vs', 'via']);
const EXPECTED_TITLES = {
  shiji: {
    '023': 'Treatise on Ritual',
    '024': 'Treatise on Music',
    '025': 'Treatise on the Pitch-Pipes',
    '026': 'Treatise on the Calendar',
    '027': 'Treatise on the Celestial Offices',
    '028': 'Treatise on the Feng and Shan Sacrifices',
    '029': 'Treatise on Rivers and Canals',
    '030': 'Treatise on the Balanced Standard',
  },
};

function usage() {
  console.error(`Usage:
  node scripts/scan-title-style.mjs [--book BOOK] [--json] [--summary] [--fail] [--fix] [path ...]

Options:
  --book BOOK  Scan data/BOOK
  --json       Emit machine-readable JSON
  --summary    Emit per-book counts only
  --fail       Exit 1 when title style candidates are found
  --fix        Rewrite simple title style artifacts`);
}

function parseArgs(argv) {
  const opts = { inputs: [], book: null, json: false, summary: false, fail: false, fix: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--json') {
      opts.json = true;
      continue;
    }
    if (arg === '--summary') {
      opts.summary = true;
      continue;
    }
    if (arg === '--fail') {
      opts.fail = true;
      continue;
    }
    if (arg === '--fix') {
      opts.fix = true;
      continue;
    }
    if (arg === '--book') {
      opts.book = argv[++i];
      if (!opts.book) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.book = arg.slice('--book='.length);
      continue;
    }
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(2);
    }
    opts.inputs.push(arg);
  }
  if (opts.book && opts.inputs.length > 0) {
    console.error('Use either --book or explicit paths, not both.');
    process.exit(2);
  }
  return opts;
}

function chapterFiles(inputs) {
  const files = [];
  const enqueue = (entry) => {
    if (!fs.existsSync(entry)) return;
    const st = fs.statSync(entry);
    if (st.isDirectory()) {
      for (const child of fs.readdirSync(entry).sort()) enqueue(path.join(entry, child));
      return;
    }
    if (/^\d{3}\.json$/u.test(path.basename(entry))) files.push(entry);
  };
  for (const input of inputs) enqueue(input);
  return [...new Set(files)].sort();
}

function titleWords(title) {
  return [...String(title || '').matchAll(/\b[\p{L}][\p{L}'’.-]*/gu)]
    .map((match) => ({ word: match[0], index: match.index }));
}

function isLowercaseSignificantWord(word, index, words) {
  const normalized = word.toLowerCase();
  if (index === 0 || index === words.length - 1) return /^[\p{Ll}]/u.test(word);
  if (SMALL_WORDS.has(normalized)) return false;
  if (/^[a-z][a-z'’-]*$/u.test(word)) return true;
  return false;
}

function titleCaseWord(word, index, words) {
  const normalized = word.toLowerCase();
  if (index > 0 && index < words.length - 1 && SMALL_WORDS.has(normalized)) return normalized;
  return word.replace(/^\p{Ll}/u, (char) => char.toUpperCase());
}

function fixTitle(title) {
  const normalizedSeparator = String(title || '').replace(/\s+-\s+/gu, ': ');
  const words = titleWords(normalizedSeparator);
  let cursor = 0;
  let next = '';
  for (let i = 0; i < words.length; i += 1) {
    const { word, index } = words[i];
    next += normalizedSeparator.slice(cursor, index);
    next += titleCaseWord(word, i, words);
    cursor = index + word.length;
  }
  next += normalizedSeparator.slice(cursor);
  return next;
}

function scanTitle(title) {
  const hits = [];
  if (/\s+-\s+/u.test(title)) {
    hits.push({ rule: 'section_hyphen_separator', found: title, preferred: title.replace(/\s+-\s+/gu, ': ') });
  }
  const words = titleWords(title);
  for (let i = 0; i < words.length; i += 1) {
    const { word } = words[i];
    if (isLowercaseSignificantWord(word, i, words)) {
      hits.push({ rule: 'lowercase_significant_title_word', found: word, preferred: titleCaseWord(word, i, words) });
    }
  }
  return hits;
}

function scanFile(file, opts) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const title = data.meta?.title?.en || '';
  const expected = EXPECTED_TITLES[data.meta?.book]?.[data.meta?.chapter];
  const hits = scanTitle(title);
  if (expected && title !== expected) {
    hits.push({ rule: 'expected_publication_title', found: title, preferred: expected });
  }
  if (opts.fix && hits.length > 0) {
    const nextTitle = expected || fixTitle(title);
    if (nextTitle !== title) {
      data.meta.title.en = nextTitle;
      if (typeof data.meta.title.raw === 'string') {
        data.meta.title.raw = data.meta.title.raw.replace(title, nextTitle);
      }
      fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    }
  }
  return {
    book: data.meta?.book || path.basename(path.dirname(file)),
    chapter: data.meta?.chapter || path.basename(file, '.json'),
    file: path.relative(process.cwd(), file),
    title,
    fixedTitle: opts.fix && hits.length > 0 ? fixTitle(title) : undefined,
    hits,
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const inputs = opts.book
    ? [path.join(DATA_DIR, opts.book)]
    : opts.inputs.length > 0
      ? opts.inputs
      : [DATA_DIR];
  const rows = chapterFiles(inputs).map((file) => scanFile(file, opts)).filter((row) => row.hits.length > 0);
  const totalHits = rows.reduce((sum, row) => sum + row.hits.length, 0);

  if (opts.json) {
    console.log(JSON.stringify({ count: totalHits, rows }, null, 2));
  } else if (opts.summary) {
    const byBook = new Map();
    for (const row of rows) {
      const current = byBook.get(row.book) || { chapters: 0, hits: 0 };
      current.chapters += 1;
      current.hits += row.hits.length;
      byBook.set(row.book, current);
    }
    console.log(`${opts.fix ? 'Fixed title style candidates' : 'Title style candidates'}: ${totalHits} hit(s) in ${rows.length} chapter(s)`);
    console.log('');
    console.log('book\tchapters\thits');
    for (const [book, counts] of [...byBook.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      console.log(`${book}\t${counts.chapters}\t${counts.hits}`);
    }
  } else {
    console.log(`${opts.fix ? 'Fixed title style candidates' : 'Title style candidates'}: ${totalHits} hit(s) in ${rows.length} chapter(s)`);
    if (totalHits > 0) console.log('');
    for (const row of rows) {
      console.log(`${row.book}\t${row.chapter}\t${row.hits.length}\t${row.file}\t${row.title}${row.fixedTitle ? ` -> ${row.fixedTitle}` : ''}`);
      for (const hit of row.hits) console.log(`  ${hit.rule}: ${hit.found} -> ${hit.preferred}`);
    }
  }

  if (opts.fail && totalHits > 0) process.exit(1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
