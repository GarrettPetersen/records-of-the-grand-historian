#!/usr/bin/env node
/**
 * For each book in data/manifest.json whose chapter 001 meta.url is on
 * chinesenotes.com, fetch chapter (chapterCount + 1) and decide whether a page
 * still exists (including 序 / 附录 / 跋 — those count as content to ingest).
 *
 * Chinese Notes sometimes returns HTTP 200 for URLs that are not real pages.
 * We mirror scrape.js by inspecting main.main-content: vocabulary span density.
 *
 * Usage: node scripts/check-chinesenotes-n-plus-one.mjs
 *
 * Exit 0: every probed N+1 URL is absent (404, tiny body, or no chapter text).
 * Exit 1: at least one N+1 URL still has substantive content → add JSON for that index.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const UA =
  'Mozilla/5.0 (compatible; records-of-the-grand-historian/1.0; +https://github.com/GarrettPetersen/records-of-the-grand-historian)';

function cnChapterUrl(bookId, chapterNum) {
  const ch = String(chapterNum).padStart(3, '0');
  return `https://chinesenotes.com/${bookId}/${bookId}${ch}.html`;
}

function classifyPage(status, html) {
  if (status === 404) {
    return { kind: 'absent', detail: 'HTTP 404 (no object at this path)' };
  }

  if (!html || html.length < 8000) {
    return { kind: 'absent', detail: `HTTP ${status}, short body (${html?.length ?? 0} bytes)` };
  }

  const $ = load(html, { decodeEntities: true });
  const $main = $('main.main-content');
  const voc = $main.find('span.vocabulary').length;
  const h3 = ($main.find('h3').first().text() || $('h3').first().text() || '').trim();

  if (voc < 40) {
    return {
      kind: 'absent',
      detail: `HTTP ${status}, vocabulary spans in main=${voc} — no chapter-like body`
    };
  }

  return {
    kind: 'present',
    detail: `HTTP ${status}, ${voc} vocab spans — Chinese Notes still has a page at this file index`
  };
}

async function fetchPage(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(60000)
  });
  const html = await res.text();
  return { status: res.status, html };
}

function readChapterUrl(bookId) {
  const p = path.join(ROOT, 'data', bookId, '001.json');
  if (!fs.existsSync(p)) return null;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  return j?.meta?.url ?? null;
}

async function main() {
  const manifestPath = path.join(ROOT, 'data', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const books = manifest.books ?? {};
  const rows = [];
  let presentHits = 0;

  for (const bookId of Object.keys(books).sort()) {
    const n = books[bookId].chapterCount;
    const firstUrl = readChapterUrl(bookId);

    if (!firstUrl) {
      rows.push({ bookId, n, result: 'SKIP', detail: 'no data/.../001.json' });
      continue;
    }

    if (!firstUrl.includes('chinesenotes.com')) {
      rows.push({ bookId, n, result: 'SKIP', detail: 'not Chinese Notes (meta.url elsewhere)' });
      continue;
    }

    const next = n + 1;
    const url = cnChapterUrl(bookId, next);
    let status;
    let html;
    try {
      ({ status, html } = await fetchPage(url));
    } catch (e) {
      rows.push({ bookId, n, next, url, result: 'ERROR', detail: String(e?.message ?? e) });
      presentHits += 1;
      continue;
    }

    const { kind, detail } = classifyPage(status, html);
    const $ = load(html, { decodeEntities: true });
    const $main = $('main.main-content');
    const h3 = ($main.find('h3').first().text() || $('h3').first().text() || '').trim();

    if (kind === 'present') presentHits += 1;

    rows.push({
      bookId,
      n,
      next,
      url,
      result: kind.toUpperCase(),
      detail,
      h3: h3.slice(0, 120)
    });

    await new Promise((r) => setTimeout(r, 150));
  }

  for (const r of rows) {
    if (r.result === 'SKIP') {
      console.log(`${r.bookId.padEnd(14)} N=${r.n}  SKIP  ${r.detail}`);
    } else if (r.result === 'ERROR') {
      console.log(`${r.bookId.padEnd(14)} N=${r.n}  ERROR ${r.detail}`);
      console.log(`  ${r.url}`);
    } else {
      console.log(
        `${r.bookId.padEnd(14)} N=${r.n}  probe ${String(r.next).padStart(3, '0')}  ${r.result}`
      );
      console.log(`  ${r.url}`);
      console.log(`  ${r.detail}`);
      if (r.h3) console.log(`  h3: ${r.h3}`);
      console.log('');
    }
  }

  console.log('---');
  console.log('ABSENT = no further chapter file at N+1; PRESENT = site still has HTML there (scrape it).');
  console.log('');

  if (presentHits === 0) {
    console.log('OK: no missing Chinese Notes file index after current manifest chapter counts.');
    process.exit(0);
  }
  console.log(`Note: ${presentHits} book(s) still have content at N+1 — ingest those chapters.`);
  process.exit(1);
}

main();
