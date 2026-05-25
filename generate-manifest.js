#!/usr/bin/env node

/**
 * generate-manifest.js - Generate manifest.json from scraped data
 *
 * Usage:
 *   node generate-manifest.js              # Full rebuild from all books under data/
 *   node generate-manifest.js --book shiji  # Merge one book only (preserves other books)
 */

import fs from 'node:fs';
import path from 'node:path';
import { countChapterMetrics, isChapterFullyReviewed } from './chapter-counts.mjs';
import { BOOK_METADATA, CHRONOLOGICAL_ORDER, OTHER_WORKS_ORDER } from './scripts/book-metadata.mjs';

const DATA_DIR = './data';
const PUBLIC_DATA_DIR = './public/data';

const BOOKS = BOOK_METADATA;

function parseBookArg() {
  const i = process.argv.indexOf('--book');
  if (i === -1 || !process.argv[i + 1]) return null;
  return process.argv[i + 1].trim();
}

/**
 * Build manifest.books[bookId] from JSON on disk; preserve qualityScore/reviewed from existingBooks.
 */
function bookEntryFromDisk(bookId, existingBooks) {
  if (!BOOKS[bookId]) {
    throw new Error(`Unknown book id: ${bookId}`);
  }
  const bookDir = path.join(DATA_DIR, bookId);
  if (!fs.existsSync(bookDir)) {
    throw new Error(`No data directory: ${bookDir}`);
  }

  const chapterFiles = fs.readdirSync(bookDir)
    .filter(f => f.endsWith('.json'))
    .sort();

  if (chapterFiles.length === 0) {
    throw new Error(`No chapter JSON files in ${bookDir}`);
  }

  const chapters = [];
  for (const file of chapterFiles) {
    const chapterNum = file.replace('.json', '');
    const chapterPath = path.join(bookDir, file);

    try {
      const data = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
      const metrics = countChapterMetrics(data);

      const existingChapter = existingBooks?.[bookId]?.chapters?.find(c => c.chapter === chapterNum);
      const qualityScore = existingChapter?.qualityScore ?? null;
      const reviewed =
        existingChapter?.reviewed === true || isChapterFullyReviewed(data);

      chapters.push({
        chapter: chapterNum,
        title: data.meta.title,
        sentenceCount: metrics.sentenceCount,
        translatedCount: metrics.translatedCount,
        characterCount: metrics.characterCount,
        translatedCharacterCount: metrics.translatedCharacterCount,
        qualityScore: qualityScore,
        reviewed
      });
    } catch (e) {
      console.error(`Error reading ${chapterPath}: ${e.message}`);
    }
  }

  return {
    ...BOOKS[bookId],
    chapterCount: chapters.length,
    chapters
  };
}

function writeManifestFiles(manifest) {
  const dataManifestPath = path.join(DATA_DIR, 'manifest.json');
  fs.writeFileSync(dataManifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`Wrote ${dataManifestPath}`);

  if (fs.existsSync(PUBLIC_DATA_DIR)) {
    const publicManifestPath = path.join(PUBLIC_DATA_DIR, 'manifest.json');
    fs.writeFileSync(publicManifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log(`Wrote ${publicManifestPath}`);
  }
}

function mergeManifestSingleBook(bookId) {
  const existingManifestPath = path.join(DATA_DIR, 'manifest.json');
  if (!fs.existsSync(existingManifestPath)) {
    console.error('No data/manifest.json. Run once: make update-all (or make manifest) to create it.');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(existingManifestPath, 'utf8'));
  manifest.generatedAt = new Date().toISOString();
  manifest.books = manifest.books || {};

  manifest.books[bookId] = bookEntryFromDisk(bookId, manifest.books);

  writeManifestFiles(manifest);

  const bookCount = Object.keys(manifest.books).length;
  const totalChapters = Object.values(manifest.books).reduce((sum, b) => sum + b.chapterCount, 0);
  console.log(`\nMerged ${bookId}. Manifest has ${bookCount} books, ${totalChapters} chapters total.`);
}

function generateManifest() {
  let existingManifest = {};
  const existingManifestPath = path.join(DATA_DIR, 'manifest.json');
  if (fs.existsSync(existingManifestPath)) {
    try {
      existingManifest = JSON.parse(fs.readFileSync(existingManifestPath, 'utf8'));
    } catch (e) {
      console.warn('Could not read existing manifest, starting fresh');
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    books: {}
  };

  const entries = fs.readdirSync(DATA_DIR, { withFileTypes: true });
  const availableBooks = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const bookId = entry.name;
    if (BOOKS[bookId]) {
      availableBooks.push(bookId);
    }
  }

  const sortedBooks = CHRONOLOGICAL_ORDER.filter(id => availableBooks.includes(id));
  sortedBooks.push(...OTHER_WORKS_ORDER.filter(id => availableBooks.includes(id)));

  const remainingBooks = availableBooks.filter(id => !sortedBooks.includes(id));
  sortedBooks.push(...remainingBooks);

  for (const bookId of sortedBooks) {
    try {
      manifest.books[bookId] = bookEntryFromDisk(bookId, existingManifest.books || {});
    } catch (e) {
      if (e.message.includes('No chapter JSON')) {
        continue;
      }
      throw e;
    }
  }

  return manifest;
}

function main() {
  const singleBook = parseBookArg();
  if (singleBook) {
    console.log(`Merging manifest for single book: ${singleBook}...`);
    mergeManifestSingleBook(singleBook);
    return;
  }

  console.log('Generating manifest (full rebuild)...');

  const manifest = generateManifest();
  writeManifestFiles(manifest);

  const bookCount = Object.keys(manifest.books).length;
  const totalChapters = Object.values(manifest.books).reduce((sum, b) => sum + b.chapterCount, 0);
  console.log(`\nManifest contains ${bookCount} books with ${totalChapters} total chapters.`);
}

main();
