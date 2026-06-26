#!/usr/bin/env node
/**
 * Remove inline edition-correction markup from local source units when the
 * cleaned local text matches the upstream source for a queued discrepancy.
 *
 * Examples handled:
 *   （舊）［新］ -> 新
 *   (舊)[新] -> 新
 *   ［補］ -> 補
 *   〈(151 BCE)〉 -> removed
 *
 * Dry-run by default. This is deliberately queue-driven: it edits only units
 * whose queued source/local span reconciles after the cleanup.
 */

import fs from 'node:fs';
import path from 'node:path';
import { exactVariantKey } from './source-variant-utils.mjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const SOURCE_FIELDS = ['zh', 'source', 'content', 'text'];
const DEFAULT_REVIEWER = 'resolve-local-edition-correction-markup';

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
    queues: [],
    limit: Number.POSITIVE_INFINITY,
    reviewer: DEFAULT_REVIEWER,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      console.error(`Usage: node scripts/resolve-local-edition-correction-markup.mjs [--apply] [--book BOOK] [--chapter CHAPTER] [--limit N] [--queue PATH] [--reviewer NAME]`);
      process.exit(0);
    }
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--book') {
      opts.books.add(String(argv[++i] || '').trim());
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.books.add(arg.slice('--book='.length).trim());
      continue;
    }
    if (arg === '--chapter') {
      opts.chapters.add(String(argv[++i] || '').padStart(3, '0'));
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      opts.chapters.add(arg.slice('--chapter='.length).padStart(3, '0'));
      continue;
    }
    if (arg === '--queue') {
      opts.queues.push(argv[++i] || '');
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
    throw new Error(`Unknown option: ${arg}`);
  }

  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Number.POSITIVE_INFINITY;
  return opts;
}

function queueFiles(opts) {
  if (opts.queues.length > 0) return opts.queues.map((queue) => path.resolve(queue));
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

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string') || null;
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
          collectionName,
          unitIndex,
        });
      }
    }
  }
  return units;
}

const chapterCache = new Map();

function chapterPath(item) {
  return item.file || path.join(DATA_DIR, item.book, `${String(item.chapter).padStart(3, '0')}.json`);
}

function loadChapter(file) {
  const abs = path.resolve(file);
  if (!chapterCache.has(abs)) {
    const chapter = JSON.parse(fs.readFileSync(abs, 'utf8'));
    const units = flattenUnits(chapter);
    chapterCache.set(abs, {
      file: abs,
      chapter,
      units,
      byId: new Map(units.map((entry) => [entry.id, entry])),
      changed: false,
    });
  }
  return chapterCache.get(abs);
}

function hasCorrectionMarkup(text) {
  return /[（(][^（）()[\]［］]{1,16}[）)][［\[][^［］[\]]{1,16}[］\]]|[［\[][^［］[\]]{1,16}[］\]]|〈\([^〉]{1,40}\)〉/u.test(String(text || ''));
}

function cleanCorrectionMarkup(text) {
  return String(text || '')
    .replace(/[（(][^（）()[\]［］]{1,16}[）)][［\[]([^［］[\]]{1,16})[］\]]/gu, '$1')
    .replace(/[［\[]([^［］[\]]{1,16})[］\]]/gu, '$1')
    .replace(/\s*〈\([^〉]{1,40}\)〉/gu, '');
}

function key(text) {
  return exactVariantKey(text).replace(/[^\p{Script=Han}0-9]/gu, '');
}

function equivalentAfterCleaning(source, local) {
  if (!source || !local || !hasCorrectionMarkup(local)) return false;
  const sourceKey = key(source);
  const cleanLocalKey = key(cleanCorrectionMarkup(local));
  return Boolean(sourceKey && cleanLocalKey && sourceKey === cleanLocalKey);
}

function appendNote(existing, note) {
  const value = String(existing || '').trim();
  if (!value) return note;
  if (value.includes(note)) return value;
  return `${value}\n${note}`;
}

function cleanChapterUnits(item, opts) {
  const ids = item.localRange?.ids || [];
  if (ids.length === 0) return { changed: 0, ids: [] };
  const file = chapterPath(item);
  if (!fs.existsSync(file)) return { changed: 0, ids: [] };
  const chapter = loadChapter(file);
  const cleanedIds = [];
  let changed = 0;

  for (const id of ids) {
    const entry = chapter.byId.get(id);
    if (!entry) continue;
    const before = String(entry.unit[entry.field] || '');
    const after = cleanCorrectionMarkup(before);
    if (before === after) continue;
    cleanedIds.push(id);
    changed += 1;
    if (opts.apply) {
      entry.unit[entry.field] = after;
      chapter.changed = true;
    }
  }

  return { changed, ids: cleanedIds };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const stats = {
    apply: opts.apply,
    resolved: 0,
    sourceUnitsCleaned: 0,
    touchedQueueFiles: 0,
    touchedChapterFiles: 0,
    byBook: {},
    byChapter: {},
    samples: [],
  };

  for (const queueFile of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let changedQueue = false;

    for (const item of queue.items || []) {
      if (stats.resolved >= opts.limit) break;
      if (statusOf(item) !== 'pending') continue;
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      const chapter = String(item.chapter || '').padStart(3, '0');
      if (opts.chapters.size > 0 && !opts.chapters.has(chapter)) continue;

      const source = item.sourceRange?.text || '';
      const local = item.localRange?.text || '';
      if (!equivalentAfterCleaning(source, local)) continue;

      const cleaned = cleanChapterUnits(item, opts);
      stats.resolved += 1;
      stats.sourceUnitsCleaned += cleaned.changed;
      stats.byBook[item.book] = (stats.byBook[item.book] || 0) + 1;
      const chapterKey = `${item.book}/${chapter}`;
      stats.byChapter[chapterKey] = (stats.byChapter[chapterKey] || 0) + 1;
      if (stats.samples.length < 25) {
        stats.samples.push({
          id: item.id,
          book: item.book,
          chapter,
          localIds: item.localRange?.ids || [],
          cleanedIds: cleaned.ids,
          source,
          local,
          cleanedLocal: cleanCorrectionMarkup(local),
        });
      }

      if (!opts.apply) continue;
      item.status = 'applied';
      item.decision = 'included';
      item.reviewedAt = now;
      item.reviewedBy = opts.reviewer;
      item.appliedAt = now;
      item.appliedSummary = {
        mode: 'local-edition-correction-markup-removal',
        cleanedIds: cleaned.ids,
      };
      item.notes = appendNote(
        item.notes,
        'Removed inline edition-correction markup from local source; cleaned local text matches upstream source for this queued difference.',
      );
      changedQueue = true;
    }

    if (opts.apply && changedQueue) {
      queue.updatedAt = now;
      fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      stats.touchedQueueFiles += 1;
    }
  }

  for (const entry of chapterCache.values()) {
    if (!opts.apply || !entry.changed) continue;
    fs.writeFileSync(entry.file, `${JSON.stringify(entry.chapter, null, 2)}\n`, 'utf8');
    stats.touchedChapterFiles += 1;
  }

  console.log(JSON.stringify(stats, null, 2));
}

main();
