#!/usr/bin/env node

/**
 * extract-untranslated.js - Extract untranslated sentences from a chapter
 * 
 * Creates a JSON file mapping sentence IDs to Chinese text for all
 * untranslated sentences in a chapter.
 * 
 * Usage:
 *   node extract-untranslated.js <chapter-file> [output-file]
 *   node extract-untranslated.js data/shiji/007.json
 *   node extract-untranslated.js data/shiji/007.json translations/untranslated_007.json
 */

import fs from 'node:fs';
import path from 'node:path';

function extractUntranslated(filePath, outputPath = null) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const untranslated = {};
  
  for (const block of data.content) {
    let sentences = [];

    if (block.type === 'paragraph') {
      sentences = block.sentences;
    } else if (block.type === 'table_row') {
      sentences = block.cells.events;
    } else if (block.type === 'table_header') {
      sentences = block.sentences;
    }

    for (const sentence of sentences) {
      const trans = sentence.translations[0];
      if (!trans.text || trans.text.trim() === '') {
        untranslated[sentence.id] = sentence.zh;
      }
    }
  }
  
  // Default output path if not provided
  if (!outputPath) {
    const baseName = path.basename(filePath, '.json');
    outputPath = path.join('translations', `untranslated_${baseName}.json`);
  }
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(untranslated, null, 2), 'utf8');
  
  const total = data.meta.sentenceCount;
  const untranslatedCount = Object.keys(untranslated).length;
  const translatedCount = total - untranslatedCount;
  const percent = total > 0 ? Math.round((translatedCount / total) * 100) : 0;
  
  return {
    filePath,
    outputPath,
    total,
    translated: translatedCount,
    untranslated: untranslatedCount,
    percent
  };
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Usage:
  node extract-untranslated.js <chapter-file> [output-file]

Examples:
  node extract-untranslated.js data/shiji/007.json
  node extract-untranslated.js data/shiji/007.json translations/untranslated_007.json

Output:
  Creates a JSON file with untranslated sentence IDs mapped to Chinese text.
  Default output: translations/untranslated_<chapter>.json
`);
    process.exit(0);
  }
  
  const filePath = args[0];
  const outputPath = args[1] || null;
  
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }
  
  try {
    const result = extractUntranslated(filePath, outputPath);
    
    console.log(`
📖 Chapter: ${path.basename(result.filePath)}`);
    console.log(`📊 Translation Status:`);
    console.log(`   Total sentences: ${result.total}`);
    console.log(`   Translated: ${result.translated} (${result.percent}%)`);
    console.log(`   Untranslated: ${result.untranslated}`);
    console.log(`
💾 Saved to: ${result.outputPath}
`);
    
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();