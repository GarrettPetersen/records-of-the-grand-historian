#!/usr/bin/env node

/**
 * generate-progress.js - Generate progress data for all books
 *
 * Usage:
 *   node generate-progress.js
 *   node generate-progress.js --book shiji   # Recompute one book; merge into existing progress.json
 *
 * Status colors now represent cleanup/refinement scores when LanguageTool
 * results are available. Without those cached scores, the legacy translation
 * completion analysis is used as a fallback.
 */

import fs from 'fs';
import path from 'path';
import { scoreChapterFile } from './score-translations.js';
import { isPunctuationOnlySentence } from './sentence-utils.mjs';
import { estimateCompletionFromGitHistory } from './scripts/progress-estimate.mjs';

const MANIFEST_PATH = './data/manifest.json';
const DATA_DIR = './data';
const QUALITY_DIR = './data/quality';
const LANGUAGE_TOOL_SCORES_PATH = './data/quality/languagetool-scores.json';

function parseBookArg() {
  const i = process.argv.indexOf('--book');
  if (i === -1 || !process.argv[i + 1]) return null;
  return process.argv[i + 1].trim();
}

function loadLanguageToolScores() {
  if (!fs.existsSync(LANGUAGE_TOOL_SCORES_PATH)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(LANGUAGE_TOOL_SCORES_PATH, 'utf8'));
  } catch (error) {
    console.warn(`Could not read ${LANGUAGE_TOOL_SCORES_PATH}: ${error.message}`);
    return null;
  }
}

function repairQueueFiles() {
  if (!fs.existsSync(QUALITY_DIR)) return [];
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => /^source-(?:artifacts|correspondence).+\.json$/u.test(entry))
    .map((entry) => path.join(QUALITY_DIR, entry))
    .sort();
}

function repairQueueItemKey(item, sourceFile, index) {
  if (item?.id) return item.id;
  return [
    sourceFile,
    index,
    item?.book || '',
    item?.chapter || '',
    item?.ruleId || item?.type || '',
    item?.path || '',
    item?.sentenceId || '',
    item?.sourceName || '',
    item?.sourceRange?.text || '',
    item?.localRange?.text || '',
    item?.excerpt || '',
  ].join('\u241f');
}

function repairQueueItemState(item) {
  const status = String(item?.status || '').toLowerCase();
  const decision = String(item?.decision || '').toLowerCase();
  const values = new Set([status, decision].filter(Boolean));

  if (item?.appliedAt || item?.appliedSummary || values.has('applied') || values.has('included')) {
    return 'applied';
  }
  if (values.has('denied') || values.has('rejected') || values.has('declined') || values.has('false-positive') || values.has('false_positive')) {
    return 'rejected';
  }
  if (values.has('approved')) {
    return 'approved';
  }
  return 'pending';
}

function loadRepairQueueProgress() {
  const seen = new Set();
  const totals = {
    totalItems: 0,
    completedItems: 0,
    pendingItems: 0,
    appliedItems: 0,
    approvedItems: 0,
    rejectedItems: 0,
  };
  const bySource = [];

  for (const file of repairQueueFiles()) {
    let report;
    try {
      report = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
      console.warn(`Could not read repair queue ${file}: ${error.message}`);
      continue;
    }

    const currentItems = Array.isArray(report.items)
      ? report.items
      : (Array.isArray(report.hits) ? report.hits : []);
    const items = [
      ...currentItems,
      ...(Array.isArray(report.resolvedHits) ? report.resolvedHits : []),
    ];
    const sourceCounts = {
      file,
      scanner: report.scanner || (Array.isArray(report.hits) ? 'scan-source-artifacts' : 'scan-source-correspondence'),
      generatedAt: report.generatedAt || null,
      currentItems: currentItems.length,
      resolvedItems: Array.isArray(report.resolvedHits) ? report.resolvedHits.length : 0,
      totalItems: 0,
      completedItems: 0,
      pendingItems: 0,
      appliedItems: 0,
      approvedItems: 0,
      rejectedItems: 0,
    };

    items.forEach((item, index) => {
      const key = repairQueueItemKey(item, file, index);
      if (seen.has(key)) return;
      seen.add(key);

      const state = repairQueueItemState(item);
      sourceCounts.totalItems++;
      totals.totalItems++;

      if (state === 'applied') {
        sourceCounts.appliedItems++;
        totals.appliedItems++;
      } else if (state === 'approved') {
        sourceCounts.approvedItems++;
        totals.approvedItems++;
      } else if (state === 'rejected') {
        sourceCounts.rejectedItems++;
        totals.rejectedItems++;
      }
    });

    sourceCounts.completedItems = sourceCounts.appliedItems + sourceCounts.rejectedItems;
    sourceCounts.pendingItems = Math.max(0, sourceCounts.totalItems - sourceCounts.completedItems);
    bySource.push(sourceCounts);
  }

  totals.completedItems = totals.appliedItems + totals.rejectedItems;
  totals.pendingItems = Math.max(0, totals.totalItems - totals.completedItems);

  return {
    generatedAt: new Date().toISOString(),
    percentComplete: totals.totalItems > 0 ? (totals.completedItems / totals.totalItems) * 100 : 0,
    ...totals,
    sourceFiles: bySource,
  };
}

