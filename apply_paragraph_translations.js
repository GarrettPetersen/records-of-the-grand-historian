#!/usr/bin/env node

/**
 * apply-paragraph-translations.js - Apply translations to paragraph sentences in chapter files
 *
 * Usage: node apply-paragraph-translations.js <chapter-file> <translations-file>
 */

import fs from 'node:fs';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node apply-paragraph-translations.js <chapter-file> <translations-file>');
  process.exit(1);
}

const chapterFile = args[0];
const translationFile = args[1];

const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));
const translations = JSON.parse(fs.readFileSync(translationFile, 'utf8'));

console.log(`Loaded ${Object.keys(translations).length} translations from ${translationFile}`);

let appliedCount = 0;

for (const block of chapter.content) {
  if (block.type === 'paragraph' && block.sentences) {
    for (const sentence of block.sentences) {
      const translation = translations[sentence.id];
      if (translation && translation.trim()) {
        if (!sentence.translations) {
          sentence.translations = [];
        }
        // Check if we already have a translation
        const existingIndex = sentence.translations.findIndex(t => t.translator === 'Garrett M. Petersen (2025)');
        if (existingIndex >= 0) {
          sentence.translations[existingIndex].text = translation;
        } else {
          sentence.translations.push({
            lang: 'en',
            text: translation,
            translator: 'Garrett M. Petersen (2025)',
            model: 'grok-1.5'
          });
        }
        appliedCount++;
      }
    }
  }
}

console.log(`Applied ${appliedCount} translations to ${chapterFile}`);

fs.writeFileSync(chapterFile, JSON.stringify(chapter, null, 2));
