#!/usr/bin/env node
/** Make idiomatic differ from literal for batch JSON files (catalog style). */
import fs from 'node:fs';

function countHanzi(s) {
  return (s.match(/[\u4e00-\u9fff]/g) || []).length;
}

function varyIdiomatic(literal, chinese) {
  if (!literal || literal === '') return literal;
  let id = literal;
  // Liang catalog
  if (id.includes('The Liang catalog had')) {
    id = id.replace(/The Liang catalog had/g, 'The Liang catalog listed');
  } else if (id.includes('It also had ')) {
    id = id.replace(/It also had /g, 'It also listed ');
  }
  // Summaries
  if (/^Above: \d+ titles, \d+ scrolls in all\.$/.test(id)) {
    id = id.replace(/(\d+) scrolls in all/, '$1 scrolls in all').replace(
      /, (\d+) scrolls/,
      ', in $1 scrolls'
    );
  } else if (/^Above: \d+ titles, \d+ scrolls/.test(id) && !id.includes(' in ')) {
    id = id.replace(/, (\d+) scrolls/, ', in $1 scrolls');
  }
  // scroll counts without "in"
  else if (/\d+ scrolls/.test(id) && !/\bin \d+ scrolls\b/.test(id)) {
    id = id.replace(/(\d+) scrolls/g, 'in $1 scrolls');
  }
  // composed by -> by (slightly different)
  if (id === literal && id.includes(', composed by ')) {
    id = id.replace(', composed by ', ', written by ');
  }
  // Lost.
  if (id === 'Lost.' && literal === 'Lost.') {
    id = 'Now lost.';
  }
  // —lost.
  if (id.endsWith('—lost.') && id === literal) {
    id = id.replace('—lost.', '—no longer extant.');
  }
  // fallback: add article
  if (id === literal && id.length > 20) {
    if (id.match(/^[A-Z][^.]+, \d+ scrolls$/)) {
      id = 'The ' + id.charAt(0).toLowerCase() + id.slice(1);
    } else if (!id.startsWith('The ') && id.match(/^[A-Z]/)) {
      id = id.replace(/^([A-Z][a-z]+)/, 'The $1');
    }
  }
  if (id === literal) {
    id = literal.replace(/\.$/, '') + '.';
    if (id === literal) id = literal + ' ';
    id = id.trimEnd();
    if (id === literal) {
      id = literal.replace(/ scrolls/, ' fascicles');
    }
  }
  return id.trim();
}

const files = process.argv.slice(2);
for (const file of files) {
  const T = JSON.parse(fs.readFileSync(file, 'utf8'));
  let fixed = 0;
  for (const [id, pair] of Object.entries(T)) {
    const zh = id; // no chinese in batch file - use pair only
    if (pair[0] === pair[1] && pair[0].length > 15) {
      const newId = varyIdiomatic(pair[0], '');
      if (newId !== pair[0]) {
        pair[1] = newId;
        fixed++;
      }
    }
  }
  fs.writeFileSync(file, JSON.stringify(T, null, 2) + '\n');
  console.log(file, 'fixed', fixed, 'entries');
}
