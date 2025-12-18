#!/usr/bin/env node

/**
 * translation-workflow.js - Extract, translate, and apply translations for chapters
 *
 * Usage:
 *   node translation-workflow.js extract <book> <chapter> [--output <file>]
 *   node translation-workflow.js apply <book> <chapter> <translations-file> <translator> <model>
 *   node translation-workflow.js status <book> <chapter>
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error(`
Usage:
  node translation-workflow.js extract <book> <chapter> [--output <file>] [--include-translated]
    Extract untranslated sentences for translation
    Use --include-translated to extract ALL sentences (translated + untranslated) for QA

  node translation-workflow.js apply <book> <chapter> <translations-file> <translator> <model>
    Apply translations/corrections from file to chapter

  node translation-workflow.js status <book> <chapter>
    Show translation status of chapter

Examples:
  # Extract only untranslated sentences
  node translation-workflow.js extract shiji 014

  # Extract all sentences for QA (to check/fix existing translations)
  node translation-workflow.js extract shiji 014 --include-translated --output chapter14_all.json

  # Apply new translations or corrections
  node translation-workflow.js apply shiji 014 my_corrections.json "Garrett M. Petersen (2025)" "Grok"

  # Check progress
  node translation-workflow.js status shiji 014
`);
  process.exit(1);
}

const command = args[0];
const book = args[1];
const chapter = args[2];

function getChapterPath(book, chapter) {
  const chapterFile = `${String(chapter).padStart(3, '0')}.json`;
  return path.join('data', book, chapterFile);
}

function loadChapter(book, chapter) {
  const chapterPath = getChapterPath(book, chapter);
  if (!fs.existsSync(chapterPath)) {
    console.error(`Chapter file not found: ${chapterPath}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
}

function saveChapter(book, chapter, data) {
  const chapterPath = getChapterPath(book, chapter);
  fs.writeFileSync(chapterPath, JSON.stringify(data, null, 2), 'utf8');
}

function extractSentences(chapterData, includeTranslated = false) {
  const sentences = {};

  for (const block of chapterData.content) {
    let sentenceList = [];

    if (block.type === 'paragraph') {
      sentenceList = block.sentences;
    } else if (block.type === 'table_row') {
      sentenceList = block.cells;
    } else if (block.type === 'table_header') {
      sentenceList = block.sentences;
    }

    for (const sentence of sentenceList) {
      // Check if sentence has translation
      const hasTranslation = sentence.translation ||
                           (sentence.translations && sentence.translations.length > 0 && sentence.translations[0].text);

      if (!includeTranslated && !hasTranslation) {
        // Only untranslated sentences
        sentences[sentence.id] = sentence.zh || sentence.content;
      } else if (includeTranslated) {
        // Include all sentences with their current translations
        const chinese = sentence.zh || sentence.content;
        const english = sentence.translation ||
                       (sentence.translations && sentence.translations.length > 0 ? sentence.translations[0].text : '');

        sentences[sentence.id] = {
          chinese: chinese,
          english: english,
          hasTranslation: !!english.trim()
        };
      }
    }
  }

  return sentences;
}

function applyTranslations(chapterData, translations, translator, model) {
  let appliedCount = 0;

  for (const block of chapterData.content) {
    let sentences = [];

    if (block.type === 'paragraph') {
      sentences = block.sentences;
    } else if (block.type === 'table_row') {
      sentences = block.cells;
    } else if (block.type === 'table_header') {
      sentences = block.sentences;
    }

    for (const sentence of sentences) {
      const translation = translations[sentence.id];
      if (translation && translation.trim()) {
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
        appliedCount++;
      }
    }

    // Update block-level translation for paragraphs
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

  // Update metadata
  let totalTranslated = 0;
  for (const block of chapterData.content) {
    let sentences = [];
    if (block.type === 'paragraph') sentences = block.sentences;
    else if (block.type === 'table_row') sentences = block.cells;
    else if (block.type === 'table_header') sentences = block.sentences;

    for (const sentence of sentences) {
      const hasTranslation = sentence.translation ||
                           (sentence.translations && sentence.translations.length > 0 && sentence.translations[0].text);
      if (hasTranslation) totalTranslated++;
    }
  }

  chapterData.meta.translatedCount = totalTranslated;
  chapterData.meta.translators = [{
    name: translator,
    paragraphs: chapterData.content.filter(b => b.type === 'paragraph').length,
    sentences: totalTranslated
  }];
  chapterData.meta.citation = `Translation: ${translator}`;

  return appliedCount;
}

function showStatus(chapterData) {
  let totalSentences = 0;
  let translatedSentences = 0;

  for (const block of chapterData.content) {
    let sentences = [];
    if (block.type === 'paragraph') sentences = block.sentences;
    else if (block.type === 'table_row') sentences = block.cells;
    else if (block.type === 'table_header') sentences = block.sentences;

    totalSentences += sentences.length;

    for (const sentence of sentences) {
      const hasTranslation = sentence.translation ||
                           (sentence.translations && sentence.translations.length > 0 && sentence.translations[0].text);
      if (hasTranslation) translatedSentences++;
    }
  }

  const percentage = totalSentences > 0 ? Math.round((translatedSentences / totalSentences) * 100) : 0;

  console.log(`Chapter ${chapterData.meta.chapter} Status:`);
  console.log(`  Total sentences: ${totalSentences}`);
  console.log(`  Translated: ${translatedSentences}`);
  console.log(`  Percentage: ${percentage}%`);

  if (chapterData.meta.translators && chapterData.meta.translators.length > 0) {
    console.log(`  Translator: ${chapterData.meta.translators[0].name}`);
  }
}

// Main command handling
if (command === 'extract') {
  const chapterData = loadChapter(book, chapter);

  // Check for --include-translated flag
  const includeTranslated = args.includes('--include-translated');
  const sentences = extractSentences(chapterData, includeTranslated);

  const totalCount = Object.keys(sentences).length;
  const translatedCount = Object.values(sentences).filter(s =>
    typeof s === 'object' ? s.hasTranslation : false
  ).length;
  const untranslatedCount = totalCount - translatedCount;

  if (includeTranslated) {
    console.log(`Extracted ${totalCount} sentences (${translatedCount} translated, ${untranslatedCount} untranslated) from ${book} chapter ${chapter}`);
  } else {
    console.log(`Found ${untranslatedCount} untranslated sentences in ${book} chapter ${chapter}`);
    if (untranslatedCount === 0) {
      console.log('All sentences are already translated!');
      process.exit(0);
    }
  }

  // Check for --output flag
  let outputFile = includeTranslated ? `all_${book}_${chapter}.json` : `untranslated_${book}_${chapter}.json`;
  const outputIndex = args.indexOf('--output');
  if (outputIndex !== -1 && outputIndex + 1 < args.length) {
    outputFile = args[outputIndex + 1];
  }

  fs.writeFileSync(outputFile, JSON.stringify(sentences, null, 2), 'utf8');
  console.log(`Extracted to: ${outputFile}`);
  console.log('');

  if (includeTranslated) {
    console.log('Format for translations file (include only sentences you want to change):');
    console.log('{');
    console.log('  "s0001": "Corrected English translation here",');
    console.log('  "s0002": "Another corrected translation",');
    console.log('  ...');
    console.log('}');
    console.log('');
    console.log('Note: Empty strings or unchanged translations will be skipped.');
  } else {
    console.log('Format for translations file:');
    console.log('{');
    console.log('  "s0001": "English translation here",');
    console.log('  "s0002": "Another translation",');
    console.log('  ...');
    console.log('}');
  }

} else if (command === 'apply') {
  if (args.length < 5) {
    console.error('Usage: node translation-workflow.js apply <book> <chapter> <translations-file> <translator> <model>');
    process.exit(1);
  }

  const translationsFile = args[3];
  const translator = args[4];
  const model = args[5];

  if (!fs.existsSync(translationsFile)) {
    console.error(`Translations file not found: ${translationsFile}`);
    process.exit(1);
  }

  const chapterData = loadChapter(book, chapter);
  const translations = JSON.parse(fs.readFileSync(translationsFile, 'utf8'));

  const appliedCount = applyTranslations(chapterData, translations, translator, model);
  saveChapter(book, chapter, chapterData);

  console.log(`Applied ${appliedCount} translations to ${book} chapter ${chapter}`);
  console.log(`Updated by: ${translator} (${model})`);

} else if (command === 'status') {
  const chapterData = loadChapter(book, chapter);
  showStatus(chapterData);

} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
