#!/usr/bin/env node

import assert from 'node:assert/strict';
import {
  inferChapterTableHeaders,
  isSemanticTableHeader,
  tableCellRepeatsLabel,
} from './lib/table-structure.mjs';

const chapter = (book, number) => ({ meta: { book, chapter: number } });
const header = (...labels) => ({
  type: 'table_header',
  cells: labels.map((content) => ({ content })),
});

const shiji022 = chapter('shiji', '022');
assert.equal(isSemanticTableHeader(header(
  '公元前',
  '紀年',
  '大事紀。',
  '相位。',
  '將位。',
  '御史大夫位。',
), shiji022), true);
assert.deepEqual(inferChapterTableHeaders(shiji022, Array(6).fill('')), [
  'BCE',
  'Regnal years',
  'Major events',
  'Chancellor',
  'General',
  'Imperial Secretary',
]);

assert.equal(isSemanticTableHeader(header(
  '六院夷離菫房帖剌。',
  '夷離菫罨古只。',
), chapter('liaoshi', '066')), false);

const shiji017Headers = inferChapterTableHeaders(chapter('shiji', '017'), Array(28).fill(''));
assert.equal(shiji017Headers[3], 'Lu');
assert.equal(shiji017Headers[24], 'Lü');
assert.equal(tableCellRepeatsLabel('Chu', 'Chu.'), true);

console.log('table structure self-test: ok');
