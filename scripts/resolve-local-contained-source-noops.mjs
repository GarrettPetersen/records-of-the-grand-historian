#!/usr/bin/env node
/**
 * Resolve source-correspondence items where the current local span is a fuller
 * unit that already contains the upstream witness span.
 *
 * This is a metadata-only resolver. It does not edit corpus text or
 * translations; it marks narrowly recognized local-fuller cases rejected so the
 * local corpus is retained.
 */

import fs from 'node:fs';
import path from 'node:path';
import { classifyItem } from './triage-repair-queue.mjs';
import { exactVariantKey, noPunctuationKey, normalizeWhitespace } from './source-variant-utils.mjs';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const DEFAULT_REVIEWER = 'resolve-local-contained-source-noops';

const NOTE_BOUNDARY_RE = /(?:校勘記|注[\[〔【]?[一二三四五六七八九十百〇零0-9]+|[\[〔【][一二三四五六七八九十百〇零0-9]+[\]〕】])/u;
const STRUCTURAL_MARKUP_RE = /(?:__(?:FORCE)?TOC__|__NOTOC__|<sub>|<\/sub>|\}\}|==|^=|class=|style=)/u;
const SENTENCE_END_RE = /[。！？；]/u;
const TINY_FRAGMENT_RE = /^[，、。；：！？」』”）)\]】〉》\p{Script=Han}0-9]{1,12}$/u;
const ZZTJ_APPARATUS_RE = /(?:乙十一行本同|孔本同|張校同|退齋校同|章校|據《|據補|據改|增補|今從|案：|胡注|正義|舊文|刪|移入|誤|中國歷史日食典|司馬光未改)/u;

function usage() {
  console.error(`Usage:
  node scripts/resolve-local-contained-source-noops.mjs [--apply]
    [--book BOOK] [--chapter CHAPTER] [--queue PATH] [--limit N]
    [--reviewer NAME]

Dry-run by default. With --apply, marks conservative local-fuller source
correspondence items rejected/local-retained.`);
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
      opts.books.add(argv[++index] || '');
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
      opts.queues.push(argv[++index] || '');
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

  for (const book of [...opts.books]) if (!book) opts.books.delete(book);
  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Infinity;
  return opts;
}

function statusOf(item) {
  const status = String(item?.status || '').toLowerCase();
  const decision = String(item?.decision || '').toLowerCase();
  if (
    item?.appliedAt
    || item?.appliedSummary
    || ['applied', 'approved', 'denied', 'rejected'].includes(status)
    || ['applied', 'approved', 'included', 'denied', 'rejected'].includes(decision)
  ) return 'done';
  return 'pending';
}

function queueFiles(opts) {
  if (opts.queues.length > 0) return opts.queues;
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => QUEUE_RE.test(entry))
    .filter((entry) => (
      opts.books.size === 0
      || [...opts.books].some((book) => entry.includes(`-${book}.json`) || entry.includes(`-${book}-`))
    ))
    .map((entry) => path.join(QUALITY_DIR, entry))
    .sort();
}

function trimKeyLength(text) {
  return [...noPunctuationKey(text)].length;
}

function localContainsSource(source, local) {
  const sourceKey = noPunctuationKey(source);
  const localKey = noPunctuationKey(local);
  return Boolean(sourceKey && localKey && sourceKey !== localKey && localKey.includes(sourceKey));
}

function sourceAppearsAtBoundary(source, local) {
  const compactSource = normalizeWhitespace(source);
  const compactLocal = normalizeWhitespace(local);
  const index = compactLocal.indexOf(compactSource);
  if (index < 0) return null;
  return {
    prefix: compactLocal.slice(0, index),
    suffix: compactLocal.slice(index + compactSource.length),
  };
}

