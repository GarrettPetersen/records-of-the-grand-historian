#!/usr/bin/env node
/**
 * Resolve source-correspondence items caused only by Wikisource structural
 * residue: table-cell prefixes such as 專|, horizontal-rule counters such as
 * ----12, ZZTJ section counters, TOC markers, and trailing category tags.
 *
 * This is queue-only. It marks an item rejected only when removing those exact
 * residues makes the upstream and local spans identical.
 */

import fs from 'node:fs';
import path from 'node:path';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const DEFAULT_REVIEWER = 'resolve-wikisource-structural-prefix-noops';

function usage() {
  console.error(`Usage:
  node scripts/resolve-wikisource-structural-prefix-noops.mjs [--apply]
    [--book BOOK] [--limit N] [--reviewer NAME]

Dry-run by default. With --apply, marks matching queue items rejected.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    limit: Number.POSITIVE_INFINITY,
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
      opts.books.add(argv[++index] || '');
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.books.add(arg.slice('--book='.length));
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

  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Number.POSITIVE_INFINITY;
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
    || decision === 'false-positive'
    || decision === 'false_positive'
  ) return 'done';
  return 'pending';
}

function compact(text) {
  return String(text || '').replace(/\s+/gu, '');
}

function stripResidue(text, item) {
  let value = compact(text);
  value = value
    .replace(/^__TOC__/u, '')
    .replace(/^專\|，?/u, '')
    .replace(/^----\d+/u, '')
    .replace(/(?:category|Category):資治通鑑$/u, '');

  if (item.book === 'zizhitongjian') {
    value = value.replace(/^\d{1,3}(?=[\p{Script=Han}])/u, '');
  }

  return value;
}

function comparable(text, item) {
  return stripResidue(text, item)
    .replace(/[|{}!#=*<>]/gu, '')
    .replace(/[^\p{Script=Han}0-9]/gu, '');
}

function hasResidue(text, item) {
  const value = compact(text);
  return (
    /^__TOC__/u.test(value)
    || /^專\|，?/u.test(value)
    || /^----\d+/u.test(value)
    || /(?:category|Category):資治通鑑$/u.test(value)
    || (item.book === 'zizhitongjian' && /^\d{1,3}(?=[\p{Script=Han}])/u.test(value))
  );
}

function isNoop(item) {
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!source || !local) return false;
  if (!hasResidue(source, item)) return false;
  const sourceRaw = compact(source).replace(/[^\p{Script=Han}0-9]/gu, '');
  const localRaw = compact(local).replace(/[^\p{Script=Han}0-9]/gu, '');
  if (sourceRaw === localRaw) return false;
  const sourceKey = comparable(source, item);
  const localKey = comparable(local, item);
  return Boolean(sourceKey && sourceKey === localKey);
}

function appendNote(existing, note) {
  const value = String(existing || '').trim();
  if (!value) return note;
  if (value.includes(note)) return value;
  return `${value}\n${note}`;
}

function queueFiles(opts) {
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => QUEUE_RE.test(entry))
    .filter((entry) => {
      if (opts.books.size === 0) return true;
      return [...opts.books].some((book) => entry === `source-correspondence-corpus-wikisource-${book}.json`);
    })
    .map((entry) => path.join(QUALITY_DIR, entry))
    .sort();
}

function short(text) {
  const value = compact(text);
  return value.length > 140 ? `${value.slice(0, 139)}...` : value;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  let verified = 0;
  let touchedQueueFiles = 0;
  const byBook = {};
  const byType = {};
  const samples = [];

  for (const queueFile of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let changed = false;

    for (const item of queue.items || []) {
      if (verified >= opts.limit) break;
      if (statusOf(item) !== 'pending') continue;
      if (!isNoop(item)) continue;

      verified += 1;
      byBook[item.book] = (byBook[item.book] || 0) + 1;
      const typeKey = `${item.type || 'unknown'}|sev${item.severity ?? 'unknown'}`;
      byType[typeKey] = (byType[typeKey] || 0) + 1;
      if (samples.length < 30) {
        samples.push({
          id: item.id,
          chapter: `${item.book}/${item.chapter}`,
          source: short(item.sourceRange?.text || ''),
          local: short(item.localRange?.text || ''),
        });
      }

      if (opts.apply) {
        item.status = 'denied';
        item.decision = 'rejected';
        item.reviewedAt = now;
        item.reviewedBy = opts.reviewer;
        item.notes = appendNote(
          item.notes,
          'Reviewed as Wikisource structural-residue no-op: upstream-only table or section marker was removed and local corpus retained.',
        );
        changed = true;
      }
    }

    if (changed && opts.apply) {
      queue.updatedAt = now;
      fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      touchedQueueFiles += 1;
    }
  }

  console.log(JSON.stringify({
    apply: opts.apply,
    verified,
    touchedQueueFiles,
    byBook,
    byType,
    samples,
  }, null, 2));
}

main();
