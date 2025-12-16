#!/usr/bin/env node

/**
 * fix-double-quotes.js - Fix doubled closing quotes in English translations
 * 
 * Removes extra closing quotes like ..."" or ...\"\"" from English translations.
 * 
 * Usage:
 *   node fix-double-quotes.js <chapter-file> [--dry-run]
 */

import fs from 'node:fs';

function fixDoubleQuotes(data, dryRun = false) {
  const fixed = [];
  
  for (const block of data.content) {
    for (const sentence of block.sentences) {
      if (!sentence.translations || sentence.translations.length === 0) continue;
      
      const trans = sentence.translations[0];
      if (!trans.text) continue;
      
      const original = trans.text;
      let fixed_text = original;
      
      // Fix patterns like: text"" or text'"' or text"\"
      // Replace sequences of 2+ identical closing quotes with just one
      fixed_text = fixed_text.replace(/(["')'])\1+/g, '$1');
      
      if (fixed_text !== original) {
        if (!dryRun) {
          trans.text = fixed_text;
        }
        fixed.push({
          id: sentence.id,
          before: original,
          after: fixed_text
        });
      }
    }
  }
  
  return fixed;
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log('\nUsage:');
    console.log('  node fix-double-quotes.js <chapter-file> [--dry-run]');
    console.log('\nOptions:');
    console.log('  --dry-run    Show what would be changed without modifying the file');
    console.log('\nExample:');
    console.log('  node fix-double-quotes.js data/shiji/006.json\n');
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
    
    console.log('\n=== Fix Double Quotes ===\n');
    console.log(`File: ${filePath}`);
    console.log(`Mode: ${dryRun ? 'DRY RUN (no changes will be saved)' : 'LIVE'}\n`);
    
    const fixed = fixDoubleQuotes(data, dryRun);
    
    if (fixed.length === 0) {
      console.log('✅ No double quotes found!\n');
      process.exit(0);
    }
    
    console.log(`Found and fixed ${fixed.length} double quote(s):\n`);
    console.log('─'.repeat(80));
    
    for (const item of fixed) {
      console.log(`${item.id}:`);
      console.log(`  Before: ...${item.before.slice(-60)}`);
      console.log(`  After:  ...${item.after.slice(-60)}`);
      console.log();
    }
    
    if (!dryRun) {
      // Backup original file
      const backupPath = filePath + '.bak2';
      fs.copyFileSync(filePath, backupPath);
      console.log(`📦 Backup created: ${backupPath}`);
      
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