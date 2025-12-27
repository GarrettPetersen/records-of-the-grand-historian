#!/usr/bin/env node

/**
 * submit-translations.js - Submit translations from a translation session
 *
 * Validates and applies translations from the JSON file created by start-translation.js,
 * then runs quality checks and cleans up.
 *
 * Usage:
 *   node submit-translations.js <translation-file> <translator> <model>
 *   node submit-translations.js translations/current_translation.json "Garrett M. Petersen (2025)" "grok-1.5"
 */

import fs from 'node:fs';
import path from 'node:path';

function validateTranslations(translationFile, chapterFile) {
  const translations = JSON.parse(fs.readFileSync(translationFile, 'utf8'));
  const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));

  const errors = [];
  let identicalCount = 0;

  for (const sentence of translations.sentences) {
    // Check if literal is empty
    if (!sentence.literal || !sentence.literal.trim()) {
      errors.push(`Missing literal translation for sentence ${sentence.id}. Please provide both literal and idiomatic translations for each sentence.`);
    }

    // Check if idiomatic is empty
    if (!sentence.idiomatic || !sentence.idiomatic.trim()) {
      errors.push(`Missing idiomatic translation for sentence ${sentence.id}. Please provide both literal and idiomatic translations for each sentence.`);
    }

    // Check if literal and idiomatic are identical (after trimming)
    if (sentence.literal && sentence.idiomatic &&
        sentence.literal.trim() === sentence.idiomatic.trim()) {
      identicalCount++;
    }

    // Find the corresponding sentence in the chapter file
    let found = false;
    for (const block of chapter.content) {
      let blockSentences = [];

      if (block.type === 'paragraph') {
        blockSentences = block.sentences;
      } else if (block.type === 'table_row') {
        blockSentences = block.cells;
      } else if (block.type === 'table_header') {
        blockSentences = block.sentences;
      }

      for (const chapterSentence of blockSentences) {
        let chapterChinese = '';
        let chapterId = '';

        if (block.type === 'paragraph') {
          chapterChinese = chapterSentence.zh;
          chapterId = chapterSentence.id;
        } else if (block.type === 'table_row') {
          chapterChinese = chapterSentence.content;
          chapterId = chapterSentence.id;
        } else if (block.type === 'table_header') {
          chapterChinese = chapterSentence.zh;
          chapterId = chapterSentence.id;
        }

        if (chapterId === sentence.id) {
          if (chapterChinese !== sentence.chinese) {
            errors.push(`Chinese text mismatch for sentence ${sentence.id}: expected "${chapterChinese}", got "${sentence.chinese}"`);
          }
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      errors.push(`Sentence ${sentence.id} not found in chapter file`);
    }
  }

  // Check if too many translations are identical
  const totalSentences = translations.sentences.length;
  if (totalSentences > 0 && identicalCount === totalSentences) {
    errors.push(`❌ SHORTCUT DETECTED: All ${totalSentences} literal and idiomatic translations are identical.`);
    errors.push(`You cannot just copy literal translations to fill idiomatic fields.`);
    errors.push(`Please provide distinct, high-quality idiomatic translations for each sentence.`);
    errors.push(`Each idiomatic translation should be more natural and flowing while maintaining semantic fidelity.`);
  }

  return errors;
}

function applyTranslations(translationFile, chapterFile, translator, model) {
  const translations = JSON.parse(fs.readFileSync(translationFile, 'utf8'));
  const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));

  console.log(`Applying ${translations.sentences.length} translations to ${chapterFile}`);

  for (const sentence of translations.sentences) {
    // Find and update the sentence in the chapter
    for (const block of chapter.content) {
      let blockSentences = [];

      if (block.type === 'paragraph') {
        blockSentences = block.sentences;
      } else if (block.type === 'table_row') {
        blockSentences = block.cells;
      } else if (block.type === 'table_header') {
        blockSentences = block.sentences;
      }

      for (const chapterSentence of blockSentences) {
        let chapterId = '';

        if (block.type === 'paragraph') {
          chapterId = chapterSentence.id;
        } else if (block.type === 'table_row') {
          chapterId = chapterSentence.id;
        } else if (block.type === 'table_header') {
          chapterId = chapterSentence.id;
        }

        if (chapterId === sentence.id) {
          if (block.type === 'paragraph') {
            if (!chapterSentence.translations) {
              chapterSentence.translations = [];
            }
            if (chapterSentence.translations.length === 0) {
              chapterSentence.translations.push({});
            }
            chapterSentence.translations[0].translator = translator;
            chapterSentence.translations[0].model = model;
            chapterSentence.translations[0].literal = sentence.literal;
            chapterSentence.translations[0].idiomatic = sentence.idiomatic;
          } else if (block.type === 'table_row') {
            chapterSentence.literal = sentence.literal;
            chapterSentence.idiomatic = sentence.idiomatic;
          } else if (block.type === 'table_header') {
            if (!chapterSentence.translations) {
              chapterSentence.translations = [];
            }
            if (chapterSentence.translations.length === 0) {
              chapterSentence.translations.push({});
            }
            chapterSentence.translations[0].translator = translator;
            chapterSentence.translations[0].model = model;
            chapterSentence.translations[0].literal = sentence.literal;
            chapterSentence.translations[0].idiomatic = sentence.idiomatic;
          }
          break;
        }
      }
    }
  }

  // Recalculate translatedCount
  let translatedCount = 0;
  for (const block of chapter.content) {
    if (block.type === 'paragraph') {
      for (const sentence of block.sentences || []) {
        if (sentence.translations?.[0]?.idiomatic?.trim()) {
          translatedCount++;
        }
      }
    } else if (block.type === 'table_row') {
      for (const cell of block.cells || []) {
        if (cell.idiomatic && cell.idiomatic.trim()) {
          translatedCount++;
        }
      }
    } else if (block.type === 'table_header') {
      for (const sentence of block.sentences || []) {
        if (sentence.translations?.[0]?.idiomatic?.trim()) {
          translatedCount++;
        }
      }
    }
  }
  chapter.meta.translatedCount = translatedCount;

  fs.writeFileSync(chapterFile, JSON.stringify(chapter, null, 2));
  console.log(`Applied translations. Updated translated count: ${translatedCount}`);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error('Usage: node submit-translations.js <translation-file> <translator> <model>');
    console.error('Example: node submit-translations.js translations/current_translation.json "Garrett M. Petersen (2025)" "grok-1.5"');
    process.exit(1);
  }

  const translationFile = args[0];
  const translator = args[1];
  const model = args[2];

  if (!fs.existsSync(translationFile)) {
    console.error(`Translation file not found: ${translationFile}`);
    process.exit(1);
  }

  const translations = JSON.parse(fs.readFileSync(translationFile, 'utf8'));
  const chapterFile = translations.metadata.file;

  if (!fs.existsSync(chapterFile)) {
    console.error(`Chapter file not found: ${chapterFile}`);
    process.exit(1);
  }

  console.log(`Validating translations from ${translationFile}...`);

  const errors = validateTranslations(translationFile, chapterFile);
  if (errors.length > 0) {
    console.error('Validation errors:');
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log('✅ Validation passed. Applying translations...');

  applyTranslations(translationFile, chapterFile, translator, model);

  console.log('🧹 Cleaning up translation file...');
  fs.unlinkSync(translationFile);
  console.log(`Deleted: ${translationFile}`);

  console.log('✅ Translations applied successfully!');
}

main();
