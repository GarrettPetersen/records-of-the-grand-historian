#!/usr/bin/env node
/**
 * Scan Chinese source fields for scrape artifacts that can leak into generated
 * pages and e-books. These are source-side checks, separate from translation
 * artifact scans.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
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
    id: 'SOURCE_LEADING_ATTACHED_PUNCTUATION',
    severity: 3,
    description: 'Sentence-leading punctuation should be attached to the previous Chinese source sentence',
    pattern: /^[，、。；：！？」』”）)\]】〉》]+/gu,
  },
  {
    id: 'SOURCE_PLACEHOLDER_SYMBOL',
    severity: 3,
    description: 'Placeholder or replacement glyph leaked into Chinese source',
    pattern: /[∴�￼]/gu,
  },
  {
    id: 'SOURCE_CTEXT_INLINE_MARKUP',
    severity: 3,
    description: 'CText inline normalization markup leaked into Chinese source',
    pattern: /-\{[^}]+\}-/gu,
  },
  {
    id: 'SOURCE_KANA_PLACEHOLDER',
    severity: 3,
    description: 'Kana placeholder leaked into Chinese source',
    pattern: /[ぁ-ゟ゠-ヿ]/gu,
  },
  {
    id: 'SOURCE_PRIVATE_USE_GLYPH',
    severity: 3,
    description: 'Private-use glyph leaked into Chinese source',
    pattern: /[\uE000-\uF8FF]/gu,
  },
  {
    id: 'SOURCE_BROKEN_HTML_TAG',
    severity: 3,
    description: 'Broken HTML tag fragment leaked into Chinese source',
    pattern: /(?:\/[a-z][a-z0-9]*>|\bbr>)/giu,
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
  node scripts/scan-source-artifacts.mjs [--book BOOK] [--json] [--summary] [--fail] [--out PATH] [path ...]

Scans source-side Chinese/text fields for scrape artifacts such as sentence-leading
attached punctuation, replacement glyphs, raw table span attributes, and raw HTML tags.`);
}

function parseArgs(argv) {
  const opts = { inputs: [], book: null, json: false, summary: false, fail: false, out: null };
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
    if (arg === '--out') {
      opts.out = argv[++i];
      continue;
    }
    if (arg.startsWith('--out=')) {
      opts.out = arg.slice('--out='.length);
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

function stableHitId(hit) {
  const input = [
    hit.book,
    hit.chapter,
    hit.ruleId,
    hit.path,
    hit.sentenceId || '',
    hit.found || '',
    hit.index,
    hit.excerpt || '',
  ].join('\u241f');
  const hash = crypto.createHash('sha1').update(input).digest('hex').slice(0, 12);
  return `source-artifact-${hit.book}-${hit.chapter}-${hit.ruleId.toLowerCase()}-${hash}`;
}

function scanFile(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  return [...walk(data)].map((hit) => {
    const item = {
      file,
      book: bookIdFor(file),
      chapter: chapterIdFor(file),
      ...hit,
      status: 'pending',
      decision: null,
      notes: '',
    };
    item.id = stableHitId(item);
    return item;
  });
}

function isResolvedQueueItem(item) {
  const status = String(item?.status || '').toLowerCase();
  const decision = String(item?.decision || '').toLowerCase();
  const values = new Set([status, decision].filter(Boolean));
  return Boolean(
    item?.appliedAt ||
    item?.appliedSummary ||
    values.has('applied') ||
    values.has('included') ||
    values.has('denied') ||
    values.has('rejected') ||
    values.has('declined') ||
    values.has('false-positive') ||
    values.has('false_positive')
  );
}

function mergeExistingDecisions(report, outPath) {
  if (!outPath || !fs.existsSync(outPath)) return report;
  let previous;
  try {
    previous = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  } catch {
    return report;
  }
  const priorItems = new Map(
    [...(previous.hits || []), ...(previous.resolvedHits || [])]
      .filter((item) => item.id)
      .map((item) => [item.id, item])
  );
  const currentIds = new Set(report.hits.map((item) => item.id));
  for (const item of report.hits) {
    const prior = priorItems.get(item.id);
    if (!prior) continue;
    item.status = prior.status || item.status;
    item.decision = prior.decision ?? item.decision;
    item.notes = prior.notes || item.notes;
    item.reviewedAt = prior.reviewedAt;
    item.reviewer = prior.reviewer;
    item.appliedAt = prior.appliedAt;
    item.appliedSummary = prior.appliedSummary;
  }
  const resolvedHits = [];
  for (const prior of priorItems.values()) {
    if (currentIds.has(prior.id) || !isResolvedQueueItem(prior)) continue;
    resolvedHits.push({
      ...prior,
      present: false,
      resolved: true,
    });
  }
  if (resolvedHits.length > 0) {
    report.resolvedCount = resolvedHits.length;
    report.resolvedHits = resolvedHits.sort((a, b) => (
      (a.book || '').localeCompare(b.book || '') ||
      (a.chapter || '').localeCompare(b.chapter || '') ||
      (a.path || '').localeCompare(b.path || '') ||
      (a.id || '').localeCompare(b.id || '')
    ));
  }
  report.currentCount = report.hits.length;
  report.totalQueueItems = report.hits.length + resolvedHits.length;
  return report;
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
  const report = mergeExistingDecisions({
    generatedAt: new Date().toISOString(),
    scanner: 'scan-source-artifacts',
    count: hits.length,
    currentCount: hits.length,
    resolvedCount: 0,
    totalQueueItems: hits.length,
    hits,
  }, opts.out);

  if (opts.out) {
    fs.mkdirSync(path.dirname(opts.out), { recursive: true });
    fs.writeFileSync(opts.out, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  }

  if (opts.json) {
    console.log(JSON.stringify(report, null, 2));
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
    if (opts.out) console.log(`\nWrote ${opts.out}`);
  }

  if (opts.fail && hits.length > 0) process.exit(1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
