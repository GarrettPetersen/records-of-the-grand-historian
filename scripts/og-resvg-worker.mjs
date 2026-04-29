#!/usr/bin/env node
/**
 * Renders a Satori-produced SVG to PNG via Resvg in an isolated process.
 * Resvg can panic on some SVGs; isolating avoids aborting the parent Node process.
 *
 * Usage: node scripts/og-resvg-worker.mjs <in.svg> <out.png> <widthPx> <fontFamily> <fontFilePath>
 */
import fs from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const [, , svgPath, pngPath, widthStr, fontFamily, fontFilePath] = process.argv;
if (!svgPath || !pngPath || !widthStr || !fontFamily || !fontFilePath) {
  console.error(
    'usage: node scripts/og-resvg-worker.mjs <in.svg> <out.png> <widthPx> <fontFamily> <fontFilePath>',
  );
  process.exit(2);
}

const svg = fs.readFileSync(svgPath, 'utf8');
const width = parseInt(widthStr, 10);
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
fs.writeFileSync(pngPath, png);
