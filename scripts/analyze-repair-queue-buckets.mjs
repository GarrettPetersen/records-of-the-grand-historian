#!/usr/bin/env node
/**
 * Summarize pending source-repair queue items by coarse textual pattern.
 *
 * This is a read-only planning helper. It intentionally does not mark queue
 * items or edit chapter files.
 */

import fs from 'node:fs';
import path from 'node:path';
import { classifyItem, variantText } from './triage-repair-queue.mjs';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;

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

function stripWhitespace(text) {
  return String(text || '').replace(/\s+/gu, '');
}

function stripPunctuation(text) {
  return stripWhitespace(text).replace(/[^\p{Script=Han}0-9]/gu, '');
}

function stripWikiMarkup(text) {
  return stripWhitespace(text)
    .replace(/__(?:FORCE)?TOC__|__NOTOC__|__NOCC__/gu, '')
    .replace(/<!--[\s\S]*?-->/gu, '')
    .replace(/\b(?:class|style|rowspan|colspan|width|height|align|valign|border|cellspacing|cellpadding)="[^"]*"/giu, '')
    .replace(/\b(?:class|style|rowspan|colspan|width|height|align|valign|border|cellspacing|cellpadding)=[^|!\s，。；：、]+/giu, '')
    .replace(/Category:[^\s|<>]+/gu, '')
    .replace(/(?:Author-)?PD-old/gu, '')
    .replace(/[{}|!#=*<>]/gu, '');
}

function variant(text) {
  return Array.from(stripWhitespace(text)).map((char) => variantText(char)).join('');
}

function variantNoPunctuation(text) {
  return Array.from(stripPunctuation(text)).map((char) => variantText(char)).join('');
}

function shortText(text) {
  const compact = stripWhitespace(text);
  return compact.length > 140 ? `${compact.slice(0, 140)}...` : compact;
}

function loadPending() {
  const records = [];
  for (const entry of fs.readdirSync(QUALITY_DIR).filter((file) => QUEUE_RE.test(file)).sort()) {
    const queueFile = path.join(QUALITY_DIR, entry);
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    for (let index = 0; index < (queue.items || []).length; index += 1) {
      const item = queue.items[index];
      if (statusOf(item) !== 'pending') continue;
      records.push({
        queueFile,
        index,
        item,
        classification: classifyItem(item),
      });
    }
  }
  return records;
}

function bucketFor(item) {
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  const sourceCompact = stripWhitespace(source);
  const localCompact = stripWhitespace(local);
  const sourceWiki = stripWikiMarkup(source);
  const localWiki = stripWikiMarkup(local);

  if (!sourceCompact && localCompact) return 'local-only';
  if (sourceCompact && !localCompact) return 'source-only';
  if (sourceCompact === localCompact) return 'exact-after-whitespace';
  if (stripPunctuation(source) === stripPunctuation(local)) return 'punctuation-only';
  if (variant(source) === variant(local)) return 'variant-only-with-punctuation';
  if (variantNoPunctuation(source) === variantNoPunctuation(local)) return 'variant-and-punctuation-only';
  if (stripPunctuation(sourceWiki) === stripPunctuation(localWiki)) return 'wiki-markup-and-punctuation-only';
  if (variantNoPunctuation(sourceWiki) === variantNoPunctuation(localWiki)) return 'wiki-markup-variant-punctuation-only';
  if (stripPunctuation(local) && stripPunctuation(source).includes(stripPunctuation(local))) return 'source-contains-local';
  if (stripPunctuation(source) && stripPunctuation(local).includes(stripPunctuation(source))) return 'local-contains-source';
  return 'hard';
}

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function topEntries(map, limit) {
  return Object.fromEntries([...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit));
}

function summarize(records) {
  const buckets = new Map();
  for (const record of records) {
    const bucket = bucketFor(record.item);
    if (!buckets.has(bucket)) buckets.set(bucket, []);
    buckets.get(bucket).push(record);
  }

  return [...buckets.entries()]
    .map(([bucket, items]) => {
      const byClass = new Map();
      const byBook = new Map();
      const byTypeSeverity = new Map();
      for (const record of items) {
        increment(byClass, record.classification.className);
        increment(byBook, record.item.book);
        increment(byTypeSeverity, `${record.item.type || 'unknown'}|sev${record.item.severity ?? 'unknown'}`);
      }
      return {
        bucket,
        count: items.length,
        byClass: topEntries(byClass, 10),
        byBook: topEntries(byBook, 10),
        byTypeSeverity: topEntries(byTypeSeverity, 10),
        samples: items.slice(0, 10).map((record) => ({
          id: record.item.id,
          chapter: `${record.item.book}/${record.item.chapter}`,
          className: record.classification.className,
          type: record.item.type || 'unknown',
          severity: record.item.severity ?? null,
          source: shortText(record.item.sourceRange?.text || ''),
          local: shortText(record.item.localRange?.text || ''),
        })),
      };
    })
    .sort((a, b) => b.count - a.count || a.bucket.localeCompare(b.bucket));
}

const records = loadPending();
console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  pending: records.length,
  buckets: summarize(records),
}, null, 2));
