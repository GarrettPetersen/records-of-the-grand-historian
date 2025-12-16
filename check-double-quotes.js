#!/usr/bin/env node

/**
 * check-double-quotes.js - Check for potential doubled closing quotes
 * 
 * Finds cases where a sentence starts with a closing quote AND
 * the previous sentence already ends with a closing quote.
 * 
 * Usage:
 *   node check-double-quotes.js <chapter-file>
 */

import fs from 'node:fs';

const STARTS_WITH_CLOSE = /^[」"'』】)]+/;
const ENDS_WITH_CLOSE = /[」"'』】)]$/;

function checkDoubleQuotes(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const issues = [];
  
  for (const block of data.content) {
    const sentences = block.sentences;
    for (let i = 1; i < sentences.length; i++) {
      const curr = sentences[i];
      const prev = sentences[i - 1];
      
      const currStartMatch = curr.zh.match(STARTS_WITH_CLOSE);
      const prevEndsWithQuote = ENDS_WITH_CLOSE.test(prev.zh);
      
      if (currStartMatch && prevEndsWithQuote) {
        issues.push({
          prevId: prev.id,
          prevEnd: prev.zh.slice(-30),
          currId: curr.id,
          currStart: curr.zh.slice(0, 40),
          leadingQuote: currStartMatch[0]
        });
      }
    }
  }
  
  return issues;
}

function main() {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.log('Usage: node check-double-quotes.js <chapter-file>');
    process.exit(1);
  }
  
  const issues = checkDoubleQuotes(filePath);
  
  if (issues.length === 0) {
    console.log('✅ No potential double quotes found!');
  } else {
    console.log(`Found ${issues.length} potential double quote issue(s):\n`);
    for (const issue of issues) {
      console.log(`${issue.prevId} ends with quote, ${issue.currId} starts with "${issue.leadingQuote}":`);
      console.log(`  prev: ...${issue.prevEnd}`);
      console.log(`  curr: ${issue.currStart}...`);
      console.log();
    }
  }
}

main();