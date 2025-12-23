#!/usr/bin/env node

/**
 * migrate-hanshu-translations.js - Migrate hanshu chapters from legacy "text" field to "literal"/"idiomatic" fields
 *
 * This script updates all hanshu chapters to use the new dual-translation format:
 * - Existing "text" fields become "literal" fields
 * - New "idiomatic" fields are added (empty for manual translation)
 */

import fs from 'node:fs';
import path from 'node:path';

const HANSHU_DIR = 'data/hanshu';

function migrateChapter(filePath) {
  console.log(`Migrating ${filePath}...`);

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let modified = false;

  // Process content blocks
  for (const block of data.content) {
    if (block.type === 'paragraph') {
      // Process paragraph sentences
      for (const sentence of block.sentences) {
        if (sentence.translations && sentence.translations.length > 0) {
          const translation = sentence.translations[0];
          if (translation.text !== undefined) {
            // Migrate from old format to new format
            translation.literal = translation.text;
            translation.idiomatic = '';
            delete translation.text;
            modified = true;
          }
        }
      }

      // Process paragraph-level translations
      if (block.translations && block.translations.length > 0) {
        const translation = block.translations[0];
        if (translation.text !== undefined) {
          translation.literal = translation.text;
          translation.idiomatic = '';
          delete translation.text;
          modified = true;
        }
      }
    } else if (block.type === 'table_row') {
      // Process table cells
      for (const cell of block.cells) {
        if (cell.translation !== undefined) {
          // Table cells use "translation" field instead of "translations" array
          cell.literal = cell.translation;
          cell.idiomatic = '';
          delete cell.translation;
          modified = true;
        }
      }
    } else if (block.type === 'table_header') {
      // Process table header sentences
      for (const sentence of block.sentences) {
        if (sentence.translations && sentence.translations.length > 0) {
          const translation = sentence.translations[0];
          if (translation.text !== undefined) {
            translation.literal = translation.text;
            translation.idiomatic = '';
            delete translation.text;
            modified = true;
          }
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`  ✅ Migrated ${filePath}`);
  } else {
    console.log(`  ℹ️  No changes needed for ${filePath}`);
  }

  return modified;
}

function main() {
  if (!fs.existsSync(HANSHU_DIR)) {
    console.error(`Directory ${HANSHU_DIR} does not exist`);
    process.exit(1);
  }

  const files = fs.readdirSync(HANSHU_DIR)
    .filter(f => f.endsWith('.json'))
    .sort();

  console.log(`Found ${files.length} hanshu chapters to process`);

  let migratedCount = 0;
  for (const file of files) {
    const filePath = path.join(HANSHU_DIR, file);
    if (migrateChapter(filePath)) {
      migratedCount++;
    }
  }

  console.log(`\nMigration complete! Migrated ${migratedCount} out of ${files.length} files.`);
}

main();
