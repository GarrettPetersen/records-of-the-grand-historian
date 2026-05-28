#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BOOK_METADATA,
  CHRONOLOGICAL_ORDER,
  OTHER_WORKS_ORDER
} from './book-metadata.mjs';
import { getBookDesign } from '../public/book-design.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const outDir = path.join(repoRoot, 'public', 'covers', 'books');

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function titleFontSize(title) {
  const len = [...title].length;
  if (len <= 2) return 440;
  if (len <= 3) return 360;
  if (len <= 4) return 290;
  return 230;
}

function pinyinFontSize(pinyin) {
  const len = [...pinyin].length;
  if (len > 22) return 50;
  if (len > 16) return 62;
  if (len > 11) return 74;
  return 84;
}

function wrapTitle(title) {
  const words = String(title).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > 30 && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function titleTextSvg(title) {
  const lines = wrapTitle(title);
  const startY = lines.length === 1 ? 1760 : lines.length === 2 ? 1720 : 1680;
  return lines
    .map((line, index) => `<tspan x="800" y="${startY + index * 78}">${escapeXml(line)}</tspan>`)
    .join('');
}

export function renderBookCover(bookId) {
  const book = BOOK_METADATA[bookId];
  const design = getBookDesign(bookId);
  const title = book.chinese;
  const titleSize = titleFontSize(title);
  const pinyinSize = pinyinFontSize(book.pinyin);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2560" viewBox="0 0 1600 2560" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(book.name)}</title>
  <desc id="desc">Cover design for ${escapeXml(book.name)}, using ${escapeXml(title)} as the central cover art.</desc>
  <rect width="1600" height="2560" fill="#ffffff"/>
  <rect width="1600" height="530" fill="${escapeXml(design.color)}"/>
  <rect y="2030" width="1600" height="530" fill="${escapeXml(design.color)}"/>
  <rect x="96" y="96" width="1408" height="2368" fill="none" stroke="#ffffff" stroke-opacity="0.38" stroke-width="10"/>
  <text x="800" y="290" text-anchor="middle" fill="#ffffff" font-family="Georgia, 'Songti SC', 'Noto Serif CJK SC', serif" font-size="${pinyinSize}" letter-spacing="3">${escapeXml(book.pinyin)}</text>
  <text x="800" y="405" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="54" letter-spacing="1">${escapeXml(design.coverage)}</text>
  <text x="800" y="1275" text-anchor="middle" dominant-baseline="middle" fill="#111111" font-family="'Songti SC', 'Noto Serif CJK SC', 'STSong', serif" font-size="${titleSize}" letter-spacing="18">${escapeXml(title)}</text>
  <line x1="420" y1="1648" x2="1180" y2="1648" stroke="${escapeXml(design.color)}" stroke-width="8"/>
  <text text-anchor="middle" fill="#1c1b18" font-family="Georgia, serif" font-size="72" font-weight="700">${titleTextSvg(book.name)}</text>
  <text x="800" y="1918" text-anchor="middle" fill="#55514a" font-family="Georgia, serif" font-size="48">${escapeXml(book.pinyin)}</text>
  <text x="800" y="2208" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="60">${escapeXml(book.author)}</text>
  <text x="800" y="2305" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="43">Translated by Garrett M. Petersen</text>
</svg>
`;
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const bookIds = [...CHRONOLOGICAL_ORDER, ...OTHER_WORKS_ORDER];
  for (const bookId of bookIds) {
    fs.writeFileSync(path.join(outDir, `${bookId}.svg`), renderBookCover(bookId), 'utf8');
  }
  console.log(`Generated ${bookIds.length} book covers in ${path.relative(repoRoot, outDir)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
