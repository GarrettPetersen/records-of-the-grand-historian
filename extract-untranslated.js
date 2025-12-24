#!/usr/bin/env node

/**
 * extract-untranslated.js - Extract sentences for translation/review with existing translations
 *
 * Creates a JSON file with all sentences in a chapter, including existing
 * literal/idiomatic translations for reference. Useful for batch translation
 * and quality review workflows.
 *
 * Usage:
 *   node extract-untranslated.js <chapter-file> [output-file]
 *   node extract-untranslated.js data/shiji/007.json
 *   node extract-untranslated.js data/shiji/007.json translations/for_review_007.json
 */

import fs from 'node:fs';
import path from 'node:path';

function extractUntranslated(filePath, outputPath = null) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const untranslated = {};
  let totalCount = 0;
  
  // Check if this is a genealogical table chapter (Shiji chapters 13-16)
  const isGenealogicalTable = data.meta.book === 'shiji' &&
                             ['013', '014', '015', '016'].includes(data.meta.chapter);

  for (const block of data.content) {
    let sentences = [];

    if (block.type === 'paragraph') {
      // Skip paragraphs in genealogical table chapters that contain table-like data
      if (isGenealogicalTable && block.sentences && block.sentences.length > 0) {
        const zh = block.sentences[0].zh;
        // Skip if it contains years (4-digit numbers) or is mostly numbers/spaces
        if (/\d{4}/.test(zh) || /^[\d\s]+$/.test(zh)) {
          continue;
        }
      }
      sentences = block.sentences;
    } else if (block.type === 'table_row') {
      // Unified logic for all table cells - determine what needs translation based on content only
      sentences = block.cells.filter(cell => {
        const content = cell.content.trim();

        // Skip empty cells
        if (!content) return false;

        // Include all non-empty cells - everything with content needs translation
        return true;
      });
    } else if (block.type === 'table_header') {
      // Include all header sentences - table headers need translation too
      sentences = block.sentences.filter(sentence => {
        const content = sentence.zh.trim();

        // Skip empty content
        if (!content) return false;

        // Include all non-empty header sentences
        return true;
      });
    }

    for (const sentence of sentences) {
      let hasIdiomaticTranslation = false;
      let hasLiteralTranslation = false;
      let chineseText = '';
      let sentenceId = '';
      let existingTranslations = null;

      if (block.type === 'paragraph') {
        const trans = sentence.translations?.[0];

        // Skip if no translations array at all
        if (!sentence.translations || sentence.translations.length === 0) {
          // This sentence has no translations at all - include it
          hasIdiomaticTranslation = false;
          hasLiteralTranslation = false;
          chineseText = sentence.zh;
          sentenceId = sentence.id;
          existingTranslations = null;
        } else {
          // Include sentences without translations OR missing idiomatic translations
          const translator = trans.translator || '';

          // Skip sentences translated by Herbert J. Allen (1894)
          if (translator === 'Herbert J. Allen (1894)') {
            continue;
          }

          hasIdiomaticTranslation = trans.idiomatic && trans.idiomatic.trim() !== '';
          hasLiteralTranslation = trans.literal && trans.literal.trim() !== '';
          chineseText = sentence.zh;
          sentenceId = sentence.id;

          // Include existing translations for reference
          if (hasIdiomaticTranslation || hasLiteralTranslation) {
            existingTranslations = {};
            if (hasLiteralTranslation) existingTranslations.literal = trans.literal;
            if (hasIdiomaticTranslation) existingTranslations.idiomatic = trans.idiomatic;
          }
        }
      } else if (block.type === 'table_row') {
        // Table cells don't have translator field, skip if already translated by Herbert J. Allen
        // (This would be handled during scraping, so we can proceed)

        hasIdiomaticTranslation = sentence.idiomatic && sentence.idiomatic.trim() !== '';
        hasLiteralTranslation = sentence.literal && sentence.literal.trim() !== '';
        chineseText = sentence.content;
        sentenceId = sentence.id;

        // Include existing translations for reference
        if (hasIdiomaticTranslation || hasLiteralTranslation) {
          existingTranslations = {};
          if (hasLiteralTranslation) existingTranslations.literal = sentence.literal;
          if (hasIdiomaticTranslation) existingTranslations.idiomatic = sentence.idiomatic;
        }
      } else if (block.type === 'table_header') {
        const trans = sentence.translations?.[0];
        if (!trans) continue; // Skip sentences without translations

        const translator = trans.translator || '';

        // Skip sentences translated by Herbert J. Allen (1894)
        if (translator === 'Herbert J. Allen (1894)') {
          continue;
        }

        hasIdiomaticTranslation = trans.idiomatic && trans.idiomatic.trim() !== '';
        hasLiteralTranslation = trans.literal && trans.literal.trim() !== '';
        chineseText = sentence.zh;
        sentenceId = sentence.id;

        // Include existing translations for reference
        if (hasIdiomaticTranslation || hasLiteralTranslation) {
          existingTranslations = {};
          if (hasLiteralTranslation) existingTranslations.literal = trans.literal;
          if (hasIdiomaticTranslation) existingTranslations.idiomatic = trans.idiomatic;
        }
      }

      // Include sentences that are missing idiomatic translations OR have no translations at all
      const hasIdiomatic = existingTranslations?.idiomatic && existingTranslations.idiomatic.trim() !== '';
      const hasAnyTranslations = sentence.translations && sentence.translations.length > 0;
      if (!hasIdiomatic || !hasAnyTranslations) {
        untranslated[sentenceId] = {
          chinese: chineseText,
          literal: existingTranslations?.literal || '',
          idiomatic: existingTranslations?.idiomatic || ''
        };
      }
    }
  }
  
  // Default output path if not provided
  if (!outputPath) {
    const baseName = path.basename(filePath, '.json');
    outputPath = path.join('translations', `untranslated_${baseName}.json`);
  }

  // Count statistics based on idiomatic translations (our priority)
  let actualTotal = 0;
  let idiomaticTranslated = 0;

  // Re-count to get accurate statistics
  for (const block of data.content) {
    if (block.type === 'paragraph') {
      if (isGenealogicalTable && block.sentences && block.sentences.length > 0) {
        const zh = block.sentences[0].zh;
        if (/\d{4}/.test(zh) || /^[\d\s]+$/.test(zh)) {
          continue;
        }
      }
      for (const sentence of block.sentences) {
        actualTotal++;
        const trans = sentence.translations?.[0];
        // Count as translated if it has idiomatic translation OR is by Allen
        if ((trans?.idiomatic && trans.idiomatic.trim() !== '') ||
            (trans?.translator === 'Herbert J. Allen (1894)')) {
          idiomaticTranslated++;
        }
      }
    } else if (block.type === 'table_row') {
      for (const cell of block.cells) {
        if (cell.content && cell.content.trim()) {
          actualTotal++;
          // Count as translated if it has idiomatic translation OR is by Allen
          if ((cell.idiomatic && cell.idiomatic.trim() !== '') ||
              (cell.translator === 'Herbert J. Allen (1894)')) {
            idiomaticTranslated++;
          }
        }
      }
    } else if (block.type === 'table_header') {
      for (const sentence of block.sentences) {
        if (sentence.zh && sentence.zh.trim()) {
          actualTotal++;
          const trans = sentence.translations?.[0];
          // Count as translated if it has idiomatic translation OR is by Allen
          if ((trans?.idiomatic && trans.idiomatic.trim() !== '') ||
              (trans?.translator === 'Herbert J. Allen (1894)')) {
            idiomaticTranslated++;
          }
        }
      }
    }
  }

  const untranslatedCount = actualTotal - idiomaticTranslated;
  const translatedCount = idiomaticTranslated;
  const total = actualTotal;
  const percent = total > 0 ? Math.round((translatedCount / total) * 100) : 0;

  // Exit early if no untranslated sentences (prevent unnecessary file creation)
  if (untranslatedCount === 0) {
    return {
      filePath,
      outputPath: null, // No file created
      total,
      translated: translatedCount,
      untranslated: untranslatedCount,
      percent
    };
  }

  // Get book and chapter info for naming and cleanup
  const bookName = data.meta.book;
  const chapterNum = data.meta.chapter;

  // If output path starts with "batch_" or similar patterns, prepend book name for clarity
  const fileName = path.basename(outputPath);
  if (fileName.startsWith('batch_') || fileName.startsWith('fresh_batch_')) {
    // Replace patterns like "batch_096_next50.json" with "batch_shiji_096_next50.json"
    const newFileName = fileName.replace(/^((?:fresh_)?batch_)([^_]+)(.*)$/, `$1${bookName}_$2$3`);
    if (newFileName !== fileName) {
      outputPath = path.join(path.dirname(outputPath), newFileName);
    }
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Clean up old batch files for this chapter to maintain idempotency
  console.log(`🧹 Cleaning up old batch files for ${bookName} chapter ${chapterNum}...`);

  // Find and remove old batch files for this chapter
  const files = fs.readdirSync(outputDir);
  let cleanupCount = 0;
  for (const file of files) {
    // Match patterns like: batch_shiji_096_*.json, fresh_batch_shiji_096_*.json,
    // or old patterns like batch_096_*.json for backward compatibility
    if (file.match(new RegExp(`^.*batch(?:_${bookName})?_${chapterNum}_.*\.json$`))) {
      try {
        fs.unlinkSync(path.join(outputDir, file));
        cleanupCount++;
      } catch (err) {
        console.warn(`Warning: Could not delete ${file}: ${err.message}`);
      }
    }
  }
  if (cleanupCount > 0) {
    console.log(`  Cleaned up ${cleanupCount} old batch files`);
  }

  fs.writeFileSync(outputPath, JSON.stringify(untranslated, null, 2), 'utf8');

  return {
    filePath,
    outputPath,
    total,
    translated: translatedCount,
    untranslated: untranslatedCount,
    percent
  };
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Usage:
  node extract-untranslated.js <chapter-file> [output-file]

Examples:
  node extract-untranslated.js data/shiji/007.json
  node extract-untranslated.js data/shiji/007.json translations/untranslated_007.json

Output:
  Creates a JSON file with all sentence IDs mapped to objects containing:
  - "chinese": the Chinese text
  - "existing": existing literal/idiomatic translations (if any)
  Default output: translations/untranslated_<chapter>.json
`);
    process.exit(0);
  }
  
  const filePath = args[0];
  const outputPath = args[1] || null;
  
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }
  
  try {
    const result = extractUntranslated(filePath, outputPath);

    console.log(`
📖 Chapter: ${path.basename(result.filePath)}`);
    console.log(`📊 Translation Status:`);
    console.log(`   Total sentences: ${result.total}`);
    console.log(`   Translated: ${result.translated} (${result.percent}%)`);
    console.log(`   Untranslated: ${result.untranslated}`);

    // Check if no file was created (no untranslated sentences)
    if (result.outputPath === null) {
      console.log(`
✅ No untranslated sentences found. Nothing to extract.
`);
      process.exit(0);
    }

    console.log(`
💾 Saved to: ${result.outputPath}
`);

  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();