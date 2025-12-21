#!/usr/bin/env node

/**
 * apply-translations.js - Apply translations from a JSON lookup to a chapter file
 * 
 * Usage: node apply-translations.js <chapter-file> <translations-file> <translator> <model>
 */

import fs from 'node:fs';

// Regular expressions for validation
const CHINESE_CHARS_REGEX = /[\u4e00-\u9fff]/;

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: node apply-translations.js <chapter-file> <translations-file...> <translator> <model>');
  process.exit(1);
}

const chapterFile = args[0];
const translator = args[args.length - 2];
const model = args[args.length - 1];
const translationFiles = args.slice(1, -2);

if (!chapterFile || translationFiles.length === 0 || !translator || !model) {
  console.error('Usage: node apply-translations.js <chapter-file> <translations-file...> <translator> <model>');
  process.exit(1);
}

const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));

// Merge all translation files
let translations = {};
let totalTranslationsLoaded = 0;

for (const file of translationFiles) {
  try {
    const fileTranslations = JSON.parse(fs.readFileSync(file, 'utf8'));
    const fileTranslationCount = Object.keys(fileTranslations).length;
    totalTranslationsLoaded += fileTranslationCount;

    // Validate that translations are actually English (not Chinese)
    let chineseCharsFound = 0;
    let englishTranslations = 0;

    for (const [id, text] of Object.entries(fileTranslations)) {
      if (text && typeof text === 'string') {
        if (CHINESE_CHARS_REGEX.test(text)) {
          chineseCharsFound++;
        } else if (text.trim().length > 0) {
          englishTranslations++;
        }
      }
    }

    if (chineseCharsFound > englishTranslations) {
      console.error(`Error: ${file} appears to contain Chinese text instead of English translations!`);
      console.error(`  Chinese text found: ${chineseCharsFound}, English translations: ${englishTranslations}`);
      process.exit(1);
    }

    translations = { ...translations, ...fileTranslations };
    console.log(`Loaded ${fileTranslationCount} translations from ${file}`);
  } catch (err) {
    console.error(`Warning: Could not load translations from ${file}: ${err.message}`);
  }
}

console.log(`Total translations loaded: ${totalTranslationsLoaded}`);

let translatedCount = 0;

for (const block of chapter.content) {
  let sentences = [];

  if (block.type === 'paragraph') {
    sentences = block.sentences;
  } else if (block.type === 'table_row') {
    sentences = block.cells;
  } else if (block.type === 'table_header') {
    sentences = block.sentences;
  }

  if (sentences.length === 0) continue;

  for (const sentence of sentences) {
    const translation = translations[sentence.id];
    if (translation && translation.trim()) {
      // Only apply translations to sentences/cells with non-empty content
      const hasContent = (block.type === 'table_row' && sentence.content && sentence.content.trim()) ||
                        (block.type !== 'table_row' && sentence.zh && sentence.zh.trim());

      if (hasContent) {
        // Check if translation already exists and warn about overwrites
        const existingTranslation = block.type === 'table_row' ?
          sentence.translation :
          (sentence.translations && sentence.translations[0] && sentence.translations[0].text);

        if (existingTranslation && existingTranslation.trim()) {
          console.warn(`Warning: Overwriting existing translation for ${sentence.id}`);
          console.warn(`  Old: "${existingTranslation}"`);
          console.warn(`  New: "${translation}"`);
        }

        // For table cells, set translation directly
        if (block.type === 'table_row') {
          sentence.translation = translation;
          sentence.translator = translator;
          sentence.model = model;
        } else {
          // For paragraph sentences, update the translations array
          if (!sentence.translations) sentence.translations = [];
          if (sentence.translations.length === 0) {
            sentence.translations.push({ lang: 'en', text: '', translator: '', model: '' });
          }
          sentence.translations[0].text = translation;
          sentence.translations[0].translator = translator;
          sentence.translations[0].model = model;
        }
        translatedCount++;
      } else {
        console.warn(`Warning: Skipping translation for ${sentence.id} - no content found`);
      }
    } else if (sentence.id in translations) {
      console.warn(`Warning: Empty translation for ${sentence.id} - skipping`);
    }
  }


  // Update block-level translation by concatenating sentence translations (for paragraphs)
  if (block.type === 'paragraph') {
    const paragraphText = sentences
      .map(s => s.translations?.[0]?.text || '')
      .filter(t => t)
      .join(' ');

    if (paragraphText) {
      block.translations = [{
        lang: 'en',
        text: paragraphText,
        translator: translator,
        model: model
      }];
    }
  }
}

// Recalculate total translated count across all sentences
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
    if (sentence.translations && sentence.translations.length > 0 && sentence.translations[0].text) {
      totalTranslated++;
    }
  }
}

// Update metadata
chapter.meta.translatedCount = totalTranslated;
chapter.meta.translators = [{
  name: translator,
  paragraphs: chapter.content.filter(b => b.type === 'paragraph').length,
  sentences: totalTranslated
}];
chapter.meta.citation = `Translation: ${translator}`;

fs.writeFileSync(chapterFile, JSON.stringify(chapter, null, 2), 'utf8');

console.log(`Applied ${translatedCount} translations to ${chapterFile}`);
