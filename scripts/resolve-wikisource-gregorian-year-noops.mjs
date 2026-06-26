#!/usr/bin/env node
/**
 * Resolve Wikisource source-correspondence items caused only by modern
 * Gregorian year insertions in the upstream witness, e.g. 永和元年136年.
 *
 * The classical corpus intentionally omits these editorial conversion years.
 * This script only marks queue items rejected when removing those insertions
 * (plus table/markup noise) makes the upstream and local spans identical.
 */

import fs from 'node:fs';
import path from 'node:path';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const DEFAULT_REVIEWER = 'resolve-wikisource-gregorian-year-noops';

function usage() {
  console.error(`Usage:
  node scripts/resolve-wikisource-gregorian-year-noops.mjs [--apply]
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

function stripWikiMarkup(text) {
  return String(text || '')
    .replace(/\s+/gu, '')
    .replace(/__(?:FORCE)?TOC__|__NOTOC__|__NOCC__/gu, '')
    .replace(/<!--[\s\S]*?-->/gu, '')
    .replace(/\b(?:class|style|rowspan|colspan|width|height|align|valign|border|cellspacing|cellpadding)="[^"]*"/giu, '')
    .replace(/\b(?:class|style|rowspan|colspan|width|height|align|valign|border|cellspacing|cellpadding)=[^|!\s，。；：、]+/giu, '')
    .replace(/[{}|!#=*<>]/gu, '');
}

function dropGregorianYears(text) {
  return stripWikiMarkup(text)
    .replace(/(?<=[\p{Script=Han}元一二三四五六七八九十百廿卅])\d{2,4}年/gu, '')
    .replace(/(?<=[\p{Script=Han}元一二三四五六七八九十百廿卅])\(\d{2,4}\)/gu, '')
    .replace(/(?<=[\p{Script=Han}元一二三四五六七八九十百廿卅])（\d{2,4}）/gu, '');
}

function compactWithoutPunctuation(text, { dropYears = false } = {}) {
  const value = dropYears ? dropGregorianYears(text) : stripWikiMarkup(text);
  return value.replace(/[^\p{Script=Han}0-9]/gu, '');
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
  const value = String(text || '').replace(/\s+/gu, '');
  return value.length > 140 ? `${value.slice(0, 139)}...` : value;
}

function isGregorianYearNoop(item) {
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!source || !local) return false;
  if (!/[0-9]{2,4}年/u.test(source)) return false;
  const sourceRaw = compactWithoutPunctuation(source);
  const localRaw = compactWithoutPunctuation(local);
  if (sourceRaw === localRaw) return false;
  const sourceClean = compactWithoutPunctuation(source, { dropYears: true });
  const localClean = compactWithoutPunctuation(local, { dropYears: true });
  return Boolean(sourceClean && sourceClean === localClean);
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
      if (!isGregorianYearNoop(item)) continue;

      verified += 1;
      byBook[item.book] = (byBook[item.book] || 0) + 1;
      const typeKey = `${item.type || 'unknown'}|sev${item.severity ?? 'unknown'}`;
      byType[typeKey] = (byType[typeKey] || 0) + 1;
      if (samples.length < 20) {
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
          'Reviewed as Wikisource modern-year no-op: upstream inserts Gregorian conversion years not present in the classical source; local corpus retained.',
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
