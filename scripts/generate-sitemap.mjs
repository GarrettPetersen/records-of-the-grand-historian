#!/usr/bin/env node
/**
 * Write public/sitemap.xml and public/robots.txt from data/manifest.json + existing HTML.
 * Uses SITE_URL (default https://24histories.com). Run after generate-static-pages.js.
 */
import fs from 'node:fs';
import { REPO_ROOT } from './lib/people-content.mjs';
import { assertPeopleSiteCertificate } from './lib/people-certified-site.mjs';
import path from 'node:path';
import { canonicalUrlForHtmlFile } from './lib/site-urls.mjs';

const root = REPO_ROOT;
const publicDir = path.join(root, 'public');
const manifestPath = path.join(root, 'data', 'manifest.json');
const peopleStatusPath = path.join(publicDir, 'data', 'people', 'site-status.json');

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
    urls.push({ loc: canonicalUrlForHtmlFile(origin, name), lastmod });
  }

  const books = manifest.books || {};
  for (const bookId of Object.keys(books)) {
    const hub = path.join(publicDir, 'book', `${bookId}.html`);
    if (fs.existsSync(hub)) {
      urls.push({ loc: canonicalUrlForHtmlFile(origin, `book/${bookId}.html`), lastmod });
    }

    const b = books[bookId];
    for (const ch of b.chapters || []) {
      const chNum = String(ch.chapter).padStart(3, '0');
      const htmlPath = path.join(publicDir, bookId, `${chNum}.html`);
      if (!fs.existsSync(htmlPath)) continue;
      urls.push({ loc: canonicalUrlForHtmlFile(origin, `${bookId}/${chNum}.html`), lastmod });
    }
  }

  if (fs.existsSync(peopleStatusPath)) {
    const status = JSON.parse(fs.readFileSync(peopleStatusPath, 'utf8'));
    if (status.published) {
      if (status.preview || status.publication?.mode !== 'certified-scope') {
        throw new Error('Published people sitemap requires a certified non-preview scope');
      }
      const certified = assertPeopleSiteCertificate(status.certificate);
      if (certified && (status.people !== certified.publication.publishedPeople ||
          status.publication.publishedChapters !== certified.publication.publishedChapters || status.preview)) {
        throw new Error('Published people status differs from its current certificate');
      }
      const expectedSlugs = new Set(certified.catalog.people.map(person => person.slug));
      const seenSlugs = new Set();
      const peopleDir = path.join(publicDir, 'people');
      const indexPath = path.join(peopleDir, 'index.html');
      if (!fs.existsSync(indexPath)) {
        throw new Error('Published people-site status is inconsistent with generated people pages');
      }
      const peopleLastmod = typeof status.generatedAt === 'string' ? status.generatedAt.slice(0, 10) : lastmod;
      urls.push({ loc: `${origin}/people/`, lastmod: peopleLastmod });
      const searchDir = path.join(publicDir, 'data', 'people', 'search');
      const searchIndex = JSON.parse(fs.readFileSync(path.join(searchDir, 'index.json'), 'utf8'));
      let peopleFound = 0;
      for (const part of searchIndex.parts ?? []) {
        const data = JSON.parse(fs.readFileSync(path.join(searchDir, part.file), 'utf8'));
        for (const entry of data.entries ?? []) {
          if (seenSlugs.has(entry[0]) || (expectedSlugs && !expectedSlugs.has(entry[0]))) {
            throw new Error('People sitemap search contains duplicate or uncertified person');
          }
          seenSlugs.add(entry[0]);
          urls.push({ loc: `${origin}/people/${encodeURIComponent(entry[0])}.html`, lastmod: peopleLastmod });
          peopleFound += 1;
        }
      }
      if (peopleFound !== status.people) {
        throw new Error(`People sitemap expected ${status.people} person URLs, found ${peopleFound}`);
      }
    }
  }

  urls.sort((a, b) => (a.loc < b.loc ? -1 : a.loc > b.loc ? 1 : 0));

  const renderUrlset = (entries) => entries
    .map((u) => {
      const lm = u.lastmod ? `\n    <lastmod>${escapeXml(u.lastmod)}</lastmod>` : '';
      return `  <url>\n    <loc>${escapeXml(u.loc)}</loc>${lm}\n  </url>`;
    })
    .join('\n');
  const sitemapDir = path.join(publicDir, 'sitemaps');
  fs.rmSync(sitemapDir, { recursive: true, force: true });
  let xml;
  if (urls.length <= 45_000) {
    xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${renderUrlset(urls)}
</urlset>
`;
  } else {
    fs.mkdirSync(sitemapDir, { recursive: true });
    const files = [];
    for (let offset = 0; offset < urls.length; offset += 45_000) {
      const file = `sitemap-${String(files.length + 1).padStart(3, '0')}.xml`;
      const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${renderUrlset(urls.slice(offset, offset + 45_000))}\n</urlset>\n`;
      fs.writeFileSync(path.join(sitemapDir, file), body, 'utf8');
      files.push(file);
    }
    xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${files.map((file) => `  <sitemap>\n    <loc>${escapeXml(`${origin}/sitemaps/${file}`)}</loc>\n  </sitemap>`).join('\n')}\n</sitemapindex>\n`;
  }

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
