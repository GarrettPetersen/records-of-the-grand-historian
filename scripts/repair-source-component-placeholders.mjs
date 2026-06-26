#!/usr/bin/env node
/**
 * Repair source-side component placeholders such as 氵單 -> 潬.
 *
 * The mapping is derived from pending source-correspondence items and is only
 * used when the surrounding text proves the replacement under the project's
 * normal source comparator. Conflicting component spellings are skipped.
 */

import fs from 'node:fs';
import path from 'node:path';
import { variantKey, variantText } from './repair-source-queue-patterns.mjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const SOURCE_FIELDS = ['zh', 'source', 'content', 'text'];
const DEFAULT_REVIEWER = 'repair-source-component-placeholders';
const COMPONENT_MARKER_RE = /氵|訁|钅|阝|糹|飠|饣|礻|衤|忄|扌|犭|艹|辶|疒|攵|彡/u;
const COMPONENT_MARKER_GLOBAL_RE = /氵|訁|钅|阝|糹|飠|饣|礻|衤|忄|扌|犭|艹|辶|疒|攵|彡/gu;
const PUNCT_RE = /[\s\p{Punctuation}，。！？；：、「」『』（）〔〕【】《》〈〉]/u;
const BAD_SOURCE_RE = /[A-Za-z0-9<>{}\[\]|=_]|[\uE000-\uF8FF]/u;

