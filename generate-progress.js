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
import { isExcludedFromTranslationCount } from './chapter-counts.mjs';
import { isPunctuationOnlySentence } from './sentence-utils.mjs';
import { estimateCompletionFromGitHistory } from './scripts/progress-estimate.mjs';

const MANIFEST_PATH = './data/manifest.json';
const DATA_DIR = './data';
const QUALITY_DIR = './data/quality';
const LANGUAGE_TOOL_SCORES_PATH = './data/quality/languagetool-scores.json';
const QUOTE_ALIGNMENT_REPORT_PATH = './data/quality/quote-span-alignment.json';
const PLACEHOLDER_TRANSLATIONS_REPORT_PATH = './data/quality/placeholder-translations.json';
const TRANSLATION_ALIGNMENT_REPORT_PATH = './data/quality/translation-alignment.json';
const QUALITY_SIGNAL_OVERRIDES_PATH = './data/quality/progress-signal-overrides.json';
const PUBLIC_PROGRESS_PATH = './public/data/progress.json';
const PUBLIC_PROGRESS_BOOKS_DIR = './public/data/progress/books';

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

function loadQualitySignalOverrides() {
  if (!fs.existsSync(QUALITY_SIGNAL_OVERRIDES_PATH)) {
    return new Set();
  }
  try {
    const report = JSON.parse(fs.readFileSync(QUALITY_SIGNAL_OVERRIDES_PATH, 'utf8'));
    const entries = Array.isArray(report.entries) ? report.entries : [];
    return new Set(entries
      .filter((entry) => {
        const status = String(entry?.status || '').toLowerCase();
        return status === 'false-positive' || status === 'false_positive' || status === 'accepted-risk';
      })
      .map((entry) => [
        entry?.scanner || '',
        entry?.rule || '',
        entry?.book || '',
        entry?.chapter || '',
      ].join('\u241f')));
  } catch (error) {
    console.warn(`Could not read quality signal overrides ${QUALITY_SIGNAL_OVERRIDES_PATH}: ${error.message}`);
    return new Set();
  }
}

function qualitySignalOverrideKey({ scanner, rule, book, chapter }) {
  return [scanner || '', rule || '', book || '', chapter || ''].join('\u241f');
}

function repairQueueFiles() {
  if (!fs.existsSync(QUALITY_DIR)) return [];
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => /^source-(?:artifacts|correspondence).+\.json$/u.test(entry))
    .map((entry) => path.join(QUALITY_DIR, entry))
    .sort();
}

