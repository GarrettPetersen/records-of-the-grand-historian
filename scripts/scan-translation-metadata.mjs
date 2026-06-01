#!/usr/bin/env node
/**
 * Scan translation metadata for nonstandard translator labels.
 *
 * Publication products should not expose agent names or stale translator-year
 * metadata in source JSON. This scanner is deliberately scoped to existing
 * translator fields so blank source-only cells are not treated as translations.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA_DIR = path.join(process.cwd(), 'data');
export const EXPECTED_TRANSLATOR = process.env.TRANSLATOR || 'Garrett M. Petersen (2026)';

function usage() {
  console.error(`Usage:
  node scripts/scan-translation-metadata.mjs [--book BOOK] [--json] [--summary] [--fail] [--fix] [path ...]

Options:
  --book BOOK   Scan data/BOOK
  --json        Emit machine-readable JSON
  --summary     Emit per-book counts only
  --fail        Exit 1 when nonstandard translator metadata is found
  --fix         Rewrite existing translator fields to "${EXPECTED_TRANSLATOR}"`);
}

function parseArgs(argv) {
  const opts = { inputs: [], book: null, json: false, summary: false, fail: false, fix: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--json') {
      opts.json = true;
      continue;
    }
    if (arg === '--summary') {
      opts.summary = true;
      continue;
    }
    if (arg === '--fail') {
      opts.fail = true;
      continue;
    }
    if (arg === '--fix') {
      opts.fix = true;
      continue;
    }
    if (arg === '--book') {
      opts.book = argv[++i];
      if (!opts.book) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.book = arg.slice('--book='.length);
      continue;
    }
    if (arg.startsWith('--')) {
      if (arg === '--include-literal' || arg === '--no-source-check') continue;
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

function chapterFiles(inputs) {
  const files = [];
  const enqueue = (entry) => {
    if (!fs.existsSync(entry)) return;
    const st = fs.statSync(entry);
    if (st.isDirectory()) {
      for (const child of fs.readdirSync(entry).sort()) enqueue(path.join(entry, child));
      return;
    }
    if (/^\d{3}\.json$/u.test(path.basename(entry))) files.push(entry);
  };
  for (const input of inputs) enqueue(input);
  return [...new Set(files)].sort();
}

function nearestContext(keyPath) {
  const sentenceIndex = keyPath.lastIndexOf('sentences');
  if (sentenceIndex >= 0 && keyPath.length > sentenceIndex + 1) {
    return `sentences.${keyPath[sentenceIndex + 1]}.${keyPath.slice(sentenceIndex + 2).join('.')}`;
  }
  const cellIndex = keyPath.lastIndexOf('cells');
  if (cellIndex >= 0 && keyPath.length > cellIndex + 1) {
    return `cells.${keyPath[cellIndex + 1]}.${keyPath.slice(cellIndex + 2).join('.')}`;
  }
  return keyPath.join('.');
}

function scanObject(value, hits, keyPath = []) {
  if (Array.isArray(value)) {
    value.forEach((child, index) => scanObject(child, hits, keyPath.concat(String(index))));
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (Object.hasOwn(value, 'translator') && value.translator !== EXPECTED_TRANSLATOR) {
    hits.push({
      path: nearestContext(keyPath),
      id: value.id || '',
      translator: value.translator ?? '',
    });
  }
  for (const [key, child] of Object.entries(value)) scanObject(child, hits, keyPath.concat(key));
}

function fixObject(value) {
  let changed = false;
  if (Array.isArray(value)) {
    for (const child of value) changed = fixObject(child) || changed;
    return changed;
  }
  if (!value || typeof value !== 'object') return false;
  if (Object.hasOwn(value, 'translator') && value.translator !== EXPECTED_TRANSLATOR) {
    value.translator = EXPECTED_TRANSLATOR;
    changed = true;
  }
  for (const child of Object.values(value)) changed = fixObject(child) || changed;
  return changed;
}

export function scanTranslationMetadataFile(file, opts = {}) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const hits = [];
  scanObject(data, hits);
  if (opts.fix && hits.length > 0 && fixObject(data)) {
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  }
  return {
    book: data.meta?.book || path.basename(path.dirname(file)),
    chapter: data.meta?.chapter || path.basename(file, '.json'),
    file: path.relative(process.cwd(), file),
    hits,
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  let inputs = opts.inputs;
  if (opts.book) inputs = [path.join(DATA_DIR, opts.book)];
  if (inputs.length === 0) {
    inputs = fs.readdirSync(DATA_DIR)
      .map((entry) => path.join(DATA_DIR, entry))
      .filter((entry) => fs.statSync(entry).isDirectory() && path.basename(entry) !== 'quality');
  }
  const rows = chapterFiles(inputs)
    .map((file) => scanTranslationMetadataFile(file, opts))
    .filter((row) => row.hits.length > 0);
  const totalHits = rows.reduce((sum, row) => sum + row.hits.length, 0);

  if (opts.json) {
    console.log(JSON.stringify({ count: totalHits, expectedTranslator: EXPECTED_TRANSLATOR, rows }, null, 2));
  } else {
    const prefix = opts.fix ? 'Fixed translation metadata candidates' : 'Translation metadata candidates';
    console.log(`${prefix}: ${totalHits} hit(s) in ${rows.length} chapter(s)`);
    if (opts.summary) {
      const byBook = new Map();
      for (const row of rows) {
        const current = byBook.get(row.book) || { chapters: 0, hits: 0 };
        current.chapters += 1;
        current.hits += row.hits.length;
        byBook.set(row.book, current);
      }
      console.log('');
      console.log('book\tchapters\thits');
      for (const [book, counts] of [...byBook.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
        console.log(`${book}\t${counts.chapters}\t${counts.hits}`);
      }
    } else {
      for (const row of rows.slice(0, 100)) {
        console.log(`${row.book}\t${row.chapter}\t${row.hits.length}\t${row.file}`);
        for (const hit of row.hits.slice(0, 5)) {
          console.log(`  ${hit.id ? `${hit.id}\t` : ''}${hit.path}\t${JSON.stringify(hit.translator)}`);
        }
        if (row.hits.length > 5) console.log(`  ... ${row.hits.length - 5} more`);
      }
      if (rows.length > 100) console.log(`... ${rows.length - 100} more chapter(s). Use --json or --summary for full output.`);
    }
  }

  if (opts.fail && totalHits > 0) process.exit(1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
