#!/usr/bin/env node
/**
 * Apply source-correspondence repairs where the local text has visible
 * placeholder boxes and the upstream span is otherwise the same text.
 *
 * This does not translate. It preserves existing English translations and only
 * changes source text after apply-source-correspondence validates the item.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  normalizePunctuation,
  normalizeWhitespace,
  variantText,
} from './source-variant-utils.mjs';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const DEFAULT_REVIEWER = 'apply-placeholder-source-corrections';
const PLACEHOLDER = '\uFFFC';
const PLACEHOLDER_RE = /□|［\s*］|\[\s*\]|B[0-9A-F]{3,4}/giu;
const RAW_SOURCE_MARKUP_RE = /\|\||!!|\b(?:class|style|rowspan|colspan|valign|align|width|height)\s*=|\{\||\|\}|<!--|[{}｛｝]|^\s*[*#:]+/iu;
const ALLOWED_TYPES = new Set(['text_discrepancy_candidate', 'source_replacement_candidate']);

function usage() {
  console.error(`Usage:
  node scripts/apply-placeholder-source-corrections.mjs [--apply|--source-dry-run]
    [--book BOOK] [--chapter CHAPTER] [--queue PATH] [--limit N]
    [--reviewer NAME]

Dry-run by default. --source-dry-run validates candidates through
apply-source-correspondence without writing. --apply applies validated
source edits and marks queue items applied.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    sourceDryRun: false,
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
    if (arg === '--source-dry-run') {
      opts.sourceDryRun = true;
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

  if (opts.apply && opts.sourceDryRun) throw new Error('Use either --apply or --source-dry-run, not both.');
  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Infinity;
  return opts;
}

function queueFiles(opts) {
  const files = opts.queues.length > 0
    ? opts.queues.map((queue) => path.resolve(queue))
    : fs.readdirSync(QUALITY_DIR)
      .filter((entry) => QUEUE_RE.test(entry))
      .map((entry) => path.join(QUALITY_DIR, entry))
      .filter((file) => {
        if (opts.books.size === 0) return true;
        const base = path.basename(file);
        return [...opts.books].some((book) => base.includes(`-${book}.json`) || base.includes(`-${book}-`));
      })
      .sort();
  return files;
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

function wildcardKey(text) {
  const marked = String(text || '').replace(PLACEHOLDER_RE, PLACEHOLDER);
  let out = '';
  for (const char of variantText(normalizePunctuation(normalizeWhitespace(marked)).normalize('NFKC'))) {
    if (char === PLACEHOLDER || /[\p{Script=Han}0-9]/u.test(char)) out += char;
  }
  return out;
}

function sourceKey(text) {
  let out = '';
  for (const char of variantText(normalizePunctuation(normalizeWhitespace(text)).normalize('NFKC'))) {
    if (/[\p{Script=Han}0-9]/u.test(char)) out += char;
  }
  return out;
}

function escapeRegex(text) {
  return String(text).replace(/[\\^$.*+?()[\]{}|]/gu, '\\$&');
}

function placeholderMatch(localText, sourceText) {
  PLACEHOLDER_RE.lastIndex = 0;
  if (!PLACEHOLDER_RE.test(localText)) return false;
  PLACEHOLDER_RE.lastIndex = 0;

  const local = wildcardKey(localText);
  const source = sourceKey(sourceText);
  const placeholderCount = [...local].filter((char) => char === PLACEHOLDER).length;
  if (placeholderCount === 0) return false;

  const fixedLength = local.length - placeholderCount;
  const delta = source.length - fixedLength;
  if (delta < placeholderCount || delta > placeholderCount * 3) return false;

  const parts = local.split(PLACEHOLDER).map(escapeRegex);
  const pattern = `^${parts.join('([\\p{Script=Han}0-9]{1,3})')}$`;
  const match = source.match(new RegExp(pattern, 'u'));
  if (!match) return false;

  return match.slice(1).every((capture) => capture && !/[□\uFFFC]/u.test(capture));
}

function findCandidates(opts) {
  const candidates = [];
  for (const queuePath of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    for (const item of queue.items || []) {
      if (candidates.length >= opts.limit) return candidates;
      if (statusOf(item) !== 'pending') continue;
      if (!ALLOWED_TYPES.has(item.type || '')) continue;
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      if (opts.chapters.size > 0 && !opts.chapters.has(String(item.chapter || '').padStart(3, '0'))) continue;
      const source = String(item.sourceRange?.text || '');
      const local = String(item.localRange?.text || '');
      if (!source || !local) continue;
      if (RAW_SOURCE_MARKUP_RE.test(source)) continue;
      if (!Array.isArray(item.localRange?.ids) || item.localRange.ids.length === 0) continue;
      if (!placeholderMatch(local, source)) continue;
      candidates.push({ queuePath, item, source, local });
    }
  }
  return candidates;
}

function runApply(queuePath, ids, opts, dryRun) {
  const args = [
    'scripts/apply-source-correspondence.mjs',
    '--queue',
    queuePath,
    '--approve',
    ids.join(','),
    '--item',
    ids.join(','),
    '--reviewer',
    opts.reviewer,
    '--preserve-existing-translations',
  ];
  if (dryRun) args.push('--dry-run');
  const result = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status !== 0) {
    return {
      ok: false,
      error: result.stderr || result.stdout,
    };
  }
  return {
    ok: true,
    report: JSON.parse(result.stdout),
  };
}

function validateIndividually(candidates, opts) {
  const passed = [];
  const failed = [];
  for (const candidate of candidates) {
    const result = runApply(candidate.queuePath, [candidate.item.id], opts, true);
    if (result.ok) passed.push(candidate);
    else failed.push({
      id: candidate.item.id,
      chapter: `${candidate.item.book}/${String(candidate.item.chapter || '').padStart(3, '0')}`,
      error: result.error.split('\n').slice(0, 5).join('\n'),
    });
  }
  return { passed, failed };
}

function applyCandidates(candidates, opts, dryRun) {
  const byQueue = new Map();
  for (const candidate of candidates) {
    const bucket = byQueue.get(candidate.queuePath) || [];
    bucket.push(candidate.item.id);
    byQueue.set(candidate.queuePath, bucket);
  }

  const reports = [];
  for (const [queuePath, ids] of byQueue.entries()) {
    const result = runApply(queuePath, ids, opts, dryRun);
    if (!result.ok) throw new Error(`apply-source-correspondence failed for ${queuePath}\n${result.error}`);
    reports.push({
      queue: path.relative(process.cwd(), queuePath),
      ids: ids.length,
      appliedItems: result.report.queues?.[0]?.appliedItems || 0,
      dryRun,
    });
  }
  return reports;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const candidates = findCandidates(opts);
  const validation = (opts.apply || opts.sourceDryRun)
    ? validateIndividually(candidates, opts)
    : { passed: candidates, failed: [] };

  const summary = {
    apply: opts.apply,
    sourceDryRun: opts.sourceDryRun,
    candidates: candidates.length,
    validated: validation.passed.length,
    failedValidation: validation.failed.length,
    byBook: {},
    byQueue: {},
    samples: [],
    failures: validation.failed.slice(0, 20),
    applyReports: [],
  };

  for (const candidate of validation.passed) {
    const chapter = `${candidate.item.book}/${String(candidate.item.chapter || '').padStart(3, '0')}`;
    summary.byBook[candidate.item.book] = (summary.byBook[candidate.item.book] || 0) + 1;
    const queue = path.relative(process.cwd(), candidate.queuePath);
    summary.byQueue[queue] = (summary.byQueue[queue] || 0) + 1;
    if (summary.samples.length < 40) {
      summary.samples.push({
        id: candidate.item.id,
        chapter,
        type: candidate.item.type,
        source: candidate.source.slice(0, 160),
        local: candidate.local.slice(0, 160),
      });
    }
  }

  if (opts.apply || opts.sourceDryRun) {
    summary.applyReports = applyCandidates(validation.passed, opts, opts.sourceDryRun);
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
