#!/usr/bin/env node

/**
 * fix-translated-counts.js - Recalculate translatedCount for all chapter files
 * 
 * Reads existing JSON files and updates the meta.translatedCount field
 * based on actual sentence translations without re-scraping.
 * 
 * Usage: node fix-translated-counts.js
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = './data';

// Check if text contains Chinese characters
function containsChinese(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

function recalculateTranslatedCount(chapterData) {
  let translatedCount = 0;
  let totalCount = 0;

  for (const block of chapterData.content) {
    if (block.type === 'paragraph') {
      for (const sentence of block.sentences || []) {
        // Skip empty content
        if (!sentence.zh || sentence.zh.trim() === '') continue;

        totalCount++;
        // Check if translation exists and doesn't contain Chinese characters
        const translation = sentence.translations?.[0]?.text;
        if (translation && translation.trim() !== '' && !containsChinese(translation)) {
          translatedCount++;
        }
      }
    } else if (block.type === 'table_row') {
      for (const cell of block.cells || []) {
        // Skip empty content
        if (!cell.content || cell.content.trim() === '') continue;

        // Handle different table types
        const isGenealogicalTable = chapterData.meta.book === 'shiji' &&
          ['013', '014', '015'].includes(chapterData.meta.chapter);
        const isMonthlyChronicle = chapterData.meta.book === 'shiji' &&
          chapterData.meta.chapter === '016';

        if (isGenealogicalTable) {
          // All cells in genealogical tables are considered translated (proper names)
          totalCount++;
          translatedCount++;
        } else if (isMonthlyChronicle) {
          // For chapter 16 (monthly chronicle), only count cells with Chinese characters
          // that are not pure numbers, matching extract-untranslated.js logic
          const content = cell.content.trim();
          const hasChinese = /[\u4e00-\u9fff]/.test(content);
          const isPureNumbers = /^[\d\s]+$/.test(content);

          if (hasChinese && !isPureNumbers) {
            totalCount++;
            const translation = cell.translation;
            if (translation && translation.trim() !== '') {
              translatedCount++;
            }
          }
          // Cells that are pure numbers or don't have Chinese characters are not counted
          // in either total or translated for percentage calculation
        } else {
          // For other tables, check if translation exists and doesn't contain Chinese characters
          totalCount++;
          const translation = cell.translation;
          if (translation && translation.trim() !== '' && !containsChinese(translation)) {
            translatedCount++;
          }
        }
      }
    } else if (block.type === 'table_header') {
      for (const sentence of block.sentences || []) {
        // Skip empty content
        if (!sentence.zh || sentence.zh.trim() === '') continue;

        totalCount++;
        // Check if translation exists and doesn't contain Chinese characters
        const translation = sentence.translations?.[0]?.text;
        if (translation && translation.trim() !== '' && !containsChinese(translation)) {
          translatedCount++;
        }
      }
    }
  }

  return { translatedCount, totalCount };
}

function processFile(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const oldCount = data.meta.translatedCount;


    const result = recalculateTranslatedCount(data);
    const newCount = result.translatedCount;

    if (oldCount !== newCount) {
      data.meta.translatedCount = newCount;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      return { updated: true, oldCount, newCount };
    }

    return { updated: false, oldCount, newCount };
  } catch (err) {
    console.error(`Error processing ${filePath}: ${err.message}`);
    return null;
  }
}

function main() {
  console.log('Recalculating translated counts...\n');

  let totalFiles = 0;
  let updatedFiles = 0;

  const entries = fs.readdirSync(DATA_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

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
          console.log(`  ${file}: ${result.oldCount} → ${result.newCount}`);
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
