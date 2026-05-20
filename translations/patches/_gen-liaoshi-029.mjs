#!/usr/bin/env node
/**
 * Generate liaoshi ch.029 translation patch batches (s0001–s0235).
 * Run: node translations/patches/_gen-liaoshi-029.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

import { part1 } from './_gen-liaoshi-029-part1.mjs';
import { part2 } from './_gen-liaoshi-029-part2.mjs';
import { part3 } from './_gen-liaoshi-029-part3.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const chapterPath = path.resolve(dir, '../../data/liaoshi/029.json');

function rowsToJson(rows) {
  return rows.map(([id, literal, idiomatic]) => ({ id, literal, idiomatic }));
}

function writeBatch(name, rows, startId, endId) {
  const out = rowsToJson(rows);
  const outPath = path.join(dir, `liaoshi-029-${name}.json`);
  fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`${name}: ${out.length} entries (${startId}–${endId}) → ${outPath}`);
  return out;
}

const b1 = writeBatch('batch1', part1, 's0001', 's0100');
const b2 = writeBatch('batch2', part2, 's0101', 's0200');
const b3 = writeBatch('batch3', part3, 's0201', 's0235');

const all = [...part1, ...part2, ...part3];
if (all.length !== 235) {
  throw new Error(`Expected 235 entries, got ${all.length}`);
}

const ids = new Set(all.map((r) => r[0]));
if (ids.size !== 235) {
  throw new Error('Duplicate sentence ids in patch data');
}

for (let i = 1; i <= 235; i++) {
  const want = `s${String(i).padStart(4, '0')}`;
  if (!ids.has(want)) throw new Error(`Missing ${want}`);
}

const zhLines = execSync(
  `jq -r '.content[] | .sentences[]? | "\\(.id)\\t\\(.zh)"' "${chapterPath}"`,
  { encoding: 'utf8' },
)
  .trim()
  .split('\n')
  .filter(Boolean);

if (zhLines.length !== 235) {
  throw new Error(`Source chapter has ${zhLines.length} sentences, expected 235`);
}

const zhById = Object.fromEntries(
  zhLines.map((line) => {
    const tab = line.indexOf('\t');
    return [line.slice(0, tab), line.slice(tab + 1)];
  }),
);

for (const [id, literal, idiomatic] of all) {
  if (!literal?.trim() || !idiomatic?.trim()) {
    throw new Error(`${id}: empty literal or idiomatic`);
  }
  if (!zhById[id]) throw new Error(`${id}: not in source chapter`);
}

console.log('Validated 235 entries against data/liaoshi/029.json');
console.log('Total: 235 sentences s0001–s0235');
