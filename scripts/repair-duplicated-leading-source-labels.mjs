#!/usr/bin/env node
/**
 * Repair chapter-opening source units where a scraped heading was duplicated
 * into the first source sentence, e.g. "德宗德宗神武..." or "河南道河南道，...".
 *
 * The Chinese repair removes one literal duplicated prefix. English is only
 * adjusted for obvious duplicated openings in the same unit. Matching pending
 * source-correspondence items are then marked applied.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const QUEUE_RE = /^source-correspondence.+\.json$/u;
const DEFAULT_REVIEWER = 'repair-duplicated-leading-source-labels';
const SOURCE_FIELDS = ['zh', 'source', 'content', 'text'];
const TOC_RE = /__(?:FORCE)?TOC__/gu;
const LEADING_DUP_RE = /^([\p{Script=Han}]{2,8})\1(?=[\p{Script=Han}，,])/u;

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    limit: Infinity,
    sampleLimit: 40,
    reviewer: DEFAULT_REVIEWER,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--book') {
      opts.books.add(argv[++i] || '');
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.books.add(arg.slice('--book='.length));
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

  for (const book of [...opts.books]) if (!book) opts.books.delete(book);
  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Infinity;
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

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string');
}

function firstSourceUnit(chapter) {
  for (const block of chapter.content || []) {
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (const unit of collection) {
        const field = sourceField(unit);
        if (field && String(unit[field] || '').trim()) return { unit, field };
      }
    }
  }
  return null;
}

function tokenKey(text) {
  let out = '';
  for (const char of String(text || '').replace(TOC_RE, '').normalize('NFKC')) {
    if (/[\p{Script=Han}0-9]/u.test(char)) out += char;
  }
  return out;
}

function cleanupEnglish(text) {
  let value = String(text || '');

  value = value
    .replace(/^([A-Z][A-Za-z' ]{2,40}) \(section\)\.\s+Emperor \1,/u, 'Emperor $1,')
    .replace(/^(Emperor [A-Z][A-Za-z' ]{2,40}),\s+\1\s+/u, '$1, ')
    .replace(/^([A-Z][A-Za-z' ]{2,40})\s+—\s+Emperor \1,/u, 'Emperor $1,')
    .replace(/^([A-Z][A-Za-z' ]{2,40})\s+—\s+\1,/u, '$1,')
    .replace(/^([A-Z][A-Za-z' ]{2,40}),\s+\1,/u, '$1,')
    .replace(/^([A-Z][A-Za-z' ]{2,40})—\1/u, '$1')
    .replace(/^([A-Z][A-Za-z' ]{2,40}):\s+\1\b/u, '$1')
    .replace(/^The ([A-Z][A-Za-z' ]+ Circuit),\s+(?:the\s+)?\1\s*[—-]\s*/iu, 'The $1 — ')
    .replace(/^([A-Z][A-Za-z' ]+ Circuit),\s+\1\s*[—-]\s*/iu, '$1 — ')
    .replace(/^The ([A-Z][A-Za-z' ]+ Circuit)[—-]\1[—-]/iu, 'The $1 — ')
    .replace(/^Lingnan Circuit:\s+Lingnan Circuit\b/u, 'Lingnan Circuit')
    .replace(/\s{2,}/gu, ' ');

  return value;
}

function repairTranslationUnit(unit) {
  let changed = false;
  for (const translation of unit.translations || []) {
    for (const field of ['literal', 'idiomatic']) {
      if (typeof translation[field] !== 'string') continue;
      const next = cleanupEnglish(translation[field]);
      if (next !== translation[field]) {
        translation[field] = next;
        changed = true;
      }
    }
  }
  return changed;
}

function chapterFiles(opts) {
  const books = fs.readdirSync(DATA_DIR)
    .filter((entry) => fs.statSync(path.join(DATA_DIR, entry)).isDirectory())
    .filter((entry) => entry !== 'quality')
    .filter((entry) => opts.books.size === 0 || opts.books.has(entry))
    .sort();

  const files = [];
  for (const book of books) {
    for (const entry of fs.readdirSync(path.join(DATA_DIR, book)).filter((candidate) => /^\d+\.json$/u.test(candidate)).sort()) {
      files.push(path.join(DATA_DIR, book, entry));
    }
  }
  return files;
}

function appendNote(notes, addition) {
  const current = String(notes || '').trim();
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function queueFiles() {
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => QUEUE_RE.test(entry))
    .map((entry) => path.join(QUALITY_DIR, entry))
    .sort();
}

function markMatchingQueueItems(repairs, opts, now, summary) {
  const byFile = new Map();
  for (const repair of repairs) {
    const key = path.resolve(repair.file);
    if (!byFile.has(key)) byFile.set(key, []);
    byFile.get(key).push(repair);
  }

  for (const queueFile of queueFiles()) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let changed = false;

    for (const item of queue.items || []) {
      if (statusOf(item) !== 'pending') continue;
      const file = path.resolve(item.file || path.join(DATA_DIR, item.book || '', `${String(item.chapter || '').padStart(3, '0')}.json`));
      const candidates = byFile.get(file);
      if (!candidates) continue;
      const ids = new Set(item.localRange?.ids || []);
      const sourceKey = tokenKey(item.sourceRange?.text || '');

      for (const repair of candidates) {
        if (!ids.has(repair.id)) continue;
        if (sourceKey !== repair.afterKey) continue;
        summary.queueItemsMarked += 1;
        summary.byQueue[path.relative(process.cwd(), queueFile)] = (summary.byQueue[path.relative(process.cwd(), queueFile)] || 0) + 1;
        if (opts.apply) {
          item.status = 'applied';
          item.decision = 'included';
          item.reviewedAt = item.reviewedAt || now;
          item.reviewer = item.reviewer || opts.reviewer;
          item.appliedAt = now;
          item.appliedSummary = {
            mode: 'duplicated-leading-source-label',
            id: repair.id,
            before: repair.before,
            after: repair.after,
          };
          item.notes = appendNote(
            item.notes,
            'Applied source repair: removed duplicated leading heading/name label from the local source unit; English opening deduplicated when needed.',
          );
          changed = true;
        }
        break;
      }
    }

    if (opts.apply && changed) {
      queue.updatedAt = now;
      fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      summary.touchedQueueFiles += 1;
    }
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const summary = {
    dryRun: !opts.apply,
    repairedUnits: 0,
    queueItemsMarked: 0,
    touchedChapterFiles: 0,
    touchedQueueFiles: 0,
    byBook: {},
    byQueue: {},
    samples: [],
  };
  const repairs = [];

  for (const file of chapterFiles(opts)) {
    if (summary.repairedUnits >= opts.limit) break;
    const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
    const entry = firstSourceUnit(chapter);
    if (!entry) continue;
    const before = String(entry.unit[entry.field] || '');
    const match = before.match(LEADING_DUP_RE);
    if (!match) continue;

    const after = before.replace(LEADING_DUP_RE, '$1');
    const translationChanged = repairTranslationUnit(entry.unit);
    entry.unit[entry.field] = after;

    const rel = path.relative(process.cwd(), file);
    const book = path.basename(path.dirname(file));
    const repair = {
      file,
      id: entry.unit.id || '',
      before,
      after,
      beforeKey: tokenKey(before),
      afterKey: tokenKey(after),
      duplicate: match[1],
      translationChanged,
    };
    repairs.push(repair);
    summary.repairedUnits += 1;
    summary.byBook[book] = (summary.byBook[book] || 0) + 1;
    if (summary.samples.length < opts.sampleLimit) {
      summary.samples.push({
        file: rel,
        id: repair.id,
        duplicate: repair.duplicate,
        before: before.slice(0, 120),
        after: after.slice(0, 120),
        translationChanged,
      });
    }

    if (opts.apply) {
      fs.writeFileSync(file, `${JSON.stringify(chapter, null, 2)}\n`, 'utf8');
      summary.touchedChapterFiles += 1;
    }
  }

  markMatchingQueueItems(repairs, opts, now, summary);
  console.log(JSON.stringify(summary, null, 2));
}

main();
