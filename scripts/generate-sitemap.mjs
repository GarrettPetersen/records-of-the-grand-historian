#!/usr/bin/env node
/**
 * Write public/sitemap.xml and public/robots.txt from data/manifest.json + existing HTML.
 * Uses SITE_URL (default https://24histories.com). Run after generate-static-pages.js.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const manifestPath = path.join(root, 'data', 'manifest.json');

const origin = (process.env.SITE_URL || 'https://24histories.com').replace(/\/$/, '');

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** @typedef {{ loc: string, lastmod?: string }} UrlEntry */

function main() {
  if (!fs.existsSync(manifestPath)) {
    console.error('generate-sitemap: missing data/manifest.json (run make manifest / generate-manifest.js first).');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const lastmod =
    typeof manifest.generatedAt === 'string' && manifest.generatedAt.length >= 10
      ? manifest.generatedAt.slice(0, 10)
      : undefined;

  /** @type {UrlEntry[]} */
  const urls = [];

  const homePath = path.join(publicDir, 'index.html');
  if (fs.existsSync(homePath)) {
    urls.push({ loc: `${origin}/`, lastmod });
  }

  const staticHtml = [
    'about.html',
    'blog.html',
    'chapters.html',
    'progress.html',
    'privacy.html',
    'reader.html',
  ];
  for (const name of staticHtml) {
    const p = path.join(publicDir, name);
    if (!fs.existsSync(p)) continue;
    urls.push({ loc: `${origin}/${name}`, lastmod });
  }

  const books = manifest.books || {};
  for (const bookId of Object.keys(books)) {
    const hub = path.join(publicDir, 'book', `${bookId}.html`);
    if (fs.existsSync(hub)) {
      urls.push({ loc: `${origin}/book/${bookId}.html`, lastmod });
    }

    const b = books[bookId];
    for (const ch of b.chapters || []) {
      const chNum = String(ch.chapter).padStart(3, '0');
      const htmlPath = path.join(publicDir, bookId, `${chNum}.html`);
      if (!fs.existsSync(htmlPath)) continue;
      urls.push({ loc: `${origin}/${bookId}/${chNum}.html`, lastmod });
    }
  }

  urls.sort((a, b) => (a.loc < b.loc ? -1 : a.loc > b.loc ? 1 : 0));

  const urlset = urls
    .map((u) => {
      const lm = u.lastmod ? `\n    <lastmod>${escapeXml(u.lastmod)}</lastmod>` : '';
      return `  <url>\n    <loc>${escapeXml(u.loc)}</loc>${lm}\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf8');

  const robots = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8');

  console.log(`generate-sitemap: wrote ${path.relative(root, sitemapPath)} (${urls.length} URLs) and public/robots.txt`);
}

main();
