#!/usr/bin/env node
/**
 * Remove inline numeric note markers from Chinese source fields and close the
 * corresponding source-correspondence queue items.
 *
 * This intentionally handles only digits-only bracket markers such as [12],
 * angle-bracket Chinese-number markers such as <一二>, <五>, or <1>,
 * plus obvious page-range residue such as 732-741頁, and only when the cleaned
 * local span matches the upstream witness by Han/digit content.
 */

import fs from 'node:fs';
import path from 'node:path';
import { exactVariantKey } from './source-variant-utils.mjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const SOURCE_FIELDS = ['zh', 'source', 'content', 'text'];
const DEFAULT_REVIEWER = 'resolve-inline-numeric-note-markers';
const NUMERAL_WORDS = [
  'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight',
  'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
  'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty',
].join('|');
const CHINESE_NOTE_NUMBER = '[一二三四五六七八九十百千萬万零〇○0-9]{1,8}';
const NUMERIC_NOTE_MARKER_RE = new RegExp(
  String.raw`\[(?:\d{1,4}|${CHINESE_NOTE_NUMBER})\]|<${CHINESE_NOTE_NUMBER}>`,
  'gu',
);
const TRANSLATION_NOTE_MARKER_RE = new RegExp(
  String.raw`(?:<\s*(?:Note\s*)?(?:\d{1,4}|(?:${NUMERAL_WORDS})(?:\s+(?:${NUMERAL_WORDS})){0,3})\s*>|\[\s*(?:Note\s*)?(?:\d{1,4}|(?:${NUMERAL_WORDS})(?:\s+(?:${NUMERAL_WORDS})){0,3})\s*\])`,
  'giu',
);
const PAGE_RANGE_RE = /\d{1,4}-\d{1,4}頁/gu;
const NOTE_MARKER_EXTRA_VARIANT_GROUPS = [
  '里裏裡',
  '盌碗',
  '倣仿',
];
const NOTE_MARKER_EXTRA_VARIANTS = new Map();
for (const group of NOTE_MARKER_EXTRA_VARIANT_GROUPS) {
  const chars = [...group];
  const canonical = chars[0];
  for (const char of chars) NOTE_MARKER_EXTRA_VARIANTS.set(char, canonical);
}

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
      console.error(`Usage: node scripts/resolve-inline-numeric-note-markers.mjs [--apply] [--book BOOK] [--chapter CHAPTER] [--limit N] [--queue PATH] [--reviewer NAME]`);
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

function chapterPath(item) {
  return item.file || path.join(DATA_DIR, item.book, `${String(item.chapter).padStart(3, '0')}.json`);
}

const chapterCache = new Map();

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

function cleanSourceText(text) {
  return String(text || '')
    .replace(NUMERIC_NOTE_MARKER_RE, '')
    .replace(PAGE_RANGE_RE, '');
}

function noteMarkerKey(text) {
  let out = '';
  for (const char of exactVariantKey(text)) out += NOTE_MARKER_EXTRA_VARIANTS.get(char) || char;
  return out;
}

function hasNumericMarker(text) {
  NUMERIC_NOTE_MARKER_RE.lastIndex = 0;
  return NUMERIC_NOTE_MARKER_RE.test(String(text || ''));
}

function equivalentAfterCleaning(source, local) {
  const sourceKey = noteMarkerKey(source);
  const cleanLocal = cleanSourceText(local);
  const localKey = noteMarkerKey(cleanLocal);
  return Boolean(sourceKey && sourceKey === localKey);
}

function appendNote(existing, note) {
  const value = String(existing || '').trim();
  if (!value) return note;
  if (value.includes(note)) return value;
  return `${value}\n${note}`;
}

function cleanTranslationText(text) {
  return String(text || '').replace(TRANSLATION_NOTE_MARKER_RE, '').replace(/\s{2,}/gu, ' ').trim();
}

