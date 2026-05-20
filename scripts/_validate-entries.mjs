#!/usr/bin/env node
/**
 * Validate translation patch entries JSON.
 * Usage: node scripts/_validate-entries.mjs <entries.json> [expectedCount]
 */
import fs from 'fs';

const path = process.argv[2];
const expected = Number(process.argv[3] || 0);
const entries = JSON.parse(fs.readFileSync(path, 'utf8'));
const hanziRe = /[\u4e00-\u9fff]/;

const problems = [];
if (!Array.isArray(entries)) {
  console.error('Not an array');
  process.exit(1);
}

if (expected && entries.length !== expected) {
  problems.push({ type: 'count', message: `count ${entries.length} !== ${expected}` });
}

for (let i = 0; i < entries.length; i++) {
  const e = entries[i];
  const wantId = `s${String(i + 1).padStart(4, '0')}`;
  if (e.id !== wantId) {
    problems.push({ id: e.id, type: 'id_gap', message: `index ${i}: expected ${wantId}, got ${e.id}` });
  }
  if (!e.literal?.trim() || !e.idiomatic?.trim()) {
    problems.push({ id: e.id, type: 'empty', message: 'missing literal or idiomatic' });
  }
  if (hanziRe.test(e.literal || '') || hanziRe.test(e.idiomatic || '')) {
    problems.push({ id: e.id, type: 'hanzi', message: 'Chinese characters in EN fields' });
  }
  const zhLen = (entries._zh?.[e.id] || '').length; // optional
}

// Load source zh if sibling data file passed via env
const srcPath = process.env.SRC;
let zhById = entries._zh || {};
if (srcPath && fs.existsSync(srcPath)) {
  const d = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  zhById = {};
  for (const p of d.content) {
    for (const s of p.sentences) zhById[s.id] = s.zh;
  }
}

for (const e of entries) {
  const zh = zhById[e.id];
  if (!zh) continue;
  const hanCount = (zh.match(/[\u4e00-\u9fff]/g) || []).length;
  if (hanCount > 3 && e.literal === e.idiomatic) {
    problems.push({ id: e.id, type: 'identical', message: `literal===idiomatic (${hanCount} hanzi)` });
  }
}

console.log(JSON.stringify({
  file: path,
  count: entries.length,
  expected: expected || null,
  ok: problems.length === 0,
  problems: problems.slice(0, 50),
  problemCount: problems.length,
}, null, 2));

process.exit(problems.length ? 1 : 0);
