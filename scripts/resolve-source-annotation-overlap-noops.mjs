#!/usr/bin/env node
/**
 * Close source-correspondence items caused by upstream annotation/base-text
 * overlap. Wikisource often merges base text and bracketed commentary into one
 * span, while the local corpus keeps the same material split into body units
 * and 注[...] commentary units.
 *
 * This script only updates queue metadata. It does not edit Chinese or English.
 * A pending item is denied only when every meaningful upstream fragment is
 * already present in the live chapter text.
 */

import fs from 'node:fs';
import path from 'node:path';
import { variantText } from './source-variant-utils.mjs';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const SOURCE_FIELDS = ['zh', 'content', 'source', 'text'];
const DEFAULT_REVIEWER = 'resolve-source-annotation-overlap-noops';

const ANNOTATION_MARKER_RE = /[【】]|(?:^|[」』”])【|注[\[［〔【]?[一二三四五六七八九十百千萬万零〇0-9]+[\]］〕】]?/u;
const LOCAL_NOTE_RE = /(?:^|[。！？；])\s*(?:注[\[［〔【]?[一二三四五六七八九十百千萬万零〇0-9]+[\]］〕】]?|[\[［〔【][一二三四五六七八九十百千萬万零〇0-9]+[\]］〕】])/u;
const SPLIT_RE = /[。！？；；!?]+|[【】]+/u;
const MIN_FRAGMENT_KEY = 6;
const MIN_SOURCE_KEY = 18;

function usage() {
  console.error(`Usage:
  node scripts/resolve-source-annotation-overlap-noops.mjs [--apply]
    [--book BOOK] [--chapter CHAPTER] [--queue PATH] [--limit N]
    [--reviewer NAME]

Dry-run by default. With --apply, marks verified annotation-overlap queue items
as denied/no-op.`);
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
      opts.chapters.add(String(argv[++i] || '').padStart(3, '0'));
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      opts.chapters.add(arg.slice('--chapter='.length).padStart(3, '0'));
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
  if (
    item.appliedAt
    || status === 'applied'
    || status === 'denied'
    || status === 'approved'
    || status === 'rejected'
    || decision === 'included'
    || decision === 'applied'
    || decision === 'denied'
    || decision === 'approved'
    || decision === 'rejected'
  ) return 'done';
  return 'pending';
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string');
}

function collectSourceText(chapter) {
  const parts = [];
  for (const block of chapter.content || []) {
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (const unit of collection) {
        const field = sourceField(unit);
        if (field) parts.push(String(unit[field] || ''));
      }
    }
  }
  return parts.join('');
}

const chapterKeyCache = new Map();

function chapterKey(file) {
  const absolute = path.resolve(file);
  if (chapterKeyCache.has(absolute)) return chapterKeyCache.get(absolute);
  if (!fs.existsSync(absolute)) {
    chapterKeyCache.set(absolute, '');
    return '';
  }
  const chapter = JSON.parse(fs.readFileSync(absolute, 'utf8'));
  const key = comparisonKey(collectSourceText(chapter));
  chapterKeyCache.set(absolute, key);
  return key;
}

function comparisonKey(text) {
  let out = '';
  for (const char of String(text || '').normalize('NFKC')) {
    out += variantText(char);
  }
  return out.replace(/[^\p{Script=Han}0-9]/gu, '');
}

function stripLocalNoteMarkers(text) {
  return String(text || '')
    .replace(/(?:^|[。！？；])\s*(注[\[［〔【]?[一二三四五六七八九十百千萬万零〇0-9]+[\]］〕】]?)/gu, '')
    .replace(/[\[［〔【][一二三四五六七八九十百千萬万零〇0-9]+[\]］〕】]/gu, '');
}

function meaningfulFragments(text) {
  return String(text || '')
    .split(SPLIT_RE)
    .map((part) => comparisonKey(part))
    .filter((key) => key.length >= MIN_FRAGMENT_KEY);
}

function allFragmentsPresent(fragments, fullChapterKey) {
  return fragments.length > 0 && fragments.every((fragment) => fullChapterKey.includes(fragment));
}

function classify(item, opts) {
  if (statusOf(item) !== 'pending') return null;
  if (![
    'text_discrepancy_candidate',
    'source_replacement_candidate',
    'source_omission_candidate',
  ].includes(item.type || '')) return null;
  if (opts.books.size > 0 && !opts.books.has(item.book)) return null;
  if (opts.chapters.size > 0 && !opts.chapters.has(String(item.chapter || '').padStart(3, '0'))) return null;

  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!source || !ANNOTATION_MARKER_RE.test(source)) return null;

  const sourceKey = comparisonKey(source);
  if (sourceKey.length < MIN_SOURCE_KEY) return null;

  const localKey = comparisonKey(stripLocalNoteMarkers(local));
  if (localKey && !sourceKey.includes(localKey)) return null;
  if (!localKey && local && !LOCAL_NOTE_RE.test(local)) return null;

  const file = item.file || path.join('data', item.book || '', `${item.chapter || ''}.json`);
  const liveKey = chapterKey(file);
  if (!liveKey) return null;

  const fragments = meaningfulFragments(source);
  if (!allFragmentsPresent(fragments, liveKey)) return null;

  return {
    fragments: fragments.length,
    sourceKeyLength: sourceKey.length,
    localKeyLength: localKey.length,
  };
}

function markDenied(item, now, reviewer, result) {
  item.status = 'denied';
  item.decision = 'denied';
  item.reviewedAt = item.reviewedAt || now;
  item.reviewer = item.reviewer || reviewer;
  const note = `Reviewed as no-op: upstream annotation/base-text span is already present in the live chapter as split body/commentary units (${result.fragments} verified fragments); local corpus structure retained.`;
  item.notes = item.notes ? `${item.notes}\n${note}` : note;
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

  for (const file of queueFiles(opts)) {
    if (summary.verified >= opts.limit) break;
    const queue = JSON.parse(fs.readFileSync(file, 'utf8'));
    let changed = false;
    for (const item of queue.items || []) {
      if (summary.verified >= opts.limit) break;
      const result = classify(item, opts);
      if (!result) continue;
      summary.verified += 1;
      summary.byBook[item.book] = (summary.byBook[item.book] || 0) + 1;
      if (summary.samples.length < 30) {
        summary.samples.push({
          id: item.id,
          chapter: `${item.book}/${String(item.chapter || '').padStart(3, '0')}`,
          source: String(item.sourceRange?.text || '').replace(/\s+/gu, '').slice(0, 120),
          local: String(item.localRange?.text || '').replace(/\s+/gu, '').slice(0, 120),
          ...result,
        });
      }
      if (!opts.apply) continue;
      markDenied(item, now, opts.reviewer, result);
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(file, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      summary.touchedQueueFiles += 1;
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
