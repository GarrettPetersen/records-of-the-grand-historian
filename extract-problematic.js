#!/usr/bin/env node

import fs from 'node:fs';

const chapter = JSON.parse(fs.readFileSync('data/shiji/015.json', 'utf8'));
const problematicIds = fs.readFileSync('problematic_ids.txt', 'utf8').trim().split('\n').map(line => {
  const match = line.match(/^\d+\.\s*(s\d+)$/);
  return match ? match[1] : null;
}).filter(id => id);

console.log('Problematic entries that need translation:\n');

for (const idLine of problematicIds.slice(60, 100)) { // Next 40
  const id = idLine.trim();
  if (!id || id.startsWith('#')) continue;

  // Find the entry
  let found = false;

  // Check paragraphs
  for (const block of chapter.content) {
    if (block.type === 'paragraph') {
      for (const sentence of block.sentences) {
        if (sentence.id === id) {
          console.log(`${id}: ${sentence.zh}`);
          console.log(`  Current: "${sentence.translations[0].text}"`);
          console.log();
          found = true;
          break;
        }
      }
    }
    if (found) break;
  }

  if (!found) {
    // Check table headers
    for (const block of chapter.content) {
      if (block.type === 'table_header') {
        for (const sentence of block.sentences) {
          if (sentence.id === id) {
            console.log(`${id}: ${sentence.zh}`);
            console.log(`  Current: "${sentence.translations[0].text}"`);
            console.log();
            found = true;
            break;
          }
        }
      }
      if (found) break;
    }
  }

  if (!found) {
    // Check table rows
    for (const block of chapter.content) {
      if (block.type === 'table_row') {
        for (const cell of block.cells) {
          if (cell.id === id) {
            console.log(`${id}: ${cell.content}`);
            console.log(`  Current: "${cell.translation}"`);
            console.log();
            found = true;
            break;
          }
        }
      }
      if (found) break;
    }
  }
}
