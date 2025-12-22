#!/usr/bin/env node

/**
 * migrate-to-dual-translations.js - Migrate existing translations from "text" to "literal"/"idiomatic" schema
 *
 * This script converts the old translation format:
 *   "translations": [{"lang": "en", "text": "...", "translator": "..."}]
 *
 * To the new dual-translation format:
 *   "translations": [{"lang": "en", "literal": "...", "idiomatic": null, "translator": "..."}]
 *
 * Special handling:
 * - Herbert J. Allen (1894) translations go to "idiomatic" field
 * - All other translations go to "literal" field with "idiomatic": null
 *
 * Usage: node migrate-to-dual-translations.js
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = './data';
const SHIJI_DIR = path.join(DATA_DIR, 'shiji');

// Process all sentence translations (paragraph sentences and table headers)
function migrateSentenceTranslations(sentences) {
  if (!sentences) return;

  for (const sentence of sentences) {
    if (sentence.translations && sentence.translations.length > 0) {
      for (const translation of sentence.translations) {
        if (translation.text !== undefined && translation.literal === undefined) {
          // Check if this is a Herbert J. Allen translation
          const isHerbertAllen = translation.translator === 'Herbert J. Allen (1894)';

          if (isHerbertAllen) {
            // Herbert J. Allen translations go to idiomatic
            translation.idiomatic = translation.text;
            translation.literal = null;
          } else {
            // All other translations go to literal
            translation.literal = translation.text;
            translation.idiomatic = null;
          }

          // Remove old field
          delete translation.text;
        }
      }
    }
  }
}

// Process table cell translations
function migrateCellTranslations(cells) {
  if (!cells) return;

  for (const cell of cells) {
    if (cell.translation !== undefined && cell.literal === undefined) {
      // Check if this is a Herbert J. Allen translation
      const isHerbertAllen = cell.translator === 'Herbert J. Allen (1894)';

      if (isHerbertAllen) {
        // Herbert J. Allen translations go to idiomatic
        cell.idiomatic = cell.translation;
        cell.literal = null;
      } else {
        // All other translations go to literal
        cell.literal = cell.translation;
        cell.idiomatic = null;
      }

      // Remove old field
      delete cell.translation;
    }
  }
}

// Process paragraph-level translations
function migrateParagraphTranslations(translations) {
  if (!translations) return;

  for (const translation of translations) {
    if (translation.text !== undefined && translation.literal === undefined) {
      // Check if this is a Herbert J. Allen translation
      const isHerbertAllen = translation.translator === 'Herbert J. Allen (1894)';

      if (isHerbertAllen) {
        // Herbert J. Allen translations go to idiomatic
        translation.idiomatic = translation.text;
        translation.literal = null;
      } else {
        // All other translations go to literal
        translation.literal = translation.text;
        translation.idiomatic = null;
      }

      // Remove old field
      delete translation.text;
    }
  }
}

function processChapterFile(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Process content blocks
    for (const block of data.content) {
      if (block.type === 'paragraph') {
        migrateSentenceTranslations(block.sentences);
        migrateParagraphTranslations(block.translations);
      } else if (block.type === 'table_row') {
        migrateCellTranslations(block.cells);
      } else if (block.type === 'table_header') {
        migrateSentenceTranslations(block.sentences);
      }
    }

    // Write back the migrated data
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Migrated ${filePath}`);
  } catch (err) {
    console.error(`❌ Error processing ${filePath}: ${err.message}`);
  }
}

function main() {
  console.log('🔄 Starting migration to dual-translation schema...');
  console.log('📝 Converting "text" fields to "literal"/"idiomatic" structure');
  console.log('🎯 Herbert J. Allen (1894) translations → "idiomatic" field');
  console.log('📋 All other translations → "literal" field\n');

  const chapterFiles = fs.readdirSync(SHIJI_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(SHIJI_DIR, file));

  console.log(`Found ${chapterFiles.length} chapter files to process...\n`);

  for (const filePath of chapterFiles) {
    processChapterFile(filePath);
  }

  console.log('\n✅ Migration complete!');
  console.log('🔧 Remember to update all scripts to use the new schema');
  console.log('📊 Run "make update" to refresh counts and manifest');
}

main();
