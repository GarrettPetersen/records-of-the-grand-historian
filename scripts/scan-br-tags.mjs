#!/usr/bin/env node
/**
 * Scan chapter JSON for literal <BR> tags in stored text.
 *
 * Usage:
 *   node scripts/scan-br-tags.mjs
 *   node scripts/scan-br-tags.mjs data/zizhitongjian
 *   node scripts/scan-br-tags.mjs data/zizhitongjian/090.json
 */

import fs from 'node:fs';
import path from 'node:path';

const BR_RE = /<br\s*\/?>/i;

function* walkStrings(value, trail = []) {
  if (typeof value === 'string') {
    if (BR_RE.test(value)) yield { path: trail.join('.'), value };
    return;
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      yield* walkStrings(value[i], trail.concat(String(i)));
    }
    return;
  }

  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    yield* walkStrings(child, trail.concat(key));
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

  const hits = [...walkStrings(data)];
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
  const enqueue = (entry) => {
    if (!fs.existsSync(entry)) return;
    const st = fs.statSync(entry);
    if (st.isDirectory()) {
      for (const child of fs.readdirSync(entry)) {
        enqueue(path.join(entry, child));
      }
    } else if (entry.endsWith('.json')) {
      files.push(entry);
    }
  };
  for (const arg of inputs) {
    enqueue(arg);
  }
  return [...new Set(files)].sort();
}

const args = process.argv.slice(2);
const inputs = args.length ? args : [path.join(process.cwd(), 'data')];
const rows = [];

for (const fp of expandInputs(inputs)) {
  const row = scanFile(fp);
  if (row) rows.push(row);
}

rows.sort((a, b) => a.book.localeCompare(b.book) || String(a.chapter).localeCompare(String(b.chapter), undefined, { numeric: true }));

console.log(`Chapters with literal <BR> tags: ${rows.length}`);
console.log('');
console.log('book\tchapter\tcount\tfile');
for (const row of rows) {
  console.log(`${row.book}\t${row.chapter}\t${row.hits.length}\t${row.rel}`);
  for (const hit of row.hits) {
    console.log(`  ${hit.path}\t${JSON.stringify(hit.value)}`);
  }
}