function repairQueueItemKey(item, sourceFile, index) {
  return [
    sourceFile,
    index,
    item?.id || '',
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

function repairQueueSeverityKey(item) {
  const severity = Number(item?.severity);
  if (Number.isFinite(severity) && severity > 0) {
    return String(Math.trunc(severity));
  }
  return 'unknown';
}

function createRepairQueueCounts(extra = {}) {
  return {
    ...extra,
    totalItems: 0,
    completedItems: 0,
    pendingItems: 0,
    appliedItems: 0,
    approvedItems: 0,
    rejectedItems: 0,
  };
}

function incrementRepairQueueCounts(counts, state) {
  counts.totalItems++;
  if (state === 'applied') {
    counts.appliedItems++;
  } else if (state === 'approved') {
    counts.approvedItems++;
  } else if (state === 'rejected') {
    counts.rejectedItems++;
  }
}

function finalizeRepairQueueCounts(counts) {
  counts.completedItems = counts.appliedItems + counts.approvedItems + counts.rejectedItems;
  counts.pendingItems = Math.max(0, counts.totalItems - counts.completedItems);
  counts.percentComplete = counts.totalItems > 0 ? (counts.completedItems / counts.totalItems) * 100 : 0;
  return counts;
}

function ensureRepairQueueSeverity(counts, severity) {
  counts.bySeverity = counts.bySeverity || {};
  counts.bySeverity[severity] = counts.bySeverity[severity] || createRepairQueueCounts({
    severity,
  });
  return counts.bySeverity[severity];
}

function ensureRepairQueueChapter(counts, item) {
  if (!item?.book || !item?.chapter) return null;
  counts.byChapter = counts.byChapter || {};
  const key = `${item.book}/${item.chapter}`;
  counts.byChapter[key] = counts.byChapter[key] || createRepairQueueCounts({
    book: item.book,
    chapter: item.chapter,
    bySeverity: {},
  });
  return counts.byChapter[key];
}

function finalizeRepairQueueSeverityCounts(counts) {
  for (const severityCounts of Object.values(counts.bySeverity || {})) {
    finalizeRepairQueueCounts(severityCounts);
  }
}

function finalizeRepairQueueChapterCounts(counts) {
  for (const chapterCounts of Object.values(counts.byChapter || {})) {
    finalizeRepairQueueSeverityCounts(chapterCounts);
    finalizeRepairQueueCounts(chapterCounts);

    const severityEntries = Object.entries(chapterCounts.bySeverity || {});
    chapterCounts.highPendingItems = severityEntries
      .filter(([severity]) => Number(severity) >= 3)
      .reduce((sum, [, severityCounts]) => sum + (severityCounts.pendingItems || 0), 0);
    chapterCounts.lowPendingItems = severityEntries
      .filter(([severity]) => Number(severity) > 0 && Number(severity) < 3)
      .reduce((sum, [, severityCounts]) => sum + (severityCounts.pendingItems || 0), 0);
    chapterCounts.unknownPendingItems = severityEntries
      .filter(([severity]) => severity === 'unknown')
      .reduce((sum, [, severityCounts]) => sum + (severityCounts.pendingItems || 0), 0);
    const pendingSeverities = severityEntries
      .filter(([, severityCounts]) => (severityCounts.pendingItems || 0) > 0)
      .map(([severity]) => Number(severity))
      .filter(Number.isFinite);
    chapterCounts.highestPendingSeverity = pendingSeverities.length > 0
      ? Math.max(...pendingSeverities)
      : null;
  }
}

function loadRepairQueueProgress() {
  const seen = new Set();
  const totals = createRepairQueueCounts({
    bySeverity: {},
    byChapter: {},
  });
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
      ...createRepairQueueCounts({
        bySeverity: {},
      }),
    };

    items.forEach((item, index) => {
      const key = repairQueueItemKey(item, file, index);
      if (seen.has(key)) return;
      seen.add(key);

      const state = repairQueueItemState(item);
      const severity = repairQueueSeverityKey(item);
      const sourceSeverityCounts = ensureRepairQueueSeverity(sourceCounts, severity);
      const totalSeverityCounts = ensureRepairQueueSeverity(totals, severity);
      const chapterCounts = ensureRepairQueueChapter(totals, item);
      const chapterSeverityCounts = chapterCounts
        ? ensureRepairQueueSeverity(chapterCounts, severity)
        : null;

      incrementRepairQueueCounts(sourceCounts, state);
      incrementRepairQueueCounts(totals, state);
      incrementRepairQueueCounts(sourceSeverityCounts, state);
      incrementRepairQueueCounts(totalSeverityCounts, state);
      if (chapterCounts) incrementRepairQueueCounts(chapterCounts, state);
      if (chapterSeverityCounts) incrementRepairQueueCounts(chapterSeverityCounts, state);
    });

    finalizeRepairQueueSeverityCounts(sourceCounts);
    finalizeRepairQueueCounts(sourceCounts);
    bySource.push(sourceCounts);
  }

  finalizeRepairQueueSeverityCounts(totals);
  finalizeRepairQueueChapterCounts(totals);
  finalizeRepairQueueCounts(totals);

  return {
    generatedAt: new Date().toISOString(),
    percentComplete: totals.percentComplete,
    ...totals,
    sourceFiles: bySource,
  };
}

