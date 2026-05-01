#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { extractTranslationsForReview } from './extract-translations-for-review.js';

const MANIFEST_PATH = './data/manifest.json';
const DATA_DIR = './data';

const CHRONOLOGICAL_ORDER = [
  'shiji', 'hanshu', 'houhanshu', 'sanguozhi', 'jinshu', 'songshu',
  'nanqishu', 'liangshu', 'chenshu', 'weishu', 'beiqishu', 'zhoushu',
  'suishu', 'nanshi', 'beishi', 'jiutangshu', 'xintangshu',
  'jiuwudaishi', 'xinwudaishi', 'songshi', 'liaoshi', 'jinshi',
  'yuanshi', 'mingshi'
];

const OTHER_WORKS_ORDER = ['zizhitongjian', 'qingshigao'];

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`Manifest not found: ${MANIFEST_PATH}`);
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

function orderedBookIds(manifest, bookFilter = null) {
  const available = new Set(Object.keys(manifest.books || {}));

  if (bookFilter) {
    return available.has(bookFilter) ? [bookFilter] : [];
  }

  const ordered = [
    ...CHRONOLOGICAL_ORDER.filter(id => available.has(id)),
    ...OTHER_WORKS_ORDER.filter(id => available.has(id))
  ];

  for (const bookId of available) {
    if (!ordered.includes(bookId)) {
      ordered.push(bookId);
    }
  }

  return ordered;
}

function findNextReviewChapter(manifest, bookFilter = null) {
  for (const bookId of orderedBookIds(manifest, bookFilter)) {
    const book = manifest.books?.[bookId];
    if (!book) continue;

    const chapters = [...(book.chapters || [])].sort((a, b) => a.chapter.localeCompare(b.chapter, 'en', { numeric: true }));
    for (const chapter of chapters) {
      if ((chapter.translatedCount || 0) <= 0) continue;
      if (chapter.reviewed === true) continue;

      const filePath = path.join(DATA_DIR, bookId, `${chapter.chapter}.json`);
      if (!fs.existsSync(filePath)) continue;

      return { bookId, chapter: chapter.chapter, filePath };
    }
  }

  return null;
}

function main() {
  const bookFilter = process.argv[2]?.trim() || null;
  const manifest = loadManifest();
  const next = findNextReviewChapter(manifest, bookFilter);

  if (!next) {
    if (bookFilter) {
      console.log(`No unreviewed translated chapters found in ${bookFilter}`);
    } else {
      console.log('No unreviewed translated chapters found');
    }
    return;
  }

  console.log(`Found next review chapter: ${next.bookId}/${next.chapter}`);
  const reviewData = extractTranslationsForReview(next.filePath);
  const outputFile = `translations/review_${next.bookId}_${next.chapter}.json`;
  fs.writeFileSync(outputFile, JSON.stringify(reviewData, null, 2));

  console.log(`\n✅ Extracted ${reviewData.translations.length} translations for review`);
  console.log(`📁 Saved to: ${outputFile}`);
  console.log(`\n📝 Edit the "literal" and "idiomatic" fields, then run:`);
  console.log(`   make apply-review CHAPTER=${next.filePath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
