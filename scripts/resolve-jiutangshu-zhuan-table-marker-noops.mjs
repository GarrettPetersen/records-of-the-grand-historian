#!/usr/bin/env node
/**
 * Close Old Tang geography source-correspondence items caused only by
 * Wikisource table-cell marker residue.
 *
 * Some Old Tang geography rows scrape with "專|" markers from the Wikisource
 * table layout. This resolver is intentionally narrow: it only marks queue
 * items as no-ops when source and local text have the same Han/digit stream
 * after removing those markers and punctuation.
 */

import fs from 'node:fs';
import path from 'node:path';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const DEFAULT_REVIEWER = 'resolve-jiutangshu-zhuan-table-marker-noops';
const NOTE = 'Reviewed as no-op: Wikisource source span differs only by Old Tang geography table marker residue ("專|") and punctuation; local corpus text retained.';

function usage() {
  console.error(`Usage: node scripts/resolve-jiutangshu-zhuan-table-marker-noops.mjs [--apply] [--chapter CH] [--queue PATH] [--limit N] [--sample-limit N] [--reviewer NAME]`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
    queues: [],
    limit: Number.POSITIVE_INFINITY,
    sampleLimit: 30,
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
      opts.books.add(String(argv[++index] || '').trim());
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.books.add(arg.slice('--book='.length).trim());
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
    if (arg === '--sample-limit') {
      opts.sampleLimit = Number(argv[++index]);
      continue;
    }
    if (arg.startsWith('--sample-limit=')) {
      opts.sampleLimit = Number(arg.slice('--sample-limit='.length));
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
    throw new Error(`Unknown option: ${arg}`);
  }

  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Number.POSITIVE_INFINITY;
  if (!Number.isFinite(opts.sampleLimit) || opts.sampleLimit < 0) opts.sampleLimit = 30;
  return opts;
}

function queueFiles(opts) {
  if (opts.books.size > 0 && !opts.books.has('jiutangshu')) return [];
  if (opts.queues.length > 0) return opts.queues.map((queue) => path.resolve(queue));
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => QUEUE_RE.test(entry))
    .filter((entry) => entry === 'source-correspondence-corpus-wikisource-jiutangshu.json')
    .map((entry) => path.join(QUALITY_DIR, entry))
    .sort();
}

function statusOf(item) {
  const status = String(item?.status || '').toLowerCase();
  const decision = String(item?.decision || '').toLowerCase();
  if (item?.appliedAt || ['applied', 'approved', 'denied', 'rejected'].includes(status)) return 'done';
  if (['included', 'applied', 'approved', 'denied', 'rejected'].includes(decision)) return 'done';
  return 'pending';
}

function compact(text) {
  return String(text || '').replace(/\s+/gu, '');
}

function markerlessKey(text) {
  return compact(text)
    .replace(/專\|/gu, '')
    .replace(/[^\p{Script=Han}0-9]/gu, '');
}

function short(text) {
  const value = compact(text);
  return value.length > 160 ? `${value.slice(0, 159)}...` : value;
}

function appendNote(existing, note) {
  const value = String(existing || '').trim();
  if (!value) return note;
  if (value.includes(note)) return value;
  return `${value}\n${note}`;
}

function isCandidate(item) {
  if (statusOf(item) !== 'pending') return false;
  if (item.book !== 'jiutangshu') return false;
  const source = compact(item.sourceRange?.text || '');
  const local = compact(item.localRange?.text || '');
  if (!source || !local || !source.includes('專|')) return false;
  const sourceKey = markerlessKey(source);
  const localKey = markerlessKey(local);
  return sourceKey.length > 0 && sourceKey === localKey;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const samples = [];
  const byChapter = {};
  const byType = {};
  let total = 0;
  let touchedQueueFiles = 0;

  for (const queueFile of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let changed = false;
    for (const item of queue.items || []) {
      if (total >= opts.limit) break;
      if (opts.chapters.size > 0 && !opts.chapters.has(String(item.chapter || '').padStart(3, '0'))) continue;
      if (!isCandidate(item)) continue;
      total += 1;
      byChapter[item.chapter] = (byChapter[item.chapter] || 0) + 1;
      byType[item.type] = (byType[item.type] || 0) + 1;
      if (samples.length < opts.sampleLimit) {
        samples.push({
          id: item.id,
          chapter: `${item.book}/${item.chapter}`,
          type: item.type,
          source: short(item.sourceRange?.text || ''),
          local: short(item.localRange?.text || ''),
        });
      }
      if (opts.apply) {
        item.status = 'denied';
        item.decision = 'rejected';
        item.reviewedBy = opts.reviewer;
        item.reviewedAt = now;
        item.resolution = 'noop-table-marker-residue';
        item.notes = appendNote(item.notes, NOTE);
        changed = true;
      }
    }
    if (opts.apply && changed) {
      fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`);
      touchedQueueFiles += 1;
    }
  }

  console.log(JSON.stringify({
    apply: opts.apply,
    total,
    touchedQueueFiles,
    byChapter,
    byType,
    samples,
  }, null, 2));
}

main();
