#!/usr/bin/env node

/**
 * apply-reviewed-translations.js - Apply reviewed translations back to chapter
 *
 * Usage: node apply-reviewed-translations.js <chapter-file> <review-file>
 */

import fs from 'fs';

function applyReviewedTranslations(chapterFile, reviewFile) {
  if (!fs.existsSync(chapterFile)) {
    console.error(`Chapter file not found: ${chapterFile}`);
    process.exit(1);
  }

  if (!fs.existsSync(reviewFile)) {
    console.error(`Review file not found: ${reviewFile}`);
    process.exit(1);
  }

  const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));
  const review = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));

  let appliedCount = 0;
  let changedCount = 0;

  for (const reviewItem of review.translations) {
    const success = applySingleTranslation(chapter.content, reviewItem);
      if (success) {
        appliedCount++;
        if (success.changed) {
          changedCount++;
      }
    }
  }

  // Recalculate translated count
  let translatedCount = 0;
  for (const block of chapter.content) {
    if (block.type === 'paragraph') {
      for (const sentence of block.sentences || []) {
        if (sentence.translations?.[0]?.idiomatic?.trim()) {
          translatedCount++;
        }
      }
    } else if (block.type === 'table_row') {
      for (const cell of block.cells || []) {
        if (cell.idiomatic && cell.idiomatic.trim()) {
          translatedCount++;
        }
      }
    } else if (block.type === 'table_header') {
      for (const sentence of block.sentences || []) {
        if (sentence.translations?.[0]?.idiomatic?.trim()) {
          translatedCount++;
        }
      }
    }
  }
  chapter.meta.translatedCount = translatedCount;

  fs.writeFileSync(chapterFile, JSON.stringify(chapter, null, 2));
  console.log(`✅ Applied ${appliedCount} translations`);
  console.log(`✏️  ${changedCount} translations were modified`);
  console.log(`📊 Updated translated count: ${translatedCount}`);
}

function applySingleTranslation(content, reviewItem) {
  for (const block of content) {
    if (block.type === 'paragraph') {
      for (const sentence of block.sentences || []) {
        if (sentence.id === reviewItem.id) {
          if (sentence.translations && sentence.translations.length > 0) {
            let changed = false;

            // Apply literal translation if provided
            if (reviewItem.literal !== undefined && reviewItem.literal !== sentence.translations[0].literal) {
              sentence.translations[0].literal = reviewItem.literal;
              changed = true;
            }

            // Apply idiomatic translation if provided
            if (reviewItem.idiomatic !== undefined && reviewItem.idiomatic !== sentence.translations[0].idiomatic) {
              sentence.translations[0].idiomatic = reviewItem.idiomatic;
              changed = true;
            }

            if (changed) {
              // Preserve original translator information
              sentence.translations[0].translator = sentence.translations[0].translator || 'Garrett M. Petersen (2025)';
              sentence.translations[0].reviewed = true;
              return { changed: true };
            }
            return { changed: false };
          }
        }
      }
    } else if (block.type === 'table_row') {
      for (const cell of block.cells || []) {
        if (cell.id === reviewItem.id) {
          let changed = false;

          // Apply literal translation if provided
          if (reviewItem.literal !== undefined && reviewItem.literal !== cell.literal) {
            cell.literal = reviewItem.literal;
            changed = true;
          }

          // Apply idiomatic translation if provided
          if (reviewItem.idiomatic !== undefined && reviewItem.idiomatic !== cell.idiomatic) {
            cell.idiomatic = reviewItem.idiomatic;
            changed = true;
          }

          if (changed) {
            // Preserve original translator information
            cell.translator = cell.translator || 'Garrett M. Petersen (2025)';
            cell.reviewed = true;
            return { changed: true };
          }
          return { changed: false };
        }
      }
    } else if (block.type === 'table_header') {
      for (const sentence of block.sentences || []) {
        if (sentence.id === reviewItem.id) {
          if (sentence.translations && sentence.translations.length > 0) {
            let changed = false;

            // Apply literal translation if provided
            if (reviewItem.literal !== undefined && reviewItem.literal !== sentence.translations[0].literal) {
              sentence.translations[0].literal = reviewItem.literal;
              changed = true;
            }

            // Apply idiomatic translation if provided
            if (reviewItem.idiomatic !== undefined && reviewItem.idiomatic !== sentence.translations[0].idiomatic) {
              sentence.translations[0].idiomatic = reviewItem.idiomatic;
              changed = true;
            }

            if (changed) {
              // Preserve original translator information
              sentence.translations[0].translator = sentence.translations[0].translator || 'Garrett M. Petersen (2025)';
              sentence.translations[0].reviewed = true;
              return { changed: true };
            }
            return { changed: false };
          }
        }
      }
    }
  }
  return false;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.error('Usage: node apply-reviewed-translations.js <chapter-file> <review-file>');
    console.error('Example: node apply-reviewed-translations.js data/shiji/076.json review_076.json');
    process.exit(1);
  }

  const [chapterFile, reviewFile] = args;
  applyReviewedTranslations(chapterFile, reviewFile);
}

  main();
