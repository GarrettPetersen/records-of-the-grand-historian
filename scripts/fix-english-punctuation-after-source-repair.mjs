#!/usr/bin/env node
/**
 * Reconcile English punctuation after source-leading punctuation has been
 * moved back to the previous source unit.
 *
 * The source repair queue tells us which unit originally began with attached
 * punctuation. This script uses those queue items to move matching English
 * leading punctuation back to the previous English field, and to close obvious
 * bracket/quote spans that were split by the same source artifact.
 *
 * Dry-run by default. Pass --apply to write chapter files.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DEFAULT_QUEUE = path.join(DATA_DIR, 'quality/source-artifacts-corpus.json');
const CHAPTER_RE = /^\d{3}\.json$/u;
const SOURCE_KEYS = ['zh', 'source', 'content', 'text'];
const QUEUE_RULE = 'SOURCE_LEADING_ATTACHED_PUNCTUATION';

const SOURCE_TO_ENGLISH_MARKS = new Map([
  ['，', [',']],
  ['、', [',']],
  ['。', ['.']],
  ['．', ['.']],
  ['；', [';']],
  ['：', [':']],
  ['！', ['!']],
  ['？', ['?']],
  ['）', [')']],
  [')', [')']],
  [']', [']']],
  ['】', [']', '】']],
  ['〉', ['〉', '>']],
  ['》', ['》']],
  ['」', ['"', '”']],
  ['』', ['"', '”', "'"]],
  ['”', ['"', '”']],
]);

const SOURCE_CLOSE_TO_ENGLISH_CLOSE = new Map([
  ['）', ')'],
  [')', ')'],
  [']', ']'],
  ['】', ']'],
  ['〉', '〉'],
  ['》', '》'],
  ['」', '"'],
  ['』', '"'],
  ['”', '"'],
]);

const ENGLISH_OPEN_FOR_CLOSE = new Map([
  [')', '('],
  [']', '['],
  ['〉', '〈'],
  ['》', '《'],
  ['"', '"'],
]);

function usage() {
  console.error(`Usage:
  node scripts/fix-english-punctuation-after-source-repair.mjs [--apply]
    [--book BOOK] [--queue PATH] [path ...]

Uses applied SOURCE_LEADING_ATTACHED_PUNCTUATION queue items to repair matching
English leading punctuation and obvious bracket/quote closures. Dry-run by
default.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    book: null,
    inputs: [],
    queue: DEFAULT_QUEUE,
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
      opts.book = argv[++i] || '';
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.book = arg.slice('--book='.length);
      continue;
    }
    if (arg === '--queue') {
      opts.queue = argv[++i] || '';
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queue = arg.slice('--queue='.length);
      continue;
    }
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(2);
    }
    opts.inputs.push(arg);
  }

  if (opts.book && opts.inputs.length > 0) {
    console.error('Use either --book or explicit paths, not both.');
    process.exit(2);
  }

  return opts;
}

function chapterFiles(opts) {
  const inputs = opts.inputs.length > 0
    ? opts.inputs
    : opts.book
      ? [path.join(DATA_DIR, opts.book)]
      : fs.readdirSync(DATA_DIR)
        .map((entry) => path.join(DATA_DIR, entry))
        .filter((entry) => fs.statSync(entry).isDirectory() && path.basename(entry) !== 'quality');

  const files = [];
  const enqueue = (entry) => {
    if (!fs.existsSync(entry)) return;
    const stat = fs.statSync(entry);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(entry).sort()) enqueue(path.join(entry, child));
      return;
    }
    if (CHAPTER_RE.test(path.basename(entry))) files.push(path.resolve(entry));
  };

  for (const input of inputs) enqueue(input);
  return new Set(files);
}

function sourceKey(item) {
  for (const key of SOURCE_KEYS) {
    if (typeof item?.[key] === 'string') return key;
  }
  return null;
}

function collectSourceUnits(data) {
  const units = [];
  for (const [blockIndex, block] of (data.content || []).entries()) {
    if (Array.isArray(block.sentences)) {
      for (const [index, item] of block.sentences.entries()) {
        const key = sourceKey(item);
        if (!key) continue;
        units.push({ item, key, blockIndex, blockType: block.type || '', index, id: item.id || '', path: `sentences.${index}.${key}` });
      }
    }
    if (Array.isArray(block.cells)) {
      for (const [index, item] of block.cells.entries()) {
        const key = sourceKey(item);
        if (!key) continue;
        units.push({ item, key, blockIndex, blockType: block.type || '', index, id: item.id || '', path: `cells.${index}.${key}` });
      }
    }
  }
  return units;
}

function previousSourceUnit(units, index) {
  for (let i = index - 1; i >= 0; i -= 1) {
    const unit = units[i];
    if (String(unit.item[unit.key] || '').length > 0) return unit;
  }
  return null;
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

function englishMarksForSource(sourcePunctuation) {
  const marks = new Set();
  for (const char of String(sourcePunctuation || '')) {
    for (const mark of SOURCE_TO_ENGLISH_MARKS.get(char) || []) marks.add(mark);
  }
  return marks;
}

function sourceCloseMarks(sourcePunctuation) {
  const marks = new Set();
  for (const char of String(sourcePunctuation || '')) {
    const mark = SOURCE_CLOSE_TO_ENGLISH_CLOSE.get(char);
    if (mark) marks.add(mark);
  }
  return marks;
}

function leadingMoveRun(text, allowedMarks) {
  const input = String(text || '');
  const leadingSpace = input.match(/^\s*/u)?.[0] || '';
  let run = '';
  for (const char of input.slice(leadingSpace.length)) {
    if (!allowedMarks.has(char)) break;
    run += char;
  }
  if (!run) return null;
  return {
    punctuation: run,
    removeLength: leadingSpace.length + run.length,
  };
}

