#!/usr/bin/env node

/**
 * generate-progress.js - Generate translation progress data for all books
 *
 * Usage:
 *   node generate-progress.js
 *   node generate-progress.js --book shiji   # Recompute one book; merge into existing progress.json
 *
 * Analyzes each chapter to determine its status:
 * - gray: untranslated (translatedCount === 0)
 * - yellow: partially translated (has some translations but not complete idiomatic)
 * - red: problems detected (blatant issues or significant fraction with problems)
 * - green: complete idiomatic translation without problems
 */

import fs from 'fs';
import path from 'path';
import { scoreChapterFile } from './score-translations.js';

const MANIFEST_PATH = './data/manifest.json';
const DATA_DIR = './data';

function parseBookArg() {
  const i = process.argv.indexOf('--book');
  if (i === -1 || !process.argv[i + 1]) return null;
  return process.argv[i + 1].trim();
}

/**
 * Determine chapter status based on analysis
 */
function analyzeChapterStatus(bookId, chapter, chapterData) {
  const chapterPath = path.join(DATA_DIR, bookId, `${chapter}.json`);

  // Gray: untranslated
  if (chapterData.translatedCount === 0) {
    return 'gray';
  }

  // Check if chapter file exists
  if (!fs.existsSync(chapterPath)) {
    return 'gray';
  }

  try {
    const data = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
    const results = scoreChapterFile(chapterPath);

    // Count translations
    let totalSentences = 0;
    let literalTranslations = 0;
    let idiomaticTranslations = 0;
    let problems = 0;
    let blatantProblems = 0;

    // Analyze each sentence
    if (data.content) {
      for (const block of data.content) {
        if (block.type === 'paragraph') {
          for (const sentence of block.sentences || []) {
            // Skip Herbert J. Allen translations
            const translator = sentence.translations?.[0]?.translator;
            if (translator === 'Herbert J. Allen (1894)') {
              continue;
            }

            // Skip sentences with empty Chinese text (blank table cells)
            const chineseText = (sentence.zh || '').trim();
            if (!chineseText) {
              continue;
            }

            totalSentences++;

            const literal = sentence.translations?.[0]?.literal || sentence.literal;
            const idiomatic = sentence.translations?.[0]?.idiomatic || sentence.idiomatic;

            if (literal && literal.trim()) literalTranslations++;
            if (idiomatic && idiomatic.trim()) idiomaticTranslations++;

            // Check for problems in this sentence
            const sentenceResult = results.find(r => r.id === sentence.id);
            if (sentenceResult && sentenceResult.problematic) {
              problems++;

              // Check for blatant problems (Chinese characters in translation)
              if (sentenceResult.issues.some(issue => issue.includes('Contains Chinese characters'))) {
                blatantProblems++;
              }
            }
          }
        }
      }
    }

    // Red: major issues (blatant problems OR lots of problems)
    const problemRatio = totalSentences > 0 ? problems / totalSentences : 0;
    if (blatantProblems > 0 || problemRatio > 0.1) { // 10%+ problems OR Chinese chars
      return 'red';
    }

    // Green: complete idiomatic translations without major issues
    if (idiomaticTranslations >= totalSentences) {
      return 'green';
    }

    // Yellow: partial translation (has some translations but not complete)
    return 'yellow';

  } catch (error) {
    console.error(`Error analyzing ${chapterPath}: ${error.message}`);
    return 'gray';
  }
}

function bookProgressFromManifest(bookId, book) {
  const bookProgress = {
    name: book.name,
    chinese: book.chinese,
    pinyin: book.pinyin,
    dynasty: book.dynasty,
    category: book.category || 'twentyFourHistories',
    chapters: []
  };

  for (const chapter of book.chapters) {
    const status = analyzeChapterStatus(bookId, chapter.chapter, chapter);
    bookProgress.chapters.push({
      chapter: chapter.chapter,
      title: chapter.title,
      status: status,
      sentenceCount: chapter.sentenceCount,
      translatedCount: chapter.translatedCount,
      qualityScore: chapter.qualityScore,
      reviewed: chapter.reviewed ?? false
    });
  }

  return bookProgress;
}

/**
 * Generate progress data for all books in the manifest
 */
function generateProgressData() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const progress = {
    generatedAt: new Date().toISOString(),
    books: {}
  };

  for (const bookId in manifest.books) {
    const book = manifest.books[bookId];
    progress.books[bookId] = bookProgressFromManifest(bookId, book);
  }

  return progress;
}

function writeProgress(progress) {
  fs.writeFileSync('./data/progress.json', JSON.stringify(progress, null, 2), 'utf8');
  console.log('Progress data written to data/progress.json');

  fs.writeFileSync('./public/data/progress.json', JSON.stringify(progress, null, 2), 'utf8');
  console.log('Progress data copied to public/data/progress.json');
}

/**
 * Recompute progress.books[bookId] from manifest and merge into existing progress.json.
 * If progress.json is missing, performs a full generate (same as no --book).
 */
function mergeProgressSingleBook(bookId) {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  if (!manifest.books?.[bookId]) {
    console.error(`Unknown book or not in manifest: ${bookId}`);
    process.exit(1);
  }

  const existingPath = './data/progress.json';
  let progress;
  if (fs.existsSync(existingPath)) {
    progress = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
  } else {
    console.warn('No data/progress.json yet; generating progress for all books from manifest.');
    progress = generateProgressData();
    writeProgress(progress);
    return;
  }

  progress.generatedAt = new Date().toISOString();
  progress.books = progress.books || {};
  progress.books[bookId] = bookProgressFromManifest(bookId, manifest.books[bookId]);
  writeProgress(progress);
  console.log(`Merged progress for book: ${bookId}`);
}

/**
 * Main function
 */
function main() {
  const onlyBook = parseBookArg();
  if (onlyBook) {
    console.log(`Generating translation progress for single book: ${onlyBook}...`);
    mergeProgressSingleBook(onlyBook);
    return;
  }

  console.log('Generating translation progress data...');
  const progress = generateProgressData();
  writeProgress(progress);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateProgressData, analyzeChapterStatus, bookProgressFromManifest, mergeProgressSingleBook };
