#!/usr/bin/env node

import fs from 'fs';

// Simple check: look for sentences where the Chinese content is a number
// but the translation is a different number (indicating off-by-one error)

const data = JSON.parse(fs.readFileSync('data/shiji/014.json', 'utf8'));

// Chinese number to Arabic mapping for common numbers
const numberMap = {
  '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
  '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
  '十一': 11, '十二': 12, '十三': 13, '十四': 14, '十五': 15,
  '十六': 16, '十七': 17, '十八': 18, '十九': 19, '二十': 20,
  '二十一': 21, '二十二': 22, '二十三': 23, '二十四': 24, '二十五': 25,
  '二十六': 26, '二十七': 27, '二十八': 28, '二十九': 29, '三十': 30,
  '三十一': 31, '三十二': 32, '三十三': 33, '三十四': 34, '三十五': 35,
  '三十六': 36, '三十七': 37, '三十八': 38, '三十九': 39, '四十': 40,
  '八百三十六': 836, '八百三十五': 835, '八百三十四': 834, // etc.
};

let errors = [];

if (data.content && Array.isArray(data.content)) {
  for (const paragraph of data.content) {
    if (paragraph.sentences && Array.isArray(paragraph.sentences)) {
      for (const sentence of paragraph.sentences) {
        if (sentence.translations && sentence.translations.length > 0) {
          const translation = sentence.translations[0];
          if (translation.text && sentence.zh) {
            const chinese = sentence.zh.trim();
            const english = translation.text.trim();

            // Check if Chinese is a known number
            if (numberMap[chinese]) {
              const expected = numberMap[chinese];
              const actual = parseInt(english);

              if (!isNaN(actual) && actual !== expected) {
                errors.push({
                  id: sentence.id,
                  chinese: chinese,
                  expected: expected,
                  actual: actual,
                  translation: english
                });
              }
            }
          }
        }
      }
    }
  }
}

console.log(`Found ${errors.length} number translation errors:`);

if (errors.length > 0) {
  errors.slice(0, 20).forEach(error => {
    console.log(`  ${error.id}: "${error.chinese}" -> "${error.translation}" (expected: ${error.expected}, got: ${error.actual})`);
  });

  if (errors.length > 20) {
    console.log(`  ... and ${errors.length - 20} more`);
  }
} else {
  console.log('No obvious number translation errors found.');
}
