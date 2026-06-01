#!/usr/bin/env node
/**
 * Scan Chinese source fields for scrape artifacts that can leak into generated
 * pages and e-books. These are source-side checks, separate from translation
 * artifact scans.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA_DIR = path.join(process.cwd(), 'data');

const SOURCE_FIELD_NAMES = new Set([
  'zh',
  'source',
  'content',
  'text',
]);

const SOURCE_ARTIFACT_RULES = [
  {
    id: 'SOURCE_PLACEHOLDER_SYMBOL',
    severity: 3,
    description: 'Placeholder or replacement glyph leaked into Chinese source',
    pattern: /[∴�￼]/gu,
  },
  {
    id: 'SOURCE_HTML_TABLE_SPAN',
    severity: 3,
    description: 'HTML table span attribute leaked into Chinese source',
    pattern: /\b(?:rowspan|colspan)\b/gi,
  },
  {
    id: 'SOURCE_RAW_HTML_TAG',
    severity: 2,
    description: 'Raw HTML tag leaked into Chinese source',
    pattern: /<\/?[a-z][^>]*>/gi,
  },
];

function usage() {
  console.error(`Usage:
  node scripts/scan-source-artifacts.mjs [--book BOOK] [--json] [--summary] [--fail] [path ...]

Scans source-side Chinese/text fields for scrape artifacts such as replacement glyphs,
raw table span attributes, and raw HTML tags.`);
}

function parseArgs(argv) {
  const opts = { inputs: [], book: null, json: false, summary: false, fail: false };
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
    if (/^\d{3}\.json$/.test(path.basename(entry))) files.push(entry);
  };

  for (const input of inputs) enqueue(input);
  return [...new Set(files)].sort();
}

function isSourceField(keyPath) {
  const key = keyPath[keyPath.length - 1] || '';
  if (!SOURCE_FIELD_NAMES.has(key)) return false;
  return !keyPath.includes('translations');
}

function nearestContext(keyPath) {
  const sentenceIndex = keyPath.lastIndexOf('sentences');
  if (sentenceIndex >= 0 && keyPath.length > sentenceIndex + 1) {
    return `sentences.${keyPath[sentenceIndex + 1]}.${keyPath.slice(sentenceIndex + 2).join('.')}`;
  }
  const cellIndex = keyPath.lastIndexOf('cells');
  if (cellIndex >= 0 && keyPath.length > cellIndex + 1) {
    return `cells.${keyPath[cellIndex + 1]}.${keyPath.slice(cellIndex + 2).join('.')}`;
  }
  return keyPath.join('.');
}

function excerpt(text, index, width = 56) {
  const start = Math.max(0, index - width);
  const end = Math.min(text.length, index + width);
  return text.slice(start, end).replace(/\s+/g, ' ').trim();
}

function scanSourceText(text) {
  const hits = [];
  for (const rule of SOURCE_ARTIFACT_RULES) {
    rule.pattern.lastIndex = 0;
    let match;
    while ((match = rule.pattern.exec(text)) !== null) {
      hits.push({
        ruleId: rule.id,
        severity: rule.severity,
        description: rule.description,
        found: match[0],
        index: match.index,
        excerpt: excerpt(text, match.index),
      });
    }
  }
  return hits.sort((a, b) => b.severity - a.severity || a.index - b.index || a.ruleId.localeCompare(b.ruleId));
}

function* walk(value, keyPath = [], sentenceId = '') {
  if (typeof value === 'string') {
    if (!isSourceField(keyPath)) return;
    for (const hit of scanSourceText(value)) {
      yield {
        path: nearestContext(keyPath),
        sentenceId,
        ...hit,
      };
    }
    return;
  }

  if (!value || typeof value !== 'object') return;
  const nextSentenceId = typeof value.id === 'string' ? value.id : sentenceId;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      yield* walk(value[i], [...keyPath, String(i)], nextSentenceId);
    }
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    yield* walk(child, [...keyPath, key], nextSentenceId);
  }
}

function bookIdFor(file) {
  return path.basename(path.dirname(file));
}

function chapterIdFor(file) {
  return path.basename(file, '.json');
}

function scanFile(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  return [...walk(data)].map((hit) => ({
    file,
    book: bookIdFor(file),
    chapter: chapterIdFor(file),
    ...hit,
  }));
}

function printSummary(hits) {
  const byBook = new Map();
  const byRule = new Map();
  for (const hit of hits) {
    const book = byBook.get(hit.book) || { chapters: new Set(), hits: 0 };
    book.chapters.add(hit.chapter);
    book.hits += 1;
    byBook.set(hit.book, book);

    const rule = byRule.get(hit.ruleId) || { severity: hit.severity, hits: 0 };
    rule.hits += 1;
    byRule.set(hit.ruleId, rule);
  }

  console.log('\nbook\tchapters\thits');
  for (const [book, info] of [...byBook.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`${book}\t${info.chapters.size}\t${info.hits}`);
  }

  console.log('\nrule\tseverity\thits');
  for (const [ruleId, info] of [...byRule.entries()].sort((a, b) => b[1].hits - a[1].hits || a[0].localeCompare(b[0]))) {
    console.log(`${ruleId}\t${info.severity}\t${info.hits}`);
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  let inputs = opts.inputs;
  if (opts.book) inputs = [path.join(DATA_DIR, opts.book)];
  if (inputs.length === 0) {
    inputs = fs.readdirSync(DATA_DIR)
      .map((entry) => path.join(DATA_DIR, entry))
      .filter((entry) => fs.statSync(entry).isDirectory() && path.basename(entry) !== 'quality');
  }

  const files = chapterFiles(inputs);
  const hits = files.flatMap(scanFile);

  if (opts.json) {
    console.log(JSON.stringify({ count: hits.length, hits }, null, 2));
  } else {
    console.log(`Source artifact candidates: ${hits.length} hit(s) in ${new Set(hits.map((hit) => `${hit.book}/${hit.chapter}`)).size} chapter(s)`);
    if (opts.summary) {
      printSummary(hits);
    } else {
      for (const hit of hits.slice(0, 200)) {
        console.log(`${hit.file}:${hit.sentenceId || hit.path}: ${hit.ruleId} (${hit.severity}) ${hit.excerpt}`);
      }
      if (hits.length > 200) console.log(`... ${hits.length - 200} more hit(s). Use --json or --summary for full output.`);
    }
  }

  if (opts.fail && hits.length > 0) process.exit(1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
