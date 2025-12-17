#!/usr/bin/env node

/**
 * apply-translations.js - Apply translations from a JSON lookup to a chapter file
 * 
 * Usage: node apply-translations.js <chapter-file> <translations-file> <translator> <model>
 */

import fs from 'node:fs';

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
for (const file of translationFiles) {
  try {
    const fileTranslations = JSON.parse(fs.readFileSync(file, 'utf8'));
    translations = { ...translations, ...fileTranslations };
  } catch (err) {
    console.error(`Warning: Could not load translations from ${file}: ${err.message}`);
  }
}

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
      sentence.translation = translation;
      translatedCount++;
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
