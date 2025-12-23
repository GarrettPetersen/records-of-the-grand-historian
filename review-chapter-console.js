#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Review translations from a chapter file by printing to console
 * Usage: node review-chapter-console.js <chapter-file.json>
 */
function reviewChapterConsole(filePath) {
  console.log(`📖 Reviewing translations from: ${filePath}\n`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  console.log(`📚 Book: ${data.meta.bookInfo.name} (${data.meta.bookInfo.chinese})`);
  console.log(`📄 Chapter: ${data.meta.chapter} - ${data.meta.title.en || data.meta.title.zh}`);
  console.log(`📊 Progress: ${data.meta.translatedCount}/${data.meta.sentenceCount} sentences translated`);
  console.log(`🔗 URL: ${data.meta.url}\n`);

  let translationCount = 0;
  let reviewCount = 0;

  // Extract and display translations
  if (data.content) {
    for (const block of data.content) {
      if (block.type === 'paragraph') {
        for (const sentence of block.sentences || []) {
          if (sentence.translations && sentence.translations.length > 0) {
            const translation = sentence.translations[0];
            const english = translation.idiomatic || translation.literal || translation.text;

            if (english) {
              translationCount++;
              console.log(`─── Sentence ${translationCount} ──────────────────────────────────────────────`);
              console.log(`ID: ${sentence.id}`);
              console.log(`中文: ${sentence.zh || sentence.content}`);
              console.log(`English: ${english}`);
              console.log(`Translator: ${translation.translator || 'Unknown'}`);
              if (translation.model) {
                console.log(`Model: ${translation.model}`);
              }
              console.log('');

              // Pause for user review every 10 translations
              if (translationCount % 10 === 0) {
                console.log(`⏸️  Reviewed ${translationCount} translations so far. Press Enter to continue...`);
                // In a real interactive session, we'd wait for input here
                // For now, we'll just continue
              }
            }
          }
        }
      } else if (block.type === 'table_row') {
        for (const cell of block.cells || []) {
          const english = cell.idiomatic || cell.translation;
          if (english) {
            translationCount++;
            console.log(`─── Table Cell ${translationCount} ─────────────────────────────────────────────`);
            console.log(`ID: ${cell.id}`);
            console.log(`中文: ${cell.content}`);
            console.log(`English: ${english}`);
            console.log(`Translator: ${cell.translator || 'Unknown'}`);
            console.log('');
          }
        }
      }
    }
  }

  console.log(`\n✅ Review complete!`);
  console.log(`📊 Total translations reviewed: ${translationCount}`);
  console.log(`💡 Tip: Use this output to spot-check translation quality and identify areas for improvement.`);

  if (translationCount === 0) {
    console.log(`\n⚠️  No translations found in this chapter. It may need translation work first.`);
  }
}

// Main execution
const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('Usage: node review-chapter-console.js <chapter-file.json>');
  console.error('Example: node review-chapter-console.js data/shiji/004.json');
  process.exit(1);
}

reviewChapterConsole(args[0]);
