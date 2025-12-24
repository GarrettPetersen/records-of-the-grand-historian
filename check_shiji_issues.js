#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const chaptersWithIssues = [];

console.log('Checking all shiji chapters for translation quality issues...\n');

for (let i = 1; i <= 130; i++) {
  const chapterNum = i.toString().padStart(3, '0');
  const chapterPath = `data/shiji/${chapterNum}.json`;

  try {
    // Run score-translations and capture output
    const output = execSync(`make score-translations CHAPTER=${chapterPath}`, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: process.cwd()
    });

    // Extract problematic count
    const match = output.match(/Found (\d+) problematic translations/);
    const problematicCount = match ? parseInt(match[1]) : 0;

    if (problematicCount > 0) {
      console.log(`Chapter ${chapterNum}: ${problematicCount} problematic translations ⚠️`);
      chaptersWithIssues.push({ chapter: chapterNum, issues: problematicCount });
    } else {
      console.log(`Chapter ${chapterNum}: CLEAN ✅`);
    }

  } catch (error) {
    console.log(`Chapter ${chapterNum}: ERROR checking`);
  }
}

console.log(`\n=== SUMMARY ===`);
console.log(`Chapters with issues: ${chaptersWithIssues.length}`);
chaptersWithIssues.forEach(item => {
  console.log(`  ${item.chapter}: ${item.issues} issues`);
});

if (chaptersWithIssues.length > 0) {
  console.log(`\nThese chapters should have their translations removed and redone.`);
}
