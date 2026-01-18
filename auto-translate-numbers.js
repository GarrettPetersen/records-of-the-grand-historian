#!/usr/bin/env node

/**
 * auto-translate-numbers.js - Automatically translate Chinese numbers and Arabic numerals
 *
 * This script automatically translates:
 * - Chinese numerals (一, 二, 三, etc.) to Arabic numerals (1, 2, 3, etc.)
 * - Arabic numerals (314, 205, etc.) are copied as-is
 * - Chinese number words (like 年 numbers) to English equivalents
 *
 * Usage: node auto-translate-numbers.js <chapter-file>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chinese numeral mapping (simplified - covers basic numerals)
const CHINESE_NUMERALS = {
  // Basic numbers
  '一': '1', '二': '2', '三': '3', '四': '4', '五': '5',
  '六': '6', '七': '7', '八': '8', '九': '9', '十': '10',
  '百': '100', '千': '1000', '万': '10,000', '億': '100,000,000',

  // Ordinals
  '第一': 'First', '第二': 'Second', '第三': 'Third', '第四': 'Fourth', '第五': 'Fifth',
  '第六': 'Sixth', '第七': 'Seventh', '第八': 'Eighth', '第九': 'Ninth', '第十': 'Tenth',

  // Years
  '元年': 'First year', '二年': 'Second year', '三年': 'Third year', '四年': 'Fourth year', '五年': 'Fifth year',
  '六年': 'Sixth year', '七年': 'Seventh year', '八年': 'Eighth year', '九年': 'Ninth year', '十年': 'Tenth year',

  // Common phrases
  '正月': 'First month', '二月': 'Second month', '三月': 'Third month',
  '四月': 'Fourth month', '五月': 'Fifth month', '六月': 'Sixth month',
  '七月': 'Seventh month', '八月': 'Eighth month', '九月': 'Ninth month',
  '十月': 'Tenth month', '十一月': 'Eleventh month', '十二月': 'Twelfth month'
};

/**
 * Convert Chinese numerals to Arabic numerals
 */
function convertChineseNumeral(chinese) {
  // Handle pure Arabic numerals - just return as-is
  if (/^\d+$/.test(chinese)) {
    return chinese;
  }

  // Handle Chinese numerals
  if (CHINESE_NUMERALS[chinese]) {
    return CHINESE_NUMERALS[chinese];
  }

  // Handle year numbers (like "四年" -> "4th year")
  const yearMatch = chinese.match(/^(.+)年$/);
  if (yearMatch) {
    const base = yearMatch[1];
    if (CHINESE_NUMERALS[base]) {
      return CHINESE_NUMERALS[base].replace(' year', 'th year');
    }
  }

  // Handle complex numbers (like 二十三 -> 23)
  // This is a simplified implementation - real Chinese number parsing is complex
  return null; // Not a simple convertible number
}

/**
 * Check if text is auto-translatable
 */
function isAutoTranslatable(chinese) {
  if (!chinese || typeof chinese !== 'string') return false;

  const trimmed = chinese.trim();

  // Arabic numerals
  if (/^\d+$/.test(trimmed)) return true;

  // Simple Chinese numerals
  if (CHINESE_NUMERALS[trimmed]) return true;

  // Year numbers
  if (/^(.+)年$/.test(trimmed) && CHINESE_NUMERALS[RegExp.$1]) return true;

  return false;
}

/**
 * Auto-translate a Chinese text
 */
function autoTranslate(chinese) {
  if (!chinese || typeof chinese !== 'string') return null;

  const trimmed = chinese.trim();

  // Arabic numerals - copy as-is
  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }

  // Chinese numerals
  const converted = convertChineseNumeral(trimmed);
  if (converted) {
    return converted;
  }

  return null; // Cannot auto-translate
}

/**
 * Process a chapter file and auto-translate numbers
 */
function processChapterFile(filePath, forceOverwrite = false) {
  console.log(`🔢 Auto-translating numbers in: ${filePath}${forceOverwrite ? ' (force overwrite mode)' : ''}`);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return 0;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let autoTranslatedCount = 0;

  // Process paragraphs
  if (data.content) {
    for (const block of data.content) {
      if (block.type === 'paragraph') {
        for (const sentence of block.sentences || []) {
          // Skip sentences translated by Herbert J. Allen (1894)
          const translator = sentence.translations?.[0]?.translator;
          if (translator === 'Herbert J. Allen (1894)') {
            continue;
          }

          const content = sentence.content || sentence.zh;

          // Check if we can auto-translate
          if (isAutoTranslatable(content)) {
            const autoTranslation = autoTranslate(content);

            if (autoTranslation && (forceOverwrite || !sentence.translations?.[0]?.idiomatic || sentence.translations[0].idiomatic === '')) {
              // Set both literal and idiomatic to the same auto-translation for numbers
              if (!sentence.translations) {
                sentence.translations = [{
                  lang: 'en',
                  translator: 'Auto-translated (numbers)',
                  model: 'auto-translate-numbers.js',
                  literal: autoTranslation,
                  idiomatic: autoTranslation
                }];
              } else {
                sentence.translations[0].literal = autoTranslation;
                sentence.translations[0].idiomatic = autoTranslation;
                sentence.translations[0].translator = 'Auto-translated (numbers)';
                sentence.translations[0].model = 'auto-translate-numbers.js';
              }

              autoTranslatedCount++;
              console.log(`  ✓ Auto-translated: "${content}" → "${autoTranslation}"`);
            }
          }
        }
      }
      // Process table rows
      else if (block.type === 'table_row') {
        for (const cell of block.cells || []) {
          // Skip cells translated by Herbert J. Allen (1894)
          if (cell.translator === 'Herbert J. Allen (1894)') {
            continue;
          }

          const content = cell.content;

          // Check if we can auto-translate
          if (isAutoTranslatable(content)) {
            const autoTranslation = autoTranslate(content);

            if (autoTranslation && (forceOverwrite || !cell.idiomatic || cell.idiomatic === '')) {
              cell.literal = autoTranslation;
              cell.idiomatic = autoTranslation;
              cell.translator = 'Auto-translated (numbers)';
              cell.model = 'auto-translate-numbers.js';

              autoTranslatedCount++;
              console.log(`  ✓ Auto-translated: "${content}" → "${autoTranslation}"`);
            }
          }
        }
      }
    }
  }

  // Save the updated file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log(`✅ Auto-translated ${autoTranslatedCount} number entries in ${path.basename(filePath)}`);
  return autoTranslatedCount;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node auto-translate-numbers.js [--force] <chapter-file> [chapter-file ...]');
    console.error('Example: node auto-translate-numbers.js data/shiji/015.json');
    console.error('Example: node auto-translate-numbers.js --force data/shiji/015.json');
    process.exit(1);
  }

  const forceOverwrite = args[0] === '--force';
  const filePaths = forceOverwrite ? args.slice(1) : args;

  if (filePaths.length === 0) {
    console.error('Usage: node auto-translate-numbers.js [--force] <chapter-file> [chapter-file ...]');
    process.exit(1);
  }

  let totalAutoTranslated = 0;

  for (const filePath of filePaths) {
    totalAutoTranslated += processChapterFile(filePath, forceOverwrite);
  }

  console.log(`\n🎯 Total auto-translated: ${totalAutoTranslated} entries${forceOverwrite ? ' (force overwrite mode)' : ''}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  convertChineseNumeral,
  isAutoTranslatable,
  autoTranslate,
  processChapterFile
};
