#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extract all translations from a chapter file for review
 */
function extractTranslationsForReview(filePath) {
  console.log(`Extracting translations from: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const reviewData = {
    chapter: path.basename(filePath, '.json'),
    book: data.meta.book,
    extractedAt: new Date().toISOString(),
    translations: []
  };

  // Extract translations from content blocks
  if (data.content) {
    for (const block of data.content) {
      if (block.type === 'paragraph') {
        for (const sentence of block.sentences || []) {
          if (sentence.translations && sentence.translations.length > 0) {
            const translation = sentence.translations[0];
            // Extract both literal and idiomatic translations
            const literal = translation.literal || '';
            const idiomatic = translation.idiomatic || '';
            if (literal || idiomatic) {
              reviewData.translations.push({
                id: sentence.id,
                type: 'paragraph',
                chinese: sentence.zh || sentence.content,
                literal: literal,
                idiomatic: idiomatic,
                context: getContext(data.content, block, sentence)
              });
            }
          }
        }
      } else if (block.type === 'table_row') {
        for (const cell of block.cells || []) {
          // Extract both literal and idiomatic translations
          const literal = cell.literal || '';
          const idiomatic = cell.idiomatic || cell.translation || '';
          if (literal || idiomatic) {
            reviewData.translations.push({
              id: cell.id,
              type: 'table_cell',
              chinese: cell.content,
              literal: literal,
              idiomatic: idiomatic,
              context: getTableContext(data.content, block, cell)
            });
          }
        }
      } else if (block.type === 'table_header') {
        for (const sentence of block.sentences || []) {
          if (sentence.translations && sentence.translations.length > 0) {
            const translation = sentence.translations[0];
            // Extract both literal and idiomatic translations
            const literal = translation.literal || '';
            const idiomatic = translation.idiomatic || '';
            if (literal || idiomatic) {
              reviewData.translations.push({
                id: sentence.id,
                type: 'table_header',
                chinese: sentence.zh || sentence.content,
                literal: literal,
                idiomatic: idiomatic,
                context: getTableContext(data.content, block, sentence)
              });
            }
          }
        }
      }
    }
  }

  return reviewData;
}

/**
 * Get contextual information for a paragraph sentence
 */
function getContext(content, currentBlock, currentSentence) {
  const context = {};

  // Find block index
  const blockIndex = content.indexOf(currentBlock);

  // Get surrounding sentences in the same paragraph
  if (currentBlock.sentences) {
    const sentenceIndex = currentBlock.sentences.indexOf(currentSentence);
    if (sentenceIndex > 0) {
      context.previous = currentBlock.sentences[sentenceIndex - 1].zh || currentBlock.sentences[sentenceIndex - 1].content;
    }
    if (sentenceIndex < currentBlock.sentences.length - 1) {
      context.next = currentBlock.sentences[sentenceIndex + 1].zh || currentBlock.sentences[sentenceIndex + 1].content;
    }
  }

  return context;
}

/**
 * Get contextual information for a table cell
 */
function getTableContext(content, currentBlock, currentCell) {
  const context = {};

  // Find block index
  const blockIndex = content.indexOf(currentBlock);

  // Get table header if available
  for (let i = blockIndex - 1; i >= 0; i--) {
    if (content[i].type === 'table_header') {
      context.tableHeaders = content[i].sentences?.map(s => s.zh || s.content) || [];
      break;
    }
  }

  // Get other cells in the same row
  if (currentBlock.cells) {
    context.rowCells = currentBlock.cells.map(cell => cell.content);
    context.currentCellIndex = currentBlock.cells.indexOf(currentCell);
  }

  return context;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node extract-translations-for-review.js <chapter-file>');
    console.error('Example: node extract-translations-for-review.js data/shiji/024.json');
    process.exit(1);
  }

  const filePath = args[0];
  const reviewData = extractTranslationsForReview(filePath);

  // Generate output filename in translations folder
  const baseName = path.basename(filePath, '.json');
  const outputFile = `translations/review_${baseName}.json`;

  fs.writeFileSync(outputFile, JSON.stringify(reviewData, null, 2));
  console.log(`\n✅ Extracted ${reviewData.translations.length} translations for review`);
  console.log(`📁 Saved to: ${outputFile}`);
  console.log(`\n📝 Edit the "literal" and "idiomatic" fields in each translation object, then run:`);
  console.log(`   node apply-reviewed-translations.js ${filePath} ${outputFile}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { extractTranslationsForReview };
