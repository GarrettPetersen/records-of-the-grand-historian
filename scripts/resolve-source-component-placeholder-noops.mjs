#!/usr/bin/env node
/**
 * Close source-correspondence items where the upstream witness uses split
 * component placeholders (for example 钅質) and the local corpus already has
 * the composed character (鑕).
 *
 * This is metadata-only: it never edits chapter text. It denies only queue
 * items where replacing non-conflicting source placeholders with the local
 * composed forms makes the two ranges match under the existing variant key.
 */

import fs from 'node:fs';
import path from 'node:path';
import { variantKey, variantText } from './repair-source-queue-patterns.mjs';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const DEFAULT_REVIEWER = 'resolve-source-component-placeholder-noops';
const COMPONENT_MARKER_RE = /氵|訁|钅|阝|糹|飠|饣|礻|衤|忄|扌|犭|艹|辶|疒|攵|彡/u;
const PUNCT_RE = /[\s\p{Punctuation}，。！？；：、「」『』（）〔〕【】《》〈〉]/u;
const BAD_COMPOSED_RE = /[A-Za-z0-9<>{}\[\]|=_]|[\uE000-\uF8FF]/u;

function usage() {
  console.error(`Usage:
  node scripts/resolve-source-component-placeholder-noops.mjs [--apply]
    [--book BOOK] [--chapter CHAPTER] [--queue PATH] [--limit N]
    [--reviewer NAME]

Dry-run by default. With --apply, marks upstream component-placeholder witness
items denied when local composed glyphs already preserve the text.`);
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
  if (item.appliedAt || item.appliedSummary || status === 'applied' || decision === 'included' || decision === 'applied') return 'applied';
  if (status === 'denied' || status === 'rejected' || decision === 'denied' || decision === 'rejected') return 'denied';
  if (status === 'approved' || decision === 'approved') return 'approved';
  return 'pending';
}

function inScope(item, opts) {
  if (statusOf(item) !== 'pending') return false;
  if (opts.books.size > 0 && !opts.books.has(item.book)) return false;
  if (opts.chapters.size > 0 && !opts.chapters.has(item.chapter)) return false;
  return true;
}

function stripPunctuation(text) {
  return Array.from(String(text || '')).filter((char) => !PUNCT_RE.test(char));
}

function findComponentDiffs(placeholderText, composedText) {
  const placeholder = stripPunctuation(placeholderText);
  const composed = stripPunctuation(composedText);
  const diffs = [];
  let placeholderIndex = 0;
  let composedIndex = 0;

  while (placeholderIndex < placeholder.length && composedIndex < composed.length) {
    if (variantText(placeholder[placeholderIndex]) === variantText(composed[composedIndex])) {
      placeholderIndex += 1;
      composedIndex += 1;
      continue;
    }

    let matched = false;
    for (let placeholderLength = 1; placeholderLength <= 6 && placeholderIndex + placeholderLength <= placeholder.length; placeholderLength += 1) {
      const placeholderSegment = placeholder.slice(placeholderIndex, placeholderIndex + placeholderLength).join('');
      if (!COMPONENT_MARKER_RE.test(placeholderSegment)) continue;
      for (let composedLength = 1; composedLength <= 2 && composedIndex + composedLength <= composed.length; composedLength += 1) {
        const composedSegment = composed.slice(composedIndex, composedIndex + composedLength).join('');
        if (!composedSegment || BAD_COMPOSED_RE.test(composedSegment)) continue;
        const placeholderRemainder = placeholder.slice(placeholderIndex + placeholderLength).join('');
        const composedRemainder = composed.slice(composedIndex + composedLength).join('');
        if (variantText(placeholderRemainder) !== variantText(composedRemainder)) continue;
        diffs.push([placeholderSegment, composedSegment]);
        placeholderIndex += placeholderLength;
        composedIndex += composedLength;
        matched = true;
        break;
      }
      if (matched) break;
    }
    if (!matched) return null;
  }

  if (placeholderIndex !== placeholder.length || composedIndex !== composed.length) return null;
  return diffs.length > 0 ? diffs : null;
}

