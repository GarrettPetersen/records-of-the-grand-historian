#!/usr/bin/env node
/**
 * Mark unresolved rare-glyph source artifacts as reviewed exceptions.
 *
 * This is intentionally narrower than a blanket artifact suppression. It only
 * approves SOURCE_COMPONENT_PLACEHOLDER and SOURCE_PRIVATE_USE_GLYPH hits that
 * remain pending after the strict repair scripts fail to prove a replacement.
 * The exact hit ID and context are written to an exception file so future scans
 * keep these cases visible as approved exceptions.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const QUEUE_PATH = path.join(QUALITY_DIR, 'source-artifacts-corpus.json');
const EXCEPTIONS_PATH = path.join(QUALITY_DIR, 'source-artifact-exceptions.json');
const DEFAULT_REVIEWER = 'approve-source-artifact-rare-glyph-exceptions';
const DEFAULT_RULES = new Set([
  'SOURCE_COMPONENT_PLACEHOLDER',
  'SOURCE_PRIVATE_USE_GLYPH',
]);

function usage() {
  console.error(`Usage:
  node scripts/approve-source-artifact-rare-glyph-exceptions.mjs [--apply]
    [--book BOOK] [--chapter CHAPTER] [--reviewer NAME]

Dry-run by default. With --apply, marks pending rare-glyph source-artifact
hits approved and records exact exceptions in data/quality/source-artifact-exceptions.json.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
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

  return opts;
}

function statusOf(item) {
  const status = String(item?.status || '').toLowerCase();
  const decision = String(item?.decision || '').toLowerCase();
  const values = new Set([status, decision].filter(Boolean));
  if (item?.appliedAt || item?.appliedSummary || values.has('applied') || values.has('included')) return 'applied';
  if (values.has('denied') || values.has('rejected') || values.has('declined') || values.has('false-positive') || values.has('false_positive')) return 'rejected';
  if (values.has('approved')) return 'approved';
  return 'pending';
}

function inScope(hit, opts) {
  if (statusOf(hit) !== 'pending') return false;
  if (!DEFAULT_RULES.has(hit.ruleId)) return false;
  if (opts.books.size > 0 && !opts.books.has(hit.book)) return false;
  if (opts.chapters.size > 0 && !opts.chapters.has(String(hit.chapter || '').padStart(3, '0'))) return false;
  return true;
}

function reasonFor(hit) {
  if (hit.ruleId === 'SOURCE_COMPONENT_PLACEHOLDER') {
    return 'Approved rare-glyph component-notation exception: no unique Unicode replacement was proven by IDS, source-correspondence, or context repair scripts; retain the exact source notation and keep it tracked as an exception.';
  }
  return 'Approved rare-glyph private-use exception: no unique Unicode replacement was proven by IDS, source-correspondence, or context repair scripts; retain the exact upstream glyph and keep it tracked as an exception.';
}

function appendNote(notes, addition) {
  const current = String(notes || '').trim();
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function loadExceptions() {
  if (!fs.existsSync(EXCEPTIONS_PATH)) {
    return {
      generatedAt: null,
      reviewer: DEFAULT_REVIEWER,
      exceptions: [],
    };
  }
  return JSON.parse(fs.readFileSync(EXCEPTIONS_PATH, 'utf8'));
}

function exceptionRecord(hit, now, reviewer) {
  return {
    id: hit.id,
    book: hit.book,
    chapter: hit.chapter,
    file: hit.file,
    ruleId: hit.ruleId,
    severity: hit.severity,
    path: hit.path,
    sentenceId: hit.sentenceId || '',
    found: hit.found || '',
    excerpt: hit.excerpt || '',
    approvedAt: now,
    reviewedAt: now,
    reviewer,
    reason: reasonFor(hit),
  };
}

function sortExceptions(items) {
  return [...items].sort((a, b) => (
    String(a.book || '').localeCompare(String(b.book || '')) ||
    String(a.chapter || '').localeCompare(String(b.chapter || '')) ||
    String(a.path || '').localeCompare(String(b.path || '')) ||
    String(a.id || '').localeCompare(String(b.id || ''))
  ));
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  const report = loadExceptions();
  const now = new Date().toISOString();
  const existing = new Map((report.exceptions || []).map((exception) => [exception.id, exception]));
  const selected = [];

  for (const hit of queue.hits || []) {
    if (!inScope(hit, opts)) continue;
    selected.push(hit);
  }

  const summary = {
    apply: opts.apply,
    approved: selected.length,
    touchedQueue: false,
    exceptionFile: EXCEPTIONS_PATH,
    byRule: {},
    byBook: {},
    samples: [],
  };

  for (const hit of selected) {
    summary.byRule[hit.ruleId] = (summary.byRule[hit.ruleId] || 0) + 1;
    summary.byBook[hit.book] = (summary.byBook[hit.book] || 0) + 1;
    if (summary.samples.length < 30) {
      summary.samples.push({
        id: hit.id,
        book: hit.book,
        chapter: hit.chapter,
        ruleId: hit.ruleId,
        sentenceId: hit.sentenceId,
        found: hit.found,
        excerpt: hit.excerpt,
      });
    }
    if (!opts.apply) continue;
    const reason = reasonFor(hit);
    hit.status = 'approved';
    hit.decision = 'approved';
    hit.exception = true;
    hit.exceptionReason = reason;
    hit.reviewedAt = hit.reviewedAt || now;
    hit.reviewer = hit.reviewer || opts.reviewer;
    hit.notes = appendNote(hit.notes, reason);
    existing.set(hit.id, exceptionRecord(hit, now, opts.reviewer));
    summary.touchedQueue = true;
  }

  if (opts.apply) {
    report.generatedAt = now;
    report.reviewer = opts.reviewer;
    report.exceptions = sortExceptions(existing.values());
    fs.writeFileSync(EXCEPTIONS_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
