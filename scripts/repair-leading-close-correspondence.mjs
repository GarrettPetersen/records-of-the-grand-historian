#!/usr/bin/env node
/**
 * Repair source-correspondence items where the upstream witness starts a span
 * with closing punctuation that belongs on the previous local unit.
 *
 * This handles the correspondence queue, not the source-artifacts queue. It is
 * deliberately narrow: the current local span must already match the upstream
 * span after removing the leading close mark and applying approved graph
 * variants. The script then appends the close mark to the previous source unit
 * and balances matching English quote/bracket punctuation when obvious.
 */

import fs from 'node:fs';
import path from 'node:path';
import { exactVariantKey } from './source-variant-utils.mjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const SOURCE_FIELDS = ['zh', 'source', 'content', 'text'];
const LEADING_CLOSE_RE = /^[」』”）)\]】〉》]+/u;
const TRAILING_CLOSE_RE = /[」』”）)\]】〉》]+$/u;
const DEFAULT_REVIEWER = 'repair-leading-close-correspondence';

const SOURCE_CLOSE_TO_ENGLISH_CLOSE = new Map([
  ['）', ')'],
  [')', ')'],
  [']', ']'],
  ['】', ']'],
  ['〉', '>'],
  ['》', '》'],
  ['」', '"'],
  ['』', '"'],
  ['”', '"'],
]);

const ENGLISH_OPEN_FOR_CLOSE = new Map([
  [')', '('],
  [']', '['],
  ['>', '<'],
  ['》', '《'],
  ['"', '"'],
]);

const SOURCE_CLOSE_GROUPS = [
  new Set(['」', '』', '”']),
  new Set(['）', ')']),
  new Set([']', '】']),
  new Set(['〉', '》']),
];

const SOURCE_OPEN_FOR_GROUP = new Map([
  ['」', new Set(['「', '『', '“'])],
  ['』', new Set(['「', '『', '“'])],
  ['”', new Set(['「', '『', '“'])],
  ['）', new Set(['（', '('])],
  [')', new Set(['（', '('])],
  [']', new Set(['[', '【'])],
  ['】', new Set(['[', '【'])],
  ['〉', new Set(['〈', '《'])],
  ['》', new Set(['〈', '《'])],
]);

function usage() {
  console.error(`Usage:
  node scripts/repair-leading-close-correspondence.mjs [--apply]
    [--book BOOK] [--chapter CHAPTER] [--queue PATH] [--limit N]
    [--reviewer NAME]

Dry-run by default. With --apply, edits chapter source/English punctuation and
marks matching source-correspondence items applied.`);
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
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(2);
    }
    opts.queues.push(arg);
  }

  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Infinity;
  return opts;
}

function queueFiles(opts) {
  if (opts.queues.length > 0) return opts.queues;
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

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string');
}

function sourceText(entry) {
  return String(entry?.unit?.[entry.field] || '');
}

function flattenUnits(chapter) {
  const units = [];
  for (let blockIndex = 0; blockIndex < (chapter.content || []).length; blockIndex += 1) {
    const block = chapter.content[blockIndex];
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (let unitIndex = 0; unitIndex < collection.length; unitIndex += 1) {
        const unit = collection[unitIndex];
        const field = sourceField(unit);
        if (!field) continue;
        units.push({
          unit,
          field,
          id: unit.id || '',
          blockIndex,
          blockType: block.type || '',
          collectionName,
          unitIndex,
        });
      }
    }
  }
  return units;
}

function loadChapter(file, cache) {
  if (!cache.has(file)) {
    const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
    const units = flattenUnits(chapter);
    cache.set(file, {
      chapter,
      units,
      byId: new Map(units.map((entry, index) => [entry.id, { ...entry, index }])),
      changed: false,
    });
  }
  return cache.get(file);
}

function itemFile(item) {
  return item.file || path.join(DATA_DIR, item.book, `${item.chapter}.json`);
}

function translationFields(item) {
  const fields = [];
  if (item?.translations?.[0]) {
    fields.push({ label: 'literal', owner: item.translations[0], key: 'literal' });
    fields.push({ label: 'idiomatic', owner: item.translations[0], key: 'idiomatic' });
  }
  for (const key of ['literal', 'idiomatic', 'translation']) {
    if (typeof item?.[key] === 'string') fields.push({ label: key, owner: item, key });
  }
  return fields.filter((field) => typeof field.owner[field.key] === 'string');
}

function fieldMap(item) {
  return new Map(translationFields(item).map((field) => [field.label, field]));
}

function countChar(text, char) {
  return [...String(text || '')].filter((item) => item === char).length;
}

