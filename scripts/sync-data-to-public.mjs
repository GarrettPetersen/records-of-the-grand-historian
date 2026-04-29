#!/usr/bin/env node
/**
 * Copy chapter JSON from data/<book>/ into public/data/<book>/ (plus glossary).
 * Used by Cloudflare Pages build (npm run build) instead of GNU make sync.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dataDir = path.join(root, 'data');
const publicData = path.join(root, 'public', 'data');

fs.mkdirSync(publicData, { recursive: true });

let books = 0;
for (const ent of fs.readdirSync(dataDir, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  const name = ent.name;
  if (name === 'public') continue;

  const srcBook = path.join(dataDir, name);
  const files = fs.readdirSync(srcBook);
  if (!files.some((f) => f.endsWith('.json'))) continue;

  const destBook = path.join(publicData, name);
  fs.mkdirSync(destBook, { recursive: true });
  for (const f of files) {
    if (!f.endsWith('.json')) continue;
    fs.copyFileSync(path.join(srcBook, f), path.join(destBook, f));
  }
  books += 1;
  console.log(`sync-data-to-public: ${name} (${files.filter((f) => f.endsWith('.json')).length} JSON files)`);
}

const glossary = path.join(dataDir, 'glossary.json');
if (fs.existsSync(glossary)) {
  fs.copyFileSync(glossary, path.join(publicData, 'glossary.json'));
  console.log('sync-data-to-public: glossary.json');
}

console.log(`sync-data-to-public: done (${books} books)`);
