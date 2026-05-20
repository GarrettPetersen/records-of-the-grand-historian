#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const batch = process.argv[2];
if (!batch) {
  console.error('Usage: node apply-zhoushu-038-batch.mjs <1-4>');
  process.exit(1);
}

const root = path.resolve(import.meta.dirname, '..');
const basePath = path.join(root, 'current_translation_zhoushu.json');
const patchPath = path.join(import.meta.dirname, `zhoushu-038-batch${batch}.mjs`);

const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
const { default: patch } = await import(pathToFileURL(patchPath).href);

let applied = 0;
for (const s of base.sentences) {
  const p = patch[s.id];
  if (p) {
    if (typeof p.literal === 'string') s.literal = p.literal;
    if (typeof p.idiomatic === 'string') s.idiomatic = p.idiomatic;
    applied++;
  }
}

fs.writeFileSync(basePath, JSON.stringify(base, null, 2) + '\n');
console.log(`Applied ${applied} patches from batch${batch}`);
