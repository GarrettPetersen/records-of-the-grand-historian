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

    for (const [id, translation] of Object.entries(fileTranslations)) {
      let translationText = '';
      if (typeof translation === 'string') {
        // Legacy format
        translationText = translation;
      } else if (translation && typeof translation === 'object') {
        // New format with chinese/literal/idiomatic
        translationText = translation.idiomatic || translation.literal || '';
      }

      if (translationText && typeof translationText === 'string') {
        if (CHINESE_CHARS_REGEX.test(translationText)) {
          chineseCharsFound++;
        } else if (translationText.trim().length > 0) {
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

// Pre-validation: Check for potential issues before applying translations
console.log('\n🔍 Pre-validating translations...');

// 1. Check for non-existent IDs
const allSentenceIds = new Set();
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
      allSentenceIds.add(sentence.id);
    }
  }
}

const invalidIds = [];
for (const id of Object.keys(translations)) {
  if (!allSentenceIds.has(id)) {
    invalidIds.push(id);
  }
}

if (invalidIds.length > 0) {
  console.error(`❌ ERROR: Attempting to translate non-existent sentence IDs:`);
  invalidIds.forEach(id => console.error(`   - ${id}`));
  console.error('This suggests the translations were generated from different data.');
  console.error('Please verify the translations file matches the chapter file.');
  process.exit(1);
}

// 2. Check for problematic translations that would overwrite existing content
const problematicTranslations = [];
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
    if (sentence.id && sentence.id in translations) {
      const newTranslation = translations[sentence.id];
      const chineseContent = block.type === 'table_row' ? sentence.content : sentence.zh;

      // Check if sentence has content
      const hasChineseContent = chineseContent && chineseContent.trim();
      // Handle both legacy string format and new object format
      const hasNewTranslation = (typeof newTranslation === 'string' && newTranslation.trim()) ||
                               (newTranslation && typeof newTranslation === 'object' &&
                                (newTranslation.literal && newTranslation.literal.trim()) ||
                                (newTranslation.idiomatic && newTranslation.idiomatic.trim()));

      // Existing translation (if any) - check idiomatic first, then literal
      const existingTranslation = block.type === 'table_row' ?
        (sentence.idiomatic && sentence.idiomatic.trim()) || (sentence.literal && sentence.literal.trim()) :
        (sentence.translations && sentence.translations[0] &&
         ((sentence.translations[0].idiomatic && sentence.translations[0].idiomatic.trim()) ||
          (sentence.translations[0].literal && sentence.translations[0].literal.trim())));

      // Problem: trying to translate empty Chinese content
      if (!hasChineseContent && hasNewTranslation) {
        problematicTranslations.push({
          id: sentence.id,
          chinese: chineseContent || '',
          newTranslation: newTranslation,
          issue: 'translating_empty_chinese'
        });
      }

      // Problem: providing empty translation for content
      if (hasChineseContent && !hasNewTranslation) {
        problematicTranslations.push({
          id: sentence.id,
          chinese: chineseContent,
          newTranslation: newTranslation || '',
          issue: 'empty_translation_for_content'
        });
      }

      // Check for suspicious overwrites (very short translations for long Chinese)
      if (hasChineseContent && hasNewTranslation && existingTranslation) {
        const chineseWords = chineseContent.split(/\s+/).length;
        // Extract translation text from object or use string directly
        const translationText = (typeof newTranslation === 'string') ? newTranslation :
                               (newTranslation.idiomatic || newTranslation.literal || '');
        const newEnglishWords = translationText.split(/\s+/).length;
        if (newEnglishWords < chineseWords * 0.2 && chineseWords > 3) {
        problematicTranslations.push({
          id: sentence.id,
          chinese: chineseContent,
          existing: existingTranslation,
          newTranslation: translationText,
          issue: 'suspiciously_short'
        });
        }
      }
    }
  }
}

if (problematicTranslations.length > 0) {
  console.error(`❌ ERROR: Found ${problematicTranslations.length} problematic translations:`);
  problematicTranslations.slice(0, 10).forEach(item => {
    if (item.issue === 'translating_empty_chinese') {
      const displayTranslation = (typeof item.newTranslation === 'string') ? item.newTranslation :
                                (item.newTranslation?.idiomatic || item.newTranslation?.literal || 'N/A');
      console.error(`   ${item.id}: Trying to translate empty Chinese "${item.chinese}" with "${displayTranslation}"`);
    } else if (item.issue === 'empty_translation_for_content') {
      const displayTranslation = (typeof item.newTranslation === 'string') ? item.newTranslation :
                                (item.newTranslation?.idiomatic || item.newTranslation?.literal || 'N/A');
      console.error(`   ${item.id}: Providing empty translation "${displayTranslation}" for Chinese "${item.chinese}"`);
    } else if (item.issue === 'suspiciously_short') {
      console.error(`   ${item.id}: Suspiciously short translation:`);
      console.error(`     Chinese: "${item.chinese}"`);
      console.error(`     Existing: "${item.existing}"`);
      console.error(`     New: "${item.newTranslation}"`);
    }
  });
  if (problematicTranslations.length > 10) {
    console.error(`   ... and ${problematicTranslations.length - 10} more`);
  }
  console.error('Please fix these issues before applying translations.');
  process.exit(1);
}

