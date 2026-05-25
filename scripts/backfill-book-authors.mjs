#!/usr/bin/env node
/**
 * Backfill meta.bookInfo.author / authorChinese from scripts/book-metadata.mjs.
 *
 * Usage:
 *   node scripts/backfill-book-authors.mjs
 *   node scripts/backfill-book-authors.mjs --book houhanshu
 *   node scripts/backfill-book-authors.mjs --dry-run
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOOK_METADATA, mergeBookInfo } from './book-metadata.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');

function parseArgs() {
  const dryRun = process.argv.includes('--dry-run');
  const i = process.argv.indexOf('--book');
  const book = i !== -1 && process.argv[i + 1] ? process.argv[i + 1].trim() : null;
  return { dryRun, book };
}

function chapterFiles(bookDir) {
  return fs
    .readdirSync(bookDir)
    .filter((f) => /^\d+\.json$/.test(f))
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
}

function backfillBook(bookId, dryRun) {
  if (!BOOK_METADATA[bookId]) {
    console.warn(`Skip unknown book: ${bookId}`);
    return { updated: 0, skipped: 0 };
  }
  const bookDir = path.join(DATA_DIR, bookId);
  if (!fs.existsSync(bookDir)) {
    console.warn(`No data dir: ${bookDir}`);
    return { updated: 0, skipped: 0 };
  }

  let updated = 0;
  let skipped = 0;

  for (const file of chapterFiles(bookDir)) {
    const filePath = path.join(bookDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.meta) {
      skipped += 1;
      continue;
    }
    const before = JSON.stringify(data.meta.bookInfo || {});
    const merged = mergeBookInfo(bookId, data.meta.bookInfo || {});
    const after = JSON.stringify(merged);
    if (before === after) {
      skipped += 1;
      continue;
    }
    data.meta.bookInfo = merged;
    if (!dryRun) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    }
    updated += 1;
  }

  return { updated, skipped };
}

const { dryRun, book } = parseArgs();
const bookIds = book ? [book] : Object.keys(BOOK_METADATA);

let totalUpdated = 0;
for (const bookId of bookIds) {
  const { updated, skipped } = backfillBook(bookId, dryRun);
  totalUpdated += updated;
  if (updated > 0 || book) {
    console.log(`${bookId}: ${updated} updated, ${skipped} unchanged${dryRun ? ' (dry-run)' : ''}`);
  }
}

console.log(`\nDone. ${totalUpdated} chapter file(s) ${dryRun ? 'would be ' : ''}updated.`);
