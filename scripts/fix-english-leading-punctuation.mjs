#!/usr/bin/env node
/**
 * Move English sentence-leading attaching punctuation to the previous English
 * sentence/cell. This repairs artifacts such as:
 *
 *   previous.idiomatic = '... eastern suburb.'
 *   current.idiomatic  = '」 It also says ...'
 *
 * into:
 *
 *   previous.idiomatic = '... eastern suburb.」'
 *   current.idiomatic  = 'It also says ...'
 *
 * Dry-run by default. Pass --apply to write chapter files.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CHAPTER_RE = /^\d{3}\.json$/u;
const SOURCE_KEYS = ['zh', 'source', 'content', 'text'];
const OPENING_SOURCE_QUOTE_RE = /^[「『“‘]/u;
const LEADING_ATTACHING_RE = /^[\s\u00A0]*([,.;:!?]+|[)\]\}>〉》」』”]+|["”]\s+)/u;

function usage() {
  console.error(`Usage:
  node scripts/fix-english-leading-punctuation.mjs [--apply] [--book BOOK] [path ...]

Moves English sentence-leading attaching punctuation to the previous translated
source unit. Dry-run by default.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    book: null,
    inputs: [],
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
    if (CHAPTER_RE.test(path.basename(entry))) files.push(entry);
  };

  for (const input of inputs) enqueue(input);
  return [...new Set(files)].sort();
}

function sourceKey(item) {
  for (const key of SOURCE_KEYS) {
    if (typeof item?.[key] === 'string') return key;
  }
  return null;
}

function sourceText(item) {
  const key = sourceKey(item);
  return key ? String(item[key] || '') : '';
}

function collectUnits(data) {
  const units = [];
  for (const [blockIndex, block] of (data.content || []).entries()) {
    if (Array.isArray(block.sentences)) {
      for (const [index, item] of block.sentences.entries()) {
        if (sourceKey(item)) units.push({ item, blockIndex, blockType: block.type || '', index, id: item.id || '' });
      }
    }
    if (Array.isArray(block.cells)) {
      for (const [index, item] of block.cells.entries()) {
        if (sourceKey(item)) units.push({ item, blockIndex, blockType: block.type || '', index, id: item.id || '' });
      }
    }
  }
  return units;
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

function leadingMove(text, currentSource) {
  const source = String(currentSource || '').trimStart();
  const match = String(text || '').match(LEADING_ATTACHING_RE);
  if (!match) return null;

  let punctuation = match[1];
  let removeLength = match[0].length;

  if (/^["”]\s+$/u.test(punctuation)) {
    if (OPENING_SOURCE_QUOTE_RE.test(source)) return null;
    punctuation = punctuation.trim();
  }

  return { punctuation, removeLength };
}

function fixFile(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const units = collectUnits(data);
  const changes = [];
  const skipped = [];

  for (let pass = 0; pass < 20; pass += 1) {
    let passChanges = 0;

    for (let i = 1; i < units.length; i += 1) {
      const current = units[i];
      const previous = units[i - 1];
      const previousFields = fieldMap(previous.item);
      const currentSource = sourceText(current.item);

      for (const currentField of translationFields(current.item)) {
        const previousField = previousFields.get(currentField.label);
        const beforeCurrent = currentField.owner[currentField.key];
        const move = leadingMove(beforeCurrent, currentSource);
        if (!move) continue;

        const remainingCurrent = beforeCurrent.slice(move.removeLength).trimStart();
        const footnote = currentField.owner.footnote;
        if (!remainingCurrent && typeof footnote === 'string' && footnote.trim()) {
          currentField.owner.footnote = appendToFootnote(footnote, move.punctuation);
        } else if (!remainingCurrent && String(currentSource || '').trim()) {
          skipped.push({
            id: current.id,
            field: currentField.label,
            punctuation: move.punctuation,
            blockType: current.blockType,
            reason: 'would-empty-non-footnote-translation',
          });
          continue;
        } else if (previousField && String(previousField.owner[previousField.key] || '').trim()) {
          const beforePrevious = previousField.owner[previousField.key];
          previousField.owner[previousField.key] = appendToPrevious(beforePrevious, move.punctuation);
        }
        currentField.owner[currentField.key] = remainingCurrent;
        changes.push({
          id: current.id,
          previousId: previous.id,
          field: currentField.label,
          punctuation: move.punctuation,
          blockType: current.blockType,
        });
        passChanges += 1;
      }
    }

    if (passChanges === 0) break;
  }

  return { data, changes, skipped };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const files = chapterFiles(opts);
  let total = 0;
  let changedFiles = 0;
  let skippedCount = 0;
  const byPunctuation = new Map();
  const samples = [];
  const skippedSamples = [];

  for (const file of files) {
    const result = fixFile(file);
    skippedCount += result.skipped.length;
    for (const skipped of result.skipped) {
      if (skippedSamples.length < 20) skippedSamples.push({ file, ...skipped });
    }
    if (result.changes.length === 0) continue;
    total += result.changes.length;
    changedFiles += 1;
    for (const change of result.changes) {
      byPunctuation.set(change.punctuation, (byPunctuation.get(change.punctuation) || 0) + 1);
      if (samples.length < 30) samples.push({ file, ...change });
    }
    if (opts.apply) fs.writeFileSync(file, `${JSON.stringify(result.data, null, 2)}\n`, 'utf8');
  }

  console.log(`${opts.apply ? 'Moved' : 'Would move'} ${total} English leading punctuation fragment(s) in ${changedFiles}/${files.length} chapter file(s).`);
  for (const [punctuation, count] of [...byPunctuation.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 20)) {
    console.log(`${JSON.stringify(punctuation)}\t${count}`);
  }
  for (const sample of samples) {
    console.log(`${path.relative(process.cwd(), sample.file)}:${sample.id} ${sample.field} ${JSON.stringify(sample.punctuation)} -> ${sample.previousId}`);
  }
  if (skippedCount > 0) {
    console.log(`Skipped ${skippedCount} fragment(s) that would empty a non-footnote translation.`);
    for (const sample of skippedSamples) {
      console.log(`${path.relative(process.cwd(), sample.file)}:${sample.id} ${sample.field} ${JSON.stringify(sample.punctuation)} skipped ${sample.reason}`);
    }
  }
}

main();
