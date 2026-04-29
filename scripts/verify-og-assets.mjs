#!/usr/bin/env node
/**
 * Fail CI/Pages builds if OG raster cards were not produced (avoids deploying
 * HTML that references /og/*.png while Cloudflare serves index.html for those URLs).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const sitePng = path.join(root, 'public', 'og', 'site.png');

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

if (!isPng(sitePng)) {
  console.error(
    'verify-og-assets: expected a valid PNG at public/og/site.png (run generate-og-images.js / full npm run build).',
  );
  process.exit(1);
}

console.log('verify-og-assets: ok', path.relative(root, sitePng));
