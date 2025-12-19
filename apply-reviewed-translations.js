#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Apply reviewed translations back to a chapter file
 */
function applyReviewedTranslations(chapterPath, reviewPath) {
  console.log(`Applying reviewed translations from: ${reviewPath}`);
  console.log(`To chapter file: ${chapterPath}`);

  if (!fs.existsSync(chapterPath)) {
    console.error(`Chapter file not found: ${chapterPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(reviewPath)) {
    console.error(`Review file not found: ${reviewPath}`);
    process.exit(1);
  }

  const chapterData = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
  const reviewData = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));

  // Validate that review data matches chapter
  if (reviewData.chapter !== path.basename(chapterPath, '.json')) {
    console.error(`Review file chapter (${reviewData.chapter}) doesn't match target chapter (${path.basename(chapterPath, '.json')})`);
    process.exit(1);
  }

  let appliedCount = 0;
  let changedCount = 0;

  // Apply translations to content blocks
  if (chapterData.content && reviewData.translations) {
    for (const reviewItem of reviewData.translations) {
      const success = applySingleTranslation(chapterData.content, reviewItem);
      if (success) {
        appliedCount++;
        if (success.changed) {
          changedCount++;
        }
      }
    }
  }

  // Recalculate translated count
  const actualCount = countTranslations(chapterData);
  chapterData.meta.translatedCount = actualCount;

  // Write back the updated chapter
  fs.writeFileSync(chapterPath, JSON.stringify(chapterData, null, 2));

  console.log(`\n✅ Applied ${appliedCount} translations`);
  console.log(`✏️  ${changedCount} translations were modified`);
  console.log(`📊 Updated translated count: ${actualCount}`);
}

/**
 * Apply a single reviewed translation
 */
function applySingleTranslation(content, reviewItem) {
  for (const block of content) {
    if (block.type === 'paragraph') {
      for (const sentence of block.sentences || []) {
        if (sentence.id === reviewItem.id) {
          if (sentence.translations && sentence.translations.length > 0) {
            const oldTranslation = sentence.translations[0].text;
            const newTranslation = reviewItem.english?.trim();

            if (newTranslation && newTranslation !== oldTranslation) {
              sentence.translations[0].text = newTranslation;
              // Preserve original translator information
              sentence.translations[0].translator = sentence.translations[0].translator || 'Garrett M. Petersen (2025)';
              sentence.translations[0].reviewed = true;
              return { changed: true };
            } else if (newTranslation === oldTranslation) {
              return { changed: false };
            }
          }
        }
      }
    } else if (block.type === 'table_row') {
      for (const cell of block.cells || []) {
        if (cell.id === reviewItem.id) {
          const oldTranslation = cell.translation;
          const newTranslation = reviewItem.english?.trim();

          if (newTranslation && newTranslation !== oldTranslation) {
            cell.translation = newTranslation;
            // Preserve original translator information
            cell.translator = cell.translator || 'Garrett M. Petersen (2025)';
            cell.reviewed = true;
            return { changed: true };
          } else if (newTranslation === oldTranslation) {
            return { changed: false };
          }
        }
      }
    } else if (block.type === 'table_header') {
      for (const sentence of block.sentences || []) {
        if (sentence.id === reviewItem.id) {
          if (sentence.translations && sentence.translations.length > 0) {
            const oldTranslation = sentence.translations[0].text;
            const newTranslation = reviewItem.english?.trim();

            if (newTranslation && newTranslation !== oldTranslation) {
              sentence.translations[0].text = newTranslation;
              // Preserve original translator information
              sentence.translations[0].translator = sentence.translations[0].translator || 'Garrett M. Petersen (2025)';
              sentence.translations[0].reviewed = true;
              return { changed: true };
            } else if (newTranslation === oldTranslation) {
              return { changed: false };
            }
          }
        }
      }
    }
  }

  console.warn(`Warning: Could not find sentence with ID ${reviewItem.id}`);
  return false;
}

/**
 * Count total translations in chapter data
 */
function countTranslations(data) {
  let count = 0;

  if (data.content) {
    for (const block of data.content) {
      if (block.type === 'paragraph') {
        for (const sentence of block.sentences || []) {
          if (sentence.translations && sentence.translations.length > 0 && sentence.translations[0].text?.trim()) {
            count++;
          }
        }
      } else if (block.type === 'table_row') {
        for (const cell of block.cells || []) {
          if (cell.translation && cell.translation.trim()) {
            count++;
          }
        }
      } else if (block.type === 'table_header') {
        for (const sentence of block.sentences || []) {
          if (sentence.translations && sentence.translations.length > 0 && sentence.translations[0].text?.trim()) {
            count++;
          }
        }
      }
    }
  }

  return count;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error('Usage: node apply-reviewed-translations.js <chapter-file> <review-file>');
    console.error('Example: node apply-reviewed-translations.js data/shiji/024.json review_024.json');
    process.exit(1);
  }

  const [chapterPath, reviewPath] = args;
  applyReviewedTranslations(chapterPath, reviewPath);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { applyReviewedTranslations };