// 3. Show random sample for user verification
const translationPairs = [];
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
    if (sentence.id && sentence.id in translations) {
      const translation = translations[sentence.id];
      const chineseContent = block.type === 'table_row' ? sentence.content : sentence.zh;
      if (chineseContent && translation) {
        translationPairs.push({
          id: sentence.id,
          chinese: chineseContent,
          english: (typeof translation === 'string') ? translation :
                  (translation.idiomatic || translation.literal || '')
        });
      }
    }
  }
}

// Show up to 5 random samples
if (translationPairs.length > 0) {
  console.log('\n📋 Random translation samples for verification:');
  const samples = translationPairs.sort(() => 0.5 - Math.random()).slice(0, Math.min(5, translationPairs.length));

  samples.forEach((sample, index) => {
    console.log(`\n${index + 1}. ${sample.id}:`);
    console.log(`   中文: "${sample.chinese}"`);
    console.log(`   英文: "${sample.english}"`);
  });

  // Ask user to confirm
  console.log('\n❓ Do these translations look correct? (y/N): ');

  // For now, we'll assume the user confirms - in a real interactive script we'd wait for input
  // But since this is automated, we'll proceed but log the warning
  console.log('⚠️  Proceeding with translations. Please verify the samples above manually.');
} else {
  console.log('ℹ️  No translation samples to show (likely all are number translations).');
}

console.log('✅ Pre-validation passed. Applying translations...\n');

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
    const translationInput = translations[sentence.id];
    // Handle both legacy string format and new object format
    let translation = '';
    if (typeof translationInput === 'string') {
      translation = translationInput;
    } else if (translationInput && typeof translationInput === 'object') {
      // Use idiomatic if available, otherwise literal
      translation = translationInput.idiomatic || translationInput.literal || '';
    }
    if (translation && translation.trim()) {
      // Basic validation: check if translation looks reasonable for the Chinese content
      const chineseText = block.type === 'table_row' ? sentence.content : sentence.zh;
      if (chineseText && chineseText.trim()) {
        const chineseWordCount = chineseText.split(/\s+/).length;
        const englishWordCount = translation.split(/\s+/).length;

        // Warn if translation is suspiciously short compared to Chinese
        if (englishWordCount < chineseWordCount * 0.3 && chineseWordCount > 5) {
          console.warn(`Warning: Translation for ${sentence.id} seems suspiciously short:`);
          console.warn(`  Chinese (${chineseWordCount} words): "${chineseText}"`);
          console.warn(`  English (${englishWordCount} words): "${translation}"`);
        }
      }
      // Only apply translations to sentences/cells with non-empty content
      const hasContent = (block.type === 'table_row' && sentence.content && sentence.content.trim()) ||
                        (block.type !== 'table_row' && sentence.zh && sentence.zh.trim());

      if (hasContent) {
        // Check if sentence is already translated by Herbert J. Allen (1894) - skip these
        const existingTranslator = block.type === 'table_row' ?
          sentence.translator :
          (sentence.translations && sentence.translations[0] && sentence.translations[0].translator);

        if (existingTranslator === 'Herbert J. Allen (1894)') {
          console.log(`Skipping ${sentence.id} - already translated by Herbert J. Allen (1894)`);
          translatedCount++;
          continue;
        }

        // Check if translation already exists and warn about overwrites
        const existingTranslation = block.type === 'table_row' ?
          (sentence.idiomatic || sentence.literal) :
          (sentence.translations && sentence.translations[0] && (sentence.translations[0].idiomatic || sentence.translations[0].literal));

        if (existingTranslation && existingTranslation.trim()) {
          console.warn(`Warning: Overwriting existing translation for ${sentence.id}`);
          console.warn(`  Old: "${existingTranslation}"`);
          console.warn(`  New: "${JSON.stringify(translationInput)}"`);
        }

        // Apply both literal and idiomatic translations
        const literalTranslation = translationInput.literal || translation;
        const idiomaticTranslation = translationInput.idiomatic || null;

        // For table cells, set translation fields directly
        if (block.type === 'table_row') {
          sentence.literal = literalTranslation;
          sentence.idiomatic = idiomaticTranslation;
          sentence.translator = translator;
          sentence.model = model;
        } else {
          // For paragraph sentences, update the translations array
          if (!sentence.translations) sentence.translations = [];
          if (sentence.translations.length === 0) {
            sentence.translations.push({ lang: 'en', literal: '', idiomatic: null, translator: '', model: '' });
          }
          sentence.translations[0].literal = literalTranslation;
          sentence.translations[0].idiomatic = idiomaticTranslation;
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
      .map(s => (s.translations?.[0]?.idiomatic || s.translations?.[0]?.literal || ''))
      .filter(t => t)
      .join(' ');

    if (paragraphText) {
      block.translations = [{
        lang: 'en',
        literal: paragraphText,
        idiomatic: null, // Paragraph translations are considered literal
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
    // Check if sentence/cell has content and a translation
    const hasContent = (block.type === 'table_row' && sentence.content && sentence.content.trim()) ||
                      (block.type !== 'table_row' && sentence.zh && sentence.zh.trim());

    if (hasContent) {
      // Check for translation based on the correct property
      const hasTranslation = (block.type === 'table_row' && sentence.translation && sentence.translation.trim()) ||
                           (block.type !== 'table_row' && sentence.translations && sentence.translations.length > 0 &&
                           (sentence.translations[0].idiomatic || sentence.translations[0].literal) &&
                           ((sentence.translations[0].idiomatic && sentence.translations[0].idiomatic.trim()) ||
                            (sentence.translations[0].literal && sentence.translations[0].literal.trim())));

      if (hasTranslation) {
        totalTranslated++;
      }
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
