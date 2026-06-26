#!/usr/bin/env node
/**
 * Close small, metadata-only source-correspondence no-ops.
 *
 * This script does not edit chapter source or translations. It only marks
 * queue records as reviewed when the difference is already known to be
 * non-semantic:
 * - a local-only standalone heading is immediately repeated by the following
 *   source/local unit.
 */

import fs from 'node:fs';
import path from 'node:path';
import { classifyItem } from './triage-repair-queue.mjs';
import {
  noPunctuationKey,
  normalizeWhitespace,
} from './source-variant-utils.mjs';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const DEFAULT_REVIEWER = 'resolve-small-structural-noops';
const HEADING_PUNCT_RE = /[，、。；：！？「」『』《》]/u;
const PLACEHOLDER_RE = /[□�\uE000-\uF8FF]|\{[^}]{1,12}\}|<[^>]{1,12}>/u;
const TERMINAL_SOURCE_PAGE_MARKER_RE = /^(?:傳|志|表|紀|列傳|本紀)[0-9０-９〇零一二三四五六七八九十百]{1,6}$/u;

const NOTES = {
  heading: 'Reviewed as no-op: local standalone heading is structural and is immediately repeated by the following source/local unit; local corpus text retained.',
  terminalSourcePageMarker: 'Reviewed as no-op: terminal upstream page/index marker follows matching chapter-ending text and is not base corpus text; local corpus retained.',
};

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
    queues: [],
    limit: Number.POSITIVE_INFINITY,
    sampleLimit: 40,
    reviewer: DEFAULT_REVIEWER,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      console.error(`Usage: node scripts/resolve-small-structural-noops.mjs [--apply] [--book BOOK] [--chapter CHAPTER] [--queue PATH] [--limit N] [--sample-limit N] [--reviewer NAME]`);
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
      opts.chapters.add(argv[++i]);
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      opts.chapters.add(arg.slice('--chapter='.length));
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
    throw new Error(`Unknown option: ${arg}`);
  }

  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Number.POSITIVE_INFINITY;
  if (!Number.isFinite(opts.sampleLimit) || opts.sampleLimit < 0) opts.sampleLimit = 40;
  return opts;
}

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (item.appliedAt || status === 'applied' || decision === 'applied' || decision === 'included' || decision === 'approved') return 'applied';
  if (status === 'denied' || decision === 'denied' || decision === 'rejected') return 'denied';
  return 'pending';
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

function chapterAllowed(item, opts) {
  if (opts.books.size > 0 && !opts.books.has(item.book)) return false;
  if (opts.chapters.size > 0 && !opts.chapters.has(item.chapter)) return false;
  return true;
}

function short(text) {
  const value = normalizeWhitespace(text || '');
  return value.length > 140 ? `${value.slice(0, 139)}...` : value;
}

function classifyNoop(item) {
  if (statusOf(item) !== 'pending') return null;
  if (item.ruleId) return null;

  const classification = classifyItem(item);
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  const sourceText = normalizeWhitespace(source);
  const localText = normalizeWhitespace(local);

  if (classification.className === 'section-heading-review' && !source && local) {
    const heading = localText;
    if (!heading || heading.length > 80) return null;
    if (HEADING_PUNCT_RE.test(heading) || PLACEHOLDER_RE.test(heading)) return null;
    const headingKey = noPunctuationKey(heading);
    const afterSourceKey = noPunctuationKey(item.context?.afterSource || '');
    const afterLocalKey = noPunctuationKey(item.context?.afterLocal || '');
    if (
      headingKey
      && afterSourceKey.startsWith(headingKey)
      && afterLocalKey.startsWith(headingKey)
    ) {
      return { reason: 'repeated-standalone-heading', note: NOTES.heading };
    }
  }

  if (sourceText && !localText && TERMINAL_SOURCE_PAGE_MARKER_RE.test(sourceText)) {
    const beforeSourceKey = noPunctuationKey(item.context?.beforeSource || '');
    const beforeLocalKey = noPunctuationKey(item.context?.beforeLocal || '');
    const afterSourceKey = noPunctuationKey(item.context?.afterSource || '');
    const afterLocalKey = noPunctuationKey(item.context?.afterLocal || '');
    if (beforeSourceKey && beforeSourceKey === beforeLocalKey && !afterSourceKey && !afterLocalKey) {
      return { reason: 'terminal-source-page-marker', note: NOTES.terminalSourcePageMarker };
    }
  }

  return null;
}

function appendNote(existing, note) {
  const current = String(existing || '').trim();
  if (!current) return note;
  if (current.includes(note)) return current;
  return `${current}\n${note}`;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  let verified = 0;
  let touchedQueueFiles = 0;
  const byReason = {};
  const byBook = {};
  const samples = [];

  for (const queueFile of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let changed = false;

    for (const item of queue.items || []) {
      if (verified >= opts.limit) break;
      if (!chapterAllowed(item, opts)) continue;
      const classification = classifyNoop(item);
      if (!classification) continue;

      verified += 1;
      byReason[classification.reason] = (byReason[classification.reason] || 0) + 1;
      byBook[item.book] = (byBook[item.book] || 0) + 1;
      if (samples.length < opts.sampleLimit) {
        samples.push({
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          reason: classification.reason,
          source: short(item.sourceRange?.text || ''),
          local: short(item.localRange?.text || ''),
          afterSource: short(item.context?.afterSource || ''),
          afterLocal: short(item.context?.afterLocal || ''),
        });
      }

      if (opts.apply) {
        item.status = 'denied';
        item.decision = 'rejected';
        item.reviewedAt = now;
        item.reviewedBy = opts.reviewer;
        item.notes = appendNote(item.notes, classification.note);
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
    byReason,
    byBook,
    samples,
  }, null, 2));
}

main();
