#!/usr/bin/env node
import fs from 'node:fs';

const [, , path, patchPath] = process.argv;
if (!path || !patchPath) {
  console.error('Usage: node scripts/merge-translation-batch.mjs <translation.json> <patch.json>');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const patch = JSON.parse(fs.readFileSync(patchPath, 'utf8'));
const byId = new Map(patch.map((p) => [p.id, p]));

for (const s of data.sentences) {
  const p = byId.get(s.id);
  if (!p) continue;
  s.literal = p.literal;
  s.idiomatic = p.idiomatic;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
