#!/usr/bin/env node
/**
 * Read-only analyzer for pending table-structure repair queue items.
 *
 * It estimates which table diffs are likely layout-only because cleaned
 * upstream text is already represented in the current chapter text.
 */

import fs from 'node:fs';
import path from 'node:path';
import { classifyItem } from './triage-repair-queue.mjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const SOURCE_FIELDS = ['zh', 'content', 'source', 'text'];

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (
    item.appliedAt ||
    status === 'applied' ||
    status === 'denied' ||
    status === 'approved' ||
    status === 'rejected' ||
    decision === 'included' ||
    decision === 'applied' ||
    decision === 'denied' ||
    decision === 'approved' ||
    decision === 'rejected'
  ) return 'done';
  return 'pending';
}

function stripWikiMarkup(text) {
  return String(text || '')
    .replace(/\s+/gu, '')
    .replace(/__(?:FORCE)?TOC__|__NOTOC__|__NOCC__/gu, '')
    .replace(/<!--[\s\S]*?-->/gu, '')
    .replace(/\b(?:class|style|rowspan|colspan|width|height|align|valign|border|cellspacing|cellpadding)="[^"]*"/giu, '')
    .replace(/\b(?:class|style|rowspan|colspan|width|height|align|valign|border|cellspacing|cellpadding)=[^|!\s，。；：、]+/giu, '')
    .replace(/Category:[^\s|<>]+/gu, '')
    .replace(/(?:Author-)?PD-old/gu, '')
    .replace(/[{}|!#=*<>]/gu, '');
}

function compact(text, { dropAsciiDigits = false } = {}) {
  let value = stripWikiMarkup(text).replace(/[^\p{Script=Han}0-9]/gu, '');
  if (dropAsciiDigits) value = value.replace(/[0-9]/gu, '');
  return value;
}

function isSubsequence(needle, haystack) {
  if (!needle) return false;
  let cursor = 0;
  for (const char of haystack) {
    if (char === needle[cursor]) cursor += 1;
    if (cursor >= needle.length) return true;
  }
  return false;
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string') || null;
}

const chapterCache = new Map();

function chapterTexts(file) {
  const abs = path.resolve(file);
  if (chapterCache.has(abs)) return chapterCache.get(abs);
  const chapter = JSON.parse(fs.readFileSync(abs, 'utf8'));
  const parts = [];
  for (const block of chapter.content || []) {
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (const unit of collection) {
        const field = sourceField(unit);
        if (field) parts.push(String(unit[field] || ''));
      }
    }
  }
  const joined = parts.join('');
  const value = {
    compact: compact(joined),
    noAsciiDigits: compact(joined, { dropAsciiDigits: true }),
  };
  chapterCache.set(abs, value);
  return value;
}

function short(text) {
  const value = String(text || '').replace(/\s+/gu, '');
  return value.length > 140 ? `${value.slice(0, 140)}...` : value;
}

const buckets = new Map();
let pendingTables = 0;

function add(bucket, item) {
  if (!buckets.has(bucket)) buckets.set(bucket, []);
  buckets.get(bucket).push(item);
}

for (const entry of fs.readdirSync(QUALITY_DIR).filter((file) => QUEUE_RE.test(file)).sort()) {
  const queue = JSON.parse(fs.readFileSync(path.join(QUALITY_DIR, entry), 'utf8'));
  for (const item of queue.items || []) {
    if (statusOf(item) !== 'pending') continue;
    const classification = classifyItem(item);
    if (classification.className !== 'table-structure-review') continue;
    pendingTables += 1;
    const source = item.sourceRange?.text || '';
    const local = item.localRange?.text || '';
    const sourceKey = compact(source);
    const localKey = compact(local);
    const sourceNoDigits = compact(source, { dropAsciiDigits: true });
    const localNoDigits = compact(local, { dropAsciiDigits: true });
    const chapter = chapterTexts(item.file);

    if (sourceKey && sourceKey === localKey) add('clean-source-equals-local', item);
    else if (sourceNoDigits && sourceNoDigits === localNoDigits) add('clean-source-equals-local-after-dropping-ascii-digits', item);
    else if (sourceKey && chapter.compact.includes(sourceKey)) add('clean-source-contained-in-chapter', item);
    else if (sourceNoDigits && chapter.noAsciiDigits.includes(sourceNoDigits)) add('clean-source-contained-in-chapter-after-dropping-ascii-digits', item);
    else if (sourceNoDigits && isSubsequence(sourceNoDigits, chapter.noAsciiDigits)) add('clean-source-subsequence-of-chapter-after-dropping-ascii-digits', item);
    else add('needs-review', item);
  }
}

function counts(records, keyFn) {
  const map = new Map();
  for (const item of records) {
    const key = keyFn(item);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Object.fromEntries([...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 12));
}

const summary = [...buckets.entries()]
  .map(([bucket, items]) => ({
    bucket,
    count: items.length,
    byBook: counts(items, (item) => item.book),
    samples: items.slice(0, 10).map((item) => ({
      id: item.id,
      chapter: `${item.book}/${item.chapter}`,
      type: item.type || 'unknown',
      severity: item.severity ?? null,
      source: short(item.sourceRange?.text || ''),
      local: short(item.localRange?.text || ''),
    })),
  }))
  .sort((a, b) => b.count - a.count || a.bucket.localeCompare(b.bucket));

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  pendingTables,
  buckets: summary,
}, null, 2));
