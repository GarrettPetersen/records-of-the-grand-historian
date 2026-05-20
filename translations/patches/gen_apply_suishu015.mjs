#!/usr/bin/env node
/**
 * Generate and apply suishu 015 translations batches 04-10.
 * Run: node gen_apply_suishu015.mjs <startBatch> <endBatch>
 */
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const ALL = JSON.parse(fs.readFileSync('/tmp/suishu015_all.txt', 'utf8').trim().split('\n').reduce((a,l)=>{
  const [id,...rest]=l.split('\t'); a[id]=rest.join('\t'); return a;
}, {}));

// Load hand-crafted translations from companion modules
const batches = {};
for (let b = 4; b <= 10; b++) {
  const p = `./translations/patches/suishu015_translations_b${String(b).padStart(2,'0')}.mjs`;
  if (fs.existsSync(p)) {
    batches[b] = (await import(p)).default;
  }
}

const startBatch = parseInt(process.argv[2] || '4', 10);
const endBatch = parseInt(process.argv[3] || '10', 10);

for (let b = startBatch; b <= endBatch; b++) {
  const T = batches[b];
  if (!T) { console.error(`Missing batch ${b}`); process.exit(1); }
  console.log(`\n=== Batch ${b} ===`);
  execSync('make start-translation BOOK=suishu CHAPTER=015', { stdio: 'inherit' });
  const data = JSON.parse(fs.readFileSync('translations/current_translation_suishu.json', 'utf8'));
  for (const s of data.sentences) {
    const pair = T[s.id];
    if (!pair) throw new Error(`Missing ${s.id} in batch ${b}`);
    s.literal = pair[0];
    s.idiomatic = pair[1];
  }
  fs.writeFileSync('translations/current_translation_suishu.json', JSON.stringify(data, null, 2) + '\n');
  execSync('make submit-translations TRANSLATOR="Garrett M. Petersen (2026)" MODEL="Composer 2.5" FILE=translations/current_translation_suishu.json', { stdio: 'inherit' });
}

console.log('\nDone. Count:', JSON.parse(fs.readFileSync('data/suishu/015.json')).meta.translatedCount);
