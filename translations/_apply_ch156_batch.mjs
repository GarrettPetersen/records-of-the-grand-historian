#!/usr/bin/env node
/** Apply translations/_ch156_bN.mjs to current_translation_zizhitongjian.json by sentence index. */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const batchNum = Number(process.argv[2]);
if (!batchNum || batchNum < 1) {
  console.error('Usage: node translations/_apply_ch156_batch.mjs <batchNumber>=1..5');
  process.exit(1);
}

const transPath = path.resolve('translations/current_translation_zizhitongjian.json');
const batchPath = path.resolve(`translations/_ch156_b${batchNum}.mjs`);
const exportName = `batch${batchNum}`;

const mod = await import(pathToFileURL(batchPath).href);
const batch = mod[exportName];
if (!Array.isArray(batch)) {
  console.error(`Missing export ${exportName} in ${batchPath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(transPath, 'utf8'));
if (batch.length !== data.sentences.length) {
  console.error(
    `Batch length ${batch.length} does not match current_translation (${data.sentences.length} sentences)`
  );
  process.exit(1);
}

for (let i = 0; i < batch.length; i++) {
  data.sentences[i].literal = batch[i].literal;
  data.sentences[i].idiomatic = batch[i].idiomatic;
}

fs.writeFileSync(transPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Applied batch ${batchNum}: ${batch.length} sentences to ${transPath}`);
