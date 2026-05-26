#!/usr/bin/env node
/** Build weishu116-s0001-0300-pairs.mjs from data/weishu/116.json. */
import fs from 'fs';
import path from 'path';
import { translatePair } from './weishu116-translate-s0001.mjs';
import { S0001_MANUAL } from './weishu116-s0001-manual-overrides.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE = path.join(ROOT, 'data/weishu/116.json');

const data = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
const byId = new Map();
data.content.forEach((block) => {
  for (const s of block.sentences || []) byId.set(s.id, s.zh);
});

const PAIRS = {};
const errors = [];

for (let n = 1; n <= 300; n++) {
  const id = `s${String(n).padStart(4, '0')}`;
  const zh = byId.get(id);
  let pair = S0001_MANUAL[id] || translatePair(zh);
  if (!pair) {
    errors.push({ id, zh });
    continue;
  }
  const stripQuoted = (s) => s.replace(/"[^"]*"/g, '').replace(/'[^']*'/g, '');
  if (/[\u4e00-\u9fff]/.test(stripQuoted(pair[0])) || /[\u4e00-\u9fff]/.test(stripQuoted(pair[1]))) {
    errors.push({ id, zh, note: 'cjk remain', pair });
    continue;
  }
  PAIRS[id] = pair;
}

if (errors.length) {
  fs.writeFileSync('/tmp/weishu-pair-errors.json', JSON.stringify(errors, null, 2));
  console.error(`Errors: ${errors.length} (see /tmp/weishu-pair-errors.json)`);
  console.error(errors.slice(0, 15));
  process.exit(1);
}

const lines = ['/** Translation pairs for weishu 116 s0001–s0300. [literal, idiomatic] */', 'export const PAIRS = {'];
for (const [id, [lit, idm]] of Object.entries(PAIRS)) {
  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  lines.push(`  ${id}: ['${esc(lit)}', '${esc(idm)}'],`);
}
lines.push('};', '');
fs.writeFileSync(path.join(ROOT, 'scripts/weishu116-s0001-0300-pairs.mjs'), lines.join('\n'));
console.log(`Wrote ${Object.keys(PAIRS).length} pairs`);
