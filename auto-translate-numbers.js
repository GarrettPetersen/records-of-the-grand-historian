#!/usr/bin/env node

import fs from 'fs';

// Chapter file to process
const chapterFile = process.argv[2];
if (!chapterFile) {
  console.error('Usage: node auto-translate-numbers.js <chapter-file>');
  console.error('Example: node auto-translate-numbers.js data/shiji/025.json');
  process.exit(1);
}

// Generate output file name based on chapter
const chapterMatch = chapterFile.match(/\/([^\/]+)\.json$/);
const chapterName = chapterMatch ? chapterMatch[1] : 'unknown';
const outputFile = `translations/auto_number_translations_${chapterName}.json`;

// Read the chapter data
const chapterData = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));

// Chinese numerals mapping
const chineseNumerals = {
  // Basic numbers
  '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
  '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,

  // Teens
  '十一': 11, '十二': 12, '十三': 13, '十四': 14, '十五': 15,
  '十六': 16, '十七': 17, '十八': 18, '十九': 19,

  // Tens
  '二十': 20, '三十': 30, '四十': 40, '五十': 50, '六十': 60,
  '七十': 70, '八十': 80, '九十': 90,

  // Compound numbers
  '二十一': 21, '二十二': 22, '二十三': 23, '二十四': 24, '二十五': 25,
  '二十六': 26, '二十七': 27, '二十八': 28, '二十九': 29,
  '三十一': 31, '三十二': 32, '三十三': 33, '三十四': 34, '三十五': 35,
  '三十六': 36, '三十七': 37, '三十八': 38, '三十九': 39,
  '四十一': 41, '四十二': 42, '四十三': 43, '四十四': 44, '四十五': 45,
  '四十六': 46, '四十七': 47, '四十八': 48, '四十九': 49,
  '五十一': 51, '五十二': 52, '五十三': 53, '五十四': 54, '五十五': 55,
  '五十六': 56, '五十七': 57, '五十八': 58, '五十九': 59,
  '六十一': 61, '六十二': 62, '六十三': 63, '六十四': 64, '六十五': 65,
  '六十六': 66, '六十七': 67, '六十八': 68, '六十九': 69,
  '七十一': 71, '七十二': 72, '七十三': 73, '七十四': 74, '七十五': 75,
  '七十六': 76, '七十七': 77, '七十八': 78, '七十九': 79,
  '八十一': 81, '八十二': 82, '八十三': 83, '八十四': 84, '八十五': 85,
  '八十六': 86, '八十七': 87, '八十八': 88, '八十九': 89,
  '九十一': 91, '九十二': 92, '九十三': 93, '九十四': 94, '九十五': 95,
  '九十六': 96, '九十七': 97, '九十八': 98, '九十九': 99
};

// Function to check if a string contains only numbers (Arabic or Chinese)
function isOnlyNumbers(str) {
  // Check for pure Arabic numerals
  if (/^\d+$/.test(str)) {
    return true;
  }

  // Check for pure Chinese numerals
  return chineseNumerals[str] !== undefined;
}

// Function to convert Chinese numerals to Arabic numerals
function chineseToArabic(str) {
  // If it's already Arabic numerals, return as-is
  if (/^\d+$/.test(str)) {
    return str;
  }

  // Convert Chinese numerals
  if (chineseNumerals[str] !== undefined) {
    return chineseNumerals[str].toString();
  }

  return null;
}

// Collect translations for pure number cells
const translations = {};

let count = 0;

// Extract untranslated sentences from the chapter
if (chapterData.content && Array.isArray(chapterData.content)) {
  for (const paragraph of chapterData.content) {
    if (paragraph.sentences && Array.isArray(paragraph.sentences)) {
      for (const sentence of paragraph.sentences) {
        // Check if sentence is untranslated (empty translation)
        const isUntranslated = !sentence.translations ||
                              sentence.translations.length === 0 ||
                              !sentence.translations[0].text ||
                              sentence.translations[0].text.trim() === '';

        if (isUntranslated && sentence.zh && sentence.id) {
          if (isOnlyNumbers(sentence.zh)) {
            const arabicNumber = chineseToArabic(sentence.zh);
            if (arabicNumber) {
              translations[sentence.id] = arabicNumber;
              count++;
            }
          }
        }
      }
    }

    // Also check table rows
    if (paragraph.cells && Array.isArray(paragraph.cells)) {
      for (const cell of paragraph.cells) {
        // Check if cell is untranslated
        const isUntranslated = !cell.translation || cell.translation.trim() === '';

        if (isUntranslated && cell.content && cell.id) {
          if (isOnlyNumbers(cell.content)) {
            const arabicNumber = chineseToArabic(cell.content);
            if (arabicNumber) {
              translations[cell.id] = arabicNumber;
              count++;
            }
          }
        }
      }
    }
  }
}

console.log(`Found ${count} pure number cells to translate automatically`);

// Write the translations to a file
fs.writeFileSync(outputFile, JSON.stringify(translations, null, 2));

console.log(`Saved translations to ${outputFile}`);
console.log(`Run: node apply-translations.js ${chapterFile} ${outputFile} "Garrett M. Petersen (2025)" "grok-1.5"`);