function hasUnmatchedOpener(text, closeMark) {
  if (closeMark === '"') {
    const asciiQuotes = countChar(text, '"');
    const curlyOpen = countChar(text, '“');
    const curlyClose = countChar(text, '”');
    return asciiQuotes % 2 === 1 || curlyOpen > curlyClose;
  }

  const openMark = ENGLISH_OPEN_FOR_CLOSE.get(closeMark);
  if (!openMark) return false;
  return countChar(text, openMark) > countChar(text, closeMark);
}

function alreadyClosedEnglish(text, closeMark) {
  const trimmed = String(text || '').trimEnd();
  if (closeMark === '"') return /["”]\s*$/u.test(trimmed);
  return trimmed.endsWith(closeMark);
}

function appendEnglishClose(text, closeMark) {
  const original = String(text || '');
  const trailingSpace = original.match(/\s*$/u)?.[0] || '';
  const base = original.slice(0, original.length - trailingSpace.length);
  if (alreadyClosedEnglish(base, closeMark)) return original;
  return `${base}${closeMark}${trailingSpace}`;
}

function removeLeadingEnglishClose(text, closeMark) {
  const input = String(text || '');
  const leadingSpace = input.match(/^\s*/u)?.[0] || '';
  const body = input.slice(leadingSpace.length);
  if (closeMark === '"') {
    if (!/^["”]/u.test(body)) return null;
    return `${leadingSpace}${body.slice(1).trimStart()}`;
  }
  if (!body.startsWith(closeMark)) return null;
  return `${leadingSpace}${body.slice(closeMark.length).trimStart()}`;
}

function removeTrailingEnglishClose(text, closeMark) {
  const original = String(text || '');
  const trailingSpace = original.match(/\s*$/u)?.[0] || '';
  const base = original.slice(0, original.length - trailingSpace.length);
  if (closeMark === '"') {
    if (!/["”]$/u.test(base)) return null;
    const next = base.slice(0, -1);
    if (hasUnmatchedOpener(next, closeMark)) return null;
    return `${next}${trailingSpace}`;
  }
  if (!base.endsWith(closeMark)) return null;
  const next = base.slice(0, -closeMark.length);
  if (hasUnmatchedOpener(next, closeMark)) return null;
  return `${next}${trailingSpace}`;
}

function englishCloseMarks(sourcePunctuation) {
  const marks = new Set();
  for (const char of String(sourcePunctuation || '')) {
    const mark = SOURCE_CLOSE_TO_ENGLISH_CLOSE.get(char);
    if (mark) marks.add(mark);
  }
  return marks;
}

function repairEnglishPunctuation(previous, current, sourcePunctuation, { apply = false, removeCurrentClose = false } = {}) {
  const changes = [];
  const previousFields = fieldMap(previous.unit);
  const closeMarks = englishCloseMarks(sourcePunctuation);
  if (closeMarks.size === 0) return changes;

  for (const currentField of translationFields(current.unit)) {
    const previousField = previousFields.get(currentField.label);
    if (!previousField) continue;

    for (const closeMark of closeMarks) {
      const previousText = previousField.owner[previousField.key];
      const currentText = currentField.owner[currentField.key];
      const movedCurrent = removeLeadingEnglishClose(currentText, closeMark);

      if (movedCurrent !== null) {
        if (apply) {
          previousField.owner[previousField.key] = appendEnglishClose(previousText, closeMark);
          currentField.owner[currentField.key] = movedCurrent;
        }
        changes.push({ field: currentField.label, mode: 'move-leading-english-close', punctuation: closeMark });
        break;
      }

      if (!hasUnmatchedOpener(previousText, closeMark) || alreadyClosedEnglish(previousText, closeMark)) continue;
      if (apply) previousField.owner[previousField.key] = appendEnglishClose(previousText, closeMark);
      changes.push({ field: currentField.label, mode: 'close-previous-english', punctuation: closeMark });
      break;
    }
  }

  if (removeCurrentClose) {
    for (const currentField of translationFields(current.unit)) {
      for (const closeMark of closeMarks) {
        const currentText = currentField.owner[currentField.key];
        const next = removeTrailingEnglishClose(currentText, closeMark);
        if (next === null) continue;
        if (apply) currentField.owner[currentField.key] = next;
        changes.push({ field: currentField.label, mode: 'remove-duplicate-trailing-english-close', punctuation: closeMark });
        break;
      }
    }
  }

  return changes;
}

function appendNote(notes, addition) {
  const current = String(notes || '').trim();
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function stripTrailingClose(text) {
  return String(text || '').replace(TRAILING_CLOSE_RE, '');
}

function equivalentSourceCloses(closeMark) {
  for (const group of SOURCE_CLOSE_GROUPS) {
    if (group.has(closeMark)) return group;
  }
  return new Set([closeMark]);
}

function trailingEquivalentSourceClose(text, closeMark) {
  const trimmed = String(text || '').trimEnd();
  if (!trimmed) return '';
  const last = [...trimmed].at(-1);
  return equivalentSourceCloses(closeMark).has(last) ? last : '';
}

function endsWithEquivalentSourceClose(text, closeMark) {
  return Boolean(trailingEquivalentSourceClose(text, closeMark));
}

function hasUnmatchedSourceOpener(text, closeMark) {
  const opens = SOURCE_OPEN_FOR_GROUP.get(closeMark);
  if (!opens) return false;
  const closes = equivalentSourceCloses(closeMark);
  let openCount = 0;
  let closeCount = 0;
  for (const char of String(text || '')) {
    if (opens.has(char)) openCount += 1;
    if (closes.has(char)) closeCount += 1;
  }
  return openCount > closeCount;
}

function removeTrailingEquivalentSourceClose(text, closeMark) {
  const original = String(text || '');
  const trailingSpace = original.match(/\s*$/u)?.[0] || '';
  const base = original.slice(0, original.length - trailingSpace.length);
  const close = trailingEquivalentSourceClose(base, closeMark);
  if (!close) return null;
  const next = base.slice(0, -close.length);
  if (hasUnmatchedSourceOpener(next, close)) return null;
  return `${next}${trailingSpace}`;
}

function contextKey(text) {
  return exactVariantKey(stripTrailingClose(text));
}

function spanText(entries) {
  return entries.map(sourceText).join('');
}

function findCurrentSpan(item, chapter, targetText) {
  const targetKey = exactVariantKey(targetText);
  const expectedIds = item.localRange?.ids || [];
  const maxUnits = Math.max(6, expectedIds.length + 3);
  const beforeKeys = [
    item.context?.beforeLocal,
    item.context?.beforeSource,
  ].filter(Boolean).map(contextKey);
  const afterKeys = [
    item.context?.afterLocal,
    item.context?.afterSource,
  ].filter(Boolean).map(contextKey);

  const candidates = [];
  for (let start = 0; start < chapter.units.length; start += 1) {
    const entries = [];
    for (let end = start; end < chapter.units.length && end < start + maxUnits; end += 1) {
      entries.push(chapter.units[end]);
      const key = exactVariantKey(spanText(entries));
      if (key.length > targetKey.length + 20) break;
      if (key !== targetKey) continue;

      const previous = chapter.units[start - 1] || null;
      const next = chapter.units[end + 1] || null;
      let score = 0;
      if (previous && beforeKeys.length > 0 && beforeKeys.includes(contextKey(sourceText(previous)))) score += 2;
      if (next && afterKeys.length > 0 && afterKeys.includes(contextKey(sourceText(next)))) score += 2;
      if (expectedIds.length > 0 && entries.some((entry) => expectedIds.includes(entry.id))) score += 1;
      candidates.push({ entries, score });
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score || a.entries.length - b.entries.length);
  if (candidates[0].score <= 0) return null;
  if (candidates[1] && candidates[1].score === candidates[0].score) return null;
  return candidates[0].entries.map((entry) => chapter.byId.get(entry.id) || entry);
}

function currentEntriesFromIds(item, chapter, targetText) {
  const ids = item.localRange?.ids || [];
  if (ids.length === 0) return null;
  const entries = ids.map((id) => chapter.byId.get(id));
  if (entries.some((entry) => !entry)) return null;
  const currentLocal = spanText(entries);
  if (exactVariantKey(targetText) !== exactVariantKey(currentLocal)) return null;
  return entries;
}

function classifyRepair(item, chapterCache) {
  if (statusOf(item) !== 'pending') return null;
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!source || !local) return null;
  const match = source.match(LEADING_CLOSE_RE);
  if (!match) return null;

  const ids = item.localRange?.ids || [];
  if (ids.length === 0) return null;
  const file = itemFile(item);
  if (!fs.existsSync(file)) return null;

  const chapter = loadChapter(file, chapterCache);
  const sourceBody = source.slice(match[0].length);
  if (exactVariantKey(sourceBody) !== exactVariantKey(local)) return null;

  let entries = currentEntriesFromIds(item, chapter, sourceBody);
  let relocated = false;
  if (!entries) {
    entries = findCurrentSpan(item, chapter, sourceBody);
    relocated = Boolean(entries);
  }
  if (!entries) return null;

  const currentLocal = spanText(entries);

  const first = entries[0];
  const last = entries[entries.length - 1];
  const previous = chapter.units[first.index - 1];
  if (!previous || !sourceText(previous)) return null;
  const previousSource = sourceText(previous);
  const alreadyRepaired = endsWithEquivalentSourceClose(previousSource, match[0]);
  if (!alreadyRepaired && TRAILING_CLOSE_RE.test(previousSource)) return null;
  const removeCurrentClose = alreadyRepaired
    && !endsWithEquivalentSourceClose(sourceBody, match[0])
    && removeTrailingEquivalentSourceClose(currentLocal, match[0]) !== null;

  return {
    file,
    chapter,
    previous,
    current: first,
    currentCloseTarget: last,
    ids: entries.map((entry) => entry.id),
    leadingClose: match[0],
    sourceBody,
    currentLocal,
    alreadyRepaired,
    removeCurrentClose,
    relocated,
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const chapterCache = new Map();
  const summary = {
    apply: opts.apply,
    repaired: 0,
    sourceEdits: 0,
    englishEdits: 0,
    alreadyRepaired: 0,
    relocated: 0,
    touchedChapters: 0,
    touchedQueues: 0,
    byBook: {},
    byPunctuation: {},
    samples: [],
  };

  for (const queueFile of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let queueChanged = false;

    for (const item of queue.items || []) {
      if (summary.repaired >= opts.limit) break;
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      if (opts.chapters.size > 0 && !opts.chapters.has(item.chapter)) continue;
      const repair = classifyRepair(item, chapterCache);
      if (!repair) continue;

      summary.repaired += 1;
      if (repair.alreadyRepaired) summary.alreadyRepaired += 1;
      else summary.sourceEdits += 1;
      if (repair.removeCurrentClose) summary.sourceEdits += 1;
      if (repair.relocated) summary.relocated += 1;
      summary.byBook[item.book] = (summary.byBook[item.book] || 0) + 1;
      summary.byPunctuation[repair.leadingClose] = (summary.byPunctuation[repair.leadingClose] || 0) + 1;

      const englishChanges = repairEnglishPunctuation(repair.previous, repair.current, repair.leadingClose, {
        apply: opts.apply,
        removeCurrentClose: repair.removeCurrentClose,
      });
      summary.englishEdits += englishChanges.length;

      if (summary.samples.length < 20) {
        summary.samples.push({
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          leadingClose: repair.leadingClose,
          previousId: repair.previous.id,
          currentId: repair.current.id,
          alreadyRepaired: repair.alreadyRepaired,
          removeCurrentClose: repair.removeCurrentClose,
          relocated: repair.relocated,
          englishChanges,
        });
      }

      if (!opts.apply) {
        continue;
      }

      if (!repair.alreadyRepaired) {
        repair.previous.unit[repair.previous.field] = `${sourceText(repair.previous)}${repair.leadingClose}`;
        repair.chapter.changed = true;
      }
      if (repair.removeCurrentClose) {
        const next = removeTrailingEquivalentSourceClose(sourceText(repair.currentCloseTarget), repair.leadingClose);
        if (next !== null) {
          repair.currentCloseTarget.unit[repair.currentCloseTarget.field] = next;
          repair.chapter.changed = true;
        }
      }
      if (englishChanges.length > 0) repair.chapter.changed = true;

      item.status = 'applied';
      item.decision = 'included';
      item.reviewedAt = item.reviewedAt || now;
      item.reviewer = item.reviewer || opts.reviewer;
      item.appliedAt = now;
      item.appliedSummary = {
        mode: 'moved-leading-close-to-previous-local-unit',
        leadingClose: repair.leadingClose,
        previousId: repair.previous.id,
        localIds: repair.ids,
        alreadyRepaired: repair.alreadyRepaired,
        removeCurrentClose: repair.removeCurrentClose,
        relocated: repair.relocated,
        englishChanges,
      };
      item.notes = appendNote(
        item.notes,
        'Moved upstream-leading closing punctuation to the previous local sentence; current local span already matched the upstream body after approved graph variants.',
      );
      queueChanged = true;
    }

    if (opts.apply && queueChanged) {
      queue.updatedAt = now;
      fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      summary.touchedQueues += 1;
    }
  }

  if (opts.apply) {
    for (const [file, chapter] of chapterCache) {
      if (!chapter.changed) continue;
      fs.writeFileSync(file, `${JSON.stringify(chapter.chapter, null, 2)}\n`, 'utf8');
      summary.touchedChapters += 1;
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
