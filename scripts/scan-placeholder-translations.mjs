#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const DATA_DIR = 'data';

const PLACEHOLDER_PATTERNS = [
  {
    id: 'commentary-lemma-template',
    severity: 3,
    description: 'Generic commentary lemma template',
    regex: /^Commentary lemma:\s*["“]?(?:cosmological or calendrical explanation\.?|.*Referenced works in the lemma:\s*\.?)$/u,
  },
  {
    id: 'editorial-gloss-template',
    severity: 3,
    description: 'Generic editorial gloss template',
    regex: /^Editorial gloss:\s*["“]?etymology and phonological aside\.?(?: Referenced works in the lemma:\s*\.?)?$/u,
  },
  {
    id: 'subcomment-template',
    severity: 3,
    description: 'Generic subcomment template',
    regex: /^Subcomment:\s*["“]?parallel diction from the Wenxuan tradition\.?$/u,
  },
  {
    id: 'bureaucratic-commentary-template',
    severity: 3,
    description: 'Generic bureaucratic commentary template',
    regex: /^Commentary:\s*["“]?bureaucratic or institutional clarification\.?(?: Referenced works in the lemma:\s*\.?)?$/u,
  },
  {
    id: 'han-school-gloss-template',
    severity: 3,
    description: 'Generic Han-school gloss template',
    regex: /^Gloss:\s*["“]?Han-school citation cluster supporting the main text\.?(?: Referenced works in the lemma:\s*\.?)?$/u,
  },
  {
    id: 'generic-annotation-template',
    severity: 3,
    description: 'Generic annotation description',
    regex: /^The annotation (?:gives|cites|supplies|explains)\b/u,
  },
  {
    id: 'see-chinese-subcommentary-template',
    severity: 3,
    description: 'Placeholder directing reader to Chinese subcommentary',
    regex: /See Chinese subcommentary for full quotation/u,
  },
  {
    id: 'empty-collation-markup',
    severity: 3,
    description: 'Raw empty quote/markup collation placeholder',
    regex: /^(?:Collation|Collation entry|Editorial comment|Note):.*(?:[「『][」』]|［］|\[\]|^$)/u,
  },
  {
    id: 'empty-gloss-template',
    severity: 3,
    description: 'Empty gloss template',
    regex: /^\(Gloss:\s*\)/u,
  },
  {
    id: 'cited-text-template',
    severity: 3,
    description: 'The cited text template',
    regex: /\bthe cited text\b/u,
  },
  {
    id: 'raw-note-label-template',
    severity: 3,
    description: 'Raw Chinese left behind after an English note label',
    regex: /^(?:Textual note|Source note):\s*[\u3400-\u9fff《「『（(*\[]/u,
  },
];

function usage() {
  console.error(`Usage:
  node scripts/scan-placeholder-translations.mjs [--book BOOK] [--out PATH] [--fail] [--summary] [--limit N]
  node scripts/scan-placeholder-translations.mjs data/book/001.json [...]

Options:
  --book BOOK     Scan one data/<book>/ directory.
  --out PATH      Write JSON report.
  --fail          Exit 1 when placeholders are found.
  --summary       Print count summary only.
  --json          Emit the report JSON to stdout.
  --limit N       Print at most N item details; default 20, -1 for all, 0 for none.
  --self-test     Run built-in pattern tests.`);
}

function parseArgs(argv) {
  const opts = {
    book: null,
    out: null,
    fail: false,
    summary: false,
    json: false,
    limit: 20,
    files: [],
    selfTest: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--book') {
      opts.book = argv[++i];
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.book = arg.slice('--book='.length);
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
    if (arg === '--fail') {
      opts.fail = true;
      continue;
    }
    if (arg === '--summary') {
      opts.summary = true;
      continue;
    }
    if (arg === '--json') {
      opts.json = true;
      continue;
    }
    if (arg === '--limit') {
      opts.limit = Number(argv[++i]);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      opts.limit = Number(arg.slice('--limit='.length));
      continue;
    }
    if (arg === '--self-test') {
      opts.selfTest = true;
      continue;
    }
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(2);
    }
    opts.files.push(arg);
  }
  if (opts.book && opts.files.length > 0) {
    console.error('--book cannot be combined with explicit files.');
    process.exit(2);
  }
  if (!Number.isFinite(opts.limit)) opts.limit = 20;
  return opts;
}

function walkJsonFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (fullPath === path.join(DATA_DIR, 'quality')) continue;
      walkJsonFiles(fullPath, files);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }
  return files;
}

function inputFiles(opts) {
  if (opts.files.length > 0) return opts.files;
  if (opts.book) return walkJsonFiles(path.join(DATA_DIR, opts.book)).sort();
  return walkJsonFiles(DATA_DIR).sort();
}

function iterUnits(block) {
  if (!block || typeof block !== 'object') return [];
  if (Array.isArray(block.sentences)) return block.sentences;
  if (Array.isArray(block.cells)) return block.cells;
  return [];
}

function matchPlaceholder(text) {
  const value = String(text || '').trim();
  if (!value) return null;
  return PLACEHOLDER_PATTERNS.find((pattern) => pattern.regex.test(value)) || null;
}

function chapterKeyFromFile(file) {
  const parsed = path.parse(file);
  const book = path.basename(path.dirname(file));
  return {
    book,
    chapter: parsed.name,
    key: `${book}/${parsed.name}`,
  };
}

function createCounts(extra = {}) {
  return {
    ...extra,
    totalItems: 0,
    pendingItems: 0,
    highPendingItems: 0,
    lowPendingItems: 0,
    unknownPendingItems: 0,
    highestPendingSeverity: null,
    bySeverity: {},
  };
}

function incrementCounts(counts, severity) {
  counts.totalItems += 1;
  counts.pendingItems += 1;
  const key = Number.isFinite(severity) ? String(severity) : 'unknown';
  counts.bySeverity[key] = counts.bySeverity[key] || {
    severity: key,
    totalItems: 0,
    pendingItems: 0,
  };
  counts.bySeverity[key].totalItems += 1;
  counts.bySeverity[key].pendingItems += 1;
  if (Number.isFinite(severity)) {
    if (severity >= 3) counts.highPendingItems += 1;
    else if (severity > 0) counts.lowPendingItems += 1;
    counts.highestPendingSeverity = Math.max(counts.highestPendingSeverity || 0, severity);
  } else {
    counts.unknownPendingItems += 1;
  }
}

function scanFile(file) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    return {
      file,
      error: error.message,
      items: [],
    };
  }

  const items = [];
  const { book, chapter } = chapterKeyFromFile(file);
  for (const [blockIndex, block] of (data.content || []).entries()) {
    for (const unit of iterUnits(block)) {
      for (const translation of (unit.translations || [])) {
        for (const field of ['literal', 'idiomatic']) {
          const text = translation[field];
          const pattern = matchPlaceholder(text);
          if (!pattern) continue;
          items.push({
            file,
            book,
            chapter,
            id: unit.id || null,
            blockIndex,
            field,
            severity: pattern.severity,
            pattern: pattern.id,
            description: pattern.description,
            chinese: unit.zh || unit.content || '',
            english: text,
          });
        }
      }
    }
  }
  return { file, items };
}

function buildReport(files) {
  const report = {
    scanner: 'scan-placeholder-translations',
    generatedAt: new Date().toISOString(),
    scannedFiles: 0,
    totalItems: 0,
    pendingItems: 0,
    highPendingItems: 0,
    lowPendingItems: 0,
    unknownPendingItems: 0,
    highestPendingSeverity: null,
    bySeverity: {},
    byPattern: {},
    byChapter: {},
    errors: [],
    items: [],
  };

  for (const file of files) {
    const result = scanFile(file);
    report.scannedFiles += 1;
    if (result.error) {
      report.errors.push({ file, error: result.error });
      continue;
    }
    for (const item of result.items) {
      report.items.push(item);
      report.byPattern[item.pattern] = (report.byPattern[item.pattern] || 0) + 1;
      incrementCounts(report, item.severity);

      const key = `${item.book}/${item.chapter}`;
      report.byChapter[key] = report.byChapter[key] || createCounts({
        book: item.book,
        chapter: item.chapter,
      });
      incrementCounts(report.byChapter[key], item.severity);
    }
  }

  return {
    ...report,
    count: report.totalItems,
    totalHits: report.totalItems,
  };
}

function runSelfTest() {
  const shouldMatch = [
    'Commentary lemma: cosmological or calendrical explanation.',
    'Editorial gloss: etymology and phonological aside.',
    'Subcomment: parallel diction from the Wenxuan tradition.',
    'Commentary: bureaucratic or institutional clarification.',
    'Gloss: Han-school citation cluster supporting the main text.',
    'The annotation gives a lexical gloss for a word in the preceding passage.',
    '(Gloss: ) (See Chinese subcommentary for full quotation.)',
    'Collation: 「」「」。',
    'Mao OdesSubcommentary on the Meaning, 5 scrolls, composed by the cited text.',
    'Textual note: 按：「慌」《文選》作「荒」。',
    'Source note: 楚辭曰「折瓊枝以繼佩」也。',
    'Gloss: "Han-school citation cluster supporting the main text.',
    'Commentary: "bureaucratic or institutional clarification.',
  ];
  const shouldNotMatch = [
    'Emperor Wu of Liang, Subcommentary, 18 scrolls',
    'Editorial gloss: read da, “great,” immediately before the following phrase “general.”',
    'Note: the Palace edition writes "於."',
    'Page 1914, line 11: at "志團團以應懸兮," the Wenxuan writes "團團" as "摶摶."',
    'Textual note: the Palace edition writes "於."',
  ];
  for (const text of shouldMatch) {
    if (!matchPlaceholder(text)) {
      throw new Error(`Expected placeholder match: ${text}`);
    }
  }
  for (const text of shouldNotMatch) {
    if (matchPlaceholder(text)) {
      throw new Error(`Unexpected placeholder match: ${text}`);
    }
  }
  console.log('Placeholder translation self-test OK.');
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.selfTest) {
    runSelfTest();
    return;
  }

  const files = inputFiles(opts);
  const report = buildReport(files);
  if (opts.out) {
    fs.mkdirSync(path.dirname(opts.out), { recursive: true });
    fs.writeFileSync(opts.out, `${JSON.stringify(report, null, 2)}\n`);
  }

  if (opts.json) {
    console.log(JSON.stringify(report, null, 2));
    if (opts.fail && report.totalItems > 0) {
      process.exit(1);
    }
    return;
  }

  console.log(`Found ${report.totalItems} placeholder translation problem(s).`);
  if (opts.out) console.log(`Report written to ${opts.out}.`);
  if (!opts.summary && opts.limit !== 0) {
    const limit = opts.limit < 0 ? report.items.length : opts.limit;
    for (const item of report.items.slice(0, limit)) {
      console.log(`\n${item.file} ${item.id || '(no id)'} ${item.field}`);
      console.log(`  ${item.description}`);
      console.log(`  zh: ${item.chinese}`);
      console.log(`  en: ${item.english}`);
    }
    if (report.items.length > limit) {
      console.log(`\nShowing ${limit} of ${report.items.length}. Use --limit=-1 for all details.`);
    }
  }
  if (opts.fail && report.totalItems > 0) {
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
