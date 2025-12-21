#!/usr/bin/env node

/**
 * create-remaining-batches.js - Create translation batches for untranslated sentences
 *
 * Usage: node create-remaining-batches.js <chapter-file> [batch-size] [start-batch-num]
 *
 * Examples:
 *   node create-remaining-batches.js data/shiji/048.json
 *   node create-remaining-batches.js data/shiji/048.json 50 1
 */

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: node create-remaining-batches.js <chapter-file> [batch-size] [start-batch-num]');
  console.error('Example: node create-remaining-batches.js data/shiji/048.json 50 1');
  process.exit(1);
}

const chapterFile = args[0];
const batchSize = parseInt(args[1]) || 50;
const startBatchNum = parseInt(args[2]) || 1;

if (!fs.existsSync(chapterFile)) {
  console.error(`Chapter file not found: ${chapterFile}`);
  process.exit(1);
}

// Extract chapter number from filename (e.g., "048" from "data/shiji/048.json")
const chapterMatch = chapterFile.match(/(\d+)\.json$/);
if (!chapterMatch) {
  console.error('Could not extract chapter number from filename');
  process.exit(1);
}
const chapterNum = chapterMatch[1].padStart(3, '0');

// Get remaining untranslated sentences
const data = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));
const untranslated = [];
data.content.forEach(block => {
  if (block.sentences) {
    block.sentences.forEach(s => {
      if (!s.translations || s.translations.length === 0 || !s.translations[0].text || !s.translations[0].text.trim()) {
        untranslated.push({
          id: s.id,
          zh: s.zh || s.content
        });
      }
    });
  }
});

console.log(`Found ${untranslated.length} untranslated sentences in ${chapterFile}`);

// Create batches
for (let i = 0; i < untranslated.length; i += batchSize) {
  const batchNum = startBatchNum + Math.floor(i / batchSize);
  const batchSentences = untranslated.slice(i, i + batchSize);

  const batchFile = `translations/fresh_batch_${chapterNum}_${batchNum}.json`;
  const batch = {};
  batchSentences.forEach(s => {
    batch[s.id] = s.zh;
  });

  fs.writeFileSync(batchFile, JSON.stringify(batch, null, 2));
  console.log(`Created ${batchFile} with ${batchSentences.length} sentences`);
}

console.log(`Batch creation complete for chapter ${chapterNum}.`);
