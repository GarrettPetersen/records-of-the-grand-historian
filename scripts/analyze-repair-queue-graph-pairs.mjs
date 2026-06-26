#!/usr/bin/env node
/**
 * Group pending source-correspondence items by equal-length graph differences.
 *
 * Read-only planning helper for finding safe variant lanes not yet covered by
 * the main triage normalizer.
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

function compact(text) {
  return String(text || '').replace(/\s+/gu, '').replace(/[^\p{Script=Han}0-9]/gu, '');
}

function short(text) {
  const value = String(text || '').replace(/\s+/gu, '');
  return value.length > 120 ? `${value.slice(0, 120)}...` : value;
}

function pairKey(source, local) {
  const sourceChars = Array.from(compact(source));
  const localChars = Array.from(compact(local));
  if (sourceChars.length === 0 || sourceChars.length !== localChars.length) return null;
  const pairs = [];
  for (let i = 0; i < sourceChars.length; i += 1) {
    const sourceChar = sourceChars[i];
    const localChar = localChars[i];
    if (sourceChar === localChar || variantText(sourceChar) === variantText(localChar)) continue;
    pairs.push(`${sourceChar}⇄${localChar}`);
  }
  if (pairs.length === 0) return null;
  return [...new Set(pairs)].sort().join('|');
}

const groups = new Map();
let sameLength = 0;
let pending = 0;

for (const entry of fs.readdirSync(QUALITY_DIR).filter((file) => QUEUE_RE.test(file)).sort()) {
  const queueFile = path.join(QUALITY_DIR, entry);
  const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
  for (const item of queue.items || []) {
    if (statusOf(item) !== 'pending') continue;
    pending += 1;
    const source = item.sourceRange?.text || '';
    const local = item.localRange?.text || '';
    if (Array.from(compact(source)).length !== Array.from(compact(local)).length) continue;
    sameLength += 1;
    const key = pairKey(source, local);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ item, classification: classifyItem(item) });
  }
}

function counts(records, keyFn) {
  const map = new Map();
  for (const record of records) {
    const key = keyFn(record);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Object.fromEntries([...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 10));
}

const result = [...groups.entries()]
  .map(([key, records]) => ({
    key,
    count: records.length,
    byClass: counts(records, (record) => record.classification.className),
    byBook: counts(records, (record) => record.item.book),
    samples: records.slice(0, 8).map((record) => ({
      id: record.item.id,
      chapter: `${record.item.book}/${record.item.chapter}`,
      className: record.classification.className,
      type: record.item.type || 'unknown',
      severity: record.item.severity ?? null,
      source: short(record.item.sourceRange?.text || ''),
      local: short(record.item.localRange?.text || ''),
    })),
  }))
  .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  pending,
  sameLength,
  groupedItems: result.reduce((sum, group) => sum + group.count, 0),
  groups: result.slice(0, 80),
}, null, 2));
