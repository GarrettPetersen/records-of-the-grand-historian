#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , basePath, patchPath] = process.argv;
if (!basePath || !patchPath) {
  console.error('Usage: node scripts/apply-translation-patch.mjs <base.json> <patch.json|.mjs>');
  process.exit(1);
}

const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
let patch;

if (patchPath.endsWith('.mjs')) {
  const mod = await import(pathToFileURL(path.resolve(patchPath)).href);
  patch = mod.default;
} else {
  patch = JSON.parse(fs.readFileSync(patchPath, 'utf8'));
}

for (const s of base.sentences) {
  const p = patch[s.id];
  if (p) {
    if (typeof p.literal === 'string') s.literal = p.literal;
    if (typeof p.idiomatic === 'string') s.idiomatic = p.idiomatic;
  }
}

fs.writeFileSync(basePath, JSON.stringify(base, null, 2));
