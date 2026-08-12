#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  canonicalPathForHtmlFile,
  canonicalUrlForHtmlFile,
} from './lib/site-urls.mjs';

assert.equal(canonicalPathForHtmlFile('index.html'), '/');
assert.equal(canonicalPathForHtmlFile('about.html'), '/about');
assert.equal(canonicalPathForHtmlFile('book/shiji.html'), '/book/shiji');
assert.equal(canonicalPathForHtmlFile('/shiji/001.html'), '/shiji/001');
assert.equal(canonicalPathForHtmlFile('people/index.html'), '/people/');
assert.equal(
  canonicalUrlForHtmlFile('https://24histories.com/', 'shiji/001.html'),
  'https://24histories.com/shiji/001',
);
assert.throws(() => canonicalPathForHtmlFile('shiji/001'));
assert.throws(() => canonicalUrlForHtmlFile('24histories.com', 'shiji/001.html'));

console.log('site URL tests passed');
