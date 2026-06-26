#!/usr/bin/env node
/**
 * Mark stale source-correspondence queue items as resolved when the current
 * corpus already matches the upstream span after approved graph variants.
 *
 * This does not decide new source disputes and does not edit chapter text. It
 * only handles queue records whose local snapshot is older than the current
 * chapter JSON.
 */

import fs from 'node:fs';
import path from 'node:path';
import { exactVariantKey as sharedExactVariantKey } from './source-variant-utils.mjs';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const SOURCE_FIELDS = ['zh', 'content', 'source', 'text'];
const LEADING_CLOSE_RE = /^[」』”）)\]】〉》]+/u;
const TRAILING_CLOSE_RE = /[」』”）)\]】〉》]+$/u;
const DEFAULT_REVIEWER = 'resolve-current-source-variant-queue';

const COMMON_VARIANTS = new Map([
  ['并', '並'],
  ['竝', '並'],
  ['爲', '為'],
  ['为', '為'],
  ['録', '錄'],
  ['录', '錄'],
  ['歩', '步'],
  ['茍', '苟'],
  ['姧', '奸'],
  ['姦', '奸'],
  ['筭', '算'],
  ['恒', '恆'],
  ['辠', '罪'],
  ['輓', '挽'],
  ['範', '范'],
  ['祕', '秘'],
  ['徴', '徵'],
  ['征', '徵'],
  ['闇', '暗'],
  ['歎', '嘆'],
  ['廕', '蔭'],
  ['籓', '藩'],
  ['棊', '棋'],
  ['于', '於'],
  ['陜', '陝'],
  ['墻', '牆'],
  ['衞', '衛'],
  ['惪', '德'],
  ['衆', '眾'],
  ['僞', '偽'],
  ['呉', '吳'],
  ['説', '說'],
  ['髙', '高'],
  ['内', '內'],
  ['撃', '擊'],
  ['倶', '俱'],
  ['毎', '每'],
]);

