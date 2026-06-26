#!/usr/bin/env node
/**
 * Resolve table-structure queue items that are layout-only.
 *
 * This only closes items when the cleaned upstream table text is already
 * represented in the current chapter text. It does not edit corpus Chinese or
 * translations.
 */

import fs from 'node:fs';
import path from 'node:path';
import { classifyItem } from './triage-repair-queue.mjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const SOURCE_FIELDS = ['zh', 'content', 'source', 'text'];
const DEFAULT_REVIEWER = 'resolve-table-layout-noop-queue';
const PLACEHOLDER_RE = /[□�\uE000-\uF8FF]|\{[^}]{1,12}\}|<[^>]{1,12}>|\[[^\]]{1,12}\]|[〈][^〉]{1,12}[〉]/u;
const SAFE_BUCKETS = new Set([
  'clean-source-equals-local',
  'clean-source-equals-local-after-dropping-ascii-digits',
]);
const CONTAINED_BUCKETS = new Set([
  'clean-source-contained-in-chapter',
  'clean-source-contained-in-chapter-after-dropping-ascii-digits',
]);

function parseArgs(argv) {
  const opts = {
    apply: false,
    includeContained: false,
    includeSubsequence: false,
    reviewer: DEFAULT_REVIEWER,
    books: new Set(),
    limit: Number.POSITIVE_INFINITY,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      console.error(`Usage: node scripts/resolve-table-layout-noop-queue.mjs [--apply] [--include-contained] [--include-subsequence] [--book BOOK] [--limit N] [--reviewer NAME]`);
      process.exit(0);
    }
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--include-contained') {
      opts.includeContained = true;
      continue;
    }
    if (arg === '--include-subsequence') {
      opts.includeSubsequence = true;
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
    if (arg === '--reviewer') {
      opts.reviewer = argv[++i] || DEFAULT_REVIEWER;
      continue;
    }
    if (arg.startsWith('--reviewer=')) {
      opts.reviewer = arg.slice('--reviewer='.length) || DEFAULT_REVIEWER;
      continue;
    }
    console.error(`Unknown option: ${arg}`);
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
    .replace(/Category:[^\s|<>]+/gu, '')
    .replace(/(?:Author-)?PD-old/gu, '')
    .replace(/[{}|!#=*<>]/gu, '');
}

function compact(text, { dropAsciiDigits = false } = {}) {
  let value = stripWikiMarkup(text).replace(/[^\p{Script=Han}0-9]/gu, '');
  if (dropAsciiDigits) value = value.replace(/[0-9]/gu, '');
  return value;
}

function hasNonNumericHan(text) {
  return /[\p{Script=Han}]/u.test(String(text || '').replace(/[一二三四五六七八九十百千萬万億亿廿卅卌〇零年月日朔晦春夏秋冬甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]/gu, ''));
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

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string') || null;
}

const chapterCache = new Map();

function chapterTexts(file) {
  const abs = path.resolve(file);
  if (chapterCache.has(abs)) return chapterCache.get(abs);
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
  const joined = parts.join('');
  const value = {
    compact: compact(joined),
    noAsciiDigits: compact(joined, { dropAsciiDigits: true }),
  };
  chapterCache.set(abs, value);
  return value;
}

function classifyTableNoop(item) {
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (PLACEHOLDER_RE.test(source) || PLACEHOLDER_RE.test(local)) return null;
  const sourceKey = compact(source);
  const localKey = compact(local);
  const sourceNoDigits = compact(source, { dropAsciiDigits: true });
  const localNoDigits = compact(local, { dropAsciiDigits: true });
  const chapter = chapterTexts(item.file);

  if (sourceKey && sourceKey === localKey) return 'clean-source-equals-local';
  if (sourceNoDigits && sourceNoDigits === localNoDigits) return 'clean-source-equals-local-after-dropping-ascii-digits';
  if (sourceKey && chapter.compact.includes(sourceKey)) return 'clean-source-contained-in-chapter';
  if (sourceNoDigits && chapter.noAsciiDigits.includes(sourceNoDigits)) return 'clean-source-contained-in-chapter-after-dropping-ascii-digits';
  if (
    sourceNoDigits
    && sourceNoDigits.length >= 8
    && hasNonNumericHan(sourceNoDigits)
    && isSubsequence(sourceNoDigits, chapter.noAsciiDigits)
  ) {
    return 'clean-source-subsequence-of-chapter-after-dropping-ascii-digits';
  }
  return null;
}

function appendNote(existing, note) {
  const value = String(existing || '').trim();
  if (!value) return note;
  if (value.includes(note)) return value;
  return `${value}\n${note}`;
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

function short(text) {
  const value = String(text || '').replace(/\s+/gu, '');
  return value.length > 120 ? `${value.slice(0, 119)}...` : value;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const safeBuckets = opts.includeContained
    ? new Set([...SAFE_BUCKETS, ...CONTAINED_BUCKETS])
    : SAFE_BUCKETS;
  if (opts.includeSubsequence) {
    safeBuckets.add('clean-source-subsequence-of-chapter-after-dropping-ascii-digits');
  }
  const byBucket = {};
  const byBook = {};
  const samples = [];
  let verified = 0;
  let touchedQueueFiles = 0;

  for (const queueFile of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let changed = false;

    for (const item of queue.items || []) {
      if (verified >= opts.limit) break;
      if (statusOf(item) !== 'pending') continue;
      if (classifyItem(item).className !== 'table-structure-review') continue;

      const bucket = classifyTableNoop(item);
      if (!bucket || !safeBuckets.has(bucket)) continue;

      verified += 1;
      byBucket[bucket] = (byBucket[bucket] || 0) + 1;
      byBook[item.book] = (byBook[item.book] || 0) + 1;
      if (samples.length < 20) {
        samples.push({
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          bucket,
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
          `Reviewed as table-layout no-op (${bucket}): cleaned upstream table text is already represented in the local chapter; local corpus retained.`,
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
    includeContained: opts.includeContained,
    verified,
    touchedQueueFiles,
    byBucket,
    byBook,
    samples,
  }, null, 2));
}

main();
