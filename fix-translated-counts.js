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

function recalculateTranslatedCount(chapterData) {
  let translatedCount = 0;
  
  for (const block of chapterData.content) {
    if (block.sentences) {
      for (const sentence of block.sentences) {
        if (sentence.translations && 
            sentence.translations.length > 0 && 
            sentence.translations[0].text) {
          translatedCount++;
        }
      }
    }
  }
  
  return translatedCount;
}

function processFile(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const oldCount = data.meta.translatedCount;
    const newCount = recalculateTranslatedCount(data);
    
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
