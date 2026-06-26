#!/usr/bin/env node
/**
 * Resolve source-omission queue items caused only by leading close punctuation.
 *
 * Safe case:
 * - the upstream omitted span is a single source unit starting with a closing
 *   quote/bracket;
 * - after moving that close punctuation back to the previous sentence, the body
 *   source unit already exists in the local chapter;
 * - that local unit is exactly between the queue item's before/after local
 *   context.
 *
 * This is metadata-only: it does not edit chapter Chinese or English.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const SOURCE_FIELDS = ['zh', 'source', 'content', 'text'];
const CLOSE_RE = /^[」』”）)\]】〉》]+/u;
const DEFAULT_REVIEWER = 'resolve-leading-close-omission-noops';

function usage() {
  console.error(`Usage:
  node scripts/resolve-leading-close-omission-noops.mjs [--apply]
    [--book BOOK] [--chapter CHAPTER] [--queue PATH] [--limit N]
    [--reviewer NAME]

Dry-run by default. With --apply, marks verified queue items denied/no-op.`);
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

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--book') {
      opts.books.add(argv[++index]);
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.books.add(arg.slice('--book='.length));
      continue;
    }
    if (arg === '--chapter') {
      opts.chapters.add(String(argv[++index] || '').padStart(3, '0'));
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      opts.chapters.add(arg.slice('--chapter='.length).padStart(3, '0'));
      continue;
    }
    if (arg === '--queue') {
      opts.queues.push(argv[++index]);
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queues.push(arg.slice('--queue='.length));
      continue;
    }
    if (arg === '--limit') {
      opts.limit = Number(argv[++index]);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      opts.limit = Number(arg.slice('--limit='.length));
      continue;
    }
    if (arg === '--reviewer') {
      opts.reviewer = argv[++index] || DEFAULT_REVIEWER;
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
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string') || null;
}

function sourceText(unit) {
  const field = sourceField(unit);
  return field ? String(unit[field] || '') : '';
}

const chapterCache = new Map();

function chapterPath(item) {
  return item.file || path.join(DATA_DIR, item.book, `${String(item.chapter || '').padStart(3, '0')}.json`);
}

function flattenChapter(file) {
  const abs = path.resolve(file);
  if (chapterCache.has(abs)) return chapterCache.get(abs);
  if (!fs.existsSync(abs)) {
    chapterCache.set(abs, []);
    return [];
  }
  const chapter = JSON.parse(fs.readFileSync(abs, 'utf8'));
  const units = [];
  for (const block of chapter.content || []) {
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (const unit of collection) {
        const text = sourceText(unit);
        if (!text) continue;
        units.push({ id: unit.id || '', text });
      }
    }
  }
  chapterCache.set(abs, units);
  return units;
}

function meaningfulLength(text) {
  return Array.from(String(text || '').replace(/[^\p{Script=Han}0-9]/gu, '')).length;
}

function candidateTexts(item) {
  const source = String(item.sourceRange?.text || '');
  const body = source.replace(CLOSE_RE, '');
  const followingClose = String(item.context?.afterSource || '').match(CLOSE_RE)?.[0] || '';
  return [...new Set([body, `${body}${followingClose}`].filter((text) => meaningfulLength(text) >= 2))];
}

function verifyNoop(item) {
  if (statusOf(item) !== 'pending') return null;
  if (item.type !== 'source_omission_candidate') return null;
  if ((item.sourceRange?.count ?? 0) !== 1) return null;
  if (String(item.localRange?.text || '').trim()) return null;
  const source = String(item.sourceRange?.text || '');
  if (!CLOSE_RE.test(source)) return null;

  const candidates = candidateTexts(item);
  if (candidates.length === 0) return null;
  const beforeLocal = String(item.context?.beforeLocal || '');
  const afterLocal = String(item.context?.afterLocal || '');
  if (!beforeLocal || !afterLocal) return null;

  const units = flattenChapter(chapterPath(item));
  const matches = [];
  for (let index = 0; index < units.length; index += 1) {
    if (!candidates.includes(units[index].text)) continue;
    if (units[index - 1]?.text !== beforeLocal) continue;
    if (units[index + 1]?.text !== afterLocal) continue;
    matches.push(units[index]);
  }
  if (matches.length !== 1) return null;
  return {
    reason: 'leading-close-boundary-noop',
    existingId: matches[0].id,
    existingText: matches[0].text,
  };
}

function appendNote(existing, note) {
  const value = String(existing || '').trim();
  if (!value) return note;
  if (value.includes(note)) return value;
  return `${value}\n${note}`;
}

function short(text) {
  const value = String(text || '').replace(/\s+/gu, '');
  return value.length > 140 ? `${value.slice(0, 139)}...` : value;
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
    if (summary.verified >= opts.limit) break;
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let changed = false;

    for (const item of queue.items || []) {
      if (summary.verified >= opts.limit) break;
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      if (opts.chapters.size > 0 && !opts.chapters.has(String(item.chapter || '').padStart(3, '0'))) continue;
      const verified = verifyNoop(item);
      if (!verified) continue;

      summary.verified += 1;
      summary.byBook[item.book] = (summary.byBook[item.book] || 0) + 1;
      if (summary.samples.length < 40) {
        summary.samples.push({
          id: item.id,
          chapter: `${item.book}/${String(item.chapter || '').padStart(3, '0')}`,
          existingId: verified.existingId,
          source: short(item.sourceRange?.text || ''),
          existing: short(verified.existingText),
        });
      }

      if (opts.apply) {
        item.status = 'denied';
        item.decision = 'denied';
        item.reviewedAt = now;
        item.reviewer = opts.reviewer;
        item.notes = appendNote(
          item.notes,
          'Reviewed as no-op: source body sentence is already present locally; leading close punctuation belongs to the previous sentence.',
        );
        changed = true;
      }
    }

    if (opts.apply && changed) {
      fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`);
      summary.touchedQueueFiles += 1;
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