function collectMappings(queuePaths, opts) {
  const candidates = new Map();
  const conflicts = new Map();
  const samples = [];

  for (const queuePath of queuePaths) {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    for (const item of queue.items || []) {
      if (!inScope(item, opts)) continue;
      const sourceText = item.sourceRange?.text || '';
      const localText = item.localRange?.text || '';
      if (!COMPONENT_MARKER_RE.test(sourceText)) continue;
      const diffs = findComponentDiffs(sourceText, localText);
      if (!diffs) continue;
      for (const [sourceSegment, localSegment] of diffs) {
        if (!COMPONENT_MARKER_RE.test(sourceSegment)) continue;
        if (!candidates.has(sourceSegment)) {
          candidates.set(sourceSegment, {
            replacement: localSegment,
            count: 0,
            examples: [],
          });
        }
        const record = candidates.get(sourceSegment);
        if (record.replacement !== localSegment) {
          conflicts.set(sourceSegment, [...new Set([...(conflicts.get(sourceSegment) || []), record.replacement, localSegment])]);
          continue;
        }
        record.count += 1;
        if (record.examples.length < 3) {
          record.examples.push({ id: item.id, book: item.book, chapter: item.chapter });
        }
      }
      if (samples.length < 20) samples.push({ id: item.id, book: item.book, chapter: item.chapter, diffs });
    }
  }

  for (const conflict of conflicts.keys()) candidates.delete(conflict);
  return {
    mappings: [...candidates.entries()].sort((left, right) => right[1].count - left[1].count || left[0].localeCompare(right[0])),
    conflicts: Object.fromEntries(conflicts),
    samples,
  };
}

function applyMappingsToText(text, mappings) {
  let next = String(text || '');
  const replacements = [];
  for (const [sourceSegment, record] of mappings) {
    if (!next.includes(sourceSegment)) continue;
    next = next.split(sourceSegment).join(record.replacement);
    replacements.push(`${sourceSegment}->${record.replacement}`);
  }
  return { text: next, replacements };
}

function appendNote(notes, addition) {
  const current = String(notes || '').trim();
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function markDenied(item, now, reviewer, replacements) {
  item.status = 'denied';
  item.decision = 'denied';
  item.reviewedAt = item.reviewedAt || now;
  item.reviewer = item.reviewer || reviewer;
  item.deniedAt = item.deniedAt || now;
  item.deniedSummary = {
    mode: 'source-component-placeholder-noop',
    replacements: [...new Set(replacements)].sort(),
  };
  item.notes = appendNote(
    item.notes,
    'Denied upstream component-placeholder witness noise; local composed glyphs already preserve the source text.',
  );
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const queues = queueFiles(opts);
  const mappingInfo = collectMappings(queues, opts);
  const summary = {
    apply: opts.apply,
    mappingCount: mappingInfo.mappings.length,
    conflicts: mappingInfo.conflicts,
    resolved: 0,
    touchedQueueFiles: 0,
    byBook: {},
    samples: mappingInfo.samples,
  };

  for (const queuePath of queues) {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    let changedQueue = false;

    for (const item of queue.items || []) {
      if (summary.resolved >= opts.limit) continue;
      if (!inScope(item, opts)) continue;
      const sourceText = item.sourceRange?.text || '';
      const localText = item.localRange?.text || '';
      if (!COMPONENT_MARKER_RE.test(sourceText)) continue;
      const next = applyMappingsToText(sourceText, mappingInfo.mappings);
      if (next.replacements.length === 0) continue;
      if (variantKey(next.text) !== variantKey(localText)) continue;

      summary.resolved += 1;
      summary.byBook[item.book] = (summary.byBook[item.book] || 0) + 1;
      if (!opts.apply) continue;
      markDenied(item, now, opts.reviewer, next.replacements);
      changedQueue = true;
    }

    if (opts.apply && changedQueue) {
      queue.updatedAt = now;
      fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      summary.touchedQueueFiles += 1;
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
