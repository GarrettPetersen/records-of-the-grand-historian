#!/usr/bin/env node
/**
 * Renders multiple Satori SVGs to PNG in one Node process (fewer spawns than
 * one og-resvg-worker.mjs per image). If Resvg panics, the whole batch dies —
 * keep batches modest (see OG_RESVG_BATCH in generate-og-images.js).
 *
 * Usage: node scripts/og-resvg-batch.mjs <manifest.json>
 *
 * manifest: { width, fontFamily, fontFilePath, jobs: [{ svgPath, pngPath }] }
 */
import fs from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const manifestPath = process.argv[2];
if (!manifestPath) {
  console.error('usage: node scripts/og-resvg-batch.mjs <manifest.json>');
  process.exit(2);
}

const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const { width, fontFamily, fontFilePath, jobs } = m;
if (!width || !fontFamily || !fontFilePath || !Array.isArray(jobs)) {
  console.error('invalid manifest: need width, fontFamily, fontFilePath, jobs[]');
  process.exit(2);
}

for (const job of jobs) {
  const svg = fs.readFileSync(job.svgPath, 'utf8');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    background: 'white',
    font: {
      loadSystemFonts: false,
      defaultFontFamily: fontFamily,
      fontFiles: [fontFilePath],
    },
  });
  const png = resvg.render().asPng();
  fs.writeFileSync(job.pngPath, png);
}
