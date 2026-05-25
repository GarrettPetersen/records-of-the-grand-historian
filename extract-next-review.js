#!/usr/bin/env node

import fs from 'fs';
import {
  findNextReviewChapter,
  loadManifest,
  reviewFilePath,
  writeReviewExtract,
} from './scripts/review-queue.mjs';

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
  const { reviewData, reviewFile } = writeReviewExtract(next.filePath, next);

  console.log(`\n✅ Extracted ${reviewData.translations.length} translations for review`);
  console.log(`📁 Saved to: ${reviewFile}`);
  console.log(`\n📝 Edit the "literal" and "idiomatic" fields, then run:`);
  console.log(`   make apply-review CHAPTER=${next.filePath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
