#!/usr/bin/env node

/**
 * cleanup-translated-artifacts.js - Remove AI-generated "(translated)" artifacts
 *
 * Removes "(translated)" and "(translated)." from translation fields where they
 * don't appear in the original Chinese text.
 *
 * Usage: node cleanup-translated-artifacts.js <chapter-file>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Clean translation artifacts from a single translation object
 */
function cleanTranslation(translation) {
  if (!translation) return;

  // Clean literal and idiomatic fields
  if (translation.literal && typeof translation.literal === 'string') {
    translation.literal = translation.literal.replace(/\s*\(translated\)\.?\s*$/, '').trim();
  }

  if (translation.idiomatic && typeof translation.idiomatic === 'string') {
    translation.idiomatic = translation.idiomatic.replace(/\s*\(translated\)\.?\s*$/, '').trim();
  }
}

/**
 * Process a chapter file and remove translation artifacts
 */
function processChapterFile(filePath) {
  console.log(`🧹 Cleaning translation artifacts in: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return 0;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let cleanedCount = 0;

  // Process paragraphs and table headers
  if (data.content) {
    for (const block of data.content) {
      if (block.type === 'paragraph' || block.type === 'table_header') {
        for (const sentence of block.sentences || []) {
          // Clean translations
          if (sentence.translations && sentence.translations[0]) {
            const originalLiteral = sentence.translations[0].literal;
            const originalIdiomatic = sentence.translations[0].idiomatic;

            cleanTranslation(sentence.translations[0]);

            // Count if anything changed
            if (originalLiteral !== sentence.translations[0].literal ||
                originalIdiomatic !== sentence.translations[0].idiomatic) {
              cleanedCount++;
              console.log(`  ✓ Cleaned: "${sentence.id}"`);
            }
          }
        }
      }
      // Process table rows
      else if (block.type === 'table_row') {
        for (const cell of block.cells || []) {
          // Clean cell translations
          const originalLiteral = cell.literal;
          const originalIdiomatic = cell.idiomatic;

          if (cell.literal && typeof cell.literal === 'string') {
            cell.literal = cell.literal.replace(/\s*\(translated\)\.?\s*$/, '').trim();
          }

          if (cell.idiomatic && typeof cell.idiomatic === 'string') {
            cell.idiomatic = cell.idiomatic.replace(/\s*\(translated\)\.?\s*$/, '').trim();
          }

          // Count if anything changed
          if (originalLiteral !== cell.literal || originalIdiomatic !== cell.idiomatic) {
            cleanedCount++;
            console.log(`  ✓ Cleaned: "${cell.id}"`);
          }
        }
      }
    }
  }

  // Save the updated file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log(`✅ Cleaned ${cleanedCount} translation artifacts in ${path.basename(filePath)}`);
  return cleanedCount;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node cleanup-translated-artifacts.js <chapter-file> [chapter-file ...]');
    console.error('Example: node cleanup-translated-artifacts.js data/shiji/014.json');
    process.exit(1);
  }

  let totalCleaned = 0;

  for (const filePath of args) {
    totalCleaned += processChapterFile(filePath);
  }

  console.log(`\n🎯 Total artifacts cleaned: ${totalCleaned} entries`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  cleanTranslation,
  processChapterFile
};
