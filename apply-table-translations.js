#!/usr/bin/env node

/**
 * apply-table-translations.js - Apply translations to table cells in chapter files
 * 
 * Usage: node apply-table-translations.js <chapter-file> <translations-file>
 */

import fs from 'node:fs';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node apply-table-translations.js <chapter-file> <translations-file>');
  process.exit(1);
}

const chapterFile = args[0];
const translationFile = args[1];

const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));
const translations = JSON.parse(fs.readFileSync(translationFile, 'utf8'));

console.log(`Loaded ${Object.keys(translations).length} translations from ${translationFile}`);

let appliedCount = 0;

for (const block of chapter.content) {
  if (block.type === 'table_row' && block.cells) {
    for (const cell of block.cells) {
      const translation = translations[cell.id];
      if (translation && translation.trim()) {
        cell.translation = translation;
        appliedCount++;
      }
    }
  }
}

console.log(`Applied ${appliedCount} translations to ${chapterFile}`);

fs.writeFileSync(chapterFile, JSON.stringify(chapter, null, 2));
