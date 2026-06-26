#!/usr/bin/env node
/**
 * Resolve upstream witness defects where Wikisource contains empty quotation
 * shells such as 詔曰：「」 while the local corpus already preserves the quoted
 * text and the surrounding chapter text.
 *
 * This does not edit corpus Chinese or translations. It only closes queue items
 * whose non-empty upstream pieces and fuller local quotation are already present
 * in the live chapter.
 */

import fs from 'node:fs';
import path from 'node:path';
import { noPunctuationKey, normalizeWhitespace } from './source-variant-utils.mjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const SOURCE_FIELDS = ['zh', 'content', 'source', 'text'];
const DEFAULT_REVIEWER = 'resolve-empty-quote-source-noops';
const EMPTY_QUOTE_RE = /(?:曰|云|謂|詔|制|敕|奏|表|議|疏|啟|令|言|書|報)(?:[:：])?[「『][」』]/u;
const EMPTY_QUOTE_SPLIT_RE = /[「『][」』]/u;

function usage() {
  console.error(`Usage: node scripts/resolve-empty-quote-source-noops.mjs [--apply] [--book BOOK] [--limit N] [--reviewer NAME]`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    reviewer: DEFAULT_REVIEWER,
    books: new Set(),
    limit: Number.POSITIVE_INFINITY,
    sampleLimit: 30,
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
      opts.books.add(String(argv[++i] || '').trim());
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.books.add(arg.slice('--book='.length).trim());
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
    if (arg === '--sample-limit') {
      opts.sampleLimit = Number(argv[++i]);
      continue;
    }
    if (arg.startsWith('--sample-limit=')) {
      opts.sampleLimit = Number(arg.slice('--sample-limit='.length));
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

  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Number.POSITIVE_INFINITY;
  if (!Number.isFinite(opts.sampleLimit) || opts.sampleLimit < 0) opts.sampleLimit = 30;
  return opts;
}

function statusOf(item) {
  const status = String(item?.status || '').toLowerCase();
  const decision = String(item?.decision || '').toLowerCase();
  if (
    item?.appliedAt
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
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string') || null;
}

const chapterCache = new Map();

function chapterTextKey(item) {
  const chapterPath = item.file && fs.existsSync(item.file)
    ? item.file
    : path.join(DATA_DIR, item.book || '', `${String(item.chapter || '').padStart(3, '0')}.json`);
  const abs = path.resolve(chapterPath);
  if (chapterCache.has(abs)) return chapterCache.get(abs);
  if (!fs.existsSync(abs)) {
    chapterCache.set(abs, '');
    return '';
  }

  const chapter = JSON.parse(fs.readFileSync(abs, 'utf8'));
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

  const key = noPunctuationKey(parts.join(''));
  chapterCache.set(abs, key);
  return key;
}

function isSubsequence(needle, haystack) {
  if (!needle) return false;
  let cursor = 0;
  for (const char of haystack) {
    if (char === needle[cursor]) cursor += 1;
    if (cursor >= needle.length) return true;
  }
  return false;
}

function sourcePiecesRepresented(source, chapterKey) {
  const pieces = normalizeWhitespace(source)
    .split(EMPTY_QUOTE_SPLIT_RE)
    .map((piece) => noPunctuationKey(piece))
    .filter((piece) => piece.length >= 4);
  if (pieces.length === 0) return false;
  return pieces.every((piece) => chapterKey.includes(piece) || isSubsequence(piece, chapterKey));
}

function classify(item) {
  if (item.sourceName && item.sourceName !== 'wikisource') return null;
  const source = String(item.sourceRange?.text || '');
  const local = String(item.localRange?.text || '');
  if (!EMPTY_QUOTE_RE.test(normalizeWhitespace(source))) return null;

  const sourceKey = noPunctuationKey(source);
  const localKey = noPunctuationKey(local);
  if (sourceKey.length < 4 || localKey.length < 4) return null;

  const chapterKey = chapterTextKey(item);
  if (!chapterKey.includes(localKey)) return null;
  if (!isSubsequence(sourceKey, chapterKey)) return null;
  if (!sourcePiecesRepresented(source, chapterKey)) return null;
  if (sourceKey.length > Math.max(1200, localKey.length * 20)) return null;

  return 'upstream-empty-quote-shell';
}

function queueFiles(opts) {
  return fs.readdirSync(QUALITY_DIR)
    .filter((file) => QUEUE_RE.test(file))
    .filter((file) => {
      if (opts.books.size === 0) return true;
      return [...opts.books].some((book) => file === `source-correspondence-corpus-wikisource-${book}.json`);
    })
    .map((file) => path.join(QUALITY_DIR, file))
    .sort();
}

function appendNote(existing, note) {
  const value = String(existing || '').trim();
  if (!value) return note;
  if (value.includes(note)) return value;
  return `${value}\n${note}`;
}

function short(text) {
  const value = normalizeWhitespace(text);
  return value.length > 140 ? `${value.slice(0, 140)}...` : value;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const summary = {
    apply: opts.apply,
    resolved: 0,
    touchedQueueFiles: 0,
    byBook: {},
    byQueue: {},
    samples: [],
  };

  for (const queueFile of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let changed = false;
    let queueCount = 0;

    for (const item of queue.items || []) {
      if (summary.resolved >= opts.limit) break;
      if (statusOf(item) !== 'pending') continue;

      const reason = classify(item);
      if (!reason) continue;

      summary.resolved += 1;
      queueCount += 1;
      summary.byBook[item.book || 'unknown'] = (summary.byBook[item.book || 'unknown'] || 0) + 1;
      if (summary.samples.length < opts.sampleLimit) {
        summary.samples.push({
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          type: item.type || 'unknown',
          severity: item.severity ?? null,
          reason,
          source: short(item.sourceRange?.text || ''),
          local: short(item.localRange?.text || ''),
        });
      }

      if (opts.apply) {
        item.status = 'denied';
        item.decision = 'denied';
        item.reviewedAt = now;
        item.reviewer = item.reviewer || opts.reviewer;
        item.notes = appendNote(
          item.notes,
          'Reviewed as no-op: upstream Wikisource witness has an empty quotation shell while the local chapter already preserves the fuller quotation and surrounding source text; local corpus retained.',
        );
        changed = true;
      }
    }

    if (queueCount > 0) summary.byQueue[path.relative(process.cwd(), queueFile)] = queueCount;
    if (opts.apply && changed) {
      queue.updatedAt = now;
      fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      summary.touchedQueueFiles += 1;
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
