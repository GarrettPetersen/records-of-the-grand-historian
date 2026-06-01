#!/usr/bin/env node
/**
 * Find long prose passages where the idiomatic English is identical to the
 * literal English. This is a review-priority signal, not a correctness verdict:
 * formulaic sentences can be fine, but long identical passages often preserve
 * early draft calques that grammar checkers miss.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA_DIR = path.join(process.cwd(), 'data');

function usage() {
  console.error(`Usage:
  node scripts/scan-literal-identical-prose.mjs [--book BOOK] [--json] [--summary] [--fail] [--min-words N] [path ...]

Options:
  --book BOOK    Scan data/BOOK
  --json         Emit machine-readable JSON
  --summary      Emit per-book and per-chapter counts
  --fail         Exit 1 when candidates are found
  --min-words N  Minimum English word count to report, default 8`);
}

function parseArgs(argv) {
  const opts = { inputs: [], book: null, json: false, summary: false, fail: false, minWords: 8 };
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
    if (arg === '--min-words') {
      opts.minWords = Number(argv[++i]);
      if (!Number.isFinite(opts.minWords) || opts.minWords < 1) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg.startsWith('--min-words=')) {
      opts.minWords = Number(arg.slice('--min-words='.length));
      if (!Number.isFinite(opts.minWords) || opts.minWords < 1) {
        usage();
        process.exit(2);
      }
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

function text(value) {
  return String(value ?? '').replace(/\s+/gu, ' ').trim();
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

function sourceText(item) {
  return text(item?.content ?? item?.zh ?? item?.chinese ?? item?.source);
}

function wordCount(value) {
  return text(value).split(/\s+/u).filter(Boolean).length;
}

function excerpt(value, width = 180) {
  const clean = text(value);
  return clean.length <= width ? clean : `${clean.slice(0, width - 1)}…`;
}

export function scanLiteralIdenticalProseFile(file, opts = {}) {
  const minWords = Number(opts.minWords) || 8;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const hits = [];
  for (const [blockIndex, block] of (data.content || []).entries()) {
    if (block.type !== 'paragraph') continue;
    for (const [sentenceIndex, sentence] of (block.sentences || []).entries()) {
      const idiomatic = englishIdiomatic(sentence);
      const literal = englishLiteral(sentence);
      const words = wordCount(idiomatic);
      if (!idiomatic || idiomatic !== literal || words < minWords) continue;
      hits.push({
        book: data.meta?.book || path.basename(path.dirname(file)),
        chapter: data.meta?.chapter || path.basename(file, '.json'),
        file: path.relative(process.cwd(), file),
        id: sentence?.id || '',
        block: blockIndex + 1,
        sentence: sentenceIndex + 1,
        words,
        sourceExcerpt: excerpt(sourceText(sentence), 80),
        englishExcerpt: excerpt(idiomatic),
      });
    }
  }
  return hits;
}

function printSummary(hits) {
  const byBook = new Map();
  const byChapter = new Map();
  for (const hit of hits) {
    const book = byBook.get(hit.book) || { chapters: new Set(), hits: 0, words: 0 };
    book.chapters.add(hit.chapter);
    book.hits += 1;
    book.words += hit.words;
    byBook.set(hit.book, book);

    const key = `${hit.book}/${hit.chapter}`;
    const chapter = byChapter.get(key) || { book: hit.book, chapter: hit.chapter, hits: 0, words: 0, file: hit.file };
    chapter.hits += 1;
    chapter.words += hit.words;
    byChapter.set(key, chapter);
  }

  console.log('');
  console.log('book\tchapters\thits\twords');
  for (const [book, counts] of [...byBook.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`${book}\t${counts.chapters.size}\t${counts.hits}\t${counts.words}`);
  }

  console.log('');
  console.log('top chapters');
  console.log('book\tchapter\thits\twords\tfile');
  for (const row of [...byChapter.values()].sort((a, b) => b.hits - a.hits || b.words - a.words).slice(0, 30)) {
    console.log(`${row.book}\t${row.chapter}\t${row.hits}\t${row.words}\t${row.file}`);
  }
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

  const hits = chapterFiles(inputs).flatMap((file) => scanLiteralIdenticalProseFile(file, opts));
  if (opts.json) {
    console.log(JSON.stringify({ count: hits.length, minWords: opts.minWords, hits }, null, 2));
  } else {
    console.log(`Literal-identical prose candidates: ${hits.length} hit(s) in ${new Set(hits.map((hit) => `${hit.book}/${hit.chapter}`)).size} chapter(s)`);
    if (opts.summary) {
      printSummary(hits);
    } else {
      for (const hit of hits.slice(0, 200)) {
        console.log(`${hit.file}: block ${hit.block} sentence ${hit.sentence} ${hit.id} (${hit.words} words): ${JSON.stringify(hit.englishExcerpt)}`);
      }
      if (hits.length > 200) console.log(`... ${hits.length - 200} more hit(s). Use --json or --summary for full output.`);
    }
  }

  if (opts.fail && hits.length > 0) process.exit(1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
