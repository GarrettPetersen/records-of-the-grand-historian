#!/usr/bin/env node

/**
 * apply-translations.js - Apply translations from a JSON lookup to a chapter file
 * 
 * Usage: node apply-translations.js <chapter-file> <translations-file> <translator> <model>
 */

import fs from 'node:fs';

const chapterFile = process.argv[2];
const translationsFile = process.argv[3];
const translator = process.argv[4];
const model = process.argv[5];

if (!chapterFile || !translationsFile || !translator || !model) {
  console.error('Usage: node apply-translations.js <chapter-file> <translations-file> <translator> <model>');
  process.exit(1);
}

const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));
const translations = JSON.parse(fs.readFileSync(translationsFile, 'utf8'));

let translatedCount = 0;

for (const block of chapter.content) {
  let sentences = [];

  if (block.type === 'paragraph') {
    sentences = block.sentences;
  } else if (block.type === 'table_row') {
    sentences = block.cells.events;
  } else if (block.type === 'table_header') {
    sentences = block.sentences;
  }

  if (sentences.length === 0) continue;

  for (const sentence of sentences) {
    const translation = translations[sentence.id];
    if (translation && translation.trim()) {
      sentence.translations = [{
        lang: 'en',
        text: translation,
        translator: translator,
        model: model
      }];
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
    sentences = block.cells.events;
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
