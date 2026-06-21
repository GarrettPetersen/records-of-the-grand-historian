#!/usr/bin/env node
/**
 * Scan source JSON for source-bearing prose/table items that are missing an
 * idiomatic English translation. Literal-only fallbacks are useful during
 * drafting, but they should not silently enter publication builds.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA_DIR = path.join(process.cwd(), 'data');

function usage() {
  console.error(`Usage:
  node scripts/scan-translation-completeness.mjs [--book BOOK] [--json] [--summary] [--fail] [path ...]

Options:
  --book BOOK   Scan data/BOOK
  --json        Emit machine-readable JSON
  --summary     Emit per-book counts only
  --fail        Exit 1 when missing or literal-only translations are found`);
}

function parseArgs(argv) {
  const opts = { inputs: [], book: null, json: false, summary: false, fail: false };
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
      // Shared quality-scan options that do not affect completeness checks.
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

function text(value) {
  return String(value ?? '').replace(/\s+/gu, ' ').trim();
}

function hasTranslatableSource(value) {
  return /[\p{L}\p{N}]/u.test(value);
}

function sourceText(item) {
  const src = text(item?.content ?? item?.zh ?? item?.chinese ?? item?.source);
  return hasTranslatableSource(src) ? src : '';
}

function englishIdiomatic(item) {
  if (typeof item?.idiomatic === 'string') return text(item.idiomatic);
  if (typeof item?.translation?.idiomatic === 'string') return text(item.translation.idiomatic);
  const translation = item?.translations?.find?.((entry) => entry.lang === 'en') || item?.translations?.[0];
  return text(translation?.idiomatic);
}

function englishLiteral(item) {
  if (typeof item?.literal === 'string') return text(item.literal);
  if (typeof item?.translation?.literal === 'string') return text(item.translation.literal);
  const translation = item?.translations?.find?.((entry) => entry.lang === 'en') || item?.translations?.[0];
  return text(translation?.literal ?? translation?.text);
}

function englishFootnote(item) {
  const translation = item?.translations?.find?.((entry) => entry.lang === 'en') || item?.translations?.[0];
  return text(translation?.footnote);
}

function hit(kind, file, data, blockIndex, itemIndex, item) {
  const src = sourceText(item);
  const idiomatic = englishIdiomatic(item);
  const literal = englishLiteral(item);
  const footnote = englishFootnote(item);
  if (!src || idiomatic || footnote) return null;
  return {
    type: literal ? 'literal-only' : 'missing',
    kind,
    book: data.meta?.book || path.basename(path.dirname(file)),
    chapter: data.meta?.chapter || path.basename(file, '.json'),
    file: path.relative(process.cwd(), file),
    id: item?.id || '',
    block: blockIndex + 1,
    item: itemIndex + 1,
    sourceExcerpt: src.slice(0, 100),
    literalExcerpt: literal.slice(0, 100)
  };
}

export function scanTranslationCompletenessFile(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const hits = [];
  for (const [blockIndex, block] of (data.content || []).entries()) {
    if (block.type === 'paragraph') {
      for (const [sentenceIndex, sentence] of (block.sentences || []).entries()) {
        const row = hit('paragraph-sentence', file, data, blockIndex, sentenceIndex, sentence);
        if (row) hits.push(row);
      }
    }
    if (block.type === 'table_row') {
      for (const [cellIndex, cell] of (block.cells || []).entries()) {
        const row = hit('table-cell', file, data, blockIndex, cellIndex, cell);
        if (row) hits.push(row);
      }
    }
  }
  return hits;
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

  const hits = chapterFiles(inputs).flatMap(scanTranslationCompletenessFile);
  const totalHits = hits.length;

  if (opts.json) {
    console.log(JSON.stringify({ count: totalHits, hits }, null, 2));
  } else {
    console.log(`Translation completeness candidates: ${totalHits} hit(s) in ${new Set(hits.map((row) => `${row.book}/${row.chapter}`)).size} chapter(s)`);
    if (opts.summary) {
      const byBook = new Map();
      for (const row of hits) {
        const current = byBook.get(row.book) || { chapters: new Set(), hits: 0, missing: 0, literalOnly: 0 };
        current.chapters.add(row.chapter);
        current.hits += 1;
        if (row.type === 'missing') current.missing += 1;
        if (row.type === 'literal-only') current.literalOnly += 1;
        byBook.set(row.book, current);
      }
      console.log('');
      console.log('book\tchapters\thits\tmissing\tliteral-only');
      for (const [book, counts] of [...byBook.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
        console.log(`${book}\t${counts.chapters.size}\t${counts.hits}\t${counts.missing}\t${counts.literalOnly}`);
      }
    } else {
      for (const row of hits.slice(0, 200)) {
        console.log(`${row.file}: block ${row.block} ${row.kind} ${row.item}: ${row.type} ${JSON.stringify(row.sourceExcerpt)}${row.literalExcerpt ? ` literal=${JSON.stringify(row.literalExcerpt)}` : ''}`);
      }
      if (hits.length > 200) console.log(`... ${hits.length - 200} more hit(s). Use --json or --summary for full output.`);
    }
  }

  if (opts.fail && totalHits > 0) process.exit(1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
