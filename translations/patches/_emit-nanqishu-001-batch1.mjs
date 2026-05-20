#!/usr/bin/env node
/** One-shot emitter for nanqishu-001-batch1.mjs */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(
  fs.readFileSync(path.join(dir, '_nanqishu-001-batch1-data.json'), 'utf8'),
);

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function emitEntry(id, { literal, idiomatic }) {
  const lines = [`  ${id}: {`];
  const addField = (name, val) => {
    if (val.length <= 72 && !val.includes('\n')) {
      lines.push(`    ${name}: '${esc(val)}',`);
    } else {
      lines.push(`    ${name}:`);
      lines.push(`      '${esc(val)}',`);
    }
  };
  addField('literal', literal);
  addField('idiomatic', idiomatic);
  lines.push('  },');
  return lines.join('\n');
}

const ids = Object.keys(data).sort(
  (a, b) => Number(a.slice(1)) - Number(b.slice(1)),
);
const body = ids.map((id) => emitEntry(id, data[id])).join('\n');
const out = `/** Batch 1: s0001–s0100 (Nan Qi Shu ch.001, Emperor Gao / Xiao Daocheng) */\nexport default {\n${body}\n};\n`;
fs.writeFileSync(path.join(dir, 'nanqishu-001-batch1.mjs'), out);
console.log(`Wrote ${ids.length} entries to nanqishu-001-batch1.mjs`);
