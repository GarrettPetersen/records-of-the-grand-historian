#!/usr/bin/env node

/**
 * validate-translations.js - Validate translation files against chapter structure
 *
 * Usage: node validate-translations.js <chapter-file> <translations-file...>
 */

import fs from 'node:fs';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node validate-translations.js <chapter-file> <translations-file...>');
  process.exit(1);
}

const chapterFile = args[0];
const translationFiles = args.slice(1);

console.log(`🔍 Validating translations for ${chapterFile}\n`);

// Load chapter
const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));

// Collect all sentence IDs from chapter
const chapterIds = new Set();
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
    if (sentence.id) {
      chapterIds.add(sentence.id);
    }
  }
}

console.log(`📖 Chapter contains ${chapterIds.size} sentences`);

// Load and validate translation files
let allTranslations = {};
let totalTranslations = 0;
let validationErrors = 0;

for (const file of translationFiles) {
  try {
    const translations = JSON.parse(fs.readFileSync(file, 'utf8'));
    const translationCount = Object.keys(translations).length;
    totalTranslations += translationCount;

    console.log(`📄 ${file}: ${translationCount} translations`);

    // Check each translation
    for (const [id, translation] of Object.entries(translations)) {
      if (!chapterIds.has(id)) {
        console.error(`❌ ERROR: Translation file contains ID "${id}" not found in chapter`);
        validationErrors++;
      }

      if (!translation || typeof translation !== 'string' || !translation.trim()) {
        console.error(`❌ ERROR: Translation for ${id} is empty or invalid`);
        validationErrors++;
      }

      // Store for cross-validation
      if (allTranslations[id]) {
        console.warn(`⚠️  WARNING: Duplicate translation for ${id}`);
      }
      allTranslations[id] = translation;
    }
  } catch (err) {
    console.error(`❌ ERROR: Could not parse ${file}: ${err.message}`);
    validationErrors++;
  }
}

console.log(`\n📊 Validation Summary:`);
console.log(`   Translations loaded: ${totalTranslations}`);
console.log(`   Chapter sentences: ${chapterIds.size}`);
console.log(`   Validation errors: ${validationErrors}`);

if (validationErrors === 0) {
  console.log(`✅ All translations validated successfully!`);
} else {
  console.log(`❌ Validation failed with ${validationErrors} errors.`);
  process.exit(1);
}

// Check for missing translations
const translatedIds = new Set(Object.keys(allTranslations));
const missingTranslations = [...chapterIds].filter(id => !translatedIds.has(id));

if (missingTranslations.length > 0) {
  console.log(`\nℹ️  Note: ${missingTranslations.length} sentences still untranslated`);
}
