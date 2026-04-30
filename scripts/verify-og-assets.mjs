#!/usr/bin/env node
/**
 * Fail CI/Pages builds if OG raster cards were not produced or sidecars are stale
 * (avoids deploying HTML that references /og/*.png while hashes do not match sources).
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

function isPng(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const b = fs.readFileSync(filePath);
  return (
    b.length >= 8 &&
    b[0] === 0x89 &&
    b[1] === 0x50 &&
    b[2] === 0x4e &&
    b[3] === 0x47 &&
    b[4] === 0x0d &&
    b[5] === 0x0a &&
    b[6] === 0x1a &&
    b[7] === 0x0a
  );
}

function readSidecarHex(pngPath) {
  const sidecar = ogSidecarPath(pngPath);
  if (!fs.existsSync(sidecar)) return null;
  try {
    const t = fs.readFileSync(sidecar, 'utf8').trim();
    return /^[0-9a-f]{64}$/.test(t) ? t : null;
  } catch {
    return null;
  }
}

function expectSidecarMatches(pngPath, expectedHex, label) {
  if (!isPng(pngPath)) {
    console.error(`verify-og-assets: expected a valid PNG at ${path.relative(root, pngPath)} (${label}).`);
    process.exit(1);
  }
  const got = readSidecarHex(pngPath);
  if (got !== expectedHex) {
    console.error(
      `verify-og-assets: ${label}: fingerprint mismatch for ${path.relative(root, pngPath)}.\n` +
        `  expected (from sources, OG_LAYOUT_VERSION=${OG_LAYOUT_VERSION}): ${expectedHex}\n` +
        `  recorded in ${path.relative(root, ogSidecarPath(pngPath))}: ${got ?? '(missing or invalid)'}\n` +
        `  Run: node generate-og-images.js (without --incremental for a full rebuild, or fix sidecars).`,
    );
    process.exit(1);
  }
}

const sitePng = path.join(root, 'public', 'og', 'site.png');
expectSidecarMatches(sitePng, fingerprintSite(OG_LAYOUT_VERSION), 'site card');

const manifestPath = path.join(root, 'data', 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('verify-og-assets: missing data/manifest.json');
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const books = manifest.books || {};

for (const bookId of Object.keys(books)) {
  const b = books[bookId];
  const bookPng = path.join(root, 'public', 'og', 'books', `${bookId}.png`);
  expectSidecarMatches(bookPng, fingerprintBook(OG_LAYOUT_VERSION, b), `book hub ${bookId}`);

  for (const ch of b.chapters || []) {
    const chNum = String(ch.chapter).padStart(3, '0');
    const jsonPath = path.join(root, 'data', bookId, `${chNum}.json`);
    if (!fs.existsSync(jsonPath)) continue;
    const chPng = path.join(root, 'public', 'og', 'chapters', bookId, `${chNum}.png`);
    const expected = fingerprintChapter(OG_LAYOUT_VERSION, fs.readFileSync(jsonPath));
    expectSidecarMatches(chPng, expected, `chapter ${bookId}/${chNum}`);
  }
}

console.log('verify-og-assets: ok (site, book hubs, chapter PNGs + .sha256 sidecars)');
