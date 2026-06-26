#!/usr/bin/env node
/**
 * Resolve tiny quote-boundary false omissions.
 *
 * Wikisource sometimes starts a following source span with a closing quote that
 * belongs to the previous sentence. Our local corpus keeps the closing quote on
 * the preceding sentence, so the body sentence is already present. This script
 * marks those queue items denied/no-op. It also removes the accidental duplicate
 * units created by the first dry-run-approved repair attempt for this exact set.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const DEFAULT_REVIEWER = 'resolve-tiny-quote-boundary-noops';

const NOOPS = [
  {
    id: 'source-jinshu-054-wikisource-159a00ee6fb3',
    book: 'jinshu',
    chapter: '054',
    accidentalId: 's0505',
    existingId: 's0131',
  },
  {
    id: 'source-sanguozhi-001-wikisource-2e60b7db0421',
    book: 'sanguozhi',
    chapter: '001',
    accidentalId: 's1489',
    existingId: 's0897',
  },
  {
    id: 'source-sanguozhi-007-wikisource-268fed175553',
    book: 'sanguozhi',
    chapter: '007',
    accidentalId: 's0476',
    existingId: 's0280',
  },
  {
    id: 'source-xintangshu-128-wikisource-5edffe28533c',
    book: 'xintangshu',
    chapter: '128',
    accidentalId: 's0343',
    existingId: 's0058',
  },
  {
    id: 'source-zizhitongjian-059-wikisource-593b99a3d2e6',
    book: 'zizhitongjian',
    chapter: '059',
    accidentalId: 's0524',
    existingId: 's0480',
  },
  {
    id: 'source-zizhitongjian-062-wikisource-ed297ea21bac',
    book: 'zizhitongjian',
    chapter: '062',
    accidentalId: 's0594',
    existingId: 's0247',
  },
  {
    id: 'source-zizhitongjian-245-wikisource-386529e72d46',
    book: 'zizhitongjian',
    chapter: '245',
    accidentalId: 's0571',
    existingId: 's0012',
  },
];

function usage() {
  console.error(`Usage:
  node scripts/resolve-tiny-quote-boundary-noops.mjs [--apply]
    [--reviewer NAME]

Dry-run by default. With --apply, removes accidental duplicate units for this
known set and marks their source-correspondence items denied/no-op.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
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

function sourceField(unit) {
  return ['zh', 'source', 'content', 'text'].find((field) => typeof unit?.[field] === 'string') || null;
}

function sourceText(unit) {
  const field = sourceField(unit);
  return field ? String(unit[field] || '') : '';
}

function walkCollections(chapter, visitor) {
  for (const block of chapter.content || []) {
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      visitor(collection);
    }
  }
}

function chapterPath(noop) {
  return path.join(DATA_DIR, noop.book, `${noop.chapter}.json`);
}

function loadChapter(noop) {
  const file = chapterPath(noop);
  return {
    file,
    chapter: JSON.parse(fs.readFileSync(file, 'utf8')),
  };
}

function unitById(chapter, id) {
  let found = null;
  walkCollections(chapter, (collection) => {
    for (const unit of collection) {
      if (unit.id === id) found = unit;
    }
  });
  return found;
}

function removeAccidentalUnit(noop, opts) {
  const { file, chapter } = loadChapter(noop);
  const existing = unitById(chapter, noop.existingId);
  if (!existing) throw new Error(`${noop.book}/${noop.chapter}: missing expected existing unit ${noop.existingId}`);

  let removed = 0;
  walkCollections(chapter, (collection) => {
    const index = collection.findIndex((unit) => unit.id === noop.accidentalId);
    if (index < 0) return;
    const accidental = collection[index];
    if (sourceText(accidental) !== sourceText(existing)) {
      throw new Error(`${noop.book}/${noop.chapter}: accidental unit ${noop.accidentalId} does not duplicate ${noop.existingId}`);
    }
    removed += 1;
    if (opts.apply) collection.splice(index, 1);
  });

  if (opts.apply && removed > 0) {
    fs.writeFileSync(file, `${JSON.stringify(chapter, null, 2)}\n`);
  }
  return { file: path.relative(process.cwd(), file), removed };
}

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (item.appliedAt || status === 'applied' || decision === 'applied' || decision === 'included') return 'applied';
  if (status === 'denied' || decision === 'denied' || decision === 'rejected') return 'denied';
  return 'pending';
}

function appendNote(existing, note) {
  const value = String(existing || '').trim();
  if (!value) return note;
  if (value.includes(note)) return value;
  return `${value}\n${note}`;
}

function expectedExistingText(item) {
  const sourceWithoutLeadingClose = String(item.sourceRange?.text || '').replace(/^[」』”）)\]】〉》]+/u, '');
  const followingClose = String(item.context?.afterSource || '').match(/^[」』”）)\]】〉》]+/u)?.[0] || '';
  return [sourceWithoutLeadingClose, `${sourceWithoutLeadingClose}${followingClose}`];
}

function resolveQueueItem(noop, opts, now) {
  const queueFile = path.join(QUALITY_DIR, `source-correspondence-corpus-wikisource-${noop.book}.json`);
  const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
  const item = (queue.items || []).find((candidate) => candidate.id === noop.id);
  if (!item) throw new Error(`${noop.id}: queue item not found`);

  const existing = unitById(loadChapter(noop).chapter, noop.existingId);
  if (!expectedExistingText(item).includes(sourceText(existing))) {
    throw new Error(`${noop.id}: existing local text does not match source after dropping leading close punctuation`);
  }

  const was = statusOf(item);
  if (opts.apply) {
    item.status = 'denied';
    item.decision = 'denied';
    item.reviewedAt = now;
    item.reviewer = opts.reviewer;
    item.notes = appendNote(
      item.notes,
      'Reviewed as no-op: source body sentence is already present locally; leading close punctuation belongs to the previous sentence.',
    );
    delete item.manualTranslations;
    fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`);
  }

  return {
    queue: path.relative(process.cwd(), queueFile),
    id: noop.id,
    previousStatus: was,
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const cleaned = [];
  const resolved = [];

  for (const noop of NOOPS) {
    cleaned.push({ id: noop.id, ...removeAccidentalUnit(noop, opts) });
    resolved.push(resolveQueueItem(noop, opts, now));
  }

  console.log(JSON.stringify({
    apply: opts.apply,
    cleaned,
    resolved,
  }, null, 2));
}

main();
