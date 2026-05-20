#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const batchNum = process.argv[2];
const modPath = process.argv[3];
if (!batchNum || !modPath) {
  console.error('Usage: node run-suishu027-batch.mjs <batchNum> <translations.mjs>');
  process.exit(1);
}

const start = spawnSync('make', ['start-translation', 'BOOK=suishu', 'CHAPTER=027'], {
  cwd: process.cwd(),
  encoding: 'utf8',
});
if (start.status !== 0) {
  console.error(start.stdout + start.stderr);
  process.exit(1);
}

const target = 'translations/current_translation_suishu.json';
const data = JSON.parse(readFileSync(target, 'utf8'));
const resolved = path.isAbsolute(modPath)
  ? modPath
  : path.join(path.dirname(new URL(import.meta.url).pathname), modPath);
const mod = await import(pathToFileURL(resolved).href);
const t = mod.default;

const pairs = data.sentences.map((s) => {
  const entry = t[s.id];
  if (!entry) throw new Error(`Missing translation for ${s.id}`);
  const [literal, idiomatic] = entry;
  return { id: s.id, literal, idiomatic };
});

for (const s of data.sentences) {
  const p = pairs.find((x) => x.id === s.id);
  s.literal = p.literal;
  s.idiomatic = p.idiomatic;
}

writeFileSync(target, JSON.stringify(data, null, 2) + '\n');
console.log(`Batch ${batchNum}: filled ${pairs.length} sentences`);

const submit = spawnSync(
  'make',
  [
    'submit-translations',
    'TRANSLATOR=Garrett M. Petersen (2026)',
    'MODEL=Composer 2.5',
    'FILE=translations/current_translation_suishu.json',
  ],
  { cwd: process.cwd(), encoding: 'utf8', stdio: 'inherit' }
);
process.exit(submit.status ?? 1);