function cleanTranslationMarkers(unit) {
  let changed = 0;
  for (const key of ['literal', 'idiomatic', 'translation']) {
    if (typeof unit[key] !== 'string') continue;
    const after = cleanTranslationText(unit[key]);
    if (after === unit[key]) continue;
    unit[key] = after;
    changed += 1;
  }
  for (const translation of unit.translations || []) {
    if (!translation || typeof translation !== 'object') continue;
    for (const key of ['literal', 'idiomatic', 'translation']) {
      if (typeof translation[key] !== 'string') continue;
      const after = cleanTranslationText(translation[key]);
      if (after === translation[key]) continue;
      translation[key] = after;
      changed += 1;
    }
  }
  return changed;
}

function cleanChapterUnits(item, opts) {
  const ids = item.localRange?.ids || [];
  if (ids.length === 0) return { changed: 0, translationFieldsChanged: 0, ids: [] };
  const file = chapterPath(item);
  if (!fs.existsSync(file)) return { changed: 0, translationFieldsChanged: 0, ids: [] };
  const chapter = loadChapter(file);
  const cleanedIds = [];
  let changed = 0;
  let translationFieldsChanged = 0;

  for (const id of ids) {
    const entry = chapter.byId.get(id);
    if (!entry) continue;
    const before = String(entry.unit[entry.field] || '');
    const after = cleanSourceText(before);
    const translationChanges = cleanTranslationMarkers(entry.unit);
    if (before !== after) {
      cleanedIds.push(id);
      changed += 1;
    }
    translationFieldsChanged += translationChanges;
    if (opts.apply && (before !== after || translationChanges > 0)) {
      entry.unit[entry.field] = after;
      chapter.changed = true;
    }
  }

  return { changed, translationFieldsChanged, ids: cleanedIds };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const stats = {
    apply: opts.apply,
    resolved: 0,
    sourceUnitsCleaned: 0,
    translationFieldsCleaned: 0,
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
      if (opts.chapters.size > 0 && !opts.chapters.has(String(item.chapter).padStart(3, '0'))) continue;

      const source = item.sourceRange?.text || '';
      const local = item.localRange?.text || '';
      if (!source || !local || !hasNumericMarker(local)) continue;
      if (!equivalentAfterCleaning(source, local)) continue;

      const cleaned = cleanChapterUnits(item, opts);
      stats.resolved += 1;
      stats.sourceUnitsCleaned += cleaned.changed;
      stats.translationFieldsCleaned += cleaned.translationFieldsChanged;
      stats.byBook[item.book] = (stats.byBook[item.book] || 0) + 1;
      const chapterKey = `${item.book}/${String(item.chapter).padStart(3, '0')}`;
      stats.byChapter[chapterKey] = (stats.byChapter[chapterKey] || 0) + 1;
      if (stats.samples.length < 25) {
        stats.samples.push({
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          localIds: item.localRange?.ids || [],
          cleanedIds: cleaned.ids,
          source,
          local,
          cleanedLocal: cleanSourceText(local),
        });
      }

      if (!opts.apply) continue;

      item.status = 'applied';
      item.decision = 'included';
      item.reviewedAt = item.reviewedAt || now;
      item.reviewer = item.reviewer || opts.reviewer;
      item.appliedAt = now;
      item.appliedSummary = {
        mode: 'removed-inline-numeric-note-markers',
        localIds: item.localRange?.ids || [],
        cleanedIds: cleaned.ids,
        translationFieldsCleaned: cleaned.translationFieldsChanged,
      };
      item.notes = appendNote(
        item.notes,
        'Removed inline numeric source-note markers from local Chinese and matching English marker residue; cleaned local source matches upstream witness.',
      );
      changedQueue = true;
    }

    if (opts.apply && changedQueue) {
      queue.updatedAt = now;
      fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      stats.touchedQueueFiles += 1;
    }
  }

  if (opts.apply) {
    for (const [file, chapter] of chapterCache) {
      if (!chapter.changed) continue;
      fs.writeFileSync(file, `${JSON.stringify(chapter.chapter, null, 2)}\n`, 'utf8');
      stats.touchedChapterFiles += 1;
    }
  }

  console.log(JSON.stringify(stats, null, 2));
}

main();