function loadQuoteAlignmentProgress() {
  if (!fs.existsSync(QUOTE_ALIGNMENT_REPORT_PATH)) {
    return null;
  }
  try {
    const report = JSON.parse(fs.readFileSync(QUOTE_ALIGNMENT_REPORT_PATH, 'utf8'));
    return {
      scanner: report.scanner || 'scan-quote-span-alignment',
      generatedAt: report.generatedAt || null,
      scannedFiles: report.scannedFiles || 0,
      publicationOnly: report.publicationOnly ?? null,
      totalItems: report.totalItems || 0,
      pendingItems: report.pendingItems || 0,
      highPendingItems: report.highPendingItems || 0,
      lowPendingItems: report.lowPendingItems || 0,
      unknownPendingItems: report.unknownPendingItems || 0,
      highestPendingSeverity: report.highestPendingSeverity ?? null,
      bySeverity: report.bySeverity || {},
      byProblem: report.byProblem || {},
      byChapter: report.byChapter || {},
    };
  } catch (error) {
    console.warn(`Could not read quote alignment report ${QUOTE_ALIGNMENT_REPORT_PATH}: ${error.message}`);
    return null;
  }
}

function loadPlaceholderTranslationsProgress() {
  if (!fs.existsSync(PLACEHOLDER_TRANSLATIONS_REPORT_PATH)) {
    return null;
  }
  try {
    const report = JSON.parse(fs.readFileSync(PLACEHOLDER_TRANSLATIONS_REPORT_PATH, 'utf8'));
    return {
      scanner: report.scanner || 'scan-placeholder-translations',
      generatedAt: report.generatedAt || null,
      scannedFiles: report.scannedFiles || 0,
      totalItems: report.totalItems || 0,
      pendingItems: report.pendingItems || 0,
      highPendingItems: report.highPendingItems || 0,
      lowPendingItems: report.lowPendingItems || 0,
      unknownPendingItems: report.unknownPendingItems || 0,
      highestPendingSeverity: report.highestPendingSeverity ?? null,
      bySeverity: report.bySeverity || {},
      byPattern: report.byPattern || {},
      byChapter: report.byChapter || {},
    };
  } catch (error) {
    console.warn(`Could not read placeholder translation report ${PLACEHOLDER_TRANSLATIONS_REPORT_PATH}: ${error.message}`);
    return null;
  }
}

function glossaryHealthSeverity(hit) {
  const coverage = Number(hit?.glossaryCoverage);
  const lowRate = Number(hit?.lowGlossarySentenceRate);
  const zeroRate = Number(hit?.zeroGlossarySentenceRate);
  const scorable = Number(hit?.scorableSentences);

  if (!Number.isFinite(coverage) || !Number.isFinite(scorable) || scorable <= 0) {
    return 2;
  }
  if (coverage < 0.35 || zeroRate >= 0.25 || lowRate >= 0.5) {
    return 3;
  }
  return 2;
}

