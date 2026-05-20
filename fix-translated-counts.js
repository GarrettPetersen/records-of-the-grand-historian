#!/usr/bin/env node

/**
 * fix-translated-counts.js - Recalculate translatedCount for all chapter files
 * 
 * Reads existing JSON files and updates the meta.translatedCount field
 * based on actual sentence translations without re-scraping.
 * 
 * Usage:
 *   node fix-translated-counts.js
 *   node fix-translated-counts.js --book shiji
 */

import fs from 'node:fs';
import path from 'node:path';
import { countChapterMetrics } from './chapter-counts.mjs';

const DATA_DIR = './data';

function parseBookArg() {
  const i = process.argv.indexOf('--book');
  if (i === -1 || !process.argv[i + 1]) return null;
  return process.argv[i + 1].trim();
}

// Check if text contains Chinese characters
function containsChinese(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

function recalculateChapterCounts(chapterData) {
  const { sentenceCount, translatedCount } = countChapterMetrics(chapterData);
  return { sentenceCount, translatedCount };
}

function processFile(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const oldSentenceCount = data.meta.sentenceCount;
    const oldTranslatedCount = data.meta.translatedCount;

    const result = recalculateChapterCounts(data);
    const countsChanged = oldSentenceCount !== result.sentenceCount || oldTranslatedCount !== result.translatedCount;

    if (countsChanged) {
      data.meta.sentenceCount = result.sentenceCount;
      data.meta.translatedCount = result.translatedCount;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      return {
        updated: true,
        oldSentenceCount,
        oldTranslatedCount,
        newSentenceCount: result.sentenceCount,
        newTranslatedCount: result.translatedCount
      };
    }

    return {
      updated: false,
      oldSentenceCount,
      oldTranslatedCount,
      newSentenceCount: result.sentenceCount,
      newTranslatedCount: result.translatedCount
    };
  } catch (err) {
    console.error(`Error processing ${filePath}: ${err.message}`);
    return null;
  }
}

function main() {
  const onlyBook = parseBookArg();
  console.log(
    onlyBook
      ? `Recalculating translated counts for ${onlyBook}...\n`
      : 'Recalculating translated counts...\n',
  );

  let totalFiles = 0;
  let updatedFiles = 0;

  const entries = fs.readdirSync(DATA_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (onlyBook && entry.name !== onlyBook) continue;

    const bookDir = path.join(DATA_DIR, entry.name);
    const files = fs.readdirSync(bookDir)
      .filter(f => f.endsWith('.json'))
      .sort();

    if (files.length === 0) continue;

    console.log(`Processing ${entry.name}...`);

    for (const file of files) {
      const filePath = path.join(bookDir, file);
      totalFiles++;

    const result = processFile(filePath);
    if (result) {
      if (result.updated) {
        console.log(`  ${file}: sentences ${result.oldSentenceCount} → ${result.newSentenceCount}, translated ${result.oldTranslatedCount} → ${result.newTranslatedCount}`);
        updatedFiles++;
      }
    }
    }
  }

  console.log(`\nProcessed ${totalFiles} files.`);
  console.log(`Updated ${updatedFiles} files.`);

  if (updatedFiles > 0) {
    console.log('\nRun "make manifest" to update the frontend.');
  }
}

main();
