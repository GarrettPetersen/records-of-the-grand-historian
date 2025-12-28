#!/usr/bin/env node

/**
 * nuke-translations.js - EMERGENCY: Remove ALL translations from a chapter
 *
 * This completely removes all translations (both literal and idiomatic) from a chapter,
 * resetting it to untranslated state. Use with extreme caution!
 *
 * Usage:
 *   node nuke-translations.js <chapter-file>
 *   make nuke-translations CHAPTER=data/shiji/017.json
 */

import fs from 'fs';

function nukeAllTranslations(chapterFile) {
  if (!fs.existsSync(chapterFile)) {
    console.error(`File not found: ${chapterFile}`);
    process.exit(1);
  }

  const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));
  let nukedCount = 0;

  for (const block of chapter.content) {
    if (block.type === 'paragraph') {
      for (const sentence of block.sentences || []) {
        if (sentence.translations?.[0]) {
          delete sentence.translations[0].literal;
          delete sentence.translations[0].idiomatic;
          delete sentence.translations[0].text;
          nukedCount++;
        }
        // Also check legacy format
        if (sentence.literal) {
          delete sentence.literal;
          nukedCount++;
        }
        if (sentence.idiomatic) {
          delete sentence.idiomatic;
          nukedCount++;
        }
      }
    } else if (block.type === 'table_row') {
      for (const cell of block.cells || []) {
        delete cell.literal;
        delete cell.idiomatic;
        delete cell.translation;
        nukedCount++;
      }
    } else if (block.type === 'table_header') {
      for (const sentence of block.sentences || []) {
        if (sentence.translations?.[0]) {
          delete sentence.translations[0].literal;
          delete sentence.translations[0].idiomatic;
          delete sentence.translations[0].text;
          nukedCount++;
        }
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
  console.log(`Nuked ${nukedCount} translations from ${chapterFile}`);
  console.log(`Updated translated count: ${translatedCount}`);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node nuke-translations.js <chapter-file>');
    console.error('Example: node nuke-translations.js data/shiji/017.json');
    process.exit(1);
  }

  const chapterFile = args[0];
  nukeAllTranslations(chapterFile);
}

main();
