#!/usr/bin/env node
/**
 * Run punctuationAlignmentNotes (terminal + fullwidth + delimiters) on every
 * translated sentence under data/{book}/{chapter}.json.
 *
 * Usage:
 *   node scripts/scan-punctuation-all-chapters.mjs
 *   node scripts/scan-punctuation-all-chapters.mjs --min-notes 5
 */

import fs from 'node:fs';
import path from 'node:path';
import { punctuationAlignmentNotes } from '../translation-guards.mjs';

function* iterSentences(data) {
  if (!data?.content) return;
  for (const block of data.content) {
    if (block.type === 'paragraph' || block.type === 'table_header') {
      for (const sentence of block.sentences || []) {
        const translator = sentence.translations?.[0]?.translator;
        if (translator === 'Herbert J. Allen (1894)') continue;
        const zh = sentence.zh || sentence.content;
        const tr = sentence.translations?.[0];
        const lit = tr?.literal || sentence.literal;
        const idm = tr?.idiomatic || sentence.idiomatic;
        if (!String(lit || '').trim() || !String(idm || '').trim()) continue;
        yield { id: sentence.id, zh, lit, idm };
      }
    } else if (block.type === 'table_row') {
      for (const cell of block.cells || []) {
        if (cell.translator === 'Herbert J. Allen (1894)') continue;
        const zh = cell.content;
        const lit = cell.literal;
        const idm = cell.idiomatic;
        if (!String(lit || '').trim() || !String(idm || '').trim()) continue;
        yield { id: cell.id, zh, lit, idm };
      }
    }
  }
}

function scanChapter(filePath) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
  if (!data.meta?.book) return null;

  let sentencesWithNote = 0;
  let totalNotes = 0;
  for (const row of iterSentences(data)) {
    const litNotes = punctuationAlignmentNotes(row.zh, row.lit, 'Literal');
    const idmNotes = punctuationAlignmentNotes(row.zh, row.idm, 'Idiomatic');
    const n = litNotes.length + idmNotes.length;
    if (n > 0) {
      sentencesWithNote++;
      totalNotes += n;
    }
  }

  return {
    book: data.meta.book,
    chapter: data.meta.chapter,
    rel: path.relative(process.cwd(), filePath),
    sentencesWithNote,
    totalNotes,
  };
}

const minNotes = (() => {
  const i = process.argv.indexOf('--min-notes');
  if (i === -1 || !process.argv[i + 1]) return 1;
  return Math.max(1, parseInt(process.argv[i + 1], 10) || 1);
})();

const dataRoot = path.resolve(import.meta.dirname, '..', 'data');
const books = fs.readdirSync(dataRoot, { withFileTypes: true }).filter((d) => d.isDirectory());

const rows = [];
for (const ent of books) {
  const bookDir = path.join(dataRoot, ent.name);
  for (const name of fs.readdirSync(bookDir)) {
    if (!name.endsWith('.json')) continue;
    const fp = path.join(bookDir, name);
    const r = scanChapter(fp);
    if (r && r.totalNotes >= minNotes) rows.push(r);
  }
}

rows.sort((a, b) => b.totalNotes - a.totalNotes || a.book.localeCompare(b.book) || String(a.chapter).localeCompare(String(b.chapter), undefined, { numeric: true }));

console.log(`Chapters with at least ${minNotes} punctuation/delimiter note(s): ${rows.length}`);
console.log('');
console.log('book\tchapter\tnotes\tsentences\tfile');
for (const r of rows) {
  console.log(`${r.book}\t${r.chapter}\t${r.totalNotes}\t${r.sentencesWithNote}\t${r.rel}`);
}
