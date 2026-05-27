#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scoreChapterFile } from '../score-translations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(REPO_ROOT, 'data');

function parseArgs() {
  const args = process.argv.slice(2);
  let book = null;
  let chapter = null;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--book' && args[i + 1]) {
      book = args[i + 1];
      i += 1;
    } else if (arg === '--chapter' && args[i + 1]) {
      chapter = args[i + 1];
      i += 1;
    }
  }

  return { book, chapter };
}

function listChapterFiles(book) {
  const books = book ? [book] : fs.readdirSync(DATA_DIR).filter((entry) =>
    fs.statSync(path.join(DATA_DIR, entry)).isDirectory()
  );

  return books.flatMap((bookId) => {
    const dir = path.join(DATA_DIR, bookId);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => path.join(dir, file));
  });
}

function main() {
  const { book, chapter } = parseArgs();
  const files = chapter
    ? [book ? path.join(DATA_DIR, book, `${chapter.padStart?.(3, '0') ?? chapter}.json`) : null].filter(Boolean)
    : listChapterFiles(book);

  const savedLog = console.log;
  const savedError = console.error;
  console.log = () => {};
  console.error = () => {};

  let total = 0;
  let chapters = 0;

  try {
    for (const filePath of files) {
      if (!fs.existsSync(filePath)) continue;
      const results = scoreChapterFile(filePath);
      const hits = results.filter((result) => result.issues?.includes('Contains Chinese characters'));
      if (hits.length === 0) continue;

      chapters += 1;
      total += hits.length;

      savedLog(`\n${path.relative(REPO_ROOT, filePath)}: ${hits.length}`);
      for (const hit of hits) {
        savedLog(`  - ${hit.id}`);
        savedLog(`    Chinese: ${hit.chinese}`);
        savedLog(`    English: ${hit.english}`);
      }
    }
  } finally {
    console.log = savedLog;
    console.error = savedError;
  }

  savedLog(`\nTotal flagged entries: ${total}`);
  savedLog(`Chapters with flags: ${chapters}`);
}

main();
