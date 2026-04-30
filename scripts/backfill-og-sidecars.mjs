#!/usr/bin/env node
/**
 * Write `*.png.sha256` next to existing OG PNGs from current sources (no Satori/Resvg).
 * Use once after switching to hash-based incremental skips, or when sidecars were lost.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  OG_LAYOUT_VERSION,
  fingerprintBook,
  fingerprintChapter,
  fingerprintSite,
  ogSidecarPath,
} from './og-fingerprint.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function writeSidecar(pngPath, hex) {
  fs.writeFileSync(ogSidecarPath(pngPath), `${hex}\n`, 'utf8');
}

let n = 0;
const sitePng = path.join(root, 'public', 'og', 'site.png');
if (fs.existsSync(sitePng)) {
  writeSidecar(sitePng, fingerprintSite(OG_LAYOUT_VERSION));
  n += 1;
  console.log('  site.png');
}

const manifestPath = path.join(root, 'data', 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('backfill-og-sidecars: missing data/manifest.json');
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const books = manifest.books || {};

for (const bookId of Object.keys(books)) {
  const b = books[bookId];
  const bookPng = path.join(root, 'public', 'og', 'books', `${bookId}.png`);
  if (fs.existsSync(bookPng)) {
    writeSidecar(bookPng, fingerprintBook(OG_LAYOUT_VERSION, b));
    n += 1;
  }
  for (const ch of b.chapters || []) {
    const chNum = String(ch.chapter).padStart(3, '0');
    const jsonPath = path.join(root, 'data', bookId, `${chNum}.json`);
    if (!fs.existsSync(jsonPath)) continue;
    const chPng = path.join(root, 'public', 'og', 'chapters', bookId, `${chNum}.png`);
    if (!fs.existsSync(chPng)) continue;
    writeSidecar(chPng, fingerprintChapter(OG_LAYOUT_VERSION, fs.readFileSync(jsonPath)));
    n += 1;
  }
}

console.log(`backfill-og-sidecars: wrote ${n} sidecar(s) (OG_LAYOUT_VERSION=${OG_LAYOUT_VERSION})`);
