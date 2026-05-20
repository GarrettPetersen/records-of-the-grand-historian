#!/usr/bin/env node
/**
 * Scan chapter JSON for Western/ASCII characters in Chinese-facing text.
 *
 * This is meant to catch scrape noise such as stray HTML tags, roman letters,
 * or other non-Chinese fragments in stored source text. It ignores translation
 * fields and URL metadata.
 *
 * Usage:
 *   node scripts/scan-western-chars.mjs
 *   node scripts/scan-western-chars.mjs data/zizhitongjian
 *   node scripts/scan-western-chars.mjs data/zizhitongjian/052.json
 */

import fs from 'node:fs';
import path from 'node:path';

const WESTERN_RE = /[A-Za-z]/;
const BR_TAG_RE = /<br\s*\/?>/i;
const HTML_TAG_RE = /<\/?[A-Za-z][^>]*>/;
const ENTITY_RE = /&[A-Za-z]+;?/;

function isChineseFacingPath(pathStr) {
  if (!pathStr) return false;
  if (/\b(translations?|literal|idiomatic|translator|note|notes|commentary|source|url|wikisourceUrl|ctextUrl)\b/.test(pathStr)) {
    return false;
  }
  if (
    pathStr === 'meta.title.zh' ||
    pathStr === 'meta.title.raw' ||
    pathStr === 'meta.subtitle.zh' ||
    pathStr === 'meta.subtitle.raw' ||
    pathStr === 'meta.rawTitle'
  ) {
    return true;
  }
  if (pathStr.includes('.translations.') || pathStr.includes('.translation') || pathStr.includes('.literal') || pathStr.includes('.idiomatic')) {
    return false;
  }
  return /(^|\.)(content|sentences|cells)(\.\d+)*\.(zh|content|text|title|name)$/i.test(pathStr);
}

function excerpt(text, index, width = 24) {
  const start = Math.max(0, index - width);
  const end = Math.min(text.length, index + width);
  return text.slice(start, end).replace(/\s+/g, ' ').trim();
}

function classify(text) {
  if (BR_TAG_RE.test(text)) return 'br-tag';
  if (HTML_TAG_RE.test(text)) return 'html-tag';
  if (ENTITY_RE.test(text)) return 'html-entity';
  if (WESTERN_RE.test(text)) return 'latin-letter';
  return null;
}

function* walk(value, trail = []) {
  if (typeof value === 'string') {
    if (isChineseFacingPath(trail.join('.'))) {
      const kind = classify(value);
      if (kind) yield { path: trail.join('.'), kind, value };
    }
    return;
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      yield* walk(value[i], trail.concat(String(i)));
    }
    return;
  }

  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    yield* walk(child, trail.concat(key));
  }
}

function scanFile(filePath) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }

  if (!data?.meta?.book) return null;

  const hits = [...walk(data)];
  if (hits.length === 0) return null;

  return {
    book: data.meta.book,
    chapter: data.meta.chapter,
    rel: path.relative(process.cwd(), filePath),
    hits,
  };
}

function expandInputs(inputs) {
  const files = [];
  const enqueue = (entry) => {
    if (!fs.existsSync(entry)) return;
    const st = fs.statSync(entry);
    if (st.isDirectory()) {
      for (const child of fs.readdirSync(entry)) {
        enqueue(path.join(entry, child));
      }
    } else if (entry.endsWith('.json')) {
      files.push(entry);
    }
  };
  for (const arg of inputs) enqueue(arg);
  return [...new Set(files)].sort();
}

const args = process.argv.slice(2);
const inputs = args.length ? args : [path.join(process.cwd(), 'data')];
const rows = [];

for (const fp of expandInputs(inputs)) {
  const row = scanFile(fp);
  if (row) rows.push(row);
}

rows.sort((a, b) => a.book.localeCompare(b.book) || String(a.chapter).localeCompare(String(b.chapter), undefined, { numeric: true }));

console.log(`Chapters with western characters in Chinese-facing text: ${rows.length}`);
console.log('');
console.log('book\tchapter\tcount\tfile');
for (const row of rows) {
  console.log(`${row.book}\t${row.chapter}\t${row.hits.length}\t${row.rel}`);
  for (const hit of row.hits.slice(0, 12)) {
    const idx = hit.value.search(/[A-Za-z]/);
    const sample = idx >= 0 ? excerpt(hit.value, idx) : hit.value.slice(0, 48);
    console.log(`  ${hit.kind}\t${hit.path}\t${JSON.stringify(sample)}`);
  }
  if (row.hits.length > 12) {
    console.log(`  ... ${row.hits.length - 12} more`);
  }
}
