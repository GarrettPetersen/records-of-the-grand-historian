#!/usr/bin/env node

import fs from 'fs';

// Chinese numerals mapping
const chineseNumerals = {
  '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
  '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
  '十一': 11, '十二': 12, '十三': 13, '十四': 14, '十五': 15,
  '十六': 16, '十七': 17, '十八': 18, '十九': 19, '二十': 20,
  '二十一': 21, '二十二': 22, '二十三': 23, '二十四': 24, '二十五': 25,
  '二十六': 26, '二十七': 27, '二十八': 28, '二十九': 29, '三十': 30,
  '三十一': 31, '三十二': 32, '三十三': 33, '三十四': 34, '三十五': 35,
  '三十六': 36, '三十七': 37, '三十八': 38, '三十九': 39, '四十': 40
};

function parseChineseNumeral(text) {
  // Handle simple cases
  if (chineseNumerals[text]) {
    return chineseNumerals[text];
  }

  // Handle larger numbers (basic parsing for now)
  if (text.match(/^[0-9]+$/)) {
    return parseInt(text);
  }

  return null; // Not a pure number
}

function checkNumberTranslations(chapterPath) {
  const data = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
  const errors = [];

  for (const [sentenceId, sentence] of Object.entries(data)) {
    if (sentence.translation && sentence.content) {
      const expectedNumber = parseChineseNumeral(sentence.content);
      if (expectedNumber !== null) {
        const actualTranslation = parseInt(sentence.translation);
        if (actualTranslation !== expectedNumber) {
          errors.push({
            id: sentenceId,
            content: sentence.content,
            expected: expectedNumber,
            actual: actualTranslation,
            translation: sentence.translation
          });
        }
      }
    }
  }

  return errors;
}

const errors = checkNumberTranslations('data/shiji/014.json');

console.log(`Found ${errors.length} incorrect number translations:`);

if (errors.length > 0) {
  errors.forEach(error => {
    console.log(`  ${error.id}: "${error.content}" -> "${error.translation}" (expected: ${error.expected}, got: ${error.actual})`);
  });
} else {
  console.log('All number translations appear correct!');
}