function leadingNameKey(source) {
  const compact = normalizeWhitespace(source)
    .replace(/^[\d０-９]+/u, '')
    .replace(/^[\s:：○\-—–_=|!#*]+/u, '');
  const ziIndex = compact.indexOf('字');
  if (ziIndex < 1 || ziIndex > 10) return '';
  const lead = compact.slice(0, ziIndex).replace(/[^\p{Script=Han}]/gu, '');
  const key = noPunctuationKey(lead);
  if (key.length < 2 || key.length > 8) return '';
  return key;
}

function isAnnotationBoundary(source, local) {
  if (!NOTE_BOUNDARY_RE.test(local)) return false;
  const boundary = sourceAppearsAtBoundary(source, local);
  if (!boundary) return true;
  return NOTE_BOUNDARY_RE.test(boundary.prefix) || NOTE_BOUNDARY_RE.test(boundary.suffix);
}

function isStructuralMarkupBoundary(source, local) {
  return STRUCTURAL_MARKUP_RE.test(source) || STRUCTURAL_MARKUP_RE.test(local);
}

function isHeadingNoop(item, classification) {
  return classification.className === 'chapter-start-heading-noop'
    || String(item.notes || '').includes('chapter-start');
}

function isShortLabelBoundary(source, local) {
  const boundary = sourceAppearsAtBoundary(source, local);
  if (!boundary) return false;
  const sourceLength = trimKeyLength(source);
  if (sourceLength > 18) return false;
  const prefixLength = trimKeyLength(boundary.prefix);
  const suffixLength = trimKeyLength(boundary.suffix);
  if (prefixLength + suffixLength === 0) return false;
  if (prefixLength > 24 || suffixLength > 24) return false;
  if (SENTENCE_END_RE.test(boundary.prefix) || SENTENCE_END_RE.test(boundary.suffix)) return false;
  return TINY_FRAGMENT_RE.test(source) || sourceLength <= 8;
}

function isBriefPrefixBoundary(source, local) {
  const boundary = sourceAppearsAtBoundary(source, local);
  if (!boundary) return false;
  const prefixLength = trimKeyLength(boundary.prefix);
  const suffixLength = trimKeyLength(boundary.suffix);
  const sourceLength = trimKeyLength(source);
  if (prefixLength === 0 || suffixLength !== 0) return false;
  if (prefixLength > 16 || sourceLength < 8) return false;
  return !SENTENCE_END_RE.test(boundary.prefix);
}

function isDuplicatedHeadingBoundary(source, local) {
  const sourceKey = noPunctuationKey(source);
  const localKey = noPunctuationKey(local);
  const nameKey = leadingNameKey(source);
  if (!sourceKey || !localKey || !nameKey) return false;
  if (sourceKey.length < nameKey.length + 4) return false;
  return localKey.startsWith(`${nameKey}${sourceKey}`);
}

function isZizhiTongjianApparatusBoundary(item, source, local) {
  if (item.book !== 'zizhitongjian') return false;
  if (!ZZTJ_APPARATUS_RE.test(local)) return false;
  const sourceLength = trimKeyLength(source);
  const localLength = trimKeyLength(local);
  if (sourceLength < 4 || localLength <= sourceLength) return false;
  if (localLength - sourceLength > 220) return false;
  return true;
}

function isSafeVariantPunctuationOnly(source, local, classification) {
  if (classification.className !== 'variant-or-punctuation') return false;
  const sourceKey = noPunctuationKey(source);
  const localKey = noPunctuationKey(local);
  if (!sourceKey || !localKey || sourceKey !== localKey) return false;
  return exactVariantKey(source) !== exactVariantKey(local);
}

function classifyLocalFullerNoop(item) {
  if (statusOf(item) !== 'pending') return null;
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!source || !local) return null;

  const classification = classifyItem(item);
  if (isSafeVariantPunctuationOnly(source, local, classification)) return 'safe-variant-punctuation-local-retained';
  if (!localContainsSource(source, local)) return null;

  if (isHeadingNoop(item, classification)) return 'chapter-heading-local-fuller';
  if (isAnnotationBoundary(source, local)) return 'annotation-boundary-local-fuller';
  if (isStructuralMarkupBoundary(source, local)) return 'structural-markup-local-fuller';
  if (isDuplicatedHeadingBoundary(source, local)) return 'duplicate-heading-local-fuller';
  if (isZizhiTongjianApparatusBoundary(item, source, local)) return 'zizhitongjian-apparatus-local-fuller';
  if (isShortLabelBoundary(source, local)) return 'short-label-local-fuller';
  if (isBriefPrefixBoundary(source, local)) return 'brief-prefix-local-fuller';
  return null;
}

function appendNote(notes, addition) {
  const current = String(notes || '').trim();
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function short(text, max = 140) {
  const value = String(text || '').replace(/\s+/gu, '').trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}...`;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const summary = {
    apply: opts.apply,
    resolved: 0,
    touchedQueueFiles: 0,
    byReason: {},
    byBook: {},
    byChapter: {},
    samples: [],
  };

  for (const queueFile of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let changed = false;

    for (const item of queue.items || []) {
      if (summary.resolved >= opts.limit) break;
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      const chapter = String(item.chapter || '').padStart(3, '0');
      if (opts.chapters.size > 0 && !opts.chapters.has(chapter)) continue;

      const reason = classifyLocalFullerNoop(item);
      if (!reason) continue;

      summary.resolved += 1;
      summary.byReason[reason] = (summary.byReason[reason] || 0) + 1;
      summary.byBook[item.book] = (summary.byBook[item.book] || 0) + 1;
      const chapterKey = `${item.book}/${chapter}`;
      summary.byChapter[chapterKey] = (summary.byChapter[chapterKey] || 0) + 1;
      if (summary.samples.length < 30) {
        summary.samples.push({
          id: item.id,
          chapter: chapterKey,
          reason,
          source: short(item.sourceRange?.text || ''),
          local: short(item.localRange?.text || ''),
        });
      }

      if (!opts.apply) continue;
      item.status = 'denied';
      item.decision = 'rejected';
      item.reviewedAt = item.reviewedAt || now;
      item.reviewer = item.reviewer || opts.reviewer;
      item.notes = appendNote(
        item.notes,
        `Reviewed as local-fuller no-op (${reason}): upstream span is already contained in the local corpus unit; local corpus retained.`,
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
