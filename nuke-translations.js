#!/usr/bin/env node

/**
 * nuke-translations.js - Clear all translation text from a chapter
 *
 * This script clears all existing translation text by setting "text" fields to
 * empty strings, while preserving the JSON structure. Effectively resets the
 * chapter to an untranslated state. Use when automated translations are
 * detected and a clean reset is needed.
 *
 * Usage:
 *   node nuke-translations.js <chapter-file>
 *   node nuke-translations.js data/shiji/017.json
 */

import fs from 'fs';
import path from 'path';

function nukeTranslations(filePath) {
  console.log(`Clearing all translation text in ${filePath}...`);

  // Read the chapter file
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Function to recursively clear all translation text
  function clearTranslationText(obj) {
    // Clear paragraph-level translation text
    if (obj.translations && Array.isArray(obj.translations)) {
      for (const trans of obj.translations) {
        if (trans.text) trans.text = "";
        if (trans.translator) trans.translator = "";
        if (trans.model) delete trans.model;
      }
    }

    // Clear sentence-level translation text
    if (obj.sentences) {
      for (const sentence of obj.sentences) {
        if (sentence.translations && Array.isArray(sentence.translations)) {
          for (const trans of sentence.translations) {
            if (trans.text) trans.text = "";
            if (trans.translator) trans.translator = "";
            if (trans.model) delete trans.model;
          }
        }
        // Clear any direct translation fields
        if (sentence.translation) {
          sentence.translation = "";
        }
        // Clear metadata
        if (sentence.translator) delete sentence.translator;
        if (sentence.model) delete sentence.model;
      }
    }

    // Clear cell-level translation text
    if (obj.cells) {
      for (const cell of obj.cells) {
        if (cell.translation) {
          cell.translation = "";
        }
        if (cell.translator) delete cell.translator;
        if (cell.model) delete cell.model;
      }
    }

    // Recurse on children
    if (obj.children) {
      obj.children.forEach(clearTranslationText);
    }
  }

  // Clear all translation text from all content blocks
  if (data.content) {
    for (const block of data.content) {
      clearTranslationText(block);
    }
  }

  // Reset metadata
  data.meta.translatedCount = 0;
  data.meta.translators = [];
  data.meta.citation = null;

  // Write back the cleaned file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log(`✅ All translation text cleared from ${path.basename(filePath)}`);
  console.log(`📊 Chapter reset to 0% translated`);
}

// Main execution
if (process.argv.length !== 3) {
  console.error('Usage: node nuke-translations.js <chapter-file>');
  console.error('Example: node nuke-translations.js data/shiji/017.json');
  process.exit(1);
}

const filePath = process.argv[2];

if (!fs.existsSync(filePath)) {
  console.error(`Error: File ${filePath} does not exist`);
  process.exit(1);
}

try {
  nukeTranslations(filePath);
} catch (error) {
  console.error(`Error nuking translations: ${error.message}`);
  process.exit(1);
}
