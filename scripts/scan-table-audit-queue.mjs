#!/usr/bin/env node
/**
 * Build a chapter-level audit queue for all chapters that contain table data.
 *
 * The queue is intentionally chapter-granular: table scraping/rendering issues
 * usually need a human to compare the whole chapter against the upstream page.
 * Regeneration preserves review state for stable chapter ids.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const DEFAULT_OUT = path.join(QUALITY_DIR, 'table-audit-queue.json');
const MANIFEST_PATH = path.join(DATA_DIR, 'manifest.json');

const CHRONOLOGICAL_ORDER = [
  'shiji', 'hanshu', 'houhanshu', 'sanguozhi', 'jinshu', 'songshu',
  'nanqishu', 'liangshu', 'chenshu', 'weishu', 'beiqishu', 'zhoushu',
  'suishu', 'nanshi', 'beishi', 'jiutangshu', 'xintangshu',
  'jiuwudaishi', 'xinwudaishi', 'songshi', 'liaoshi', 'jinshi',
  'yuanshi', 'mingshi', 'zizhitongjian', 'qingshigao',
];

const PRESERVED_FIELDS = [
  'status',
  'decision',
  'notes',
  'reviewedAt',
  'reviewer',
  'repairedAt',
  'repairedBy',
  'repairNotes',
];

function usage() {
  console.error(`Usage:
  node scripts/scan-table-audit-queue.mjs [--out PATH] [--book BOOK] [--summary]
  node scripts/scan-table-audit-queue.mjs --mark BOOK/CHAPTER --status STATUS [--notes TEXT] [--reviewer NAME]

Statuses are free-form, but expected values are:
  pending, checked, needs-repair, repaired, no-action`);
}

function parseArgs(argv) {
  const opts = {
    out: DEFAULT_OUT,
    book: null,
    summary: false,
    mark: null,
    status: null,
    notes: null,
    reviewer: 'scan-table-audit-queue',
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--summary') {
      opts.summary = true;
      continue;
    }
    if (arg === '--out') {
      opts.out = argv[++i] || opts.out;
      continue;
    }
    if (arg.startsWith('--out=')) {
      opts.out = arg.slice('--out='.length) || opts.out;
      continue;
    }
    if (arg === '--book') {
      opts.book = argv[++i] || null;
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.book = arg.slice('--book='.length) || null;
      continue;
    }
    if (arg === '--mark') {
      opts.mark = argv[++i] || null;
      continue;
    }
    if (arg.startsWith('--mark=')) {
      opts.mark = arg.slice('--mark='.length) || null;
      continue;
    }
    if (arg === '--status') {
      opts.status = argv[++i] || null;
      continue;
    }
    if (arg.startsWith('--status=')) {
      opts.status = arg.slice('--status='.length) || null;
      continue;
    }
    if (arg === '--notes') {
      opts.notes = argv[++i] || '';
      continue;
    }
    if (arg.startsWith('--notes=')) {
      opts.notes = arg.slice('--notes='.length);
      continue;
    }
    if (arg === '--reviewer') {
      opts.reviewer = argv[++i] || opts.reviewer;
      continue;
    }
    if (arg.startsWith('--reviewer=')) {
      opts.reviewer = arg.slice('--reviewer='.length) || opts.reviewer;
      continue;
    }
    console.error(`Unknown option: ${arg}`);
    usage();
    process.exit(2);
  }

  return opts;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function sourceQueuePath(book) {
  return path.join(QUALITY_DIR, `source-correspondence-corpus-wikisource-${book}.json`);
}

const sourceQueueCache = new Map();

function wikisourceUrlFromQueue(book, chapter) {
  const file = sourceQueuePath(book);
  if (!fs.existsSync(file)) return null;
  if (!sourceQueueCache.has(file)) {
    try {
      sourceQueueCache.set(file, readJson(file));
    } catch {
      sourceQueueCache.set(file, null);
    }
  }
  const queue = sourceQueueCache.get(file);
  const item = (queue?.items || []).find((entry) =>
    entry?.book === book
    && entry?.chapter === chapter
    && typeof entry?.sourceUrl === 'string'
    && entry.sourceUrl.includes('wikisource.org')
  );
  return item?.sourceUrl || null;
}

function fallbackWikisourceRawUrl(book, chapter) {
  const titles = {
    shiji: '史記',
    hanshu: '漢書',
    houhanshu: '後漢書',
    sanguozhi: '三國志',
    jinshu: '晉書',
    songshu: '宋書',
    nanqishu: '南齊書',
    liangshu: '梁書',
    chenshu: '陳書',
    weishu: '魏書',
    beiqishu: '北齊書',
    zhoushu: '周書',
    suishu: '隋書',
    nanshi: '南史',
    beishi: '北史',
    jiutangshu: '舊唐書',
    xintangshu: '新唐書',
    jiuwudaishi: '舊五代史',
    xinwudaishi: '新五代史',
    songshi: '宋史',
    liaoshi: '遼史',
    jinshi: '金史',
    yuanshi: '元史',
    mingshi: '明史',
    qingshigao: '清史稿',
  };
  const title = titles[book];
  if (!title) return null;
  const number = String(Number(chapter));
  if (!Number.isFinite(Number(chapter))) return null;
  return `https://zh.wikisource.org/wiki/${encodeURIComponent(title)}/${encodeURIComponent(`卷${number}`)}?action=raw`;
}

function upstreamCandidates(data, book, chapter) {
  const candidates = [];
  const add = (kind, url, note) => {
    if (!url || candidates.some((candidate) => candidate.url === url)) return;
    candidates.push({ kind, url, note });
  };
  add('ctext', data.meta?.ctextUrl, 'Preferred when available; ctext preserves table presentation better than Chinese Notes.');
  if (String(data.meta?.url || '').includes('ctext.org')) {
    add('ctext', data.meta.url, 'Preferred when available; ctext preserves table presentation better than Chinese Notes.');
  }
  add('wikisource-raw', wikisourceUrlFromQueue(book, chapter), 'Preferred raw witness for non-ctext table structure.');
  if (String(data.meta?.url || '').includes('wikisource.org')) {
    add('wikisource-raw', data.meta.url, 'Raw table markup witness.');
  }
  if (!candidates.some((candidate) => candidate.kind === 'wikisource-raw')) {
    add('wikisource-raw', fallbackWikisourceRawUrl(book, chapter), 'Fallback raw witness pattern; verify before relying on it.');
  }
  if (String(data.meta?.url || '').includes('chinesenotes.com')) {
    add('chinesenotes-text', data.meta.url, 'Text witness only; do not use Chinese Notes as table-layout authority.');
  }
  return candidates;
}

function loadExisting(file) {
  if (!fs.existsSync(file)) return null;
  return readJson(file);
}

function chapterSort(a, b) {
  return String(a).localeCompare(String(b), 'en', { numeric: true });
}

function bookIds(bookFilter) {
  if (bookFilter) return [bookFilter];
  if (fs.existsSync(MANIFEST_PATH)) {
    const manifest = readJson(MANIFEST_PATH);
    const available = new Set(Object.keys(manifest.books || {}));
    const ordered = CHRONOLOGICAL_ORDER.filter((book) => available.has(book));
    for (const book of available) {
      if (!ordered.includes(book)) ordered.push(book);
    }
    return ordered;
  }
  return fs.readdirSync(DATA_DIR)
    .filter((entry) => fs.statSync(path.join(DATA_DIR, entry)).isDirectory())
    .filter((entry) => entry !== 'quality')
    .sort();
}

function chapterFiles(book) {
  const dir = path.join(DATA_DIR, book);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((entry) => /^\d+\.json$/u.test(entry))
    .sort(chapterSort)
    .map((entry) => path.join(dir, entry));
}

function unitText(unit) {
  return String(unit?.zh ?? unit?.content ?? '').trim();
}

function unitTranslation(unit) {
  const direct = unit?.idiomatic || unit?.translations?.[0]?.idiomatic || '';
  return String(direct || '').trim();
}

function shortText(text, limit = 80) {
  const compact = String(text || '').replace(/\s+/gu, '');
  if (compact.length <= limit) return compact;
  return `${compact.slice(0, limit - 1)}...`;
}

function tableUnits(block) {
  if (block?.type === 'table_header') return block.sentences || [];
  if (block?.type === 'table_row') return block.cells || [];
  return [];
}

function tableWidth(block) {
  return tableUnits(block).length;
}

function isTableBlock(block) {
  return block?.type === 'table_header' || block?.type === 'table_row';
}

function blockExcerpt(block) {
  const units = block?.sentences || block?.cells || [];
  return shortText(units.map(unitText).filter(Boolean).join(''));
}

function collectTableRuns(content) {
  const runs = [];
  let current = null;
  content.forEach((block, index) => {
    if (isTableBlock(block)) {
      if (!current) {
        current = {
          startBlockIndex: index,
          endBlockIndex: index,
          headers: 0,
          rows: 0,
          rowWidthCounts: {},
          firstExcerpt: '',
          lastExcerpt: '',
        };
        runs.push(current);
      }
      current.endBlockIndex = index;
      if (block.type === 'table_header') current.headers += 1;
      if (block.type === 'table_row') current.rows += 1;
      const width = tableWidth(block);
      current.rowWidthCounts[width] = (current.rowWidthCounts[width] || 0) + 1;
      const excerpt = blockExcerpt(block);
      if (excerpt && !current.firstExcerpt) current.firstExcerpt = excerpt;
      if (excerpt) current.lastExcerpt = excerpt;
      return;
    }
    current = null;
  });
  return runs;
}

function collectInterruptions(content, runs) {
  const interruptions = [];
  content.forEach((block, index) => {
    if (isTableBlock(block)) return;
    const prev = content[index - 1];
    const next = content[index + 1];
    if (!isTableBlock(prev) || !isTableBlock(next)) return;
    interruptions.push({
      blockIndex: index,
      type: block?.type || 'unknown',
      sentenceCount: Array.isArray(block?.sentences) ? block.sentences.length : 0,
      excerpt: blockExcerpt(block),
    });
  });

  for (let i = 0; i < runs.length - 1; i += 1) {
    const current = runs[i];
    const next = runs[i + 1];
    const between = content
      .slice(current.endBlockIndex + 1, next.startBlockIndex)
      .map((block, offset) => ({
        blockIndex: current.endBlockIndex + 1 + offset,
        type: block?.type || 'unknown',
        sentenceCount: Array.isArray(block?.sentences) ? block.sentences.length : 0,
        excerpt: blockExcerpt(block),
      }))
      .filter((entry) => entry.excerpt);
    if (between.length <= 1) continue;
    interruptions.push({
      blockIndex: between[0].blockIndex,
      type: 'table_run_gap',
      sentenceCount: between.reduce((sum, entry) => sum + entry.sentenceCount, 0),
      excerpt: between.map((entry) => entry.excerpt).join(' | '),
      blocks: between,
    });
  }

  return interruptions;
}

function collectStats(chapter) {
  const content = chapter.content || [];
  const tableBlocks = content.filter(isTableBlock);
  const tableRows = content.filter((block) => block.type === 'table_row');
  const tableHeaders = content.filter((block) => block.type === 'table_header');
  if (tableBlocks.length === 0) return null;

  let cells = 0;
  let translatedCells = 0;
  let emptyCells = 0;
  const rowWidthCounts = {};
  for (const block of tableBlocks) {
    const units = tableUnits(block);
    rowWidthCounts[units.length] = (rowWidthCounts[units.length] || 0) + 1;
    for (const unit of units) {
      cells += 1;
      if (!unitText(unit)) emptyCells += 1;
      if (unitTranslation(unit)) translatedCells += 1;
    }
  }

  const runs = collectTableRuns(content);
  const interruptions = collectInterruptions(content, runs);
  const first = tableBlocks[0];
  const last = tableBlocks[tableBlocks.length - 1];

  return {
    tableBlockCount: tableBlocks.length,
    tableHeaderBlocks: tableHeaders.length,
    tableRowBlocks: tableRows.length,
    renderedTableRunCount: runs.length,
    cellCount: cells,
    translatedCellCount: translatedCells,
    emptyCellCount: emptyCells,
    rowWidthCounts,
    firstTableBlockIndex: content.indexOf(first),
    lastTableBlockIndex: content.lastIndexOf(last),
    interruptions,
    runs,
  };
}

function severityFor(stats) {
  if ((stats?.interruptions || []).length > 0) return 3;
  if ((stats?.renderedTableRunCount || 0) > 1) return 2;
  return 1;
}

function recommendationFor(stats) {
  if ((stats?.interruptions || []).length > 0) {
    return 'Compare against upstream: table runs have intervening non-table blocks. Confirm whether these are true prose breaks or table-internal rows misclassified by scraping.';
  }
  if ((stats?.renderedTableRunCount || 0) > 1) {
    return 'Compare against upstream: chapter has multiple table runs; confirm they are truly separate tables.';
  }
  return 'Compare against upstream and confirm table structure, row boundaries, and translations.';
}

function statusState(item) {
  const status = String(item?.status || '').toLowerCase();
  const decision = String(item?.decision || '').toLowerCase();
  if (['checked', 'repaired', 'no-action', 'approved', 'rejected'].includes(status)) return 'completed';
  if (['checked', 'repaired', 'no-action', 'approved', 'rejected'].includes(decision)) return 'completed';
  return 'pending';
}

function buildQueue(opts, existing) {
  const previous = new Map((existing?.items || []).map((item) => [item.id, item]));
  const items = [];
  for (const book of bookIds(opts.book)) {
    for (const file of chapterFiles(book)) {
      const chapter = path.basename(file, '.json');
      const data = readJson(file);
      const stats = collectStats(data);
      if (!stats) continue;
      const id = `table-audit-${book}-${chapter}`;
      const prev = previous.get(id) || {};
      const item = {
        id,
        status: 'pending',
        type: 'table_chapter_audit',
        severity: severityFor(stats),
        book,
        chapter,
        file: path.relative(process.cwd(), file),
        title: data.meta?.title || data.title || null,
        upstreamCandidates: upstreamCandidates(data, book, chapter),
        tableStats: stats,
        recommendation: recommendationFor(stats),
      };
      for (const field of PRESERVED_FIELDS) {
        if (prev[field] !== undefined) item[field] = prev[field];
      }
      if (Object.keys(prev).length > 0) item.retainedAfterRescan = true;
      items.push(item);
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    scanner: 'scan-table-audit-queue',
    description: 'Chapter-level queue for manually checking/repaired table structure against upstream sources.',
    summary: summarize(items),
    items,
  };
}

function summarize(items) {
  const summary = {
    totalItems: items.length,
    pendingItems: 0,
    completedItems: 0,
    auditedItems: 0,
    unauditedItems: 0,
    needsRepairItems: 0,
    byStatus: {},
    bySeverity: {},
    byBook: {},
  };
  for (const item of items) {
    const status = String(item.status || item.decision || 'pending');
    summary.byStatus[status] = (summary.byStatus[status] || 0) + 1;
    const severity = String(item.severity || 'unknown');
    summary.bySeverity[severity] = (summary.bySeverity[severity] || 0) + 1;
    summary.byBook[item.book] = summary.byBook[item.book] || {
      totalItems: 0,
      pendingItems: 0,
      completedItems: 0,
      auditedItems: 0,
      unauditedItems: 0,
      needsRepairItems: 0,
    };
    summary.byBook[item.book].totalItems += 1;
    if (status === 'pending') {
      summary.unauditedItems += 1;
      summary.byBook[item.book].unauditedItems += 1;
    } else {
      summary.auditedItems += 1;
      summary.byBook[item.book].auditedItems += 1;
    }
    if (status === 'needs-repair') {
      summary.needsRepairItems += 1;
      summary.byBook[item.book].needsRepairItems += 1;
    }
    if (statusState(item) === 'completed') {
      summary.completedItems += 1;
      summary.byBook[item.book].completedItems += 1;
    } else {
      summary.pendingItems += 1;
      summary.byBook[item.book].pendingItems += 1;
    }
  }
  summary.percentComplete = summary.totalItems > 0
    ? (summary.completedItems / summary.totalItems) * 100
    : 0;
  summary.percentAudited = summary.totalItems > 0
    ? (summary.auditedItems / summary.totalItems) * 100
    : 0;
  return summary;
}

function mergeBookSubset(existing, next, book) {
  if (!existing || !book) return next;
  const retained = (existing.items || []).filter((item) => item.book !== book);
  const items = [...retained, ...next.items].sort((a, b) => {
    const bookDelta = bookIds(null).indexOf(a.book) - bookIds(null).indexOf(b.book);
    if (bookDelta !== 0) return bookDelta;
    return chapterSort(a.chapter, b.chapter);
  });
  return {
    ...next,
    items,
    summary: summarize(items),
  };
}

function markItem(opts) {
  if (!opts.mark || !opts.status) {
    console.error('--mark requires --status.');
    process.exit(2);
  }
  const queue = loadExisting(opts.out);
  if (!queue) {
    console.error(`Queue not found: ${opts.out}`);
    process.exit(1);
  }
  const [book, chapter] = opts.mark.split('/');
  const id = `table-audit-${book}-${chapter}`;
  const item = (queue.items || []).find((entry) => entry.id === id);
  if (!item) {
    console.error(`Queue item not found: ${id}`);
    process.exit(1);
  }
  item.status = opts.status;
  item.reviewedAt = new Date().toISOString();
  item.reviewer = opts.reviewer;
  if (opts.notes !== null) item.notes = opts.notes;
  queue.updatedAt = item.reviewedAt;
  queue.summary = summarize(queue.items || []);
  fs.writeFileSync(opts.out, `${JSON.stringify(queue, null, 2)}\n`);
  console.log(`Marked ${id} as ${opts.status}.`);
}

function printSummary(queue) {
  const summary = queue.summary || summarize(queue.items || []);
  console.log(`Table audit queue: ${summary.totalItems} chapter(s), ${summary.unauditedItems} unaudited, ${summary.needsRepairItems} need repair, ${summary.completedItems} clean/closed (${summary.percentAudited.toFixed(1)}% audited).`);
  for (const [severity, count] of Object.entries(summary.bySeverity || {}).sort()) {
    console.log(`  severity ${severity}: ${count}`);
  }
  const gapCandidates = (queue.items || []).filter((item) => (item.tableStats?.interruptions || []).length > 0);
  if (gapCandidates.length > 0) {
    console.log(`  table-run gap candidates requiring upstream check: ${gapCandidates.length}`);
    for (const item of gapCandidates.slice(0, 10)) {
      console.log(`    ${item.book}/${item.chapter}: ${item.tableStats.interruptions.map((hit) => hit.excerpt).join(' | ')}`);
    }
    if (gapCandidates.length > 10) console.log(`    ... ${gapCandidates.length - 10} more`);
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.mark) {
    markItem(opts);
    return;
  }

  const existing = loadExisting(opts.out);
  const generated = buildQueue(opts, existing);
  const queue = mergeBookSubset(existing, generated, opts.book);
  fs.mkdirSync(path.dirname(opts.out), { recursive: true });
  fs.writeFileSync(opts.out, `${JSON.stringify(queue, null, 2)}\n`);
  if (opts.summary) printSummary(queue);
}

main();
