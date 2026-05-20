#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const startBatch = parseInt(process.argv[2] || '4', 10);
const endBatch = parseInt(process.argv[3] || '10', 10);

for (let b = startBatch; b <= endBatch; b++) {
  const mod = await import(`./suishu015_translations_b${String(b).padStart(2, '0')}.mjs`);
  const T = mod.default;
  console.log(`\n=== Batch ${b} ===`);
  execSync('make start-translation BOOK=suishu CHAPTER=015', { stdio: 'inherit', cwd: '/workspace' });
  const path = '/workspace/translations/current_translation_suishu.json';
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  for (const s of data.sentences) {
    const pair = T[s.id];
    if (!pair) throw new Error(`Missing ${s.id} in batch ${b}`);
    s.literal = pair[0];
    s.idiomatic = pair[1];
  }
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
  execSync(
    'make submit-translations TRANSLATOR="Garrett M. Petersen (2026)" MODEL="Composer 2.5" FILE=translations/current_translation_suishu.json',
    { stdio: 'inherit', cwd: '/workspace' }
  );
}

const meta = JSON.parse(fs.readFileSync('/workspace/data/suishu/015.json', 'utf8')).meta;
console.log(`\nFinal: ${meta.translatedCount}/${meta.sentenceCount}`);
