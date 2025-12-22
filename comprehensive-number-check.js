#!/usr/bin/env node

import fs from 'fs';

// Chinese numerals mapping (expanded)
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

function parseChineseNumeral(text) {
  // Handle simple cases
  if (chineseNumerals[text]) {
    return chineseNumerals[text];
  }

  // Handle Arabic numerals
  if (text.match(/^[0-9]+$/)) {
    return parseInt(text);
  }

  return null; // Not a pure number
}

function findIncorrectTranslations(chapterPath) {
  const data = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
  const incorrect = [];
  const totalNumbers = [];
  let sampleCount = 0;

  // The sentences are in data.content[].sentences[]
  if (data.content && Array.isArray(data.content)) {
    for (const paragraph of data.content) {
      if (paragraph.sentences && Array.isArray(paragraph.sentences)) {
        for (const sentence of paragraph.sentences) {
          if (sentence.translations && sentence.translations.length > 0) {
            const translation = sentence.translations[0]; // Take the first translation
            if (translation.text && sentence.zh && sentence.zh.trim() !== '') {
              const expectedNumber = parseChineseNumeral(sentence.zh);
              if (expectedNumber !== null) {
                totalNumbers.push({
                  id: sentence.id,
                  content: sentence.zh,
                  expected: expectedNumber,
                  actual: translation.text
                });

                const actualTranslation = parseInt(translation.text);
                if (isNaN(actualTranslation) || actualTranslation !== expectedNumber) {
                  incorrect.push({
                    id: sentence.id,
                    content: sentence.zh,
                    expected: expectedNumber,
                    actual: translation.text
                  });
                }
              }
            }

            // Debug: show first 10 sentences that have translations
            if (sampleCount < 10 && translation.text && sentence.zh) {
              console.log(`Sample ${sampleCount + 1}: ${sentence.id} "${sentence.zh}" -> "${translation.text}"`);
              sampleCount++;
            }
          }
        }
      }
    }
  }

  return { incorrect, totalNumbers };
}

const { incorrect, totalNumbers } = findIncorrectTranslations('data/shiji/014.json');

console.log(`Found ${incorrect.length} incorrect number translations out of ${totalNumbers.length} total number translations:`);

if (incorrect.length > 0) {
  console.log('\nIncorrect translations:');
  incorrect.forEach(error => {
    console.log(`  ${error.id}: "${error.content}" -> "${error.actual}" (should be: ${error.expected})`);
  });
} else {
  console.log('All number translations appear correct!');
}

console.log(`\nTotal number translations found: ${totalNumbers.length}`);