function loadTranslationAlignmentProgress() {
  if (!fs.existsSync(TRANSLATION_ALIGNMENT_REPORT_PATH)) {
    return null;
  }
  try {
    const overrides = loadQualitySignalOverrides();
    const report = JSON.parse(fs.readFileSync(TRANSLATION_ALIGNMENT_REPORT_PATH, 'utf8'));
    const chapterHealthHits = (report.hits || [])
      .filter((hit) => hit.rule === 'LOW_GLOSSARY_CHAPTER_HEALTH');
    const byChapter = {};
    for (const hit of chapterHealthHits) {
      const match = String(hit.file || '').match(/^data\/([^/]+)\/(\d{3})\.json$/u);
      if (!match) continue;
      const [, book, chapter] = match;
      if (overrides.has(qualitySignalOverrideKey({
        scanner: 'scan-translation-alignment',
        rule: hit.rule,
        book,
        chapter,
      }))) {
        continue;
      }
      const severity = glossaryHealthSeverity(hit);
      byChapter[`${book}/${chapter}`] = {
        book,
        chapter,
        rule: hit.rule,
        severity,
        totalItems: 1,
        pendingItems: 1,
        highPendingItems: severity >= 3 ? 1 : 0,
        lowPendingItems: severity < 3 ? 1 : 0,
        unknownPendingItems: 0,
        highestPendingSeverity: severity,
        glossaryCoverage: hit.glossaryCoverage,
        lowGlossarySentenceRate: hit.lowGlossarySentenceRate,
        zeroGlossarySentenceRate: hit.zeroGlossarySentenceRate,
        scorableSentences: hit.scorableSentences,
        lowGlossarySentences: hit.lowGlossarySentences,
        zeroGlossarySentences: hit.zeroGlossarySentences,
        examples: hit.examples || [],
      };
    }
    const pendingItems = Object.keys(byChapter).length;
    const highPendingItems = Object.values(byChapter).filter((item) => item.highPendingItems > 0).length;
    const lowPendingItems = Object.values(byChapter).filter((item) => item.lowPendingItems > 0).length;
    return {
      scanner: 'scan-translation-alignment',
      generatedAt: report.generatedAt || null,
      totalItems: chapterHealthHits.length,
      pendingItems,
      highPendingItems,
      lowPendingItems,
      unknownPendingItems: 0,
      highestPendingSeverity: highPendingItems > 0 ? 3 : (lowPendingItems > 0 ? 2 : null),
      byChapter,
    };
  } catch (error) {
    console.warn(`Could not read translation alignment report ${TRANSLATION_ALIGNMENT_REPORT_PATH}: ${error.message}`);
    return null;
  }
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
            if (isExcludedFromTranslationCount(sentence)) {
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

function getRepairQueueChapterStats(repairQueue, bookId, chapter) {
  return repairQueue?.byChapter?.[`${bookId}/${chapter}`] || null;
}

function getQuoteAlignmentChapterStats(quoteAlignment, bookId, chapter) {
  return quoteAlignment?.byChapter?.[`${bookId}/${chapter}`] || null;
}

function getPlaceholderTranslationsChapterStats(placeholderTranslations, bookId, chapter) {
  return placeholderTranslations?.byChapter?.[`${bookId}/${chapter}`] || null;
}

function getTranslationAlignmentChapterStats(translationAlignment, bookId, chapter) {
  return translationAlignment?.byChapter?.[`${bookId}/${chapter}`] || null;
}

function chapterHasHighPending(stats) {
  if (!stats) return false;
  return Number(stats.highPendingItems || 0) > 0
    || Number(stats.highestPendingSeverity || 0) >= 3;
}

function chapterHasPending(stats) {
  return Number(stats?.pendingItems || 0) > 0;
}

function effectiveChapterStatus(baseStatus, repairQueueChapter, quoteAlignmentChapter, placeholderTranslationsChapter, translationAlignmentChapter) {
  if (baseStatus === 'red') return 'red';
  if (chapterHasHighPending(placeholderTranslationsChapter)) return 'red';
  if (chapterHasHighPending(quoteAlignmentChapter)) return 'red';
  if (chapterHasHighPending(repairQueueChapter)) return 'red';
  if (chapterHasHighPending(translationAlignmentChapter)) return 'red';
  if (chapterHasPending(placeholderTranslationsChapter)) return 'yellow';
  if (chapterHasPending(quoteAlignmentChapter)) return 'yellow';
  if (chapterHasPending(repairQueueChapter)) return 'yellow';
  if (chapterHasPending(translationAlignmentChapter)) return 'yellow';
  if (baseStatus === 'yellow') return 'yellow';
  return baseStatus || 'gray';
}

function bookProgressFromManifest(
  bookId,
  book,
  languageToolScores = null,
  repairQueue = null,
  quoteAlignment = null,
  placeholderTranslations = null,
  translationAlignment = null,
) {
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
    const repairQueueChapter = getRepairQueueChapterStats(repairQueue, bookId, chapter.chapter);
    const quoteAlignmentChapter = getQuoteAlignmentChapterStats(quoteAlignment, bookId, chapter.chapter);
    const placeholderTranslationsChapter = getPlaceholderTranslationsChapterStats(placeholderTranslations, bookId, chapter.chapter);
    const translationAlignmentChapter = getTranslationAlignmentChapterStats(translationAlignment, bookId, chapter.chapter);
    const translationComplete = (chapter.sentenceCount || 0) > 0 && (chapter.translatedCount || 0) >= (chapter.sentenceCount || 0);
    const status = languageTool?.status || 'gray';
    const displayStatus = effectiveChapterStatus(status, repairQueueChapter, quoteAlignmentChapter, placeholderTranslationsChapter, translationAlignmentChapter);
    bookProgress.chapters.push({
      chapter: chapter.chapter,
      title: chapter.title,
      status: status,
      displayStatus,
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
      reviewed: chapter.reviewed ?? false,
      repairQueue: repairQueueChapter ? {
        totalItems: repairQueueChapter.totalItems,
        completedItems: repairQueueChapter.completedItems,
        pendingItems: repairQueueChapter.pendingItems,
        appliedItems: repairQueueChapter.appliedItems,
        approvedItems: repairQueueChapter.approvedItems,
        rejectedItems: repairQueueChapter.rejectedItems,
        percentComplete: repairQueueChapter.percentComplete,
        highPendingItems: repairQueueChapter.highPendingItems,
        lowPendingItems: repairQueueChapter.lowPendingItems,
        unknownPendingItems: repairQueueChapter.unknownPendingItems,
        highestPendingSeverity: repairQueueChapter.highestPendingSeverity,
        bySeverity: repairQueueChapter.bySeverity,
      } : null,
      quoteAlignment: quoteAlignmentChapter ? {
        totalItems: quoteAlignmentChapter.totalItems,
        pendingItems: quoteAlignmentChapter.pendingItems,
        highPendingItems: quoteAlignmentChapter.highPendingItems,
        lowPendingItems: quoteAlignmentChapter.lowPendingItems,
        unknownPendingItems: quoteAlignmentChapter.unknownPendingItems,
        highestPendingSeverity: quoteAlignmentChapter.highestPendingSeverity,
        bySeverity: quoteAlignmentChapter.bySeverity,
      } : null,
      placeholderTranslations: placeholderTranslationsChapter ? {
        totalItems: placeholderTranslationsChapter.totalItems,
        pendingItems: placeholderTranslationsChapter.pendingItems,
        highPendingItems: placeholderTranslationsChapter.highPendingItems,
        lowPendingItems: placeholderTranslationsChapter.lowPendingItems,
        unknownPendingItems: placeholderTranslationsChapter.unknownPendingItems,
        highestPendingSeverity: placeholderTranslationsChapter.highestPendingSeverity,
        bySeverity: placeholderTranslationsChapter.bySeverity,
      } : null,
      translationAlignment: translationAlignmentChapter ? {
        totalItems: translationAlignmentChapter.totalItems,
        pendingItems: translationAlignmentChapter.pendingItems,
        highPendingItems: translationAlignmentChapter.highPendingItems,
        lowPendingItems: translationAlignmentChapter.lowPendingItems,
        highestPendingSeverity: translationAlignmentChapter.highestPendingSeverity,
        glossaryCoverage: translationAlignmentChapter.glossaryCoverage,
        lowGlossarySentenceRate: translationAlignmentChapter.lowGlossarySentenceRate,
        zeroGlossarySentenceRate: translationAlignmentChapter.zeroGlossarySentenceRate,
        scorableSentences: translationAlignmentChapter.scorableSentences,
        lowGlossarySentences: translationAlignmentChapter.lowGlossarySentences,
        zeroGlossarySentences: translationAlignmentChapter.zeroGlossarySentences,
        examples: translationAlignmentChapter.examples,
      } : null
    });
  }

  return bookProgress;
}

function buildProgressSummary(books) {
  const chapters = Object.values(books).flatMap((book) => book.chapters || []);
  const isTranslationComplete = (chapter) => (chapter.sentenceCount || 0) > 0 && (chapter.translatedCount || 0) >= (chapter.sentenceCount || 0);
  const completedChapters = chapters.filter(isTranslationComplete).length;
  const cleanup = chapters.reduce((counts, chapter) => {
    const status = chapter.displayStatus || chapter.status || 'gray';
    counts[status] = (counts[status] || 0) + 1;
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
    quoteAlignment: loadQuoteAlignmentProgress(),
    placeholderTranslations: loadPlaceholderTranslationsProgress(),
    translationAlignment: loadTranslationAlignmentProgress(),
    books: {}
  };

  for (const bookId in manifest.books) {
    const book = manifest.books[bookId];
    progress.books[bookId] = bookProgressFromManifest(
      bookId,
      book,
      languageToolScores,
      progress.repairQueue,
      progress.quoteAlignment,
      progress.placeholderTranslations,
      progress.translationAlignment,
    );
  }

  progress.summary = buildProgressSummary(progress.books);

  return progress;
}

function publicProgressIndex(progress) {
  const bookChunks = {};
  const books = {};
  for (const [bookId, book] of Object.entries(progress.books || {})) {
    bookChunks[bookId] = `data/progress/books/${bookId}.json`;
    books[bookId] = {
      id: bookId,
      name: book.name,
      chinese: book.chinese,
      pinyin: book.pinyin,
      dynasty: book.dynasty,
      totalChapters: Array.isArray(book.chapters) ? book.chapters.length : 0,
      statusCounts: book.statusCounts || null,
      summary: book.summary || null,
    };
  }
  return {
    ...progress,
    books,
    bookChunks,
    chunked: true,
  };
}

function writePublicProgress(progress) {
  fs.mkdirSync(PUBLIC_PROGRESS_BOOKS_DIR, { recursive: true });

  const currentBookFiles = new Set();
  for (const [bookId, book] of Object.entries(progress.books || {})) {
    const filename = path.join(PUBLIC_PROGRESS_BOOKS_DIR, `${bookId}.json`);
    currentBookFiles.add(path.resolve(filename));
    fs.writeFileSync(filename, JSON.stringify({
      generatedAt: progress.generatedAt,
      bookId,
      book,
    }, null, 2), 'utf8');
  }

  for (const entry of fs.readdirSync(PUBLIC_PROGRESS_BOOKS_DIR)) {
    if (!entry.endsWith('.json')) continue;
    const filename = path.join(PUBLIC_PROGRESS_BOOKS_DIR, entry);
    if (!currentBookFiles.has(path.resolve(filename))) {
      fs.unlinkSync(filename);
    }
  }

  const index = publicProgressIndex(progress);
  fs.writeFileSync(PUBLIC_PROGRESS_PATH, JSON.stringify(index, null, 2), 'utf8');
  console.log(`Progress index copied to ${PUBLIC_PROGRESS_PATH}`);
  console.log(`Progress book chunks written to ${PUBLIC_PROGRESS_BOOKS_DIR}`);
}

function writeProgress(progress) {
  fs.writeFileSync('./data/progress.json', JSON.stringify(progress, null, 2), 'utf8');
  console.log('Progress data written to data/progress.json');

  writePublicProgress(progress);
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
  progress.quoteAlignment = loadQuoteAlignmentProgress();
  progress.placeholderTranslations = loadPlaceholderTranslationsProgress();
  progress.translationAlignment = loadTranslationAlignmentProgress();
  progress.books = progress.books || {};
  progress.books[bookId] = bookProgressFromManifest(
    bookId,
    manifest.books[bookId],
    languageToolScores,
    progress.repairQueue,
    progress.quoteAlignment,
    progress.placeholderTranslations,
    progress.translationAlignment,
  );
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
  loadQuoteAlignmentProgress,
  loadPlaceholderTranslationsProgress,
  loadTranslationAlignmentProgress,
};
