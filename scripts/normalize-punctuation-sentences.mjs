#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const HAS_LETTER_OR_NUMBER_RE = /[\p{L}\p{N}]/u;
const CHAPTER_RE = /^\d{3}\.json$/u;
const OPENING_FRAGMENT_RE = /^[\s"'“‘({[<〈《「『（【〔]+$/u;

function usage() {
  console.error(`Usage:
  node scripts/normalize-punctuation-sentences.mjs [--book=<id>] [--apply] [path ...]

Folds punctuation-only paragraph sentence fragments into adjacent source
sentences. Opening punctuation attaches to the following sentence; closing
punctuation and separators attach to the previous sentence. Dry-run by default.`);
  process.exit(1);
}

function parseArgs(argv) {
  const opts = { apply: false, book: null, inputs: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') usage();
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--book') {
      opts.book = argv[++i];
      if (!opts.book) usage();
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.book = arg.slice('--book='.length);
      continue;
    }
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
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
        .map(entry => path.join(DATA_DIR, entry))
        .filter(entry => fs.statSync(entry).isDirectory() && path.basename(entry) !== 'quality');

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
  for (const key of ['zh', 'content', 'chinese', 'source']) {
    if (typeof item?.[key] === 'string') return key;
  }
  return null;
}

function sourceText(item) {
  const key = sourceKey(item);
  return key ? item[key].replace(/\s+/gu, ' ').trim() : '';
}

function isPunctuationOnlySentence(sentence) {
  const src = sourceText(sentence);
  return src.length > 0 && !HAS_LETTER_OR_NUMBER_RE.test(src);
}

function prependSource(sentence, prefix) {
  const key = sourceKey(sentence);
  if (!key) return false;
  sentence[key] = `${prefix}${sentence[key]}`;
  return true;
}

function appendSource(sentence, suffix) {
  const key = sourceKey(sentence);
  if (!key) return false;
  sentence[key] = `${sentence[key]}${suffix}`;
  return true;
}

function normalizeSentenceArray(sentences) {
  const normalized = [];
  const changes = [];
  let pendingPrefix = '';

  const applyPendingPrefix = (sentence) => {
    if (!pendingPrefix) return;
    prependSource(sentence, pendingPrefix);
    pendingPrefix = '';
  };

  for (const sentence of sentences) {
    if (!isPunctuationOnlySentence(sentence)) {
      applyPendingPrefix(sentence);
      normalized.push(sentence);
      continue;
    }

    const fragment = sourceText(sentence);
    const attachNext = OPENING_FRAGMENT_RE.test(fragment);
    if (attachNext) {
      pendingPrefix += fragment;
      changes.push({ id: sentence.id || '', fragment, direction: 'next' });
      continue;
    }

    if (normalized.length > 0) {
      appendSource(normalized[normalized.length - 1], fragment);
      changes.push({ id: sentence.id || '', fragment, direction: 'previous' });
      continue;
    }

    pendingPrefix += fragment;
    changes.push({ id: sentence.id || '', fragment, direction: 'next' });
  }

  if (pendingPrefix && normalized.length > 0) {
    appendSource(normalized[normalized.length - 1], pendingPrefix);
    pendingPrefix = '';
  }

  return { sentences: normalized, changes };
}

function normalizeFile(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const changes = [];

  for (const [blockIndex, block] of (data.content || []).entries()) {
    if (block.type !== 'paragraph' || !Array.isArray(block.sentences)) continue;
    const result = normalizeSentenceArray(block.sentences);
    if (result.changes.length === 0) continue;
    block.sentences = result.sentences;
    for (const change of result.changes) changes.push({ block: blockIndex + 1, ...change });
  }

  return { data, changes };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const files = chapterFiles(opts);
  let changedFiles = 0;
  let mergedFragments = 0;
  const byFragment = new Map();

  for (const file of files) {
    const { data, changes } = normalizeFile(file);
    if (changes.length === 0) continue;
    changedFiles += 1;
    mergedFragments += changes.length;
    for (const change of changes) {
      byFragment.set(change.fragment, (byFragment.get(change.fragment) || 0) + 1);
    }
    if (opts.apply) fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  }

  console.log(`${opts.apply ? 'Merged' : 'Would merge'} ${mergedFragments} punctuation-only sentence fragment(s) in ${changedFiles}/${files.length} chapter file(s).`);
  for (const [fragment, count] of [...byFragment.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 20)) {
    console.log(`${JSON.stringify(fragment)}\t${count}`);
  }
}

main();
