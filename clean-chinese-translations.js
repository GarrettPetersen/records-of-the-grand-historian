#!/usr/bin/env node

/**
 * clean-chinese-translations.js - Remove all translations containing Chinese characters
 *
 * This script identifies and removes translations that contain Chinese characters,
 * which are clearly erroneous and need to be re-translated.
 *
 * Usage: node clean-chinese-translations.js <chapter-file> [chapter-file...]
 *        node clean-chinese-translations.js data/shiji/*.json
 */

import fs from 'fs';
import path from 'path';

// Regular expression to detect Chinese characters
const CHINESE_CHARS_REGEX = /[\u4e00-\u9fff]/;

function cleanChapterFile(filePath) {
  console.log(`Processing: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return { removed: 0, total: 0 };
  }

  const chapter = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let removedCount = 0;
  let totalTranslations = 0;

  // Process all content blocks
  for (const block of chapter.content) {
    let sentences = [];

    if (block.type === 'paragraph') {
      sentences = block.sentences;
    } else if (block.type === 'table_row') {
      sentences = block.cells;
    } else if (block.type === 'table_header') {
      sentences = block.sentences;
    }

    if (!sentences) continue;

    for (const sentence of sentences) {
      // Check both old format (sentence.translation) and new format (sentence.translations[0].text)
      const translation = sentence.translation || (sentence.translations && sentence.translations[0] && sentence.translations[0].text);

      if (translation) {
        totalTranslations++;

        // If translation contains Chinese characters, remove it
        if (CHINESE_CHARS_REGEX.test(translation)) {
          console.log(`  Removing translation with Chinese characters:`);
          console.log(`    ID: ${sentence.id}`);
          console.log(`    Chinese: ${sentence.zh || sentence.content || 'N/A'}`);
          console.log(`    Bad Translation: "${translation}"`);
          console.log('');

          // Remove the translation
          if (block.type === 'table_row') {
            delete sentence.translation;
            delete sentence.translator;
            delete sentence.model;
          } else {
            // For paragraphs, remove both old and new format translations
            delete sentence.translation;
            if (sentence.translations) {
              sentence.translations = [];
            }
            // Also remove translator/model if they exist
            delete sentence.translator;
            delete sentence.model;
          }

          removedCount++;
        }
      }
    }
  }

  // Update metadata if we removed translations
  if (removedCount > 0) {
    // Recalculate total translated count
    let totalTranslated = 0;
    for (const block of chapter.content) {
      let sentences = [];

      if (block.type === 'paragraph') {
        sentences = block.sentences;
      } else if (block.type === 'table_row') {
        sentences = block.cells;
      } else if (block.type === 'table_header') {
        sentences = block.sentences;
      }

      for (const sentence of sentences) {
        if (sentence.translation ||
            (sentence.translations && sentence.translations.length > 0 && sentence.translations[0].text)) {
          totalTranslated++;
        }
      }
    }

    // Update metadata
    chapter.meta.translatedCount = totalTranslated;
    if (chapter.meta.translators && chapter.meta.translators.length > 0) {
      chapter.meta.translators[0].sentences = totalTranslated;
    }

    // Save the cleaned file
    fs.writeFileSync(filePath, JSON.stringify(chapter, null, 2), 'utf8');
    console.log(`✅ Cleaned ${filePath}: removed ${removedCount} translations with Chinese characters`);
  } else {
    console.log(`ℹ️  No problematic translations found in ${filePath}`);
  }

  return { removed: removedCount, total: totalTranslations };
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node clean-chinese-translations.js <chapter-file> [chapter-file...]');
    console.error('Examples:');
    console.error('  node clean-chinese-translations.js data/shiji/043.json');
    console.error('  node clean-chinese-translations.js data/shiji/*.json');
    process.exit(1);
  }

  console.log('🧹 Cleaning translations containing Chinese characters...\n');

  let totalRemoved = 0;
  let totalProcessed = 0;

  for (const filePath of args) {
    try {
      // Handle glob patterns by expanding them
      if (filePath.includes('*')) {
        const dir = path.dirname(filePath);
        const pattern = path.basename(filePath);
        const files = fs.readdirSync(dir)
          .filter(file => {
            if (pattern === '*.json') return file.endsWith('.json');
            // For more complex patterns, you might need a proper glob library
            return file.includes(pattern.replace('*', ''));
          })
          .map(file => path.join(dir, file));

        for (const expandedFile of files) {
          const result = cleanChapterFile(expandedFile);
          totalRemoved += result.removed;
          totalProcessed += result.total;
        }
      } else {
        const result = cleanChapterFile(filePath);
        totalRemoved += result.removed;
        totalProcessed += result.total;
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}: ${error.message}`);
    }
  }

  console.log(`\n📊 SUMMARY:`);
  console.log(`   Translations processed: ${totalProcessed}`);
  console.log(`   Problematic translations removed: ${totalRemoved}`);
  console.log(`   Success rate: ${totalProcessed > 0 ? ((totalProcessed - totalRemoved) / totalProcessed * 100).toFixed(1) : 0}%`);

  if (totalRemoved > 0) {
    console.log(`\n💡 The removed translations can now be properly re-translated.`);
    console.log(`   Run quality checks again to verify the cleanup was successful.`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
