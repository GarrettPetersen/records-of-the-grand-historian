#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const file = process.argv[2] || 'translations/current_translation_houhanshu.json';
if (!fs.existsSync(file)) {
  console.error('No file:', file);
  process.exit(0);
}

spawnSync(process.execPath, ['scripts/fill-collation-notes.mjs', file], { stdio: 'inherit' });
spawnSync(process.execPath, ['scripts/fill-commentary-bulk.mjs', file], { stdio: 'inherit' });