function usage() {
  console.error(`Usage:
  node scripts/resolve-current-source-variant-queue.mjs [--apply]
    [--book BOOK] [--chapter CHAPTER] [--queue PATH] [--limit N]
    [--reviewer NAME]

Dry-run by default. With --apply, marks verified stale queue records
as applied/included.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
    queues: [],
    limit: Infinity,
    reviewer: DEFAULT_REVIEWER,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--book') {
      opts.books.add(argv[++i]);
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.books.add(arg.slice('--book='.length));
      continue;
    }
    if (arg === '--chapter') {
      opts.chapters.add(argv[++i]);
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      opts.chapters.add(arg.slice('--chapter='.length));
      continue;
    }
    if (arg === '--queue') {
      opts.queues.push(argv[++i]);
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queues.push(arg.slice('--queue='.length));
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
    if (arg === '--reviewer') {
      opts.reviewer = argv[++i] || DEFAULT_REVIEWER;
      continue;
    }
    if (arg.startsWith('--reviewer=')) {
      opts.reviewer = arg.slice('--reviewer='.length) || DEFAULT_REVIEWER;
      continue;
    }
    console.error(`Unknown option: ${arg}`);
    usage();
    process.exit(2);
  }

  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Infinity;
  return opts;
}

function queueFiles(opts) {
  if (opts.queues.length > 0) return opts.queues;
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => QUEUE_RE.test(entry))
    .map((entry) => path.join(QUALITY_DIR, entry))
    .filter((file) => {
      if (opts.books.size === 0) return true;
      const base = path.basename(file);
      return [...opts.books].some((book) => base.includes(`-${book}.json`) || base.includes(`-${book}-`));
    })
    .sort();
}

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (status === 'applied' || decision === 'applied' || decision === 'included' || decision === 'approved') return 'applied';
  if (status === 'denied' || decision === 'denied' || decision === 'rejected') return 'denied';
  return 'pending';
}

function normalizeWhitespace(text) {
  return String(text || '').replace(/\s+/g, '').trim();
}

function normalizePunctuation(text) {
  return String(text || '')
    .replace(/[﹑、]/g, '，')
    .replace(/[﹔;]/g, '；')
    .replace(/[﹕:]/g, '：')
    .replace(/[﹗!]/g, '！')
    .replace(/[﹖?]/g, '？')
    .replace(/[“”]/g, '「')
    .replace(/[‘’]/g, '」')
    .replace(/[〈《]/g, '《')
    .replace(/[〉》]/g, '》')
    .replace(/[（]/g, '(')
    .replace(/[）]/g, ')');
}

function exactVariantKey(text) {
  return sharedExactVariantKey(text);
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string');
}

function sourceText(entry) {
  return String(entry?.unit?.[entry.field] || '');
}

function flattenUnits(chapter) {
  const units = [];
  for (let blockIndex = 0; blockIndex < (chapter.content || []).length; blockIndex += 1) {
    const block = chapter.content[blockIndex];
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (let unitIndex = 0; unitIndex < collection.length; unitIndex += 1) {
        const unit = collection[unitIndex];
        const field = sourceField(unit);
        if (!field) continue;
        units.push({
          unit,
          field,
          id: unit.id || '',
          blockIndex,
          unitIndex,
        });
      }
    }
  }
  return units;
}

const chapterCache = new Map();

function loadChapter(file) {
  if (!chapterCache.has(file)) {
    const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
    const units = flattenUnits(chapter);
    chapterCache.set(file, {
      units,
      byId: new Map(units.map((entry, index) => [entry.id, { ...entry, index }])),
    });
  }
  return chapterCache.get(file);
}

function itemFile(item) {
  return item.file || path.join('data', item.book, `${item.chapter}.json`);
}

function classifyAlreadyAligned(item) {
  if (statusOf(item) !== 'pending') return null;
  if (item.ruleId) return null;
  const source = item.sourceRange?.text || '';
  const oldLocal = item.localRange?.text || '';
  if (!source || !oldLocal) return null;

  const ids = item.localRange?.ids || [];
  if (ids.length === 0) return null;

  const file = itemFile(item);
  if (!fs.existsSync(file)) return null;
  const current = loadChapter(file);
  const entries = ids.map((id) => current.byId.get(id));
  if (entries.some((entry) => !entry)) return null;

  const currentLocal = entries.map(sourceText).join('');
  const sourceCandidates = [{ mode: 'current-matches-source-span', text: source }];
  const trailingClose = String(item.context?.afterSource || '').match(LEADING_CLOSE_RE)?.[0] || '';
  if (trailingClose && !TRAILING_CLOSE_RE.test(source)) {
    sourceCandidates.push({
      mode: 'current-matches-source-span-plus-following-close',
      text: `${source}${trailingClose}`,
    });
  }

  const currentKey = exactVariantKey(currentLocal);
  const matched = sourceCandidates.find((candidate) => {
    const sourceKey = exactVariantKey(candidate.text);
    return sourceKey && currentKey === sourceKey;
  });
  if (!matched) return null;
  if (exactVariantKey(oldLocal) === exactVariantKey(currentLocal)) return null;

  return {
    file,
    ids,
    mode: matched.mode,
    oldLocal,
    currentLocal,
    source: matched.text,
  };
}

function appendNote(notes, addition) {
  const current = String(notes || '').trim();
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const summary = {
    apply: opts.apply,
    verified: 0,
    touchedQueueFiles: 0,
    byBook: {},
    samples: [],
  };

  for (const queueFile of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let changed = false;
    for (const item of queue.items || []) {
      if (summary.verified >= opts.limit) break;
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      if (opts.chapters.size > 0 && !opts.chapters.has(item.chapter)) continue;
      const repair = classifyAlreadyAligned(item);
      if (!repair) continue;

      summary.verified += 1;
      summary.byBook[item.book] = (summary.byBook[item.book] || 0) + 1;
      if (summary.samples.length < 20) {
        summary.samples.push({
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          mode: repair.mode,
          ids: repair.ids,
        });
      }

      if (!opts.apply) continue;
      item.status = 'applied';
      item.decision = 'included';
      item.reviewedAt = item.reviewedAt || now;
      item.reviewer = item.reviewer || opts.reviewer;
      item.appliedAt = now;
      item.appliedSummary = {
        mode: repair.mode,
        localIds: repair.ids,
      };
      item.notes = appendNote(
        item.notes,
        'Verified current corpus already matches upstream span after approved graph variants/punctuation; marked stale source-correspondence item resolved.',
      );
      changed = true;
    }

    if (opts.apply && changed) {
      queue.updatedAt = now;
      fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      summary.touchedQueueFiles += 1;
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
