#!/usr/bin/env node

/**
 * fix-orphan-quotes.js - Fix sentences that are only closing quotation marks
 * 
 * Merges standalone closing quotes with the previous sentence.
 * Preserves existing translations - only modifies structure.
 * 
 * Usage:
 *   node fix-orphan-quotes.js <chapter-file> [--dry-run]
 *   node fix-orphan-quotes.js data/shiji/007.json
 *   node fix-orphan-quotes.js data/shiji/007.json --dry-run
 */

import fs from 'node:fs';

const CHINESE_CLOSE_QUOTES_ONLY = /^[」"'』】)]+$/;
const ENGLISH_CLOSE_QUOTES_ONLY = /^[")'\]]+$/;
const CHINESE_STARTS_WITH_CLOSE_QUOTE = /^([」"'』】)]+)(.+)/;
const ENGLISH_STARTS_WITH_CLOSE_QUOTE = /^([")'\]]+)(.+)/;

function fixOrphanQuotes(data, dryRun = false) {
  let fixed = 0;
  let movedQuotes = [];
  let removedSentences = [];
  
  for (const block of data.content) {
    const sentences = block.sentences;
    let i = 0;
    
    while (i < sentences.length) {
      const sentence = sentences[i];
      const zhIsOrphanOnly = CHINESE_CLOSE_QUOTES_ONLY.test(sentence.zh.trim());
      const enIsOrphanOnly = sentence.translations && 
                        sentence.translations.length > 0 && 
                        sentence.translations[0].text &&
                        ENGLISH_CLOSE_QUOTES_ONLY.test(sentence.translations[0].text.trim());
      
      // Case 1: Sentence is ONLY a closing quote - merge entire sentence with previous
      if ((zhIsOrphanOnly || enIsOrphanOnly) && i > 0) {
        const prevSentence = sentences[i - 1];
        
        // Merge Chinese if it's an orphan
        if (zhIsOrphanOnly) {
          prevSentence.zh += sentence.zh;
        }
        
        // Merge English if it's an orphan and previous has translation
        if (enIsOrphanOnly && 
            prevSentence.translations && 
            prevSentence.translations.length > 0 &&
            prevSentence.translations[0].text) {
          prevSentence.translations[0].text += sentence.translations[0].text;
        }
        
        removedSentences.push({
          id: sentence.id,
          zh: sentence.zh,
          en: sentence.translations[0]?.text || '',
          mergedInto: prevSentence.id
        });
        
        // Remove this sentence
        sentences.splice(i, 1);
        fixed++;
        
        // Don't increment i since we removed an element
        continue;
      }
      
      // Case 2: Sentence STARTS with closing quote - move quote to end of previous sentence
      const zhMatch = sentence.zh.trim().match(CHINESE_STARTS_WITH_CLOSE_QUOTE);
      const enMatch = sentence.translations && 
                     sentence.translations.length > 0 && 
                     sentence.translations[0].text &&
                     sentence.translations[0].text.trim().match(ENGLISH_STARTS_WITH_CLOSE_QUOTE);
      
      if ((zhMatch || enMatch) && i > 0) {
        const prevSentence = sentences[i - 1];
        
        // Move Chinese closing quote(s)
        if (zhMatch) {
          const [, quotes, rest] = zhMatch;
          // Only add if previous doesn't already end with this exact quote sequence
          if (!prevSentence.zh.endsWith(quotes)) {
            prevSentence.zh += quotes;
          }
          sentence.zh = sentence.zh.replace(CHINESE_STARTS_WITH_CLOSE_QUOTE, '$2');
        }
        
        // Move English closing quote(s)
        if (enMatch && 
            prevSentence.translations && 
            prevSentence.translations.length > 0 &&
            prevSentence.translations[0].text) {
          const [, quotes, rest] = enMatch;
          const prevText = prevSentence.translations[0].text;
          
          // Check if adding these quotes would create duplication
          // For each character in quotes, check if it's already at the end
          let quotesToAdd = '';
          for (const char of quotes) {
            if (!prevText.endsWith(quotesToAdd + char)) {
              quotesToAdd += char;
            }
          }
          
          if (quotesToAdd) {
            prevSentence.translations[0].text += quotesToAdd;
          }
          sentence.translations[0].text = sentence.translations[0].text.replace(ENGLISH_STARTS_WITH_CLOSE_QUOTE, '$2');
        }
        
        movedQuotes.push({
          id: sentence.id,
          movedTo: prevSentence.id,
          zhQuotes: zhMatch ? zhMatch[1] : null,
          enQuotes: enMatch ? enMatch[1] : null
        });
        
        fixed++;
      }
      
      i++;
    }
  }
  
  // Update metadata
  if (!dryRun && removedSentences.length > 0) {
    data.meta.sentenceCount -= removedSentences.length;
    // Only decrease translatedCount if we removed translated orphans
    const translatedOrphans = removedSentences.filter(s => s.en && s.en.trim()).length;
    if (data.meta.translatedCount) {
      data.meta.translatedCount -= translatedOrphans;
    }
  }
  
  return { fixed, removedSentences, movedQuotes };
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log('\nUsage:');
    console.log('  node fix-orphan-quotes.js <chapter-file> [--dry-run]');
    console.log('\nOptions:');
    console.log('  --dry-run    Show what would be changed without modifying the file');
    console.log('\nExample:');
    console.log('  node fix-orphan-quotes.js data/shiji/007.json');
    console.log('  node fix-orphan-quotes.js data/shiji/007.json --dry-run\n');
    process.exit(0);
  }
  
  const filePath = args[0];
  const dryRun = args.includes('--dry-run');
  
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const originalSentenceCount = data.meta.sentenceCount;
    
    console.log('\n=== Fix Orphan Quotes ===\n');
    console.log(`File: ${filePath}`);
    console.log(`Mode: ${dryRun ? 'DRY RUN (no changes will be saved)' : 'LIVE'}\n`);
    
    const result = fixOrphanQuotes(data, dryRun);
    
    if (result.fixed === 0) {
      console.log('✅ No orphan quotes found!\n');
      process.exit(0);
    }
    
    console.log(`Found and fixed ${result.fixed} issue(s):\n`);
    
    if (result.removedSentences.length > 0) {
      console.log(`📌 Removed ${result.removedSentences.length} orphan-only sentence(s):`);
      console.log('─'.repeat(80));
      for (const removed of result.removedSentences) {
        console.log(`Removed ${removed.id} (merged into ${removed.mergedInto}):`);
        console.log(`  zh: "${removed.zh}"`);
        if (removed.en) {
          console.log(`  en: "${removed.en}"`);
        }
        console.log();
      }
    }
    
    if (result.movedQuotes.length > 0) {
      console.log(`📌 Moved ${result.movedQuotes.length} leading closing quote(s):`);
      console.log('─'.repeat(80));
      for (const moved of result.movedQuotes) {
        console.log(`${moved.id} → ${moved.movedTo}:`);
        if (moved.zhQuotes) {
          console.log(`  Chinese: "${moved.zhQuotes}"`);
        }
        if (moved.enQuotes) {
          console.log(`  English: "${moved.enQuotes}"`);
        }
        console.log();
      }
    }
    
    console.log('─'.repeat(80));
    console.log(`Sentence count: ${originalSentenceCount} → ${data.meta.sentenceCount}`);
    
    if (!dryRun) {
      // Backup original file
      const backupPath = filePath + '.backup';
      fs.copyFileSync(filePath, backupPath);
      console.log(`\n📦 Backup created: ${backupPath}`);
      
      // Write fixed data
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✅ Fixed file saved: ${filePath}`);
    } else {
      console.log('\n⚠️  DRY RUN - No changes were saved');
      console.log('Run without --dry-run to apply changes');
    }
    
    console.log();
    
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();