#!/usr/bin/env node

/**
 * find-orphan-quotes.js - Find sentences that are only closing quotation marks
 * 
 * Detects Chinese sentences that are standalone closing quotes (」" etc.)
 * and English translations that are standalone closing quotes (" ' etc.)
 * 
 * Usage:
 *   node find-orphan-quotes.js <chapter-file>
 *   node find-orphan-quotes.js data/shiji/007.json
 */

import fs from 'node:fs';

const CHINESE_CLOSE_QUOTES = /^[」"'』】)]+$/;
const ENGLISH_CLOSE_QUOTES = /^[")'\]]+$/;

function findOrphanQuotes(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const orphans = {
    chineseOnly: [],
    englishOnly: [],
    both: []
  };
  
  for (const block of data.content) {
    for (const sentence of block.sentences) {
      const zhIsOrphan = CHINESE_CLOSE_QUOTES.test(sentence.zh.trim());
      const enIsOrphan = sentence.translations && 
                        sentence.translations.length > 0 && 
                        sentence.translations[0].text &&
                        ENGLISH_CLOSE_QUOTES.test(sentence.translations[0].text.trim());
      
      if (zhIsOrphan && enIsOrphan) {
        orphans.both.push({
          id: sentence.id,
          zh: sentence.zh,
          en: sentence.translations[0].text
        });
      } else if (zhIsOrphan) {
        orphans.chineseOnly.push({
          id: sentence.id,
          zh: sentence.zh,
          en: sentence.translations[0]?.text || ''
        });
      } else if (enIsOrphan) {
        orphans.englishOnly.push({
          id: sentence.id,
          zh: sentence.zh,
          en: sentence.translations[0].text
        });
      }
    }
  }
  
  return orphans;
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log('\nUsage:');
    console.log('  node find-orphan-quotes.js <chapter-file>');
    console.log('\nExample:');
    console.log('  node find-orphan-quotes.js data/shiji/007.json\n');
    process.exit(0);
  }
  
  const filePath = args[0];
  
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }
  
  try {
    const orphans = findOrphanQuotes(filePath);
    
    console.log('\n=== Orphan Closing Quotes Report ===\n');
    console.log(`File: ${filePath}\n`);
    
    if (orphans.both.length > 0) {
      console.log(`\n📋 Both Chinese and English are orphan quotes (${orphans.both.length}):`);
      console.log('─'.repeat(80));
      for (const item of orphans.both) {
        console.log(`${item.id}: zh="${item.zh}" en="${item.en}"`);
      }
    }
    
    if (orphans.chineseOnly.length > 0) {
      console.log(`\n📋 Chinese only is orphan quote (${orphans.chineseOnly.length}):`);
      console.log('─'.repeat(80));
      for (const item of orphans.chineseOnly) {
        console.log(`${item.id}: zh="${item.zh}" en="${item.en}"`);
      }
    }
    
    if (orphans.englishOnly.length > 0) {
      console.log(`\n📋 English only is orphan quote (${orphans.englishOnly.length}):`);
      console.log('─'.repeat(80));
      for (const item of orphans.englishOnly) {
        console.log(`${item.id}: zh="${item.zh}" en="${item.en}"`);
      }
    }
    
    const total = orphans.both.length + orphans.chineseOnly.length + orphans.englishOnly.length;
    
    if (total === 0) {
      console.log('✅ No orphan quotes found!\n');
    } else {
      console.log('\n' + '='.repeat(80));
      console.log(`Total orphan quotes: ${total}`);
      console.log('  - Both: ' + orphans.both.length);
      console.log('  - Chinese only: ' + orphans.chineseOnly.length);
      console.log('  - English only: ' + orphans.englishOnly.length);
      console.log('='.repeat(80) + '\n');
    }
    
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