/**
 * Determine chapter status based on analysis
 */
function analyzeChapterStatus(bookId, chapter, chapterData) {
  const chapterPath = path.join(DATA_DIR, bookId, `${chapter}.json`);

  // Legacy fallback: untranslated chapters are gray.
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
    // Punctuation alignment checks are currently too broad for progress status.
    // Keep progress red focused on blatant failures and high problem ratios.
    // let punctuationAlignmentProblems = 0;

    // Analyze each sentence / table cell
    if (data.content) {
      for (const block of data.content) {
        const rows = block.type === 'table_row' ? (block.cells || []) : (block.sentences || []);
        if (block.type === 'paragraph' || block.type === 'table_header' || block.type === 'table_row') {
          for (const sentence of rows) {
            // Skip Herbert J. Allen translations
            const translator = sentence.translations?.[0]?.translator || sentence.translator;
            if (translator === 'Herbert J. Allen (1894)') {
              continue;
            }

            // Skip empty or punctuation-only text (blank table cells / scaffolding)
            const chineseText = (sentence.zh || sentence.content || '').trim();
            if (!chineseText || isPunctuationOnlySentence(chineseText)) {
              continue;
            }

            totalSentences++;

            const literal = sentence.translations?.[0]?.literal || sentence.literal || '';
            const idiomatic = sentence.translations?.[0]?.idiomatic || sentence.idiomatic || '';

            if (literal && literal.trim()) literalTranslations++;
            if (idiomatic && idiomatic.trim()) idiomaticTranslations++;

            // Check for problems in this sentence
            const sentenceResults = results.filter(r => r.id === sentence.id);
            const statusProblems = sentenceResults.filter(r =>
              r.problematic &&
              !r.issues.every(issue => issue === 'Likely sentence-start capitalization issue')
            );
            if (statusProblems.length > 0) {
              problems++;

              // Check for blatant problems (Chinese characters in translation)
              if (statusProblems.some(r => r.issues.some(issue => issue.includes('Contains Chinese characters')))) {
                blatantProblems++;
              }
              // if (sentenceResults.some(r => r.issues.some(issue => issue.includes('Punctuation alignment:')))) {
              //   punctuationAlignmentProblems++;
              // }
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

function getLanguageToolChapterScore(languageToolScores, bookId, chapter) {
  return languageToolScores?.books?.[bookId]?.chapters?.[chapter] || null;
}

function bookProgressFromManifest(bookId, book, languageToolScores = null) {
  const bookProgress = {
    name: book.name,
    chinese: book.chinese,
    pinyin: book.pinyin,
    dynasty: book.dynasty,
    category: book.category || 'twentyFourHistories',
    chapters: []
  };

  for (const chapter of book.chapters) {
    const languageTool = getLanguageToolChapterScore(languageToolScores, bookId, chapter.chapter);
    const translationComplete = (chapter.sentenceCount || 0) > 0 && (chapter.translatedCount || 0) >= (chapter.sentenceCount || 0);
    const status = languageTool?.status || 'gray';
    bookProgress.chapters.push({
      chapter: chapter.chapter,
      title: chapter.title,
      status: status,
      translationComplete,
      languageTool: languageTool ? {
        status: languageTool.status,
        checkedAt: languageTool.checkedAt,
        wordCount: languageTool.wordCount,
        matchCount: languageTool.matchCount,
        matchesPer1000Words: languageTool.matchesPer1000Words,
        topMatches: languageTool.topMatches || []
      } : null,
      sentenceCount: chapter.sentenceCount,
      translatedCount: chapter.translatedCount,
      characterCount: chapter.characterCount ?? 0,
      translatedCharacterCount: chapter.translatedCharacterCount ?? 0,
      qualityScore: chapter.qualityScore,
      reviewed: chapter.reviewed ?? false
    });
  }

  return bookProgress;
}

function buildProgressSummary(books) {
  const chapters = Object.values(books).flatMap((book) => book.chapters || []);
  const isTranslationComplete = (chapter) => (chapter.sentenceCount || 0) > 0 && (chapter.translatedCount || 0) >= (chapter.sentenceCount || 0);
  const completedChapters = chapters.filter(isTranslationComplete).length;
  const cleanup = chapters.reduce((counts, chapter) => {
    counts[chapter.status] = (counts[chapter.status] || 0) + 1;
    if (chapter.languageTool) counts.checkedChapters++;
    return counts;
  }, { gray: 0, yellow: 0, red: 0, green: 0, checkedChapters: 0 });
  const totalSentences = chapters.reduce((sum, chapter) => sum + (chapter.sentenceCount || 0), 0);
  const translatedSentences = chapters.reduce((sum, chapter) => sum + (chapter.translatedCount || 0), 0);
  const bookList = Object.values(books || {});
  const totalBooks = bookList.length;
  const completedBooks = bookList.filter((book) => {
    const bookChapters = book.chapters || [];
    return bookChapters.length > 0 && bookChapters.every(isTranslationComplete);
  }).length;
  const estimate = estimateCompletionFromGitHistory({
    completedChapters,
    totalChapters: chapters.length,
  });
  return {
    completedBooks,
    totalBooks,
    completedChapters,
    totalChapters: chapters.length,
    remainingChapters: Math.max(0, chapters.length - completedChapters),
    totalSentences,
    translatedSentences,
    remainingSentences: Math.max(0, totalSentences - translatedSentences),
    cleanup,
    estimate,
  };
}

/**
 * Generate progress data for all books in the manifest
 */
function generateProgressData() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const languageToolScores = loadLanguageToolScores();
  const progress = {
    generatedAt: new Date().toISOString(),
    qualityScoring: languageToolScores ? {
      tool: languageToolScores.tool,
      language: languageToolScores.language,
      generatedAt: languageToolScores.generatedAt,
      thresholds: languageToolScores.thresholds,
    } : null,
    repairQueue: loadRepairQueueProgress(),
    books: {}
  };

  for (const bookId in manifest.books) {
    const book = manifest.books[bookId];
    progress.books[bookId] = bookProgressFromManifest(bookId, book, languageToolScores);
  }

  progress.summary = buildProgressSummary(progress.books);

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
  const languageToolScores = loadLanguageToolScores();
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
  progress.qualityScoring = languageToolScores ? {
    tool: languageToolScores.tool,
    language: languageToolScores.language,
    generatedAt: languageToolScores.generatedAt,
    thresholds: languageToolScores.thresholds,
  } : null;
  progress.repairQueue = loadRepairQueueProgress();
  progress.books = progress.books || {};
  progress.books[bookId] = bookProgressFromManifest(bookId, manifest.books[bookId], languageToolScores);
  progress.summary = buildProgressSummary(progress.books);
  writeProgress(progress);
  console.log(`Merged progress for book: ${bookId}`);
}

/**
 * Main function
 */
function main() {
  const onlyBook = parseBookArg();
  if (onlyBook) {
    console.log(`Generating cleanup progress for single book: ${onlyBook}...`);
    mergeProgressSingleBook(onlyBook);
    return;
  }

  console.log('Generating cleanup progress data...');
  const progress = generateProgressData();
  writeProgress(progress);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  generateProgressData,
  analyzeChapterStatus,
  bookProgressFromManifest,
  mergeProgressSingleBook,
  buildProgressSummary,
  loadRepairQueueProgress,
};
