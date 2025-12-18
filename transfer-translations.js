#!/usr/bin/env node

/**
 * transfer-translations.js - Transfer translations between chapter files by matching Chinese text
 *
 * Usage: node transfer-translations.js <source-file> <target-file> <translator> <model>
 */

import fs from 'node:fs';

const args = process.argv.slice(2);
if (args.length < 4) {
  console.error('Usage: node transfer-translations.js <source-file> <target-file> <translator> <model>');
  process.exit(1);
}

const sourceFile = args[0];
const targetFile = args[1];
const translator = args[2];
const model = args[3];

console.log(`Transferring translations from ${sourceFile} to ${targetFile}`);

// Read both files
const sourceChapter = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
const targetChapter = JSON.parse(fs.readFileSync(targetFile, 'utf8'));

// Create a map of Chinese text -> translation from source
const translationMap = new Map();

console.log('Building translation map from source file...');

// Process paragraphs
for (const block of sourceChapter.content) {
  if (block.type === 'paragraph') {
    for (const sentence of block.sentences) {
      if (sentence.translations && sentence.translations[0] && sentence.translations[0].text) {
        const chinese = sentence.zh.trim();
        const translation = sentence.translations[0];
        if (chinese) {
          translationMap.set(chinese, {
            text: translation.text,
            translator: translation.translator || translator,
            model: translation.model || model
          });
        }
      }
    }
  }
}

// Process table headers
for (const block of sourceChapter.content) {
  if (block.type === 'table_header') {
    for (const sentence of block.sentences) {
      if (sentence.translations && sentence.translations[0] && sentence.translations[0].text) {
        const chinese = sentence.zh.trim();
        const translation = sentence.translations[0];
        if (chinese) {
          translationMap.set(chinese, {
            text: translation.text,
            translator: translation.translator || translator,
            model: translation.model || model
          });
        }
      }
    }
  }
}

// Process table rows
for (const block of sourceChapter.content) {
  if (block.type === 'table_row') {
    for (const cell of block.cells) {
      if (cell.translation && cell.translation.trim()) {
        const chinese = cell.content.trim();
        if (chinese) {
          translationMap.set(chinese, {
            text: cell.translation,
            translator: cell.translator || translator,
            model: cell.model || model
          });
        }
      }
    }
  }
}

console.log(`Found ${translationMap.size} translations in source file`);

// Now apply translations to target file
let appliedCount = 0;

console.log('Applying translations to target file...');

// Process paragraphs
for (const block of targetChapter.content) {
  if (block.type === 'paragraph') {
    for (const sentence of block.sentences) {
      const chinese = sentence.zh.trim();
      if (chinese && translationMap.has(chinese)) {
        const translation = translationMap.get(chinese);
        sentence.translations[0] = {
          lang: 'en',
          text: translation.text,
          translator: translation.translator,
          model: translation.model
        };
        appliedCount++;
      }
    }
  }
}

// Process table headers
for (const block of targetChapter.content) {
  if (block.type === 'table_header') {
    for (const sentence of block.sentences) {
      const chinese = sentence.zh.trim();
      if (chinese && translationMap.has(chinese)) {
        const translation = translationMap.get(chinese);
        sentence.translations[0] = {
          lang: 'en',
          text: translation.text,
          translator: translation.translator,
          model: translation.model
        };
        appliedCount++;
      }
    }
  }
}

// Process table rows
for (const block of targetChapter.content) {
  if (block.type === 'table_row') {
    for (const cell of block.cells) {
      const chinese = cell.content.trim();
      if (chinese && translationMap.has(chinese)) {
        const translation = translationMap.get(chinese);
        cell.translation = translation.text;
        cell.translator = translation.translator;
        cell.model = translation.model;
        appliedCount++;
      }
    }
  }
}

// Update metadata
targetChapter.meta.translators = [{
  name: translator,
  sentences: appliedCount
}];
targetChapter.meta.citation = `Translation: ${translator}`;
targetChapter.meta.translatedCount = appliedCount;

// Write the updated target file
fs.writeFileSync(targetFile, JSON.stringify(targetChapter, null, 2));
console.log(`Applied ${appliedCount} translations to ${targetFile}`);
