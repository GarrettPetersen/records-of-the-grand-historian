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

  // Check if this is a genealogical table chapter
  const isGenealogicalTable = chapterData.meta.book === 'shiji' &&
    ['013', '014', '015'].includes(chapterData.meta.chapter);

  for (const block of chapterData.content) {
    if (block.type === 'paragraph') {
      // Skip paragraphs in genealogical table chapters that contain table-like data
      if (isGenealogicalTable && block.sentences && block.sentences.length > 0) {
        const zh = block.sentences[0].zh;
        // Skip if it contains years (4-digit numbers) or is mostly numbers/spaces
        if (/\d{4}/.test(zh) || /^[\d\s]+$/.test(zh)) {
          continue;
        }
      }

      for (const sentence of block.sentences || []) {
        // Skip empty content
        if (!sentence.zh || sentence.zh.trim() === '') continue;

        totalCount++;
        // Check if translation exists
        // Check idiomatic first, then literal
        const translation = sentence.translations?.[0]?.idiomatic || sentence.translations?.[0]?.literal || sentence.translations?.[0]?.text;
        if (translation && translation.trim() !== '') {
          translatedCount++;
        }
      }
    } else if (block.type === 'table_row') {
      for (const cell of block.cells || []) {
        // Skip empty content
        if (!cell.content || cell.content.trim() === '') continue;

        totalCount++;
        // Check idiomatic first, then literal
        const translation = cell.idiomatic || cell.literal || cell.translation;
        if (translation && translation.trim() !== '') {
          translatedCount++;
        }
      }
    } else if (block.type === 'table_header') {
      for (const sentence of block.sentences || []) {
        // Skip empty content
        if (!sentence.zh || sentence.zh.trim() === '') continue;

        totalCount++;
        // Check if translation exists
        // Check idiomatic first, then literal
        const translation = sentence.translations?.[0]?.idiomatic || sentence.translations?.[0]?.literal || sentence.translations?.[0]?.text;
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
