#!/usr/bin/env node

/**
 * fix-closing-parentheses.js - Fix English translations that start with closing parentheses )
 *
 * Moves closing parentheses to the end of the previous sentence's English translation.
 */

import fs from 'node:fs';
import path from 'node:path';

function fixClosingParentheses(data) {
  const content = data.content || [data]; // Handle both full data and paragraph arrays

  for (const paragraph of content) {
    if (!paragraph.sentences) continue;

    // Process translations within sentences
    for (let i = 0; i < paragraph.sentences.length; i++) {
      const sentence = paragraph.sentences[i];
      const translations = sentence.translations || [];

      for (const trans of translations) {
        // Fix literal translations starting with )
        if (trans.literal && trans.literal.startsWith(')')) {
          if (i > 0) {
            // Find the previous sentence with translations
            for (let j = i - 1; j >= 0; j--) {
              const prevSentence = paragraph.sentences[j];
              const prevTranslations = prevSentence.translations || [];

              for (const prevTrans of prevTranslations) {
                if (prevTrans.literal && prevTrans.literal.trim()) {
                  // Move ) to end of previous literal
                  prevTrans.literal = prevTrans.literal.trim() + ')';
                  trans.literal = trans.literal.substring(1).trim();
                  break;
                }
              }
              if (prevTranslations.some(t => t.literal && t.literal.trim())) break;
            }
          } else {
            // No previous sentence, just remove the )
            trans.literal = trans.literal.substring(1).trim();
          }
        }

        // Fix idiomatic translations starting with )
        if (trans.idiomatic && trans.idiomatic.startsWith(')')) {
          if (i > 0) {
            // Find the previous sentence with translations
            for (let j = i - 1; j >= 0; j--) {
              const prevSentence = paragraph.sentences[j];
              const prevTranslations = prevSentence.translations || [];

              for (const prevTrans of prevTranslations) {
                if (prevTrans.idiomatic && prevTrans.idiomatic.trim()) {
                  // Move ) to end of previous idiomatic
                  prevTrans.idiomatic = prevTrans.idiomatic.trim() + ')';
                  trans.idiomatic = trans.idiomatic.substring(1).trim();
                  break;
                }
              }
              if (prevTranslations.some(t => t.idiomatic && t.idiomatic.trim())) break;
            }
          } else {
            // No previous sentence, just remove the )
            trans.idiomatic = trans.idiomatic.substring(1).trim();
          }
        }
      }
    }
  }

  return data;
}

function processFile(filePath) {
  console.log(`Processing ${filePath}...`);

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const fixed = fixClosingParentheses(data);

  fs.writeFileSync(filePath, JSON.stringify(fixed, null, 2));
  console.log(`  Fixed ${filePath}`);
}

function countIssues(data) {
  let literalCount = 0;
  let idiomaticCount = 0;

  const content = data.content || [data];

  for (const paragraph of content) {
    if (!paragraph.sentences) continue;

    for (const sentence of paragraph.sentences) {
      const translations = sentence.translations || [];

      for (const trans of translations) {
        if (trans.literal && trans.literal.startsWith(')')) {
          literalCount++;
        }
        if (trans.idiomatic && trans.idiomatic.startsWith(')')) {
          idiomaticCount++;
        }
      }
    }
  }

  return { literalCount, idiomaticCount };
}

// Main execution
const [,, book, chapter] = process.argv;

if (!book) {
  console.log('Usage: node fix-closing-parentheses.js <book> [chapter]');
  console.log('Examples:');
  console.log('  node fix-closing-parentheses.js houhanshu 003');
  console.log('  node fix-closing-parentheses.js houhanshu  # Fix all chapters');
  process.exit(1);
}

const dataDir = 'data';

if (chapter) {
  const filePath = path.join(dataDir, book, `${chapter}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const before = countIssues(data);
    console.log(`Before: ${before.literalCount} literal, ${before.idiomaticCount} idiomatic issues`);

    processFile(filePath);

    const afterData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const after = countIssues(afterData);
    console.log(`After: ${after.literalCount} literal, ${after.idiomaticCount} idiomatic issues`);
  } else {
    console.error(`File not found: ${filePath}`);
  }
} else {
  // Process all chapters of the book
  const bookDir = path.join(dataDir, book);
  if (fs.existsSync(bookDir)) {
    const files = fs.readdirSync(bookDir).filter(f => f.endsWith('.json'));
    let totalLiteral = 0;
    let totalIdiomatic = 0;

    for (const file of files) {
      const filePath = path.join(bookDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const before = countIssues(data);

      if (before.literalCount > 0 || before.idiomaticCount > 0) {
        console.log(`Processing ${file}: ${before.literalCount} literal, ${before.idiomaticCount} idiomatic issues`);
        processFile(filePath);

        const afterData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const after = countIssues(afterData);
        totalLiteral += before.literalCount;
        totalIdiomatic += before.idiomaticCount;
        console.log(`  Fixed: ${before.literalCount - after.literalCount} literal, ${before.idiomaticCount - after.idiomaticCount} idiomatic`);
      }
    }

    console.log(`\nTotal fixed: ${totalLiteral} literal, ${totalIdiomatic} idiomatic translations`);
  } else {
    console.error(`Book directory not found: ${bookDir}`);
  }
}
