#!/usr/bin/env node
/**
 * Run punctuationAlignmentNotes (terminal + fullwidth + delimiters) on
 * translated sentences and table cells under data/{book}/{chapter}.json.
 *
 * Usage:
 *   node scripts/scan-punctuation-all-chapters.mjs
 *   node scripts/scan-punctuation-all-chapters.mjs --min-notes 5
 *   node scripts/scan-punctuation-all-chapters.mjs --book hanshu --details
 *   node scripts/scan-punctuation-all-chapters.mjs data/hanshu/078.json --json
 */

import fs from 'node:fs';
import path from 'node:path';
import { punctuationAlignmentNotes } from '../translation-guards.mjs';

function* iterSentences(data) {
  if (!data?.content) return;
  for (const [blockIndex, block] of data.content.entries()) {
    if (block.type === 'paragraph' || block.type === 'table_header') {
      for (const sentence of block.sentences || []) {
        const translator = sentence.translations?.[0]?.translator;
        if (translator === 'Herbert J. Allen (1894)') continue;
        const zh = sentence.zh || sentence.content;
        const tr = sentence.translations?.[0];
        const fields = [
          ['literal', 'Literal', tr?.literal || sentence.literal],
          ['idiomatic', 'Idiomatic', tr?.idiomatic || sentence.idiomatic],
          ['footnote', 'Footnote', tr?.footnote],
        ].filter(([, , en]) => String(en || '').trim());
        if (fields.length === 0) continue;
        yield { id: sentence.id, zh, fields, blockIndex, blockType: block.type };
      }
    } else if (block.type === 'table_row') {
      for (const cell of block.cells || []) {
        if (cell.translator === 'Herbert J. Allen (1894)') continue;
        const zh = cell.content;
        const fields = [
          ['literal', 'Literal', cell.literal],
          ['idiomatic', 'Idiomatic', cell.idiomatic],
          ['footnote', 'Footnote', cell.footnote],
        ].filter(([, , en]) => String(en || '').trim());
        if (fields.length === 0) continue;
        yield { id: cell.id, zh, fields, blockIndex, blockType: block.type };
      }
    }
  }
}

function scanChapter(filePath) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
  if (!data.meta?.book) return null;

  let sentencesWithNote = 0;
  let totalNotes = 0;
  const problems = [];
  for (const row of iterSentences(data)) {
    let rowNotes = 0;
    for (const [field, label, en] of row.fields) {
      const notes = punctuationAlignmentNotes(row.zh, en, label);
      if (notes.length === 0) continue;
      rowNotes += notes.length;
      problems.push({
        id: row.id,
        blockIndex: row.blockIndex,
        blockType: row.blockType,
        field,
        notes,
        zh: row.zh,
        en,
      });
    }
    if (rowNotes === 0) continue;
    sentencesWithNote += 1;
    totalNotes += rowNotes;
  }

  return {
    book: data.meta.book,
    chapter: data.meta.chapter,
    rel: path.relative(process.cwd(), filePath),
    sentencesWithNote,
    totalNotes,
    problems,
  };
}

function usage() {
  console.error(`Usage:
  node scripts/scan-punctuation-all-chapters.mjs [--book BOOK] [--min-notes N]
    [--details] [--json] [--fail] [path ...]

Explicit paths may be chapter files or directories. Use either --book or paths,
not both.`);
}

function parseArgs(argv) {
  const opts = {
    book: null,
    inputs: [],
    minNotes: 1,
    details: false,
    json: false,
    fail: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--book') {
      opts.book = argv[++i] || '';
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.book = arg.slice('--book='.length);
      continue;
    }
    if (arg === '--min-notes') {
      opts.minNotes = Math.max(1, parseInt(argv[++i], 10) || 1);
      continue;
    }
    if (arg.startsWith('--min-notes=')) {
      opts.minNotes = Math.max(1, parseInt(arg.slice('--min-notes='.length), 10) || 1);
      continue;
    }
    if (arg === '--details') {
      opts.details = true;
      continue;
    }
    if (arg === '--json') {
      opts.json = true;
      continue;
    }
    if (arg === '--fail') {
      opts.fail = true;
      continue;
    }
    if (arg.startsWith('--')) {
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
  const dataRoot = path.resolve(import.meta.dirname, '..', 'data');
  const inputs = opts.inputs.length > 0
    ? opts.inputs
    : opts.book
      ? [path.join(dataRoot, opts.book)]
      : fs.readdirSync(dataRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && entry.name !== 'quality')
        .map((entry) => path.join(dataRoot, entry.name));

  const files = [];
  const enqueue = (entry) => {
    if (!fs.existsSync(entry)) return;
    const stat = fs.statSync(entry);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(entry).sort()) enqueue(path.join(entry, child));
      return;
    }
    if (/^\d{3}\.json$/u.test(path.basename(entry))) files.push(entry);
  };

  for (const input of inputs) enqueue(input);
  return [...new Set(files)].sort();
}

const opts = parseArgs(process.argv.slice(2));
const files = chapterFiles(opts);
const rows = [];
for (const file of files) {
  const row = scanChapter(file);
  if (row && row.totalNotes >= opts.minNotes) rows.push(row);
}

rows.sort((a, b) => (
  b.totalNotes - a.totalNotes
  || a.book.localeCompare(b.book)
  || String(a.chapter).localeCompare(String(b.chapter), undefined, { numeric: true })
));

if (opts.json) {
  const payload = {
    count: rows.reduce((sum, row) => sum + row.problems.length, 0),
    totalHits: rows.reduce((sum, row) => sum + row.totalNotes, 0),
    scannedFiles: files.length,
    minNotes: opts.minNotes,
    rows,
  };
  console.log(JSON.stringify(payload, null, 2));
  if (opts.fail && payload.count > 0) process.exit(1);
  process.exit(0);
}

console.log(`Chapters with at least ${opts.minNotes} punctuation/delimiter note(s): ${rows.length}`);
console.log('');
console.log('book\tchapter\tnotes\tsentences\tfile');
for (const row of rows) {
  console.log(`${row.book}\t${row.chapter}\t${row.totalNotes}\t${row.sentencesWithNote}\t${row.rel}`);
}

if (opts.details) {
  console.log('');
  for (const row of rows) {
    for (const problem of row.problems) {
      console.log(`${row.rel} ${problem.id || ''} block ${problem.blockIndex} ${problem.blockType} ${problem.field}`);
      for (const note of problem.notes) console.log(`  ${note}`);
      console.log(`  zh: ${problem.zh}`);
      console.log(`  en: ${problem.en}`);
      console.log('');
    }
  }
}

if (opts.fail && rows.length > 0) process.exit(1);
