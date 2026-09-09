#!/usr/bin/env node

import assert from 'node:assert/strict';
import {
  EBOOK_TARGET_XHTML_FILES,
  KDP_MAX_HTML_FILES,
  ebookChapterHref,
  ebookSentenceAnchor,
  ebookSentenceHref,
  planEbookContentDocuments,
} from './lib/ebook-content-layout.mjs';

function chapters(count) {
  return Array.from({ length: count }, (_, index) => String(index + 1).padStart(3, '0'));
}

const ordinary = planEbookContentDocuments(chapters(130), {
  hasAbout: true,
  peopleActive: true,
  peopleShards: 10,
});
assert.equal(ordinary.groupSize, 1);
assert.equal(ordinary.documents.length, 130);
assert.equal(ordinary.xhtmlFiles, 145);
assert.equal(ebookChapterHref(ordinary, '017', 'text/'), 'text/chapter-017.xhtml#chapter-017');

const mingshi = planEbookContentDocuments(chapters(332), {
  hasAbout: true,
  peopleActive: true,
  peopleShards: 9,
});
assert.equal(mingshi.groupSize, 2);
assert.equal(mingshi.documents.length, 166);
assert.equal(mingshi.xhtmlFiles, 180);
assert.equal(ebookChapterHref(mingshi, '001', 'text/'), 'text/chapters-001-002.xhtml#chapter-001');
assert.equal(ebookChapterHref(mingshi, '002', 'text/'), 'text/chapters-001-002.xhtml#chapter-002');

const qingshigao = planEbookContentDocuments(chapters(536), {
  hasAbout: true,
  peopleActive: true,
  peopleShards: 30,
});
assert.equal(qingshigao.groupSize, 3);
assert.ok(qingshigao.xhtmlFiles <= EBOOK_TARGET_XHTML_FILES);
assert.ok(qingshigao.xhtmlFiles < KDP_MAX_HTML_FILES + 1);

assert.notEqual(
  ebookSentenceAnchor('001', 'en', 's0001'),
  ebookSentenceAnchor('002', 'en', 's0001'),
);
assert.equal(
  ebookSentenceHref(mingshi, '002', 'en', 's0001', 'text/'),
  'text/chapters-001-002.xhtml#chapter-002-en-s0001',
);
assert.throws(
  () => planEbookContentDocuments(chapters(1), { peopleActive: true, peopleShards: 300 }),
  /Invalid e-book XHTML target|leaving no room/u,
);

console.log('E-book content-layout self-test passed.');
