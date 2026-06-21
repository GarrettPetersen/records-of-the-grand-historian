#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CHAPTER_RE = /^\d{3}\.json$/u;

function usage() {
  console.error(`Usage:
  node scripts/cleanup-quote-fix-artifacts.mjs [--book BOOK] [--apply] [path ...]

Collapses repeated terminal quote artifacts such as "" or ”” in translated
paragraphs, table headers, and table rows. Defaults to all books when no book
or path is supplied.`);
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

function translationFields(item) {
  const fields = [];
  if (item?.translations?.[0]) {
    fields.push({ owner: item.translations[0], key: 'literal' });
    fields.push({ owner: item.translations[0], key: 'idiomatic' });
  }
  if (Object.hasOwn(item, 'literal')) fields.push({ owner: item, key: 'literal' });
  if (Object.hasOwn(item, 'idiomatic')) fields.push({ owner: item, key: 'idiomatic' });
  if (Object.hasOwn(item, 'translation')) fields.push({ owner: item, key: 'translation' });
  return fields.filter((field) => typeof field.owner[field.key] === 'string');
}

function cleanupText(text) {
  let next = text;
  next = next.replace(/'{2,}([,.;:!?)]?\s*)$/g, "'$1");
  next = next.replace(/"{2,}([,.;:!?)]?\s*)$/g, '"$1');
  next = next.replace(/”{2,}([,.;:!?)]?\s*)$/g, '”$1');
  next = next.replace(/^ ('|")/, '$1');
  next = next.trimStart();
  return next;
}

function cleanupItems(items, changes) {
  for (const item of items || []) {
    for (const field of translationFields(item)) {
      const before = field.owner[field.key];
      const after = cleanupText(before);
      if (before === after) continue;
      field.owner[field.key] = after;
      changes.push({ id: item.id, field: field.key, before, after });
    }
  }
}

function cleanupChapter(chapter) {
  const changes = [];
  for (const block of chapter.content || []) {
    if (block.type === 'paragraph' || block.type === 'table_header') {
      cleanupItems(block.sentences, changes);
    } else if (block.type === 'table_row') {
      cleanupItems(block.cells, changes);
    }
  }
  return changes;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const files = chapterFiles(opts);
  let total = 0;
  let changedFiles = 0;

  for (const file of files) {
    const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
    const changes = cleanupChapter(chapter);
    if (changes.length === 0) continue;
    total += changes.length;
    changedFiles += 1;
    console.log(`${file}: ${opts.apply ? 'fixed' : 'found'} ${changes.length} artifact(s)`);
    for (const change of changes.slice(0, 10)) {
      console.log(`  ${change.id || ''} ${change.field}`);
      console.log(`    before: ${change.before}`);
      console.log(`    after:  ${change.after}`);
    }
    if (changes.length > 10) console.log(`  ... ${changes.length - 10} more`);
    if (opts.apply) fs.writeFileSync(file, `${JSON.stringify(chapter, null, 2)}\n`, 'utf8');
  }

  console.log(`${opts.apply ? 'Fixed' : 'Found'} ${total} quote-fix artifact(s) in ${changedFiles}/${files.length} chapter file(s).`);
}

main();
