#!/usr/bin/env node

/**
 * translate_batch.js - Helper script for translating chapter batches
 * 
 * This script provides guidance on how to translate batches using AI services.
 * It formats the Chinese text for easy copying to AI translation tools.
 * 
 * Usage:
 *   node translate_batch.js translations/batches_014/batch_01.json
 */

import fs from 'node:fs';
import path from 'node:path';

function formatForTranslation(batchFile) {
  const data = JSON.parse(fs.readFileSync(batchFile, 'utf8'));
  const entries = Object.entries(data);
  
  console.log(`📋 Translation Batch: ${path.basename(batchFile)}`);
  console.log(`📊 Sentences: ${entries.length}`);
  console.log(`\n${'='.repeat(80)}`);
  console.log(`COPY THE TEXT BELOW TO YOUR AI TRANSLATION SERVICE:`);
  console.log(`${'='.repeat(80)}\n`);
  
  entries.forEach(([id, text], index) => {
    console.log(`${id}: ${text}`);
  });
  
  console.log(`\n${'='.repeat(80)}`);
  console.log(`EXPECTED OUTPUT FORMAT (save as: translations/translations_014_${path.basename(batchFile, '.json')}.json):`);
  console.log(`${'='.repeat(80)}\n`);
  
  const outputTemplate = {};
  entries.forEach(([id, text]) => {
    outputTemplate[id] = "English translation here...";
  });
  
  console.log(JSON.stringify(outputTemplate, null, 2));
  
  console.log(`\n${'='.repeat(80)}`);
  console.log(`TRANSLATION INSTRUCTIONS:`);
  console.log(`${'='.repeat(80)}`);
  console.log(`• Translate each Chinese sentence to clear, accurate English`);
  console.log(`• Maintain historical and academic tone`);
  console.log(`• Do NOT start translations with closing quotation marks (" or ")`);
  console.log(`• Preserve the sentence structure and meaning`);
  console.log(`• For table data, ensure translations are concise but complete`);
  console.log(`• Example: "太史公讀春秋歷譜諜，至周厲王，未嘗不廢書而嘆也。"`);
  console.log(`           → "Sima Qian read the Spring and Autumn Annals and various historical records. When he reached King Li of Zhou, he could not help but put down his book and sigh."`);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Usage: node translate_batch.js <batch-file>

Example:
  node translate_batch.js translations/batches_014/batch_01.json

This will display the Chinese text formatted for AI translation services.
`);
    process.exit(0);
  }
  
  const batchFile = args[0];
  
  if (!fs.existsSync(batchFile)) {
    console.error(`Error: File not found: ${batchFile}`);
    process.exit(1);
  }
  
  try {
    formatForTranslation(batchFile);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