function usage() {
  console.error(`Usage:
  node scripts/repair-source-component-placeholders.mjs [--apply]
    [--book BOOK] [--chapter CHAPTER] [--queue PATH] [--limit N]
    [--reviewer NAME] [--global]

Dry-run by default. With --apply, repairs proven component placeholders in
Chinese source fields and marks resolved source-correspondence items applied.
With --global, also applies queue-proven non-conflicting mappings to all source
fields in the selected corpus scope.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
    queues: [],
    limit: Infinity,
    reviewer: DEFAULT_REVIEWER,
    global: false,
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
    if (arg === '--global') {
      opts.global = true;
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

function isPendingInScope(item, opts) {
  if (statusOf(item) !== 'pending') return false;
  if (opts.books.size > 0 && !opts.books.has(item.book)) return false;
  if (opts.chapters.size > 0 && !opts.chapters.has(item.chapter)) return false;
  return true;
}

function isMappingEvidenceInScope(item, opts) {
  const status = statusOf(item);
  const isComponentRepair = item.appliedSummary?.mode === 'component-placeholder-source-repair';
  if (status !== 'pending' && !isComponentRepair) return false;
  if (opts.books.size > 0 && !opts.books.has(item.book)) return false;
  if (opts.chapters.size > 0 && !opts.chapters.has(item.chapter)) return false;
  return true;
}

function chapterPath(item) {
  return item.file || path.join('data', item.book, `${item.chapter}.json`);
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string');
}

function flattenUnits(chapter) {
  const units = [];
  for (let blockIndex = 0; blockIndex < (chapter.content || []).length; blockIndex += 1) {
    const block = chapter.content[blockIndex];
    for (const [collectionName, kind] of [['sentences', 'sentence'], ['cells', 'cell']]) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (let index = 0; index < collection.length; index += 1) {
        const unit = collection[index];
        const field = sourceField(unit);
        if (!field) continue;
        units.push({
          blockIndex,
          blockType: block.type || '',
          kind,
          index,
          id: unit.id || '',
          unit,
          field,
        });
      }
    }
  }
  return units;
}

const chapterCache = new Map();

function loadChapter(file) {
  const absolute = path.resolve(file);
  if (!chapterCache.has(absolute)) {
    const chapter = JSON.parse(fs.readFileSync(absolute, 'utf8'));
    const units = flattenUnits(chapter);
    chapterCache.set(absolute, {
      file: absolute,
      chapter,
      units,
      byId: new Map(units.map((entry) => [entry.id, entry])),
      changed: false,
    });
  }
  return chapterCache.get(absolute);
}

function stripPunctuation(text) {
  return Array.from(String(text || '')).filter((char) => !PUNCT_RE.test(char));
}

function findComponentDiffs(localText, sourceText) {
  const local = stripPunctuation(localText);
  const source = stripPunctuation(sourceText);
  const diffs = [];
  let localIndex = 0;
  let sourceIndex = 0;

  while (localIndex < local.length && sourceIndex < source.length) {
    if (variantText(local[localIndex]) === variantText(source[sourceIndex])) {
      localIndex += 1;
      sourceIndex += 1;
      continue;
    }

    let matched = false;
    for (let localLength = 1; localLength <= 6 && localIndex + localLength <= local.length; localLength += 1) {
      const localSegment = local.slice(localIndex, localIndex + localLength).join('');
      if (!COMPONENT_MARKER_RE.test(localSegment)) continue;
      for (let sourceLength = 1; sourceLength <= 2 && sourceIndex + sourceLength <= source.length; sourceLength += 1) {
        const sourceSegment = source.slice(sourceIndex, sourceIndex + sourceLength).join('');
        if (!sourceSegment || BAD_SOURCE_RE.test(sourceSegment)) continue;
        const localRemainder = local.slice(localIndex + localLength).join('');
        const sourceRemainder = source.slice(sourceIndex + sourceLength).join('');
        if (variantText(localRemainder) !== variantText(sourceRemainder)) continue;
        diffs.push([localSegment, sourceSegment]);
        localIndex += localLength;
        sourceIndex += sourceLength;
        matched = true;
        break;
      }
      if (matched) break;
    }
    if (!matched) return null;
  }

  if (localIndex !== local.length || sourceIndex !== source.length) return null;
  return diffs.length > 0 ? diffs : null;
}

function collectMappings(queuePaths, opts) {
  const candidates = new Map();
  const conflicts = new Map();
  const samples = [];

  for (const queuePath of queuePaths) {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    for (const item of queue.items || []) {
      if (!isMappingEvidenceInScope(item, opts)) continue;
      const localText = item.localRange?.text || '';
      if (!COMPONENT_MARKER_RE.test(localText)) continue;
      const diffs = findComponentDiffs(localText, item.sourceRange?.text || '');
      if (!diffs) continue;
      for (const [localSegment, sourceSegment] of diffs) {
        if (!COMPONENT_MARKER_RE.test(localSegment)) continue;
        if (!candidates.has(localSegment)) {
          candidates.set(localSegment, {
            source: sourceSegment,
            count: 0,
            examples: [],
          });
        }
        const record = candidates.get(localSegment);
        if (record.source !== sourceSegment) {
          conflicts.set(localSegment, [...new Set([...(conflicts.get(localSegment) || []), record.source, sourceSegment])]);
          continue;
        }
        record.count += 1;
        if (record.examples.length < 3) {
          record.examples.push({
            id: item.id,
            book: item.book,
            chapter: item.chapter,
          });
        }
      }
      if (samples.length < 20) {
        samples.push({
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          diffs,
        });
      }
    }
  }

  for (const conflict of conflicts.keys()) candidates.delete(conflict);

  return {
    mappings: [...candidates.entries()]
      .filter(([localSegment, record]) => localSegment !== record.source)
      .sort((left, right) => right[1].count - left[1].count || left[0].localeCompare(right[0])),
    conflicts: Object.fromEntries(conflicts),
    samples,
  };
}

function applyMappingsToText(text, mappings) {
  let next = String(text || '');
  const replacements = [];
  for (const [localSegment, record] of mappings) {
    if (!next.includes(localSegment)) continue;
    next = next.split(localSegment).join(record.source);
    replacements.push(`${localSegment}->${record.source}`);
  }
  return { text: next, replacements };
}

function chapterFilesInScope(opts) {
  const files = [];
  const books = fs.readdirSync(DATA_DIR)
    .filter((entry) => !entry.startsWith('.') && fs.existsSync(path.join(DATA_DIR, entry)))
    .filter((entry) => fs.statSync(path.join(DATA_DIR, entry)).isDirectory())
    .filter((entry) => opts.books.size === 0 || opts.books.has(entry))
    .sort();

  for (const book of books) {
    const dir = path.join(DATA_DIR, book);
    for (const entry of fs.readdirSync(dir).sort()) {
      if (!/^\d{3}\.json$/u.test(entry)) continue;
      const chapter = entry.replace(/\.json$/u, '');
      if (opts.chapters.size > 0 && !opts.chapters.has(chapter)) continue;
      files.push(path.join(dir, entry));
    }
  }
  return files;
}

function applyGlobalRepairs(mappings, opts) {
  const summary = {
    unitsChanged: 0,
    touchedChapterFiles: 0,
  };
  for (const file of chapterFilesInScope(opts)) {
    const record = loadChapter(file);
    let changed = false;
    for (const entry of record.units) {
      const current = String(entry.unit[entry.field] || '');
      if (!COMPONENT_MARKER_RE.test(current)) continue;
      const next = applyMappingsToText(current, mappings);
      if (next.text === current) continue;
      entry.unit[entry.field] = next.text;
      changed = true;
      record.changed = true;
      summary.unitsChanged += 1;
    }
    if (opts.apply && changed) {
      fs.writeFileSync(record.file, `${JSON.stringify(record.chapter, null, 2)}\n`, 'utf8');
      summary.touchedChapterFiles += 1;
      record.changed = false;
    }
  }
  return summary;
}

function liveRangeEntries(item) {
  const file = chapterPath(item);
  if (!fs.existsSync(file)) return null;
  const record = loadChapter(file);
  const entries = [];
  for (const id of item.localRange?.ids || []) {
    const entry = record.byId.get(id);
    if (!entry) return null;
    entries.push(entry);
  }
  return { record, entries };
}

function markApplied(item, now, reviewer, replacements) {
  item.status = 'applied';
  item.decision = 'included';
  item.reviewedAt = item.reviewedAt || now;
  item.reviewer = item.reviewer || reviewer;
  item.appliedAt = now;
  item.appliedSummary = {
    mode: 'component-placeholder-source-repair',
    replacements: [...new Set(replacements)].sort(),
  };
  const note = 'Applied component-placeholder source repair; English translations retained because only source glyph composition changed.';
  item.notes = String(item.notes || '').includes(note)
    ? item.notes
    : `${String(item.notes || '').trim()}${item.notes ? '\n' : ''}${note}`;
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
    unitsChanged: 0,
    globalUnitsChanged: 0,
    queueItemsMarked: 0,
    touchedChapterFiles: 0,
    touchedQueueFiles: 0,
    byBook: {},
    samples: mappingInfo.samples,
  };

  if (opts.global) {
    const globalSummary = applyGlobalRepairs(mappingInfo.mappings, opts);
    summary.globalUnitsChanged = globalSummary.unitsChanged;
    summary.touchedChapterFiles += globalSummary.touchedChapterFiles;
  }

  for (const queuePath of queues) {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    let changedQueue = false;

    for (const item of queue.items || []) {
      if (summary.queueItemsMarked >= opts.limit) continue;
      if (!isPendingInScope(item, opts)) continue;
      const range = liveRangeEntries(item);
      if (!range) continue;

      const transformed = [];
      const replacements = [];
      let changedLiveText = false;
      for (const entry of range.entries) {
        const current = String(entry.unit[entry.field] || '');
        const next = applyMappingsToText(current, mappingInfo.mappings);
        transformed.push(next.text);
        replacements.push(...next.replacements);
        if (next.text !== current) changedLiveText = true;
      }
      if (!changedLiveText) continue;
      if (variantKey(transformed.join('')) !== variantKey(item.sourceRange?.text || '')) continue;

      summary.queueItemsMarked += 1;
      summary.byBook[item.book] = (summary.byBook[item.book] || 0) + 1;
      if (!opts.apply) continue;

      for (const entry of range.entries) {
        const current = String(entry.unit[entry.field] || '');
        const next = applyMappingsToText(current, mappingInfo.mappings);
        if (next.text === current) continue;
        entry.unit[entry.field] = next.text;
        range.record.changed = true;
        summary.unitsChanged += 1;
      }
      markApplied(item, now, opts.reviewer, replacements);
      changedQueue = true;
    }

    if (opts.apply && changedQueue) {
      queue.updatedAt = now;
      fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      summary.touchedQueueFiles += 1;
    }
  }

  if (opts.apply) {
    for (const record of chapterCache.values()) {
      if (!record.changed) continue;
      fs.writeFileSync(record.file, `${JSON.stringify(record.chapter, null, 2)}\n`, 'utf8');
      summary.touchedChapterFiles += 1;
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
