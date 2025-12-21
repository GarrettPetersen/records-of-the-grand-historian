#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Regular expressions for detecting problematic translations
const CHINESE_CHARS_REGEX = /[\u4e00-\u9fff]/;
const CORRUPTED_CHARS_REGEX = /[\uFFFD\u0080-\u009F]/; // Unicode replacement character and control chars

/**
 * Calculate a rough length ratio score between Chinese and English text
 * Chinese characters are more information-dense than English words
 */
function getLengthRatio(chinese, english) {
  const chineseLength = chinese.length;
  const englishLength = english.trim().split(/\s+/).length;

  // Special handling for short phrases and conversational responses
  if (chineseLength <= 20) {
    // For short Chinese phrases (20 or fewer characters), be very lenient
    // This covers typical dialogue and brief statements
    if (englishLength >= 1 && englishLength <= 25) {
      return 1; // Accept reasonable translations for short phrases
    }
    return 0; // Too short or too long even for brief phrases
  }

  // Chinese characters are roughly 1.5-4x more concise than English words
  // A single Chinese character often translates to 1-6 English words in historical context
  const expectedRatio = chineseLength * 3.0; // more generous estimate

  // Calculate deviation from expected length
  const ratio = englishLength / expectedRatio;

  // Special handling for common patterns that are acceptable:
  // - Year numbers (like "四十三" -> "43rd year.")
  // - Ordinal numbers (like "十四" -> "14th year")
  // - Simple dates (like "474" -> "474 BC")
  if (/^\d+$/.test(chinese) || /^[\u4e00-\u9fff]+年?$/.test(chinese) ||
      (chineseLength <= 5 && english.includes('year') && english.includes('.'))) {
    return 1; // Accept these as valid
  }

  // Score from 0-1, where 1 is perfect length match
  if (ratio < 0.15) return 0; // way too short (e.g., single char -> 0 words)
  if (ratio > 8.0) return 0; // way too long (e.g., single char -> 24+ words)
  if (ratio >= 0.3 && ratio <= 3.0) return 1; // good range, more lenient
  return Math.max(0, 1 - Math.abs(Math.log(ratio)) * 0.3); // gradual decrease, even less harsh
}

/**
 * Score a single translation entry
 */
function scoreTranslation(entry) {
  const { id, content: chinese, translation: english } = entry;
  const issues = [];
  let score = 1.0;

  // Check for Chinese characters in English translation
  if (english && CHINESE_CHARS_REGEX.test(english)) {
    issues.push('Contains Chinese characters');
    score = 0;
  }

  // Check for corrupted characters in original
  if (chinese && CORRUPTED_CHARS_REGEX.test(chinese)) {
    issues.push('Corrupted characters in original Chinese');
    score = 0;
  }

  // Check for corrupted characters in translation
  if (english && CORRUPTED_CHARS_REGEX.test(english)) {
    issues.push('Corrupted characters in translation');
    score = 0;
  }

  // Check length ratio (only if no other fails)
  if (score > 0 && chinese && english) {
    const lengthScore = getLengthRatio(chinese, english);
    if (lengthScore < 0.3) {
      issues.push('Length mismatch between Chinese and English');
      score = Math.min(score, lengthScore);
    }
  }

  return {
    id,
    chinese,
    english,
    score,
    issues,
    problematic: score < 1.0 || issues.length > 0
  };
}

/**
 * Score all translations in a chapter file
 */
function scoreChapterFile(filePath) {
  console.log(`Scoring translations in: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return [];
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const results = [];

  // Score paragraphs
  if (data.content) {
    for (const block of data.content) {
      if (block.type === 'paragraph') {
        for (const sentence of block.sentences || []) {
          // Check both old format (sentence.translation) and new format (sentence.translations[0].text)
          const translation = sentence.translation || (sentence.translations && sentence.translations[0] && sentence.translations[0].text);
          const content = sentence.content || sentence.zh;
          if (translation) {
            results.push(scoreTranslation({
              id: sentence.id,
              content: content,
              translation: translation
            }));
          }
        }
      }
      // Score table rows
      else if (block.type === 'table_row') {
        for (const cell of block.cells || []) {
          if (cell.translation) {
            results.push(scoreTranslation({
              id: cell.id,
              content: cell.content,
              translation: cell.translation
            }));
          }
        }
      }
    }
  }

  return results;
}

/**
 * Randomly select and display sample translations for manual spot-checking
 */
function displayRandomSamples(results, filename) {
  if (results.length === 0) {
    return;
  }

  // Randomly select up to 5 translations for spot-checking
  const sampleSize = Math.min(5, results.length);
  const shuffled = [...results].sort(() => 0.5 - Math.random());
  const samples = shuffled.slice(0, sampleSize);

  console.log(`\n🎯 Random spot-check samples from ${filename} (${sampleSize} selected):\n`);

  samples.forEach((sample, index) => {
    console.log(`${index + 1}. ${sample.id}:`);
    console.log(`   原文: ${sample.chinese}`);
    console.log(`   译文: ${sample.english}`);
    console.log('');
  });
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node score-translations.js <chapter-file> [chapter-file ...]');
    console.error('Example: node score-translations.js data/shiji/014.json');
    process.exit(1);
  }

  let totalProblems = 0;
  let totalEntries = 0;

  for (const filePath of args) {
    const results = scoreChapterFile(filePath);
    const problems = results.filter(r => r.problematic);

    totalEntries += results.length;
    totalProblems += problems.length;

    if (problems.length > 0) {
      console.log(`\nFound ${problems.length} problematic translations in ${path.basename(filePath)}:\n`);

      problems.forEach((problem, index) => {
        console.log(`${index + 1}. ${problem.id}`);
        console.log(`   Chinese: "${problem.chinese}"`);
        console.log(`   English: "${problem.english}"`);
        console.log(`   Score: ${problem.score.toFixed(2)}`);
        console.log(`   Issues: ${problem.issues.join(', ')}`);
        console.log('');
      });
    } else {
      console.log(`No problems found in ${path.basename(filePath)}`);
    }

    // Always show random samples for manual spot-checking
    displayRandomSamples(results, path.basename(filePath));
  }

  console.log(`\nSummary: ${totalProblems} problematic translations out of ${totalEntries} total entries`);

  if (totalProblems > 0) {
    process.exit(1); // Exit with error code if problems found
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  scoreTranslation,
  scoreChapterFile,
  getLengthRatio
};
