#!/usr/bin/env node
/** Apply one suishu-019 batch patch, submit, start next — usage: node run-batch.mjs <batchNum> */
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const batch = process.argv[2];
if (!batch) { console.error('Usage: node run-batch.mjs <N>'); process.exit(1); }

const patch = `translations/patches/suishu-019-batch${batch}.mjs`;
const target = 'translations/current_translation_suishu.json';

if (!fs.existsSync(patch)) { console.error('Missing', patch); process.exit(1); }
if (!fs.existsSync(target)) {
  execSync('make start-translation BOOK=suishu CHAPTER=019', { stdio: 'inherit' });
}

execSync(`node ${patch} ${target}`, { stdio: 'inherit' });
execSync('make submit-translations TRANSLATOR="Garrett M. Petersen (2026)" MODEL="Composer 2.5" FILE=translations/current_translation_suishu.json', { stdio: 'inherit', timeout: 120000 });
const count = JSON.parse(fs.readFileSync('data/suishu/019.json','utf8')).meta.translatedCount;
console.log('Progress:', count);
