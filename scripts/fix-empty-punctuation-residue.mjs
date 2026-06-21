#!/usr/bin/env node
/**
 * Repair rows left empty after punctuation-only English fragments are moved
 * back to their proper sentence.
 *
 * Rules:
 * - footnote-only rows may have empty literal/idiomatic; make sure the footnote
 *   itself has terminal punctuation.
 * - source-empty residue rows may have empty literal/idiomatic; remove any
 *   punctuation-only display remnants.
 * - non-empty source rows need real English, so fill obvious editorial residue
 *   or copy the paired literal/idiomatic field when one survived.
 *
 * Dry-run by default. Pass --apply to write chapter files.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CHAPTER_RE = /^\d{3}\.json$/u;
const SOURCE_KEYS = ['zh', 'source', 'content', 'text'];
const CLOSING_AFTER_TERMINAL_RE = /[)"'\]〉》”』]+$/u;
const PUNCTUATION_ONLY_RE = /^[\s,.;:!?()[\]{}<>〈〉《》「」『』“”"'\-—–]*$/u;

function usage() {
  console.error(`Usage:
  node scripts/fix-empty-punctuation-residue.mjs [--apply] [--book BOOK] [path ...]

Repairs translation fields emptied by punctuation cleanup. Explicit paths may
be chapter files or directories. Use either --book or paths, not both.`);
}

function parseArgs(argv) {
  const opts = { apply: false, book: null, inputs: [] };
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

function sourceText(item) {
  for (const key of SOURCE_KEYS) {
    if (typeof item?.[key] === 'string') return item[key];
  }
  return '';
}

function englishTerminalForChinese(source) {
  let text = String(source || '').trim();
  text = text.replace(CLOSING_AFTER_TERMINAL_RE, '');
  const terminal = [...text].pop();
  if (terminal === '？') return '?';
  if (terminal === '！') return '!';
  if (terminal === '；') return ';';
  if (terminal === '：') return ':';
  if (terminal === '。' || terminal === '．') return '.';
  return '';
}

function appendTerminal(text, punctuation) {
  const terminal = String(punctuation || '');
  if (!terminal) return text;

  const original = String(text || '');
  const trailingSpace = original.match(/\s*$/u)?.[0] || '';
  const base = original.slice(0, original.length - trailingSpace.length);
  if (!base) return original;
  if (/[.!?;:][)"'\]〉》”』]*$/u.test(base)) return original;
  return `${base}${terminal}${trailingSpace}`;
}

function fallbackTranslation(source) {
  const text = String(source || '').trim();
  if (text === '字。') return 'character.';
  if (text === '也。') return 'It is so.';
  if (text === '者也。') return 'This is so.';
  if (text === '補。') return 'Supplemented.';
  if (text === '改。') return 'Emended.';
  if (text === '乎？') return 'Could it?';
  return '';
}

function units(data) {
  const out = [];
  for (const block of data.content || []) {
    for (const sentence of block.sentences || []) out.push(sentence);
    for (const cell of block.cells || []) out.push(cell);
  }
  return out;
}

function fixTranslation(item, translation) {
  const changes = [];
  const source = sourceText(item);
  const hasSource = Boolean(source.trim());
  const hasFootnote = Boolean(String(translation.footnote || '').trim());

  if (hasFootnote) {
    const terminal = englishTerminalForChinese(source);
    const before = translation.footnote;
    translation.footnote = appendTerminal(before, terminal);
    if (translation.footnote !== before) {
      changes.push({ kind: 'append-footnote-punctuation', id: item.id || '', field: 'footnote' });
    }
    return changes;
  }

  if (!hasSource) {
    for (const field of ['literal', 'idiomatic']) {
      if (typeof translation[field] === 'string' && PUNCTUATION_ONLY_RE.test(translation[field]) && translation[field] !== '') {
        translation[field] = '';
        changes.push({ kind: 'clear-source-empty-punctuation', id: item.id || '', field });
      }
    }
    return changes;
  }

  for (const field of ['literal', 'idiomatic']) {
    if (typeof translation[field] !== 'string' || translation[field].trim()) continue;
    const other = field === 'literal' ? 'idiomatic' : 'literal';
    const replacement = String(translation[other] || '').trim()
      ? translation[other]
      : fallbackTranslation(source);
    if (!replacement) {
      changes.push({ kind: 'unfilled-empty-main', id: item.id || '', field, source });
      continue;
    }
    translation[field] = replacement;
    changes.push({ kind: 'fill-empty-main', id: item.id || '', field });
  }

  return changes;
}

function fixFile(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const changes = [];
  for (const item of units(data)) {
    for (const translation of item.translations || []) {
      if (!translation || typeof translation !== 'object') continue;
      changes.push(...fixTranslation(item, translation));
    }
  }
  return { data, changes };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const files = chapterFiles(opts);
  let changedFiles = 0;
  let total = 0;
  const byKind = new Map();
  const samples = [];

  for (const file of files) {
    const result = fixFile(file);
    const changes = result.changes.filter((change) => change.kind !== 'unfilled-empty-main');
    const unfilled = result.changes.filter((change) => change.kind === 'unfilled-empty-main');
    if (changes.length > 0) {
      changedFiles += 1;
      total += changes.length;
      for (const change of changes) {
        byKind.set(change.kind, (byKind.get(change.kind) || 0) + 1);
        if (samples.length < 30) samples.push({ file, ...change });
      }
      if (opts.apply) fs.writeFileSync(file, `${JSON.stringify(result.data, null, 2)}\n`, 'utf8');
    }
    for (const change of unfilled) {
      byKind.set(change.kind, (byKind.get(change.kind) || 0) + 1);
      if (samples.length < 30) samples.push({ file, ...change });
    }
  }

  console.log(`${opts.apply ? 'Repaired' : 'Would repair'} ${total} empty punctuation residue item(s) in ${changedFiles}/${files.length} chapter file(s).`);
  for (const [kind, count] of [...byKind.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
    console.log(`${kind}\t${count}`);
  }
  for (const sample of samples) {
    const source = sample.source ? ` source=${JSON.stringify(sample.source)}` : '';
    console.log(`${path.relative(process.cwd(), sample.file)}:${sample.id} ${sample.kind} ${sample.field}${source}`);
  }
  if (byKind.has('unfilled-empty-main')) process.exitCode = 1;
}

main();
