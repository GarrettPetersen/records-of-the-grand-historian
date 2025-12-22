#!/usr/bin/env node

import fs from 'fs';

// Chinese number mapping
const chineseNumbers = {
  '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
  '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
  '十一': 11, '十二': 12, '十三': 13, '十四': 14, '十五': 15,
  '十六': 16, '十七': 17, '十八': 18, '十九': 19, '二十': 20,
  '二十一': 21, '二十二': 22, '二十三': 23, '二十四': 24, '二十五': 25,
  '二十六': 26, '二十七': 27, '二十八': 28, '二十九': 29, '三十': 30,
  '三十一': 31, '三十二': 32, '三十三': 33, '三十四': 34, '三十五': 35,
  '三十六': 36, '三十七': 37, '三十八': 38, '三十九': 39, '四十': 40
};

function isChineseNumber(str) {
  return chineseNumbers[str] !== undefined;
}

function findNumberErrors(content) {
  // Simple approach: read the file as text and find patterns
  const lines = content.split('\n');
  const errors = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Look for sentences with content and translation fields
    if (line.includes('"content":') && line.includes('"translation":')) {
      const contentMatch = line.match(/"content":\s*"([^"]*)"/);
      const translationMatch = line.match(/"translation":\s*"([^"]*)"/);

      if (contentMatch && translationMatch) {
        const chinese = contentMatch[1];
        const translation = translationMatch[1];

        if (isChineseNumber(chinese)) {
          const expected = chineseNumbers[chinese];
          const actual = parseInt(translation);

          if (!isNaN(actual) && actual !== expected) {
            // Get the sentence ID from previous lines
            let sentenceId = 'unknown';
            for (let j = Math.max(0, i - 5); j < i; j++) {
              const idMatch = lines[j].match(/"id":\s*"([^"]*)"/);
              if (idMatch) {
                sentenceId = idMatch[1];
                break;
              }
            }

            errors.push({
              id: sentenceId,
              chinese: chinese,
              expected: expected,
              actual: actual
            });
          }
        }
      }
    }
  }

  return errors;
}

const content = fs.readFileSync('data/shiji/014.json', 'utf8');
const errors = findNumberErrors(content);

console.log(`Found ${errors.length} number translation errors in old format:`);

if (errors.length > 0) {
  errors.forEach(error => {
    console.log(`  ${error.id}: "${error.chinese}" -> ${error.actual} (should be ${error.expected})`);
  });
} else {
  console.log('No errors found in old format.');
}