function appendToPrevious(text, punctuation) {
  const original = String(text || '');
  const trailingSpace = original.match(/\s*$/u)?.[0] || '';
  let base = original.slice(0, original.length - trailingSpace.length);

  if (punctuation === ',' || punctuation === ';' || punctuation === ':') {
    base = base.replace(/[.!?]$/u, punctuation);
    if (base.endsWith(punctuation)) return `${base}${trailingSpace}`;
  }

  if (punctuation === '.' && /[.!?]$/u.test(base)) return `${base}${trailingSpace}`;
  return `${base}${punctuation}${trailingSpace}`;
}

function appendToFootnote(text, punctuation) {
  const original = String(text || '');
  const trailingSpace = original.match(/\s*$/u)?.[0] || '';
  const base = original.slice(0, original.length - trailingSpace.length);
  if (!base) return original;
  if (punctuation === '.' && /[.!?][)"'\]〉》”』]*$/u.test(base)) return original;
  return `${base}${punctuation}${trailingSpace}`;
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

function alreadyClosed(text, closeMark) {
  const trimmed = String(text || '').trimEnd();
  if (closeMark === '"') return /["”]\s*$/u.test(trimmed);
  return trimmed.endsWith(closeMark);
}

function trailingCloseToRemove(text, closeMark) {
  const input = String(text || '');
  if (closeMark === '"') {
    const match = input.match(/(["”])(\s*)$/u);
    if (!match) return null;
    const before = input.slice(0, match.index);
    const quoteCount = countChar(input, '"') + countChar(input, '”') + countChar(input, '“');
    if (quoteCount % 2 === 0) return null;
    return { before, removed: match[1], trailingSpace: match[2] || '' };
  }

  const escaped = closeMark.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${escaped})(\\s*)$`, 'u');
  const match = input.match(re);
  if (!match) return null;
  return {
    before: input.slice(0, match.index),
    removed: match[1],
    trailingSpace: match[2] || '',
  };
}

function fixPair({ current, previous, sourcePunctuation }) {
  const changes = [];
  const skipped = [];
  const allowedMarks = englishMarksForSource(sourcePunctuation);
  const closeMarks = sourceCloseMarks(sourcePunctuation);
  const previousFields = fieldMap(previous.item);
  const currentSource = String(current.item[current.key] || '').trimStart();

  for (const currentField of translationFields(current.item)) {
    const previousField = previousFields.get(currentField.label);
    if (!previousField) continue;

    const currentText = currentField.owner[currentField.key];
    const previousText = previousField.owner[previousField.key];
    const lead = leadingMoveRun(currentText, allowedMarks);
    if (lead) {
      const movingQuote = /["'”]/u.test(lead.punctuation);
      if (movingQuote && /^[「『“‘]/u.test(currentSource)) continue;

      const remainingCurrent = currentText.slice(lead.removeLength).trimStart();
      const footnote = currentField.owner.footnote;
      if (!remainingCurrent && typeof footnote === 'string' && footnote.trim()) {
        currentField.owner.footnote = appendToFootnote(footnote, lead.punctuation);
      } else if (!remainingCurrent && String(currentSource || '').trim()) {
        skipped.push({
          kind: 'skip-leading',
          field: currentField.label,
          punctuation: lead.punctuation,
          reason: 'would-empty-non-footnote-translation',
        });
        continue;
      } else {
        previousField.owner[previousField.key] = appendToPrevious(previousText, lead.punctuation);
      }
      currentField.owner[currentField.key] = remainingCurrent;
      changes.push({
        kind: 'move-leading',
        field: currentField.label,
        punctuation: lead.punctuation,
      });
      continue;
    }

    for (const closeMark of closeMarks) {
      const latestPrevious = previousField.owner[previousField.key];
      const latestCurrent = currentField.owner[currentField.key];
      if (!hasUnmatchedOpener(latestPrevious, closeMark) || alreadyClosed(latestPrevious, closeMark)) continue;

      previousField.owner[previousField.key] = appendToPrevious(latestPrevious, closeMark);
      const removal = trailingCloseToRemove(latestCurrent, closeMark);
      if (removal) {
        currentField.owner[currentField.key] = `${removal.before}${removal.trailingSpace}`;
      }
      changes.push({
        kind: removal ? 'move-trailing-close' : 'close-previous',
        field: currentField.label,
        punctuation: closeMark,
      });
      break;
    }
  }

  return { changes, skipped };
}

function relevantQueueHits(queue, files) {
  const hits = [...(queue?.hits || []), ...(queue?.resolvedHits || [])]
    .filter((item) => item.ruleId === QUEUE_RULE)
    .filter((item) => item.status === 'applied' || item.decision === 'included' || item.resolved === true)
    .filter((item) => item.file && item.sentenceId && item.found);

  const byFile = new Map();
  for (const hit of hits) {
    const file = path.resolve(hit.file);
    if (files.size > 0 && !files.has(file)) continue;
    if (!byFile.has(file)) byFile.set(file, []);
    byFile.get(file).push(hit);
  }
  return byFile;
}

function fixFile(file, hits) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const units = collectSourceUnits(data);
  const byId = new Map();
  for (const [index, unit] of units.entries()) {
    if (unit.id && !byId.has(unit.id)) byId.set(unit.id, index);
  }

  const changes = [];
  const skipped = [];
  for (const hit of hits) {
    const index = byId.get(hit.sentenceId);
    if (index === undefined) {
      skipped.push({ hit, reason: 'source unit not found' });
      continue;
    }
    const current = units[index];
    const previous = previousSourceUnit(units, index);
    if (!previous) {
      skipped.push({ hit, reason: 'no previous source unit' });
      continue;
    }

    const pairResult = fixPair({ current, previous, sourcePunctuation: hit.found });
    for (const skip of pairResult.skipped) {
      skipped.push({ hit, ...skip });
    }
    for (const change of pairResult.changes) {
      changes.push({
        file,
        sentenceId: hit.sentenceId,
        previousId: previous.id,
        sourcePunctuation: hit.found,
        ...change,
      });
    }
  }

  return { data, changes, skipped };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.queue || !fs.existsSync(opts.queue)) {
    console.error(`Queue not found: ${opts.queue}`);
    process.exit(2);
  }

  const files = chapterFiles(opts);
  const queue = JSON.parse(fs.readFileSync(opts.queue, 'utf8'));
  const hitsByFile = relevantQueueHits(queue, files);

  let changedFiles = 0;
  let totalChanges = 0;
  let skippedCount = 0;
  const byKind = new Map();
  const byPunctuation = new Map();
  const samples = [];

  for (const [file, hits] of [...hitsByFile.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const result = fixFile(file, hits);
    if (result.changes.length > 0) {
      changedFiles += 1;
      totalChanges += result.changes.length;
      for (const change of result.changes) {
        byKind.set(change.kind, (byKind.get(change.kind) || 0) + 1);
        byPunctuation.set(change.punctuation, (byPunctuation.get(change.punctuation) || 0) + 1);
        if (samples.length < 20) samples.push(change);
      }
      if (opts.apply) fs.writeFileSync(file, `${JSON.stringify(result.data, null, 2)}\n`, 'utf8');
    }
    skippedCount += result.skipped.length;
  }

  console.log(`${opts.apply ? 'Applied' : 'Would apply'} ${totalChanges} English punctuation repair(s) in ${changedFiles}/${hitsByFile.size} chapter file(s).`);
  for (const [kind, count] of [...byKind.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
    console.log(`${kind}\t${count}`);
  }
  for (const [punctuation, count] of [...byPunctuation.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 20)) {
    console.log(`${JSON.stringify(punctuation)}\t${count}`);
  }
  if (skippedCount > 0) console.log(`Skipped ${skippedCount} queue item(s).`);
  for (const sample of samples) {
    console.log(`${path.relative(process.cwd(), sample.file)}:${sample.sentenceId} ${sample.kind} ${sample.field} ${JSON.stringify(sample.punctuation)} -> ${sample.previousId}`);
  }
}

main();
