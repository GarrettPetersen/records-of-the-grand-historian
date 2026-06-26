#!/usr/bin/env node
/**
 * Close source-correspondence items caused by raw Wikisource dropping visible
 * link/template text while the live local corpus preserves the fuller text.
 *
 * The matcher is intentionally conservative. It handles only pending
 * replacement/discrepancy items where either:
 *   - the upstream span begins with a stray closing mark; or
 *   - the upstream span begins with __TOC__ and the live text has a structural
 *     title/list prefix.
 * In both cases, the upstream Han/digit content must be an ordered subsequence
 * of the local live span. It skips local note markers, edition brackets,
 * component placeholders, and table residue so those can be repaired instead of
 * hidden.
 */

import fs from 'node:fs';
import path from 'node:path';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const DEFAULT_REVIEWER = 'resolve-wikisource-dropped-visible-text';
const LEADING_CLOSE_RE = /^[」』”）)】〉》]/u;
const TOC_PREFIX_RE = /^__TOC__/u;
const HAN_OR_DIGIT_RE = /[\p{Script=Han}0-9]/u;
const SKIP_TEXT_RE = /[\[\]［］〔〕{}<>|]|[〈〉]|class=|VALIGN|ALIGN|width=|style=|忄|氵|扌|饣|钅|訁|糹|衤|亻|⓪/iu;
const SOURCE_TYPES = new Set(['text_discrepancy_candidate', 'source_replacement_candidate']);
const VARIANTS = new Map([
  ['爲', '為'],
  ['为', '為'],
  ['衞', '衛'],
  ['卫', '衛'],
  ['説', '說'],
  ['说', '說'],
  ['絶', '絕'],
  ['绝', '絕'],
  ['彊', '強'],
  ['强', '強'],
  ['歳', '歲'],
  ['岁', '歲'],
  ['衆', '眾'],
  ['众', '眾'],
  ['鍾', '鐘'],
  ['钟', '鐘'],
  ['于', '於'],
  ['鴈', '雁'],
  ['髠', '髡'],
  ['衮', '袞'],
  ['虛', '虚'],
  ['祜', '祐'],
  ['厮', '廝'],
  ['堿', '鹻'],
  ['硷', '鹻'],
  ['脚', '腳'],
  ['幞', '襆'],
  ['鞾', '靴'],
]);

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
    limit: Number.POSITIVE_INFINITY,
    reviewer: DEFAULT_REVIEWER,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      console.error(`Usage: node scripts/resolve-wikisource-dropped-visible-text.mjs [--apply] [--book BOOK] [--chapter CHAPTER] [--limit N] [--reviewer NAME]`);
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

function sourceText(item) {
  return item.sourceRange?.text || item.sourceText || '';
}

function localText(item) {
  return item.localRange?.text || item.localText || '';
}

function canonicalChar(char) {
  return VARIANTS.get(char) || char;
}

function comparisonChars(text) {
  return [...String(text || '')
    .replace(TOC_PREFIX_RE, '')
    .replace(LEADING_CLOSE_RE, '')
    .replace(/[()（）〔〕]/gu, '')]
    .filter((char) => HAN_OR_DIGIT_RE.test(char))
    .map(canonicalChar);
}

function subsequenceReport(source, local) {
  const sourceChars = comparisonChars(source);
  const localChars = comparisonChars(local);
  if (sourceChars.length < 6 || localChars.length <= sourceChars.length) return null;

  let sourceIndex = 0;
  let currentExtra = '';
  const extras = [];

  for (const char of localChars) {
    if (sourceIndex < sourceChars.length && char === sourceChars[sourceIndex]) {
      if (currentExtra) {
        extras.push(currentExtra);
        currentExtra = '';
      }
      sourceIndex += 1;
    } else {
      currentExtra += char;
    }
  }
  if (currentExtra) extras.push(currentExtra);
  if (sourceIndex !== sourceChars.length) return null;

  return {
    sourceLength: sourceChars.length,
    localLength: localChars.length,
    extraLength: localChars.length - sourceChars.length,
    extras,
  };
}

function appendNote(existing, note) {
  const current = String(existing || '').trim();
  if (!current) return note;
  if (current.includes(note)) return current;
  return `${current}\n${note}`;
}

function inScope(item, opts) {
  if (opts.books.size > 0 && !opts.books.has(item.book)) return false;
  if (opts.chapters.size > 0 && !opts.chapters.has(String(item.chapter || '').padStart(3, '0'))) return false;
  return true;
}

function classify(item) {
  if (statusOf(item) !== 'pending') return null;
  if (!SOURCE_TYPES.has(item.type)) return null;
  if (!/wikisource/i.test(`${item.sourceName || ''} ${item.sourceUrl || ''}`)) return null;

  const source = sourceText(item);
  const local = localText(item);
  if (!source || !local) return null;
  const leadingClose = LEADING_CLOSE_RE.test(source);
  const tocPrefix = TOC_PREFIX_RE.test(source);
  if (!leadingClose && !tocPrefix) return null;
  if (SKIP_TEXT_RE.test(source) || SKIP_TEXT_RE.test(local)) return null;

  const report = subsequenceReport(source, local);
  if (!report) return null;
  if (report.extraLength < 1 || report.extraLength > Math.max(80, Math.floor(report.sourceLength * 0.75))) return null;
  const maxExtraLength = tocPrefix ? 30 : 18;
  if (!report.extras.every((extra) => [...extra].length <= maxExtraLength && !/[0-9]/u.test(extra))) return null;

  return {
    ...report,
    reason: tocPrefix ? 'toc-structural-prefix' : 'dropped-visible-text',
    note: tocPrefix
      ? 'Reviewed as no-op: raw Wikisource __TOC__ boundary omitted a structural title/list prefix that the local corpus preserves; local text retained.'
      : 'Reviewed as no-op: raw Wikisource dropped visible linked/template text while the local corpus preserves the fuller source wording; local text retained.',
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const stats = {
    apply: opts.apply,
    resolved: 0,
    touchedQueueFiles: 0,
    byBook: {},
    byChapter: {},
    samples: [],
  };

  for (const file of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(file, 'utf8'));
    let changed = false;

    for (const item of queue.items || []) {
      if (stats.resolved >= opts.limit) break;
      if (!inScope(item, opts)) continue;
      const report = classify(item);
      if (!report) continue;

      stats.resolved += 1;
      stats.byBook[item.book] = (stats.byBook[item.book] || 0) + 1;
      const chapterKey = `${item.book}/${String(item.chapter || '').padStart(3, '0')}`;
      stats.byChapter[chapterKey] = (stats.byChapter[chapterKey] || 0) + 1;
      if (stats.samples.length < 20) {
        stats.samples.push({
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          type: item.type,
          severity: item.severity,
          extraLength: report.extraLength,
          extras: report.extras.slice(0, 16),
          source: sourceText(item).slice(0, 160),
          local: localText(item).slice(0, 220),
        });
      }

      if (opts.apply) {
        item.status = 'denied';
        item.decision = 'denied';
        item.reviewedAt = item.reviewedAt || now;
        item.reviewer = item.reviewer || opts.reviewer;
        item.notes = appendNote(item.notes, report.note);
        changed = true;
      }
    }

    if (changed) {
      stats.touchedQueueFiles += 1;
      fs.writeFileSync(file, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
    }
  }

  console.log(JSON.stringify(stats, null, 2));
}

main();
