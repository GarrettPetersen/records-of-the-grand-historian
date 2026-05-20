#!/usr/bin/env node
/**
 * Scan chapter JSON for sentences that contain only punctuation, symbols, or whitespace.
 * These should not exist in scraped chapter data.
 *
 * Usage:
 *   node scripts/scan-punctuation-only-sentences.mjs
 *   node scripts/scan-punctuation-only-sentences.mjs data/mingshi
 *   node scripts/scan-punctuation-only-sentences.mjs data/mingshi/304.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { isPunctuationOnlySentence } from '../sentence-utils.mjs';

function* walkRows(data) {
  if (!data?.content) return;
  for (const block of data.content) {
    if (block.type === 'paragraph' || block.type === 'table_header') {
      for (const sentence of block.sentences || []) {
        const zh = sentence.zh || sentence.content || '';
        if (isPunctuationOnlySentence(zh)) {
          yield { id: sentence.id, zh, blockType: block.type };
        }
      }
    } else if (block.type === 'table_row') {
      for (const cell of block.cells || []) {
        const zh = cell.content || '';
        if (isPunctuationOnlySentence(zh)) {
          yield { id: cell.id, zh, blockType: block.type };
        }
      }
    }
  }
}

function scanFile(filePath) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
  if (!data?.meta?.book) return null;

  const hits = [...walkRows(data)];
  if (hits.length === 0) return null;

  return {
    book: data.meta.book,
    chapter: data.meta.chapter,
    rel: path.relative(process.cwd(), filePath),
    hits,
  };
}

function expandInputs(inputs) {
  const files = [];
  for (const arg of inputs) {
    if (!fs.existsSync(arg)) continue;
    const st = fs.statSync(arg);
    if (st.isDirectory()) {
      for (const name of fs.readdirSync(arg)) {
        if (name.endsWith('.json')) files.push(path.join(arg, name));
      }
    } else if (arg.endsWith('.json')) {
      files.push(arg);
    }
  }
  return [...new Set(files)].sort();
}

const args = process.argv.slice(2);
const inputs = args.length ? args : [path.join(process.cwd(), 'data')];
const rows = [];

for (const fp of expandInputs(inputs)) {
  const r = scanFile(fp);
  if (r) rows.push(r);
}

rows.sort((a, b) => a.book.localeCompare(b.book) || String(a.chapter).localeCompare(String(b.chapter), undefined, { numeric: true }));

console.log(`Chapters with punctuation-only sentences: ${rows.length}`);
console.log('');
console.log('book\tchapter\tcount\tfile');
for (const row of rows) {
  console.log(`${row.book}\t${row.chapter}\t${row.hits.length}\t${row.rel}`);
  for (const hit of row.hits) {
    console.log(`  ${hit.id}\t${JSON.stringify(hit.zh)}\t${hit.blockType}`);
  }
}
