#!/usr/bin/env node

/**
 * nuke-idiomatic-translations.js - Remove only idiomatic translations from a chapter
 *
 * This preserves literal translations while removing only the idiomatic ones,
 * allowing for proper re-translation of idiomatic versions.
 *
 * Usage:
 *   node nuke-idiomatic-translations.js <chapter-file>
 *   make nuke-idiomatic CHAPTER=data/shiji/062.json
 */

import fs from 'fs';

function nukeIdiomaticTranslations(chapterFile) {
  if (!fs.existsSync(chapterFile)) {
    console.error(`File not found: ${chapterFile}`);
    process.exit(1);
  }

  const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));
  let nukedCount = 0;

  for (const block of chapter.content) {
    if (block.type === 'paragraph') {
      for (const sentence of block.sentences || []) {
        // Skip sentences translated by Herbert J. Allen (1894)
        const translator = sentence.translations?.[0]?.translator;
        if (translator === 'Herbert J. Allen (1894)') {
          continue;
        }

        // Remove idiomatic translation but keep literal
        if (sentence.translations?.[0]?.idiomatic) {
          delete sentence.translations[0].idiomatic;
          nukedCount++;
        }
        // Also check legacy format
        if (sentence.idiomatic) {
          delete sentence.idiomatic;
          nukedCount++;
        }
      }
    } else if (block.type === 'table_row') {
      for (const cell of block.cells || []) {
        // Skip cells translated by Herbert J. Allen (1894)
        if (cell.translator === 'Herbert J. Allen (1894)') {
          continue;
        }

        // Remove idiomatic translation but keep literal
        if (cell.idiomatic) {
          delete cell.idiomatic;
          nukedCount++;
        }
      }
    } else if (block.type === 'table_header') {
      for (const sentence of block.sentences || []) {
        // Skip sentences translated by Herbert J. Allen (1894)
        const translator = sentence.translations?.[0]?.translator;
        if (translator === 'Herbert J. Allen (1894)') {
          continue;
        }

        // Remove idiomatic translation but keep literal
        if (sentence.translations?.[0]?.idiomatic) {
          delete sentence.translations[0].idiomatic;
          nukedCount++;
        }
        // Also check legacy format
        if (sentence.idiomatic) {
          delete sentence.idiomatic;
          nukedCount++;
        }
      }
    }
  }

  // Recalculate translatedCount (only count entries that still have idiomatic translations)
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
  return nukedCount;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node nuke-idiomatic-translations.js <chapter-file>');
    console.error('Example: node nuke-idiomatic-translations.js data/shiji/062.json');
    process.exit(1);
  }

  const chapterFile = args[0];
  console.log(`⚠️  NUKING IDIOMATIC TRANSLATIONS from ${chapterFile}`);
  console.log('This will permanently remove only idiomatic translations while preserving literal ones!');
  console.log('Press Enter to continue or Ctrl+C to abort...');

  // Wait for user confirmation (simplified for script)
  process.stdin.once('data', () => {
    const nukedCount = nukeIdiomaticTranslations(chapterFile);
    console.log(`✅ Nuked ${nukedCount} idiomatic translations from ${chapterFile}`);
    console.log(`Updated translated count to reflect remaining translations.`);
    console.log(`Run 'make update' to regenerate static pages.`);
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

