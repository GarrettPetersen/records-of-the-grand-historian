#!/usr/bin/env node

/**
 * clean-houhanshu-translations.js - Clean erroneous translations from Houhanshu
 *
 * Removes boilerplate copyright text that was incorrectly scraped as translations
 */

import fs from 'fs';
import path from 'path';

const HOUSHU_DIR = './data/houhanshu';

// Boilerplate text patterns to remove
const BOILERPLATE_PATTERNS = [
  /Chinese text: This work was published before January 1, 1923, and is in the\./i,
  /This work was published before January 1, 1923/i,
  /Chinese text:/i
];

function isBoilerplate(text) {
  if (!text || text.trim() === '') return false;
  return BOILERPLATE_PATTERNS.some(pattern => pattern.test(text));
}

function cleanChapter(filePath) {
  console.log(`Cleaning: ${path.basename(filePath)}`);

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let cleaned = 0;

  // Clean paragraph sentences
  for (const block of data.content) {
    if (block.type === 'paragraph') {
      for (const sentence of block.sentences) {
        if (sentence.translations && sentence.translations.length > 0) {
          const trans = sentence.translations[0];
          if (isBoilerplate(trans.literal)) {
            trans.literal = '';
            cleaned++;
            console.log(`  Removed literal: "${trans.literal.slice(0, 50)}..."`);
          }
          if (isBoilerplate(trans.idiomatic)) {
            trans.idiomatic = '';
            cleaned++;
            console.log(`  Removed idiomatic: "${trans.idiomatic.slice(0, 50)}..."`);
          }
          // Clear translator if it was incorrectly set
          if ((trans.literal === '' && trans.idiomatic === '') && trans.translator) {
            trans.translator = '';
          }
        }
      }

      // Clean block-level translations too
      if (block.translations && block.translations.length > 0) {
        const trans = block.translations[0];
        if (isBoilerplate(trans.literal)) {
          trans.literal = '';
          cleaned++;
        }
        if (isBoilerplate(trans.idiomatic)) {
          trans.idiomatic = '';
          cleaned++;
        }
        if ((trans.literal === '' && trans.idiomatic === '') && trans.translator) {
          trans.translator = '';
        }
      }
    }

    // Clean table content too
    if (block.type === 'table_row') {
      for (const cell of block.cells) {
        if (cell.translations && cell.translations.length > 0) {
          const trans = cell.translations[0];
          if (isBoilerplate(trans.literal)) {
            trans.literal = '';
            cleaned++;
          }
          if (isBoilerplate(trans.idiomatic)) {
            trans.idiomatic = '';
            cleaned++;
          }
          if ((trans.literal === '' && trans.idiomatic === '') && trans.translator) {
            trans.translator = '';
          }
        }
      }
    }
  }

  if (cleaned > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`  Cleaned ${cleaned} erroneous translations`);
  } else {
    console.log(`  No erroneous translations found`);
  }

  return cleaned;
}

function main() {
  console.log('🧹 Cleaning erroneous translations from Houhanshu...\n');

  if (!fs.existsSync(HOUSHU_DIR)) {
    console.error(`Houhanshu directory not found: ${HOUSHU_DIR}`);
    return;
  }

  let totalCleaned = 0;
  const files = fs.readdirSync(HOUSHU_DIR)
    .filter(file => file.endsWith('.json'))
    .sort();

  for (const file of files) {
    const filePath = path.join(HOUSHU_DIR, file);
    totalCleaned += cleanChapter(filePath);
  }

  console.log(`\n✅ Cleaned ${totalCleaned} erroneous translations total`);
  console.log('Run "make update" to update the progress tracking');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}


